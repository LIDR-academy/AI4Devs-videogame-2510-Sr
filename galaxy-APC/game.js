/**
 * Galaxy Shooter - Game Logic
 * Controla toda la lógica del juego: movimiento del jugador, disparos, etc.
 */

/**
 * Gestor de audio para efectos de sonido
 * Usa un pool de objetos Audio para evitar problemas de memoria
 */
const audioManager = {
    sounds: {
        shoot: 'assets/shoot.mp3',
        enemyDestroyed: 'assets/enemy_destroyed.mp3',
        gameOver: 'assets/game_over.mp3'
    },
    audioPool: {},
    poolSize: 5,
    
    /**
     * Inicializa el pool de objetos Audio
     */
    initPool() {
        Object.keys(this.sounds).forEach(soundName => {
            this.audioPool[soundName] = [];
            for (let i = 0; i < this.poolSize; i++) {
                const audio = new Audio(this.sounds[soundName]);
                audio.volume = 0.5;
                audio.preload = 'auto';
                this.audioPool[soundName].push(audio);
            }
        });
    },
    
    /**
     * Reproduce un sonido usando el pool de Audio objects
     * @param {string} soundName - Nombre del sonido a reproducir
     */
    playSound(soundName) {
        try {
            const pool = this.audioPool[soundName];
            if (pool && pool.length > 0) {
                // Buscar un audio disponible (pausado o terminado)
                const audio = pool.find(a => a.paused || a.ended) || pool[0];
                audio.currentTime = 0; // Reiniciar desde el inicio
                audio.play().catch(() => {
                    // Silenciar errores si el archivo no existe o no se puede reproducir
                });
            } else {
                // Fallback: crear nuevo audio si el pool no está inicializado
                const soundPath = this.sounds[soundName];
                if (soundPath) {
                    const audio = new Audio(soundPath);
                    audio.volume = 0.5;
                    audio.preload = 'auto';
                    audio.play().catch(() => {});
                }
            }
        } catch (error) {
            // Manejar errores silenciosamente
            console.log(`Error al reproducir sonido: ${soundName}`, error);
        }
    }
};

// Contador global para identificar loops del juego y evitar múltiples instancias
let gameLoopId = 0;

// Estado del juego
const gameState = {
    player: {
        element: null,
        position: 0, // Posición horizontal (0 = centro)
        speed: 5, // Velocidad de movimiento en píxeles
        width: 40 // Ancho de la nave (para cálculos)
    },
    projectiles: [], // Array para almacenar todos los proyectiles activos
    enemies: [], // Array para almacenar todos los enemigos activos
    enemyDirection: 1, // Dirección de movimiento: 1 = derecha, -1 = izquierda
    enemySpeed: 2, // Velocidad horizontal de los enemigos
    enemyRowHeight: 50, // Altura entre filas de enemigos
    enemyConfig: {
        rows: 3, // Número de filas de enemigos
        perRow: 8, // Enemigos por fila
        spacing: 60, // Espaciado horizontal entre enemigos
        startY: 50 // Posición Y inicial de la primera fila
    },
    score: 0, // Puntaje del jugador
    lives: 3, // Vidas del jugador
    currentLevel: 1, // Nivel actual del juego
    levelComplete: false, // Flag para indicar si el nivel está completo
    showingLevelMessage: false, // Flag para controlar mensaje de nivel
    lastShotTime: 0, // Timestamp del último disparo para cooldown
    shootCooldown: 150, // Cooldown entre disparos en milisegundos
    lifeLostThisFrame: false, // Flag para evitar perder múltiples vidas en un frame
    keys: {}, // Objeto para rastrear qué teclas están presionadas
    gameArea: null,
    isRunning: true
};

/**
 * Muestra el menú inicial
 */
function showStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const gameArea = document.getElementById('game-area');
    if (startMenu) {
        startMenu.style.display = 'flex';
    }
    if (gameArea) {
        gameArea.style.display = 'none';
    }
}

/**
 * Oculta el menú inicial y muestra el juego
 */
function hideStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const gameArea = document.getElementById('game-area');
    if (startMenu) {
        startMenu.style.display = 'none';
    }
    if (gameArea) {
        gameArea.style.display = 'block';
    }
}

/**
 * Maneja la tecla Enter para iniciar el juego desde el menú
 * Función nombrada para permitir cleanup del event listener
 */
function handleEnterKey(event) {
    const startMenu = document.getElementById('start-menu');
    if (event.code === 'Enter' && startMenu && startMenu.style.display !== 'none') {
        startGame();
    }
}

/**
 * Inicializa el juego cuando se carga la página
 */
function initGame() {
    // Obtener referencias a los elementos del DOM
    gameState.gameArea = document.getElementById('game-area');
    gameState.player.element = document.getElementById('player');
    
    // Mostrar menú inicial
    showStartMenu();
    
    // Configurar event listeners para las teclas
    setupEventListeners();
    
    // Configurar botón de inicio
    const startButton = document.getElementById('start-button');
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
    
    // También permitir iniciar con tecla Enter (usando función nombrada para cleanup)
    document.addEventListener('keydown', handleEnterKey);
    
    // Inicializar pool de audio
    audioManager.initPool();
    
    console.log('Juego inicializado correctamente');
}

/**
 * Inicia el juego (oculta menú y comienza el loop)
 */
function startGame() {
    // Remover el listener de Enter para evitar acumulación de handlers
    document.removeEventListener('keydown', handleEnterKey);
    
    hideStartMenu();
    
    // Inicializar puntaje, vidas y nivel
    gameState.score = 0;
    gameState.lives = 3;
    gameState.currentLevel = 1;
    gameState.levelComplete = false;
    gameState.showingLevelMessage = false;
    
    updateScore(0);
    updateLives();
    updateLevelDisplay();
    
    // Calcular posición inicial del jugador (centro)
    const gameAreaWidth = gameState.gameArea.offsetWidth;
    gameState.player.position = (gameAreaWidth - gameState.player.width) / 2;
    updatePlayerPosition();
    
    // Iniciar desde el Nivel 1
    startLevel(1);
    
    // Mostrar mensaje de inicio de nivel
    showLevelMessage(1);
    
    // Reiniciar estado
    gameState.isRunning = true;
    
    // Incrementar gameLoopId para invalidar loops anteriores
    gameLoopId++;
    // Iniciar el loop principal del juego con el nuevo ID
    gameLoop(gameLoopId);
}

/**
 * Configura los event listeners para el teclado
 */
function setupEventListeners() {
    // Detectar cuando se presiona una tecla
    document.addEventListener('keydown', (event) => {
        gameState.keys[event.code] = true;
        
        // Si se presiona espacio, disparar
        if (event.code === 'Space') {
            event.preventDefault(); // Evitar que la página haga scroll
            shoot();
        }
    });
    
    // Detectar cuando se suelta una tecla
    document.addEventListener('keyup', (event) => {
        gameState.keys[event.code] = false;
    });
}

/**
 * Actualiza la posición visual del jugador en la pantalla
 */
function updatePlayerPosition() {
    const gameAreaWidth = gameState.gameArea.offsetWidth;
    const playerWidth = gameState.player.width;
    
    // Asegurar que el jugador no salga de los límites
    if (gameState.player.position < 0) {
        gameState.player.position = 0;
    } else if (gameState.player.position > gameAreaWidth - playerWidth) {
        gameState.player.position = gameAreaWidth - playerWidth;
    }
    
    // Actualizar la posición CSS del elemento
    gameState.player.element.style.left = gameState.player.position + 'px';
}

/**
 * Maneja el movimiento del jugador basado en las teclas presionadas
 */
function handlePlayerMovement() {
    // Mover a la izquierda (flecha izquierda o tecla A)
    if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) {
        gameState.player.position -= gameState.player.speed;
    }
    
    // Mover a la derecha (flecha derecha o tecla D)
    if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) {
        gameState.player.position += gameState.player.speed;
    }
    
    // Actualizar posición visual
    updatePlayerPosition();
}

/**
 * Crea un nuevo proyectil y lo añade al juego
 */
function shoot() {
    // Verificar cooldown para evitar spam de disparos
    const now = Date.now();
    if (now - gameState.lastShotTime < gameState.shootCooldown) {
        return;
    }
    gameState.lastShotTime = now;
    
    // Crear elemento div para el proyectil
    const projectile = document.createElement('div');
    projectile.className = 'projectile';
    
    // Posicionar el proyectil en la punta de la nave
    const playerRect = gameState.player.element.getBoundingClientRect();
    const gameAreaRect = gameState.gameArea.getBoundingClientRect();
    
    const projectileX = playerRect.left - gameAreaRect.left + (playerRect.width / 2) - 2;
    const projectileY = playerRect.top - gameAreaRect.top;
    
    projectile.style.left = projectileX + 'px';
    projectile.style.top = projectileY + 'px';
    
    // Añadir el proyectil al área de juego
    gameState.gameArea.appendChild(projectile);
    
    // Guardar información del proyectil en el array
    gameState.projectiles.push({
        element: projectile,
        x: projectileX,
        y: projectileY,
        speed: 8 // Velocidad del proyectil hacia arriba
    });
    
    // Reproducir sonido de disparo
    audioManager.playSound('shoot');
}

/**
 * Actualiza la posición de todos los proyectiles
 */
function updateProjectiles() {
    const gameAreaHeight = gameState.gameArea.offsetHeight;
    
    // Iterar sobre todos los proyectiles (en reversa para poder eliminar elementos)
    for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
        const projectile = gameState.projectiles[i];
        
        // Mover el proyectil hacia arriba
        projectile.y -= projectile.speed;
        projectile.element.style.top = projectile.y + 'px';
        
        // Si el proyectil sale de la pantalla, eliminarlo
        if (projectile.y + projectile.element.offsetHeight < 0) {
            // Remover del DOM
            projectile.element.remove();
            // Remover del array
            gameState.projectiles.splice(i, 1);
        }
    }
}

/**
 * Obtiene la configuración de dificultad para un nivel específico
 * @param {number} levelNumber - Número del nivel
 * @returns {Object} Configuración del nivel (rows, perRow, speed, spacing)
 */
function getLevelConfig(levelNumber) {
    const baseSpeed = 2;
    const baseRows = 3;
    const basePerRow = 8;
    
    // Calcular dificultad progresiva
    // Velocidad aumenta con cada nivel
    const speed = baseSpeed + (levelNumber * 0.5);
    
    // Filas aumentan cada 2 niveles, máximo 5 filas
    const rows = Math.min(baseRows + Math.floor(levelNumber / 2), 5);
    
    // Enemigos por fila aumentan cada 3 niveles, máximo 12
    const perRow = Math.min(basePerRow + Math.floor(levelNumber / 3), 12);
    
    // Espaciado base, ajustado según cantidad de enemigos
    let spacing = 60;
    if (perRow > 10) {
        spacing = 55;
    } else if (perRow > 8) {
        spacing = 58;
    }
    
    // Ajustes para pantallas pequeñas (mantener responsive)
    if (window.innerWidth <= 480) {
        return {
            rows: Math.min(rows, 2),
            perRow: Math.min(perRow, 5),
            speed: speed * 0.8, // Ligeramente más lento en móviles
            spacing: 50
        };
    } else if (window.innerWidth <= 768) {
        return {
            rows: Math.min(rows, 2),
            perRow: Math.min(perRow, 6),
            speed: speed * 0.9,
            spacing: 55
        };
    }
    
    return {
        rows: rows,
        perRow: perRow,
        speed: speed,
        spacing: spacing
    };
}

/**
 * Crea los enemigos según la configuración del nivel actual
 */
function createEnemies() {
    // Obtener configuración del nivel actual
    const levelConfig = getLevelConfig(gameState.currentLevel);
    
    // Aplicar velocidad de enemigos según el nivel
    gameState.enemySpeed = levelConfig.speed;
    
    const gameAreaWidth = gameState.gameArea.offsetWidth;
    const rows = levelConfig.rows;
    const perRow = levelConfig.perRow;
    const spacing = levelConfig.spacing;
    
    // Calcular posición inicial para centrar el grupo de enemigos
    const totalWidth = (perRow - 1) * spacing;
    const startX = (gameAreaWidth - totalWidth) / 2;
    
    // Crear enemigos en filas
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < perRow; col++) {
            const enemy = document.createElement('div');
            enemy.className = 'enemy';
            
            const x = startX + (col * spacing);
            const y = gameState.enemyConfig.startY + (row * gameState.enemyRowHeight);
            
            enemy.style.left = x + 'px';
            enemy.style.top = y + 'px';
            
            // Añadir el enemigo al área de juego
            gameState.gameArea.appendChild(enemy);
            
            // Guardar información del enemigo en el array
            gameState.enemies.push({
                element: enemy,
                x: x,
                y: y,
                row: row,
                col: col
            });
        }
    }
}

/**
 * Actualiza la posición de todos los enemigos
 */
function updateEnemies() {
    if (gameState.enemies.length === 0) {
        return;
    }
    
    const gameAreaWidth = gameState.gameArea.offsetWidth;
    const gameAreaHeight = gameState.gameArea.offsetHeight;
    let shouldMoveDown = false;
    let minX = Infinity;
    let maxX = -Infinity;
    
    // Resetear flag de vida perdida para este frame
    gameState.lifeLostThisFrame = false;
    
    // Encontrar los límites horizontales de los enemigos
    gameState.enemies.forEach(enemy => {
        if (enemy.x < minX) minX = enemy.x;
        if (enemy.x > maxX) maxX = enemy.x;
    });
    
    const enemyWidth = gameState.enemies[0].element.offsetWidth;
    
    // Verificar si necesitamos cambiar de dirección
    if ((gameState.enemyDirection > 0 && maxX + enemyWidth >= gameAreaWidth) ||
        (gameState.enemyDirection < 0 && minX <= 0)) {
        gameState.enemyDirection *= -1; // Cambiar dirección
        shouldMoveDown = true;
    }
    
    // Mover enemigos
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        
        // Mover horizontalmente
        enemy.x += gameState.enemySpeed * gameState.enemyDirection;
        
        // Si debemos bajar, mover verticalmente
        if (shouldMoveDown) {
            enemy.y += gameState.enemyRowHeight;
        }
        
        // Actualizar posición visual
        enemy.element.style.left = enemy.x + 'px';
        enemy.element.style.top = enemy.y + 'px';
        
        // Si un enemigo llega a la parte inferior, el jugador pierde una vida
        if (enemy.y + enemy.element.offsetHeight > gameAreaHeight - 100) {
            // Eliminar el enemigo
            enemy.element.remove();
            gameState.enemies.splice(i, 1);
            // El jugador pierde una vida (solo una vez por frame)
            if (!gameState.lifeLostThisFrame) {
                loseLife();
                gameState.lifeLostThisFrame = true;
            }
        }
    }
}

/**
 * Detecta colisiones entre proyectiles y enemigos usando bounding boxes
 * @returns {Object} Objeto con arrays de proyectiles y enemigos colisionados
 */
function checkCollisions() {
    const collisions = {
        projectiles: [],
        enemies: []
    };
    
    // Iterar sobre todos los proyectiles
    for (let p = 0; p < gameState.projectiles.length; p++) {
        const projectile = gameState.projectiles[p];
        const projRect = projectile.element.getBoundingClientRect();
        
        // Iterar sobre todos los enemigos
        for (let e = 0; e < gameState.enemies.length; e++) {
            const enemy = gameState.enemies[e];
            const enemyRect = enemy.element.getBoundingClientRect();
            
            // Verificar intersección de bounding boxes
            if (projRect.left < enemyRect.right &&
                projRect.right > enemyRect.left &&
                projRect.top < enemyRect.bottom &&
                projRect.bottom > enemyRect.top) {
                
                // Colisión detectada
                if (!collisions.projectiles.includes(p)) {
                    collisions.projectiles.push(p);
                }
                if (!collisions.enemies.includes(e)) {
                    collisions.enemies.push(e);
                }
            }
        }
    }
    
    return collisions;
}

/**
 * Maneja las colisiones detectadas: elimina proyectiles y enemigos colisionados
 */
function handleCollisions() {
    const collisions = checkCollisions();
    
    // Eliminar enemigos colisionados (en orden inverso para mantener índices correctos)
    collisions.enemies.sort((a, b) => b - a).forEach(enemyIndex => {
        const enemy = gameState.enemies[enemyIndex];
        enemy.element.remove();
        gameState.enemies.splice(enemyIndex, 1);
        console.log('Enemigo destruido!');
        // Sumar puntos por enemigo destruido
        updateScore(100);
        // Reproducir sonido de enemigo destruido
        audioManager.playSound('enemyDestroyed');
    });
    
    // Eliminar proyectiles colisionados (en orden inverso)
    collisions.projectiles.sort((a, b) => b - a).forEach(projIndex => {
        const projectile = gameState.projectiles[projIndex];
        projectile.element.remove();
        gameState.projectiles.splice(projIndex, 1);
    });
}

/**
 * Actualiza el puntaje del jugador
 * @param {number} points - Puntos a sumar (puede ser negativo para restar)
 */
function updateScore(points) {
    gameState.score += points;
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Puntaje: ${gameState.score}`;
    }
}

/**
 * Actualiza el display de vidas del jugador
 */
function updateLives() {
    const livesElement = document.getElementById('lives');
    if (livesElement) {
        livesElement.textContent = `Vidas: ${gameState.lives}`;
    }
}

/**
 * Actualiza el display del nivel actual
 */
function updateLevelDisplay() {
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = `Nivel: ${gameState.currentLevel}`;
    }
}

/**
 * Inicializa un nivel específico con su configuración de dificultad
 * @param {number} levelNumber - Número del nivel a iniciar
 */
function startLevel(levelNumber) {
    // Establecer nivel actual
    gameState.currentLevel = levelNumber;
    gameState.levelComplete = false;
    gameState.showingLevelMessage = false;
    
    // Actualizar UI del nivel
    updateLevelDisplay();
    
    // Reiniciar dirección de enemigos
    gameState.enemyDirection = 1;
    
    // Asegurar que el juego esté corriendo
    gameState.isRunning = true;
    
    // Limpiar proyectiles restantes del nivel anterior
    gameState.projectiles.forEach(proj => proj.element.remove());
    gameState.projectiles = [];
    
    // Crear enemigos con la configuración del nivel
    createEnemies();
    
    console.log(`Nivel ${levelNumber} iniciado`);
}

/**
 * Muestra un mensaje temporal indicando el nivel
 * @param {number} levelNumber - Número del nivel a mostrar
 * @param {string} message - Mensaje personalizado (opcional)
 */
function showLevelMessage(levelNumber, message = null) {
    // Evitar mostrar múltiples mensajes simultáneamente
    if (gameState.showingLevelMessage) {
        return;
    }
    
    gameState.showingLevelMessage = true;
    
    // Crear overlay de mensaje de nivel
    const levelMessageOverlay = document.createElement('div');
    levelMessageOverlay.id = 'level-message';
    levelMessageOverlay.className = 'level-message-overlay';
    
    const levelMessageContent = document.createElement('div');
    levelMessageContent.className = 'level-message-content';
    
    const levelMessageText = document.createElement('h2');
    levelMessageText.textContent = message || `Nivel ${levelNumber}`;
    
    levelMessageContent.appendChild(levelMessageText);
    levelMessageOverlay.appendChild(levelMessageContent);
    
    document.getElementById('game-container').appendChild(levelMessageOverlay);
    
    // Ocultar mensaje después de 2.5 segundos
    setTimeout(() => {
        if (levelMessageOverlay.parentNode) {
            levelMessageOverlay.remove();
        }
        gameState.showingLevelMessage = false;
    }, 2500);
}

/**
 * Completa el nivel actual y avanza al siguiente
 */
function completeLevel() {
    // Evitar múltiples llamadas
    if (gameState.levelComplete || gameState.showingLevelMessage) {
        return;
    }
    
    gameState.levelComplete = true;
    gameState.isRunning = false; // Pausar temporalmente
    
    // Mostrar mensaje de nivel completado
    showLevelMessage(gameState.currentLevel, `Nivel ${gameState.currentLevel} Completado!`);
    
    // Esperar un momento antes de iniciar el siguiente nivel
    setTimeout(() => {
        // Mostrar mensaje del siguiente nivel
        showLevelMessage(gameState.currentLevel + 1, `Nivel ${gameState.currentLevel + 1}`);
        
        // Esperar un poco más antes de iniciar
        setTimeout(() => {
            // Iniciar siguiente nivel
            startLevel(gameState.currentLevel + 1);
            
            // Incrementar gameLoopId para invalidar loops anteriores
            gameLoopId++;
            // Reiniciar el loop con el nuevo ID
            gameState.isRunning = true;
            gameLoop(gameLoopId);
        }, 2500);
    }, 2500);
}

/**
 * Reduce una vida del jugador y verifica Game Over
 */
function loseLife() {
    gameState.lives--;
    updateLives();
    
    if (gameState.lives <= 0) {
        gameOver();
    }
}

/**
 * Muestra la pantalla de Game Over y detiene el juego
 */
function gameOver() {
    gameState.isRunning = false;
    
    // Reproducir sonido de Game Over
    audioManager.playSound('gameOver');
    
    // Crear overlay de Game Over
    const gameOverOverlay = document.createElement('div');
    gameOverOverlay.id = 'game-over';
    
    const gameOverContent = document.createElement('div');
    gameOverContent.className = 'game-over-content';
    
    const gameOverTitle = document.createElement('h2');
    gameOverTitle.textContent = 'Game Over';
    
    const gameOverScore = document.createElement('p');
    gameOverScore.textContent = `Puntaje Final: ${gameState.score}`;
    
    const gameOverLevel = document.createElement('p');
    gameOverLevel.textContent = `Nivel Alcanzado: ${gameState.currentLevel}`;
    gameOverLevel.className = 'game-over-level';
    
    const restartButton = document.createElement('button');
    restartButton.id = 'restart-button';
    restartButton.textContent = 'Volver a Jugar';
    restartButton.addEventListener('click', resetGame);
    
    gameOverContent.appendChild(gameOverTitle);
    gameOverContent.appendChild(gameOverScore);
    gameOverContent.appendChild(gameOverLevel);
    gameOverContent.appendChild(restartButton);
    gameOverOverlay.appendChild(gameOverContent);
    
    document.getElementById('game-container').appendChild(gameOverOverlay);
}

/**
 * Reinicia el juego completamente desde el Nivel 1
 */
function resetGame() {
    // Remover overlay de Game Over si existe
    const gameOverOverlay = document.getElementById('game-over');
    if (gameOverOverlay) {
        gameOverOverlay.remove();
    }
    
    // Remover mensaje de nivel si existe
    const levelMessage = document.getElementById('level-message');
    if (levelMessage) {
        levelMessage.remove();
    }
    
    // Limpiar DOM de elementos dinámicos usando referencias de arrays antes de limpiarlos
    gameState.projectiles.forEach(proj => proj.element.remove());
    gameState.enemies.forEach(enemy => enemy.element.remove());
    
    // Limpiar arrays después de limpiar DOM
    gameState.projectiles = [];
    gameState.enemies = [];
    
    // Reiniciar estado del juego
    gameState.score = 0;
    gameState.lives = 3;
    gameState.currentLevel = 1;
    gameState.levelComplete = false;
    gameState.showingLevelMessage = false;
    gameState.enemyDirection = 1;
    gameState.isRunning = true;
    
    // Actualizar UI
    updateScore(0);
    updateLives();
    updateLevelDisplay();
    
    // Iniciar desde el Nivel 1
    startLevel(1);
    
    // Reiniciar posición del jugador
    const gameAreaWidth = gameState.gameArea.offsetWidth;
    gameState.player.position = (gameAreaWidth - gameState.player.width) / 2;
    updatePlayerPosition();
    
    // Incrementar gameLoopId para invalidar loops anteriores
    gameLoopId++;
    // Reiniciar el loop con el nuevo ID
    gameLoop(gameLoopId);
}

/**
 * Loop principal del juego - se ejecuta continuamente
 * @param {number} loopId - ID del loop para evitar múltiples instancias concurrentes
 */
function gameLoop(loopId) {
    // Detener si este es un loop obsoleto
    if (loopId !== undefined && loopId !== gameLoopId) {
        return;
    }
    
    if (!gameState.isRunning) {
        return;
    }
    
    // Actualizar movimiento del jugador
    handlePlayerMovement();
    
    // Actualizar posición de los proyectiles
    updateProjectiles();
    
    // Actualizar posición de los enemigos
    updateEnemies();
    
    // Verificar y manejar colisiones
    handleCollisions();
    
    // Verificar si el nivel está completado (todos los enemigos destruidos)
    if (gameState.enemies.length === 0 && 
        gameState.isRunning && 
        !gameState.levelComplete && 
        !gameState.showingLevelMessage) {
        completeLevel();
    }
    
    // Continuar el loop (aproximadamente 60 FPS) con el mismo loopId
    requestAnimationFrame(() => gameLoop(loopId));
}

// Inicializar el juego cuando se carga la página
window.addEventListener('DOMContentLoaded', initGame);
