// script.js

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycby-5hyAVP8ej-38MSKxibjot44sS0o-WCH-4lc2XSI5FnQVucdBJSXdlZcseQSBpp54jg/exec"; // Reemplaza con tu URL

// Elementos del DOM
const loginContainer = document.getElementById("login-container");
const gpsContainer = document.getElementById("gps-container");
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const getLocationButton = document.getElementById("get-location-btn");
const logoutButton = document.getElementById("logout-btn");
const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");
const googleMapIframe = document.getElementById("google-map");

// Histórico
const locationHistoryElement = document.getElementById("location-history");

// Lista de usuarios permitidos
const usuarios = [
    { username: "eric", password: "eric@2024" },
    { username: "florencia", password: "florencia@2024" }
];

// Variable para almacenar el usuario actual
let currentUser = null;

// Manejo del formulario de login
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validar credenciales
    const usuarioValido = usuarios.find(
        (user) => user.username === username && user.password === password
    );

    if (usuarioValido) {
        currentUser = username; // Guardar el usuario actual
        alert(`Bienvenido, ${username}!`);
        loginContainer.style.display = "none";
        gpsContainer.style.display = "block";
        displayLocationHistory(); // Cargar histórico
    } else {
        errorMessage.textContent = "Usuario o contraseña incorrectos.";
    }
});

// Obtener ubicación y guardar en Google Sheets
getLocationButton.addEventListener("click", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Actualizar las coordenadas actuales
                latitudeElement.textContent = `Latitud: ${latitude}`;
                longitudeElement.textContent = `Longitud: ${longitude}`;

                // Actualizar el mapa
                const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
                googleMapIframe.src = googleMapsUrl;

                // Guardar ubicación en Google Sheets
                saveLocationToGoogleSheets(latitude, longitude);
            },
            (error) => {
                errorMessage.textContent = "No se pudo obtener la ubicación.";
            }
        );
    } else {
        errorMessage.textContent = "La geolocalización no es compatible.";
    }
});

// Guardar ubicación en Google Sheets
function saveLocationToGoogleSheets(latitude, longitude) {
    if (!currentUser) {
        console.error("No se ha identificado al usuario.");
        return;
    }

    fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: currentUser,
            latitude,
            longitude
        })
    })
        .then((response) => {
            if (response.ok) {
                displayLocationHistory(); // Actualizar el historial después de guardar
            } else {
                throw new Error("Error al guardar la ubicación.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// Mostrar el histórico desde Google Sheets
function displayLocationHistory() {
    if (!currentUser) {
        console.error("No se ha identificado al usuario.");
        return;
    }

    fetch(`${GOOGLE_SHEETS_URL}?usuario=${currentUser}`)
        .then((response) => response.json())
        .then((data) => {
            // Limpiar la lista actual
            locationHistoryElement.innerHTML = "";

            // Agregar cada ubicación al historial
            data.forEach((entry) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${entry.timestamp}: Latitud ${entry.latitude}, Longitud ${entry.longitude}`;
                locationHistoryElement.appendChild(listItem);
            });
        })
        .catch((error) => {
            console.error("Error al cargar el histórico:", error);
        });
}

// Cerrar sesión
logoutButton.addEventListener("click", () => {
    gpsContainer.style.display = "none";
    loginContainer.style.display = "block";
    currentUser = null; // Limpiar el usuario actual
});
