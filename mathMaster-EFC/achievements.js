/**
 * MathMaster - Sistema de Logros
 * Gestiona la definición, verificación y desbloqueo de logros
 */

const MathMasterAchievements = {
    // ==================== DEFINICIÓN DE LOGROS ====================

    /**
     * Catálogo de todos los logros disponibles
     */
    catalog: {
        first_correct: {
            id: 'first_correct',
            name: 'Primer Paso',
            description: 'Responde correctamente tu primera pregunta',
            icon: '🎯',
            condition: (stats) => stats.totalCorrect >= 1
        },
        streak_5: {
            id: 'streak_5',
            name: 'En Racha',
            description: 'Consigue una racha de 5 respuestas correctas',
            icon: '🔥',
            condition: (stats, gameResult) =>
                stats.bestStreak >= 5 || (gameResult && gameResult.bestStreak >= 5)
        },
        streak_10: {
            id: 'streak_10',
            name: 'Imparable',
            description: 'Consigue una racha de 10 respuestas correctas',
            icon: '⚡',
            condition: (stats, gameResult) =>
                stats.bestStreak >= 10 || (gameResult && gameResult.bestStreak >= 10)
        },
        perfect_game: {
            id: 'perfect_game',
            name: 'Perfeccionista',
            description: 'Completa una partida sin errores',
            icon: '💎',
            condition: (stats, gameResult) =>
                gameResult && gameResult.correctAnswers === gameResult.totalQuestions &&
                gameResult.totalAttempts === gameResult.totalQuestions
        },
        games_10: {
            id: 'games_10',
            name: 'Estudiante Dedicado',
            description: 'Completa 10 partidas',
            icon: '📚',
            condition: (stats) => stats.totalGames >= 10
        },
        games_50: {
            id: 'games_50',
            name: 'Maestro del Estudio',
            description: 'Completa 50 partidas',
            icon: '🎓',
            condition: (stats) => stats.totalGames >= 50
        },
        level_5: {
            id: 'level_5',
            name: 'Escalador',
            description: 'Completa una partida en nivel 5 o superior',
            icon: '🧗',
            condition: (stats, gameResult) => gameResult && gameResult.level >= 5
        },
        level_10: {
            id: 'level_10',
            name: 'Conquistador',
            description: 'Completa una partida en nivel 10',
            icon: '👑',
            condition: (stats, gameResult) => gameResult && gameResult.level === 10
        },
        speed_demon: {
            id: 'speed_demon',
            name: 'Velocista',
            description: 'Completa 20 preguntas en menos de 2 minutos',
            icon: '⏱️',
            condition: (stats, gameResult) =>
                gameResult && gameResult.totalQuestions === 20 &&
                gameResult.elapsedSeconds < 120 &&
                gameResult.correctAnswers === gameResult.totalQuestions
        },
        all_operations: {
            id: 'all_operations',
            name: 'Todoterreno',
            description: 'Completa al menos una partida de cada operación',
            icon: '🌟',
            condition: (stats) => {
                const ops = ['suma', 'resta', 'multiplicacion', 'division', 'tablas'];
                return ops.every(op => stats.byOperation[op] && stats.byOperation[op].games > 0);
            }
        },
        // Logros adicionales para más variedad
        hundred_correct: {
            id: 'hundred_correct',
            name: 'Centenario',
            description: 'Responde correctamente 100 preguntas en total',
            icon: '💯',
            condition: (stats) => stats.totalCorrect >= 100
        },
        multiplication_master: {
            id: 'multiplication_master',
            name: 'Maestro de Tablas',
            description: 'Completa 10 partidas de tablas de multiplicar',
            icon: '✖️',
            condition: (stats) => stats.byOperation.tablas && stats.byOperation.tablas.games >= 10
        },
        early_bird: {
            id: 'early_bird',
            name: 'Madrugador',
            description: 'Juega tu primera partida antes de las 8 AM',
            icon: '🌅',
            condition: (stats, gameResult, context) => {
                if (context && context.gameEndTime) {
                    const hour = new Date(context.gameEndTime).getHours();
                    return hour < 8;
                }
                return false;
            }
        },
        night_owl: {
            id: 'night_owl',
            name: 'Búho Nocturno',
            description: 'Juega una partida después de las 10 PM',
            icon: '🦉',
            condition: (stats, gameResult, context) => {
                if (context && context.gameEndTime) {
                    const hour = new Date(context.gameEndTime).getHours();
                    return hour >= 22;
                }
                return false;
            }
        },
        comeback_kid: {
            id: 'comeback_kid',
            name: 'Nunca Te Rindas',
            description: 'Gana una partida después de usar 3+ pistas',
            icon: '💪',
            condition: (stats, gameResult) =>
                gameResult && gameResult.hintsUsed >= 3 &&
                gameResult.correctAnswers === gameResult.totalQuestions
        }
    },

    // Estado local
    unlockedIds: [],
    pendingNotifications: [],

    // ==================== MÉTODOS PRINCIPALES ====================

    /**
     * Inicializa el sistema de logros
     * @param {Array} unlockedAchievements - Lista de IDs de logros ya desbloqueados
     */
    init(unlockedAchievements = []) {
        this.unlockedIds = [...unlockedAchievements];
        this.pendingNotifications = [];
    },

    /**
     * Verifica y desbloquea logros después de una partida
     * @param {Object} stats - Estadísticas actualizadas del usuario
     * @param {Object} gameResult - Resultado de la partida actual
     * @param {Object} context - Contexto adicional (hora, etc.)
     * @returns {Array} Lista de logros recién desbloqueados
     */
    checkAchievements(stats, gameResult = null, context = {}) {
        const newlyUnlocked = [];
        context.gameEndTime = context.gameEndTime || new Date().toISOString();

        for (const [id, achievement] of Object.entries(this.catalog)) {
            // Saltar si ya está desbloqueado
            if (this.unlockedIds.includes(id)) continue;

            // Verificar condición
            try {
                if (achievement.condition(stats, gameResult, context)) {
                    this.unlockedIds.push(id);
                    newlyUnlocked.push(achievement);
                    this.pendingNotifications.push(achievement);
                }
            } catch (e) {
                console.warn(`Error verificando logro ${id}:`, e);
            }
        }

        return newlyUnlocked;
    },

    /**
     * Obtiene un logro por su ID
     * @param {string} id - ID del logro
     * @returns {Object} Datos del logro
     */
    getAchievement(id) {
        return this.catalog[id] || null;
    },

    /**
     * Obtiene todos los logros con su estado de desbloqueo
     * @returns {Array} Lista de logros con estado
     */
    getAllWithStatus() {
        return Object.values(this.catalog).map(achievement => ({
            ...achievement,
            unlocked: this.unlockedIds.includes(achievement.id)
        }));
    },

    /**
     * Obtiene solo los logros desbloqueados
     * @returns {Array} Lista de logros desbloqueados
     */
    getUnlocked() {
        return this.unlockedIds.map(id => this.catalog[id]).filter(Boolean);
    },

    /**
     * Obtiene los logros bloqueados
     * @returns {Array} Lista de logros no desbloqueados
     */
    getLocked() {
        return Object.values(this.catalog).filter(
            achievement => !this.unlockedIds.includes(achievement.id)
        );
    },

    /**
     * Obtiene el progreso general de logros
     * @returns {Object} Estadísticas de progreso
     */
    getProgress() {
        const total = Object.keys(this.catalog).length;
        const unlocked = this.unlockedIds.length;
        return {
            total,
            unlocked,
            percentage: Math.round((unlocked / total) * 100)
        };
    },

    /**
     * Obtiene y limpia las notificaciones pendientes
     * @returns {Array} Logros pendientes de notificar
     */
    popPendingNotifications() {
        const notifications = [...this.pendingNotifications];
        this.pendingNotifications = [];
        return notifications;
    },

    /**
     * Verifica si un logro específico está desbloqueado
     * @param {string} id - ID del logro
     * @returns {boolean} True si está desbloqueado
     */
    isUnlocked(id) {
        return this.unlockedIds.includes(id);
    },

    // ==================== UI HELPERS ====================

    /**
     * Genera el HTML para mostrar un logro
     * @param {Object} achievement - Datos del logro
     * @param {boolean} showLocked - Mostrar estilo bloqueado si no está desbloqueado
     * @returns {string} HTML del logro
     */
    renderAchievementCard(achievement, showLocked = true) {
        const unlocked = this.isUnlocked(achievement.id);
        const lockedClass = !unlocked && showLocked ? 'achievement-locked' : '';

        // Obtener nombres y descripciones traducidos
        const name = typeof MathMasterI18n !== 'undefined'
            ? MathMasterI18n.getAchievementName(achievement.id)
            : achievement.name;
        const description = typeof MathMasterI18n !== 'undefined'
            ? MathMasterI18n.getAchievementDescription(achievement.id)
            : achievement.description;

        return `
            <div class="achievement-card ${lockedClass}" data-achievement-id="${achievement.id}">
                <div class="achievement-icon">${unlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${name}</div>
                    <div class="achievement-description">${description}</div>
                </div>
            </div>
        `;
    },

    /**
     * Genera el HTML de la lista completa de logros
     * @returns {string} HTML de todos los logros
     */
    renderAchievementsList() {
        const achievements = this.getAllWithStatus();
        const progress = this.getProgress();

        // Obtener título traducido
        const title = typeof MathMasterI18n !== 'undefined'
            ? MathMasterI18n.t('achievements')
            : 'Logros';

        // Ordenar: desbloqueados primero
        achievements.sort((a, b) => {
            if (a.unlocked && !b.unlocked) return -1;
            if (!a.unlocked && b.unlocked) return 1;
            return 0;
        });

        return `
            <div class="achievements-header">
                <h3>${title}</h3>
                <div class="achievements-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                    </div>
                    <span>${progress.unlocked}/${progress.total} (${progress.percentage}%)</span>
                </div>
            </div>
            <div class="achievements-grid">
                ${achievements.map(a => this.renderAchievementCard(a)).join('')}
            </div>
        `;
    },

    /**
     * Genera el HTML para una notificación de logro desbloqueado
     * @param {Object} achievement - Logro desbloqueado
     * @returns {string} HTML de la notificación
     */
    renderNotification(achievement) {
        // Obtener textos traducidos
        const title = typeof MathMasterI18n !== 'undefined'
            ? MathMasterI18n.t('achievementUnlockedTitle')
            : '¡Logro Desbloqueado!';
        const name = typeof MathMasterI18n !== 'undefined'
            ? MathMasterI18n.getAchievementName(achievement.id)
            : achievement.name;

        return `
            <div class="achievement-notification" data-achievement-id="${achievement.id}">
                <div class="notification-content">
                    <div class="notification-icon">${achievement.icon}</div>
                    <div class="notification-text">
                        <div class="notification-title">${title}</div>
                        <div class="notification-name">${name}</div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Muestra notificaciones de logros desbloqueados
     * @param {HTMLElement} container - Contenedor donde mostrar notificaciones
     */
    showNotifications(container) {
        const achievements = this.popPendingNotifications();

        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.innerHTML = this.renderNotification(achievement);
                notification.firstElementChild.classList.add('achievement-notification-enter');
                container.appendChild(notification.firstElementChild);

                // Reproducir sonido
                if (typeof MathMasterAudio !== 'undefined') {
                    MathMasterAudio.playAchievement();
                }

                // Remover después de animación
                setTimeout(() => {
                    const notif = container.querySelector(`[data-achievement-id="${achievement.id}"]`);
                    if (notif) {
                        notif.classList.add('achievement-notification-exit');
                        setTimeout(() => notif.remove(), 500);
                    }
                }, 4000);
            }, index * 1500); // Escalonar notificaciones
        });
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathMasterAchievements;
}
