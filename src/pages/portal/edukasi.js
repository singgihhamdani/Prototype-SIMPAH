// SIMPAH - Portal Edukasi
import { icons } from '../../components/icons.js';
import { renderPortalNav, renderPortalFooter, initPortalNav } from './beranda.js';

const ARTICLES = [
  {
    id: 1, category: 'Pemilahan', title: '5 Langkah Mudah Memilah Sampah di Rumah',
    excerpt: 'Pemilahan sampah dimulai dari rumah. Pelajari cara sederhana memisahkan sampah organik, anorganik, dan B3 dengan benar.',
    date: '15 Apr 2026', color: '#10b981'
  },
  {
    id: 2, category: 'Daur Ulang', title: 'Mengubah Sampah Plastik Menjadi Bernilai Ekonomi',
    excerpt: 'Bank Sampah dapat menjadi solusi mengubah plastik bekas menjadi produk bernilai. Simak tips dan triknya di sini.',
    date: '10 Apr 2026', color: '#3b82f6'
  },
  {
    id: 3, category: 'Kompos', title: 'Panduan Membuat Kompos dari Sampah Dapur',
    excerpt: 'Sampah dapur seperti sisa makanan dan kulit buah bisa diolah menjadi kompos berkualitas untuk tanaman.',
    date: '5 Apr 2026', color: '#f59e0b'
  },
  {
    id: 4, category: 'Regulasi', title: 'Memahami Standar SIPSN dalam Pengelolaan Sampah',
    excerpt: 'SIPSN (Sistem Informasi Pengelolaan Sampah Nasional) adalah standar pelaporan yang wajib dipahami oleh setiap daerah.',
    date: '1 Apr 2026', color: '#8b5cf6'
  },
  {
    id: 5, category: '3R', title: 'Reduce, Reuse, Recycle: Prinsip Dasar Pengelolaan Sampah',
    excerpt: 'Prinsip 3R merupakan dasar dalam pengelolaan sampah berkelanjutan yang dapat diterapkan oleh setiap warga.',
    date: '28 Mar 2026', color: '#0d9488'
  },
  {
    id: 6, category: 'TPS3R', title: 'Peran TPS3R dalam Pengurangan Sampah ke TPA',
    excerpt: 'TPS3R (Tempat Pengolahan Sampah Reduce-Reuse-Recycle) menjadi ujung tombak pengurangan volume sampah ke TPA.',
    date: '20 Mar 2026', color: '#ef4444'
  }
];

export function renderEdukasi() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="portal-layout">
      ${renderPortalNav('edukasi')}
      <div style="padding-top:calc(var(--navbar-height) + var(--space-8))">
        <section class="portal-section">
          <div class="portal-section-header">
            <h2>Edukasi ${`<span class="gradient-text">Pengelolaan Sampah</span>`}</h2>
            <p>Artikel dan informasi untuk meningkatkan kesadaran masyarakat dalam pengelolaan sampah</p>
          </div>
          <div class="grid-auto">
            ${ARTICLES.map((a, i) => `
              <div class="portal-card" style="animation:fadeInUp 0.4s ease ${i*0.08}s both;cursor:pointer">
                <div class="portal-card-image" style="background:linear-gradient(135deg, ${a.color}22, ${a.color}44);display:flex;align-items:center;justify-content:center;font-size:48px">
                  ${{Pemilahan:'♻️',['Daur Ulang']:'🔄',Kompos:'🌱',Regulasi:'📋','3R':'🌍',TPS3R:'🏭'}[a.category] || '📖'}
                </div>
                <div class="portal-card-body">
                  <span class="portal-card-tag" style="background:${a.color}15;color:${a.color}">${a.category}</span>
                  <h3 class="portal-card-title">${a.title}</h3>
                  <p class="portal-card-excerpt">${a.excerpt}</p>
                  <p style="font-size:var(--font-xs);color:var(--text-muted);margin-top:var(--space-3)">${a.date}</p>
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
