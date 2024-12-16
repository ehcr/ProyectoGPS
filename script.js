// script.js

// Elementos del DOM
const latitudeElement = document.getElementById('latitude');
const longitudeElement = document.getElementById('longitude');
const errorMessage = document.getElementById('error-message');
const getLocationButton = document.getElementById('get-location-btn');
const googleMapIframe = document.getElementById('google-map');

// Obtener la ubicación y mostrarla en Google Maps
getLocationButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Actualizar las coordenadas en la interfaz
                latitudeElement.textContent = `Latitud: ${latitude}`;
                longitudeElement.textContent = `Longitud: ${longitude}`;

                // Actualizar el mapa de Google Maps con las coordenadas
                const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`;
                googleMapIframe.src = googleMapsUrl;

                errorMessage.textContent = ''; // Limpiar errores
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
        errorMessage.textContent = 'La geolocalización no es compatible con este navegador.';
    }
});
