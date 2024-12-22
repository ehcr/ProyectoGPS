// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBldMuK15j1my1cnAX2-gbdQvhLOxp0k_U",
    authDomain: "proyectogps-c31a8.firebaseapp.com",
    databaseURL: "https://proyectogps-c31a8-default-rtdb.firebaseio.com",
    projectId: "proyectogps-c31a8",
    storageBucket: "proyectogps-c31a8.firebasestorage.app",
    messagingSenderId: "545856747369",
    appId: "1:545856747369:web:0000b2633467457066eff8",
    measurementId: "G-S6P3XM6F77"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Elementos del DOM
const loginContainer = document.getElementById("login-container");
const gpsContainer = document.getElementById("gps-container");
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const saveMessage = document.getElementById("save-message");
const getLocationButton = document.getElementById("get-location-btn");
const logoutButton = document.getElementById("logout-btn");
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");
const googleMapIframe = document.getElementById("google-map");

// Lista de usuarios permitidos
const usuarios = [
    { username: "eric", password: "eric@2024" },
    { username: "florencia", password: "florencia@2024" }
];

let currentUser = null; // Usuario actualmente autenticado

// Manejo del formulario de login
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const usuarioValido = usuarios.find(
        (user) => user.username === username && user.password === password
    );

    if (usuarioValido) {
        currentUser = username;
        alert(`Bienvenido, ${username}!`);
        loginContainer.style.display = "none";
        gpsContainer.style.display = "block";
    } else {
        errorMessage.textContent = "Usuario o contraseña incorrectos.";
    }
});

// Obtener ubicación
getLocationButton.addEventListener("click", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                latitudeElement.textContent = `Latitud: ${latitude}`;
                longitudeElement.textContent = `Longitud: ${longitude}`;

                const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
                googleMapIframe.src = googleMapsUrl;

                saveLocationToFirebase(latitude, longitude);
            },
            (error) => {
                errorMessage.textContent = "No se pudo obtener la ubicación.";
            }
        );
    } else {
        errorMessage.textContent = "La geolocalización no es compatible.";
    }
});

// Guardar ubicación en Firebase
function saveLocationToFirebase(latitude, longitude) {
    const refUbicaciones = ref(database, "ubicaciones");
    push(refUbicaciones, {
        usuario: currentUser,
        latitude,
        longitude,
        timestamp: new Date().toISOString()
    })
        .then(() => {
            saveMessage.textContent = "Ubicación guardada correctamente.";
        })
        .catch((error) => {
            errorMessage.textContent = "Error al guardar en Firebase.";
            console.error("Error:", error);
        });
}

// Cerrar sesión
logoutButton.addEventListener("click", () => {
    gpsContainer.style.display = "none";
    loginContainer.style.display = "block";
    currentUser = null;
});
