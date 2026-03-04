// ============================================================
// SCRIPT DE IMPORTACIÓN MASIVA - MotoMania JC
// ============================================================
// INSTRUCCIONES:
//   1. Abre una terminal en la carpeta del proyecto
//   2. Ejecuta: npm install firebase-admin
//   3. Ve a Firebase Console → Configuración → Cuentas de servicio
//   4. Haz clic en "Generar nueva clave privada"
//   5. Guarda el archivo JSON como "serviceAccount.json" en esta misma carpeta
//   6. Ejecuta: node importar-motos.js
//
//   Para limpiar datos anteriores antes de importar:
//   node importar-motos.js --limpiar
// ============================================================

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'motomania-jc'
});

const db = admin.firestore();
const motosCollection = db.collection('motorcycles');

// ── URL base de imágenes en GitHub Pages ──
const BASE = 'https://jafetht07.github.io/MOTOMANIA-JC/';

// ============================================================
// BASE DE DATOS COMPLETA — 113 MOTOCICLETAS CON IMÁGENES
// ============================================================
const todasLasMotos = [

    // ── Honda (13 modelos) ──
    { brand: 'Honda', model: 'XR190L',       cc: '190cc', price: '₡2.193.900', year: '2026', imageUrl: BASE + 'Honda XR190CT.jpeg' },
    { brand: 'Honda', model: 'NX190',         cc: '190cc', price: '₡2.254.900', year: '2026', imageUrl: BASE + 'Honda NX190.jpeg' },
    { brand: 'Honda', model: 'XR150L',        cc: '150cc', price: '₡1.823.900', year: '2026', imageUrl: BASE + 'Honda XR150L 2025.jpeg' },
    { brand: 'Honda', model: 'CRF300L',       cc: '300cc', price: '₡4.528.900', year: '2025', imageUrl: BASE + 'Honda CRF300L.jpeg' },
    { brand: 'Honda', model: 'XR300',         cc: '300cc', price: '₡3.985.900', year: '2025', imageUrl: BASE + 'Honda XR300.jpeg' },
    { brand: 'Honda', model: 'NAVI 110',      cc: '110cc', price: '₡1.057.900', year: '2025', imageUrl: BASE + 'Honda NAVI 110.jpeg' },
    { brand: 'Honda', model: 'XRE300',        cc: '300cc', price: '₡4.100.000', year: '2024', imageUrl: BASE + 'Honda XRE300.jpeg' },
    { brand: 'Honda', model: 'XBLADE 160',    cc: '160cc', price: '₡1.260.900', year: '2025', imageUrl: BASE + 'Honda XBLADE 160.jpeg' },
    { brand: 'Honda', model: 'CB160 HORNET',  cc: '160cc', price: '₡1.361.900', year: '2025', imageUrl: BASE + 'Honda CB160 HORNET.jpeg' },
    { brand: 'Honda', model: 'CRF250F',       cc: '250cc', price: '₡3.816.900', year: '2024', imageUrl: BASE + 'Honda CRF250F.jpeg' },
    { brand: 'Honda', model: 'CB190R',        cc: '190cc', price: '₡1.970.900', year: '2026', imageUrl: BASE + 'Honda CB190R.jpeg' },
    { brand: 'Honda', model: 'CB300 TWISTER', cc: '300cc', price: '₡2.698.900', year: '2025', imageUrl: BASE + 'Honda CB300 TWISTER.jpeg' },
    { brand: 'Honda', model: 'XR250 TORNADO', cc: '250cc', price: '₡3.420.900', year: '2025', imageUrl: BASE + 'Honda XR250 TORNADO.jpeg' },

    // ── KTM (4 modelos) ──
    { brand: 'KTM', model: 'DUKE 200', cc: '200cc', price: '₡2.765.900', year: '2025', imageUrl: BASE + 'KTM DUKE 200.jpeg' },
    { brand: 'KTM', model: 'DUKE 250', cc: '250cc', price: '₡3.876.900', year: '2025', imageUrl: BASE + 'KTM DUKE 250.jpeg' },
    { brand: 'KTM', model: 'DUKE 790', cc: '790cc', price: '₡7.529.900', year: '2025', imageUrl: BASE + 'KTM DUKE 790.jpeg' },
    { brand: 'KTM', model: 'DUKE 390', cc: '390cc', price: '₡5.097.900', year: '2025', imageUrl: BASE + 'KTM DUKE 390.jpeg' },

    // ── Formula (15 modelos) ──
    { brand: 'Formula', model: 'NANO SPEED 230', cc: '230cc', price: '₡1.241.900', year: '2025', imageUrl: BASE + 'Formula NANO SPEED 230.jpeg' },
    { brand: 'Formula', model: 'NANO R 200',     cc: '200cc', price: '₡1.190.900', year: '2026', imageUrl: BASE + 'Formula NANO R 200.jpeg' },
    { brand: 'Formula', model: 'CYCLONE 250',    cc: '250cc', price: '₡1.613.900', year: '2026', imageUrl: BASE + 'Formula CYCLONE 250.jpeg' },
    { brand: 'Formula', model: 'KPT',            cc: '200cc', price: '₡2.217.900', year: '2026', imageUrl: BASE + 'Formula KPT.jpeg' },
    { brand: 'Formula', model: 'NANO BASIC',     cc: '200cc', price: '₡1.009.900', year: '2026', imageUrl: BASE + 'Formula NANO BASIC.jpeg' },
    { brand: 'Formula', model: 'X2',             cc: '200cc', price: '₡1.130.900', year: '2026', imageUrl: BASE + 'Formula X2.jpeg' },
    { brand: 'Formula', model: 'NEXUS',          cc: '150cc', price: '₡1.009.900', year: '2026', imageUrl: BASE + 'Formula NEXUS.jpeg' },
    { brand: 'Formula', model: 'FABIO',          cc: '200cc', price: '₡1.190.900', year: '2026', imageUrl: BASE + 'Formula FABIO.jpeg' },
    { brand: 'Formula', model: 'MAGNUM',         cc: '200cc', price: '₡1.130.900', year: '2026', imageUrl: BASE + 'Formula MAGNUM.jpeg' },
    { brand: 'Formula', model: 'NANO 250S',      cc: '250cc', price: '₡1.251.900', year: '2026', imageUrl: BASE + 'Formula NANO 250S.jpeg' },
    { brand: 'Formula', model: 'GO 150',         cc: '150cc', price: '₡1.130.900', year: '2026', imageUrl: BASE + 'Formula GO 150.jpeg' },
    { brand: 'Formula', model: 'LX250',          cc: '250cc', price: '₡1.492.900', year: '2026', imageUrl: BASE + 'Formula LX250.jpeg' },
    { brand: 'Formula', model: 'LX200',          cc: '200cc', price: '₡1.372.900', year: '2026', imageUrl: BASE + 'Formula LX200.jpeg' },
    { brand: 'Formula', model: 'REBEL 250',      cc: '250cc', price: '₡1.553.900', year: '2026', imageUrl: BASE + 'Formula REBEL 250.jpeg' },
    { brand: 'Formula', model: 'TEKKEN 300',     cc: '300cc', price: '₡1.734.900', year: '2026', imageUrl: BASE + 'Formula TEKKEN 300.jpeg' },

    // ── Yamaha (10 modelos) ──
    { brand: 'Yamaha', model: 'R3',        cc: '321cc', price: '₡5.010.900', year: '2024', imageUrl: BASE + 'Yamaha R3 2024.jpeg' },
    { brand: 'Yamaha', model: 'FZN150D',   cc: '150cc', price: '₡2.037.900', year: '2025', imageUrl: BASE + 'Yamaha FZN150D.jpeg' },
    { brand: 'Yamaha', model: 'FZN150',    cc: '150cc', price: '₡2.037.900', year: '2025', imageUrl: BASE + 'Yamaha FZN150.jpeg' },
    { brand: 'Yamaha', model: 'FZN150DA',  cc: '150cc', price: '₡2.163.900', year: '2025', imageUrl: BASE + 'Yamaha FZN150DA.jpeg' },
    { brand: 'Yamaha', model: 'XTZ150',    cc: '150cc', price: '₡2.288.900', year: '2025', imageUrl: BASE + 'Yamaha XTZ150.jpeg' },
    { brand: 'Yamaha', model: 'FZN250',    cc: '250cc', price: '₡2.738.900', year: '2025', imageUrl: BASE + 'Yamaha FZN250.jpeg' },
    { brand: 'Yamaha', model: 'XTZ125',    cc: '125cc', price: '₡1.962.900', year: '2026', imageUrl: BASE + 'Yamaha XTZ125.jpeg' },
    { brand: 'Yamaha', model: 'YBR125 ED', cc: '125cc', price: '₡1.563.900', year: '2025', imageUrl: BASE + 'Yamaha YBR125 ED.jpeg' },
    { brand: 'Yamaha', model: 'YBR125G',   cc: '125cc', price: '₡1.599.900', year: '2025', imageUrl: BASE + 'Yamaha YBR125G.jpeg' },
    { brand: 'Yamaha', model: 'MT03',      cc: '321cc', price: '₡4.817.900', year: '2025', imageUrl: BASE + 'Yamaha MT03.jpeg' },

    // ── Suzuki (5 modelos) ──
    { brand: 'Suzuki', model: 'GN125H',          cc: '125cc', price: '₡1.660.900', year: '2026', imageUrl: BASE + 'Suzuki GN125H 2025.jpeg' },
    { brand: 'Suzuki', model: 'GIXXER SFDI 150', cc: '150cc', price: '₡2.305.900', year: '2026', imageUrl: BASE + 'Suzuki GIXXER SFDI 150CC.jpeg' },
    { brand: 'Suzuki', model: 'VSTROM 250',      cc: '250cc', price: '₡3.567.900', year: '2025', imageUrl: BASE + 'Suzuki VSTROM 250CC 2025.jpeg' },
    { brand: 'Suzuki', model: 'GIXXER 250',      cc: '250cc', price: '₡3.153.150', year: '2024', imageUrl: BASE + 'Suzuki GIXXER 250CC 2024.jpeg' },
    { brand: 'Suzuki', model: 'AX4',             cc: '115cc', price: '₡1.112.900', year: '2025', imageUrl: BASE + 'Suzuki AX4 2025.jpeg' },

    // ── Freedom (11 modelos) ──
    { brand: 'Freedom', model: 'Hercules VII', cc: '200cc', price: '₡1.361.900', year: '2025', imageUrl: BASE + 'Hercules VII 2025.jpeg' },
    { brand: 'Freedom', model: 'Carrera 220',  cc: '220cc', price: '₡1.711.900', year: '2025', imageUrl: BASE + 'Freedom Carrera 2025.jpeg' },
    { brand: 'Freedom', model: 'HR250',        cc: '250cc', price: '₡1.528.900', year: '2025', imageUrl: BASE + 'Freedom HR250.jpeg' },
    { brand: 'Freedom', model: 'HERCULES 150', cc: '150cc', price: '₡1.047.900', year: '2026', imageUrl: BASE + 'Freedom HERCULES 150.jpeg' },
    { brand: 'Freedom', model: 'THUNDER 200',  cc: '200cc', price: '₡1.107.900', year: '2026', imageUrl: BASE + 'Freedom THUNDER 200.jpeg' },
    { brand: 'Freedom', model: 'FIRE 200',     cc: '200cc', price: '₡1.047.900', year: '2026', imageUrl: BASE + 'Freedom FIRE 200.jpeg' },
    { brand: 'Freedom', model: 'ZS200',        cc: '200cc', price: '₡1.023.900', year: '2026', imageUrl: BASE + 'Freedom ZS200.jpeg' },
    { brand: 'Freedom', model: 'ZS150',        cc: '150cc', price: '₡926.900',   year: '2026', imageUrl: BASE + 'Freedom ZS150.jpeg' },
    { brand: 'Freedom', model: 'HERCULES III', cc: '200cc', price: '₡1.445.900', year: '2026', imageUrl: BASE + 'Freedom HERCULES III.jpeg' },
    { brand: 'Freedom', model: 'RX1 200',      cc: '200cc', price: '₡2.013.900', year: '2025', imageUrl: BASE + 'Freedom RX1 200.jpeg' },
    { brand: 'Freedom', model: 'RX3',          cc: '250cc', price: '₡2.562.900', year: '2026', imageUrl: BASE + 'Freedom RX3.jpeg' },

    // ── Katana (4 modelos) ──
    { brand: 'Katana', model: 'SX2 250', cc: '250cc', price: '₡2.019.900', year: '2025', imageUrl: BASE + 'Katana SX2 2025.jpeg' },
    { brand: 'Katana', model: 'SMX 200', cc: '200cc', price: '₡1.456.900', year: '2026', imageUrl: BASE + 'Katana SMX 2025.jpeg' },
    { brand: 'Katana', model: 'GN200K',  cc: '200cc', price: '₡1.043.900', year: '2025', imageUrl: BASE + 'Katana GN200K.jpeg' },
    { brand: 'Katana', model: 'SMX150',  cc: '150cc', price: '₡1.158.900', year: '2025', imageUrl: BASE + 'Katana SMX150.jpeg' },

    // ── Serpento (7 modelos) ──
    { brand: 'Serpento', model: 'NOVA 150',      cc: '150cc', price: '₡955.900',   year: '2025', imageUrl: BASE + 'Serpento NOVA 150.jpeg' },
    { brand: 'Serpento', model: 'YARA 250R',     cc: '250cc', price: '₡1.069.900', year: '2026', imageUrl: BASE + 'Serpento YARA 250R.jpeg' },
    { brand: 'Serpento', model: 'VIPER 250',     cc: '250cc', price: '₡1.199.900', year: '2025', imageUrl: BASE + 'Serpento VIPER 250.jpeg' },
    { brand: 'Serpento', model: 'HURRICANE 250', cc: '250cc', price: '₡1.199.900', year: '2025', imageUrl: BASE + 'Serpento HURRICANE 250.jpeg' },
    { brand: 'Serpento', model: 'NAGA 200',      cc: '200cc', price: '₡1.099.900', year: '2025', imageUrl: BASE + 'Serpento NAGA 200.jpeg' },
    { brand: 'Serpento', model: 'TAYPAN R 200',  cc: '200cc', price: '₡799.900',   year: '2025', imageUrl: BASE + 'Serpento TAYPAN R 200.jpeg' },
    { brand: 'Serpento', model: 'ASPID 200',     cc: '200cc', price: '₡898.900',   year: '2026', imageUrl: BASE + 'Serpento ASPID 200.jpeg' },

    // ── Haojue (8 modelos) ──
    { brand: 'Haojue', model: 'DL160',     cc: '160cc', price: '₡2.164.900', year: '2026', imageUrl: BASE + 'Haojue DL160.jpeg' },
    { brand: 'Haojue', model: 'DR160S',    cc: '160cc', price: '₡1.978.900', year: '2026', imageUrl: BASE + 'Haojue DR160S.jpeg' },
    { brand: 'Haojue', model: 'NK150S',    cc: '150cc', price: '₡1.928.900', year: '2026', imageUrl: BASE + 'Haojue NK150S INYECTADA.jpeg' },
    { brand: 'Haojue', model: 'NK150',     cc: '150cc', price: '₡1.791.900', year: '2026', imageUrl: BASE + 'Haojue NK150.jpeg' },
    { brand: 'Haojue', model: 'HJ125',     cc: '125cc', price: '₡1.295.900', year: '2026', imageUrl: BASE + 'Haojue HJ150.jpeg' },
    { brand: 'Haojue', model: 'DM125S',    cc: '125cc', price: '₡1.074.900', year: '2026', imageUrl: BASE + 'Haojue DM125S.jpeg' },
    { brand: 'Haojue', model: 'TZ150 PRO', cc: '150cc', price: '₡1.309.900', year: '2026', imageUrl: BASE + 'Haojue TZ150 PRO.jpeg' },
    { brand: 'Haojue', model: 'KA150',     cc: '150cc', price: '₡1.369.900', year: '2026', imageUrl: BASE + 'Haojue KA150.jpeg' },

    // ── Bajaj (6 modelos) ──
    { brand: 'Bajaj', model: 'PULSAR NS200UG', cc: '200cc', price: '₡2.150.900', year: '2026', imageUrl: BASE + 'Bajaj PULSAR NS 200UG.jpeg' },
    { brand: 'Bajaj', model: 'PULSAR N160',    cc: '160cc', price: '₡1.503.900', year: '2026', imageUrl: BASE + 'Bajaj PULSAR N160.jpeg' },
    { brand: 'Bajaj', model: 'PULSAR NS125',   cc: '125cc', price: '₡1.251.900', year: '2025', imageUrl: BASE + 'Bajaj PULSAR NS125.jpeg' },
    { brand: 'Bajaj', model: 'BOXER',          cc: '150cc', price: '₡1.215.900', year: '2026', imageUrl: BASE + 'Bajaj BOXER.jpeg' },
    { brand: 'Bajaj', model: 'PULSAR NS160UG', cc: '160cc', price: '₡1.463.900', year: '2025', imageUrl: BASE + 'Bajaj PULSAR NS160UG.jpeg' },
    { brand: 'Bajaj', model: 'DOMINAR 400',    cc: '400cc', price: '₡3.557.900', year: '2026', imageUrl: BASE + 'BAJAJ DOMINAR 400.jpeg' },

    // ── Benelli (4 modelos) ──
    { brand: 'Benelli', model: 'TNT150I', cc: '150cc', price: '₡1.395.900', year: '2025', imageUrl: BASE + 'Benelli TNT150I.jpeg' },
    { brand: 'Benelli', model: '180S',    cc: '180cc', price: '₡2.207.900', year: '2025', imageUrl: BASE + 'Benelli 180S.jpeg' },
    { brand: 'Benelli', model: 'TNT250',  cc: '250cc', price: '₡2.558.900', year: '2025', imageUrl: BASE + 'Benelli TNT250.jpeg' },
    { brand: 'Benelli', model: 'TNT135',  cc: '135cc', price: '₡2.096.900', year: '2025', imageUrl: BASE + 'Benelli TNT135.jpeg' },

    // ── Vento (7 modelos) ──
    { brand: 'Vento', model: 'ALPINA',       cc: '300cc', price: '₡2.293.900', year: '2026', imageUrl: BASE + 'Vento ALPINA.jpeg' },
    { brand: 'Vento', model: 'GTS300',       cc: '300cc', price: '₡1.837.900', year: '2026', imageUrl: BASE + 'Vento GTS300.jpeg' },
    { brand: 'Vento', model: 'CROSSMAX 200', cc: '200cc', price: '₡1.206.900', year: '2025', imageUrl: BASE + 'Vento CROSSMAX 200CC.jpeg' },
    { brand: 'Vento', model: 'CROSSMAX 150', cc: '150cc', price: '₡1.148.900', year: '2026', imageUrl: BASE + 'Vento CROSSMAX 150CC.jpeg' },
    { brand: 'Vento', model: 'CRUISER 200',  cc: '200cc', price: '₡1.033.900', year: '2026', imageUrl: BASE + 'Vento CRUISER 200CC.jpeg' },
    { brand: 'Vento', model: 'CROSSMAX 250', cc: '250cc', price: '₡1.603.900', year: '2026', imageUrl: BASE + 'Vento CROSSMAX 250CC.jpeg' },
    { brand: 'Vento', model: 'THRILLER',     cc: '200cc', price: '₡1.206.900', year: '2026', imageUrl: BASE + 'Vento THRILLER.jpeg' },

    // ── TVS (6 modelos) ──
    { brand: 'TVS', model: 'RAIDER',            cc: '125cc', price: '₡1.263.900', year: '2026', imageUrl: BASE + 'TVS RAIDER.jpeg' },
    { brand: 'TVS', model: 'HLX',               cc: '150cc', price: '₡1.148.900', year: '2025', imageUrl: BASE + 'TVS HLX.jpeg' },
    { brand: 'TVS', model: 'APACHE 4V FI',      cc: '200cc', price: '₡2.297.900', year: '2026', imageUrl: BASE + 'TVS APACHE 4V FI.jpeg' },
    { brand: 'TVS', model: 'APACHE 4V',         cc: '200cc', price: '₡1.723.000', year: '2026', imageUrl: BASE + 'TVS APACHE 4V.jpeg' },
    { brand: 'TVS', model: 'APACHE RTR 160 4V', cc: '160cc', price: '₡1.723.900', year: '2026', imageUrl: BASE + 'TVS APACHE RTR 160 4V.jpeg' },
    { brand: 'TVS', model: 'APACHE RTR 160',    cc: '160cc', price: '₡1.387.900', year: '2025', imageUrl: BASE + 'TVS APACHE RTR 160.jpeg' },

    // ── Cuadraciclos (5 modelos) ──
    { brand: 'Cuadraciclos', model: 'KYMCO MXU300R', cc: '300cc', price: '₡4.015.900', year: '2025', imageUrl: BASE + 'Cuadraciclo KYMCO MXU300R.jpeg' },
    { brand: 'Cuadraciclos', model: 'KYMCO MXU400',  cc: '400cc', price: '₡5.252.900', year: '2025', imageUrl: BASE + 'Cuadraciclo KYMCO MXU400.jpeg' },
    { brand: 'Cuadraciclos', model: 'XWOLF 200',     cc: '200cc', price: '₡2.878.900', year: '2025', imageUrl: BASE + 'Cuadraciclo XWOLF 200.jpeg' },
    { brand: 'Cuadraciclos', model: 'XWOLF 300',     cc: '300cc', price: '₡4.139.900', year: '2025', imageUrl: BASE + 'Cuadraciclo XWOLF 300.jpeg' },
    { brand: 'Cuadraciclos', model: 'KYMCO MXU150',  cc: '150cc', price: '₡2.621.900', year: '2025', imageUrl: BASE + 'Cuadraciclo KYMCO MXU150.jpeg' },

    // ── BICIMOTOS (3 modelos) ──
    { brand: 'BICIMOTOS', model: 'SERPENTO BRAVO', cc: '110cc', price: '₡499.900', year: '2025', imageUrl: BASE + 'BICIMOTO SERPENTO BRAVO.jpeg' },
    { brand: 'BICIMOTOS', model: 'KATANA MINI',    cc: '110cc', price: '₡573.900', year: '2024', imageUrl: BASE + 'BICIMOTO KATANA MINI.jpeg' },
    { brand: 'BICIMOTOS', model: 'FORMULA SUPER',  cc: '110cc', price: '₡535.900', year: '2024', imageUrl: BASE + 'BICIMOTO FORMULA SUPER.jpeg' },
];

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================
async function importarMotos() {
    console.log('🏍️  MotoMania JC — Importación masiva a Firebase');
    console.log('═'.repeat(55));
    console.log(`📦 Total: ${todasLasMotos.length} motocicletas`);
    console.log(`🌐 Imágenes desde: ${BASE}`);
    console.log('═'.repeat(55));

    const snapshot = await motosCollection.limit(1).get();
    if (!snapshot.empty) {
        console.log('\n⚠️  Ya existen datos en "motorcycles".');
        if (process.argv.includes('--limpiar')) {
            await limpiarColeccion();
        } else {
            console.log('   Usa --limpiar para borrar los anteriores primero.\n');
        }
    }

    const LOTE = 10;
    let exitosos = 0;
    let fallidos = 0;

    for (let i = 0; i < todasLasMotos.length; i += LOTE) {
        const lote  = db.batch();
        const grupo = todasLasMotos.slice(i, i + LOTE);

        grupo.forEach(moto => {
            lote.set(motosCollection.doc(), {
                ...moto,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        });

        try {
            await lote.commit();
            grupo.forEach(m => {
                exitosos++;
                console.log(`  ✅ [${String(exitosos).padStart(3)}/${todasLasMotos.length}] ${m.brand.padEnd(13)} ${m.model.padEnd(20)} ${m.price}`);
            });
        } catch (err) {
            fallidos += grupo.length;
            console.error(`  ❌ Error en lote [${i}–${i + LOTE}]:`, err.message);
        }
    }

    console.log('\n' + '═'.repeat(55));
    console.log('🏁 IMPORTACIÓN COMPLETADA');
    console.log(`   ✅ Exitosas : ${exitosos}`);
    if (fallidos > 0)
    console.log(`   ❌ Fallidas : ${fallidos}`);
    console.log('═'.repeat(55));
    console.log('\n👉 Listo — las imágenes aparecerán automáticamente en el catálogo.\n');
    process.exit(0);
}

async function limpiarColeccion() {
    console.log('\n🗑️  Limpiando colección existente...');
    const todos = await motosCollection.get();
    const lote  = db.batch();
    todos.forEach(doc => lote.delete(doc.ref));
    await lote.commit();
    console.log(`   ${todos.size} registros eliminados.\n`);
}

importarMotos().catch(err => {
    console.error('\n❌ Error fatal:', err.message);
    process.exit(1);
});