// ======================================
// MÓDULO DE MOTOCICLETAS — Firebase
// Los cambios se guardan en la nube y
// todos los visitantes los ven en tiempo real
// ======================================
let motorcycles = [];
let editingMotoId = null;

// ── Cargar motocicletas desde Firebase ──
async function loadMotorcycles() {
    try {
        const snapshot = await motosCollection.orderBy('brand').get();
        motorcycles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`✅ ${motorcycles.length} motocicletas cargadas desde Firebase`);
        updateBrandsList();
    } catch (error) {
        console.error('Error al cargar:', error);
        showToast('❌ Error al cargar motos: ' + error.message, 'error');
    }
}

// ── Cargar para panel admin ──
async function loadMotorcyclesForAdmin() {
    await loadMotorcycles();
    displayMotorcyclesAdmin();
}

// ── Guardar o actualizar moto ──
async function saveMoto(event) {
    event.preventDefault();

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Guardando...';

    const motoData = {
        brand:    document.getElementById('brand').value.trim(),
        model:    document.getElementById('model').value.trim(),
        cc:       document.getElementById('cc').value.trim(),
        price:    document.getElementById('price').value.trim(),
        year:     document.getElementById('year').value.trim(),
        imageUrl: document.getElementById('imageUrl').value.trim() || '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        if (editingMotoId) {
            await motosCollection.doc(editingMotoId).update(motoData);
            showToast('✅ Moto actualizada correctamente');
        } else {
            motoData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await motosCollection.add(motoData);
            showToast('✅ Moto agregada correctamente');
        }

        document.getElementById('motoForm').reset();
        editingMotoId = null;
        btn.textContent = 'Agregar Moto';
        loadMotorcyclesForAdmin();

    } catch (error) {
        console.error('Error al guardar:', error);
        showToast('❌ Error: ' + error.message, 'error');
        btn.textContent = editingMotoId ? '💾 Actualizar Moto' : 'Agregar Moto';
    }

    btn.disabled = false;
}

// ── Mostrar lista en admin (agrupada por marca) ──
function displayMotorcyclesAdmin() {
    const container = document.getElementById('motoListContainer');
    if (motorcycles.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;">No hay motocicletas registradas</p>';
        return;
    }

    const brands = [...new Set(motorcycles.map(m => m.brand))].sort();
    container.innerHTML = brands.map(brand => {
        const motos = motorcycles.filter(m => m.brand === brand);
        return `
            <div style="margin-bottom:18px;">
                <div style="background:linear-gradient(135deg,#f57c00,#ff9800);padding:8px 14px;border-radius:8px 8px 0 0;font-weight:700;color:#fff;">
                    🏍️ ${brand} <span style="font-weight:400;font-size:13px;">(${motos.length} modelos)</span>
                </div>
                ${motos.map(moto => `
                    <div class="moto-item-admin" style="border-radius:0;border-top:1px solid rgba(255,255,255,0.05);">
                        <div class="moto-item-admin-info">
                            <strong style="color:var(--text-accent);">${moto.model}</strong><br>
                            <small style="color:#aaa;">${moto.cc} • <span style="color:#ff9800;font-weight:600;">${moto.price}</span> • ${moto.year}</small>
                        </div>
                        <div class="moto-item-admin-actions">
                            <button class="btn-edit"   onclick="editMoto('${moto.id}')">✏️</button>
                            <button class="btn-delete" onclick="deleteMoto('${moto.id}')">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

// ── Editar moto ──
function editMoto(id) {
    const moto = motorcycles.find(m => m.id === id);
    if (!moto) return;
    editingMotoId = id;
    document.getElementById('brand').value    = moto.brand;
    document.getElementById('model').value    = moto.model;
    document.getElementById('cc').value       = moto.cc;
    document.getElementById('price').value    = moto.price;
    document.getElementById('year').value     = moto.year;
    document.getElementById('imageUrl').value = moto.imageUrl || '';
    document.getElementById('submitBtn').textContent = '💾 Actualizar Moto';
    document.getElementById('motoForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('✏️ Editando: ' + moto.brand + ' ' + moto.model);
}

// ── Cancelar edición ──
function cancelEdit() {
    editingMotoId = null;
    document.getElementById('motoForm').reset();
    document.getElementById('submitBtn').textContent = 'Agregar Moto';
}

// ── Eliminar moto ──
async function deleteMoto(id) {
    const moto = motorcycles.find(m => m.id === id);
    if (!confirm(`¿Eliminar ${moto.brand} ${moto.model}?`)) return;
    try {
        await motosCollection.doc(id).delete();
        showToast('🗑️ Moto eliminada');
        loadMotorcyclesForAdmin();
        updateBrandsList();
    } catch (error) {
        showToast('❌ Error al eliminar: ' + error.message, 'error');
    }
}

// ── Toast ──
function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `position:fixed;bottom:30px;right:30px;padding:14px 22px;border-radius:10px;color:#fff;font-weight:600;font-size:15px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);transition:opacity 0.4s ease;max-width:90vw;`;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#e53935' : '#43a047';
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}