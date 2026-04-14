import { supabase } from './supabase.js';

// ─── SESSION GUARD ───────────────────────────────────────────────
// Call this at the top of any protected page
// If no session → redirect to login
export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/auth/login.html';
  }
  return session;
}

// Call this on auth pages (login/signup)
// If already logged in → redirect to dashboard
export async function redirectIfLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.href = '/dashboard/index.html';
  }
}

// ─── SIGNUP ──────────────────────────────────────────────────────
export async function signUp(email, password, businessName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { business_name: businessName }
    }
  });
  return { data, error };
}

// ─── LOGIN ───────────────────────────────────────────────────────
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
}

// ─── LOGOUT ──────────────────────────────────────────────────────
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/auth/login.html';
}
