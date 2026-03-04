// ======================================
// MÓDULO DE CATÁLOGO PÚBLICO
// ======================================

// Logos de marcas (agrega más según necesites)
const brandLogos = {
    Honda:       'honda-logo.jpeg',
    KTM:         'KTM-logo.jpeg',
    Yamaha:      'yamaha-logo.jpeg',
    Suzuki:      'suzuki-logo.jpeg',
    Formula:     'Formula-logo.jpeg',
    Freedom:     'Freedom-logo.jpeg',
    Serpento:    'Serpento-logo.jpeg',
    Haojue:      'Haojue-logo.jpeg',
    Bajaj:       'bajaj-logo.jpeg',
    Vento:       'Vento-logo.jpeg',
    TVS:         'tvs-logo.jpeg',
    Benelli:     'Benelli-logo.jpeg',
    Cuadraciclos:'',          // sin logo propio
    Katana:      'Katana-logo.jpeg',
    BICIMOTOS:   ''
};

// ── Actualizar selector y grid de marcas ──
function updateBrandsList() {
    const brands = [...new Set(motorcycles.map(m => m.brand))].sort();

    // Selector del menú
    const select = document.getElementById('marca');
    select.innerHTML = '<option value="">--Seleccionar--</option>';
    brands.forEach(brand => {
        select.innerHTML += `<option value="${brand}">${brand}</option>`;
    });

    // Grid de logos
    const container = document.getElementById('brandsContainer');
    container.innerHTML = brands.map(brand => {
        const logo = brandLogos[brand] || '';
        return `
            <div class="brand" onclick="showBrandMotos('${brand}')">
                ${logo
                    ? `<img src="${logo}" alt="${brand}" onerror="this.style.display='none'">`
                    : `<div style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;font-size:2rem;">🏍️</div>`
                }
                <p>${brand}</p>
            </div>
        `;
    }).join('');
}

// ── Mostrar motos de una marca (desde el grid) ──
function showBrandMotos(brand) {
    document.getElementById('marca').value = brand;
    showModels();
}

// ── Mostrar modelos de la marca seleccionada en el select ──
function showModels() {
    const marca = document.getElementById('marca').value;
    if (!marca) return;

    const section   = document.getElementById('moto-section');
    const title     = document.getElementById('marca-titulo');
    const container = document.getElementById('moto-models');

    title.textContent = marca;

    const brandMotos = motorcycles.filter(m => m.brand === marca);

    if (brandMotos.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;">No hay modelos registrados para esta marca.</p>';
    } else {
        container.innerHTML = brandMotos.map(moto => `
            <div class="moto-item">
                ${moto.imageUrl
                    ? `<div class="moto-image-wrapper">
                         <img src="${moto.imageUrl}" alt="${moto.model}" class="moto-image"
                              onerror="this.closest('.moto-image-wrapper').style.display='none'">
                       </div>`
                    : ''
                }
                <h3>${moto.model}</h3>
                <p>Cilindraje: ${moto.cc}</p>
                <p>Precio: ${moto.price}</p>
                <p>Año: ${moto.year}</p>
                <button onclick="sendMessage('${moto.brand} ${moto.model}')">Cotizar</button>
            </div>
        `).join('');
    }

    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
}

// ── Cerrar sección de motos ──
function hideMotoSection() {
    document.getElementById('moto-section').style.display = 'none';
    document.getElementById('marca').value = '';
}

// ── Enviar mensaje de WhatsApp ──
function sendMessage(moto) {
    const message = `¡Hola! Jafeth, estoy interesado en una motocicleta. Me gustaría saber más información sobre el modelo ${moto}.`;
    const whatsappUrl = `https://wa.me/+50689354332?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
