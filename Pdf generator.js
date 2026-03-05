// ======================================
// GENERADOR DE VOLANTES — Con conversión base64 para CORS
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
    if      (count === 0) { text = '0 motos seleccionadas'; color = '#999'; }
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

// ── Convertir URL a base64 para evitar CORS ──
async function toBase64(url) {
    try {
        // Intentar con proxy CORS
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error('proxy failed');
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload  = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch {
        // Si falla el proxy, devolver la URL original
        return url;
    }
}

// ── Precargar todas las imágenes como base64 ──
async function preloadImages(motos) {
    const cache = {};
    const btn = document.getElementById('pdfPreviewBtn');
    if (btn) { btn.textContent = '⏳ Cargando fotos...'; btn.disabled = true; }

    await Promise.all(motos.map(async moto => {
        if (moto.imageUrl && !cache[moto.imageUrl]) {
            cache[moto.imageUrl] = await toBase64(moto.imageUrl);
        }
    }));

    if (btn) { btn.textContent = '🎨 Generar Vista Previa'; btn.disabled = false; }
    return cache;
}

function motoCard(moto, dark, imgCache) {
    const bg     = dark ? '#1e1e1e' : '#ffffff';
    const border = dark ? '#333'    : '#eeeeee';
    const nameC  = dark ? '#ffffff' : '#111111';
    const infoC  = dark ? '#aaaaaa' : '#777777';
    const imgSrc = imgCache[moto.imageUrl] || moto.imageUrl;

    return `
    <div style="
        background:${bg};
        border:2px solid ${border};
        border-radius:10px;
        overflow:hidden;
        display:flex;
        flex-direction:column;
        height:100%;
    ">
        <div style="
            flex:1;
            background:${dark?'#111':'#f5f5f5'};
            display:flex;
            align-items:center;
            justify-content:center;
            padding:6px;
            min-height:0;
        ">
            ${imgSrc
                ? `<img src="${imgSrc}" style="max-width:100%;max-height:100%;object-fit:contain;">`
                : `<span style="font-size:36px;">🏍️</span>`
            }
        </div>
        <div style="padding:8px 10px 10px;flex-shrink:0;">
            <div style="color:#f57c00;font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">${moto.brand}</div>
            <div style="color:${nameC};font-size:14px;font-weight:800;line-height:1.2;margin:2px 0 3px;">${moto.model}</div>
            <div style="color:${infoC};font-size:10px;margin-bottom:6px;">${moto.cc} • ${moto.year}</div>
            <div style="background:linear-gradient(135deg,#f57c00,#ff9800);color:#fff;padding:6px;border-radius:6px;font-size:15px;font-weight:900;text-align:center;">
                ${moto.price}
            </div>
        </div>
    </div>`;
}

function buildPage(motos, pageNum, totalPages, imgCache) {
    const dark   = pageNum % 2 === 0;
    const pageBg = dark ? '#111111' : '#ff9800';
    const titleC = dark ? '#ff9800' : '#ffffff';
    const subC   = dark ? '#cccccc' : 'rgba(255,255,255,0.9)';
    const title  = pageNum === 1 ? 'MOTOMANIA JC' : 'MÁS MODELOS';
    const sub    = pageNum === 1 ? '¡Las Mejores Motos al Mejor Precio!' : '¡Variedad y Calidad Garantizada!';
    const isLast = pageNum === totalPages;
    const cols   = 3;
    const rows   = Math.ceil(motos.length / cols);

    return `
    <div style="
        width:190mm;
        height:277mm;
        background:${pageBg};
        font-family:Arial,sans-serif;
        padding:10px;
        box-sizing:border-box;
        display:flex;
        flex-direction:column;
        overflow:hidden;
    ">
        <div style="text-align:center;margin-bottom:8px;flex-shrink:0;">
            <h1 style="color:${titleC};font-size:${pageNum===1?'34px':'30px'};font-weight:900;margin:0 0 2px;letter-spacing:2px;">${title}</h1>
            <p style="color:${subC};font-size:12px;margin:0;font-weight:600;">${sub}</p>
        </div>

        <div style="
            display:grid;
            grid-template-columns:repeat(${cols},1fr);
            grid-template-rows:repeat(${rows},1fr);
            gap:8px;
            flex:1;
            min-height:0;
        ">
            ${motos.map(m => `
                <div style="min-height:0;display:flex;flex-direction:column;">
                    ${motoCard(m, dark, imgCache)}
                </div>
            `).join('')}
        </div>

        ${isLast ? `
        <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:8px;flex-shrink:0;">
            <div style="background:${dark?'#1e1e1e':'rgba(0,0,0,0.15)'};border-radius:8px;padding:10px;text-align:center;color:#fff;">
                <div style="font-size:12px;font-weight:800;margin-bottom:4px;">🌐 CATÁLOGO COMPLETO</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=https://jafetht07.github.io/MOTOMANIA-JC"
                     style="border-radius:4px;border:2px solid #f57c00;">
                <div style="font-size:9px;margin-top:3px;opacity:0.9;">jafetht07.github.io/MOTOMANIA-JC</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
                <div style="background:linear-gradient(135deg,#f57c00,#ff9800);border-radius:8px;padding:8px;text-align:center;color:#fff;font-size:12px;font-weight:800;">
                    🏍 FINANCIAMIENTO DISPONIBLE 🏍
                </div>
                <div style="background:${dark?'#1e1e1e':'rgba(0,0,0,0.15)'};border-radius:8px;padding:8px;color:#fff;font-size:11px;text-align:center;flex:1;">
                    ☎️ +506 7011 7033<br>
                    ☎️ +506 8935 4332<br>
                    📘 Motomania JC<br>
                    <span style="color:#ff9800;font-weight:700;">¡Tu moto ideal te espera!</span>
                </div>
            </div>
        </div>
        ` : ''}
    </div>`;
}

async function generatePDF() {
    const selected = [];
    document.querySelectorAll('#motoSelector input:checked').forEach(cb => {
        selected.push(motorcycles[parseInt(cb.id.split('-')[1])]);
    });

    if (selected.length === 0) { alert('⚠️ Selecciona al menos una moto'); return; }

    const btn = document.querySelector('[onclick="generatePDF()"]');
    if (btn) { btn.textContent = '⏳ Cargando fotos...'; btn.disabled = true; }

    // Precargar todas las imágenes como base64
    const imgCache = await preloadImages(selected);

    if (btn) { btn.textContent = '🎨 Generar Vista Previa'; btn.disabled = false; }

    const pages = [];
    for (let i = 0; i < selected.length; i += 9) pages.push(selected.slice(i, i + 9));

    document.getElementById('pdfContent').innerHTML = pages.map((motos, i) => `
        <div style="margin-bottom:20px;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.3);">
            ${buildPage(motos, i + 1, pages.length, imgCache)}
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
        const pdf   = new jsPDF('p', 'mm', 'letter');
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < pages.length; i++) {
            btn.textContent = `⏳ Página ${i+1}/${pages.length}...`;
            await new Promise(r => setTimeout(r, 300));

            const canvas = await html2canvas(pages[i], {
                scale: 2,
                useCORS: false,   // false porque ya convertimos a base64
                allowTaint: true,
                backgroundColor: null,
                logging: false,
                width: pages[i].scrollWidth,
                height: pages[i].scrollHeight,
            });

            if (i > 0) pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pageW, pageH);
        }

        pdf.save('Volante_MotoMania_JC.pdf');

    } catch (err) {
        console.error(err);
        alert('❌ Error: ' + err.message);
    }

    btn.textContent = '🧾 Descargar PDF';
    btn.disabled = false;
}
