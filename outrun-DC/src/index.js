/**************************************************
** MAIN GAME FILE
**************************************************/

// Render/core variables
var gameCanvas,       // Canvas element
    gameContext,      // Canvas context
    camX, camY, camZ, // Camera position
    focal,            // Focal length
    keys;             // Input handler

// Game variables
var zRate = 0, xRate = 0;

// Make constants and road data accessible
window.roadData = {
    MAP: GAME_CONSTANTS.MAP,
    MAP_INTERVAL: GAME_CONSTANTS.MAP_INTERVAL,
    HILL_MAP: GAME_CONSTANTS.HILL_MAP,
    PI: GAME_CONSTANTS.PI
};

function init() {
    gameCanvas = document.getElementById("gameCanvas");
    gameContext = gameCanvas.getContext("2d");

    // Calculate focal length from FOV
    focal = gameCanvas.width / 2 / Math.tan(GAME_CONSTANTS.FOV * Math.PI / 360);

    // Init camera position
    camX = 0;
    camY = GAME_CONSTANTS.CAM_HEIGHT;
    camZ = 100;

    keys = new Keys();

    // Initialize car sprites
    loadCarSprites();
    
    // Initialize enemy vehicle sprites
    loadEnemyVehicleSprites();
    
    // Initialize landscape sprites
    if (typeof loadLandscapeSprites === 'function') {
        loadLandscapeSprites(1); // Cargar paisaje para etapa 1
    }
    
    // Initialize music system
    if (typeof initMusic === 'function') {
        initMusic();
        // Configurar volumen (0.0 a 1.0)
        if (typeof setMusicVolume === 'function') {
            setMusicVolume(0.7); // 70% de volumen
        }
    }
    
    // Intentar iniciar música al hacer clic en el canvas
    gameCanvas.addEventListener('click', function() {
        if (typeof tryStartMusic === 'function') {
            tryStartMusic();
        }
    });
    
    // Initialize HUD
    initHUD(camZ);

    onResize();
}

/**************************************************
** GAME UPDATE LOOP
**************************************************/
function gameLoop() {
    // Intentar iniciar la música en la primera interacción del usuario
    if (typeof tryStartMusic === 'function' && typeof keys !== 'undefined' && 
        (keys.up || keys.down || keys.left || keys.right || keys.space)) {
        tryStartMusic();
    }
    
    // Solo actualizar si el juego está en curso
    // Verificar que checkStageCompletion esté disponible
    var gameState = (typeof checkStageCompletion === 'function') ? checkStageCompletion(camZ) : 'playing';
    
    // Procesar input de teclas (siempre, para que responda)
    if (typeof keys !== 'undefined') {
        if (keys.up) zRate += 0.6;
        if (keys.down) zRate -= 0.65;
        if (keys.left) xRate -= 0.45;
        if (keys.right) xRate += 0.45;
        
        // Activar nitro con la tecla N (solo si el juego está en curso)
        if (keys.n) {
            if (gameState === 'playing' && typeof activateNitro === 'function') {
                var activated = activateNitro();
                if (activated) {
                    console.log("Nitro activado! Nitros restantes:", typeof getNitroCount === 'function' ? getNitroCount() : 0);
                } else {
                    console.log("No se pudo activar nitro. Estado:", {
                        gameState: gameState,
                        nitroCount: typeof getNitroCount === 'function' ? getNitroCount() : 'N/A',
                        nitroActive: typeof isNitroActive === 'function' ? isNitroActive() : 'N/A'
                    });
                }
            } else {
                console.log("Nitro no disponible. gameState:", gameState, "activateNitro:", typeof activateNitro);
            }
            keys.n = false; // Evitar múltiples activaciones
        }
    }
    
    // Aplicar boost de nitro si está activo
    var nitroBoost = 0;
    if (typeof getNitroSpeedBoost === 'function') {
        nitroBoost = getNitroSpeedBoost();
    }
    
    if (gameState === 'playing') {
        // Aplicar velocidad base + boost de nitro
        camZ = camZ + zRate + nitroBoost;
    }

    // Aplicar fricción al movimiento horizontal (solo si keys está disponible)
    if (typeof keys !== 'undefined') {
        if (xRate > 0 && (keys.left && keys.right || !keys.right)) {
            xRate -= 0.5;
        }
        else if (xRate < 0 && (keys.left && keys.right || !keys.left)) {
            xRate += 0.5;
        }
    } else {
        // Si keys no está disponible, aplicar fricción automática
        if (xRate > 0) xRate -= 0.5;
        else if (xRate < 0) xRate += 0.5;
    }

    zRate = clamp(zRate - 0.25, 0, 90);
    xRate = clamp(clamp(xRate, -zRate * 0.4, zRate * 0.4), -12, 12);

    // Obtener mapa según la dificultad de la etapa actual para el movimiento del coche
    var currentMap = GAME_CONSTANTS.MAP;
    if (typeof getCurrentMap === 'function') {
        currentMap = getCurrentMap();
    }
    camX += xRate - getTurnAtPos(camZ, currentMap, GAME_CONSTANTS.MAP_INTERVAL) * 0.005 * zRate;
    camX = clamp(camX, -GAME_CONSTANTS.ROAD_WIDTH, GAME_CONSTANTS.ROAD_WIDTH);
    camY = GAME_CONSTANTS.CAM_HEIGHT + getHeightAtPos(camZ, GAME_CONSTANTS.HILL_MAP, GAME_CONSTANTS.MAP_INTERVAL, GAME_CONSTANTS.PI);

    if (camX < -GAME_CONSTANTS.ROAD_WIDTH / 2 || camX > GAME_CONSTANTS.ROAD_WIDTH / 2) {
        zRate -= 0.0003 * Math.pow(zRate, 2);
    }

    // Update car animation
    animationFrame = updateCarAnimation();
    
    // Update enemy vehicles (solo si las funciones están disponibles)
    if (gameState === 'playing' && typeof updateEnemyVehicles === 'function') {
        // Obtener etapa actual (accediendo directamente a la variable global del HUD)
        var currentStage = (typeof window !== 'undefined' && window.currentStage) ? window.currentStage : 1;
        if (typeof getCurrentStage === 'function') {
            currentStage = getCurrentStage();
        }
        // Obtener mapa según la dificultad
        var currentMap = GAME_CONSTANTS.MAP;
        if (typeof getCurrentMap === 'function') {
            currentMap = getCurrentMap();
        }
        updateEnemyVehicles(camZ, zRate, currentMap, GAME_CONSTANTS.MAP_INTERVAL, GAME_CONSTANTS.ROAD_WIDTH, currentStage);
    }
    
    // Update landscape elements (solo si las funciones están disponibles)
    if (gameState === 'playing' && typeof updateLandscapeElements === 'function') {
        var currentStage = (typeof window !== 'undefined' && window.currentStage) ? window.currentStage : 1;
        if (typeof getCurrentStage === 'function') {
            currentStage = getCurrentStage();
        }
        // Obtener mapa según la dificultad
        var currentMap = GAME_CONSTANTS.MAP;
        if (typeof getCurrentMap === 'function') {
            currentMap = getCurrentMap();
        }
        updateLandscapeElements(camZ, zRate, GAME_CONSTANTS.ROAD_WIDTH, currentStage, currentMap, GAME_CONSTANTS.MAP_INTERVAL);
    }

    draw();
    requestAnimationFrame(gameLoop);
}

/**************************************************
** GAME RENDER
**************************************************/
function draw() {
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Obtener mapa según la dificultad de la etapa actual
    var currentMap = GAME_CONSTANTS.MAP; // Mapa por defecto
    if (typeof getCurrentMap === 'function') {
        currentMap = getCurrentMap();
    }
    
    // Draw road
    gameContext.fillStyle = GAME_CONSTANTS.ROAD_COLOR;
    var topY = gameCanvas.height;
    var turnSpeed = -(camZ % GAME_CONSTANTS.ROAD_SECTION_LENGTH) / GAME_CONSTANTS.ROAD_SECTION_LENGTH * getTurnAtPos(camZ - camZ % GAME_CONSTANTS.ROAD_SECTION_LENGTH, currentMap, GAME_CONSTANTS.MAP_INTERVAL);
    var turnOffset = 0;
    for (var z = camZ - (camZ % GAME_CONSTANTS.ROAD_SECTION_LENGTH); z < camZ + GAME_CONSTANTS.RENDER_DIST - camZ % GAME_CONSTANTS.ROAD_SECTION_LENGTH; z += GAME_CONSTANTS.ROAD_SECTION_LENGTH) {
        turnSpeed += getTurnAtPos(z, currentMap, GAME_CONSTANTS.MAP_INTERVAL);
        topY = drawRoadSection(0, z, topY, GAME_CONSTANTS.ROAD_WIDTH, GAME_CONSTANTS.ROAD_SECTION_LENGTH, turnOffset, turnOffset + turnSpeed, camX, camY, camZ, focal, gameCanvas.width, gameCanvas.height, GAME_CONSTANTS.ROAD_SECTION_LENGTH, gameContext);
        turnOffset += turnSpeed;
    }

    // Draw lane markers (usando el mismo mapa de dificultad)
    gameContext.fillStyle = GAME_CONSTANTS.MARKING_COLOR;
    topY = gameCanvas.height;
    turnSpeed = -(camZ % GAME_CONSTANTS.ROAD_SECTION_LENGTH) / GAME_CONSTANTS.ROAD_SECTION_LENGTH * getTurnAtPos(camZ - camZ % GAME_CONSTANTS.ROAD_SECTION_LENGTH, currentMap, GAME_CONSTANTS.MAP_INTERVAL);
    turnOffset = 0;
    for (var z = camZ - (camZ % GAME_CONSTANTS.ROAD_SECTION_LENGTH); z < camZ + GAME_CONSTANTS.RENDER_DIST - camZ % GAME_CONSTANTS.ROAD_SECTION_LENGTH; z += GAME_CONSTANTS.ROAD_SECTION_LENGTH) {
        turnSpeed += getTurnAtPos(z, currentMap, GAME_CONSTANTS.MAP_INTERVAL);
        drawRoadSection(-GAME_CONSTANTS.ROAD_WIDTH / 4, z, topY, 10, GAME_CONSTANTS.MARKING_LENGTH, turnOffset, turnOffset + turnSpeed * GAME_CONSTANTS.MARKING_LENGTH / GAME_CONSTANTS.ROAD_SECTION_LENGTH, camX, camY, camZ, focal, gameCanvas.width, gameCanvas.height, GAME_CONSTANTS.ROAD_SECTION_LENGTH, gameContext);
        drawRoadSection(0, z, topY, 10, GAME_CONSTANTS.MARKING_LENGTH, turnOffset, turnOffset + turnSpeed * GAME_CONSTANTS.MARKING_LENGTH / GAME_CONSTANTS.ROAD_SECTION_LENGTH, camX, camY, camZ, focal, gameCanvas.width, gameCanvas.height, GAME_CONSTANTS.ROAD_SECTION_LENGTH, gameContext);
        topY = drawRoadSection(GAME_CONSTANTS.ROAD_WIDTH / 4, z, topY, 10, GAME_CONSTANTS.MARKING_LENGTH, turnOffset, turnOffset + turnSpeed * GAME_CONSTANTS.MARKING_LENGTH / GAME_CONSTANTS.ROAD_SECTION_LENGTH, camX, camY, camZ, focal, gameCanvas.width, gameCanvas.height, GAME_CONSTANTS.ROAD_SECTION_LENGTH, gameContext);
        turnOffset += turnSpeed;
    }

    // Draw sky
    gameContext.fillStyle = GAME_CONSTANTS.SKY_COLOR;
    gameContext.fillRect(0, 0, gameCanvas.width, topY + 1);

    // Draw landscape elements (primero, para que aparezcan detrás de todo)
    if (gameState === 'playing' && typeof drawLandscapeElements === 'function') {
        // Obtener mapa según la dificultad
        var currentMap = GAME_CONSTANTS.MAP;
        if (typeof getCurrentMap === 'function') {
            currentMap = getCurrentMap();
        }
        drawLandscapeElements(camX, camY, camZ, focal, gameCanvas.width, gameCanvas.height, gameContext, 
            GAME_CONSTANTS.HILL_MAP, GAME_CONSTANTS.MAP_INTERVAL, GAME_CONSTANTS.PI, 
            getTurnAtPos, currentMap, getHeightAtPos, GAME_CONSTANTS.ROAD_WIDTH);
    }
    
    // Draw enemy vehicles (después del paisaje, para que aparezcan detrás del coche del jugador)
    if (gameState === 'playing' && typeof drawEnemyVehicles === 'function') {
        drawEnemyVehicles(camX, camY, camZ, focal, gameCanvas.width, gameCanvas.height, gameContext, GAME_CONSTANTS.HILL_MAP, GAME_CONSTANTS.MAP_INTERVAL, GAME_CONSTANTS.PI);
    }
    
    // Draw car (solo si el juego está en curso)
    if (gameState === 'playing') {
        // Obtener mapa según la dificultad para el coche
        var currentMapForCar = GAME_CONSTANTS.MAP;
        if (typeof getCurrentMap === 'function') {
            currentMapForCar = getCurrentMap();
        }
        drawCar(camX, camY, camZ, focal, gameCanvas.width, gameCanvas.height, gameContext, keys, zRate, xRate, getHeightAtPos, GAME_CONSTANTS.MAP_INTERVAL, GAME_CONSTANTS.PI, GAME_CONSTANTS.HILL_MAP, getTurnAtPos, currentMapForCar, GAME_CONSTANTS.CAM_HEIGHT);
        
        // Verificar colisiones
        if (typeof checkCollision === 'function' && typeof enemyVehicles !== 'undefined') {
            var carDistance = 180;
            var carZ = camZ + carDistance;
            // Obtener mapa según la dificultad
            var currentMap = GAME_CONSTANTS.MAP;
            if (typeof getCurrentMap === 'function') {
                currentMap = getCurrentMap();
            }
            var turnOffset = getTurnAtPos(carZ, currentMap, GAME_CONSTANTS.MAP_INTERVAL) * 0.005;
            var carX = camX + turnOffset;
                    
                    // Pasar camZ y focal para cálculo de colisión proporcional
                    if (checkCollision(carX, carZ, enemyVehicles, camZ, focal)) {
                        // Colisión detectada - reducir velocidad significativamente
                        zRate *= 0.3; // Reducir velocidad drásticamente
                        
                        // Registrar el impacto en el sistema de HUD
                        if (typeof registerCrash === 'function') {
                            registerCrash();
                        }
                        
                        // Verificar si el juego debe terminar por impactos
                        if (typeof checkStageCompletion === 'function') {
                            checkStageCompletion(camZ);
                        }
                        
                        // Opcional: puedes añadir efectos visuales o sonido aquí
                    }
                }
    }
    
    // Draw HUD (marcadores de velocidad, tiempo y distancia)
    if (typeof drawHUD === 'function') {
        // Calcular velocidad total incluyendo boost de nitro
        var totalZRate = zRate;
        if (typeof getNitroSpeedBoost === 'function') {
            totalZRate += getNitroSpeedBoost();
        }
        gameState = drawHUD(gameContext, gameCanvas.width, gameCanvas.height, totalZRate, camZ);
    }
    
    // Manejar controles de etapa
    if (typeof keys !== 'undefined' && keys.space) {
        if (gameState === 'stageComplete') {
        // Avanzar a la siguiente etapa
        camZ = 100; // Volver a posición inicial
        resetEnemyVehicles(); // Reiniciar vehículos enemigos
        nextStage(camZ);
        } else {
        // Reiniciar la etapa actual si no está completa (playing o gameOver)
        // Reiniciar posición de la cámara
        camX = 0;
        camY = GAME_CONSTANTS.CAM_HEIGHT;
        camZ = 100;
        zRate = 0;
        xRate = 0;
        resetEnemyVehicles(); // Reiniciar vehículos enemigos
        if (typeof resetLandscapeElements === 'function') {
            resetLandscapeElements(); // Reiniciar elementos del paisaje
        }
        resetStage(camZ); // Actualizar posición inicial para el cálculo de distancia
        }
        keys.space = false; // Evitar múltiples activaciones
    }
    
    if (gameState === 'gameOver' && typeof keys !== 'undefined' && keys.r) {
        resetGame();
        // Reiniciar posición de la cámara
        camX = 0;
        camY = GAME_CONSTANTS.CAM_HEIGHT;
        camZ = 100;
        zRate = 0;
        xRate = 0;
        resetEnemyVehicles(); // Reiniciar vehículos enemigos
        if (typeof resetLandscapeElements === 'function') {
            resetLandscapeElements(); // Reiniciar elementos del paisaje
        }
        if (typeof loadLandscapeSprites === 'function') {
            loadLandscapeSprites(1); // Recargar paisaje de etapa 1
        }
        initHUD(camZ);
        keys.r = false;
    }
}

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
function setEventHandlers() {
    // Keyboard and mouse
    window.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("keyup", onKeyUp, false);

    // Window resize
    window.addEventListener("resize", onResize, false);
}

// Keyboard key down
function onKeyDown(e) {
    keys.onKeyDown(e);
}

// Keyboard key up
function onKeyUp(e) {
    keys.onKeyUp(e);
}

// Browser window resize
function onResize(e) {
    // Maximize the canvas, keeping 16:9 ratio
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    focal = gameCanvas.width / 2 / Math.tan(GAME_CONSTANTS.FOV * Math.PI / 360);
}

/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/

// Makes sure a value lies inside min/max
function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

/**************************************************
** GAME START
**************************************************/
init();
setEventHandlers();
gameLoop();
