// ======================================
// CONFIGURACIÓN DE FIREBASE
// ======================================
const firebaseConfig = {
    apiKey: "AIzaSyDS5U3KPh1vVh5KLuC8AW58dRt83Z1fOMo",
    authDomain: "motomania-jc.firebaseapp.com",
    projectId: "motomania-jc",
    storageBucket: "motomania-jc.firebasestorage.app",
    messagingSenderId: "684443268454",
    appId: "1:684443268454:web:871504a8400c077e5244a7"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const motosCollection = db.collection('motorcycles');

console.log('✅ Firebase inicializado correctamente');