// ======================================
// MÓDULO DE TABS DEL PANEL ADMIN
// ======================================

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const tabMap = {
        manage: { content: 'manageTab',  onLoad: loadMotorcyclesForAdmin },
        brands: { content: 'brandsTab',  onLoad: () => { loadBrands(); } },
        pdf:    { content: 'pdfTab',     onLoad: loadMotoSelector },
        stats:  { content: 'statsTab',   onLoad: loadStats }
    };

    const selected = tabMap[tab];
    if (!selected) return;

    // Activar botón correcto
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('onclick') === `switchTab('${tab}')`) {
            btn.classList.add('active');
        }
    });

    document.getElementById(selected.content).classList.add('active');
    if (typeof selected.onLoad === 'function') selected.onLoad();
}
