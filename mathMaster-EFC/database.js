/**
 * MathMaster - Módulo de Base de Datos (IndexedDB)
 * Gestiona la persistencia de usuarios, estadísticas, logros y partidas guardadas
 */

const MathMasterDB = {
    dbName: 'MathMasterDB',
    dbVersion: 1,
    db: null,

    // ==================== INICIALIZACIÓN ====================

    /**
     * Inicializa la base de datos IndexedDB
     * @returns {Promise} Promesa que se resuelve cuando la DB está lista
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Error al abrir IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('IndexedDB inicializada correctamente');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                this.createObjectStores(db);
            };
        });
    },

    /**
     * Crea los ObjectStores (tablas) de la base de datos
     */
    createObjectStores(db) {
        // Usuarios
        if (!db.objectStoreNames.contains('users')) {
            const usersStore = db.createObjectStore('users', { keyPath: 'odId', autoIncrement: true });
            usersStore.createIndex('username', 'username', { unique: true });
        }

        // Estadísticas
        if (!db.objectStoreNames.contains('statistics')) {
            const statsStore = db.createObjectStore('statistics', { keyPath: 'odId' });
            statsStore.createIndex('odId', 'odId', { unique: true });
        }

        // Logros
        if (!db.objectStoreNames.contains('achievements')) {
            const achievementsStore = db.createObjectStore('achievements', { keyPath: 'odId' });
            achievementsStore.createIndex('odId', 'odId', { unique: true });
        }

        // Partidas guardadas
        if (!db.objectStoreNames.contains('savedGames')) {
            const savedStore = db.createObjectStore('savedGames', { keyPath: 'odId' });
            savedStore.createIndex('odId', 'odId', { unique: true });
        }

        // Configuración global
        if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
        }
    },

    // ==================== USUARIOS ====================

    /**
     * Crea un nuevo usuario
     * @param {string} username - Nombre del usuario
     * @returns {Promise<number>} ID del usuario creado
     */
    async createUser(username) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users', 'statistics', 'achievements'], 'readwrite');
            const usersStore = transaction.objectStore('users');

            const user = {
                username: username.trim(),
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                settings: {
                    soundEnabled: true,
                    musicVolume: 0.7,
                    sfxVolume: 0.8,
                    ttsEnabled: false,
                    highContrast: false
                }
            };

            const request = usersStore.add(user);

            request.onsuccess = () => {
                const odId = request.result;

                // Crear estadísticas iniciales
                const statsStore = transaction.objectStore('statistics');
                statsStore.add({
                    odId: odId,
                    totalGames: 0,
                    totalCorrect: 0,
                    totalAttempts: 0,
                    bestStreak: 0,
                    totalTime: 0,
                    byOperation: {
                        suma: { games: 0, correct: 0 },
                        resta: { games: 0, correct: 0 },
                        multiplicacion: { games: 0, correct: 0 },
                        division: { games: 0, correct: 0 },
                        tablas: { games: 0, correct: 0 }
                    },
                    byLevel: {}
                });

                // Crear registro de logros vacío
                const achievementsStore = transaction.objectStore('achievements');
                achievementsStore.add({
                    odId: odId,
                    unlockedAchievements: []
                });

                resolve(odId);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    /**
     * Obtiene todos los usuarios
     * @returns {Promise<Array>} Lista de usuarios
     */
    async getAllUsers() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Obtiene un usuario por ID
     * @param {number} odId - ID del usuario
     * @returns {Promise<Object>} Datos del usuario
     */
    async getUser(odId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(odId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Actualiza un usuario
     * @param {Object} user - Datos del usuario
     * @returns {Promise}
     */
    async updateUser(user) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.put(user);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Elimina un usuario y todos sus datos
     * @param {number} odId - ID del usuario
     * @returns {Promise}
     */
    async deleteUser(odId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(
                ['users', 'statistics', 'achievements', 'savedGames'],
                'readwrite'
            );

            transaction.objectStore('users').delete(odId);
            transaction.objectStore('statistics').delete(odId);
            transaction.objectStore('achievements').delete(odId);
            transaction.objectStore('savedGames').delete(odId);

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    },

    // ==================== ESTADÍSTICAS ====================

    /**
     * Obtiene las estadísticas de un usuario
     * @param {number} odId - ID del usuario
     * @returns {Promise<Object>} Estadísticas del usuario
     */
    async getStatistics(odId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['statistics'], 'readonly');
            const store = transaction.objectStore('statistics');
            const request = store.get(odId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Actualiza las estadísticas después de una partida
     * @param {number} odId - ID del usuario
     * @param {Object} gameResult - Resultado de la partida
     * @returns {Promise}
     */
    async updateStatistics(odId, gameResult) {
        const stats = await this.getStatistics(odId);
        if (!stats) return;

        // Actualizar totales
        stats.totalGames++;
        stats.totalCorrect += gameResult.correctAnswers;
        stats.totalAttempts += gameResult.totalAttempts;
        stats.totalTime += gameResult.elapsedSeconds;

        if (gameResult.bestStreak > stats.bestStreak) {
            stats.bestStreak = gameResult.bestStreak;
        }

        // Actualizar por operación
        const op = gameResult.operation;
        if (!stats.byOperation[op]) {
            stats.byOperation[op] = { games: 0, correct: 0 };
        }
        stats.byOperation[op].games++;
        stats.byOperation[op].correct += gameResult.correctAnswers;

        // Actualizar por nivel
        const levelKey = `level_${gameResult.level}`;
        if (!stats.byLevel[levelKey]) {
            stats.byLevel[levelKey] = { games: 0, bestTime: Infinity };
        }
        stats.byLevel[levelKey].games++;
        if (gameResult.elapsedSeconds < stats.byLevel[levelKey].bestTime) {
            stats.byLevel[levelKey].bestTime = gameResult.elapsedSeconds;
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['statistics'], 'readwrite');
            const store = transaction.objectStore('statistics');
            const request = store.put(stats);

            request.onsuccess = () => resolve(stats);
            request.onerror = () => reject(request.error);
        });
    },

    // ==================== LOGROS ====================

    /**
     * Obtiene los logros de un usuario
     * @param {number} odId - ID del usuario
     * @returns {Promise<Object>} Logros del usuario
     */
    async getAchievements(odId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['achievements'], 'readonly');
            const store = transaction.objectStore('achievements');
            const request = store.get(odId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Desbloquea un logro para un usuario
     * @param {number} odId - ID del usuario
     * @param {string} achievementId - ID del logro
     * @returns {Promise<boolean>} True si el logro fue desbloqueado por primera vez
     */
    async unlockAchievement(odId, achievementId) {
        const achievements = await this.getAchievements(odId);
        if (!achievements) return false;

        // Verificar si ya está desbloqueado
        if (achievements.unlockedAchievements.includes(achievementId)) {
            return false;
        }

        achievements.unlockedAchievements.push(achievementId);

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['achievements'], 'readwrite');
            const store = transaction.objectStore('achievements');
            const request = store.put(achievements);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    },

    // ==================== PARTIDAS GUARDADAS ====================

    /**
     * Guarda el estado de una partida
     * @param {number} odId - ID del usuario
     * @param {Object} gameState - Estado del juego
     * @returns {Promise}
     */
    async saveGame(odId, gameState) {
        const savedGame = {
            odId: odId,
            gameState: gameState,
            savedAt: new Date().toISOString()
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['savedGames'], 'readwrite');
            const store = transaction.objectStore('savedGames');
            const request = store.put(savedGame);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Carga una partida guardada
     * @param {number} odId - ID del usuario
     * @returns {Promise<Object>} Estado del juego guardado
     */
    async loadGame(odId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['savedGames'], 'readonly');
            const store = transaction.objectStore('savedGames');
            const request = store.get(odId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Elimina una partida guardada
     * @param {number} odId - ID del usuario
     * @returns {Promise}
     */
    async deleteSavedGame(odId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['savedGames'], 'readwrite');
            const store = transaction.objectStore('savedGames');
            const request = store.delete(odId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    // ==================== CONFIGURACIÓN GLOBAL ====================

    /**
     * Guarda una configuración global
     * @param {string} key - Clave de configuración
     * @param {any} value - Valor
     * @returns {Promise}
     */
    async setSetting(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            const request = store.put({ key, value });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Obtiene una configuración global
     * @param {string} key - Clave de configuración
     * @returns {Promise<any>} Valor de la configuración
     */
    async getSetting(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result ? request.result.value : null);
            };
            request.onerror = () => reject(request.error);
        });
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathMasterDB;
}
