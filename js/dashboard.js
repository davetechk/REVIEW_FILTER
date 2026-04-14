import { supabase } from '/js/supabase.js';

// ── RENDER SIDEBAR ────────────────────────────────────────────
export function renderSidebar(activePage) {
  const nav = [
    { id: 'index',        icon: '📊', label: 'Dashboard',    href: '/dashboard/index.html' },
    { id: 'send-invite',  icon: '📨', label: 'Send Invite',  href: '/dashboard/send-invite.html' },
    { id: 'complaints',   icon: '💬', label: 'Complaints',   href: '/dashboard/complaints.html' },
    { id: 'settings',     icon: '⚙️',  label: 'Settings',    href: '/dashboard/settings.html' },
  ];

  const navHTML = nav.map(item => `
    <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}" id="nav-${item.id}">
      <span class="nav-icon">${item.icon}</span>
      ${item.label}
      ${item.id === 'complaints' ? '<span class="nav-badge" id="unread-badge" style="display:none">0</span>' : ''}
    </a>
  `).join('');

  const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <img src="/assets/img/logo.png" alt="ReviewFilter Global">
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Menu</div>
        ${navHTML}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user" id="sidebar-user">
          <div class="user-avatar" id="user-avatar">?</div>
          <div class="user-info">
            <div class="user-name" id="user-biz-name">Loading…</div>
            <div class="user-plan" id="user-plan">Starter plan</div>
          </div>
          <button class="btn-logout" id="btn-logout" title="Sign out">↩</button>
        </div>
      </div>
    </aside>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>
  `;

  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // load user info
  loadUserInfo();

  // logout
  document.getElementById('btn-logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth/login.html';
  });

  // mobile toggle
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebar-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('visible');
    });
  }

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });

  // unread complaints badge
  loadUnreadCount();
}

// ── LOAD USER INFO ────────────────────────────────────────────
async function loadUserInfo() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('business_name, plan')
    .eq('user_id', session.user.id)
    .single();

  if (profile) {
    const nameEl  = document.getElementById('user-biz-name');
    const planEl  = document.getElementById('user-plan');
    const avatarEl = document.getElementById('user-avatar');

    if (nameEl)   nameEl.textContent  = profile.business_name;
    if (planEl)   planEl.textContent  = `${profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)} plan`;
    if (avatarEl) avatarEl.textContent = profile.business_name.charAt(0).toUpperCase();
  }
}

// ── UNREAD COMPLAINTS BADGE ───────────────────────────────────
async function loadUnreadCount() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile) return;

  const { count } = await supabase
    .from('feedback_private')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', profile.id)
    .eq('is_read', false);

  const badge = document.getElementById('unread-badge');
  if (badge && count > 0) {
    badge.textContent = count;
    badge.style.display = 'inline-block';
  }
}

// ── SESSION GUARD ─────────────────────────────────────────────
export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/auth/login.html';
    return null;
  }
  return session;
}

// ── GET CURRENT PROFILE ───────────────────────────────────────
export async function getProfile() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  return profile;
}
