/**************************************************
** MUSIC SYSTEM
**************************************************/

console.log("music.js cargado");

var musicTracks = [];
var currentTrackIndex = -1;
var currentAudio = null;
var musicEnabled = true;
var musicInitialized = false;
var musicStarted = false;

// Cargar todas las canciones disponibles
function initMusic() {
    if (musicInitialized) return;
    
    // Lista de canciones disponibles
    var trackCount = 3; // music-0.mp3, music-1.mp3, music-2.mp3
    
    for (var i = 0; i < trackCount; i++) {
        var audio = new Audio('assets/sounds/music/music-' + i + '.mp3');
        audio.addEventListener('ended', onTrackEnded);
        audio.addEventListener('error', function(e) {
            console.error("Error cargando música:", e);
        });
        audio.volume = 0.7; // Volumen por defecto 70%
        musicTracks.push(audio);
    }
    
    musicInitialized = true;
    console.log("Sistema de música inicializado. Total de canciones:", musicTracks.length);
    console.log("La música comenzará cuando interactúes con el juego (presiona una tecla o haz clic)");
}

// Intentar iniciar la música (se llama cuando el usuario interactúa)
function tryStartMusic() {
    if (!musicInitialized) {
        initMusic();
    }
    
    if (!musicStarted && musicTracks.length > 0) {
        playRandomTrack();
        musicStarted = true;
    }
}

function onTrackEnded() {
    // Cuando termina una canción, reproducir otra aleatoria
    if (musicEnabled && musicTracks.length > 0) {
        playRandomTrack();
    }
}

function playRandomTrack() {
    if (!musicEnabled || musicTracks.length === 0) return;
    
    // Seleccionar una canción aleatoria diferente a la actual
    var newIndex;
    if (musicTracks.length === 1) {
        newIndex = 0;
    } else {
        do {
            newIndex = Math.floor(Math.random() * musicTracks.length);
        } while (newIndex === currentTrackIndex && musicTracks.length > 1);
    }
    
    // Detener la canción actual si está reproduciéndose
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Reproducir la nueva canción
    currentTrackIndex = newIndex;
    currentAudio = musicTracks[newIndex];
    
    // Reproducir la canción
    currentAudio.play().catch(function(error) {
        console.warn("No se pudo reproducir la música automáticamente:", error);
        console.log("Nota: Los navegadores requieren interacción del usuario para reproducir audio");
    });
    
    console.log("Reproduciendo canción:", currentTrackIndex);
}

function playMusic() {
    musicEnabled = true;
    if (currentAudio && currentAudio.paused) {
        currentAudio.play().catch(function(error) {
            console.warn("No se pudo reanudar la música:", error);
        });
    } else if (!currentAudio && musicTracks.length > 0) {
        playRandomTrack();
    }
}

function pauseMusic() {
    musicEnabled = false;
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
    }
}

function stopMusic() {
    musicEnabled = false;
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

function setMusicVolume(volume) {
    // Volume debe estar entre 0 y 1
    volume = Math.max(0, Math.min(1, volume));
    for (var i = 0; i < musicTracks.length; i++) {
        musicTracks[i].volume = volume;
    }
}

