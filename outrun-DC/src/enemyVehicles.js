/**************************************************
** ENEMY VEHICLES SYSTEM
**************************************************/

var enemyVehicleSprites = {};
var enemyVehiclesLoaded = false;
var enemyVehicles = []; // Array de vehículos enemigos activos
var enemyAnimationFrame = 0;
var enemyAnimationTimer = 0;

// Constantes base
var ENEMY_BASE_SPEED = 40; // Velocidad base inicial de los vehículos enemigos (zRate equivalente)
var ENEMY_SPAWN_DISTANCE = 500; // Distancia mínima entre vehículos
var ENEMY_SPAWN_RANGE = 2000; // Rango de distancia donde pueden aparecer vehículos
var ENEMY_MAX_COUNT_BASE = 2; // Número base de vehículos en pantalla (dificultad inicial)

function loadEnemyVehicleSprites() {
    var vehicleCount = 11; // vehicle-0 a vehicle-10
    var spritesPerVehicle = 4; // left-0, left-1, right-0, right-1
    var totalSprites = vehicleCount * spritesPerVehicle;
    var loadedSprites = 0;
    var errorCount = 0;

    function onSpriteLoad() {
        loadedSprites++;
        if (loadedSprites === totalSprites) {
            enemyVehiclesLoaded = true;
            console.log("Todos los sprites de vehículos enemigos cargados correctamente");
        }
    }

    function onSpriteError(img, vehicleNum, type) {
        errorCount++;
        console.error("Error cargando sprite de vehículo:", vehicleNum, type);
        onSpriteLoad(); // Contar como cargado para no bloquear
    }

    for (var i = 0; i < vehicleCount; i++) {
        (function(vehicleIndex) {
            var left0 = new Image();
            var left1 = new Image();
            var right0 = new Image();
            var right1 = new Image();

            left0.onload = onSpriteLoad;
            left1.onload = onSpriteLoad;
            right0.onload = onSpriteLoad;
            right1.onload = onSpriteLoad;

            left0.onerror = function() { onSpriteError(left0, vehicleIndex, 'left-0'); };
            left1.onerror = function() { onSpriteError(left1, vehicleIndex, 'left-1'); };
            right0.onerror = function() { onSpriteError(right0, vehicleIndex, 'right-0'); };
            right1.onerror = function() { onSpriteError(right1, vehicleIndex, 'right-1'); };

            left0.src = 'assets/sprites/vehicles/vehicle-' + vehicleIndex + '/left-0.png';
            left1.src = 'assets/sprites/vehicles/vehicle-' + vehicleIndex + '/left-1.png';
            right0.src = 'assets/sprites/vehicles/vehicle-' + vehicleIndex + '/right-0.png';
            right1.src = 'assets/sprites/vehicles/vehicle-' + vehicleIndex + '/right-1.png';

            enemyVehicleSprites[vehicleIndex] = {
                left: [left0, left1],
                right: [right0, right1]
            };
        })(i);
    }
    
    console.log("Iniciando carga de sprites de vehículos enemigos. Total:", totalSprites);
}

function createEnemyVehicle(camZ, MAP, MAP_INTERVAL, ROAD_WIDTH, currentStage) {
    // Calcular velocidad según la etapa actual
    var baseSpeed = getEnemySpeedForStage(currentStage);
    
    // Crear un nuevo vehículo enemigo
    var vehicle = {
        z: camZ + Math.random() * ENEMY_SPAWN_RANGE + ENEMY_SPAWN_DISTANCE, // Posición Z aleatoria por delante
        x: (Math.random() - 0.5) * ROAD_WIDTH * 0.6, // Posición X aleatoria en la carretera
        type: Math.floor(Math.random() * 11), // Tipo de vehículo (0-10)
        speed: baseSpeed + (Math.random() - 0.5) * 15, // Velocidad base con variación (reducida en etapas tempranas)
        lane: Math.floor(Math.random() * 3) - 1 // -1, 0, 1 para diferentes carriles
    };
    
    // Ajustar posición X según el carril
    vehicle.x = vehicle.lane * ROAD_WIDTH * 0.15;
    
    return vehicle;
}

function getDifficultyLevel(currentStage) {
    // Calcular nivel de dificultad basado en la etapa
    // Etapa 1: dificultad 1, Etapa 2: dificultad 2, etc.
    return Math.max(1, currentStage);
}

function getEnemySpeedForStage(currentStage) {
    // Velocidad de los enemigos aumenta con cada etapa
    // Etapa 1: 40, Etapa 2: 50, Etapa 3: 60, etc.
    var difficultyLevel = getDifficultyLevel(currentStage);
    return ENEMY_BASE_SPEED + (difficultyLevel - 1) * 10;
}

function getMaxEnemyCountForStage(currentStage) {
    // Número máximo de vehículos aumenta más rápidamente con cada etapa
    // Etapa 1: 2, Etapa 2: 3, Etapa 3: 4, Etapa 4: 5, Etapa 5+: 6
    var difficultyLevel = getDifficultyLevel(currentStage);
    // Aumento más agresivo: +1 vehículo cada etapa hasta un máximo de 6
    return Math.min(ENEMY_MAX_COUNT_BASE + (difficultyLevel - 1), 6);
}

function updateEnemyVehicles(camZ, zRate, MAP, MAP_INTERVAL, ROAD_WIDTH, currentStage) {
    // Actualizar animación
    enemyAnimationTimer++;
    if (enemyAnimationTimer > 10) {
        enemyAnimationFrame = enemyAnimationFrame === 0 ? 1 : 0;
        enemyAnimationTimer = 0;
    }
    
    // Calcular velocidad base de los enemigos según la etapa
    var enemySpeed = getEnemySpeedForStage(currentStage);
    
    // Calcular diferencia de velocidad
    var speedDifference = zRate - enemySpeed;
    
    // Actualizar posición de cada vehículo
    for (var i = enemyVehicles.length - 1; i >= 0; i--) {
        var vehicle = enemyVehicles[i];
        
        // Los vehículos se mueven según la diferencia de velocidad
        // Si el Ferrari va más rápido, los vehículos se acercan (z disminuye)
        // Si el Ferrari va más lento, los vehículos se alejan (z aumenta)
        vehicle.z -= speedDifference;
        
        // Seguir la dirección de la carretera
        var turnOffset = getTurnAtPos(vehicle.z, MAP, MAP_INTERVAL) * 0.005;
        vehicle.x += turnOffset;
        
        // Mantener el vehículo dentro de los límites de la carretera
        // La carretera tiene ROAD_WIDTH de ancho, centrada en x=0
        var roadHalfWidth = ROAD_WIDTH / 2;
        var vehicleHalfWidth = 40; // Ancho aproximado del vehículo
        vehicle.x = Math.max(-roadHalfWidth + vehicleHalfWidth, Math.min(roadHalfWidth - vehicleHalfWidth, vehicle.x));
        
        // Eliminar vehículos que están muy lejos por detrás
        if (vehicle.z < camZ - 200) {
            enemyVehicles.splice(i, 1);
        }
        
        // Eliminar vehículos que están muy lejos por delante
        if (vehicle.z > camZ + ENEMY_SPAWN_RANGE + 500) {
            enemyVehicles.splice(i, 1);
        }
    }
    
    // Generar nuevos vehículos si es necesario (según dificultad de la etapa)
    var maxEnemies = getMaxEnemyCountForStage(currentStage);
    var spawnAttempts = 0;
    var maxSpawnAttempts = 50; // Limitar intentos para evitar bucles infinitos
    while (enemyVehicles.length < maxEnemies && spawnAttempts < maxSpawnAttempts) {
        spawnAttempts++;
        var newVehicle = createEnemyVehicle(camZ, MAP, MAP_INTERVAL, ROAD_WIDTH, currentStage);
        // Verificar que no esté demasiado cerca de otros vehículos
        var tooClose = false;
        for (var j = 0; j < enemyVehicles.length; j++) {
            if (Math.abs(newVehicle.z - enemyVehicles[j].z) < ENEMY_SPAWN_DISTANCE) {
                tooClose = true;
                break;
            }
        }
        if (!tooClose && newVehicle.z > camZ + 100) {
            enemyVehicles.push(newVehicle);
            spawnAttempts = 0; // Reset contador si se crea exitosamente
        }
    }
}

function checkCollision(playerCarX, playerCarZ, enemyVehicles, camZ, focal) {
    // Verificar colisión con los vehículos enemigos
    // Valores ajustados para corresponder mejor al tamaño visual
    
    for (var i = 0; i < enemyVehicles.length; i++) {
        var vehicle = enemyVehicles[i];
        var zDistance = vehicle.z - camZ;
        
        // Solo verificar colisión si el vehículo está delante de la cámara y visible
        if (zDistance <= 0) continue;
        
        // Obtener sprite para calcular tamaño real
        var spriteSet = enemyVehicleSprites[vehicle.type];
        var sprite = spriteSet ? (spriteSet.left[0] || spriteSet.right[0]) : null;
        var spriteWidthPx = sprite && sprite.width ? sprite.width : 60;
        
        // Calcular tamaño de colisión más preciso para coincidir con el tamaño visual
        // Los valores deben ser más pequeños para reducir el "hueco" entre vehículos
        var baseWidth = 40; // Ancho base reducido para que sea más preciso
        var spriteFactor = spriteWidthPx / 60; // Factor según tamaño del sprite
        
        // El ancho de colisión debe corresponder mejor al tamaño visual aumentado (0.50)
        // pero sin ser demasiado grande para evitar el "hueco"
        var collisionWidth = baseWidth * spriteFactor;
        var collisionDepth = 45; // Profundidad reducida para que sea más precisa
        
        // Verificar colisión en Z (profundidad)
        var zDistanceToPlayer = Math.abs(playerCarZ - vehicle.z);
        if (zDistanceToPlayer < collisionDepth) {
            // Verificar colisión en X (ancho)
            var xDistance = Math.abs(playerCarX - vehicle.x);
            if (xDistance < collisionWidth) {
                return true; // Colisión detectada
            }
        }
    }
    
    return false;
}

function drawEnemyVehicles(camX, camY, camZ, focal, canvasWidth, canvasHeight, gameContext, HILL_MAP, MAP_INTERVAL, PI) {
    if (!enemyVehiclesLoaded) return;
    
    // Ordenar vehículos por distancia Z (del más lejano al más cercano)
    var sortedVehicles = enemyVehicles.slice().sort(function(a, b) {
        return b.z - a.z; // Orden descendente
    });
    
    for (var i = 0; i < sortedVehicles.length; i++) {
        var vehicle = sortedVehicles[i];
        
        // Solo dibujar vehículos que están delante de la cámara (o muy cerca por detrás)
        var zDistance = vehicle.z - camZ;
        if (zDistance <= -50) continue; // No dibujar si están muy atrás
        
        // Determinar dirección del sprite según posición relativa a la carretera
        var turnOffset = getTurnAtPos(vehicle.z, window.roadData.MAP, window.roadData.MAP_INTERVAL) * 0.005;
        var roadCenterX = turnOffset;
        var isLeft = vehicle.x < roadCenterX;
        var spriteDirection = isLeft ? 'left' : 'right';
        
        // Obtener sprite
        var spriteSet = enemyVehicleSprites[vehicle.type][spriteDirection];
        var sprite = spriteSet[enemyAnimationFrame] || spriteSet[0];
        
        if (!sprite || !sprite.complete) continue;
        
        // Calcular posición Y (en la superficie de la carretera)
        var roadHeight = getHeightAtPos(vehicle.z, HILL_MAP, MAP_INTERVAL, PI);
        var vehicleY = roadHeight;
        
        // Proyectar a pantalla
        var projX = projectX(vehicle.x, vehicle.z, camX, camZ, focal, canvasWidth);
        var projY = projectY(vehicleY, vehicle.z, camY, camZ, focal, canvasHeight);
        
        // Calcular escala - aumentar tamaño para que sea más visible
        // Usar valor absoluto para que sea consistente cuando el vehículo está delante o cerca
        var scale = focal / Math.abs(zDistance);
        var vehicleWidth = sprite.width * scale * 0.50; // Aumentado a 0.50 para que sean mucho más grandes y visibles
        var vehicleHeight = sprite.height * scale * 0.50;
        
        // Solo dibujar si está visible
        if (zDistance > -100 && zDistance < 3000 && vehicleWidth > 0 && vehicleHeight > 0) {
            var drawX = projX - vehicleWidth / 2;
            var drawY = projY - vehicleHeight;
            
            // Solo dibujar si está en pantalla
            if (drawX < canvasWidth && drawX + vehicleWidth > 0 && drawY < canvasHeight && drawY + vehicleHeight > 0) {
                gameContext.save();
                gameContext.imageSmoothingEnabled = true;
                gameContext.imageSmoothingQuality = 'high';
                gameContext.drawImage(
                    sprite,
                    drawX,
                    drawY,
                    vehicleWidth,
                    vehicleHeight
                );
                gameContext.restore();
            }
        }
    }
}

function resetEnemyVehicles() {
    enemyVehicles = [];
}

