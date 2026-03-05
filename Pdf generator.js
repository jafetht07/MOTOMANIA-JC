// ======================================
// GENERADOR DE VOLANTES — Hoja completa
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
            div.innerHTML = `<label><input type="checkbox" id="moto-${idx}" onchange="updateSelectedCount()"><div><strong>${moto.model}</strong><br><small>${moto.cc} • ${moto.price}</small></div></label>`;
            div.addEventListener('click', e => { if (e.target.tagName === 'INPUT') return; const cb = div.querySelector('input'); cb.checked = !cb.checked; updateSelectedCount(); });
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

// ── Convertir imagen a base64 via proxy ──
async function toBase64(url) {
    if (!url) return null;
    // Si ya es base64 o GitHub Pages, usar directo
    if (url.startsWith('data:') || url.includes('github.io')) return url;
    try {
        const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const res   = await fetch(proxy, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) throw new Error('failed');
        const blob  = await res.blob();
        return new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
    } catch {
        return url; // fallback URL original
    }
}

// ── Página completa como tabla HTML con altura exacta ──
function buildPage(motos, pageNum, totalPages, imgCache) {
    const dark   = pageNum % 2 === 0;
    const pageBg = dark ? '#111111' : '#ff9800';
    const cardBg = dark ? '#1e1e1e' : '#ffffff';
    const imgBg  = dark ? '#111111' : '#f5f5f5';
    const nameC  = dark ? '#ffffff' : '#111111';
    const infoC  = dark ? '#aaaaaa' : '#777777';
    const titleC = dark ? '#ff9800' : '#ffffff';
    const subC   = dark ? '#cccccc' : 'rgba(255,255,255,0.9)';
    const title  = pageNum === 1 ? 'MOTOMANIA JC' : 'MÁS MODELOS';
    const sub    = pageNum === 1 ? '¡Las Mejores Motos al Mejor Precio!' : '¡Variedad y Calidad Garantizada!';
    const isLast = pageNum === totalPages;

    // A4: 794px a 96dpi aprox. Carta: 816x1056px
    // Usamos 780x1010 para el contenido
    const PW = 780;  // ancho total página
    const PH = 1010; // alto total página
    const PAD = 12;  // padding

    const headerH = 58;
    const footerH = isLast ? 115 : 0;
    const gridH   = PH - headerH - footerH - PAD * 2 - (isLast ? PAD : 0);

    const rows = Math.ceil(motos.length / 3);
    const cols = 3;
    const gap  = 8;
    const cardW = Math.floor((PW - PAD * 2 - gap * (cols - 1)) / cols);
    const cardH = Math.floor((gridH - gap * (rows - 1)) / rows);
    const imgH  = cardH - 80; // reservar espacio para texto

    const cards = motos.map(moto => {
        const src = (moto.imageUrl && imgCache[moto.imageUrl]) ? imgCache[moto.imageUrl] : (moto.imageUrl || '');
        return `
        <div style="
            width:${cardW}px;height:${cardH}px;
            background:${cardBg};
            border:2px solid ${dark?'#333':'#eeeeee'};
            border-radius:10px;
            overflow:hidden;
            display:inline-flex;
            flex-direction:column;
            vertical-align:top;
            flex-shrink:0;
        ">
            <div style="height:${imgH}px;background:${imgBg};display:flex;align-items:center;justify-content:center;padding:4px;overflow:hidden;flex-shrink:0;">
                ${src ? `<img src="${src}" style="max-width:100%;max-height:${imgH-8}px;object-fit:contain;display:block;">` : '<span style="font-size:32px;">🏍️</span>'}
            </div>
            <div style="padding:6px 8px 8px;flex:1;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <div style="color:#f57c00;font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">${moto.brand}</div>
                    <div style="color:${nameC};font-size:13px;font-weight:800;line-height:1.2;margin:1px 0 2px;">${moto.model}</div>
                    <div style="color:${infoC};font-size:9px;">${moto.cc} • ${moto.year}</div>
                </div>
                <div style="background:linear-gradient(135deg,#f57c00,#ff9800);color:#fff;padding:5px 4px;border-radius:6px;font-size:14px;font-weight:900;text-align:center;">
                    ${moto.price}
                </div>
            </div>
        </div>`;
    });

    // Organizar en filas
    const rowsHtml = [];
    for (let r = 0; r < rows; r++) {
        const rowCards = cards.slice(r * cols, (r + 1) * cols);
        rowsHtml.push(`<div style="display:flex;gap:${gap}px;margin-bottom:${r < rows-1 ? gap : 0}px;">${rowCards.join('')}</div>`);
    }

    const footer = isLast ? `
    <div style="margin-top:${PAD}px;display:flex;gap:8px;height:${footerH - PAD}px;">
        <div style="flex:1;background:${dark?'#1e1e1e':'rgba(0,0,0,0.15)'};border-radius:8px;padding:8px;text-align:center;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <div style="font-size:11px;font-weight:800;margin-bottom:4px;">🌐 CATÁLOGO COMPLETO</div>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=65x65&data=https://jafetht07.github.io/MOTOMANIA-JC" style="border-radius:4px;border:2px solid #f57c00;">
            <div style="font-size:9px;margin-top:3px;opacity:0.9;">jafetht07.github.io/MOTOMANIA-JC</div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
            <div style="background:linear-gradient(135deg,#f57c00,#ff9800);border-radius:8px;padding:8px;text-align:center;color:#fff;font-size:11px;font-weight:800;">
                🏍 FINANCIAMIENTO DISPONIBLE 🏍
            </div>
            <div style="flex:1;background:${dark?'#1e1e1e':'rgba(0,0,0,0.15)'};border-radius:8px;padding:8px;color:#fff;font-size:10px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;">
                <span>☎️ +506 7011 7033</span>
                <span>☎️ +506 8935 4332</span>
                <span>📘 Motomania JC</span>
                <span style="color:#ff9800;font-weight:700;">¡Tu moto ideal te espera!</span>
            </div>
        </div>
    </div>` : '';

    return `
    <div style="
        width:${PW}px;
        height:${PH}px;
        background:${pageBg};
        font-family:Arial,sans-serif;
        padding:${PAD}px;
        box-sizing:border-box;
        overflow:hidden;
    ">
        <div style="text-align:center;height:${headerH}px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:0;">
            <h1 style="color:${titleC};font-size:${pageNum===1?'32px':'28px'};font-weight:900;margin:0 0 2px;letter-spacing:2px;">${title}</h1>
            <p style="color:${subC};font-size:11px;margin:0;font-weight:600;">${sub}</p>
        </div>
        <div style="height:${gridH}px;overflow:hidden;">
            ${rowsHtml.join('')}
        </div>
        ${footer}
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

    // Precargar imágenes como base64
    const imgCache = {};
    await Promise.all(selected.map(async moto => {
        if (moto.imageUrl && !imgCache[moto.imageUrl]) {
            imgCache[moto.imageUrl] = await toBase64(moto.imageUrl);
        }
    }));

    if (btn) { btn.textContent = '🎨 Generar Vista Previa'; btn.disabled = false; }

    const pages = [];
    for (let i = 0; i < selected.length; i += 9) pages.push(selected.slice(i, i + 9));

    document.getElementById('pdfContent').innerHTML = pages.map((motos, i) => `
        <div style="margin-bottom:20px;display:inline-block;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.4);">
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

            const inner = pages[i].querySelector('div');
            const canvas = await html2canvas(inner, {
                scale: 2,
                useCORS: false,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
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
