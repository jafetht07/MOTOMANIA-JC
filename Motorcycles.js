// ======================================
// MÓDULO DE MOTOCICLETAS Y MARCAS
// Firebase + Storage
// ======================================
let motorcycles  = [];
let brands       = [];
let editingMotoId  = null;

// ============================================================
// MARCAS
// ============================================================

// ── Preview logo al seleccionar archivo ──
function previewBrandLogo(input) {
    const container = document.getElementById('brandLogoPreviewContainer');
    const preview   = document.getElementById('brandLogoPreview');
    const urlInput  = document.getElementById('brandLogoUrl');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            container.style.display = 'block';
            urlInput.value = '';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ── Subir logo a Storage ──
async function uploadLogo(file, brandName) {
    const ext      = file.name.split('.').pop();
    const fileName = `logos/${brandName.replace(/\s+/g, '_')}_${Date.now()}.${ext}`;
    const ref      = storage.ref(fileName);
    const snap     = await ref.put(file);
    return await snap.ref.getDownloadURL();
}

// ── Guardar o actualizar marca ──
async function saveBrand(event) {
    event.preventDefault();
    const btn = document.getElementById('brandSubmitBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Guardando...';

    try {
        let logoUrl = document.getElementById('brandLogoUrl').value.trim();
        const fileInput = document.getElementById('brandLogoFile');
        const brandName = document.getElementById('brandName').value.trim();

        if (fileInput && fileInput.files && fileInput.files[0]) {
            btn.textContent = '⏳ Subiendo logo...';
            logoUrl = await uploadLogo(fileInput.files[0], brandName);
        }

        const brandData = {
            name:    brandName,
            logoUrl: logoUrl || '',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        const editingId = document.getElementById('editingBrandId').value;
        if (editingId) {
            await db.collection('brands').doc(editingId).update(brandData);
            showToast('✅ Marca actualizada');
        } else {
            brandData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('brands').add(brandData);
            showToast('✅ Marca agregada correctamente');
        }

        document.getElementById('brandForm').reset();
        document.getElementById('editingBrandId').value = '';
        document.getElementById('brandLogoPreviewContainer').style.display = 'none';
        btn.textContent = '➕ Agregar Marca';
        loadBrands();

    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Error: ' + error.message, 'error');
        btn.textContent = '➕ Agregar Marca';
    }
    btn.disabled = false;
}

// ── Cargar marcas desde Firebase ──
async function loadBrands() {
    try {
        const snapshot = await db.collection('brands').orderBy('name').get();
        brands = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        displayBrandsAdmin();
        updateBrandsList(); // refresca el catálogo público
    } catch (error) {
        console.error('Error cargando marcas:', error);
    }
}

// ── Mostrar marcas en panel admin ──
function displayBrandsAdmin() {
    const container = document.getElementById('brandListContainer');
    if (!container) return;

    if (brands.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;">No hay marcas registradas. Agrega la primera arriba.</p>';
        return;
    }

    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;">
            ${brands.map(brand => `
                <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(245,124,0,0.3);border-radius:10px;padding:12px;text-align:center;">
                    ${brand.logoUrl
                        ? `<div style="height:60px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
                               <img src="${brand.logoUrl}" style="max-height:60px;max-width:100%;object-fit:contain;">
                           </div>`
                        : `<div style="height:60px;display:flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:8px;">🏍️</div>`
                    }
                    <strong style="color:var(--text-accent);font-size:13px;">${brand.name}</strong><br>
                    <small style="color:#888;">${motorcycles.filter(m => m.brand === brand.name).length} modelos</small>
                    <div style="display:flex;gap:6px;margin-top:8px;justify-content:center;">
                        <button class="btn-edit" onclick="editBrand('${brand.id}')" style="padding:5px 10px;font-size:12px;">✏️</button>
                        <button class="btn-delete" onclick="deleteBrand('${brand.id}')" style="padding:5px 10px;font-size:12px;">🗑️</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ── Editar marca ──
function editBrand(id) {
    const brand = brands.find(b => b.id === id);
    if (!brand) return;
    document.getElementById('brandName').value       = brand.name;
    document.getElementById('brandLogoUrl').value    = brand.logoUrl || '';
    document.getElementById('editingBrandId').value  = id;
    if (brand.logoUrl) {
        document.getElementById('brandLogoPreview').src = brand.logoUrl;
        document.getElementById('brandLogoPreviewContainer').style.display = 'block';
    }
    document.getElementById('brandSubmitBtn').textContent = '💾 Actualizar Marca';
    document.getElementById('brandForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('✏️ Editando marca: ' + brand.name);
}

// ── Cancelar edición de marca ──
function cancelBrandEdit() {
    document.getElementById('brandForm').reset();
    document.getElementById('editingBrandId').value = '';
    document.getElementById('brandLogoPreviewContainer').style.display = 'none';
    document.getElementById('brandSubmitBtn').textContent = '➕ Agregar Marca';
}

// ── Eliminar marca ──
async function deleteBrand(id) {
    const brand = brands.find(b => b.id === id);
    const count = motorcycles.filter(m => m.brand === brand.name).length;
    if (!confirm(`¿Eliminar la marca "${brand.name}"?${count > 0 ? `\n\n⚠️ Tiene ${count} modelos registrados.` : ''}`)) return;
    try {
        await db.collection('brands').doc(id).delete();
        showToast('🗑️ Marca eliminada');
        loadBrands();
    } catch (error) {
        showToast('❌ Error: ' + error.message, 'error');
    }
}

// ============================================================
// MOTOCICLETAS
// ============================================================

// ── Preview imagen moto ──
function previewImage(input) {
    const container = document.getElementById('imagePreviewContainer');
    const preview   = document.getElementById('imagePreview');
    const urlInput  = document.getElementById('imageUrl');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            container.style.display = 'block';
            urlInput.value = '';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ── Subir imagen moto a Storage ──
async function uploadImage(file, motoName) {
    const ext      = file.name.split('.').pop();
    const fileName = `motos/${motoName.replace(/\s+/g, '_')}_${Date.now()}.${ext}`;
    const ref      = storage.ref(fileName);
    const btn      = document.getElementById('submitBtn');
    const task     = ref.put(file);
    return new Promise((resolve, reject) => {
        task.on('state_changed',
            snap => {
                const pct = Math.round(snap.bytesTransferred / snap.totalBytes * 100);
                btn.textContent = `⏳ Subiendo foto... ${pct}%`;
            },
            reject,
            async () => resolve(await task.snapshot.ref.getDownloadURL())
        );
    });
}

// ── Guardar o actualizar moto ──
async function saveMoto(event) {
    event.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = '⏳ Guardando...';

    try {
        let imageUrl = document.getElementById('imageUrl').value.trim();
        const fileInput = document.getElementById('imageFile');
        if (fileInput && fileInput.files && fileInput.files[0]) {
            const brand = document.getElementById('brand').value.trim();
            const model = document.getElementById('model').value.trim();
            imageUrl = await uploadImage(fileInput.files[0], `${brand}_${model}`);
        }

        const motoData = {
            brand:    document.getElementById('brand').value.trim(),
            model:    document.getElementById('model').value.trim(),
            cc:       document.getElementById('cc').value.trim(),
            price:    document.getElementById('price').value.trim(),
            year:     document.getElementById('year').value.trim(),
            imageUrl: imageUrl || '',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (editingMotoId) {
            await motosCollection.doc(editingMotoId).update(motoData);
            showToast('✅ Moto actualizada correctamente');
        } else {
            motoData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await motosCollection.add(motoData);
            showToast('✅ Moto agregada correctamente');
        }

        document.getElementById('motoForm').reset();
        document.getElementById('imagePreviewContainer').style.display = 'none';
        editingMotoId = null;
        btn.textContent = 'Agregar Moto';
        loadMotorcyclesForAdmin();

    } catch (error) {
        console.error('Error:', error);
        showToast('❌ Error: ' + error.message, 'error');
        btn.textContent = editingMotoId ? '💾 Actualizar Moto' : 'Agregar Moto';
    }
    btn.disabled = false;
}

// ── Cargar motos desde Firebase ──
async function loadMotorcycles() {
    try {
        const snapshot = await motosCollection.orderBy('brand').get();
        motorcycles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`✅ ${motorcycles.length} motos cargadas`);
        updateBrandsList();
    } catch (error) {
        console.error('Error al cargar:', error);
        showToast('❌ Error al cargar motos', 'error');
    }
}

async function loadMotorcyclesForAdmin() {
    await loadMotorcycles();
    displayMotorcyclesAdmin();
}

// ── Mostrar lista admin agrupada por marca ──
function displayMotorcyclesAdmin() {
    const container = document.getElementById('motoListContainer');
    if (motorcycles.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;">No hay motocicletas registradas</p>';
        return;
    }
    const brandNames = [...new Set(motorcycles.map(m => m.brand))].sort();
    container.innerHTML = brandNames.map(brand => {
        const motos = motorcycles.filter(m => m.brand === brand);
        return `
            <div style="margin-bottom:18px;">
                <div style="background:linear-gradient(135deg,#f57c00,#ff9800);padding:8px 14px;border-radius:8px 8px 0 0;font-weight:700;color:#fff;">
                    🏍️ ${brand} <span style="font-weight:400;font-size:13px;">(${motos.length} modelos)</span>
                </div>
                ${motos.map(moto => `
                    <div class="moto-item-admin" style="border-radius:0;border-top:1px solid rgba(255,255,255,0.05);">
                        ${moto.imageUrl ? `<img src="${moto.imageUrl}" style="width:50px;height:40px;object-fit:contain;border-radius:4px;margin-right:10px;background:#fff;padding:2px;">` : ''}
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
    if (moto.imageUrl) {
        document.getElementById('imagePreview').src = moto.imageUrl;
        document.getElementById('imagePreviewContainer').style.display = 'block';
    }
    document.getElementById('submitBtn').textContent = '💾 Actualizar Moto';
    document.getElementById('motoForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('✏️ Editando: ' + moto.brand + ' ' + moto.model);
}

function cancelEdit() {
    editingMotoId = null;
    document.getElementById('motoForm').reset();
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('submitBtn').textContent = 'Agregar Moto';
}

async function deleteMoto(id) {
    const moto = motorcycles.find(m => m.id === id);
    if (!confirm(`¿Eliminar ${moto.brand} ${moto.model}?`)) return;
    try {
        await motosCollection.doc(id).delete();
        showToast('🗑️ Moto eliminada');
        loadMotorcyclesForAdmin();
        updateBrandsList();
    } catch (error) {
        showToast('❌ Error: ' + error.message, 'error');
    }
}

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
