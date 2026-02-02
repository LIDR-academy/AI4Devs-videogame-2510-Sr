/* =============================================
   El Político Corrupto - Lógica del Juego
   ============================================= */

// ============================================
// CONFIGURACIÓN DEL CANVAS Y ELEMENTOS UI
// ============================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Elementos de la interfaz
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const activePowerupDisplay = document.getElementById('activePowerup');

// ============================================
// CARGA DE IMAGEN DEL JUGADOR
// ============================================

const playerImage = new Image();
playerImage.src = 'imagenes/pp-psoe-una-alianza-buena-para-rajoy-y-sa-nchez-que-no-para-nuestra-espan-a-degenerada.jpeg';
let playerImageLoaded = false;
playerImage.onload = () => {
    playerImageLoaded = true;
};

// ============================================
// CONFIGURACIÓN DE PANTALLA DINÁMICA
// ============================================

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reinicializar plataformas si el juego está corriendo
    if (gameRunning) {
        initPlatforms();
    }
}

// Inicializar tamaño del canvas
resizeCanvas();

// Escuchar cambios de tamaño de ventana
window.addEventListener('resize', resizeCanvas);

// ============================================
// ESTADO DEL JUEGO
// ============================================

let gameRunning = false;
let score = 0;
let lives = 3;
let timeLeft = 60;
let timerInterval;
let animationId;

// ============================================
// CONFIGURACIÓN DEL JUGADOR
// ============================================

const player = {
    x: 100,
    y: 400,
    width: 80,
    height: 100,
    velocityX: 0,
    velocityY: 0,
    speed: 7,
    jumpForce: -18,
    onGround: false,
    facingRight: true,
    // Estados de power-ups
    doublePoints: false,
    invincible: false,
    flying: false,
    powerupTimer: 0
};

// ============================================
// CONSTANTES DE FÍSICA
// ============================================

const GRAVITY = 0.7;
const FRICTION = 0.85;

// ============================================
// ARRAYS DE ELEMENTOS DEL JUEGO
// ============================================

let platforms = [];
let money = [];
let obstacles = [];
let powerups = [];

// ============================================
// CONTROLES DEL TECLADO
// ============================================

const keys = {
    left: false,
    right: false,
    space: false
};

// ============================================
// INICIALIZACIÓN DE PLATAFORMAS (DINÁMICAS)
// ============================================

function initPlatforms() {
    const w = canvas.width;
    const h = canvas.height;

    platforms = [
        // Suelo
        { x: 0, y: h - 50, width: w, height: 50, color: '#228B22', isGround: true },
        // Plataformas flotantes - distribuidas proporcionalmente
        { x: w * 0.05, y: h * 0.75, width: w * 0.15, height: 25, color: '#8B4513', isGround: false },
        { x: w * 0.30, y: h * 0.63, width: w * 0.12, height: 25, color: '#8B4513', isGround: false },
        { x: w * 0.55, y: h * 0.53, width: w * 0.15, height: 25, color: '#8B4513', isGround: false },
        { x: w * 0.78, y: h * 0.67, width: w * 0.15, height: 25, color: '#8B4513', isGround: false },
        { x: w * 0.18, y: h * 0.47, width: w * 0.12, height: 25, color: '#8B4513', isGround: false },
        { x: w * 0.42, y: h * 0.37, width: w * 0.15, height: 25, color: '#8B4513', isGround: false },
        { x: w * 0.68, y: h * 0.30, width: w * 0.12, height: 25, color: '#8B4513', isGround: false },
        { x: w * 0.05, y: h * 0.25, width: w * 0.10, height: 25, color: '#8B4513', isGround: false },
        { x: w * 0.88, y: h * 0.47, width: w * 0.10, height: 25, color: '#8B4513', isGround: false },
        // Plataformas adicionales para pantallas grandes
        { x: w * 0.25, y: h * 0.20, width: w * 0.10, height: 25, color: '#8B4513', isGround: false },
        { x: w * 0.50, y: h * 0.15, width: w * 0.12, height: 25, color: '#8B4513', isGround: false }
    ];

    // Reiniciar posición del jugador al centro-abajo
    player.x = w * 0.1;
    player.y = h - 150;
}

// ============================================
// GENERACIÓN DE ELEMENTOS
// ============================================

/**
 * Genera billetes que caen del cielo
 */
function spawnMoney() {
    const maxMoney = Math.floor(canvas.width / 100); // Más dinero en pantallas más anchas
    if (money.length < maxMoney && Math.random() < 0.04) {
        const types = [
            { value: 10, color: '#228B22', symbol: '💵' },
            { value: 50, color: '#1E90FF', symbol: '💶' },
            { value: 100, color: '#FFD700', symbol: '🥇' }
        ];
        // Probabilidad: 60% verde, 32% azul, 8% oro
        const typeIndex = Math.random() < 0.6 ? 0 : (Math.random() < 0.8 ? 1 : 2);
        const type = types[typeIndex];

        money.push({
            x: Math.random() * (canvas.width - 40),
            y: -40,
            width: 40,
            height: 40,
            velocityY: 2 + Math.random() * 3,
            ...type
        });
    }
}

/**
 * Genera obstáculos que se mueven horizontalmente
 */
function spawnObstacle() {
    const maxObstacles = Math.floor(canvas.width / 200);
    if (obstacles.length < maxObstacles && Math.random() < 0.01) {
        const types = [
            { type: 'journalist', color: '#FF6B6B', symbol: '📸', damage: 1 },
            { type: 'judge', color: '#4A4A4A', symbol: '⚖️', damage: 3 },
            { type: 'citizen', color: '#FFA500', symbol: '😠', damage: 1 }
        ];
        const typeIndex = Math.floor(Math.random() * types.length);
        const obstacleType = types[typeIndex];
        const fromLeft = Math.random() < 0.5;

        obstacles.push({
            x: fromLeft ? -50 : canvas.width,
            y: canvas.height - 110,
            width: 50,
            height: 60,
            velocityX: fromLeft ? 3 + Math.random() * 3 : -(3 + Math.random() * 3),
            ...obstacleType
        });
    }
}

/**
 * Genera power-ups sobre las plataformas
 */
function spawnPowerup() {
    if (powerups.length < 1 && Math.random() < 0.004) {
        const types = [
            { type: 'double', color: '#FFD700', symbol: '💼', duration: 10000 },
            { type: 'invincible', color: '#9400D3', symbol: '👔', duration: 8000 },
            { type: 'fly', color: '#00CED1', symbol: '🚁', duration: 6000 }
        ];
        const typeIndex = Math.floor(Math.random() * types.length);
        const powerupType = types[typeIndex];

        // Spawn sobre una plataforma aleatoria (no el suelo)
        const floatingPlatforms = platforms.filter(p => !p.isGround);
        if (floatingPlatforms.length > 0) {
            const platform = floatingPlatforms[Math.floor(Math.random() * floatingPlatforms.length)];

            powerups.push({
                x: platform.x + platform.width / 2 - 20,
                y: platform.y - 45,
                width: 40,
                height: 40,
                ...powerupType
            });
        }
    }
}

// ============================================
// FUNCIONES DE DIBUJADO
// ============================================

/**
 * Dibuja el fondo con edificios (proporcionales)
 */
function drawBackground() {
    const w = canvas.width;
    const h = canvas.height;

    // Edificios de fondo (posiciones proporcionales)
    ctx.fillStyle = '#B8B8B8';

    const buildings = [
        { x: w * 0.05, y: h * 0.65, width: w * 0.08, height: h * 0.35 },
        { x: w * 0.18, y: h * 0.55, width: w * 0.10, height: h * 0.45 },
        { x: w * 0.35, y: h * 0.68, width: w * 0.06, height: h * 0.32 },
        { x: w * 0.62, y: h * 0.60, width: w * 0.09, height: h * 0.40 },
        { x: w * 0.80, y: h * 0.55, width: w * 0.12, height: h * 0.45 }
    ];

    buildings.forEach(b => {
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    // Ventanas
    ctx.fillStyle = '#4169E1';
    buildings.forEach(building => {
        const windowWidth = building.width * 0.25;
        const windowHeight = building.height * 0.08;
        const windowGapX = building.width * 0.15;
        const windowGapY = building.height * 0.12;

        for (let wy = 0; wy < 4; wy++) {
            for (let wx = 0; wx < 2; wx++) {
                ctx.fillRect(
                    building.x + windowGapX + wx * (windowWidth + windowGapX),
                    building.y + windowGapY + wy * (windowHeight + windowGapY),
                    windowWidth,
                    windowHeight
                );
            }
        }
    });
}

/**
 * Dibuja al jugador (político) usando la imagen
 */
function drawPlayer() {
    ctx.save();

    const pw = player.width;
    const ph = player.height;

    // Parpadeo cuando es invencible
    if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }

    // Efecto de vuelo (propulsor) - dibujado debajo del jugador
    if (player.flying) {
        ctx.fillStyle = '#00CED1';
        ctx.beginPath();
        ctx.moveTo(player.x, player.y + ph);
        ctx.lineTo(player.x + pw * 0.5, player.y + ph + 30);
        ctx.lineTo(player.x + pw, player.y + ph);
        ctx.closePath();
        ctx.fill();
    }

    // Dibujar la imagen del político
    if (playerImageLoaded) {
        // Voltear horizontalmente según dirección
        if (!player.facingRight) {
            ctx.translate(player.x + pw, player.y);
            ctx.scale(-1, 1);
            ctx.drawImage(playerImage, 0, 0, pw, ph);
        } else {
            ctx.drawImage(playerImage, player.x, player.y, pw, ph);
        }
    } else {
        // Fallback: rectángulo si la imagen no ha cargado
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(player.x, player.y, pw, ph);
    }

    ctx.restore();
}

/**
 * Dibuja las plataformas
 */
function drawPlatforms() {
    platforms.forEach(platform => {
        // Base de la plataforma
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Hierba encima (solo para el suelo)
        if (platform.isGround) {
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(platform.x, platform.y, platform.width, 12);
        } else {
            // Vetas de madera para plataformas flotantes
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < platform.width; i += 25) {
                ctx.moveTo(platform.x + i, platform.y + 6);
                ctx.lineTo(platform.x + i + 12, platform.y + 18);
            }
            ctx.stroke();
        }
    });
}

/**
 * Dibuja los billetes
 */
function drawMoney() {
    money.forEach(m => {
        ctx.font = '32px Arial';
        ctx.fillText(m.symbol, m.x, m.y + 30);
    });
}

/**
 * Dibuja los obstáculos
 */
function drawObstacles() {
    obstacles.forEach(obs => {
        ctx.font = '48px Arial';
        ctx.fillText(obs.symbol, obs.x, obs.y + 45);
    });
}

/**
 * Dibuja los power-ups con efecto de brillo
 */
function drawPowerups() {
    powerups.forEach(p => {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.font = '36px Arial';
        ctx.fillText(p.symbol, p.x, p.y + 32);
        ctx.shadowBlur = 0;
    });
}

// ============================================
// FUNCIONES DE ACTUALIZACIÓN
// ============================================

/**
 * Actualiza la posición y estado del jugador
 */
function updatePlayer() {
    // Movimiento horizontal
    if (keys.left) {
        player.velocityX = -player.speed;
        player.facingRight = false;
    } else if (keys.right) {
        player.velocityX = player.speed;
        player.facingRight = true;
    } else {
        player.velocityX *= FRICTION;
    }

    // Salto
    if (keys.space && (player.onGround || player.flying)) {
        if (player.flying) {
            player.velocityY = -10;
        } else {
            player.velocityY = player.jumpForce;
            player.onGround = false;
        }
    }

    // Aplicar gravedad (reducida cuando vuela)
    if (player.flying) {
        player.velocityY += GRAVITY * 0.3;
        if (player.velocityY > 4) player.velocityY = 4;
    } else {
        player.velocityY += GRAVITY;
    }

    // Actualizar posición
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Límites de pantalla
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;

    // Colisión con plataformas
    player.onGround = false;
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y + player.height < platform.y + platform.height + player.velocityY + 1 &&
            player.velocityY >= 0) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.onGround = true;
        }
    });

    // Caer fuera de pantalla
    if (player.y > canvas.height) {
        loseLife();
    }
}

/**
 * Actualiza la posición de los billetes y detecta colisiones
 */
function updateMoney() {
    for (let i = money.length - 1; i >= 0; i--) {
        money[i].y += money[i].velocityY;

        // Eliminar si sale de pantalla
        if (money[i].y > canvas.height) {
            money.splice(i, 1);
            continue;
        }

        // Colisión con jugador
        if (checkCollision(player, money[i])) {
            const points = player.doublePoints ? money[i].value * 2 : money[i].value;
            score += points;
            updateUI();
            money.splice(i, 1);
        }
    }
}

/**
 * Actualiza la posición de los obstáculos y detecta colisiones
 */
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x += obstacles[i].velocityX;

        // Eliminar si sale de pantalla
        if (obstacles[i].x < -60 || obstacles[i].x > canvas.width + 60) {
            obstacles.splice(i, 1);
            continue;
        }

        // Colisión con jugador
        if (!player.invincible && checkCollision(player, obstacles[i])) {
            loseLife();
            obstacles.splice(i, 1);
        }
    }
}

/**
 * Actualiza los power-ups y sus temporizadores
 */
function updatePowerups() {
    for (let i = powerups.length - 1; i >= 0; i--) {
        // Colisión con jugador
        if (checkCollision(player, powerups[i])) {
            activatePowerup(powerups[i]);
            powerups.splice(i, 1);
        }
    }

    // Actualizar temporizador de power-up activo
    if (player.powerupTimer > 0) {
        player.powerupTimer -= 16; // aproximadamente 60fps
        if (player.powerupTimer <= 0) {
            deactivatePowerups();
        }
    }
}

// ============================================
// SISTEMA DE POWER-UPS
// ============================================

/**
 * Activa un power-up
 */
function activatePowerup(powerup) {
    deactivatePowerups();
    player.powerupTimer = powerup.duration;

    switch (powerup.type) {
        case 'double':
            player.doublePoints = true;
            showPowerupMessage('💼 ¡PUNTOS DOBLES!');
            break;
        case 'invincible':
            player.invincible = true;
            showPowerupMessage('👔 ¡INMUNIDAD!');
            break;
        case 'fly':
            player.flying = true;
            showPowerupMessage('🚁 ¡VOLANDO!');
            break;
    }
}

/**
 * Desactiva todos los power-ups
 */
function deactivatePowerups() {
    player.doublePoints = false;
    player.invincible = false;
    player.flying = false;
    player.powerupTimer = 0;
    activePowerupDisplay.style.display = 'none';
}

/**
 * Muestra mensaje de power-up activo
 */
function showPowerupMessage(message) {
    activePowerupDisplay.textContent = message;
    activePowerupDisplay.style.display = 'block';
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Detecta colisión entre dos rectángulos
 */
function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

/**
 * Pierde una vida y reinicia posición
 */
function loseLife() {
    lives--;
    updateUI();

    if (lives <= 0) {
        endGame();
    } else {
        // Reiniciar posición del jugador
        player.x = canvas.width * 0.1;
        player.y = canvas.height - 150;
        player.velocityX = 0;
        player.velocityY = 0;

        // Invencibilidad breve
        player.invincible = true;
        setTimeout(() => {
            if (gameRunning) player.invincible = false;
        }, 2000);
    }
}

/**
 * Actualiza los elementos de la UI
 */
function updateUI() {
    scoreDisplay.textContent = `Dinero: $${score}`;
    livesDisplay.textContent = `Vidas: ${lives}`;
    timerDisplay.textContent = `Tiempo: ${timeLeft}`;
}

// ============================================
// BUCLE PRINCIPAL DEL JUEGO
// ============================================

function gameLoop() {
    if (!gameRunning) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar todo
    drawBackground();
    drawPlatforms();
    drawMoney();
    drawPowerups();
    drawObstacles();
    drawPlayer();

    // Actualizar todo
    updatePlayer();
    updateMoney();
    updateObstacles();
    updatePowerups();

    // Generar nuevos elementos
    spawnMoney();
    spawnObstacle();
    spawnPowerup();

    // Continuar bucle
    animationId = requestAnimationFrame(gameLoop);
}

// ============================================
// CONTROL DEL JUEGO
// ============================================

/**
 * Inicia el juego
 */
function startGame() {
    // Asegurar tamaño correcto del canvas
    resizeCanvas();

    // Reiniciar estado del juego
    score = 0;
    lives = 3;
    timeLeft = 60;
    money = [];
    obstacles = [];
    powerups = [];

    // Inicializar plataformas (establece también posición del jugador)
    initPlatforms();

    // Reiniciar velocidades del jugador
    player.velocityX = 0;
    player.velocityY = 0;
    player.onGround = false;
    deactivatePowerups();

    // Actualizar UI
    updateUI();

    // Ocultar pantallas
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';

    // Iniciar juego
    gameRunning = true;

    // Iniciar temporizador
    timerInterval = setInterval(() => {
        timeLeft--;
        updateUI();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // Iniciar bucle del juego
    gameLoop();
}

/**
 * Termina el juego
 */
function endGame() {
    gameRunning = false;
    clearInterval(timerInterval);
    cancelAnimationFrame(animationId);

    finalScoreDisplay.textContent = `$${score}`;
    gameOverScreen.style.display = 'flex';
}

/**
 * Reinicia el juego
 */
function restartGame() {
    startGame();
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.left = true;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.right = true;
    }
    if (e.code === 'Space') {
        keys.space = true;
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.left = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.right = false;
    }
    if (e.code === 'Space') {
        keys.space = false;
    }
});
