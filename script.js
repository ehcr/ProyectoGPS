const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycby-5hyAVP8ej-38MSKxibjot44sS0o-WCH-4lc2XSI5FnQVucdBJSXdlZcseQSBpp54jg/exec";

// Lista de usuarios
const usuarios = [
    { username: "Eric", password: "eric@2024" },
    { username: "Florencia", password: "florencia@2024" }
];

let currentUser = null; // Usuario actualmente autenticado

const latitudeElement = document.getElementById("latitude");
const longitudeElement = document.getElementById("longitude");
const googleMapIframe = document.getElementById("google-map");
const locationHistoryElement = document.getElementById("location-history");
const errorMessage = document.getElementById("error-message");
const updateLocationButton = document.getElementById("update-location");
const loginForm = document.getElementById("login-form");
const loginCard = document.getElementById("login-card");
const mainContent = document.getElementById("main-content");
const loginErrorMessage = document.getElementById("login-error-message");

// Manejar el evento de envío del formulario de login
loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el envío por defecto del formulario

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    login(username, password);
});

// Función para iniciar sesión
function login(username, password) {
    const usuarioValido = usuarios.find(
        (user) =>
            user.username.toLowerCase() === username.toLowerCase() &&
            user.password === password
    );

    if (usuarioValido) {
        currentUser = usuarioValido.username;
        loginErrorMessage.textContent = ""; // Limpia mensajes de error
        loginCard.style.display = "none"; // Oculta el formulario de login
        mainContent.style.display = "block"; // Muestra el contenido principal
        displayLocationHistory();
    } else {
        currentUser = null;
        loginErrorMessage.textContent = "Usuario o contraseña incorrectos.";
    }
}

// Obtener la ubicación del dispositivo
function getLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            latitudeElement.textContent = `Latitud: ${latitude}`;
            longitudeElement.textContent = `Longitud: ${longitude}`;
            googleMapIframe.src = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
            saveLocationToGoogleSheets(latitude, longitude);
        },
        (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage.textContent = "Permiso denegado para obtener la ubicación.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage.textContent = "Ubicación no disponible.";
                    break;
                case error.TIMEOUT:
                    errorMessage.textContent = "Tiempo de espera agotado.";
                    break;
                default:
                    errorMessage.textContent = "Error desconocido al obtener la ubicación.";
            }
        }
    );
}

// Guardar la ubicación en Google Sheets
function saveLocationToGoogleSheets(latitude, longitude) {
    if (!currentUser) {
        errorMessage.textContent = "Debes iniciar sesión para guardar la ubicación.";
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
                displayLocationHistory();
            } else {
                errorMessage.textContent = "Error al guardar la ubicación.";
                console.error("Error al guardar:", response.statusText);
            }
        })
        .catch((error) => {
            errorMessage.textContent = "No se pudo conectar con Google Sheets.";
            console.error("Error:", error);
        });
}

// Mostrar el historial de ubicaciones
function displayLocationHistory() {
    fetch(`${GOOGLE_SHEETS_URL}?usuario=${currentUser}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el historial.");
            }
            return response.json();
        })
        .then((data) => {
            locationHistoryElement.innerHTML = ""; // Limpiar historial
            data.forEach((entry) => {
                const listItem = document.createElement("li");
                listItem.textContent = `${entry.timestamp}: Latitud ${entry.latitude}, Longitud ${entry.longitude}`;
                locationHistoryElement.appendChild(listItem);
            });
        })
        .catch((error) => {
            errorMessage.textContent = "No se pudo cargar el historial.";
            console.error("Error al cargar el histórico:", error);
        });
}

// Asignar evento al botón de actualizar ubicación
updateLocationButton.addEventListener("click", getLocation);
