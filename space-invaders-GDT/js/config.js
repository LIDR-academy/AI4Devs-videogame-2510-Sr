// ============================================================================
// GAME CONFIGURATION
// ============================================================================

export const CONFIG = {
    canvas: {
        width: 800,
        height: 600
    },
    player: {
        width: 50,
        height: 40,
        speed: 5,
        color: '#00ff00',
        shootCooldown: 300
    },
    enemy: {
        width: 40,
        height: 30,
        rows: 4,
        cols: 10,
        padding: 10,
        offsetX: 50,
        offsetY: 50,
        speed: 1,
        dropDistance: 20,
        colors: ['#ff0000', '#ff6600', '#ffff00', '#ff00ff'],
        shotInterval: 1000
    },
    bullet: {
        width: 4,
        height: 15,
        speed: 7,
        color: '#00ff00'
    },
    enemyBullet: {
        width: 4,
        height: 15,
        speed: 4,
        color: '#ff0000'
    },
    powerUp: {
        width: 30,
        height: 30,
        speed: 2,
        spawnChance: 0.15,
        duration: 10000
    },
    bonusUFO: {
        spawnInterval: 15000
    },
    divingEnemy: {
        spawnInterval: 5000,
        speed: 2.5,
        arcRadius: 100,
        angleSpeed: 0.04
    }
};
