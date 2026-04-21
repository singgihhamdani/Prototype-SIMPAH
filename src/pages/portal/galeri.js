// SIMPAH - Portal Galeri
import { renderPortalNav, renderPortalFooter, initPortalNav } from './beranda.js';

const GALLERY_ITEMS = [
  { title: 'Kerja Bakti Bersih Desa Semampir', category: 'Kegiatan', color: '#10b981', emoji: '🧹' },
  { title: 'Sosialisasi Pilah Sampah RT/RW', category: 'Edukasi', color: '#3b82f6', emoji: '📢' },
  { title: 'Operasional TPS3R Banjarnegara', category: 'Operasional', color: '#f59e0b', emoji: '🏭' },
  { title: 'Pelatihan Kader Lingkungan', category: 'Pelatihan', color: '#8b5cf6', emoji: '👩‍🏫' },
  { title: 'Bank Sampah Berseri - Penimbangan', category: 'Bank Sampah', color: '#0d9488', emoji: '⚖️' },
  { title: 'Pengangkutan Sampah ke TPA Winong', category: 'Operasional', color: '#ef4444', emoji: '🚛' },
  { title: 'Pembuatan Kompos di TPS3R', category: 'Daur Ulang', color: '#22c55e', emoji: '🌱' },
  { title: 'Monitoring Lapangan Oleh Dinas', category: 'Monitoring', color: '#6366f1', emoji: '📋' },
  { title: 'Penyerahan Hasil Daur Ulang ke Pengepul', category: 'Bank Sampah', color: '#f97316', emoji: '📦' }
];

export function renderGaleri() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="portal-layout">
      ${renderPortalNav('galeri')}
      <div style="padding-top:calc(var(--navbar-height) + var(--space-8))">
        <section class="portal-section">
          <div class="portal-section-header">
            <h2>Galeri <span class="gradient-text">Kegiatan</span></h2>
            <p>Dokumentasi kegiatan pengelolaan sampah di Kabupaten Banjarnegara</p>
          </div>
          <div class="gallery-grid">
            ${GALLERY_ITEMS.map((item, i) => `
              <div class="gallery-item" style="animation:fadeInUp 0.4s ease ${i*0.06}s both">
                <div style="width:100%;height:100%;background:linear-gradient(135deg, ${item.color}30, ${item.color}60);display:flex;align-items:center;justify-content:center;font-size:64px">
                  ${item.emoji}
                </div>
                <div class="gallery-item-overlay">
                  <div>
                    <p style="font-weight:600">${item.title}</p>
                    <p style="font-size:12px;opacity:0.8;margin-top:4px">${item.category}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
      ${renderPortalFooter()}
    </div>
  `;
  initPortalNav();
}
