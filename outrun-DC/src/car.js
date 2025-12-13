/**************************************************
** CAR SPRITES AND RENDERING
**************************************************/

var carSprites = {};
var carSpriteLoaded = false;
var animationFrame = 0;
var animationTimer = 0;

function loadCarSprites() {
    var spriteNames = [
        'straight', 'left', 'right', 'hardleft', 'hardright',
        'up-straight', 'up-left', 'up-right', 'up-hardleft', 'up-hardright',
        'down-straight', 'down-left', 'down-right', 'down-hardleft', 'down-hardright'
    ];
    
    var totalSprites = spriteNames.length * 4; // 2 frames + 2 brake frames for each
    var loadedSprites = 0;
    var errorCount = 0;

    function onSpriteLoad() {
        loadedSprites++;
        if (loadedSprites === totalSprites) {
            carSpriteLoaded = true;
            console.log("Todos los sprites del coche cargados correctamente");
        }
    }

    function onSpriteError(img, name, type) {
        errorCount++;
        console.error("Error cargando sprite:", name, type);
        // Marcar como cargado para no bloquear el juego, pero con imagen vacía
        onSpriteLoad();
    }

    spriteNames.forEach(function(name) {
        // Load normal frames
        var frame0 = new Image();
        var frame1 = new Image();
        var brake0 = new Image();
        var brake1 = new Image();

        frame0.onload = onSpriteLoad;
        frame1.onload = onSpriteLoad;
        brake0.onload = onSpriteLoad;
        brake1.onload = onSpriteLoad;

        frame0.onerror = function() { onSpriteError(frame0, name, 'frame0'); };
        frame1.onerror = function() { onSpriteError(frame1, name, 'frame1'); };
        brake0.onerror = function() { onSpriteError(brake0, name, 'brake0'); };
        brake1.onerror = function() { onSpriteError(brake1, name, 'brake1'); };

        frame0.src = 'assets/sprites/ferrari/' + name + '-0.png';
        frame1.src = 'assets/sprites/ferrari/' + name + '-1.png';
        brake0.src = 'assets/sprites/ferrari/' + name + '-brake-0.png';
        brake1.src = 'assets/sprites/ferrari/' + name + '-brake-1.png';

        carSprites[name] = {
            normal: [frame0, frame1],
            brake: [brake0, brake1]
        };
    });
    
    console.log("Iniciando carga de sprites del coche. Total:", totalSprites);
}

function getCarSprite(keys, zRate, xRate, animationFrame) {
    if (!carSpriteLoaded || !carSprites) return null;

    var spriteName = '';
    var isBrake = keys.down;
    var direction = '';
    
    // Determine direction based on movement
    var isMovingUp = zRate > 5;
    var isMovingDown = zRate < -5 || keys.down;
    var turnAmount = Math.abs(xRate);
    var isHardTurn = turnAmount > 8;

    // Determine vertical direction prefix
    if (isMovingDown) {
        direction += 'down-';
    } else if (isMovingUp) {
        direction += 'up-';
    }

    // Determine horizontal direction
    if (keys.left && keys.right) {
        spriteName = 'straight';
    } else if (keys.left) {
        spriteName = isHardTurn ? 'hardleft' : 'left';
    } else if (keys.right) {
        spriteName = isHardTurn ? 'hardright' : 'right';
    } else {
        spriteName = 'straight';
    }

    var fullSpriteName = direction + spriteName;
    if (!carSprites[fullSpriteName]) {
        fullSpriteName = spriteName; // Fallback to non-prefixed version
    }

    if (carSprites[fullSpriteName]) {
        var spriteSet = isBrake ? carSprites[fullSpriteName].brake : carSprites[fullSpriteName].normal;
        return spriteSet[animationFrame] || spriteSet[0];
    }

    return null;
}

function updateCarAnimation() {
    animationTimer++;
    if (animationTimer > 10) { // Change frame every 10 game loops
        animationFrame = animationFrame === 0 ? 1 : 0;
        animationTimer = 0;
    }
    return animationFrame;
}

function drawCar(camX, camY, camZ, focal, canvasWidth, canvasHeight, gameContext, keys, zRate, xRate, getHeightAtPos, MAP_INTERVAL, PI, HILL_MAP, getTurnAtPos, MAP, CAM_HEIGHT) {
    if (!carSpriteLoaded) {
        // Dibujar un placeholder mientras cargan los sprites
        gameContext.fillStyle = 'red';
        gameContext.fillRect(canvasWidth / 2 - 50, canvasHeight * 0.7, 100, 30);
        return;
    }

    var currentFrame = animationFrame;
    var carSprite = getCarSprite(keys, zRate, xRate, currentFrame);
    if (!carSprite || !carSprite.complete || !carSprite.width || !carSprite.height) {
        // Si no hay sprite válido, dibujar un placeholder
        gameContext.fillStyle = 'blue';
        gameContext.fillRect(canvasWidth / 2 - 50, canvasHeight * 0.7, 100, 30);
        return;
    }

    // Car position: El coche está en una posición fija relativa a la cámara
    // Se posiciona cerca de la parte inferior de la pantalla, como si fuera el vehículo del jugador
    // Aumentamos la distancia Z para que aparezca más abajo en la pantalla
    var carDistance = 180; // Distancia Z del coche (delante de la cámara) - aumentado para posicionarlo más abajo
    var carZ = camZ + carDistance;
    
    // Ajustar posición X para seguir el giro de la carretera
    var turnOffset = getTurnAtPos(carZ, MAP, MAP_INTERVAL) * 0.005;
    var carX = camX + turnOffset;
    
    // Calcular la altura de la carretera en la posición del coche
    // El coche SIEMPRE está en la superficie de la carretera (no flota)
    // Esto hace que el vehículo siga los desniveles y caiga cuando no está acelerando
    var roadHeightAtCar = getHeightAtPos(carZ, HILL_MAP, MAP_INTERVAL, PI);
    var carY = roadHeightAtCar;

    // Project car position to screen
    var projX = projectX(carX, carZ, camX, camZ, focal, canvasWidth);
    var projY = projectY(carY, carZ, camY, camZ, focal, canvasHeight);
    
    // Calculate scale based on distance
    var scale = focal / (carZ - camZ);
    var carWidth = carSprite.width * scale * 0.25; // Scale factor for car size - aumentado de 0.12 a 0.25 para hacerlo más grande
    var carHeight = carSprite.height * scale * 0.25;

    // Verificar que el coche esté delante de la cámara y tenga dimensiones válidas
    if (carZ > camZ && carWidth > 0 && carHeight > 0) {
        var drawX = projX - carWidth / 2;
        var drawY = projY - carHeight;
        
        // Ajustar la posición Y para que el coche aparezca en la parte inferior de la pantalla
        // Queremos que el fondo del coche esté a una altura fija desde abajo (con margen)
        var bottomMargin = canvasHeight * 0.08; // 8% de margen desde abajo
        var targetBottomY = canvasHeight - bottomMargin;
        
        // Si el coche proyectado está más arriba de lo deseado, moverlo hacia abajo
        // pero solo si no rompe la ilusión de estar sobre la carretera
        var currentBottomY = drawY + carHeight;
        if (currentBottomY < targetBottomY - 50) { // Solo mover si está significativamente más arriba
            drawY = targetBottomY - carHeight;
        }
        
        // Dibujar siempre, incluso si está parcialmente fuera de la pantalla
        gameContext.save();
        gameContext.imageSmoothingEnabled = true;
        gameContext.imageSmoothingQuality = 'high';
        gameContext.drawImage(
            carSprite,
            drawX,
            drawY,
            carWidth,
            carHeight
        );
        gameContext.restore();
        
    }
}

