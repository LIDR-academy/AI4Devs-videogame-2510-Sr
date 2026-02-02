/**
 * MathMaster - Juego Educativo de Matemáticas
 * Desarrollado por: EFC
 * Versión: 2.0
 *
 * Modo: Desafío por Puntuación Fija
 * El jugador debe responder correctamente un número fijo de preguntas (20/30/40)
 * Si responde incorrectamente, puede reintentar hasta acertar
 * El cronómetro es ascendente (sin presión de tiempo)
 *
 * v2.0: Sistema de usuarios, logros, audio y accesibilidad
 */

// ==================== CONFIGURACIÓN DE NIVELES ====================

const LEVEL_CONFIG = {
    1: {
        name: "Básica y Tablas",
        description: "Sumas/Restas de 1 a 10. Resultado siempre positivo. Multiplicación y división de factores de 1 a 10.",
        suma: { min: 1, max: 10, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 10, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 10 }, factor2: { min: 1, max: 10 } },
        division: { divisor: { min: 1, max: 10 }, resultDecimals: 0 }
    },
    2: {
        name: "Números Medianos",
        description: "Sumas/Restas de 1 a 100. Resultado siempre positivo. Multiplicación hasta 15. División con cociente entero.",
        suma: { min: 1, max: 100, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 100, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 10 }, factor2: { min: 1, max: 15 } },
        division: { divisor: { min: 1, max: 15 }, resultDecimals: 0 }
    },
    3: {
        name: "Grandes Enteros",
        description: "Sumas/Restas de 1 a 1,000. Factores de multiplicación hasta 30. División con cociente entero.",
        suma: { min: 1, max: 1000, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 1000, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 30 }, factor2: { min: 1, max: 30 } },
        division: { divisor: { min: 1, max: 30 }, resultDecimals: 0 }
    },
    4: {
        name: "Decimales Simples",
        description: "Números hasta 10,000 con decimales simples (X.X). División con 1 decimal en resultado.",
        suma: { min: 1, max: 100, decimals: 1, allowNegative: false },
        resta: { min: 1, max: 100, decimals: 1, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 100 }, factor2: { min: 1, max: 100 } },
        division: { divisor: { min: 1, max: 50 }, resultDecimals: 1 }
    },
    5: {
        name: "Decimales Complejos",
        description: "Números hasta 100,000 con decimales (X.XXX). Multiplicación de números grandes. División con 2 decimales.",
        suma: { min: 1, max: 1000, decimals: 3, allowNegative: false },
        resta: { min: 1, max: 1000, decimals: 3, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 1000 }, factor2: { min: 1, max: 100 } },
        division: { divisor: { min: 1, max: 100 }, resultDecimals: 2 }
    },
    6: {
        name: "Números Negativos",
        description: "Suma y Resta con números negativos frecuentes (Ej: -10 + 25). Multiplicación de 3 dígitos. División con 3 decimales.",
        suma: { min: -50, max: 100, decimals: 0, allowNegative: true },
        resta: { min: -50, max: 100, decimals: 0, allowNegative: true },
        multiplicacion: { factor1: { min: 100, max: 999 }, factor2: { min: 100, max: 999 } },
        division: { divisor: { min: 1, max: 100 }, resultDecimals: 3 }
    },
    7: {
        name: "Cadenas de Operaciones",
        description: "Cadenas de suma/resta (Ej: 15 - 8 + 3). Multiplicación de 4x2 dígitos. División con decimales en divisor.",
        suma: { min: 1, max: 50, decimals: 0, allowNegative: true, chain: true },
        resta: { min: 1, max: 50, decimals: 0, allowNegative: true, chain: true },
        multiplicacion: { factor1: { min: 1000, max: 9999 }, factor2: { min: 10, max: 99 } },
        division: { divisor: { min: 1, max: 100 }, resultDecimals: 2, decimalDivisor: true }
    },
    8: {
        name: "Jerarquía Básica",
        description: "Operaciones combinadas sin paréntesis. Ej: 5 × 6 + 10 = ? o 100 ÷ 4 - 5 = ?",
        suma: { min: 1, max: 50, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 50, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 20 }, factor2: { min: 1, max: 20 } },
        division: { divisor: { min: 2, max: 10 }, resultDecimals: 0 },
        mixed: true
    },
    9: {
        name: "Pre-Álgebra",
        description: "Resolver la incógnita X. Ej: X + 15 = 27, 50 - X = 12, 4X = 48, X ÷ 5 = 15",
        suma: { min: 1, max: 100, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 100, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 12 }, factor2: { min: 1, max: 20 } },
        division: { divisor: { min: 2, max: 15 }, resultDecimals: 0 },
        algebra: true
    },
    10: {
        name: "PEMDAS/BODMAS",
        description: "Jerarquía de operaciones con paréntesis. Ej: 5 × (4 + 3) - 10 ÷ 2 = ?",
        suma: { min: 1, max: 20, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 20, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 10 }, factor2: { min: 1, max: 10 } },
        division: { divisor: { min: 2, max: 10 }, resultDecimals: 0 },
        pemdas: true
    }
};

// Iconos de operaciones
const OPERATION_ICONS = {
    suma: '+',
    resta: '−',
    multiplicacion: '×',
    division: '÷',
    tablas: 'T'
};

// Función helper para obtener nombres de operaciones traducidos
function getOperationName(operation) {
    if (typeof MathMasterI18n !== 'undefined') {
        return MathMasterI18n.getOperationName(operation);
    }
    // Fallback en caso de que i18n no esté disponible
    const names = {
        suma: 'Suma',
        resta: 'Resta',
        multiplicacion: 'Multiplicación',
        division: 'División',
        tablas: 'Tablas de Multiplicar'
    };
    return names[operation] || operation;
}

// ==================== ESTADO DE LA APLICACIÓN ====================

let appState = {
    currentUser: null,
    isGuest: false,
    dbReady: false
};

// ==================== ESTADO DEL JUEGO ====================

let gameState = {
    // Configuración seleccionada
    operation: null,
    level: null,
    selectedTable: null,
    totalQuestions: 30,

    // Estado del juego activo
    isPlaying: false,
    isPaused: false,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalAttempts: 0,
    hintsUsed: 0,
    currentQuestion: null,
    currentAnswer: null,

    // Temporizador
    startTime: null,
    elapsedSeconds: 0,
    timerInterval: null,
    pausedTime: 0
};

// ==================== ELEMENTOS DEL DOM ====================

const DOM = {};

function initDOM() {
    // Pantallas
    DOM.loginScreen = document.getElementById('login-screen');
    DOM.selectionScreen = document.getElementById('selection-screen');
    DOM.gameScreen = document.getElementById('game-screen');
    DOM.resultsScreen = document.getElementById('results-screen');
    DOM.statsScreen = document.getElementById('stats-screen');
    DOM.achievementsScreen = document.getElementById('achievements-screen');
    DOM.pauseOverlay = document.getElementById('pause-overlay');

    // Modales
    DOM.settingsModal = document.getElementById('settings-modal');
    DOM.confirmModal = document.getElementById('confirm-modal');

    // Barra superior
    DOM.topBar = document.querySelector('.top-bar');
    DOM.userBadge = document.getElementById('user-badge');
    DOM.currentUserName = document.getElementById('current-user-name');
    DOM.userMenuBtn = document.getElementById('user-menu-btn');
    DOM.userMenu = document.getElementById('user-menu');
    DOM.settingsBtn = document.getElementById('settings-btn');
    DOM.themeToggle = document.getElementById('theme-toggle');

    // Login
    DOM.usersList = document.getElementById('users-list');
    DOM.newUsernameInput = document.getElementById('new-username');
    DOM.createUserBtn = document.getElementById('create-user-btn');
    DOM.playGuestBtn = document.getElementById('play-guest-btn');

    // Controles de selección
    DOM.operationButtons = document.querySelectorAll('.operation-btn');
    DOM.levelButtons = document.querySelectorAll('.level-btn');
    DOM.levelSection = document.getElementById('level-section');
    DOM.tableSection = document.getElementById('table-section');
    DOM.tableButtons = document.querySelectorAll('.table-btn');
    DOM.questionsButtons = document.querySelectorAll('.questions-btn');
    DOM.levelDescription = document.getElementById('level-description');
    DOM.startBtn = document.getElementById('start-btn');
    DOM.statsBtn = document.getElementById('stats-btn');
    DOM.achievementsBtn = document.getElementById('achievements-btn');

    // Elementos del juego
    DOM.operationIndicator = document.getElementById('operation-indicator');
    DOM.timer = document.getElementById('timer');
    DOM.score = document.getElementById('score');
    DOM.streak = document.getElementById('streak');
    DOM.progressBar = document.getElementById('progress-bar');
    DOM.questionText = document.getElementById('question-text');
    DOM.speakQuestionBtn = document.getElementById('speak-question-btn');
    DOM.answerInput = document.getElementById('answer-input');
    DOM.submitBtn = document.getElementById('submit-btn');
    DOM.feedbackText = document.getElementById('feedback-text');
    DOM.hintText = document.getElementById('hint-text');
    DOM.numpadButtons = document.querySelectorAll('.numpad-btn');
    DOM.pauseBtn = document.getElementById('pause-btn');
    DOM.quitBtn = document.getElementById('quit-btn');

    // Elementos de pausa
    DOM.pauseScore = document.getElementById('pause-score');
    DOM.pauseTime = document.getElementById('pause-time');
    DOM.resumeBtn = document.getElementById('resume-btn');
    DOM.restartBtn = document.getElementById('restart-btn');
    DOM.pauseQuitBtn = document.getElementById('pause-quit-btn');

    // Elementos de resultados
    DOM.resultsTitle = document.getElementById('results-title');
    DOM.resultsEmoji = document.getElementById('results-emoji');
    DOM.finalScore = document.getElementById('final-score');
    DOM.totalTime = document.getElementById('total-time');
    DOM.bestStreakDisplay = document.getElementById('best-streak');
    DOM.accuracy = document.getElementById('accuracy');
    DOM.totalAttempts = document.getElementById('total-attempts');
    DOM.avgTime = document.getElementById('avg-time');
    DOM.recordSection = document.getElementById('record-section');
    DOM.unlockedAchievements = document.getElementById('unlocked-achievements');
    DOM.resultsAchievementsList = document.getElementById('results-achievements-list');
    DOM.retryBtn = document.getElementById('retry-btn');
    DOM.menuBtn = document.getElementById('menu-btn');

    // Estadísticas
    DOM.statsBackBtn = document.getElementById('stats-back-btn');
    DOM.statsContent = document.getElementById('stats-content');

    // Logros
    DOM.achievementsBackBtn = document.getElementById('achievements-back-btn');
    DOM.achievementsContent = document.getElementById('achievements-content');

    // Configuración
    DOM.closeSettingsBtn = document.getElementById('close-settings-btn');
    DOM.settingSound = document.getElementById('setting-sound');
    DOM.settingVolume = document.getElementById('setting-volume');
    DOM.settingTTS = document.getElementById('setting-tts');
    DOM.settingHighContrast = document.getElementById('setting-high-contrast');
    DOM.settingsCurrentUser = document.getElementById('settings-current-user');
    DOM.changeUserBtn = document.getElementById('change-user-btn');
    DOM.deleteAccountSection = document.getElementById('delete-account-section');
    DOM.deleteAccountBtn = document.getElementById('delete-account-btn');

    // Menú de usuario
    DOM.menuProfile = document.getElementById('menu-profile');
    DOM.menuStats = document.getElementById('menu-stats');
    DOM.menuAchievements = document.getElementById('menu-achievements');
    DOM.menuLogout = document.getElementById('menu-logout');

    // Pantalla de perfil
    DOM.profileScreen = document.getElementById('profile-screen');
    DOM.profileBackBtn = document.getElementById('profile-back-btn');
    DOM.profileUsername = document.getElementById('profile-username');
    DOM.profileCreated = document.getElementById('profile-created');
    DOM.profileLastLogin = document.getElementById('profile-last-login');
    DOM.profileTotalGames = document.getElementById('profile-total-games');
    DOM.profileAccuracy = document.getElementById('profile-accuracy');
    DOM.profileBestStreak = document.getElementById('profile-best-streak');
    DOM.profileAchievements = document.getElementById('profile-achievements');
    DOM.profileViewStats = document.getElementById('profile-view-stats');
    DOM.profileViewAchievements = document.getElementById('profile-view-achievements');

    // Confirmación
    DOM.confirmTitle = document.getElementById('confirm-title');
    DOM.confirmMessage = document.getElementById('confirm-message');
    DOM.confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    DOM.confirmOkBtn = document.getElementById('confirm-ok-btn');

    // Notificaciones
    DOM.notificationsContainer = document.getElementById('notifications-container');
}

// ==================== INICIALIZACIÓN ====================

async function init() {
    initDOM();

    // Inicializar base de datos
    try {
        await MathMasterDB.init();
        appState.dbReady = true;
    } catch (e) {
        console.warn('IndexedDB no disponible, modo invitado forzado:', e);
    }

    setupEventListeners();
    loadSettings();
    loadRecords();

    // Inicializar selector de idioma
    initLanguageSelector();

    // Escuchar cambios de idioma
    document.addEventListener('languageChanged', onLanguageChanged);

    // Mostrar usuarios existentes en login
    await refreshUsersList();
}

/**
 * Inicializa el selector de idioma
 */
function initLanguageSelector() {
    const langSelector = document.getElementById('language-selector');
    if (!langSelector) return;

    // Marcar el idioma actual como seleccionado
    updateLanguageSelectorUI();

    // Agregar listeners a los botones de idioma
    langSelector.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (MathMasterI18n.setLanguage(lang)) {
                MathMasterAudio.playClick();
            }
        });
    });
}

/**
 * Actualiza la UI del selector de idioma
 */
function updateLanguageSelectorUI() {
    const langSelector = document.getElementById('language-selector');
    if (!langSelector) return;

    const currentLang = MathMasterI18n.getCurrentLanguage();
    langSelector.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

/**
 * Handler para cambios de idioma
 */
function onLanguageChanged(e) {
    updateLanguageSelectorUI();

    // Actualizar textos dinámicos que no tienen data-i18n
    updateDynamicTexts();

    // Refrescar lista de usuarios si estamos en login
    if (DOM.loginScreen?.classList.contains('active')) {
        refreshUsersList();
    }
}

/**
 * Actualiza textos dinámicos que no usan data-i18n
 */
function updateDynamicTexts() {
    // Actualizar descripción de nivel si hay uno seleccionado
    if (gameState.level && DOM.levelDescription) {
        const levelInfo = MathMasterI18n.getLevelInfo(gameState.level);
        if (levelInfo && levelInfo.description) {
            DOM.levelDescription.textContent = levelInfo.description;
        }
    }

    // Actualizar indicador de operación si estamos en juego
    if (gameState.isPlaying) {
        updateOperationIndicator();
    }

    // Actualizar badge de usuario
    updateUserBadge();
}

function setupEventListeners() {
    // === Login ===
    DOM.createUserBtn.addEventListener('click', createNewUser);
    DOM.playGuestBtn.addEventListener('click', playAsGuest);
    DOM.newUsernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createNewUser();
    });

    // === Barra superior ===
    DOM.settingsBtn.addEventListener('click', openSettings);
    DOM.themeToggle.addEventListener('click', toggleTheme);
    DOM.userBadge?.addEventListener('click', toggleUserMenu);
    DOM.userMenuBtn?.addEventListener('click', toggleUserMenu);

    // === Menú de usuario ===
    DOM.menuProfile?.addEventListener('click', () => {
        hideUserMenu();
        showProfileScreen();
    });
    DOM.menuStats?.addEventListener('click', () => {
        hideUserMenu();
        showStatsScreen();
    });
    DOM.menuAchievements?.addEventListener('click', () => {
        hideUserMenu();
        showAchievementsScreen();
    });
    DOM.menuLogout?.addEventListener('click', () => {
        hideUserMenu();
        logout();
    });

    // === Pantalla de perfil ===
    DOM.profileBackBtn?.addEventListener('click', () => {
        showScreen('selection');
    });
    DOM.profileViewStats?.addEventListener('click', () => {
        showStatsScreen();
    });
    DOM.profileViewAchievements?.addEventListener('click', () => {
        showAchievementsScreen();
    });

    // === Cerrar menú al hacer clic fuera ===
    document.addEventListener('click', (e) => {
        if (!DOM.userBadge?.contains(e.target) && !DOM.userMenu?.contains(e.target)) {
            hideUserMenu();
        }
    });

    // === Selección de juego ===
    DOM.operationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            MathMasterAudio.playClick();
            selectOperation(btn.dataset.operation);
        });
    });

    DOM.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            MathMasterAudio.playClick();
            selectLevel(parseInt(btn.dataset.level));
        });
    });

    DOM.tableButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            MathMasterAudio.playClick();
            selectTable(btn.dataset.table);
        });
    });

    DOM.questionsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            MathMasterAudio.playClick();
            selectQuestions(parseInt(btn.dataset.questions));
        });
    });

    DOM.startBtn.addEventListener('click', () => {
        MathMasterAudio.playGameStart();
        startGame();
    });

    DOM.statsBtn?.addEventListener('click', showStatsScreen);
    DOM.achievementsBtn?.addEventListener('click', showAchievementsScreen);

    // === Juego ===
    DOM.submitBtn.addEventListener('click', checkAnswer);
    DOM.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    DOM.numpadButtons.forEach(btn => {
        btn.addEventListener('click', () => handleNumpad(btn.dataset.value));
    });

    DOM.pauseBtn.addEventListener('click', pauseGame);
    DOM.quitBtn.addEventListener('click', confirmQuit);

    DOM.speakQuestionBtn?.addEventListener('click', () => {
        MathMasterAudio.speakQuestion(gameState.currentQuestion);
    });

    // === Pausa ===
    DOM.resumeBtn.addEventListener('click', resumeGame);
    DOM.restartBtn.addEventListener('click', restartGame);
    DOM.pauseQuitBtn.addEventListener('click', quitToMenu);

    // === Resultados ===
    DOM.retryBtn.addEventListener('click', restartGame);
    DOM.menuBtn.addEventListener('click', quitToMenu);

    // === Estadísticas y Logros ===
    DOM.statsBackBtn?.addEventListener('click', () => showScreen('selection'));
    DOM.achievementsBackBtn?.addEventListener('click', () => showScreen('selection'));

    // === Configuración ===
    DOM.closeSettingsBtn?.addEventListener('click', closeSettings);
    DOM.settingSound?.addEventListener('change', () => {
        MathMasterAudio.enabled = DOM.settingSound.checked;
        MathMasterAudio.saveSettings();
        if (DOM.settingSound.checked) MathMasterAudio.playClick();
    });
    DOM.settingVolume?.addEventListener('input', () => {
        MathMasterAudio.setVolume(DOM.settingVolume.value / 100);
    });
    DOM.settingTTS?.addEventListener('change', () => {
        MathMasterAudio.ttsEnabled = DOM.settingTTS.checked;
        MathMasterAudio.saveSettings();
        updateTTSButton();
        if (DOM.settingTTS.checked) {
            MathMasterAudio.speak('Lectura de texto activada');
        }
    });
    DOM.settingHighContrast?.addEventListener('change', () => {
        setHighContrast(DOM.settingHighContrast.checked);
    });
    DOM.changeUserBtn?.addEventListener('click', () => {
        closeSettings();
        logout();
    });
    DOM.deleteAccountBtn?.addEventListener('click', confirmDeleteAccount);

    // === Escape para pausar ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (gameState.isPlaying) {
                if (gameState.isPaused) {
                    resumeGame();
                } else {
                    pauseGame();
                }
            } else if (!DOM.settingsModal.classList.contains('hidden')) {
                closeSettings();
            }
        }
    });
}

// ==================== GESTIÓN DE USUARIOS ====================

async function refreshUsersList() {
    if (!appState.dbReady || !DOM.usersList) return;

    try {
        const users = await MathMasterDB.getAllUsers();
        const t = (key, params) => MathMasterI18n.t(key, params);
        const currentLang = MathMasterI18n.getCurrentLanguage();
        const locale = currentLang === 'eu-ES' ? 'eu' : currentLang;

        if (users.length === 0) {
            DOM.usersList.innerHTML = `
                <div class="no-users-message">
                    <p>${t('noSavedProfiles')}</p>
                </div>
            `;
        } else {
            DOM.usersList.innerHTML = users.map(user => `
                <div class="user-card" data-user-id="${user.odId}">
                    <div class="user-card-info">
                        <span class="user-card-avatar">👤</span>
                        <div>
                            <div class="user-card-name">${escapeHtml(user.username)}</div>
                            <div class="user-card-stats">${t('created')}: ${new Date(user.createdAt).toLocaleDateString(locale)}</div>
                        </div>
                    </div>
                    <button class="user-card-delete" data-user-id="${user.odId}" title="${t('deleteProfile')}">🗑️</button>
                </div>
            `).join('');

            // Event listeners para seleccionar usuario
            DOM.usersList.querySelectorAll('.user-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('user-card-delete')) {
                        const userId = parseInt(card.dataset.userId);
                        loginUser(userId);
                    }
                });
            });

            // Event listeners para eliminar usuario
            DOM.usersList.querySelectorAll('.user-card-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const userId = parseInt(btn.dataset.userId);
                    confirmDeleteUser(userId);
                });
            });
        }
    } catch (e) {
        console.error('Error cargando usuarios:', e);
    }
}

async function createNewUser() {
    const username = DOM.newUsernameInput.value.trim();
    const t = (key) => MathMasterI18n.t(key);

    if (!username) {
        alert(t('enterUsername'));
        return;
    }

    if (username.length < 2 || username.length > 20) {
        alert(t('usernameLengthError'));
        return;
    }

    if (!appState.dbReady) {
        playAsGuest();
        return;
    }

    try {
        const userId = await MathMasterDB.createUser(username);
        DOM.newUsernameInput.value = '';
        MathMasterAudio.playCorrect();
        await loginUser(userId);
    } catch (e) {
        if (e.name === 'ConstraintError') {
            alert(t('usernameExists'));
        } else {
            console.error('Error creando usuario:', e);
            playAsGuest();
        }
    }
}

async function loginUser(userId) {
    try {
        const user = await MathMasterDB.getUser(userId);
        if (!user) throw new Error('Usuario no encontrado');

        appState.currentUser = user;
        appState.isGuest = false;

        // Actualizar último login
        user.lastLogin = new Date().toISOString();
        await MathMasterDB.updateUser(user);

        // Cargar logros del usuario
        const achievements = await MathMasterDB.getAchievements(userId);
        MathMasterAchievements.init(achievements?.unlockedAchievements || []);

        // Actualizar UI
        updateUserBadge();
        showScreen('selection');
    } catch (e) {
        console.error('Error al iniciar sesión:', e);
        playAsGuest();
    }
}

function playAsGuest() {
    appState.currentUser = null;
    appState.isGuest = true;
    MathMasterAchievements.init([]);
    updateUserBadge();
    showScreen('selection');
}

function logout() {
    appState.currentUser = null;
    appState.isGuest = false;
    MathMasterAchievements.init([]);
    updateUserBadge();
    refreshUsersList();
    showScreen('login');
}

function updateUserBadge() {
    if (!DOM.userBadge) return;
    const t = (key) => MathMasterI18n.t(key);

    if (appState.currentUser) {
        DOM.userBadge.classList.remove('hidden');
        DOM.currentUserName.textContent = appState.currentUser.username;
        if (DOM.settingsCurrentUser) {
            DOM.settingsCurrentUser.textContent = appState.currentUser.username;
        }
        if (DOM.deleteAccountSection) {
            DOM.deleteAccountSection.classList.remove('hidden');
        }
    } else if (appState.isGuest) {
        DOM.userBadge.classList.remove('hidden');
        DOM.currentUserName.textContent = t('guest');
        if (DOM.settingsCurrentUser) {
            DOM.settingsCurrentUser.textContent = t('guestNoProgress');
        }
        if (DOM.deleteAccountSection) {
            DOM.deleteAccountSection.classList.add('hidden');
        }
    } else {
        DOM.userBadge.classList.add('hidden');
    }
}

function toggleUserMenu() {
    DOM.userMenu?.classList.toggle('hidden');

    if (!DOM.userMenu?.classList.contains('hidden')) {
        // Posicionar menú debajo del badge
        const rect = DOM.userBadge.getBoundingClientRect();
        DOM.userMenu.style.top = `${rect.bottom + 8}px`;
        DOM.userMenu.style.left = `${rect.left}px`;
    }
}

function hideUserMenu() {
    DOM.userMenu?.classList.add('hidden');
}

async function confirmDeleteUser(userId) {
    const user = await MathMasterDB.getUser(userId);
    if (!user) return;
    const t = (key, params) => MathMasterI18n.t(key, params);

    showConfirmModal(
        t('deleteProfileConfirmTitle'),
        t('deleteProfileConfirmMessage', { username: user.username }),
        async () => {
            await MathMasterDB.deleteUser(userId);
            await refreshUsersList();
        }
    );
}

function confirmDeleteAccount() {
    if (!appState.currentUser) return;
    const t = (key) => MathMasterI18n.t(key);

    showConfirmModal(
        t('deleteAccountConfirmTitle'),
        t('deleteAccountConfirmMessage'),
        async () => {
            await MathMasterDB.deleteUser(appState.currentUser.odId);
            closeSettings();
            logout();
        }
    );
}

// ==================== SELECCIÓN DE OPCIONES ====================

function selectOperation(operation) {
    gameState.operation = operation;

    DOM.operationButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.operation === operation);
    });

    if (operation === 'tablas') {
        DOM.levelSection.classList.add('hidden');
        DOM.tableSection.classList.remove('hidden');
        gameState.level = 1;
    } else {
        DOM.levelSection.classList.remove('hidden');
        DOM.tableSection.classList.add('hidden');
        gameState.selectedTable = null;
    }

    validateStartButton();
}

function selectLevel(level) {
    gameState.level = level;

    DOM.levelButtons.forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.level) === level);
    });

    // Obtener descripción traducida
    const levelInfo = MathMasterI18n.getLevelInfo(level);
    DOM.levelDescription.textContent = levelInfo.description;

    validateStartButton();
}

function selectTable(table) {
    gameState.selectedTable = table === 'todas' ? 'todas' : parseInt(table);

    DOM.tableButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.table === table);
    });

    validateStartButton();
}

function selectQuestions(count) {
    gameState.totalQuestions = count;

    DOM.questionsButtons.forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.questions) === count);
    });
}

function validateStartButton() {
    let isValid = false;

    if (gameState.operation === 'tablas') {
        isValid = gameState.selectedTable !== null;
    } else {
        isValid = gameState.operation !== null && gameState.level !== null;
    }

    DOM.startBtn.disabled = !isValid;
}

// ==================== CONTROL DEL JUEGO ====================

function startGame() {
    gameState.isPlaying = true;
    gameState.isPaused = false;
    gameState.correctAnswers = 0;
    gameState.currentStreak = 0;
    gameState.bestStreak = 0;
    gameState.totalAttempts = 0;
    gameState.hintsUsed = 0;
    gameState.elapsedSeconds = 0;
    gameState.pausedTime = 0;
    gameState.startTime = Date.now();

    showScreen('game');
    updateOperationIndicator();
    updateScore();
    updateStreak();
    updateProgress();
    updateTimerDisplay();
    updateTTSButton();
    startTimer();
    generateQuestion();

    DOM.answerInput.focus();
}

function pauseGame() {
    if (!gameState.isPlaying || gameState.isPaused) return;

    gameState.isPaused = true;
    gameState.pausedTime = Date.now();
    clearInterval(gameState.timerInterval);

    DOM.pauseScore.textContent = `${gameState.correctAnswers} / ${gameState.totalQuestions}`;
    DOM.pauseTime.textContent = formatTime(gameState.elapsedSeconds);

    DOM.pauseOverlay.classList.remove('hidden');
}

function resumeGame() {
    if (!gameState.isPaused) return;

    gameState.isPaused = false;
    const pauseDuration = Date.now() - gameState.pausedTime;
    gameState.startTime += pauseDuration;

    DOM.pauseOverlay.classList.add('hidden');
    startTimer();
    DOM.answerInput.focus();
}

function restartGame() {
    DOM.pauseOverlay.classList.add('hidden');
    startGame();
}

function confirmQuit() {
    pauseGame();
}

function quitToMenu() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    DOM.pauseOverlay.classList.add('hidden');
    showScreen('selection');
    resetSelections();
}

async function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);

    MathMasterAudio.playGameComplete();

    const isNewRecord = checkAndSaveRecord();

    // Crear objeto de resultado
    const gameResult = {
        operation: gameState.operation,
        level: gameState.level,
        totalQuestions: gameState.totalQuestions,
        correctAnswers: gameState.correctAnswers,
        totalAttempts: gameState.totalAttempts,
        bestStreak: gameState.bestStreak,
        elapsedSeconds: gameState.elapsedSeconds,
        hintsUsed: gameState.hintsUsed,
        accuracy: gameState.totalAttempts > 0
            ? Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100)
            : 0
    };

    // Guardar estadísticas y verificar logros si hay usuario
    let newAchievements = [];
    if (appState.currentUser && appState.dbReady) {
        try {
            const stats = await MathMasterDB.updateStatistics(appState.currentUser.odId, gameResult);

            // Verificar logros
            newAchievements = MathMasterAchievements.checkAchievements(stats, gameResult);

            // Guardar logros desbloqueados
            for (const achievement of newAchievements) {
                await MathMasterDB.unlockAchievement(appState.currentUser.odId, achievement.id);
            }
        } catch (e) {
            console.error('Error guardando estadísticas:', e);
        }
    }

    // Leer resultados en voz alta
    MathMasterAudio.speakResults(gameResult);

    displayResults(isNewRecord, newAchievements);
    showScreen('results');

    // Mostrar notificaciones de logros
    setTimeout(() => {
        MathMasterAchievements.showNotifications(DOM.notificationsContainer);
    }, 500);
}

function resetSelections() {
    gameState.operation = null;
    gameState.level = null;
    gameState.selectedTable = null;

    DOM.operationButtons.forEach(btn => btn.classList.remove('selected'));
    DOM.levelButtons.forEach(btn => btn.classList.remove('selected'));
    DOM.tableButtons.forEach(btn => btn.classList.remove('selected'));

    DOM.levelDescription.textContent = MathMasterI18n.t('selectLevelDesc');
    DOM.startBtn.disabled = true;
}

// ==================== TEMPORIZADOR ====================

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    DOM.timer.textContent = formatTime(gameState.elapsedSeconds);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ==================== GENERACIÓN DE PREGUNTAS ====================

function generateQuestion() {
    let question, answer;

    if (gameState.operation === 'tablas') {
        const result = generateTableQuestion();
        question = result.question;
        answer = result.answer;
    } else {
        const level = LEVEL_CONFIG[gameState.level];

        if (level.pemdas) {
            const result = generatePEMDASQuestion(level);
            question = result.question;
            answer = result.answer;
        } else if (level.algebra) {
            const result = generateAlgebraQuestion(level);
            question = result.question;
            answer = result.answer;
        } else if (level.mixed) {
            const result = generateMixedQuestion(level);
            question = result.question;
            answer = result.answer;
        } else if (level[gameState.operation]?.chain) {
            const result = generateChainQuestion(level);
            question = result.question;
            answer = result.answer;
        } else {
            const result = generateBasicQuestion(gameState.operation, level);
            question = result.question;
            answer = result.answer;
        }
    }

    gameState.currentQuestion = question;
    gameState.currentAnswer = answer;

    DOM.questionText.textContent = question;
    DOM.answerInput.value = '';
    DOM.answerInput.classList.remove('correct', 'incorrect');
    DOM.feedbackText.textContent = '';
    DOM.feedbackText.className = 'feedback-text';
    DOM.hintText.textContent = '';

    // Leer pregunta si TTS está activo
    if (MathMasterAudio.ttsEnabled) {
        MathMasterAudio.speakQuestion(question);
    }
}

function generateTableQuestion() {
    let factor1, factor2;

    if (gameState.selectedTable === 'todas') {
        factor1 = randomInt(1, 10);
        factor2 = randomInt(1, 10);
    } else {
        factor1 = gameState.selectedTable;
        factor2 = randomInt(1, 10);
        if (Math.random() > 0.5) {
            [factor1, factor2] = [factor2, factor1];
        }
    }

    return {
        question: `${factor1} × ${factor2} = ?`,
        answer: factor1 * factor2
    };
}

function generateBasicQuestion(operation, level) {
    let question, answer;
    const config = level[operation];

    switch (operation) {
        case 'suma': {
            const num1 = generateNumber(config.min, config.max, config.decimals);
            const num2 = generateNumber(config.min, config.max, config.decimals);
            answer = roundToDecimals(num1 + num2, config.decimals);
            question = `${formatNumber(num1)} + ${formatNumber(num2)} = ?`;
            break;
        }

        case 'resta': {
            let minuend = generateNumber(config.min, config.max, config.decimals);
            let subtrahend = generateNumber(config.min, config.max, config.decimals);

            if (!config.allowNegative && subtrahend > minuend) {
                [minuend, subtrahend] = [subtrahend, minuend];
            }

            answer = roundToDecimals(minuend - subtrahend, config.decimals);
            question = `${formatNumber(minuend)} − ${formatNumber(subtrahend)} = ?`;
            break;
        }

        case 'multiplicacion': {
            const factor1 = randomInt(config.factor1.min, config.factor1.max);
            const factor2 = randomInt(config.factor2.min, config.factor2.max);
            answer = factor1 * factor2;
            question = `${formatNumber(factor1)} × ${formatNumber(factor2)} = ?`;
            break;
        }

        case 'division': {
            const divisor = randomInt(config.divisor.min, config.divisor.max);

            if (config.resultDecimals === 0) {
                const quotient = randomInt(1, 20);
                const dividend = divisor * quotient;
                answer = quotient;
                question = `${formatNumber(dividend)} ÷ ${formatNumber(divisor)} = ?`;
            } else {
                let dividend, result;
                if (config.decimalDivisor) {
                    const decDivisor = roundToDecimals(divisor / 10, 1);
                    dividend = randomInt(divisor * 2, divisor * 20);
                    result = roundToDecimals(dividend / decDivisor, config.resultDecimals);
                    answer = result;
                    question = `${formatNumber(dividend)} ÷ ${formatNumber(decDivisor)} = ?`;
                } else {
                    dividend = randomInt(divisor * 2, divisor * 50);
                    result = roundToDecimals(dividend / divisor, config.resultDecimals);
                    answer = result;
                    question = `${formatNumber(dividend)} ÷ ${formatNumber(divisor)} = ?`;
                }
            }
            break;
        }
    }

    return { question, answer };
}

function generateChainQuestion(level) {
    const count = randomInt(3, 4);
    const numbers = [];
    const operations = [];

    for (let i = 0; i < count; i++) {
        numbers.push(randomInt(1, 30));
        if (i < count - 1) {
            operations.push(Math.random() > 0.5 ? '+' : '−');
        }
    }

    let questionStr = formatNumber(numbers[0]);
    let answer = numbers[0];

    for (let i = 0; i < operations.length; i++) {
        questionStr += ` ${operations[i]} ${formatNumber(numbers[i + 1])}`;
        if (operations[i] === '+') {
            answer += numbers[i + 1];
        } else {
            answer -= numbers[i + 1];
        }
    }

    questionStr += ' = ?';

    return { question: questionStr, answer };
}

function generateMixedQuestion(level) {
    const type = randomInt(1, 3);
    let question, answer;

    switch (type) {
        case 1: {
            const a = randomInt(2, 10);
            const b = randomInt(2, 10);
            const c = randomInt(1, 20);
            answer = a * b + c;
            question = `${a} × ${b} + ${c} = ?`;
            break;
        }

        case 2: {
            const a = randomInt(1, 20);
            const b = randomInt(2, 10);
            const c = randomInt(2, 10);
            answer = a + b * c;
            question = `${a} + ${b} × ${c} = ?`;
            break;
        }

        case 3: {
            const b = randomInt(2, 10);
            const quotient = randomInt(2, 10);
            const a = b * quotient;
            const c = randomInt(1, 15);
            const isAddition = Math.random() > 0.5;

            if (isAddition) {
                answer = a / b + c;
                question = `${a} ÷ ${b} + ${c} = ?`;
            } else {
                answer = a / b - c;
                question = `${a} ÷ ${b} − ${c} = ?`;
            }
            break;
        }
    }

    return { question, answer };
}

function generateAlgebraQuestion(level) {
    const type = randomInt(1, 4);
    let question, answer;

    switch (type) {
        case 1: {
            const a = randomInt(1, 50);
            const b = randomInt(a + 1, 100);
            answer = b - a;
            question = `X + ${a} = ${b}`;
            break;
        }

        case 2: {
            const a = randomInt(20, 100);
            const b = randomInt(1, a - 1);
            answer = a - b;
            question = `${a} − X = ${b}`;
            break;
        }

        case 3: {
            const a = randomInt(2, 12);
            const x = randomInt(1, 15);
            const b = a * x;
            answer = x;
            question = `${a} × X = ${b}`;
            break;
        }

        case 4: {
            const a = randomInt(2, 10);
            const b = randomInt(2, 15);
            answer = a * b;
            question = `X ÷ ${a} = ${b}`;
            break;
        }
    }

    return { question, answer };
}

function generatePEMDASQuestion(level) {
    const type = randomInt(1, 4);
    let question, answer;

    switch (type) {
        case 1: {
            const a = randomInt(2, 8);
            const b = randomInt(2, 10);
            const c = randomInt(2, 10);
            answer = a * (b + c);
            question = `${a} × (${b} + ${c}) = ?`;
            break;
        }

        case 2: {
            const a = randomInt(2, 8);
            const b = randomInt(2, 8);
            const c = randomInt(2, 6);
            const d = randomInt(1, 10);
            answer = (a + b) * c - d;
            question = `(${a} + ${b}) × ${c} − ${d} = ?`;
            break;
        }

        case 3: {
            const a = randomInt(2, 5);
            const b = randomInt(2, 8);
            const c = randomInt(2, 8);
            const e = randomInt(2, 5);
            const d = e * randomInt(1, 5);
            answer = a * (b + c) - d / e;
            question = `${a} × (${b} + ${c}) − ${d} ÷ ${e} = ?`;
            break;
        }

        case 4: {
            const a = randomInt(5, 15);
            const b = randomInt(1, a - 1);
            const c = randomInt(2, 8);
            const d = randomInt(2, 8);
            answer = (a - b) * (c + d);
            question = `(${a} − ${b}) × (${c} + ${d}) = ?`;
            break;
        }
    }

    return { question, answer };
}

// ==================== VERIFICACIÓN DE RESPUESTAS ====================

function checkAnswer() {
    if (!gameState.isPlaying || gameState.isPaused) return;
    const t = (key) => MathMasterI18n.t(key);

    const userInput = DOM.answerInput.value.trim().replace(',', '.');
    const userAnswer = parseFloat(userInput);

    if (isNaN(userAnswer) || userInput === '') {
        showFeedback(t('enterValidNumber'), 'incorrect');
        DOM.answerInput.classList.add('incorrect');
        setTimeout(() => {
            DOM.answerInput.classList.remove('incorrect');
        }, 500);
        return;
    }

    gameState.totalAttempts++;

    const tolerance = gameState.level >= 4 ? 0.01 : 0.001;
    const isCorrect = Math.abs(userAnswer - gameState.currentAnswer) < tolerance;

    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
}

function handleCorrectAnswer() {
    gameState.correctAnswers++;
    gameState.currentStreak++;
    gameState.bestStreak = Math.max(gameState.bestStreak, gameState.currentStreak);
    const t = (key, params) => MathMasterI18n.t(key, params);

    MathMasterAudio.playCorrect();
    MathMasterAudio.playStreak(gameState.currentStreak);

    updateScore();
    updateStreak();
    updateProgress();

    DOM.answerInput.classList.add('correct');

    if (gameState.currentStreak >= 5) {
        showFeedback(t('excellentStreak', { streak: gameState.currentStreak }), 'correct');
    } else if (gameState.currentStreak >= 3) {
        showFeedback(t('goodStreak', { streak: gameState.currentStreak }), 'correct');
    } else {
        showFeedback(t('correct'), 'correct');
    }

    if (gameState.correctAnswers >= gameState.totalQuestions) {
        setTimeout(endGame, 800);
    } else {
        setTimeout(generateQuestion, 600);
    }
}

function handleIncorrectAnswer() {
    gameState.currentStreak = 0;
    gameState.hintsUsed++;
    const t = (key) => MathMasterI18n.t(key);

    MathMasterAudio.playIncorrect();

    updateStreak();
    DOM.answerInput.classList.add('incorrect');

    showFeedback(t('incorrectTryAgain'), 'incorrect');
    showHint();

    setTimeout(() => {
        DOM.answerInput.classList.remove('incorrect');
        DOM.answerInput.value = '';
        DOM.answerInput.focus();
    }, 500);
}

function showFeedback(message, type) {
    DOM.feedbackText.textContent = message;
    DOM.feedbackText.className = `feedback-text ${type}`;
}

function showHint() {
    const answer = gameState.currentAnswer;
    const t = (key, params) => MathMasterI18n.t(key, params);
    let hint = '';

    if (Number.isInteger(answer)) {
        if (answer > 0) {
            hint = t('hintRange', { min: Math.max(0, answer - 10), max: answer + 10 });
        } else {
            hint = t('hintNegative');
        }
    } else {
        const rounded = Math.round(answer);
        hint = t('hintApprox', { value: rounded });
    }

    DOM.hintText.textContent = hint;
}

// ==================== ACTUALIZACIÓN DE UI ====================

function showScreen(screenName) {
    // Ocultar todas las pantallas
    DOM.loginScreen?.classList.remove('active');
    DOM.selectionScreen?.classList.remove('active');
    DOM.gameScreen?.classList.remove('active');
    DOM.resultsScreen?.classList.remove('active');
    DOM.statsScreen?.classList.remove('active');
    DOM.achievementsScreen?.classList.remove('active');
    DOM.profileScreen?.classList.remove('active');

    // Mostrar/ocultar barra superior
    if (DOM.topBar) {
        DOM.topBar.style.display = screenName === 'game' ? 'none' : 'flex';
    }

    // Mostrar pantalla correspondiente
    switch (screenName) {
        case 'login':
            DOM.loginScreen?.classList.add('active');
            break;
        case 'selection':
            DOM.selectionScreen?.classList.add('active');
            break;
        case 'game':
            DOM.gameScreen?.classList.add('active');
            break;
        case 'results':
            DOM.resultsScreen?.classList.add('active');
            break;
        case 'stats':
            DOM.statsScreen?.classList.add('active');
            break;
        case 'achievements':
            DOM.achievementsScreen?.classList.add('active');
            break;
        case 'profile':
            DOM.profileScreen?.classList.add('active');
            break;
    }
}

function updateOperationIndicator() {
    const t = (key, params) => MathMasterI18n.t(key, params);
    let text;
    if (gameState.operation === 'tablas') {
        if (gameState.selectedTable === 'todas') {
            text = t('tablesAll');
        } else {
            text = t('tableOf', { number: gameState.selectedTable });
        }
    } else {
        text = t('operationLevel', {
            operation: getOperationName(gameState.operation),
            level: gameState.level
        });
    }
    DOM.operationIndicator.textContent = text;
}

function updateScore() {
    DOM.score.textContent = `${gameState.correctAnswers} / ${gameState.totalQuestions}`;
}

function updateStreak() {
    DOM.streak.textContent = `🔥 ${gameState.currentStreak}`;
}

function updateProgress() {
    const progress = (gameState.correctAnswers / gameState.totalQuestions) * 100;
    DOM.progressBar.style.width = `${progress}%`;
}

function updateTTSButton() {
    if (DOM.speakQuestionBtn) {
        if (MathMasterAudio.ttsEnabled) {
            DOM.speakQuestionBtn.classList.remove('hidden');
        } else {
            DOM.speakQuestionBtn.classList.add('hidden');
        }
    }
}

function displayResults(isNewRecord, newAchievements = []) {
    const t = (key) => MathMasterI18n.t(key);
    const accuracy = gameState.totalAttempts > 0
        ? Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100)
        : 0;

    const avgTimePerQuestion = gameState.correctAnswers > 0
        ? Math.round(gameState.elapsedSeconds / gameState.correctAnswers)
        : 0;

    let title, emoji;
    if (accuracy >= 95) {
        title = t('resultPerfect');
        emoji = '🏆';
    } else if (accuracy >= 80) {
        title = t('resultExcellent');
        emoji = '🌟';
    } else if (accuracy >= 60) {
        title = t('resultVeryGood');
        emoji = '👏';
    } else {
        title = t('resultGoodTry');
        emoji = '💪';
    }

    DOM.resultsTitle.textContent = title;
    DOM.resultsEmoji.textContent = emoji;
    DOM.finalScore.textContent = `${gameState.correctAnswers} / ${gameState.totalQuestions}`;
    DOM.totalTime.textContent = formatTime(gameState.elapsedSeconds);
    DOM.bestStreakDisplay.textContent = gameState.bestStreak;
    DOM.accuracy.textContent = `${accuracy}%`;
    DOM.totalAttempts.textContent = gameState.totalAttempts;
    DOM.avgTime.textContent = `${avgTimePerQuestion}s`;

    if (isNewRecord) {
        DOM.recordSection.classList.remove('hidden');
    } else {
        DOM.recordSection.classList.add('hidden');
    }

    // Mostrar logros desbloqueados
    if (newAchievements.length > 0 && DOM.unlockedAchievements && DOM.resultsAchievementsList) {
        DOM.unlockedAchievements.classList.remove('hidden');
        DOM.resultsAchievementsList.innerHTML = newAchievements.map(a => {
            // Use translated achievement info
            const achievementInfo = MathMasterI18n.getAchievementInfo(a.id);
            return `
            <div class="achievement-card">
                <div class="achievement-icon">${a.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievementInfo?.name || a.name}</div>
                    <div class="achievement-description">${achievementInfo?.description || a.description}</div>
                </div>
            </div>
        `}).join('');
    } else if (DOM.unlockedAchievements) {
        DOM.unlockedAchievements.classList.add('hidden');
    }
}

// ==================== PANTALLAS ADICIONALES ====================

async function showProfileScreen() {
    const t = (key, params) => MathMasterI18n.t(key, params);

    if (!appState.currentUser || !appState.dbReady) {
        alert(t('loginForStats'));
        return;
    }

    try {
        const user = appState.currentUser;
        const stats = await MathMasterDB.getStatistics(user.odId);

        // Información del usuario
        DOM.profileUsername.textContent = user.username;

        // Formatear fechas
        const createdDate = new Date(user.createdAt);
        const lastLoginDate = new Date(user.lastLogin);
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const currentLang = MathMasterI18n.getCurrentLanguage();

        DOM.profileCreated.textContent = createdDate.toLocaleDateString(currentLang, dateOptions);
        DOM.profileLastLogin.textContent = lastLoginDate.toLocaleDateString(currentLang, dateOptions);

        // Estadísticas rápidas
        if (stats) {
            DOM.profileTotalGames.textContent = stats.totalGames;
            DOM.profileAccuracy.textContent = stats.totalAttempts > 0
                ? `${Math.round((stats.totalCorrect / stats.totalAttempts) * 100)}%`
                : '0%';
            DOM.profileBestStreak.textContent = stats.bestStreak;
        }

        // Logros
        const achievementProgress = MathMasterAchievements.getProgress();
        DOM.profileAchievements.textContent = `${achievementProgress.unlocked}/${achievementProgress.total}`;

        showScreen('profile');
    } catch (e) {
        console.error('Error cargando perfil:', e);
    }
}

async function showStatsScreen() {
    const t = (key, params) => MathMasterI18n.t(key, params);

    if (!appState.currentUser || !appState.dbReady) {
        alert(t('loginForStats'));
        return;
    }

    try {
        const stats = await MathMasterDB.getStatistics(appState.currentUser.odId);
        if (!stats) return;

        // Actualizar valores
        document.getElementById('stat-total-games').textContent = stats.totalGames;
        document.getElementById('stat-total-correct').textContent = stats.totalCorrect;
        document.getElementById('stat-accuracy').textContent =
            stats.totalAttempts > 0
                ? `${Math.round((stats.totalCorrect / stats.totalAttempts) * 100)}%`
                : '0%';
        document.getElementById('stat-best-streak').textContent = stats.bestStreak;

        const hours = Math.floor(stats.totalTime / 3600);
        const minutes = Math.floor((stats.totalTime % 3600) / 60);
        document.getElementById('stat-total-time').textContent = `${hours}h ${minutes}m`;

        // Estadísticas por operación
        const operationStatsContainer = document.getElementById('operation-stats');
        operationStatsContainer.innerHTML = Object.entries(stats.byOperation)
            .filter(([, data]) => data.games > 0)
            .map(([op, data]) => `
                <div class="operation-stat-row">
                    <div class="operation-stat-name">
                        <span class="operation-stat-icon">${OPERATION_ICONS[op] || '?'}</span>
                        <span>${getOperationName(op)}</span>
                    </div>
                    <div class="operation-stat-value">${t('statsGamesCorrect', { games: data.games, correct: data.correct })}</div>
                </div>
            `).join('') || `<p class="no-data">${t('noGamesYet')}</p>`;

        showScreen('stats');
    } catch (e) {
        console.error('Error cargando estadísticas:', e);
    }
}

function showAchievementsScreen() {
    if (DOM.achievementsContent) {
        DOM.achievementsContent.innerHTML = MathMasterAchievements.renderAchievementsList();
    }
    showScreen('achievements');
}

// ==================== TECLADO NUMÉRICO ====================

function handleNumpad(value) {
    if (!gameState.isPlaying || gameState.isPaused) return;

    MathMasterAudio.playClick();

    switch (value) {
        case 'delete':
            DOM.answerInput.value = DOM.answerInput.value.slice(0, -1);
            break;
        case 'clear':
            DOM.answerInput.value = '';
            break;
        case 'enter':
            checkAnswer();
            break;
        default:
            DOM.answerInput.value += value;
    }

    DOM.answerInput.focus();
}

// ==================== RÉCORDS ====================

function loadRecords() {
    const records = localStorage.getItem('mathmaster_records');
    return records ? JSON.parse(records) : {};
}

function saveRecords(records) {
    localStorage.setItem('mathmaster_records', JSON.stringify(records));
}

function getRecordKey() {
    if (gameState.operation === 'tablas') {
        return `tablas_${gameState.selectedTable}_${gameState.totalQuestions}`;
    }
    return `${gameState.operation}_${gameState.level}_${gameState.totalQuestions}`;
}

function checkAndSaveRecord() {
    const recordKey = getRecordKey();
    const records = loadRecords();

    const currentTime = gameState.elapsedSeconds;

    if (!records[recordKey] || currentTime < records[recordKey]) {
        records[recordKey] = currentTime;
        saveRecords(records);
        return true;
    }

    return false;
}

// ==================== CONFIGURACIÓN ====================

function loadSettings() {
    // Tema
    const savedTheme = localStorage.getItem('mathmaster_theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    // Alto contraste
    const highContrast = localStorage.getItem('mathmaster_high_contrast') === 'true';
    setHighContrast(highContrast);
    if (DOM.settingHighContrast) {
        DOM.settingHighContrast.checked = highContrast;
    }

    // Sincronizar controles de audio
    if (DOM.settingSound) {
        DOM.settingSound.checked = MathMasterAudio.enabled;
    }
    if (DOM.settingVolume) {
        DOM.settingVolume.value = MathMasterAudio.sfxVolume * 100;
    }
    if (DOM.settingTTS) {
        DOM.settingTTS.checked = MathMasterAudio.ttsEnabled;
    }

    // Escuchar cambios del sistema
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('mathmaster_theme')) {
            setTheme(e.matches ? 'light' : 'dark');
        }
    });
}

function openSettings() {
    // Sincronizar controles con estado actual
    if (DOM.settingSound) DOM.settingSound.checked = MathMasterAudio.enabled;
    if (DOM.settingVolume) DOM.settingVolume.value = MathMasterAudio.sfxVolume * 100;
    if (DOM.settingTTS) DOM.settingTTS.checked = MathMasterAudio.ttsEnabled;
    if (DOM.settingHighContrast) {
        DOM.settingHighContrast.checked =
            document.documentElement.getAttribute('data-high-contrast') === 'true';
    }

    DOM.settingsModal?.classList.remove('hidden');
}

function closeSettings() {
    DOM.settingsModal?.classList.add('hidden');
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('mathmaster_theme', newTheme);
}

function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function setHighContrast(enabled) {
    if (enabled) {
        document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
        document.documentElement.removeAttribute('data-high-contrast');
    }
    localStorage.setItem('mathmaster_high_contrast', enabled.toString());
}

// ==================== MODALES ====================

function showConfirmModal(title, message, onConfirm) {
    if (!DOM.confirmModal) return;

    DOM.confirmTitle.textContent = title;
    DOM.confirmMessage.textContent = message;

    DOM.confirmModal.classList.remove('hidden');

    // Remover listeners anteriores
    const newCancelBtn = DOM.confirmCancelBtn.cloneNode(true);
    const newOkBtn = DOM.confirmOkBtn.cloneNode(true);
    DOM.confirmCancelBtn.parentNode.replaceChild(newCancelBtn, DOM.confirmCancelBtn);
    DOM.confirmOkBtn.parentNode.replaceChild(newOkBtn, DOM.confirmOkBtn);
    DOM.confirmCancelBtn = newCancelBtn;
    DOM.confirmOkBtn = newOkBtn;

    DOM.confirmCancelBtn.addEventListener('click', () => {
        DOM.confirmModal.classList.add('hidden');
    });

    DOM.confirmOkBtn.addEventListener('click', () => {
        DOM.confirmModal.classList.add('hidden');
        if (onConfirm) onConfirm();
    });
}

// ==================== UTILIDADES ====================

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNumber(min, max, decimals) {
    if (decimals === 0) {
        return randomInt(min, max);
    }

    const factor = Math.pow(10, decimals);
    const rawNumber = Math.random() * (max - min) + min;
    return Math.round(rawNumber * factor) / factor;
}

function roundToDecimals(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}

function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toLocaleString('es-ES');
    }
    return num.toLocaleString('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 3
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== INICIAR ====================

document.addEventListener('DOMContentLoaded', () => {
    init();
});
