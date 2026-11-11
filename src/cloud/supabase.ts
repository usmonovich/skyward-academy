// Cloud accounts and cross-device sync (Supabase free tier).
// Only the public project URL and anon key are used in the browser; row-level security limits every request
// to the signed-in user's own row. Passwords go straight to Supabase Auth and are never stored by this app.
// If the two VITE_SUPABASE_* values are not set at build time, cloud features are switched off and the app
// works exactly as before with on-device profiles.
import { useSyncExternalStore } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Progress } from '../types';
import { actions, getProgress, subscribeProgress } from '../store/progress';
import { mergeProgress, sameProgress } from './merge';

const env = import.meta.env as unknown as Record<string, string | undefined>;
const PROJECT_URL = env.VITE_SUPABASE_URL;
const ANON_KEY = env.VITE_SUPABASE_ANON_KEY;
export const cloudConfigured = Boolean(PROJECT_URL && ANON_KEY);

// PKCE puts the sign-in code in the query string, so it does not collide with the app's hash-based routing.
// The library is downloaded only when cloud sync is configured, so an unconfigured build stays small.
let client: SupabaseClient | null = null;
const ready: Promise<void> = cloudConfigured
  ? import('@supabase/supabase-js').then((m) => { client = m.createClient(PROJECT_URL!, ANON_KEY!, { auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true } }); })
  : Promise.resolve();

export interface CloudState {
  email: string | null;
  status: 'off' | 'signed-out' | 'syncing' | 'synced' | 'error';
  message: string;
  lastSync: number | null;
  /** True after the user opens a password-recovery link: the UI asks for a new password. */
  recovery: boolean;
}
let state: CloudState = { email: null, status: cloudConfigured ? 'signed-out' : 'off', message: '', lastSync: null, recovery: false };
const listeners = new Set<() => void>();
const set = (patch: Partial<CloudState>) => { state = { ...state, ...patch }; listeners.forEach((l) => l()); };
export const useCloud = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => state);

const UID_KEY = 'skyward.cloud.uid';
let userId: string | null = null;
let dirty = false; // local progress changed since the last successful sync
let applying = false; // true while a merged copy is being written into the local store
let busy = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const redirect = () => window.location.origin + window.location.pathname;
const friendly = (e: unknown) => (e instanceof Error ? e.message : typeof e === 'object' && e && 'message' in e ? String((e as { message: unknown }).message) : 'Unknown error');

/** Pulls the cloud copy, merges it with this device's copy, and uploads the result if the cloud is behind. */
export async function syncNow(): Promise<void> {
  if (!client || !userId || busy) return;
  busy = true;
  set({ status: 'syncing', message: '' });
  try {
    const { data: row, error } = await client.from('progress').select('data').eq('user_id', userId).maybeSingle();
    if (error) throw error;
    const local = getProgress();
    const remote = (row?.data as Progress | undefined) ?? null;
    let merged = local;
    if (remote) {
      // A different account was last used on this device: take that account's cloud copy rather than mixing two people's progress.
      const lastUid = localStorage.getItem(UID_KEY);
      merged = lastUid && lastUid !== userId ? { ...remote, id: local.id, guest: local.guest } : mergeProgress(local, remote, dirty ? 'local' : 'remote');
      if (!sameProgress(merged, local)) { applying = true; actions.replace(merged); applying = false; }
    }
    if (!remote || !sameProgress(merged, remote)) {
      const { error: writeError } = await client.from('progress').upsert({ user_id: userId, data: merged, updated_at: new Date().toISOString() });
      if (writeError) throw writeError;
    }
    localStorage.setItem(UID_KEY, userId);
    dirty = false;
    set({ status: 'synced', lastSync: Date.now() });
  } catch (e) {
    set({ status: 'error', message: `Sync failed: ${friendly(e)}. Your progress is still saved on this device.` });
  } finally {
    busy = false;
  }
}

/** Call once at start-up. Does nothing if cloud sync is not configured. */
export function initCloud(): void {
  if (!cloudConfigured) return;
  void ready.then(start).catch(() => set({ status: 'error', message: 'The sign-in service could not be loaded. Check your connection and reload.' }));
}

function start(): void {
  if (!client) return;
  client.auth.onAuthStateChange((event, session) => {
    userId = session?.user.id ?? null;
    set({ email: session?.user.email ?? null, status: session ? state.status === 'synced' ? 'synced' : 'syncing' : 'signed-out', recovery: state.recovery || event === 'PASSWORD_RECOVERY' });
    if (session && event !== 'SIGNED_OUT') {
      if (event === 'SIGNED_IN' && getProgress().xp > 0) dirty = true; // guest progress on this device is merged into the account
      setTimeout(() => void syncNow(), 0); // never call Supabase from inside this callback
    }
  });
  subscribeProgress(() => {
    if (applying || !userId) return;
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(() => void syncNow(), 2500);
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') void syncNow(); });
  window.addEventListener('online', () => void syncNow());
  setInterval(() => { if (document.visibilityState === 'visible') void syncNow(); }, 60_000);
}

/* Each function resolves to null on success or a message to show the user. */
export async function signUp(email: string, password: string): Promise<string | null> {
  await ready.catch(() => {});
  if (!client) return 'Cloud accounts are not configured.';
  const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo: redirect() } });
  if (error) return error.message;
  return data.session ? null : 'Almost done: open the confirmation link we sent to your email, then sign in.';
}
export async function signIn(email: string, password: string): Promise<string | null> {
  await ready.catch(() => {});
  if (!client) return 'Cloud accounts are not configured.';
  const { error } = await client.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}
export async function signOut(): Promise<void> {
  clearTimeout(timer);
  await syncNow();
  await client?.auth.signOut();
}
export async function sendPasswordReset(email: string): Promise<string | null> {
  await ready.catch(() => {});
  if (!client) return 'Cloud accounts are not configured.';
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: redirect() });
  return error ? error.message : null;
}
export async function setNewPassword(password: string): Promise<string | null> {
  if (!client) return 'Cloud accounts are not configured.';
  const { error } = await client.auth.updateUser({ password });
  if (!error) set({ recovery: false });
  return error ? error.message : null;
}
/** Removes this account's progress row from the cloud. The on-device copy is not touched. */
export async function deleteCloudData(): Promise<string | null> {
  if (!client || !userId) return 'You are not signed in.';
  const { error } = await client.from('progress').delete().eq('user_id', userId);
  return error ? error.message : null;
}
