// SIMPAH - Input Pengolahan Mandiri (Treatment at Source)
import { icons } from '../../components/icons.js';
import { TREATMENT_METHODS, SIPSN_CATEGORIES } from '../../utils/sipsn.js';
import { getCurrentUser } from '../../utils/helpers.js';
import { getCurrentPosition } from '../../utils/gps.js';
import { addWasteRecord, getAllLocations } from '../../db/store.js';
import { showToast } from '../../components/toast.js';
import { renderPWALayout } from './layout.js';
import { photoPickerHTML, initPhotoPicker } from '../../components/photo-picker.js';

export async function renderInputOlah() {
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

  renderPWALayout('Olah Sampah', `
    <div class="pwa-form page-enter">
      <div class="gps-indicator pending" id="gpsStatus">
        ${icons.mapPin}
        <span>Mendeteksi lokasi GPS...</span>
      </div>

      <div class="olah-info-banner">
        <span class="olah-info-icon">🔄</span>
        <div>
          <strong>Pengolahan Mandiri</strong>
          <p>Catat sampah yang diolah sendiri menjadi produk berguna (kompos, pakan ternak, dll) tanpa masuk TPA.</p>
        </div>
      </div>

      <form id="olahForm">
        <div class="form-group">
          <label class="form-label">Metode Pengolahan</label>
          <div class="category-grid" style="grid-template-columns:repeat(2,1fr)" id="methodGrid">
            ${TREATMENT_METHODS.map(m => `
              <div class="category-chip" data-method="${m.id}" title="${m.desc}">
                <span class="category-emoji">${m.emoji}</span>
                <span>${m.label}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Jenis Bahan Sampah</label>
          <div class="category-grid" id="categoryGrid">
            ${SIPSN_CATEGORIES.map(c => `
              <div class="category-chip" data-cat="${c.code}">
                <span class="category-emoji">${c.emoji}</span>
                <span>${c.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Berat Olahan (kg)</label>
          <input type="number" id="weightInput" class="form-input form-input-lg"
            placeholder="0.0" step="0.1" min="0.1" inputmode="decimal" required style="font-size:var(--font-2xl);text-align:center;font-weight:700" />
        </div>

        <div class="form-group">
          <label class="form-label">Lokasi Pengolahan</label>
          <select id="locationSelect" class="form-select">
            <option value="">Pilih lokasi (opsional)...</option>
            ${locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Hasil / Keterangan</label>
          <textarea id="notesInput" class="form-textarea" rows="2" placeholder="Misal: 15 kg kompos dihasilkan, dijual ke petani desa..."></textarea>
        </div>

        <!-- Photo -->
        ${photoPickerHTML('olah', false, 3)}

        <button type="submit" class="btn btn-lg btn-block" id="submitBtn" style="background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none">
          🔄 Simpan Pengolahan
        </button>
      </form>
    </div>
    <style>
      .olah-info-banner { display:flex; gap:var(--space-3); align-items:flex-start; padding:var(--space-4); border-radius:var(--radius-lg); background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.2); margin-bottom:var(--space-5); }
      .olah-info-icon { font-size:28px; }
      .olah-info-banner p { font-size:var(--font-xs); color:var(--text-secondary); margin-top:var(--space-1); line-height:1.4; }
      .olah-info-banner strong { font-size:var(--font-sm); color:var(--amber-600, #d97706); }
    </style>
  `);

  // Init photo picker
  photoPicker = initPhotoPicker('olah');

  // Method selection
  let selectedMethod = null;
  document.querySelectorAll('#methodGrid .category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#methodGrid .category-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedMethod = chip.dataset.method;
    });
  });

  // Category selection
  let selectedCategory = null;
  document.querySelectorAll('#categoryGrid .category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#categoryGrid .category-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedCategory = chip.dataset.cat;
    });
  });

  // Submit
  document.getElementById('olahForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedMethod) { showToast('Pilih metode pengolahan', 'warning'); return; }
    if (!selectedCategory) { showToast('Pilih jenis bahan sampah', 'warning'); return; }

    const weight = parseFloat(document.getElementById('weightInput').value);
    if (!weight || weight <= 0) { showToast('Masukkan berat olahan', 'warning'); return; }

    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<div class="spinner" style="margin:0 auto"></div>';
    btn.disabled = true;

    try {
      const photos = photoPicker?.getPhotos() || [];
      const locationEl = document.getElementById('locationSelect');
      const methodInfo = TREATMENT_METHODS.find(m => m.id === selectedMethod);

      await addWasteRecord({
        type: 'olah',
        category_sipsn: selectedCategory,
        treatment_method: selectedMethod,
        treatment_label: methodInfo?.label || selectedMethod,
        weight_kg: weight,
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

      showToast(`${methodInfo?.emoji || '🔄'} ${weight} kg berhasil dicatat sebagai ${methodInfo?.label}!`, 'success');
      setTimeout(() => { window.location.hash = '#/pwa/home'; }, 800);
    } catch (err) {
      showToast('Gagal: ' + err.message, 'error');
      btn.innerHTML = '🔄 Simpan Pengolahan';
      btn.disabled = false;
    }
  });
}
