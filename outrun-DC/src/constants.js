/**************************************************
** GAME CONSTANTS
**************************************************/
const GAME_CONSTANTS = {
    FOV: 100,    // Field of view in degrees
    PI: 3.14159,
    // Color constants
    ROAD_COLOR: "#999999",
    MARKING_COLOR: "#ffd8FF",
    SKY_COLOR: "#1e90ff",
    // Dimension/layout constants
    CAM_HEIGHT: 90,
    ROAD_WIDTH: 300,  // Reducido de 800 a 300 para carriles más pequeños (proporcional al coche más grande)
    ROAD_SECTION_LENGTH: 400,
    MARKING_LENGTH: 100,  // Reducido para que las marcas sean proporcionales
    RENDER_DIST: 15000,
    MAP_INTERVAL: 4000,    // Distance between each turn value
    MAP: [-10, -10, 20, 10, -5, 0, 0, 0, 50, 40, 30, 20, -50, -50, 0, 0, 0],
    HILL_MAP: [0, 300, 300, 300, 1000, -300, 0, 0]
};

