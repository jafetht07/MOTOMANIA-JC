// ======================================
// MÓDULO GENERADOR DE VOLANTES PDF
// Ajustado a hoja A4 con márgenes correctos
// ======================================

function loadMotoSelector() {
    const selector = document.getElementById('motoSelector');
    selector.innerHTML = '';

    if (motorcycles.length === 0) {
        selector.innerHTML = '<p style="color:#999;text-align:center;">No hay motos cargadas.</p>';
        return;
    }

    // Agrupar por marca
    const brands = [...new Set(motorcycles.map(m => m.brand))].sort();
    brands.forEach(brand => {
        const brandMotos = motorcycles.filter(m => m.brand === brand);

        const brandHeader = document.createElement('div');
        brandHeader.style.cssText = 'grid-column:1/-1;background:linear-gradient(135deg,#f57c00,#ff9800);padding:6px 12px;border-radius:6px;color:#fff;font-weight:700;font-size:13px;margin-top:10px;';
        brandHeader.textContent = '🏍️ ' + brand;
        selector.appendChild(brandHeader);

        brandMotos.forEach((moto, i) => {
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

    // Calcular columnas y filas para ajustar a A4
    // A4: 210mm x 297mm — área útil ~190mm x 270mm
    const cols = selected.length <= 4 ? 2 : selected.length <= 6 ? 2 : 3;
    const cardFontSize = selected.length > 9 ? '11px' : '13px';
    const priceFontSize = selected.length > 9 ? '14px' : '16px';
    const headerFontSize = selected.length > 9 ? '13px' : '15px';
    const imgHeight = selected.length > 9 ? '70px' : '90px';

    const cards = selected.map(moto => `
        <div style="
            border:2px solid #f57c00;
            border-radius:8px;
            padding:8px;
            text-align:center;
            background:#fff;
            break-inside:avoid;
            page-break-inside:avoid;
        ">
            ${moto.imageUrl ? `
                <img src="${moto.imageUrl}"
                    style="width:100%;height:${imgHeight};object-fit:contain;margin-bottom:4px;"
                    onerror="this.style.display='none'">
            ` : ''}
            <div style="background:linear-gradient(135deg,#f57c00,#ff9800);color:#fff;padding:4px 6px;border-radius:5px;font-weight:700;font-size:${headerFontSize};margin-bottom:4px;">
                ${moto.brand.toUpperCase()}
            </div>
            <div style="font-size:${cardFontSize};font-weight:700;color:#222;margin:3px 0;">
                ${moto.model}
            </div>
            <div style="color:#666;font-size:11px;margin:2px 0;">
                ${moto.cc} &nbsp;•&nbsp; ${moto.year}
            </div>
            <div style="background:#f57c00;color:#fff;padding:5px;border-radius:5px;margin-top:5px;font-size:${priceFontSize};font-weight:700;">
                ${moto.price}
            </div>
        </div>
    `).join('');

    const content = document.getElementById('pdfContent');
    content.innerHTML = `
        <div style="
            font-family:Arial,sans-serif;
            width:190mm;
            margin:0 auto;
            background:#fff;
            color:#000;
        ">
            <!-- Encabezado -->
            <div style="
                text-align:center;
                background:linear-gradient(135deg,#f57c00,#ff9800);
                padding:14px 20px;
                border-radius:8px;
                color:#fff;
                margin-bottom:12px;
            ">
                <h1 style="font-size:28px;margin:0 0 4px 0;font-weight:900;letter-spacing:1px;">🏍️ MOTOMANIA JC</h1>
                <p style="font-size:13px;margin:0;">¡Las Mejores Motos al Mejor Precio!</p>
            </div>

            <!-- Grid de motos -->
            <div style="
                display:grid;
                grid-template-columns:repeat(${cols}, 1fr);
                gap:8px;
                margin-bottom:12px;
            ">
                ${cards}
            </div>

            <!-- Pie de contacto -->
            <div style="
                background:linear-gradient(135deg,#f57c00,#ff9800);
                padding:12px 20px;
                border-radius:8px;
                color:#fff;
                text-align:center;
            ">
                <h2 style="margin:0 0 8px 0;font-size:16px;font-weight:800;">🏍 FINANCIAMIENTO DISPONIBLE 🏍</h2>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">
                    <div>
                        <strong>📞 Llamar</strong><br>
                        +506 7011 7033<br>
                        +506 8935 4332
                    </div>
                    <div>
                        <strong>💬 WhatsApp</strong><br>
                        +506 7011 7033<br>
                        +506 8935 4332
                    </div>
                    <div>
                        <strong>🌐 Catálogo</strong><br>
                        jafetht07.github.io<br>/MOTOMANIA-JC
                    </div>
                </div>
                <p style="margin:8px 0 0 0;font-size:13px;font-weight:700;">📘 Facebook: Motomania JC &nbsp;|&nbsp; ¡Tu moto ideal te espera!</p>
            </div>
        </div>
    `;

    document.getElementById('pdfPreview').style.display = 'block';
    document.getElementById('pdfPreview').scrollIntoView({ behavior: 'smooth' });
}

async function generarVolantePDF() {
    const volante = document.getElementById('pdfCaptureArea');
    if (!volante) { alert('No se encontró el contenedor.'); return; }

    try {
        const btn = event.target;
        btn.textContent = '⏳ Generando...';
        btn.disabled = true;

        await new Promise(r => setTimeout(r, 400));

        const canvas = await html2canvas(volante, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: volante.scrollWidth,
            height: volante.scrollHeight,
        });

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const pageW  = pdf.internal.pageSize.getWidth();   // 210mm
        const pageH  = pdf.internal.pageSize.getHeight();  // 297mm
        const margin = 10; // mm
        const usableW = pageW - margin * 2;
        const imgH    = canvas.height * usableW / canvas.width;

        // Si cabe en una página
        if (imgH <= pageH - margin * 2) {
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, usableW, imgH);
        } else {
            // Si es muy largo, escalar para que quepa
            const scale  = (pageH - margin * 2) / imgH;
            const finalW = usableW * scale;
            const finalH = imgH * scale;
            const offsetX = (pageW - finalW) / 2;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, margin, finalW, finalH);
        }

        pdf.save('Volante_MotoMania_JC.pdf');
        btn.textContent = '🧾 Descargar PDF';
        btn.disabled = false;

    } catch (error) {
        console.error('Error PDF:', error);
        alert('❌ Error: ' + error.message);
    }
}