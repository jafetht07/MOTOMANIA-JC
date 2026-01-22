// ======================================
// CONFIGURACIÓN DE FIREBASE
// ======================================
// INSTRUCCIONES:
// 1. Ve a https://console.firebase.google.com
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a Configuración del proyecto > Tus apps > Agregar app > Web
// 4. Copia los valores de configuración y pégalos aquí abajo

const firebaseConfig = {
  apiKey: "AIzaSyDS5U3KPh1vVh5KLuC8AW58dRt83Z1fOMo",
  authDomain: "motomania-jc.firebaseapp.com",
  projectId: "motomania-jc",
  storageBucket: "motomania-jc.firebasestorage.app",
  messagingSenderId: "684443268454",
  appId: "1:684443268454:web:871504a8400c077e5244a7"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencia a Firestore
const db = firebase.firestore();

// Colección de motocicletas
const motosCollection = db.collection('motorcycles');

console.log('✅ Firebase inicializado correctamente');