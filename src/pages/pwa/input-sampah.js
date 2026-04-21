// SIMPAH - Input Sampah Masuk (Waste Input Form)
import { icons } from '../../components/icons.js';
import { SIPSN_CATEGORIES } from '../../utils/sipsn.js';
import { getCurrentUser } from '../../utils/helpers.js';
import { getCurrentPosition } from '../../utils/gps.js';
import { addWasteRecord, getAllLocations, getAllFleet } from '../../db/store.js';
import { showToast } from '../../components/toast.js';
import { renderPWALayout } from './layout.js';
import { photoPickerHTML, initPhotoPicker } from '../../components/photo-picker.js';

export async function renderInputSampah() {
  const user = getCurrentUser();
  if (!user) { window.location.hash = '#/login'; return; }

  const locations = await getAllLocations();
  const fleet = await getAllFleet();
  let selectedCategory = null;
  let gpsData = null;
  let photoPicker = null;

  // Try to get GPS immediately
  captureGPS();

  renderPWALayout('Sampah Masuk', `
    <div class="pwa-form page-enter">
      <!-- GPS Indicator -->
      <div class="gps-indicator pending" id="gpsStatus">
        ${icons.mapPin}
        <span id="gpsText">Mendeteksi lokasi GPS...</span>
      </div>

      <form id="wasteForm">
        <!-- Category Selection -->
        <div class="form-group">
          <label class="form-label">Kategori SIPSN</label>
          <div class="category-grid" id="categoryGrid">
            ${SIPSN_CATEGORIES.map(cat => `
              <div class="category-chip" data-code="${cat.code}" id="cat-${cat.code}">
                <span class="category-emoji">${cat.emoji}</span>
                <span>${cat.name}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Weight Input -->
        <div class="form-group">
          <label class="form-label">Berat</label>
          <div class="weight-input-group">
            <input type="number" id="weightInput" class="form-input form-input-lg" placeholder="0" step="0.1" min="0" required inputmode="decimal" />
            <div class="weight-unit-toggle">
              <button type="button" class="weight-unit-btn active" data-unit="kg">kg</button>
              <button type="button" class="weight-unit-btn" data-unit="ton">ton</button>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="form-group">
          <label class="form-label">Lokasi TPS/TPS3R</label>
          <select id="locationSelect" class="form-select form-input-lg">
            <option value="">Pilih lokasi...</option>
            ${locations.map(l => `<option value="${l.id}" data-lat="${l.lat}" data-lng="${l.lng}">${l.name} (${l.type.toUpperCase()})</option>`).join('')}
          </select>
        </div>

        <!-- Fleet (optional) -->
        <div class="form-group">
          <label class="form-label">Kendaraan (Opsional)</label>
          <select id="fleetSelect" class="form-select">
            <option value="">Tanpa kendaraan</option>
            ${fleet.filter(f => f.status === 'active').map(f => `<option value="${f.id}" data-plate="${f.plate_number}">${f.plate_number} - ${f.vehicle_type}</option>`).join('')}
          </select>
        </div>

        <!-- Notes -->
        <div class="form-group">
          <label class="form-label">Catatan (Opsional)</label>
          <textarea id="notesInput" class="form-textarea" rows="2" placeholder="Tambahkan catatan..."></textarea>
        </div>

        <!-- Photo -->
        ${photoPickerHTML('sampah', false, 3)}

        <!-- Submit -->
        <button type="submit" class="btn btn-primary btn-lg btn-block" id="submitBtn">
          ${icons.plus} Simpan Data
        </button>
      </form>
    </div>
  `);

  // Init photo picker
  photoPicker = initPhotoPicker('sampah');

  // Wire up category selection
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedCategory = chip.dataset.code;
    });
  });

  // Wire up unit toggle
  document.querySelectorAll('.weight-unit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.weight-unit-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Wire up form submission
  document.getElementById('wasteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      showToast('Pilih kategori sampah terlebih dahulu', 'warning');
      return;
    }

    const weightInput = parseFloat(document.getElementById('weightInput').value);
    if (!weightInput || weightInput <= 0) {
      showToast('Masukkan berat yang valid', 'warning');
      return;
    }

    const activeUnit = document.querySelector('.weight-unit-btn.active').dataset.unit;
    const weightKg = activeUnit === 'ton' ? weightInput * 1000 : weightInput;

    const locationEl = document.getElementById('locationSelect');
    const fleetEl = document.getElementById('fleetSelect');
    const selectedOption = locationEl.options[locationEl.selectedIndex];
    const selectedFleet = fleetEl.options[fleetEl.selectedIndex];

    const photos = photoPicker?.getPhotos() || [];

    const record = {
      type: 'masuk',
      category_sipsn: selectedCategory,
      weight_kg: weightKg,
      lat: gpsData?.latitude || (selectedOption?.dataset?.lat ? parseFloat(selectedOption.dataset.lat) : null),
      lng: gpsData?.longitude || (selectedOption?.dataset?.lng ? parseFloat(selectedOption.dataset.lng) : null),
      location_id: locationEl.value || null,
      location_name: locationEl.value ? selectedOption.text : '',
      fleet_id: fleetEl.value || null,
      fleet_plate: fleetEl.value ? selectedFleet.dataset.plate : '',
      notes: document.getElementById('notesInput').value.trim(),
      photos: photos.map(p => ({ dataUrl: p.dataUrl, name: p.name })),
      photo_count: photos.length,
      user_id: user.id,
      user_name: user.name
    };

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<div class="spinner" style="margin:0 auto"></div>';
    submitBtn.disabled = true;

    try {
      await addWasteRecord(record, user.id);
      showToast('Data sampah masuk berhasil disimpan!', 'success', 'Tersimpan');
      setTimeout(() => { window.location.hash = '#/pwa/home'; }, 800);
    } catch (err) {
      showToast('Gagal menyimpan data: ' + err.message, 'error');
      submitBtn.innerHTML = `${icons.plus} Simpan Data`;
      submitBtn.disabled = false;
    }
  });

  async function captureGPS() {
    try {
      const pos = await getCurrentPosition(false);
      gpsData = pos;
      const statusEl = document.getElementById('gpsStatus');
      const textEl = document.getElementById('gpsText');
      if (statusEl && textEl) {
        statusEl.className = 'gps-indicator active';
        textEl.textContent = `GPS: ${pos.latitude.toFixed(6)}, ${pos.longitude.toFixed(6)}`;
      }
    } catch (e) {
      const statusEl = document.getElementById('gpsStatus');
      const textEl = document.getElementById('gpsText');
      if (statusEl && textEl) {
        textEl.textContent = 'GPS tidak tersedia - lokasi manual';
      }
    }
  }
}
