// SIMPAH - Dashboard Layout (Sidebar + Navbar)
import { icons } from '../../components/icons.js';
import { getCurrentUser, toggleTheme, getState, logout } from '../../utils/helpers.js';
import { isActiveRoute } from '../../router.js';

export function renderDashboardLayout(title, content, activeMenu = '') {
  const user = getCurrentUser();
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">S</div>
          <div class="sidebar-brand">
            <h2>SIMPAH</h2>
            <p>Monitoring Sampah</p>
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="sidebar-section">
            <div class="sidebar-section-title">Dashboard</div>
            ${user?.role === 'dinas' ? `
            <a href="#/dashboard/eksekutif" class="sidebar-link ${activeMenu === 'eksekutif' ? 'active' : ''}">
              ${icons.chart} <span>Eksekutif</span>
            </a>
            ` : ''}
            <a href="#/dashboard/gis" class="sidebar-link ${activeMenu === 'gis' ? 'active' : ''}">
              ${icons.map} <span>Peta GIS</span>
            </a>
          </div>
          ${user?.role === 'dinas' ? `
          <div class="sidebar-section">
            <div class="sidebar-section-title">Pengelolaan</div>
            <a href="#/dashboard/laporan" class="sidebar-link ${activeMenu === 'laporan' ? 'active' : ''}">
              ${icons.file} <span>Laporan & Export</span>
            </a>
            <a href="#/dashboard/validasi" class="sidebar-link ${activeMenu === 'validasi' ? 'active' : ''}">
              ${icons.checkCircle} <span>Validasi Data</span>
            </a>
            <a href="#/dashboard/mou" class="sidebar-link ${activeMenu === 'mou' ? 'active' : ''}">
              ${icons.clipboard} <span>Manajemen MoU</span>
            </a>
            <a href="#/dashboard/intervensi" class="sidebar-link ${activeMenu === 'intervensi' ? 'active' : ''}">
              ${icons.shield} <span>Intervensi Desa</span>
            </a>
          </div>
          ` : ''}
          <div class="sidebar-section">
            <div class="sidebar-section-title">Operasional</div>
            <a href="#/pwa/home" class="sidebar-link ${activeMenu === 'pwa' ? 'active' : ''}">
              ${icons.activity} <span>Input Lapangan</span>
            </a>
            <a href="#/portal" class="sidebar-link ${activeMenu === 'portal' ? 'active' : ''}">
              ${icons.globe} <span>Portal Publik</span>
            </a>
          </div>
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebarUser">
            <div class="sidebar-user-avatar">${user ? user.name.charAt(0).toUpperCase() : 'U'}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user?.name || 'Guest'}</div>
              <div class="sidebar-user-role">${getRoleName(user?.role)}</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Sidebar Overlay (mobile) -->
      <div class="sidebar-overlay" id="sidebarOverlay"></div>

      <!-- Main -->
      <main class="app-main">
        <nav class="navbar">
          <div class="navbar-left">
            <button class="navbar-menu-btn" id="menuToggle">${icons.menu}</button>
            <div class="navbar-breadcrumb">
              <span>Dashboard</span>
              <span>/</span>
              <strong>${title}</strong>
            </div>
          </div>
          <div class="navbar-right">
            <button class="navbar-icon-btn" id="dashThemeBtn">${getState('theme') === 'dark' ? icons.sun : icons.moon}</button>
            <button class="navbar-icon-btn" style="position:relative">
              ${icons.bell}
              <span class="notif-dot"></span>
            </button>
            <button class="navbar-icon-btn" id="dashLogoutBtn">${icons.logout}</button>
          </div>
        </nav>
        <div class="app-content">
          ${content}
        </div>
      </main>
    </div>
  `;

  // Mobile sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuToggle = document.getElementById('menuToggle');

  menuToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });

  // Theme toggle
  document.getElementById('dashThemeBtn')?.addEventListener('click', () => {
    toggleTheme();
    document.getElementById('dashThemeBtn').innerHTML = getState('theme') === 'dark' ? icons.sun : icons.moon;
  });

  // Logout
  document.getElementById('dashLogoutBtn')?.addEventListener('click', () => logout());
}

function getRoleName(role) {
  const names = { kader: 'Kader Lingkungan', petugas: 'Petugas Pengangkut', pemdes: 'Pemerintah Desa', pengepul: 'Pengepul', dinas: 'Dinas Lingkungan' };
  return names[role] || 'User';
}
