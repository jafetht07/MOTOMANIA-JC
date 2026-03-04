// ======================================
// MÓDULO DE TABS DEL PANEL ADMIN
// ======================================

function switchTab(tab) {
    // Quitar clase activa de todos
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    const tabMap = {
        manage: { btn: "switchTab('manage')", content: 'manageTab',  onLoad: loadMotorcyclesForAdmin },
        pdf:    { btn: "switchTab('pdf')",    content: 'pdfTab',     onLoad: loadMotoSelector },
        stats:  { btn: "switchTab('stats')",  content: 'statsTab',   onLoad: loadStats }
    };

    const selected = tabMap[tab];
    if (!selected) return;

    document.querySelector(`[onclick="${selected.btn}"]`).classList.add('active');
    document.getElementById(selected.content).classList.add('active');

    if (typeof selected.onLoad === 'function') selected.onLoad();
}