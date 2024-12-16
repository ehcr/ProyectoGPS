// script.js

// Elementos del DOM
const latitudeElement = document.getElementById('latitude');
const longitudeElement = document.getElementById('longitude');
const errorMessage = document.getElementById('error-message');
const getLocationButton = document.getElementById('get-location-btn');

// Función para obtener la ubicación
getLocationButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                latitudeElement.textContent = `Latitud: ${latitude}`;
                longitudeElement.textContent = `Longitud: ${longitude}`;
                errorMessage.textContent = ''; // Limpia errores
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage.textContent = 'Permiso denegado por el usuario.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage.textContent = 'La información de ubicación no está disponible.';
                        break;
                    case error.TIMEOUT:
                        errorMessage.textContent = 'La solicitud de ubicación ha caducado.';
                        break;
                    default:
                        errorMessage.textContent = 'Ocurrió un error desconocido.';
                }
            }
        );
    } else {
        errorMessage.textContent = 'La Geolocalización no es compatible con este navegador.';
    }
});
