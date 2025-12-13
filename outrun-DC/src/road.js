/**************************************************
** ROAD RENDERING AND MAP FUNCTIONS
**************************************************/

// Get turn value at z position
function getTurnAtPos(z, MAP, MAP_INTERVAL) {
    var ind = Math.floor(z / MAP_INTERVAL) % MAP.length,
        ind2 = ind + 1 > MAP.length - 1 ? 0 : ind + 1;
    return (MAP[ind2] * (z % MAP_INTERVAL) + MAP[ind] * (MAP_INTERVAL - (z % MAP_INTERVAL))) / MAP_INTERVAL;
}

// Get height at z position
function getHeightAtPos(z, HILL_MAP, MAP_INTERVAL, PI) {
    var ind = Math.floor(z / MAP_INTERVAL) % HILL_MAP.length,
        ind2 = ind + 1 > HILL_MAP.length - 1 ? 0 : ind + 1,
        percent = (1 - Math.cos(PI * (z % MAP_INTERVAL) / MAP_INTERVAL)) / 2; // Cosine interpolation
    return HILL_MAP[ind2] * percent + HILL_MAP[ind] * (1 - percent);
}

function drawLine3D(x1, y1, z1, x2, y2, z2, camX, camY, camZ, focal, canvasWidth, canvasHeight, gameContext) {
    if (z1 - camZ <= 0 && z2 - camZ <= 0) {
        return;
    }

    if (z1 - camZ <= 0) {
        x1 += (camZ - z1) / (z2 - z1) * (x2 - x1);
        y1 += (camZ - z1) / (z2 - z1) * (y2 - y1);
        z1 = camZ + 1;
    } else if (z2 - camZ <= 0) {
        x2 += (camZ - z2) / (z1 - z2) * (x1 - x2);
        y2 += (camZ - z2) / (z1 - z2) * (y1 - y2);
        z2 = camZ + 1;
    }

    var outX1 = projectX(x1, z1, camX, camZ, focal, canvasWidth);
    var outY1 = projectY(y1, z1, camY, camZ, focal, canvasHeight);
    var outX2 = projectX(x2, z2, camX, camZ, focal, canvasWidth);
    var outY2 = projectY(y2, z2, camY, camZ, focal, canvasHeight);

    gameContext.beginPath();
    gameContext.moveTo(Math.round(outX1), Math.round(outY1));
    gameContext.lineTo(Math.round(outX2), Math.round(outY2));
    gameContext.stroke();
}

// Draws section of road and returns highest y value drawn to
function drawRoadSection(x, z, topY, width, length, startTurn, endTurn, camX, camY, camZ, focal, canvasWidth, canvasHeight, ROAD_SECTION_LENGTH, gameContext) {
    if (z + length - camZ <= 0) {
        return topY;
    }

    var x1 = x - width / 2;
    var x2 = x + width / 2;

    var zNew = z - camZ <= 0 ? camZ + 1 : z;

    var outY1 = projectY(getHeightAtPos(zNew, window.roadData.HILL_MAP, window.roadData.MAP_INTERVAL, window.roadData.PI), zNew, camY, camZ, focal, canvasHeight);
    var outY2 = projectY(getHeightAtPos(z + length, window.roadData.HILL_MAP, window.roadData.MAP_INTERVAL, window.roadData.PI), z + length, camY, camZ, focal, canvasHeight);
    if (outY2 >= outY1 || outY2 > topY) return topY;

    var outX1 = projectX(x1 + startTurn, zNew, camX, camZ, focal, canvasWidth);
    var outX2 = projectX(x2 + startTurn, zNew, camX, camZ, focal, canvasWidth);
    var outX3 = projectX(x1 + endTurn, z + length, camX, camZ, focal, canvasWidth);
    var outX4 = projectX(x2 + endTurn, z + length, camX, camZ, focal, canvasWidth);

    // Reduce drawing outside window
    if (outX1 < 0 && outX3 < 0) {
        outX1 = 0;
        outX3 = 0;
    }
    if (outX2 > canvasWidth && outX4 > canvasWidth) {
        outX2 = canvasWidth;
        outX4 = canvasWidth;
    }

    gameContext.beginPath();
    gameContext.moveTo(Math.round(outX1), Math.round(outY1));
    gameContext.lineTo(Math.round(outX2), Math.round(outY1));
    gameContext.lineTo(Math.round(outX4), Math.round(outY2));
    gameContext.lineTo(Math.round(outX3), Math.round(outY2));
    gameContext.closePath();
    gameContext.fill();

    // Return top Y of section end
    return projectY(getHeightAtPos(z + ROAD_SECTION_LENGTH, window.roadData.HILL_MAP, window.roadData.MAP_INTERVAL, window.roadData.PI), z + ROAD_SECTION_LENGTH, camY, camZ, focal, canvasHeight);
}

