// ======================================
// GENERADOR DE VOLANTES — Diseño Profesional
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
        const header = document.createElement('div');
        header.style.cssText = 'grid-column:1/-1;background:linear-gradient(135deg,#f57c00,#ff9800);padding:6px 12px;border-radius:6px;color:#fff;font-weight:700;font-size:13px;margin-top:10px;';
        header.textContent = '🏍️ ' + brand;
        selector.appendChild(header);

        brandMotos.forEach(moto => {
            const idx = motorcycles.indexOf(moto);
            const div = document.createElement('div');
            div.className = 'moto-checkbox';
            div.innerHTML = `
                <label>
                    <input type="checkbox" id="moto-${idx}" onchange="updateSelectedCount()">
                    <div><strong>${moto.model}</strong><br><small>${moto.cc} • ${moto.price}</small></div>
                </label>`;
            div.addEventListener('click', e => {
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
    if      (count === 0) { text = '0 motos seleccionadas (recomendado: 6-9 por página)'; color = '#999'; }
    else if (count <= 9)  { text = `${count} motos — 1 página`; color = '#4caf50'; }
    else if (count <= 18) { text = `${count} motos — 2 páginas`; color = '#ff9800'; }
    else                  { text = `${count} motos — ${Math.ceil(count/9)} páginas`; color = '#ef5350'; }

    const el = document.getElementById('selectedCount');
    el.textContent = text;
    el.style.color = color;

    document.querySelectorAll('.moto-checkbox').forEach(div => {
        div.classList.toggle('selected', div.querySelector('input').checked);
    });
}

// ── Generar tarjeta de moto ──
function motoCard(moto, dark = false) {
    const bg      = dark ? '#1a1a1a' : '#ffffff';
    const border  = dark ? '2px solid #333' : '2px solid #f0f0f0';
    const nameCl  = dark ? '#ffffff' : '#111111';
    const infoCl  = dark ? '#aaaaaa' : '#666666';
    const brandCl = '#f57c00';

    return `
    <div style="
        background:${bg};
        border:${border};
        border-radius:12px;
        overflow:hidden;
        box-shadow:0 4px 15px rgba(0,0,0,${dark?'0.4':'0.1'});
        display:flex;
        flex-direction:column;
    ">
        <div style="
            height:110px;
            background:${dark?'#111':'#f9f9f9'};
            display:flex;
            align-items:center;
            justify-content:center;
            padding:8px;
            overflow:hidden;
        ">
            ${moto.imageUrl
                ? `<img src="${moto.imageUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" crossorigin="anonymous">`
                : `<span style="font-size:40px;">🏍️</span>`
            }
        </div>
        <div style="padding:10px 12px 12px;">
            <div style="color:${brandCl};font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-bottom:2px;">
                ${moto.brand}
            </div>
            <div style="color:${nameCl};font-size:15px;font-weight:800;margin-bottom:4px;line-height:1.2;">
                ${moto.model}
            </div>
            <div style="color:${infoCl};font-size:11px;margin-bottom:8px;">
                ${moto.cc} &nbsp;•&nbsp; ${moto.year}
            </div>
            <div style="
                background:linear-gradient(135deg,#f57c00,#ff9800);
                color:#fff;
                padding:7px 10px;
                border-radius:8px;
                font-size:16px;
                font-weight:900;
                text-align:center;
            ">
                ${moto.price}
            </div>
        </div>
    </div>`;
}

// ── Generar página ──
function buildPage(motos, pageNum, totalPages) {
    const dark    = pageNum % 2 === 0; // páginas pares oscuras
    const pageBg  = dark ? '#111111' : '#ff9800';
    const titleCl = dark ? '#ff9800' : '#ffffff';
    const subCl   = dark ? '#cccccc' : 'rgba(255,255,255,0.9)';

    const title    = pageNum === 1 ? 'MOTOMANIA JC'   : 'MÁS MODELOS';
    const subtitle = pageNum === 1 ? '¡Las Mejores Motos al Mejor Precio!' : '¡Variedad y Calidad Garantizada!';

    const isLast = pageNum === totalPages;

    return `
    <div style="
        width:190mm;
        min-height:270mm;
        background:${pageBg};
        font-family:Arial,sans-serif;
        padding:16px;
        box-sizing:border-box;
        display:flex;
        flex-direction:column;
    ">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:14px;">
            <h1 style="
                color:${titleCl};
                font-size:${pageNum===1?'38px':'34px'};
                font-weight:900;
                margin:0 0 4px 0;
                letter-spacing:2px;
                text-shadow:0 2px 8px rgba(0,0,0,0.3);
            ">${title}</h1>
            <p style="color:${subCl};font-size:13px;margin:0;font-weight:600;">${subtitle}</p>
        </div>

        <!-- Grid de motos -->
        <div style="
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:10px;
            flex:1;
        ">
            ${motos.map(m => motoCard(m, dark)).join('')}
        </div>

        <!-- Footer solo en última página -->
        ${isLast ? `
        <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <!-- QR + web -->
            <div style="
                background:${dark?'#1a1a1a':'rgba(0,0,0,0.15)'};
                border-radius:10px;
                padding:12px;
                text-align:center;
                color:${dark?'#fff':'#fff'};
            ">
                <div style="font-size:13px;font-weight:800;margin-bottom:6px;">🌐 CATÁLOGO COMPLETO</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://jafetht07.github.io/MOTOMANIA-JC"
                     style="border-radius:6px;border:2px solid #f57c00;" crossorigin="anonymous">
                <div style="font-size:10px;margin-top:4px;opacity:0.9;">jafetht07.github.io/<br>MOTOMANIA-JC</div>
            </div>
            <!-- Contacto -->
            <div style="display:flex;flex-direction:column;gap:8px;">
                <div style="
                    background:linear-gradient(135deg,#f57c00,#ff9800);
                    border-radius:10px;
                    padding:10px 12px;
                    text-align:center;
                    color:#fff;
                    font-size:13px;
                    font-weight:800;
                ">🏍 FINANCIAMIENTO<br>DISPONIBLE 🏍</div>
                <div style="
                    background:${dark?'#1a1a1a':'rgba(0,0,0,0.15)'};
                    border-radius:10px;
                    padding:10px 12px;
                    color:#fff;
                    font-size:12px;
                    text-align:center;
                ">
                    <strong style="font-size:13px;">📍 VISÍTANOS</strong><br><br>
                    ☎️ +506 7011 7033<br>
                    ☎️ +506 8935 4332<br>
                    📘 Motomania JC<br><br>
                    <span style="color:#ff9800;font-weight:700;">¡Tu moto ideal te espera!</span>
                </div>
            </div>
        </div>
        ` : ''}
    </div>`;
}

function generatePDF() {
    const selected = [];
    document.querySelectorAll('#motoSelector input:checked').forEach(cb => {
        selected.push(motorcycles[parseInt(cb.id.split('-')[1])]);
    });

    if (selected.length === 0) {
        alert('⚠️ Selecciona al menos una moto');
        return;
    }

    // Dividir en páginas de 9
    const pages = [];
    for (let i = 0; i < selected.length; i += 9) {
        pages.push(selected.slice(i, i + 9));
    }

    document.getElementById('pdfContent').innerHTML = pages
        .map((motos, i) => `
            <div style="margin-bottom:20px;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.3);">
                ${buildPage(motos, i + 1, pages.length)}
            </div>
        `).join('');

    document.getElementById('pdfPreview').style.display = 'block';
    document.getElementById('pdfPreview').scrollIntoView({ behavior: 'smooth' });
}

async function generarVolantePDF() {
    const content = document.getElementById('pdfContent');
    const pages   = content.querySelectorAll(':scope > div');
    if (!pages.length) { alert('Primero genera la vista previa'); return; }

    const btn = event.target;
    btn.textContent = '⏳ Generando PDF...';
    btn.disabled = true;

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageW  = pdf.internal.pageSize.getWidth();
        const pageH  = pdf.internal.pageSize.getHeight();
        const margin = 8;

        for (let i = 0; i < pages.length; i++) {
            btn.textContent = `⏳ Página ${i+1}/${pages.length}...`;

            // Esperar imágenes
            const imgs = pages[i].querySelectorAll('img');
            await Promise.all([...imgs].map(img =>
                img.complete ? Promise.resolve() :
                new Promise(r => { img.onload = r; img.onerror = r; })
            ));
            await new Promise(r => setTimeout(r, 400));

            const canvas = await html2canvas(pages[i], {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
            });

            if (i > 0) pdf.addPage();

            const usableW = pageW - margin * 2;
            const imgH    = canvas.height * usableW / canvas.width;
            const finalH  = Math.min(imgH, pageH - margin * 2);
            const scale   = finalH / imgH;
            const finalW  = usableW * scale;
            const offsetX = (pageW - finalW) / 2;

            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, margin, finalW, finalH);
        }

        pdf.save('Volante_MotoMania_JC.pdf');

    } catch (err) {
        console.error(err);
        alert('❌ Error: ' + err.message);
    }

    btn.textContent = '🧾 Descargar PDF';
    btn.disabled = false;
}
