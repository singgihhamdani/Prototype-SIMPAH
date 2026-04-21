// SIMPAH - Input Sampah Terpilah
import { icons } from '../../components/icons.js';
import { SIPSN_CATEGORIES } from '../../utils/sipsn.js';
import { getCurrentUser } from '../../utils/helpers.js';
import { getCurrentPosition } from '../../utils/gps.js';
import { addWasteRecord, addSortedWaste, getAllLocations } from '../../db/store.js';
import { showToast } from '../../components/toast.js';
import { renderPWALayout } from './layout.js';
import { photoPickerHTML, initPhotoPicker } from '../../components/photo-picker.js';

export async function renderInputPilah() {
  const user = getCurrentUser();
  if (!user) { window.location.hash = '#/login'; return; }
  
  const locations = await getAllLocations();
  let gpsData = null;
  let photoPicker = null;
  
  getCurrentPosition(false).then(pos => {
    gpsData = pos;
    const el = document.getElementById('gpsStatus');
    if (el) { el.className = 'gps-indicator active'; el.querySelector('span:last-child').textContent = `GPS: ${pos.latitude.toFixed(6)}, ${pos.longitude.toFixed(6)}`; }
  }).catch(() => {});

  renderPWALayout('Sampah Terpilah', `
    <div class="pwa-form page-enter">
      <div class="gps-indicator pending" id="gpsStatus">
        ${icons.mapPin}
        <span>Mendeteksi lokasi GPS...</span>
      </div>

      <form id="pilahForm">
        <div class="form-group">
          <label class="form-label">Lokasi</label>
          <select id="locationSelect" class="form-select">
            <option value="">Pilih lokasi...</option>
            ${locations.filter(l => ['tps3r', 'bank_sampah'].includes(l.type)).map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Input Berat per Kategori (kg)</label>
          <div class="pilah-categories" id="pilahCategories">
            ${SIPSN_CATEGORIES.map(cat => `
              <div class="pilah-row">
                <span class="pilah-emoji">${cat.emoji}</span>
                <span class="pilah-name">${cat.name}</span>
                <input type="number" class="form-input pilah-input" data-code="${cat.code}" placeholder="0" step="0.1" min="0" inputmode="decimal" />
                <span class="pilah-unit">kg</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="pilah-total" id="pilahTotal">
          Total: <strong>0 kg</strong>
        </div>

        <div class="form-group">
          <label class="form-label">Catatan</label>
          <textarea id="notesInput" class="form-textarea" rows="2" placeholder="Catatan opsional..."></textarea>
        </div>

        <!-- Photo -->
        ${photoPickerHTML('pilah', false, 3)}

        <button type="submit" class="btn btn-primary btn-lg btn-block" id="submitBtn">
          ${icons.recycle} Simpan Data Pilah
        </button>
      </form>
    </div>
    <style>
      .pilah-categories { display:flex; flex-direction:column; gap:var(--space-2); }
      .pilah-row { display:flex; align-items:center; gap:var(--space-3); padding:var(--space-2) 0; border-bottom:1px solid var(--border-color); }
      .pilah-emoji { font-size:20px; width:28px; text-align:center; }
      .pilah-name { flex:1; font-size:var(--font-sm); font-weight:500; }
      .pilah-input { width:80px !important; text-align:right; padding:var(--space-2) var(--space-3) !important; }
      .pilah-unit { font-size:var(--font-sm); color:var(--text-muted); width:24px; }
      .pilah-total { text-align:right; padding:var(--space-4) 0; font-size:var(--font-lg); color:var(--primary-600); border-top:2px solid var(--primary-200); margin-bottom:var(--space-5); }
    </style>
  `);

  // Init photo picker
  photoPicker = initPhotoPicker('pilah');

  // Update total
  document.querySelectorAll('.pilah-input').forEach(input => {
    input.addEventListener('input', updateTotal);
  });

  function updateTotal() {
    let total = 0;
    document.querySelectorAll('.pilah-input').forEach(i => {
      total += parseFloat(i.value) || 0;
    });
    document.getElementById('pilahTotal').innerHTML = `Total: <strong>${total.toFixed(1)} kg</strong>`;
  }

  // Submit
  document.getElementById('pilahForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const items = [];
    let totalKg = 0;
    document.querySelectorAll('.pilah-input').forEach(i => {
      const val = parseFloat(i.value) || 0;
      if (val > 0) {
        items.push({ category_sipsn: i.dataset.code, weight_kg: val });
        totalKg += val;
      }
    });

    if (items.length === 0) {
      showToast('Masukkan minimal satu kategori', 'warning');
      return;
    }

    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<div class="spinner" style="margin:0 auto"></div>';
    btn.disabled = true;

    try {
      const photos = photoPicker?.getPhotos() || [];
      const locationEl = document.getElementById('locationSelect');
      const record = await addWasteRecord({
        type: 'pilah',
        category_sipsn: items.length === 1 ? items[0].category_sipsn : 'MIX',
        weight_kg: totalKg,
        lat: gpsData?.latitude || null,
        lng: gpsData?.longitude || null,
        location_id: locationEl.value || null,
        location_name: locationEl.value ? locationEl.options[locationEl.selectedIndex].text : '',
        notes: document.getElementById('notesInput').value.trim(),
        photos: photos.map(p => ({ dataUrl: p.dataUrl, name: p.name })),
        photo_count: photos.length,
        user_id: user.id,
        user_name: user.name
      }, user.id);

      await addSortedWaste(items, record.id, user.id);
      showToast(`${items.length} kategori terpilah berhasil disimpan!`, 'success');
      setTimeout(() => { window.location.hash = '#/pwa/home'; }, 800);
    } catch (err) {
      showToast('Gagal: ' + err.message, 'error');
      btn.innerHTML = `${icons.recycle} Simpan Data Pilah`;
      btn.disabled = false;
    }
  });
}
