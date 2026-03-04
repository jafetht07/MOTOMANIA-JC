// ======================================
// MÓDULO DE ESTADÍSTICAS
// ======================================

function loadStats() {
    const statsContent = document.getElementById('statsContent');

    if (motorcycles.length === 0) {
        statsContent.innerHTML = '<p style="color:#999;text-align:center;">No hay datos disponibles.</p>';
        return;
    }

    const brands = [...new Set(motorcycles.map(m => m.brand))];

    // Precio promedio general
    const avgPrice = motorcycles.reduce((sum, m) => {
        return sum + parseInt(m.price.replace(/[^\d]/g, ''));
    }, 0) / motorcycles.length;

    // Estadísticas por marca
    const brandStats = brands.map(brand => {
        const brandMotos = motorcycles.filter(m => m.brand === brand);
        const avg = brandMotos.reduce((sum, m) => sum + parseInt(m.price.replace(/[^\d]/g, '')), 0) / brandMotos.length;
        return { brand, count: brandMotos.length, avgPrice: avg };
    }).sort((a, b) => b.count - a.count);

    // Moto más cara y más barata
    const sortedByPrice = [...motorcycles].sort((a, b) =>
        parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''))
    );
    const cheapest = sortedByPrice[0];
    const priciest = sortedByPrice[sortedByPrice.length - 1];

    statsContent.innerHTML = `
        <!-- Resumen general -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-bottom:30px;">
            <div style="background:linear-gradient(135deg,#f57c00,#ff9800);padding:20px;border-radius:12px;text-align:center;color:#fff;">
                <h3 style="margin:0 0 8px 0;font-size:14px;opacity:.9;">Total de Motos</h3>
                <p style="margin:0;font-size:48px;font-weight:bold;">${motorcycles.length}</p>
            </div>
            <div style="background:linear-gradient(135deg,#4caf50,#66bb6a);padding:20px;border-radius:12px;text-align:center;color:#fff;">
                <h3 style="margin:0 0 8px 0;font-size:14px;opacity:.9;">Marcas Disponibles</h3>
                <p style="margin:0;font-size:48px;font-weight:bold;">${brands.length}</p>
            </div>
            <div style="background:linear-gradient(135deg,#2196f3,#42a5f5);padding:20px;border-radius:12px;text-align:center;color:#fff;">
                <h3 style="margin:0 0 8px 0;font-size:14px;opacity:.9;">Precio Promedio</h3>
                <p style="margin:0;font-size:28px;font-weight:bold;">₡${Math.round(avgPrice).toLocaleString()}</p>
            </div>
        </div>

        <!-- Más cara / más barata -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:30px;">
            <div style="background:rgba(76,175,80,.15);padding:15px;border-radius:10px;border:1px solid #4caf50;">
                <p style="margin:0 0 6px 0;color:#66bb6a;font-size:12px;font-weight:700;">💚 MÁS ECONÓMICA</p>
                <strong style="color:var(--text-accent);">${cheapest.brand} ${cheapest.model}</strong><br>
                <span style="color:#ccc;font-size:14px;">${cheapest.price}</span>
            </div>
            <div style="background:rgba(244,67,54,.15);padding:15px;border-radius:10px;border:1px solid #f44336;">
                <p style="margin:0 0 6px 0;color:#ef5350;font-size:12px;font-weight:700;">🔥 MÁS COSTOSA</p>
                <strong style="color:var(--text-accent);">${priciest.brand} ${priciest.model}</strong><br>
                <span style="color:#ccc;font-size:14px;">${priciest.price}</span>
            </div>
        </div>

        <!-- Distribución por marca -->
        <h3 style="color:var(--text-accent);margin:0 0 15px 0;">📊 Distribución por Marca</h3>
        <div style="display:grid;gap:10px;">
            ${brandStats.map(stat => {
                const pct = (stat.count / motorcycles.length * 100).toFixed(1);
                return `
                    <div style="background:rgba(255,255,255,.05);padding:15px;border-radius:8px;border-left:4px solid #f57c00;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                            <strong style="color:var(--text-accent);">${stat.brand}</strong>
                            <span style="color:var(--text-light);font-size:14px;">${stat.count} modelos (${pct}%)</span>
                        </div>
                        <div style="background:rgba(255,255,255,.1);height:8px;border-radius:4px;overflow:hidden;">
                            <div style="background:linear-gradient(90deg,#f57c00,#ff9800);height:100%;width:${pct}%;transition:width .3s ease;"></div>
                        </div>
                        <div style="margin-top:5px;font-size:13px;color:#999;">
                            Precio promedio: ₡${Math.round(stat.avgPrice).toLocaleString()}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}