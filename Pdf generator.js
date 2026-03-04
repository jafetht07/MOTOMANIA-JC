// ======================================
// MÓDULO GENERADOR DE VOLANTES PDF
// Imágenes perfectas sin recorte — A4 exacto
// ======================================

function loadMotoSelector() {
    const selector = document.getElementById('motoSelector');
    selector.innerHTML = '';

    if (motorcycles.length === 0) {
        selector.innerHTML = '<p style="color:#999;text-align:center;">No hay motos cargadas.</p>';
        return;
    }

    const brands = [...new Set(motorcycles.map(m => m.brand))].sort();
    brands.forEach(brand => {
        const brandMotos = motorcycles.filter(m => m.brand === brand);

        const brandHeader = document.createElement('div');
        brandHeader.style.cssText = 'grid-column:1/-1;background:linear-gradient(135deg,#f57c00,#ff9800);padding:6px 12px;border-radius:6px;color:#fff;font-weight:700;font-size:13px;margin-top:10px;';
        brandHeader.textContent = '🏍️ ' + brand;
        selector.appendChild(brandHeader);

        brandMotos.forEach(moto => {
            const globalIndex = motorcycles.indexOf(moto);
            const div = document.createElement('div');
            div.className = 'moto-checkbox';
            div.innerHTML = `
                <label>
                    <input type="checkbox" id="moto-${globalIndex}" onchange="updateSelectedCount()">
                    <div>
                        <strong>${moto.model}</strong><br>
                        <small>${moto.cc} • ${moto.price}</small>
                    </div>
                </label>
            `;
            div.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT') return;
                const cb = div.querySelector('input');
                cb.checked = !cb.checked;
                updateSelectedCount();
            });
            selector.appendChild(div);
        });
    });

    updateSelectedCount();
}

function updateSelectedCount() {
    const count = document.querySelectorAll('#motoSelector input:checked').length;
    let text, color;
    if      (count === 0)  { text = '0 motos seleccionadas (recomendado: 9-12)'; color = '#999'; }
    else if (count < 9)    { text = `${count} motos seleccionadas (recomendado: 9-12)`; color = '#ff9800'; }
    else if (count > 12)   { text = `${count} motos seleccionadas ⚠️ Puede que no quepan bien`; color = '#ef5350'; }
    else                   { text = `${count} motos seleccionadas ✓ Cantidad óptima`; color = '#4caf50'; }

    const el = document.getElementById('selectedCount');
    el.textContent = text;
    el.style.color = color;

    document.querySelectorAll('.moto-checkbox').forEach(div => {
        div.classList.toggle('selected', div.querySelector('input').checked);
    });
}

function generatePDF() {
    const selected = [];
    document.querySelectorAll('#motoSelector input:checked').forEach(cb => {
        const index = parseInt(cb.id.split('-')[1]);
        selected.push(motorcycles[index]);
    });

    if (selected.length === 0) {
        alert('⚠️ Selecciona al menos una moto');
        return;
    }

    const count   = selected.length;
    const cols    = count <= 2 ? 2 : count <= 4 ? 2 : count <= 6 ? 3 : count <= 9 ? 3 : 3;

    // Tamaños según cantidad de motos
    const small   = count > 9;
    const imgH    = small ? '65px'  : '95px';
    const titleSz = small ? '10px'  : '13px';
    const priceSz = small ? '13px'  : '17px';
    const brandSz = small ? '10px'  : '13px';
    const padding = small ? '6px'   : '10px';

    const cards = selected.map(moto => `
        <div style="
            border: 2px solid #f57c00;
            border-radius: 8px;
            padding: ${padding};
            text-align: center;
            background: #fff;
            page-break-inside: avoid;
            break-inside: avoid;
            display: flex;
            flex-direction: column;
            align-items: center;
        ">
            <!-- Contenedor de imagen con relación de aspecto fija -->
            <div style="
                width: 100%;
                height: ${imgH};
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                margin-bottom: 4px;
                background: #f9f9f9;
                border-radius: 5px;
            ">
                ${moto.imageUrl
                    ? `<img src="${moto.imageUrl}"
                            style="max-width:100%;max-height:100%;object-fit:contain;display:block;"
                            crossorigin="anonymous">`
                    : `<span style="font-size:28px;">🏍️</span>`
                }
            </div>

            <div style="background:linear-gradient(135deg,#f57c00,#ff9800);color:#fff;padding:3px 6px;border-radius:4px;font-weight:700;font-size:${brandSz};width:100%;margin-bottom:3px;">
                ${moto.brand.toUpperCase()}
            </div>
            <div style="font-size:${titleSz};font-weight:700;color:#222;margin:2px 0;line-height:1.2;">
                ${moto.model}
            </div>
            <div style="color:#666;font-size:10px;margin:2px 0;">
                ${moto.cc} &nbsp;•&nbsp; ${moto.year}
            </div>
            <div style="background:#f57c00;color:#fff;padding:4px;border-radius:4px;margin-top:4px;font-size:${priceSz};font-weight:800;width:100%;">
                ${moto.price}
            </div>
        </div>
    `).join('');

    document.getElementById('pdfContent').innerHTML = `
        <div style="font-family:Arial,sans-serif;width:190mm;margin:0 auto;background:#fff;color:#000;">

            <!-- Encabezado -->
            <div style="text-align:center;background:linear-gradient(135deg,#f57c00,#ff9800);padding:12px 20px;border-radius:8px;color:#fff;margin-bottom:10px;">
                <h1 style="font-size:26px;margin:0 0 3px 0;font-weight:900;letter-spacing:1px;">🏍️ MOTOMANIA JC</h1>
                <p style="font-size:12px;margin:0;">¡Las Mejores Motos al Mejor Precio!</p>
            </div>

            <!-- Grid de motos -->
            <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:7px;margin-bottom:10px;">
                ${cards}
            </div>

            <!-- Pie -->
            <div style="background:linear-gradient(135deg,#f57c00,#ff9800);padding:10px 16px;border-radius:8px;color:#fff;text-align:center;">
                <h2 style="margin:0 0 6px 0;font-size:14px;font-weight:800;">🏍 FINANCIAMIENTO DISPONIBLE 🏍</h2>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;font-size:11px;">
                    <div><strong>📞 Llamar</strong><br>+506 7011 7033<br>+506 8935 4332</div>
                    <div><strong>💬 WhatsApp</strong><br>+506 7011 7033<br>+506 8935 4332</div>
                    <div><strong>🌐 Catálogo</strong><br>jafetht07.github.io<br>/MOTOMANIA-JC</div>
                </div>
                <p style="margin:6px 0 0 0;font-size:12px;font-weight:700;">📘 Facebook: Motomania JC &nbsp;|&nbsp; ¡Tu moto ideal te espera!</p>
            </div>
        </div>
    `;

    document.getElementById('pdfPreview').style.display = 'block';
    document.getElementById('pdfPreview').scrollIntoView({ behavior: 'smooth' });
}

async function generarVolantePDF() {
    const volante = document.getElementById('pdfCaptureArea');
    if (!volante) { alert('No se encontró el contenedor.'); return; }

    const btn = event.target;
    btn.textContent = '⏳ Generando...';
    btn.disabled = true;

    try {
        // Esperar que las imágenes carguen
        const imgs = volante.querySelectorAll('img');
        await Promise.all([...imgs].map(img =>
            img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
        ));
        await new Promise(r => setTimeout(r, 500));

        const canvas = await html2canvas(volante, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
        });

        const { jsPDF } = window.jspdf;
        const pdf    = new jsPDF('p', 'mm', 'a4');
        const pageW  = pdf.internal.pageSize.getWidth();
        const pageH  = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const usableW = pageW - margin * 2;
        const imgH    = canvas.height * usableW / canvas.width;

        if (imgH <= pageH - margin * 2) {
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, usableW, imgH);
        } else {
            // Escalar para que quepa en una página
            const scale  = (pageH - margin * 2) / imgH;
            const finalW = usableW * scale;
            const finalH = imgH * scale;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pageW - finalW) / 2, margin, finalW, finalH);
        }

        pdf.save('Volante_MotoMania_JC.pdf');

    } catch (error) {
        console.error('Error PDF:', error);
        alert('❌ Error al generar el PDF: ' + error.message);
    }

    btn.textContent = '🧾 Descargar PDF';
    btn.disabled = false;
}
