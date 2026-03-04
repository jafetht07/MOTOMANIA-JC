// ======================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ======================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando MotoMania JC...');
    await loadBrands();      // Carga logos de marcas primero
    await loadMotorcycles(); // Luego las motos
});
