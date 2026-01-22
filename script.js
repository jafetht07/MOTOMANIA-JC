// ======================================
// VARIABLES GLOBALES
// ======================================
const ADMIN_USER = 'jc1874cr';
const ADMIN_PASS = 'qwrt2107';
let isLoggedIn = false;
let motorcycles = [];
let editingMotoId = null;

// ======================================
// AUTENTICACIÓN
// ======================================
function showLogin() {
    if (isLoggedIn) {
        document.getElementById('adminPanel').style.display = 'block';
        loadMotorcyclesForAdmin();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        document.getElementById('loginModal').style.display = 'flex';
    }
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        isLoggedIn = true;
        closeLogin();
        document.getElementById('adminPanel').style.display = 'block';
        loadMotorcyclesForAdmin();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        document.getElementById('loginError').textContent = '❌ Usuario o contraseña incorrectos';
    }
}

function logout() {
    isLoggedIn = false;
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// ======================================
// GESTIÓN DE TABS
// ======================================
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    if (tab === 'manage') {
        document.querySelector('[onclick="switchTab(\'manage\')"]').classList.add('active');
        document.getElementById('manageTab').classList.add('active');
    } else if (tab === 'pdf') {
        document.querySelector('[onclick="switchTab(\'pdf\')"]').classList.add('active');
        document.getElementById('pdfTab').classList.add('active');
        loadMotoSelector();
    } else {
        document.querySelector('[onclick="switchTab(\'stats\')"]').classList.add('active');
        document.getElementById('statsTab').classList.add('active');
        loadStats();
    }
}

// ======================================
// CRUD DE MOTOCICLETAS CON FIREBASE
// ======================================

// Guardar o actualizar motocicleta
async function saveMoto(event) {
    event.preventDefault();
    
    const motoData = {
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        cc: document.getElementById('cc').value,
        price: document.getElementById('price').value,
        year: document.getElementById('year').value,
        imageUrl: document.getElementById('imageUrl').value || '',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        if (editingMotoId) {
            // Actualizar moto existente
            await motosCollection.doc(editingMotoId).update(motoData);
            alert('✅ Moto actualizada correctamente');
        } else {
            // Agregar nueva moto
            motoData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await motosCollection.add(motoData);
            alert('✅ Moto agregada correctamente');
        }
        
        document.getElementById('motoForm').reset();
        editingMotoId = null;
        document.getElementById('submitBtn').textContent = 'Agregar Moto';
        loadMotorcyclesForAdmin();
        
    } catch (error) {
        console.error('Error al guardar moto:', error);
        alert('❌ Error al guardar la moto: ' + error.message);
    }
}

// Cargar motocicletas desde Firebase
async function loadMotorcycles() {
    try {
        const snapshot = await motosCollection.get();
        motorcycles = [];
        
        snapshot.forEach(doc => {
            motorcycles.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ ${motorcycles.length} motocicletas cargadas`);
        updateBrandsList();
        
    } catch (error) {
        console.error('Error al cargar motocicletas:', error);
    }
}

// Cargar motos para el panel de administración
async function loadMotorcyclesForAdmin() {
    await loadMotorcycles();
    displayMotorcyclesAdmin();
}

// Mostrar motos en el panel de administración
function displayMotorcyclesAdmin() {
    const container = document.getElementById('motoListContainer');
    
    if (motorcycles.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No hay motocicletas registradas</p>';
        return;
    }
    
    let html = '';
    motorcycles.forEach(moto => {
        html += `
            <div class="moto-item-admin">
                <div class="moto-item-admin-info">
                    <strong style="color: var(--text-accent);">${moto.brand} ${moto.model}</strong><br>
                    <small>${moto.cc} • ${moto.price} • ${moto.year}</small>
                </div>
                <div class="moto-item-admin-actions">
                    <button class="btn-edit" onclick="editMoto('${moto.id}')">✏️ Editar</button>
                    <button class="btn-delete" onclick="deleteMoto('${moto.id}')">🗑️ Eliminar</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Editar motocicleta
function editMoto(id) {
    const moto = motorcycles.find(m => m.id === id);
    if (!moto) return;
    
    editingMotoId = id;
    document.getElementById('brand').value = moto.brand;
    document.getElementById('model').value = moto.model;
    document.getElementById('cc').value = moto.cc;
    document.getElementById('price').value = moto.price;
    document.getElementById('year').value = moto.year;
    document.getElementById('imageUrl').value = moto.imageUrl || '';
    document.getElementById('submitBtn').textContent = 'Actualizar Moto';
    
    window.scrollTo({ top: document.getElementById('motoForm').offsetTop - 100, behavior: 'smooth' });
}

// Cancelar edición
function cancelEdit() {
    editingMotoId = null;
    document.getElementById('motoForm').reset();
    document.getElementById('submitBtn').textContent = 'Agregar Moto';
}

// Eliminar motocicleta
async function deleteMoto(id) {
    const moto = motorcycles.find(m => m.id === id);
    if (!confirm(`¿Estás seguro de eliminar ${moto.brand} ${moto.model}?`)) return;
    
    try {
        await motosCollection.doc(id).delete();
        alert('✅ Moto eliminada correctamente');
        loadMotorcyclesForAdmin();
    } catch (error) {
        console.error('Error al eliminar moto:', error);
        alert('❌ Error al eliminar la moto: ' + error.message);
    }
}

// ======================================
// FUNCIONES DE VISUALIZACIÓN PÚBLICA
// ======================================

// Actualizar lista de marcas
function updateBrandsList() {
    const brands = [...new Set(motorcycles.map(m => m.brand))].sort();
    
    // Actualizar selector
    const select = document.getElementById('marca');
    select.innerHTML = '<option value="">--Seleccionar--</option>';
    brands.forEach(brand => {
        select.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
    
    // Actualizar contenedor de marcas (si tienes logos, agrégalos aquí)
    const brandsContainer = document.getElementById('brandsContainer');
    brandsContainer.innerHTML = brands.map(brand => `
        <div class="brand" onclick="showBrandMotos('${brand}')">
            <img src="${brand.toLowerCase()}-logo.jpeg" alt="${brand}" onerror="this.src='placeholder-logo.png'">
            <p>${brand}</p>
        </div>
    `).join('');
}

// Mostrar motos por marca
function showBrandMotos(brand) {
    document.getElementById('marca').value = brand;
    showModels();
}

// Mostrar modelos de marca seleccionada
function showModels() {
    const marca = document.getElementById('marca').value;
    if (!marca) return;
    
    const section = document.getElementById('moto-section');
    const title = document.getElementById('marca-titulo');
    const container = document.getElementById('moto-models');
    
    title.textContent = marca;
    
    const brandMotos = motorcycles.filter(m => m.brand === marca);
    
    container.innerHTML = brandMotos.map(moto => `
        <div class="moto-item">
            ${moto.imageUrl ? `<img src="${moto.imageUrl}" alt="${moto.model}" class="moto-image" onerror="this.style.display='none'">` : ''}
            <h3>${moto.model}</h3>
            <p>Cilindraje: ${moto.cc}</p>
            <p>Precio: ${moto.price}</p>
            <p>Año: ${moto.year}</p>
            <button onclick="sendMessage('${moto.brand} ${moto.model}')">Cotizar</button>
        </div>
    `).join('');
    
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
}

function hideMotoSection() {
    document.getElementById('moto-section').style.display = 'none';
}

// Enviar mensaje de WhatsApp
function sendMessage(moto) {
    const message = `¡Hola! Estoy interesado en una motocicleta, me gustaría saber más información sobre el modelo ${moto}.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+50689354332?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// ======================================
// GENERADOR DE PDF
// ======================================

function loadMotoSelector() {
    const selector = document.getElementById('motoSelector');
    selector.innerHTML = '';

    motorcycles.forEach((moto, index) => {
        const div = document.createElement('div');
        div.className = 'moto-checkbox';
        div.innerHTML = `
            <label>
                <input type="checkbox" id="moto-${index}" onchange="updateSelectedCount()">
                <div>
                    <strong>${moto.brand} ${moto.model}</strong><br>
                    <small>${moto.cc} • ${moto.price}</small>
                </div>
            </label>
        `;
        div.onclick = (e) => {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = div.querySelector('input');
                checkbox.checked = !checkbox.checked;
                updateSelectedCount();
            }
            div.classList.toggle('selected', div.querySelector('input').checked);
        };
        selector.appendChild(div);
    });
}

function updateSelectedCount() {
    const count = document.querySelectorAll('#motoSelector input:checked').length;
    const countText = count === 0 ? '0 motos seleccionadas (recomendado: 9-12)' :
                      count < 9 ? `${count} motos seleccionadas (recomendado: 9-12)` :
                      count > 12 ? `${count} motos seleccionadas ⚠️ Muchas motos` :
                      `${count} motos seleccionadas ✓ Cantidad óptima`;
    
    document.getElementById('selectedCount').textContent = countText;
    
    document.querySelectorAll('.moto-checkbox').forEach(div => {
        div.classList.toggle('selected', div.querySelector('input').checked);
    });
}

function generatePDF() {
    const selected = [];
    document.querySelectorAll('#motoSelector input:checked').forEach((checkbox) => {
        const index = parseInt(checkbox.id.split('-')[1]);
        selected.push(motorcycles[index]);
    });

    if (selected.length === 0) {
        alert('⚠️ Por favor selecciona al menos una moto');
        return;
    }

    const preview = document.getElementById('pdfPreview');
    const content = document.getElementById('pdfContent');
    
    let html = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; background: linear-gradient(135deg, #f57c00, #ff9800); padding: 30px; border-radius: 10px; color: white; margin-bottom: 30px;">
                <h1 style="font-size: 42px; margin: 0 0 10px 0; font-weight: bold;">MOTOMANIA JC</h1>
                <p style="font-size: 20px; margin: 0;">¡Las Mejores Motos al Mejor Precio!</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
    `;

    selected.forEach(moto => {
        html += `
            <div style="border: 3px solid #f57c00; border-radius: 12px; padding: 15px; text-align: center; background: #fff;">
                <div style="background: linear-gradient(135deg, #f57c00, #ff9800); color: white; padding: 8px; border-radius: 8px; margin-bottom: 10px; font-weight: bold; font-size: 18px;">
                    ${moto.brand.toUpperCase()}
                </div>
                <div style="font-size: 20px; font-weight: bold; color: #333; margin: 10px 0;">
                    ${moto.model}
                </div>
                <div style="color: #666; margin: 5px 0;">
                    ${moto.cc} • ${moto.year}
                </div>
                <div style="background: #f57c00; color: white; padding: 10px; border-radius: 8px; margin-top: 10px; font-size: 22px; font-weight: bold;">
                    ${moto.price}
                </div>
            </div>
        `;
    });

    html += `
            </div>
            
            <div style="background: linear-gradient(135deg, #f57c00, #ff9800); padding: 25px; border-radius: 10px; color: white; text-align: center;">
                <h2 style="margin: 0 0 15px 0; font-size: 28px;">🏍 FINANCIAMIENTO DISPONIBLE 🏍</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                    <div>
                        <p style="margin: 5px 0;"><strong>📞 Llamar:</strong></p>
                        <p style="margin: 5px 0;">+506 7011 7033</p>
                        <p style="margin: 5px 0;">+506 8935 4332</p>
                    </div>
                    <div>
                        <p style="margin: 5px 0;"><strong>💬 WhatsApp:</strong></p>
                        <p style="margin: 5px 0;">+506 7011 7033</p>
                        <p style="margin: 5px 0;">+506 8935 4332</p>
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid rgba(255,255,255,0.3);">
                    <p style="margin: 5px 0;"><strong>🌐 Catálogo Completo:</strong></p>
                    <p style="margin: 5px 0; font-size: 18px;">jafetht07.github.io/MOTOMANIA-JC</p>
                    <p style="margin: 5px 0;"><strong>📘 Facebook:</strong> Motomania JC</p>
                </div>
                <p style="margin: 20px 0 0 0; font-size: 24px; font-weight: bold;">¡Tu moto ideal te espera!</p>
            </div>
        </div>
    `;

    content.innerHTML = html;
    preview.style.display = 'block';
    preview.scrollIntoView({ behavior: 'smooth' });
}

async function generarVolantePDF() {
    const volante = document.getElementById("pdfCaptureArea");
    if (!volante) {
        alert("No se encontró el contenedor del volante.");
        return;
    }
    
    await new Promise(res => setTimeout(res, 200));
    const canvas = await html2canvas(volante, { scale: 3, useCORS: true, allowTaint: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("Volante_MotoMania_JC.pdf");
}

// ======================================
// ESTADÍSTICAS
// ======================================

function loadStats() {
    const statsContent = document.getElementById('statsContent');
    
    const brands = [...new Set(motorcycles.map(m => m.brand))];
    const avgPrice = motorcycles.reduce((sum, m) => {
        const price = parseInt(m.price.replace(/[^\d]/g, ''));
        return sum + price;
    }, 0) / motorcycles.length;

    const brandStats = brands.map(brand => {
        const brandMotos = motorcycles.filter(m => m.brand === brand);
        return {
            brand,
            count: brandMotos.length,
            avgPrice: brandMotos.reduce((sum, m) => sum + parseInt(m.price.replace(/[^\d]/g, '')), 0) / brandMotos.length
        };
    });

    let html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            <div style="background: linear-gradient(135deg, #f57c00, #ff9800); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; opacity: 0.9;">Total de Motos</h3>
                <p style="margin: 0; font-size: 48px; font-weight: bold;">${motorcycles.length}</p>
            </div>
            <div style="background: linear-gradient(135deg, #4caf50, #66bb6a); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; opacity: 0.9;">Marcas Disponibles</h3>
                <p style="margin: 0; font-size: 48px; font-weight: bold;">${brands.length}</p>
            </div>
            <div style="background: linear-gradient(135deg, #2196f3, #42a5f5); padding: 20px; border-radius: 12px; text-align: center; color: white;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; opacity: 0.9;">Precio Promedio</h3>
                <p style="margin: 0; font-size: 32px; font-weight: bold;">₡${Math.round(avgPrice).toLocaleString()}</p>
            </div>
        </div>

        <h3 style="color: var(--text-accent); margin: 30px 0 20px 0;">📊 Motos por Marca:</h3>
        <div style="display: grid; gap: 10px;">
    `;

    brandStats.sort((a, b) => b.count - a.count).forEach(stat => {
        const percentage = (stat.count / motorcycles.length * 100).toFixed(1);
        html += `
            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px; border-left: 4px solid #f57c00;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: var(--text-accent);">${stat.brand}</strong>
                    <span style="color: var(--text-light);">${stat.count} modelos (${percentage}%)</span>
                </div>
                <div style="background: rgba(255, 255, 255, 0.1); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #f57c00, #ff9800); height: 100%; width: ${percentage}%; transition: width 0.3s ease;"></div>
                </div>
                <div style="margin-top: 5px; font-size: 14px; color: #999;">
                    Precio promedio: ₡${Math.round(stat.avgPrice).toLocaleString()}
                </div>
            </div>
        `;
    });

    html += '</div>';
    statsContent.innerHTML = html;
}

// ======================================
// INICIALIZACIÓN
// ======================================

// Cargar motos cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando aplicación...');
    loadMotorcycles();
});
