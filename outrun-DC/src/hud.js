/**************************************************
** HUD (Heads-Up Display) - Marcadores en pantalla
**************************************************/

var gameStartTime = null;
var stageDuration = 120; // Duración base de la etapa en segundos (2 minutos)
var currentStageDuration = 120; // Duración actual de la etapa (puede incluir tiempo extra)
var stageDistanceKm = 3; // Distancia de la etapa en km (2 min a 180 km/h = 6 km)
var initialCamZ = 100; // Posición Z inicial de la cámara
var distancePerZUnit = 0; // Factor de conversión de unidades Z a km
var currentStage = 1;
var gameState = 'playing'; // 'playing', 'stageComplete', 'gameOver'
var timeBonus = 0; // Tiempo extra acumulado de etapas anteriores
var crashCount = 0; // Contador de impactos graves
var MAX_CRASHES = 100; // Número máximo de impactos antes de Game Over
var lastCrashTime = 0; // Tiempo del último impacto (para evitar contar múltiples veces el mismo choque)
var CRASH_COOLDOWN = 1000; // Tiempo en ms entre impactos para que se cuenten como diferentes (1 segundo)

// Sistema de Nitro
var nitroCount = 3; // Número de nitros disponibles por etapa
var MAX_NITRO_PER_STAGE = 3; // Máximo de nitros por etapa
var nitroActive = false; // Si el nitro está activo
var nitroStartTime = 0; // Tiempo de inicio del nitro activo
var NITRO_DURATION = 10000; // Duración del nitro en milisegundos (10 segundos)
var NITRO_SPEED_BOOST_KMH = 20; // Aumento de velocidad en km/h
var NITRO_SPEED_BOOST_ZRATE = 0; // Aumento de velocidad en zRate (se calcula)

// Exponer currentStage globalmente para acceso desde otros módulos
if (typeof window !== 'undefined') {
    window.currentStage = currentStage;
}

function getCurrentStage() {
    return currentStage;
}
var totalDistanceTraveled = 0; // Distancia total recorrida en km (calculada por velocidad)
var lastUpdateTime = null;

function initHUD(startCamZ) {
    gameStartTime = Date.now();
    lastUpdateTime = Date.now();
    initialCamZ = startCamZ;
    currentStage = 1;
    currentStageDuration = stageDuration;
    timeBonus = 0;
    crashCount = 0;
    lastCrashTime = 0;
    nitroCount = MAX_NITRO_PER_STAGE;
    nitroActive = false;
    nitroStartTime = 0;
    gameState = 'playing';
    totalDistanceTraveled = 0;
}

function getSpeedInKmh(zRate) {
    // Convertir zRate a km/h
    // zRate está en unidades del juego, necesitamos una conversión aproximada
    // Basándonos en que el máximo de zRate es 90, y queremos que corresponda a 240 km/h
    var maxZRate = 90;
    var maxKmh = 240;
    var kmh = (zRate / maxZRate) * maxKmh;
    return Math.min(kmh, maxKmh); // Limitar al máximo
}

function getZRateFromKmh(kmh) {
    // Convertir km/h a zRate (conversión inversa)
    var maxZRate = 90;
    var maxKmh = 240;
    return (kmh / maxKmh) * maxZRate;
}

// Calcular el boost de zRate equivalente a +20 km/h después de definir getZRateFromKmh
// Esta inicialización se hace aquí para asegurar que getZRateFromKmh ya está definido
if (typeof getZRateFromKmh === 'function') {
    // Esto se ejecutará cuando el script se carga, pero getZRateFromKmh aún no existe
    // Por eso lo inicializamos en getNitroSpeedBoost() la primera vez que se llama
}

function activateNitro() {
    // Activar nitro si hay disponibles y no está ya activo
    if (nitroCount > 0 && !nitroActive) {
        nitroActive = true;
        nitroStartTime = Date.now();
        nitroCount--;
        console.log("Nitro activado! Restantes:", nitroCount);
        return true;
    }
    console.log("No se pudo activar nitro. Disponibles:", nitroCount, "Activo:", nitroActive);
    return false;
}

function updateNitro() {
    // Actualizar estado del nitro
    if (nitroActive) {
        var elapsed = Date.now() - nitroStartTime;
        if (elapsed >= NITRO_DURATION) {
            // El nitro ha expirado
            nitroActive = false;
            nitroStartTime = 0;
        }
    }
}

function getNitroTimeRemaining() {
    // Obtener tiempo restante del nitro en segundos
    if (!nitroActive) return 0;
    var elapsed = Date.now() - nitroStartTime;
    var remaining = (NITRO_DURATION - elapsed) / 1000;
    return Math.max(0, remaining);
}

function getNitroCount() {
    return nitroCount;
}

function isNitroActive() {
    return nitroActive;
}

function getNitroSpeedBoost() {
    // Asegurar que el boost está calculado (solo calcular una vez)
    if (NITRO_SPEED_BOOST_ZRATE === 0) {
        NITRO_SPEED_BOOST_ZRATE = getZRateFromKmh(NITRO_SPEED_BOOST_KMH);
        console.log("Nitro boost inicializado:", NITRO_SPEED_BOOST_ZRATE, "km/h boost:", NITRO_SPEED_BOOST_KMH);
    }
    // Devolver el boost de velocidad si el nitro está activo
    var boost = nitroActive ? NITRO_SPEED_BOOST_ZRATE : 0;
    if (boost > 0) {
        console.log("Aplicando boost de nitro:", boost);
    }
    return boost;
}

function updateDistanceTraveled(zRate) {
    // Actualizar distancia basándonos en velocidad real y tiempo transcurrido
    // zRate ya incluye el boost del nitro si está activo
    var currentTime = Date.now();
    if (lastUpdateTime && gameStartTime) {
        var deltaTime = (currentTime - lastUpdateTime) / 1000; // Tiempo en segundos
        var speedKmh = getSpeedInKmh(zRate);
        var speedKmPerSecond = speedKmh / 3600; // Convertir km/h a km/s
        var distanceThisFrame = speedKmPerSecond * deltaTime;
        totalDistanceTraveled += distanceThisFrame;
    }
    lastUpdateTime = currentTime;
}

function getDistanceTraveled(camZ) {
    // Devolver la distancia acumulada calculada por velocidad
    return totalDistanceTraveled;
}

function getDistanceRemaining(camZ) {
    var traveled = getDistanceTraveled(camZ);
    var remaining = stageDistanceKm - traveled;
    return Math.max(0, remaining);
}

function registerCrash() {
    // Registrar un impacto grave (solo si ha pasado suficiente tiempo desde el último impacto)
    var currentTime = Date.now();
    if (currentTime - lastCrashTime > CRASH_COOLDOWN) {
        crashCount++;
        lastCrashTime = currentTime;
        
        // Verificar si se alcanzó el límite de impactos
        if (crashCount >= MAX_CRASHES) {
            gameState = 'gameOver';
        }
        
        return true; // Impacto registrado
    }
    return false; // Mismo choque, no se cuenta como nuevo impacto
}

function getCrashCount() {
    return crashCount;
}

function checkStageCompletion(camZ) {
    if (gameState !== 'playing') return gameState;
    
    // Verificar si se alcanzó el límite de impactos
    if (crashCount >= MAX_CRASHES) {
        gameState = 'gameOver';
        return 'gameOver';
    }
    
    var distanceRemaining = getDistanceRemaining(camZ);
    var timeRemaining = getTimeRemaining();
    
    // Si completó la distancia antes de que se agote el tiempo
    if (distanceRemaining <= 0 && timeRemaining > 0) {
        gameState = 'stageComplete';
        return 'stageComplete';
    }
    
    // Si se agotó el tiempo sin completar la distancia
    if (timeRemaining <= 0 && distanceRemaining > 0) {
        gameState = 'gameOver';
        return 'gameOver';
    }
    
    return 'playing';
}

function getTimeRemaining() {
    if (!gameStartTime) return currentStageDuration;
    var elapsed = (Date.now() - gameStartTime) / 1000; // Segundos transcurridos
    var remaining = currentStageDuration - elapsed;
    return Math.max(0, remaining); // No permitir valores negativos
}

function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function nextStage(startCamZ) {
    if (gameState === 'stageComplete') {
        // Calcular tiempo restante de la etapa actual
        var timeRemaining = getTimeRemaining();
        if (timeRemaining > 0) {
            // Sumar el tiempo restante al bonus para la siguiente etapa
            timeBonus += timeRemaining;
        }
        
        currentStage++;
        // La duración de la nueva etapa es la duración base más el tiempo bonus acumulado
        currentStageDuration = stageDuration + timeBonus;
        
        gameStartTime = Date.now();
        lastUpdateTime = Date.now();
        gameState = 'playing';
        totalDistanceTraveled = 0;
        // NO se reinicia el contador de impactos - los impactos se acumulan durante todo el juego
        // Reiniciar nitros para la nueva etapa
        nitroCount = MAX_NITRO_PER_STAGE;
        nitroActive = false;
        nitroStartTime = 0;
        initialCamZ = startCamZ; // Actualizar posición inicial para la nueva etapa
        // Actualizar variable global
        if (typeof window !== 'undefined') {
            window.currentStage = currentStage;
        }
        // Recargar sprites de paisaje para la nueva etapa
        if (typeof loadLandscapeSprites === 'function') {
            loadLandscapeSprites(currentStage);
        }
        // Reiniciar elementos del paisaje
        if (typeof resetLandscapeElements === 'function') {
            resetLandscapeElements();
        }
        return true;
    }
    return false;
}

function resetStage(newInitialCamZ) {
    // Reiniciar la etapa actual manteniendo el número de etapa
    // No se pierde el tiempo bonus al reiniciar
    currentStageDuration = stageDuration + timeBonus;
    gameStartTime = Date.now();
    lastUpdateTime = Date.now();
    gameState = 'playing';
    totalDistanceTraveled = 0;
    // Reiniciar nitros al reiniciar la etapa
    nitroCount = MAX_NITRO_PER_STAGE;
    nitroActive = false;
    nitroStartTime = 0;
    if (newInitialCamZ !== undefined) {
        initialCamZ = newInitialCamZ;
    }
    // Actualizar variable global
    if (typeof window !== 'undefined') {
        window.currentStage = currentStage;
    }
}

function resetGame() {
    // Reiniciar el juego completo (etapa 1)
    gameStartTime = Date.now();
    lastUpdateTime = Date.now();
    currentStage = 1;
    currentStageDuration = stageDuration; // Volver a duración base
    timeBonus = 0; // Reiniciar tiempo bonus
    crashCount = 0; // Reiniciar contador de impactos
    lastCrashTime = 0; // Reiniciar tiempo del último impacto
    nitroCount = MAX_NITRO_PER_STAGE; // Reiniciar nitros
    nitroActive = false;
    nitroStartTime = 0;
    gameState = 'playing';
    totalDistanceTraveled = 0;
    // Actualizar variable global
    if (typeof window !== 'undefined') {
        window.currentStage = currentStage;
    }
}

function drawHUD(gameContext, canvasWidth, canvasHeight, zRate, camZ) {
    // Actualizar distancia recorrida basándonos en velocidad y tiempo
    updateDistanceTraveled(zRate);
    
    // Verificar estado de la etapa
    var state = checkStageCompletion(camZ);
    
    // Actualizar estado del nitro
    updateNitro();
    
    // Obtener velocidad, tiempo y distancia restante
    var speed = getSpeedInKmh(zRate);
    var timeRemaining = getTimeRemaining();
    var distanceRemaining = getDistanceRemaining(camZ);
    
    // Configurar estilo del texto
    gameContext.save();
    gameContext.font = 'bold 36px Arial';
    gameContext.fillStyle = '#FFFFFF';
    gameContext.strokeStyle = '#000000';
    gameContext.lineWidth = 3;
    gameContext.textAlign = 'left';
    gameContext.textBaseline = 'top';
    
    // Dibujar etapa actual
    var stageText = 'ETAPA ' + currentStage;
    gameContext.strokeText(stageText, 20, 20);
    gameContext.fillText(stageText, 20, 20);
    
    // Dibujar velocidad (debajo de la etapa)
    var speedText = Math.round(speed) + ' km/h';
    gameContext.strokeText(speedText, 20, 70);
    gameContext.fillText(speedText, 20, 70);
    
    // Dibujar distancia restante (centro superior)
    gameContext.textAlign = 'center';
    var distanceText = distanceRemaining.toFixed(2) + ' km';
    gameContext.strokeText(distanceText, canvasWidth / 2, 20);
    gameContext.fillText(distanceText, canvasWidth / 2, 20);
    
    // Dibujar tiempo restante (esquina superior derecha)
    gameContext.textAlign = 'right';
    var timeText = formatTime(timeRemaining);
    gameContext.strokeText(timeText, canvasWidth - 20, 20);
    gameContext.fillText(timeText, canvasWidth - 20, 20);
    
    // Dibujar contador de impactos (debajo del tiempo)
    gameContext.font = 'bold 28px Arial';
    var crashText = 'Impactos: ' + crashCount + '/' + MAX_CRASHES;
    var crashColor = crashCount >= MAX_CRASHES ? '#FF0000' : (crashCount >= 2 ? '#FFAA00' : '#FFFFFF');
    gameContext.fillStyle = crashColor;
    gameContext.strokeStyle = '#000000';
    gameContext.strokeText(crashText, canvasWidth - 20, 70);
    gameContext.fillText(crashText, canvasWidth - 20, 70);
    
    // Dibujar información de Nitro (debajo de los impactos)
    gameContext.font = 'bold 28px Arial';
    var nitroText = 'Nitro: ' + nitroCount;
    var nitroColor = nitroCount > 0 ? '#00FF00' : '#666666';
    gameContext.fillStyle = nitroColor;
    gameContext.strokeStyle = '#000000';
    gameContext.strokeText(nitroText, canvasWidth - 20, 110);
    gameContext.fillText(nitroText, canvasWidth - 20, 110);
    
    // Dibujar tiempo restante del nitro si está activo
    if (nitroActive) {
        var nitroTimeRemaining = getNitroTimeRemaining();
        var nitroTimeText = 'Nitro: ' + nitroTimeRemaining.toFixed(1) + 's';
        gameContext.fillStyle = '#FFAA00';
        gameContext.font = 'bold 32px Arial';
        gameContext.textAlign = 'center';
        gameContext.strokeText(nitroTimeText, canvasWidth / 2, 120);
        gameContext.fillText(nitroTimeText, canvasWidth / 2, 120);
    }
    
    gameContext.fillStyle = '#FFFFFF'; // Restaurar color por defecto
    gameContext.textAlign = 'left'; // Restaurar alineación
    
    // Mensajes de estado
    if (state === 'stageComplete') {
        gameContext.font = 'bold 72px Arial';
        gameContext.fillStyle = '#00FF00';
        gameContext.textAlign = 'center';
        gameContext.textBaseline = 'middle';
        gameContext.strokeText('ETAPA COMPLETADA!', canvasWidth / 2, canvasHeight / 2 - 50);
        gameContext.fillText('ETAPA COMPLETADA!', canvasWidth / 2, canvasHeight / 2 - 50);
        gameContext.font = 'bold 48px Arial';
        gameContext.strokeText('Presiona ESPACIO para continuar', canvasWidth / 2, canvasHeight / 2 + 30);
        gameContext.fillText('Presiona ESPACIO para continuar', canvasWidth / 2, canvasHeight / 2 + 30);
    } else if (state === 'gameOver') {
        gameContext.font = 'bold 72px Arial';
        gameContext.fillStyle = '#FF0000';
        gameContext.textAlign = 'center';
        gameContext.textBaseline = 'middle';
        
        // Mostrar mensaje según la causa del Game Over
        var gameOverMessage = '';
        if (crashCount >= MAX_CRASHES) {
            gameOverMessage = 'GAME OVER!\nDemasiados impactos';
        } else {
            gameOverMessage = 'GAME OVER!\nTiempo agotado';
        }
        
        var lines = gameOverMessage.split('\n');
        gameContext.strokeText(lines[0], canvasWidth / 2, canvasHeight / 2 - 50);
        gameContext.fillText(lines[0], canvasWidth / 2, canvasHeight / 2 - 50);
        
        if (lines.length > 1) {
            gameContext.font = 'bold 48px Arial';
            gameContext.strokeText(lines[1], canvasWidth / 2, canvasHeight / 2 + 10);
            gameContext.fillText(lines[1], canvasWidth / 2, canvasHeight / 2 + 10);
        }
        
        gameContext.font = 'bold 36px Arial';
        gameContext.fillStyle = '#FFFFFF';
        gameContext.textAlign = 'center';
        gameContext.textBaseline = 'middle';
        gameContext.strokeText('Presiona ESPACIO para reiniciar etapa', canvasWidth / 2, canvasHeight / 2 + 100);
        gameContext.fillText('Presiona ESPACIO para reiniciar etapa', canvasWidth / 2, canvasHeight / 2 + 100);
        gameContext.font = 'bold 30px Arial';
        gameContext.strokeText('Presiona R para reiniciar juego', canvasWidth / 2, canvasHeight / 2 + 150);
        gameContext.fillText('Presiona R para reiniciar juego', canvasWidth / 2, canvasHeight / 2 + 150);
    } else {
        // Mostrar instrucción de reinicio durante el juego
        if (timeRemaining < stageDuration - 1) { // Mostrar después del primer segundo
            gameContext.font = 'bold 24px Arial';
            gameContext.fillStyle = '#FFFFFF';
            gameContext.textAlign = 'center';
            gameContext.textBaseline = 'bottom';
            gameContext.strokeText('ESPACIO: Reiniciar etapa', canvasWidth / 2, canvasHeight - 20);
            gameContext.fillText('ESPACIO: Reiniciar etapa', canvasWidth / 2, canvasHeight - 20);
        }
        // Si el tiempo se agota, mostrar advertencia
        if (timeRemaining <= 10 && timeRemaining > 0) {
            gameContext.font = 'bold 48px Arial';
            gameContext.fillStyle = '#FF0000';
            gameContext.textAlign = 'center';
            gameContext.textBaseline = 'middle';
            var warningText = 'TIEMPO: ' + timeText;
            gameContext.strokeText(warningText, canvasWidth / 2, 100);
            gameContext.fillText(warningText, canvasWidth / 2, 100);
        }
        
        // Si la distancia restante es muy poca, mostrar advertencia
        if (distanceRemaining <= 0.5 && distanceRemaining > 0) {
            gameContext.font = 'bold 36px Arial';
            gameContext.fillStyle = '#00FF00';
            gameContext.textAlign = 'center';
            gameContext.textBaseline = 'middle';
            gameContext.strokeText('¡CASI LLEGAS!', canvasWidth / 2, 150);
            gameContext.fillText('¡CASI LLEGAS!', canvasWidth / 2, 150);
        }
    }
    
    gameContext.restore();
    
    return state;
}

