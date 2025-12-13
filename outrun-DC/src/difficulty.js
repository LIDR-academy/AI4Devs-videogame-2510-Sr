/**************************************************
** DIFFICULTY SYSTEM - Dynamic map generation based on stage
**************************************************/

console.log("difficulty.js cargado");

// Mapa base para la etapa 1
var BASE_MAP = [-10, -10, 20, 10, -5, 0, 0, 0, 50, 40, 30, 20, -50, -50, 0, 0, 0];

// Generar mapa con curvas más cerradas según la etapa
function getMapForStage(currentStage) {
    var difficultyLevel = Math.max(1, currentStage);
    // Factor de dificultad: las curvas se hacen más pronunciadas con cada etapa
    // Etapa 1: factor 1.0, Etapa 2: factor 1.2, Etapa 3: factor 1.4, etc.
    var curveMultiplier = 1.0 + (difficultyLevel - 1) * 0.15;
    
    // Crear una copia del mapa base
    var stageMap = [];
    for (var i = 0; i < BASE_MAP.length; i++) {
        // Multiplicar cada valor del mapa por el factor de dificultad
        // Esto hace las curvas más cerradas (valores más extremos)
        stageMap[i] = BASE_MAP[i] * curveMultiplier;
    }
    
    // A partir de la etapa 3, añadir curvas adicionales más pronunciadas
    if (difficultyLevel >= 3) {
        // Añadir más variación: algunas curvas más cerradas aleatoriamente
        for (var j = 0; j < stageMap.length; j += 2) {
            if (Math.random() > 0.5) {
                stageMap[j] *= 1.3; // Hacer algunas curvas aún más cerradas
            }
        }
    }
    
    return stageMap;
}

// Obtener el mapa actual basado en la etapa
function getCurrentMap() {
    var currentStage = 1;
    if (typeof window !== 'undefined' && window.currentStage) {
        currentStage = window.currentStage;
    } else if (typeof getCurrentStage === 'function') {
        currentStage = getCurrentStage();
    }
    return getMapForStage(currentStage);
}

