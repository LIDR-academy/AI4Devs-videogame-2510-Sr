/**
 * MathMaster - Módulo de Audio y Accesibilidad Auditiva
 * Gestiona efectos de sonido, música y Text-to-Speech
 * Usa Web Audio API para generar sonidos sin archivos externos
 */

const MathMasterAudio = {
    // Estado
    audioContext: null,
    enabled: true,
    sfxVolume: 0.8,
    ttsEnabled: false,
    ttsVoice: null,

    // ==================== INICIALIZACIÓN ====================

    /**
     * Inicializa el sistema de audio
     */
    init() {
        // Crear contexto de audio (requiere interacción del usuario)
        this.audioContext = null;

        // Inicializar Text-to-Speech
        this.initTTS();

        // Cargar configuración guardada
        this.loadSettings();
    },

    /**
     * Activa el contexto de audio (debe llamarse tras interacción del usuario)
     */
    activate() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API no soportada:', e);
            }
        }
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },

    /**
     * Inicializa el sistema de Text-to-Speech
     */
    initTTS() {
        if ('speechSynthesis' in window) {
            // Esperar a que las voces estén disponibles
            window.speechSynthesis.onvoiceschanged = () => {
                const voices = window.speechSynthesis.getVoices();
                // Buscar voz en español
                this.ttsVoice = voices.find(v => v.lang.startsWith('es')) || voices[0];
            };
            // Forzar carga de voces
            window.speechSynthesis.getVoices();
        }
    },

    /**
     * Carga la configuración de audio guardada
     */
    loadSettings() {
        const settings = localStorage.getItem('mathmaster_audio_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.enabled = parsed.enabled !== false;
            this.sfxVolume = parsed.sfxVolume || 0.8;
            this.ttsEnabled = parsed.ttsEnabled || false;
        }
    },

    /**
     * Guarda la configuración de audio
     */
    saveSettings() {
        localStorage.setItem('mathmaster_audio_settings', JSON.stringify({
            enabled: this.enabled,
            sfxVolume: this.sfxVolume,
            ttsEnabled: this.ttsEnabled
        }));
    },

    // ==================== CONTROLES ====================

    /**
     * Activa/desactiva el sonido
     */
    toggleSound() {
        this.enabled = !this.enabled;
        this.saveSettings();
        return this.enabled;
    },

    /**
     * Activa/desactiva Text-to-Speech
     */
    toggleTTS() {
        this.ttsEnabled = !this.ttsEnabled;
        this.saveSettings();
        return this.ttsEnabled;
    },

    /**
     * Establece el volumen de efectos
     * @param {number} volume - Volumen de 0 a 1
     */
    setVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    },

    // ==================== EFECTOS DE SONIDO ====================

    /**
     * Reproduce el sonido de respuesta correcta
     */
    playCorrect() {
        if (!this.enabled) return;
        this.activate();

        // Sonido alegre ascendente
        this.playTone([523.25, 659.25, 783.99], [0, 0.1, 0.2], 0.15, 'sine');

        if (this.ttsEnabled) {
            this.speak('Correcto');
        }
    },

    /**
     * Reproduce el sonido de respuesta incorrecta
     */
    playIncorrect() {
        if (!this.enabled) return;
        this.activate();

        // Sonido grave descendente
        this.playTone([311.13, 233.08], [0, 0.15], 0.2, 'sawtooth', 0.3);

        if (this.ttsEnabled) {
            this.speak('Incorrecto, intenta de nuevo');
        }
    },

    /**
     * Reproduce el sonido de click/selección
     */
    playClick() {
        if (!this.enabled) return;
        this.activate();

        // Click suave
        this.playTone([800], [0], 0.05, 'sine', 0.3);
    },

    /**
     * Reproduce el sonido de hover/foco
     */
    playHover() {
        if (!this.enabled) return;
        this.activate();

        // Sonido muy suave
        this.playTone([600], [0], 0.03, 'sine', 0.15);
    },

    /**
     * Reproduce el sonido de logro desbloqueado
     */
    playAchievement() {
        if (!this.enabled) return;
        this.activate();

        // Fanfarria corta
        this.playTone(
            [523.25, 659.25, 783.99, 1046.5],
            [0, 0.15, 0.3, 0.45],
            0.2,
            'sine'
        );

        if (this.ttsEnabled) {
            setTimeout(() => this.speak('Logro desbloqueado'), 600);
        }
    },

    /**
     * Reproduce el sonido de inicio de juego
     */
    playGameStart() {
        if (!this.enabled) return;
        this.activate();

        // Sonido de inicio
        this.playTone([392, 523.25, 659.25], [0, 0.1, 0.2], 0.15, 'sine');

        if (this.ttsEnabled) {
            this.speak('Juego iniciado');
        }
    },

    /**
     * Reproduce el sonido de fin de juego/victoria
     */
    playGameComplete() {
        if (!this.enabled) return;
        this.activate();

        // Fanfarria de victoria
        this.playTone(
            [523.25, 523.25, 523.25, 659.25, 783.99, 659.25, 783.99],
            [0, 0.12, 0.24, 0.36, 0.48, 0.72, 0.84],
            0.15,
            'sine'
        );

        if (this.ttsEnabled) {
            setTimeout(() => this.speak('Felicitaciones, has completado el desafío'), 1000);
        }
    },

    /**
     * Reproduce el sonido de racha
     * @param {number} streak - Número de racha actual
     */
    playStreak(streak) {
        if (!this.enabled || streak < 3) return;
        this.activate();

        // Sonido más alto con cada racha
        const baseFreq = 523.25 + (streak * 50);
        this.playTone([baseFreq, baseFreq * 1.25], [0, 0.08], 0.1, 'sine');

        if (this.ttsEnabled && streak % 5 === 0) {
            this.speak(`Racha de ${streak}`);
        }
    },

    // ==================== GENERADOR DE TONOS ====================

    /**
     * Genera y reproduce un tono o secuencia de tonos
     * @param {number[]} frequencies - Array de frecuencias en Hz
     * @param {number[]} times - Array de tiempos de inicio en segundos
     * @param {number} duration - Duración de cada nota en segundos
     * @param {string} waveType - Tipo de onda ('sine', 'square', 'sawtooth', 'triangle')
     * @param {number} volumeMultiplier - Multiplicador de volumen (0-1)
     */
    playTone(frequencies, times, duration, waveType = 'sine', volumeMultiplier = 1) {
        if (!this.audioContext) return;

        const now = this.audioContext.currentTime;
        const masterVolume = this.sfxVolume * volumeMultiplier * 0.3; // Reducir volumen general

        frequencies.forEach((freq, i) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = waveType;
            oscillator.frequency.setValueAtTime(freq, now + times[i]);

            // Envelope ADSR simple
            gainNode.gain.setValueAtTime(0, now + times[i]);
            gainNode.gain.linearRampToValueAtTime(masterVolume, now + times[i] + 0.01);
            gainNode.gain.linearRampToValueAtTime(masterVolume * 0.7, now + times[i] + duration * 0.3);
            gainNode.gain.linearRampToValueAtTime(0, now + times[i] + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.start(now + times[i]);
            oscillator.stop(now + times[i] + duration + 0.01);
        });
    },

    // ==================== TEXT-TO-SPEECH ====================

    /**
     * Lee un texto en voz alta
     * @param {string} text - Texto a leer
     * @param {boolean} interrupt - Si debe interrumpir la lectura actual
     */
    speak(text, interrupt = true) {
        if (!this.ttsEnabled || !('speechSynthesis' in window)) return;

        if (interrupt) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.1;
        utterance.pitch = 1;
        utterance.volume = this.sfxVolume;

        if (this.ttsVoice) {
            utterance.voice = this.ttsVoice;
        }

        window.speechSynthesis.speak(utterance);
    },

    /**
     * Lee la pregunta actual
     * @param {string} question - La pregunta matemática
     */
    speakQuestion(question) {
        if (!this.ttsEnabled) return;

        // Formatear la pregunta para lectura
        let readable = question
            .replace(/×/g, ' por ')
            .replace(/÷/g, ' dividido ')
            .replace(/\+/g, ' más ')
            .replace(/−/g, ' menos ')
            .replace(/=/g, ' igual a ')
            .replace(/\?/g, ' interrogación')
            .replace(/X/g, ' equis ');

        this.speak(readable);
    },

    /**
     * Lee el resultado de la partida
     * @param {Object} results - Resultados del juego
     */
    speakResults(results) {
        if (!this.ttsEnabled) return;

        const text = `Has completado el desafío con ${results.correctAnswers} respuestas correctas ` +
            `en ${Math.floor(results.elapsedSeconds / 60)} minutos y ${results.elapsedSeconds % 60} segundos. ` +
            `Tu precisión fue del ${results.accuracy} por ciento.`;

        setTimeout(() => this.speak(text, false), 1500);
    },

    /**
     * Detiene toda la reproducción de audio
     */
    stopAll() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
};

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    MathMasterAudio.init();
});

// Activar audio con la primera interacción del usuario
document.addEventListener('click', () => {
    MathMasterAudio.activate();
}, { once: true });

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathMasterAudio;
}
