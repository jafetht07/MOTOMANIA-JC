// ======================================
// GENERADOR DE VOLANTES
// Dibuja el PDF directamente con jsPDF
// Sin html2canvas = sin error tainted canvas
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

// ── Convertir URL a base64 via proxy ──
async function toBase64(url) {
    if (!url) return null;
    if (url.startsWith('data:')) return url;
    try {
        const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const res   = await fetch(proxy, { signal: AbortSignal.timeout(12000) });
        if (!res.ok) throw new Error();
        const blob  = await res.blob();
        return new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.onerror = () => r(null); fr.readAsDataURL(blob); });
    } catch {
        return null;
    }
}

// ── Dibujar página con jsPDF directamente ──
async function drawPage(pdf, motos, pageNum, totalPages, imgCache) {
    const dark  = pageNum % 2 === 0;
    const PW    = pdf.internal.pageSize.getWidth();   // 215.9mm carta
    const PH    = pdf.internal.pageSize.getHeight();  // 279.4mm carta
    const PAD   = 5;

    // Fondo de página
    const bgColor = dark ? [17,17,17] : [245,124,0];
    pdf.setFillColor(...bgColor);
    pdf.rect(0, 0, PW, PH, 'F');

    // Header
    const title = pageNum === 1 ? 'MOTOMANIA JC' : 'MÁS MODELOS';
    const sub   = pageNum === 1 ? '¡Las Mejores Motos al Mejor Precio!' : '¡Variedad y Calidad Garantizada!';
    pdf.setTextColor(...(dark ? [245,124,0] : [255,255,255]));
    pdf.setFontSize(22);
    pdf.setFont('helvetica','bold');
    pdf.text(title, PW/2, PAD + 8, { align:'center' });
    pdf.setFontSize(9);
    pdf.setFont('helvetica','normal');
    pdf.setTextColor(...(dark ? [200,200,200] : [255,255,255]));
    pdf.text(sub, PW/2, PAD + 14, { align:'center' });

    const isLast   = pageNum === totalPages;
    const footerH  = isLast ? 32 : 0;
    const headerH  = 20;
    const cols     = 3;
    const rows     = Math.ceil(motos.length / cols);
    const gap      = 3;
    const gridW    = PW - PAD*2;
    const gridH    = PH - headerH - footerH - PAD*2;
    const cardW    = (gridW - gap*(cols-1)) / cols;
    const cardH    = (gridH - gap*(rows-1)) / rows;
    const cardBg   = dark ? [30,30,30] : [255,255,255];
    const imgBg    = dark ? [17,17,17] : [245,245,245];
    const nameC    = dark ? [255,255,255] : [17,17,17];
    const infoC    = dark ? [170,170,170] : [119,119,119];
    const imgAreaH = cardH * 0.52;

    for (let i = 0; i < motos.length; i++) {
        const moto = motos[i];
        const col  = i % cols;
        const row  = Math.floor(i / cols);
        const x    = PAD + col * (cardW + gap);
        const y    = headerH + PAD + row * (cardH + gap);

        // Fondo tarjeta con bordes redondeados
        pdf.setFillColor(...cardBg);
        pdf.roundedRect(x, y, cardW, cardH, 2, 2, 'F');

        // Borde tarjeta
        pdf.setDrawColor(...(dark ? [51,51,51] : [238,238,238]));
        pdf.setLineWidth(0.3);
        pdf.roundedRect(x, y, cardW, cardH, 2, 2, 'S');

        // Fondo imagen
        pdf.setFillColor(...imgBg);
        pdf.roundedRect(x+1, y+1, cardW-2, imgAreaH, 2, 2, 'F');

        // Imagen
        const src = imgCache[moto.imageUrl];
        if (src && src.startsWith('data:image')) {
            try {
                const fmt = src.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                // Centrar imagen manteniendo proporción
                const imgMargin = 2;
                pdf.addImage(src, fmt, x+imgMargin, y+imgMargin, cardW-imgMargin*2, imgAreaH-imgMargin, '', 'FAST');
            } catch(e) {
                // Si falla la imagen, solo mostrar fondo
            }
        }

        // Texto: marca
        const textY = y + imgAreaH + 4;
        pdf.setFontSize(6.5);
        pdf.setFont('helvetica','bold');
        pdf.setTextColor(245,124,0);
        pdf.text(moto.brand.toUpperCase(), x + cardW/2, textY, { align:'center' });

        // Modelo
        pdf.setFontSize(9);
        pdf.setTextColor(...nameC);
        pdf.text(moto.model, x + cardW/2, textY + 4.5, { align:'center' });

        // CC y año
        pdf.setFontSize(6.5);
        pdf.setFont('helvetica','normal');
        pdf.setTextColor(...infoC);
        pdf.text(`${moto.cc} • ${moto.year}`, x + cardW/2, textY + 8.5, { align:'center' });

        // Precio — fondo naranja
        const priceY = y + cardH - 8;
        const priceW = cardW - 4;
        pdf.setFillColor(245,124,0);
        pdf.roundedRect(x+2, priceY - 4, priceW, 7, 1.5, 1.5, 'F');
        pdf.setFontSize(9);
        pdf.setFont('helvetica','bold');
        pdf.setTextColor(255,255,255);
        pdf.text(moto.price, x + cardW/2, priceY + 0.5, { align:'center' });
    }

    // Footer última página
    if (isLast) {
        const fy = PH - footerH + 2;
        const hw = (PW - PAD*2 - gap) / 2;

        // Bloque izquierdo — QR
        pdf.setFillColor(...(dark ? [30,30,30] : [0,0,0,0.15]));
        pdf.setFillColor(0,0,0,0.15);
        pdf.roundedRect(PAD, fy, hw, footerH-4, 2, 2, 'F');

        // QR
        const qrData = imgCache['__qr__'];
        if (qrData) {
            try { pdf.addImage(qrData, 'PNG', PAD + hw/2 - 8, fy+2, 16, 16, '', 'FAST'); } catch {}
        }
        pdf.setFontSize(7);
        pdf.setFont('helvetica','bold');
        pdf.setTextColor(255,255,255);
        pdf.text('🌐 CATÁLOGO COMPLETO', PAD + hw/2, fy + 20, { align:'center' });
        pdf.setFontSize(6);
        pdf.setFont('helvetica','normal');
        pdf.text('jafetht07.github.io/MOTOMANIA-JC', PAD + hw/2, fy + 25, { align:'center' });

        // Bloque derecho — contacto
        const rx = PAD + hw + gap;
        pdf.setFillColor(245,124,0);
        pdf.roundedRect(rx, fy, hw, 10, 2, 2, 'F');
        pdf.setFontSize(7.5);
        pdf.setFont('helvetica','bold');
        pdf.setTextColor(255,255,255);
        pdf.text('🏍 FINANCIAMIENTO DISPONIBLE 🏍', rx + hw/2, fy+6, { align:'center' });

        pdf.setFillColor(...(dark ? [30,30,30] : [0,0,0]));
        pdf.setFillColor(0,0,0,0.15);
        pdf.roundedRect(rx, fy+12, hw, footerH-16, 2, 2, 'F');
        pdf.setFontSize(7);
        pdf.setFont('helvetica','normal');
        pdf.setTextColor(255,255,255);
        const lines = ['+506 7011 7033', '+506 8935 4332', 'Motomania JC', '¡Tu moto ideal te espera!'];
        lines.forEach((l,i) => pdf.text(l, rx+hw/2, fy+17+i*4.5, {align:'center'}));
    }
}

// ── Vista previa en pantalla ──
function generatePDF() {
    const selected = [];
    document.querySelectorAll('#motoSelector input:checked').forEach(cb => {
        selected.push(motorcycles[parseInt(cb.id.split('-')[1])]);
    });
    if (selected.length === 0) { alert('⚠️ Selecciona al menos una moto'); return; }

    // Mostrar preview simple (no usa canvas)
    const pages = [];
    for (let i = 0; i < selected.length; i += 9) pages.push(selected.slice(i, i + 9));

    document.getElementById('pdfContent').innerHTML = pages.map((motos, pi) => {
        const dark = pi % 2 === 0 ? false : true;
        const bg   = dark ? '#111' : '#f57c00';
        return `
        <div style="background:${bg};padding:16px;border-radius:10px;margin-bottom:10px;">
            <h3 style="color:${dark?'#f57c00':'#fff'};text-align:center;margin:0 0 12px;">${pi===0?'MOTOMANIA JC':'MÁS MODELOS'}</h3>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                ${motos.map(m => `
                    <div style="background:${dark?'#1e1e1e':'#fff'};border-radius:8px;overflow:hidden;text-align:center;padding:8px;">
                        ${m.imageUrl ? `<img src="${m.imageUrl}" style="width:100%;height:80px;object-fit:contain;background:${dark?'#111':'#f5f5f5'};">` : '<div style="height:80px;display:flex;align-items:center;justify-content:center;font-size:28px;">🏍️</div>'}
                        <div style="color:#f57c00;font-size:9px;font-weight:800;margin-top:4px;">${m.brand}</div>
                        <div style="color:${dark?'#fff':'#111'};font-size:12px;font-weight:800;">${m.model}</div>
                        <div style="color:${dark?'#aaa':'#777'};font-size:9px;">${m.cc} • ${m.year}</div>
                        <div style="background:#f57c00;color:#fff;border-radius:5px;padding:4px;font-size:11px;font-weight:800;margin-top:4px;">${m.price}</div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }).join('');

    document.getElementById('pdfPreview').style.display = 'block';
    document.getElementById('pdfPreview').scrollIntoView({ behavior: 'smooth' });
}

// ── Descargar PDF con jsPDF directo ──
async function generarVolantePDF() {
    const selected = [];
    document.querySelectorAll('#motoSelector input:checked').forEach(cb => {
        selected.push(motorcycles[parseInt(cb.id.split('-')[1])]);
    });
    if (selected.length === 0) { alert('⚠️ Primero genera la vista previa'); return; }

    const btn = event.target;
    btn.textContent = '⏳ Cargando fotos...';
    btn.disabled = true;

    // Convertir todas las imágenes a base64
    const imgCache = {};
    const urls = [...new Set(selected.map(m => m.imageUrl).filter(Boolean))];
    let loaded = 0;
    await Promise.all(urls.map(async url => {
        imgCache[url] = await toBase64(url);
        loaded++;
        btn.textContent = `⏳ Fotos ${loaded}/${urls.length}...`;
    }));

    // QR
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://jafetht07.github.io/MOTOMANIA-JC';
    imgCache['__qr__'] = await toBase64(qrUrl);

    btn.textContent = '⏳ Generando PDF...';

    try {
        const { jsPDF } = window.jspdf;
        const pdf   = new jsPDF('p', 'mm', 'letter');
        const pages = [];
        for (let i = 0; i < selected.length; i += 9) pages.push(selected.slice(i, i + 9));

        for (let i = 0; i < pages.length; i++) {
            btn.textContent = `⏳ Página ${i+1}/${pages.length}...`;
            if (i > 0) pdf.addPage();
            await drawPage(pdf, pages[i], i+1, pages.length, imgCache);
        }

        pdf.save('Volante_MotoMania_JC.pdf');

    } catch (err) {
        console.error(err);
        alert('❌ Error: ' + err.message);
    }

    btn.textContent = '🧾 Descargar PDF';
    btn.disabled = false;
}
