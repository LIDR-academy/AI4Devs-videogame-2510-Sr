/**************************************************
** LANDSCAPE ELEMENTS SYSTEM
**************************************************/

console.log("landscape.js cargado");

var landscapeSprites = {};
var landscapeLoaded = false;
var landscapeElements = []; // Array de elementos decorativos activos

// Mapeo de etapas a tipos de paisaje
var STAGE_THEMES = [
    'autobahn',      // Etapa 1
    'wilderness',    // Etapa 2
    'wheat-field',   // Etapa 3
    'cloudy-mountain', // Etapa 4
    'vineyard',      // Etapa 5
    'alps',          // Etapa 6
    'desert',        // Etapa 7
    'coconut-beach', // Etapa 8
    'old-capital',   // Etapa 9
    'seaside-town',  // Etapa 10
    'death-valley',  // Etapa 11
    'desolation-hill', // Etapa 12
    'devils-canyon', // Etapa 13
    'gateaway',      // Etapa 14
    'lakeside'       // Etapa 15
];

// Configuración de elementos por tema
var THEME_ELEMENTS = {
    'autobahn': ['bush-1', 'bush-2', 'tree'],
    'wilderness': ['cut-tree', 'dry-tree', 'rock-1', 'rock-2'],
    'wheat-field': ['tree', 'terrain', 'motorcycle-sign'],
    'cloudy-mountain': ['tree', 'terrain', 'clouds'],
    'vineyard': ['terrain'],
    'alps': ['mill-1', 'mill-2', 'terrain-1', 'terrain-2'],
    'desert': ['dry-tree', 'terrain'],
    'coconut-beach': ['tree', 'bush', 'terrain', 'sail-1', 'sail-2', 'tunnel'],
    'old-capital': ['tree-1', 'tree-2', 'tower', 'hut'],
    'seaside-town': ['tower', 'hut', 'terrain'],
    'death-valley': ['rock', 'pebbles', 'danke-sign'],
    'desolation-hill': ['rock-1', 'rock-2'],
    'devils-canyon': ['rock', 'terrain', 'diving-sign', 'sega-sign', 'tunnel'],
    'gateaway': ['castle', 'terrain', 'arcade-sign', 'motorcycle-sign', 'tunnel'],
    'lakeside': ['tree']
};

// Constantes
var LANDSCAPE_SPAWN_DISTANCE = 300; // Distancia mínima entre elementos
var LANDSCAPE_SPAWN_RANGE = 3000; // Rango de distancia donde pueden aparecer elementos
var LANDSCAPE_MAX_COUNT = 8; // Máximo número de elementos en pantalla
var LANDSCAPE_ROAD_OFFSET = 200; // Distancia lateral desde el borde de la carretera

function getThemeForStage(stage) {
    var index = (stage - 1) % STAGE_THEMES.length;
    return STAGE_THEMES[index];
}

function loadLandscapeSprites(currentStage) {
    var theme = getThemeForStage(currentStage);
    var elements = THEME_ELEMENTS[theme] || THEME_ELEMENTS['autobahn'];
    
    var loadedCount = 0;
    var totalCount = elements.length;
    var errorCount = 0;
    
    // Limpiar sprites anteriores
    landscapeSprites = {};
    landscapeLoaded = false;
    
    function onSpriteLoad() {
        loadedCount++;
        if (loadedCount === totalCount) {
            landscapeLoaded = true;
            console.log("Todos los sprites de paisaje cargados correctamente para tema:", theme);
        }
    }
    
    function onSpriteError(img, elementName) {
        errorCount++;
        console.error("Error cargando sprite de paisaje:", elementName);
        onSpriteLoad(); // Contar como cargado para no bloquear
    }
    
    for (var i = 0; i < elements.length; i++) {
        (function(elementIndex) {
            var elementName = elements[elementIndex];
            var img = new Image();
            
            img.onload = onSpriteLoad;
            img.onerror = function() { onSpriteError(img, elementName); };
            img.src = 'assets/sprites/landscape/environment/' + theme + '/' + elementName + '.png';
            
            landscapeSprites[elementName] = img;
        })(i);
    }
    
    console.log("Iniciando carga de sprites de paisaje para tema:", theme, "Total:", totalCount);
}

function createLandscapeElement(camZ, ROAD_WIDTH, theme, MAP, MAP_INTERVAL) {
    var elements = THEME_ELEMENTS[theme] || THEME_ELEMENTS['autobahn'];
    var elementName = elements[Math.floor(Math.random() * elements.length)];
    
    // Determinar lado (izquierdo o derecho)
    var side = Math.random() < 0.5 ? -1 : 1;
    var roadHalfWidth = ROAD_WIDTH / 2;
    
    // Calcular posición Z del elemento
    var elementZ = camZ + Math.random() * LANDSCAPE_SPAWN_RANGE + LANDSCAPE_SPAWN_DISTANCE;
    
    // Calcular el offset de giro en esa posición Z
    var turnOffsetAtZ = getTurnAtPos(elementZ, MAP, MAP_INTERVAL) * 0.005;
    
    // Posición X fuera de la carretera, considerando el giro
    // El centro de la carretera está en turnOffsetAtZ (no en 0 cuando hay curva)
    var offsetFromRoad = LANDSCAPE_ROAD_OFFSET + Math.random() * 100;
    var x = turnOffsetAtZ + side * (roadHalfWidth + offsetFromRoad);
    
    var element = {
        z: elementZ,
        x: x,
        type: elementName,
        side: side,
        scale: 0.8 + Math.random() * 0.4 // Variación de tamaño
    };
    
    return element;
}

function updateLandscapeElements(camZ, zRate, ROAD_WIDTH, currentStage, MAP, MAP_INTERVAL) {
    // Mover elementos según la velocidad del jugador
    for (var i = landscapeElements.length - 1; i >= 0; i--) {
        var element = landscapeElements[i];
        element.z -= zRate;
        
        // Actualizar posición X para seguir el giro de la carretera
        // Mantener el elemento fuera de la carretera en todo momento
        var turnOffsetAtZ = getTurnAtPos(element.z, MAP, MAP_INTERVAL) * 0.005;
        var roadHalfWidth = ROAD_WIDTH / 2;
        var offsetFromRoad = LANDSCAPE_ROAD_OFFSET + 50; // Offset mínimo
        // Recalcular X basándose en el lado original y el nuevo giro
        element.x = turnOffsetAtZ + element.side * (roadHalfWidth + offsetFromRoad);
        
        // Eliminar elementos que están muy lejos por detrás
        if (element.z < camZ - 200) {
            landscapeElements.splice(i, 1);
        }
        
        // Eliminar elementos que están muy lejos por delante
        if (element.z > camZ + LANDSCAPE_SPAWN_RANGE + 500) {
            landscapeElements.splice(i, 1);
        }
    }
    
    // Generar nuevos elementos si es necesario
    var theme = getThemeForStage(currentStage);
    var spawnAttempts = 0;
    var maxSpawnAttempts = 50;
    
    while (landscapeElements.length < LANDSCAPE_MAX_COUNT && spawnAttempts < maxSpawnAttempts) {
        spawnAttempts++;
        var newElement = createLandscapeElement(camZ, ROAD_WIDTH, theme, MAP, MAP_INTERVAL);
        
        // Verificar que no esté demasiado cerca de otros elementos
        var tooClose = false;
        for (var j = 0; j < landscapeElements.length; j++) {
            var zDiff = Math.abs(newElement.z - landscapeElements[j].z);
            var xDiff = Math.abs(newElement.x - landscapeElements[j].x);
            if (zDiff < LANDSCAPE_SPAWN_DISTANCE && xDiff < 100) {
                tooClose = true;
                break;
            }
        }
        
        if (!tooClose && newElement.z > camZ + 100) {
            landscapeElements.push(newElement);
        }
    }
}

function drawLandscapeElements(camX, camY, camZ, focal, canvasWidth, canvasHeight, gameContext, HILL_MAP, MAP_INTERVAL, PI, getTurnAtPos, MAP, getHeightAtPos, ROAD_WIDTH) {
    if (!landscapeLoaded) return;
    
    // Ordenar elementos por distancia Z (del más lejano al más cercano)
    var sortedElements = landscapeElements.slice().sort(function(a, b) {
        return b.z - a.z;
    });
    
    for (var i = 0; i < sortedElements.length; i++) {
        var element = sortedElements[i];
        var zDistance = element.z - camZ;
        
        // Solo dibujar elementos que están delante de la cámara
        if (zDistance <= 0) continue;
        
        var sprite = landscapeSprites[element.type];
        if (!sprite || !sprite.complete) continue;
        
        // La posición X ya está ajustada para seguir el giro en updateLandscapeElements
        // Solo necesitamos usar la posición X directamente
        var adjustedX = element.x;
        
        // Verificar que el elemento esté fuera de la carretera (seguridad adicional)
        var turnOffsetAtZ = getTurnAtPos(element.z, MAP, MAP_INTERVAL) * 0.005;
        var roadHalfWidth = ROAD_WIDTH / 2;
        var minDistanceFromRoad = roadHalfWidth + LANDSCAPE_ROAD_OFFSET;
        
        // Si está demasiado cerca de la carretera, ajustarlo
        var distanceFromRoadCenter = Math.abs(adjustedX - turnOffsetAtZ);
        if (distanceFromRoadCenter < minDistanceFromRoad) {
            // Ajustar para mantenerlo fuera
            var direction = adjustedX > turnOffsetAtZ ? 1 : -1;
            adjustedX = turnOffsetAtZ + direction * minDistanceFromRoad;
        }
        
        // Calcular posición Y (en la superficie del terreno)
        var terrainHeight = getHeightAtPos(element.z, HILL_MAP, MAP_INTERVAL, PI);
        var elementY = terrainHeight;
        
        // Proyectar a pantalla
        var projX = projectX(adjustedX, element.z, camX, camZ, focal, canvasWidth);
        var projY = projectY(elementY, element.z, camY, camZ, focal, canvasHeight);
        
        // Calcular escala basada en la distancia (efecto de perspectiva)
        var scale = focal / zDistance;
        var elementWidth = sprite.width * scale * element.scale * 0.4; // Factor de escala base
        var elementHeight = sprite.height * scale * element.scale * 0.4;
        
        // Solo dibujar si está visible
        if (zDistance > -100 && zDistance < 3000 && elementWidth > 0 && elementHeight > 0) {
            var drawX = projX - elementWidth / 2;
            var drawY = projY - elementHeight;
            
            // Solo dibujar si está en pantalla o cerca de los bordes
            if (drawX < canvasWidth + elementWidth && drawX + elementWidth > -elementWidth && 
                drawY < canvasHeight && drawY + elementHeight > 0) {
                gameContext.save();
                gameContext.imageSmoothingEnabled = true;
                gameContext.imageSmoothingQuality = 'high';
                gameContext.drawImage(
                    sprite,
                    drawX,
                    drawY,
                    elementWidth,
                    elementHeight
                );
                gameContext.restore();
            }
        }
    }
}

function resetLandscapeElements() {
    landscapeElements = [];
}

