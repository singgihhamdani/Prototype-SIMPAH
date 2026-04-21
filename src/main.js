// SIMPAH - Main Application Bootstrap
import './styles/index.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/pwa.css';
import './styles/portal.css';
import './styles/intervensi-print.css';
import 'leaflet/dist/leaflet.css';

import { registerRoute, startRouter } from './router.js';
import { initTheme, getCurrentUser } from './utils/helpers.js';
import { initDB } from './db/schema.js';
import { seedDatabase } from './db/seed.js';
import { initSync } from './db/sync.js';

// Pages
import { renderLogin } from './pages/login.js';
import { renderPWAHome } from './pages/pwa/home.js';
import { renderInputSampah } from './pages/pwa/input-sampah.js';
import { renderInputPilah } from './pages/pwa/input-pilah.js';
import { renderInputResidu } from './pages/pwa/input-residu.js';
import { renderArmada } from './pages/pwa/armada.js';
import { renderInsidental } from './pages/pwa/insidental.js';
import { renderInputOlah } from './pages/pwa/input-olah.js';
import { renderRiwayat } from './pages/pwa/riwayat.js';
import { renderGIS } from './pages/dashboard/gis.js';
import { renderEksekutif } from './pages/dashboard/eksekutif.js';
import { renderLaporan } from './pages/dashboard/laporan.js';
import { renderMou } from './pages/dashboard/mou.js';
import { renderIntervensi } from './pages/dashboard/intervensi.js';
import { renderValidasi } from './pages/dashboard/validasi.js';
import { renderPortalBeranda, initPortalNav } from './pages/portal/beranda.js';
import { renderEdukasi } from './pages/portal/edukasi.js';
import { renderGaleri } from './pages/portal/galeri.js';
import { renderRegulasi } from './pages/portal/regulasi.js';
import { renderAduan } from './pages/portal/aduan.js';

async function bootstrap() {
  try {
    // Initialize theme
    initTheme();

    // Initialize IndexedDB
    await initDB();

    // Seed demo data
    await seedDatabase();

    // Initialize offline sync
    initSync();

    // Register routes
    registerRoute('/login', () => renderLogin());

    // PWA routes
    registerRoute('/pwa/home', () => renderPWAHome());
    registerRoute('/pwa/input-sampah', () => renderInputSampah());
    registerRoute('/pwa/input-pilah', () => renderInputPilah());
    registerRoute('/pwa/input-residu', () => renderInputResidu());
    registerRoute('/pwa/armada', () => renderArmada());
    registerRoute('/pwa/insidental', () => renderInsidental());
    registerRoute('/pwa/input-olah', () => renderInputOlah());
    registerRoute('/pwa/riwayat', () => renderRiwayat());

    // Dashboard routes
    registerRoute('/dashboard/gis', () => renderGIS());
    registerRoute('/dashboard/eksekutif', () => renderEksekutif());
    registerRoute('/dashboard/laporan', () => renderLaporan());
    registerRoute('/dashboard/validasi', () => renderValidasi());
    registerRoute('/dashboard/mou', () => renderMou());
    registerRoute('/dashboard/intervensi', () => renderIntervensi());

    // Portal routes
    registerRoute('/portal', () => { renderPortalBeranda(); initPortalNav(); });
    registerRoute('/portal/edukasi', () => renderEdukasi());
    registerRoute('/portal/galeri', () => renderGaleri());
    registerRoute('/portal/regulasi', () => renderRegulasi());
    registerRoute('/portal/aduan', () => renderAduan());

    // Hide loading screen
    const loading = document.getElementById('loadingScreen');
    if (loading) {
      setTimeout(() => {
        loading.classList.add('hidden');
      }, 1200);
    }

    // Start router - default to portal for public access
    startRouter('/portal');

  } catch (error) {
    console.error('Bootstrap failed:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2rem;background:#0a0f1a;color:white">
          <div>
            <h1 style="font-size:2rem;margin-bottom:1rem">⚠️ Terjadi Kesalahan</h1>
            <p style="color:#9ca3af;margin-bottom:1.5rem">${error.message}</p>
            <button onclick="location.reload()" style="padding:0.75rem 2rem;background:#10b981;color:white;border:none;border-radius:8px;cursor:pointer;font-size:1rem">Muat Ulang</button>
          </div>
        </div>
      `;
    }
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
