/**************************************************
** 3D PROJECTION FUNCTIONS
**************************************************/

// Project point and return as normalized point
function projectPoint(x, y, z, camX, camY, camZ, focal, canvasWidth, canvasHeight) {
    var outX = (x - camX) * focal / (z - camZ),
        outY = -((y - camY) * focal / (z - camZ));

    outX += canvasWidth / 2;
    outY += canvasHeight / 2;

    return [outX, outY];
}

// Get projected x coordinate
function projectX(x, z, camX, camZ, focal, canvasWidth) {
    return (x - camX) * focal / (z - camZ) + canvasWidth / 2;
}

// Get projected x coordinate, including turn distortion
function projectXWithTurn(x, z, turn, camX, camZ, focal, canvasWidth) {
    return (x - camX + turn * Math.pow(z - camZ, 2)) * focal / (z - camZ) + canvasWidth / 2;
}

// Get projected y coordinate
function projectY(y, z, camY, camZ, focal, canvasHeight) {
    return canvasHeight / 2 - ((y - camY) * focal / (z - camZ));
}

