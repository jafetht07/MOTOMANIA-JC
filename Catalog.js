// ======================================
// MÓDULO DE CATÁLOGO PÚBLICO
// Logos: Firebase primero, GitHub como respaldo
// ======================================

const GITHUB_BASE = 'https://jafetht07.github.io/MOTOMANIA-JC/';

// Logos que ya están en GitHub — respaldo automático
const githubLogos = {
    'Benelli':      GITHUB_BASE + 'Benelli-logo.jpeg',
    'Formula':      GITHUB_BASE + 'Formula-logo.jpeg',
    'Freedom':      GITHUB_BASE + 'Freedom-logo.jpeg',
    'Haojue':       GITHUB_BASE + 'Haojue-logo.jpeg',
    'Honda':        GITHUB_BASE + 'Honda-logo.jpeg',
    'KTM':          GITHUB_BASE + 'KTM-logo.jpeg',
    'Katana':       GITHUB_BASE + 'Katana-logo.jpeg',
    'Yamaha':       GITHUB_BASE + 'Yamaha-logo.jpeg',
    'Suzuki':       GITHUB_BASE + 'Suzuki-logo.jpeg',
    'Bajaj':        GITHUB_BASE + 'Bajaj-logo.jpeg',
    'TVS':          GITHUB_BASE + 'TVS-logo.jpeg',
    'Vento':        GITHUB_BASE + 'Vento-logo.jpeg',
    'Serpento':     GITHUB_BASE + 'Serpento-logo.jpeg',
    'BICIMOTOS':    GITHUB_BASE + 'Bicimotos-logo.jpeg',
    'Cuadraciclos': GITHUB_BASE + 'Cuadraciclos-logo.jpeg',
};

// ── Obtener logo de una marca (Firebase primero, GitHub como respaldo) ──
function getBrandLogo(brandName) {
    // Buscar en Firebase brands
    if (typeof brands !== 'undefined') {
        const fbBrand = brands.find(b => b.name === brandName);
        if (fbBrand && fbBrand.logoUrl) return fbBrand.logoUrl;
    }
    // Respaldo: logo en GitHub
    return githubLogos[brandName] || '';
}

// ── Actualizar selector y grid de marcas ──
function updateBrandsList() {
    const brandNames = [...new Set(motorcycles.map(m => m.brand))].sort();

    // Selector dropdown
    const select = document.getElementById('marca');
    select.innerHTML = '<option value="">--Seleccionar--</option>';
    brandNames.forEach(brand => {
        select.innerHTML += `<option value="${brand}">${brand}</option>`;
    });

    // Grid de logos
    const container = document.getElementById('brandsContainer');
    container.innerHTML = brandNames.map(brand => {
        const logoUrl = getBrandLogo(brand);
        return `
            <div class="brand" onclick="showBrandMotos('${brand}')">
                ${logoUrl
                    ? `<div class="brand-logo-wrapper">
                           <img src="${logoUrl}" alt="${brand}"
                                onerror="this.closest('.brand-logo-wrapper').innerHTML='<span style=font-size:2rem>🏍️</span>'">
                       </div>`
                    : `<div style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;font-size:2rem;">🏍️</div>`
                }
                <p>${brand}</p>
            </div>
        `;
    }).join('');
}

// ── Mostrar motos al clicar una marca en el grid ──
function showBrandMotos(brand) {
    document.getElementById('marca').value = brand;
    showModels();
}

// ── Mostrar modelos de la marca seleccionada ──
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

function hideMotoSection() {
    document.getElementById('moto-section').style.display = 'none';
    document.getElementById('marca').value = '';
}

function sendMessage(moto) {
    const message = `¡Hola! Jafeth, estoy interesado en una motocicleta. Me gustaría saber más información sobre el modelo ${moto}.`;
    window.open(`https://wa.me/+50689354332?text=${encodeURIComponent(message)}`, '_blank');
}
