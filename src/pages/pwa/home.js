// SIMPAH - PWA Home Page
import { icons } from '../../components/icons.js';
import { getCurrentUser, formatWeight, formatNumber, getState, onStateChange } from '../../utils/helpers.js';
import { getWasteStats } from '../../db/store.js';
import { renderPWALayout } from './layout.js';

export async function renderPWAHome() {
  const user = getCurrentUser();
  if (!user) { window.location.hash = '#/login'; return; }

  const stats = await getWasteStats();

  renderPWALayout('Beranda', `
    <!-- Greeting -->
    <div class="pwa-greeting page-enter">
      <div class="greeting-text">
        <h2>Halo, ${user.name.split(' ')[0]}! 👋</h2>
        <p>${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <div class="sync-status ${navigator.onLine ? 'online' : 'offline'}" id="syncIndicator">
        <span class="sync-dot"></span>
        ${navigator.onLine ? 'Online' : 'Offline'}
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="pwa-summary-row page-enter stagger-1" style="animation-fill-mode:both">
      <div class="pwa-summary-card">
        <div class="summary-icon">${icons.trashIn}</div>
        <div class="summary-value" style="color:var(--primary-600)">${formatWeight(stats.todayWeight)}</div>
        <div class="summary-label">Hari Ini</div>
      </div>
      <div class="pwa-summary-card">
        <div class="summary-icon">${icons.chart}</div>
        <div class="summary-value" style="color:var(--info-500)">${formatWeight(stats.monthWeight)}</div>
        <div class="summary-label">Bulan Ini</div>
      </div>
      <div class="pwa-summary-card">
        <div class="summary-icon">${icons.recycle}</div>
        <div class="summary-value" style="color:var(--accent-500)">${stats.recycleRate}%</div>
        <div class="summary-label">Daur Ulang</div>
      </div>
      <div class="pwa-summary-card">
        <div class="summary-icon">${icons.activity}</div>
        <div class="summary-value">${formatNumber(stats.totalRecords)}</div>
        <div class="summary-label">Total Data</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section-header" style="margin-top:var(--space-2)">
      <h3 style="font-size:var(--font-base);font-weight:700">Menu Cepat</h3>
    </div>
    <div class="quick-actions page-enter stagger-2" style="animation-fill-mode:both">
      <a href="#/pwa/input-sampah" class="quick-action-btn">
        <div class="quick-action-icon green">${icons.trashIn}</div>
        <span class="quick-action-label">Sampah Masuk</span>
      </a>
      <a href="#/pwa/input-pilah" class="quick-action-btn">
        <div class="quick-action-icon blue">${icons.recycle}</div>
        <span class="quick-action-label">Pilah Sampah</span>
      </a>
      <a href="#/pwa/input-residu" class="quick-action-btn">
        <div class="quick-action-icon red">${icons.residue}</div>
        <span class="quick-action-label">Residu</span>
      </a>
      <a href="#/pwa/armada" class="quick-action-btn">
        <div class="quick-action-icon amber">${icons.truck}</div>
        <span class="quick-action-label">Armada</span>
      </a>
      <a href="#/pwa/insidental" class="quick-action-btn">
        <div class="quick-action-icon purple">${icons.alert}</div>
        <span class="quick-action-label">Insidental</span>
      </a>
      <a href="#/pwa/riwayat" class="quick-action-btn">
        <div class="quick-action-icon teal">${icons.clock}</div>
        <span class="quick-action-label">Riwayat</span>
      </a>
    </div>

    <!-- Recent Records -->
    <div class="section-header">
      <h3 style="font-size:var(--font-base);font-weight:700">Catatan Terakhir</h3>
      <a href="#/pwa/riwayat" class="btn btn-ghost btn-sm">Lihat Semua ${icons.chevronRight}</a>
    </div>
    <div class="record-list page-enter stagger-3" style="animation-fill-mode:both">
      ${stats.records.slice(0, 5).map(r => `
        <div class="record-item">
          <div class="record-icon" style="background:${getTypeBg(r.type)}">
            ${getTypeEmoji(r.type)}
          </div>
          <div class="record-info">
            <div class="record-title">${getTypeLabel(r.type)} - ${r.category_sipsn || '-'}</div>
            <div class="record-meta">${r.location_name || '-'} · ${timeAgo(r.created_at)}</div>
          </div>
          <div class="record-value">
            ${formatWeight(r.weight_kg)}
            ${!r.synced ? '<br><span class="badge badge-warning" style="font-size:9px">Pending</span>' : ''}
          </div>
        </div>
      `).join('')}
      ${stats.records.length === 0 ? '<div class="empty-state"><p>Belum ada catatan</p></div>' : ''}
    </div>
  `, 'home');

  // Update sync status listener
  const unsub = onStateChange('online', (val) => {
    const el = document.getElementById('syncIndicator');
    if (el) {
      el.className = `sync-status ${val ? 'online' : 'offline'}`;
      el.innerHTML = `<span class="sync-dot"></span> ${val ? 'Online' : 'Offline'}`;
    }
  });

  return unsub;
}

function getTypeLabel(type) {
  const labels = { masuk: 'Sampah Masuk', pilah: 'Sampah Terpilah', residu: 'Residu' };
  return labels[type] || type;
}
function getTypeEmoji(type) {
  const emojis = { masuk: '📥', pilah: '♻️', residu: '🗑️' };
  return emojis[type] || '📦';
}
function getTypeBg(type) {
  const bgs = { masuk: 'rgba(16,185,129,0.12)', pilah: 'rgba(59,130,246,0.12)', residu: 'rgba(239,68,68,0.12)' };
  return bgs[type] || 'rgba(107,114,128,0.12)';
}
function timeAgo(iso) {
  const now = new Date(), d = new Date(iso), diff = now - d;
  const mins = Math.floor(diff/60000), hrs = Math.floor(diff/3600000), days = Math.floor(diff/86400000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins}m lalu`;
  if (hrs < 24) return `${hrs}j lalu`;
  return `${days}h lalu`;
}
