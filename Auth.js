// ======================================
// MÓDULO DE AUTENTICACIÓN
// ======================================
const ADMIN_USER = 'jc1874cr';
const ADMIN_PASS = 'qwrt2107';
let isLoggedIn = false;

function showLogin() {
    if (isLoggedIn) {
        document.getElementById('adminPanel').style.display = 'block';
        loadMotorcyclesForAdmin();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        document.getElementById('loginModal').style.display = 'flex';
    }
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginError').textContent = '';
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        isLoggedIn = true;
        closeLogin();
        document.getElementById('adminPanel').style.display = 'block';
        loadMotorcyclesForAdmin();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        document.getElementById('loginError').textContent = '❌ Usuario o contraseña incorrectos';
    }
}

function logout() {
    isLoggedIn = false;
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}