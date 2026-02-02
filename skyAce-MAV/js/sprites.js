// Sistema de sprites pixelart para SkyAce
class SpriteManager {
    constructor() {
        this.sprites = {};
        this.createAllSprites();
    }

    createAllSprites() {
        this.sprites.player = this.createPlayerSprite();
        this.sprites.enemyLight = this.createEnemyLight();
        this.sprites.enemyBomber = this.createEnemyBomber();
        this.sprites.enemyHeavy = this.createEnemyHeavy();
        this.sprites.enemyHelicopter = this.createEnemyHelicopter();
        this.sprites.miniBoss = this.createMiniBoss();
    }

    // Avión del jugador - Estilo F-15
    createPlayerSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');

        // Cuerpo principal (azul metálico)
        ctx.fillStyle = '#1E90FF';
        ctx.fillRect(22, 10, 4, 30);
        
        // Cabina
        ctx.fillStyle = '#00BFFF';
        ctx.fillRect(22, 12, 4, 8);
        
        // Cristal cabina
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(23, 13, 2, 4);
        
        // Alas principales
        ctx.fillStyle = '#1C86EE';
        ctx.fillRect(10, 22, 28, 8);
        ctx.fillRect(12, 24, 24, 4);
        
        // Alas traseras (cola)
        ctx.fillStyle = '#1874CD';
        ctx.fillRect(16, 36, 16, 6);
        
        // Motores
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(18, 34, 4, 8);
        ctx.fillRect(26, 34, 4, 8);
        
        // Llamas de motor
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(19, 40, 2, 3);
        ctx.fillRect(27, 40, 2, 3);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(19, 42, 2, 2);
        ctx.fillRect(27, 42, 2, 2);
        
        // Detalles y sombras
        ctx.fillStyle = '#104E8B';
        ctx.fillRect(22, 18, 1, 4);
        ctx.fillRect(25, 18, 1, 4);
        
        // Armas en las alas
        ctx.fillStyle = '#696969';
        ctx.fillRect(12, 26, 2, 3);
        ctx.fillRect(34, 26, 2, 3);
        
        return canvas;
    }

    // Enemigo Tipo 1: Caza ligero (rápido, débil)
    createEnemyLight() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Cuerpo (rojo)
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(14, 8, 4, 20);
        
        // Cabina
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(14, 10, 4, 6);
        
        // Cristal
        ctx.fillStyle = '#FFA07A';
        ctx.fillRect(15, 11, 2, 3);
        
        // Alas
        ctx.fillStyle = '#B22222';
        ctx.fillRect(8, 16, 16, 6);
        
        // Cola
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(12, 6, 8, 4);
        
        // Motor
        ctx.fillStyle = '#A52A2A';
        ctx.fillRect(14, 26, 4, 4);
        
        return canvas;
    }

    // Enemigo Tipo 2: Bombardero (lento, resistente)
    createEnemyBomber() {
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');

        // Cuerpo principal (verde militar)
        ctx.fillStyle = '#556B2F';
        ctx.fillRect(20, 8, 8, 28);
        
        // Cabina
        ctx.fillStyle = '#6B8E23';
        ctx.fillRect(20, 12, 8, 8);
        
        // Cristal cabina
        ctx.fillStyle = '#9ACD32';
        ctx.fillRect(22, 14, 4, 4);
        
        // Alas grandes
        ctx.fillStyle = '#4F6F3F';
        ctx.fillRect(6, 20, 36, 10);
        ctx.fillRect(8, 22, 32, 6);
        
        // Motores en las alas
        ctx.fillStyle = '#3F5F2F';
        ctx.fillRect(10, 28, 6, 6);
        ctx.fillRect(32, 28, 6, 6);
        
        // Hélices
        ctx.fillStyle = '#696969';
        ctx.fillRect(9, 32, 8, 2);
        ctx.fillRect(31, 32, 8, 2);
        
        // Cola
        ctx.fillStyle = '#4F6F3F';
        ctx.fillRect(18, 4, 12, 6);
        
        // Compartimento de bombas
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(21, 28, 6, 4);
        
        return canvas;
    }

    // Enemigo Tipo 3: Caza pesado (medio, dispara)
    createEnemyHeavy() {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');

        // Cuerpo (naranja/amarillo)
        ctx.fillStyle = '#FF8C00';
        ctx.fillRect(17, 8, 6, 24);
        
        // Cabina
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(17, 12, 6, 8);
        
        // Cristal
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(18, 14, 4, 4);
        
        // Alas en ángulo
        ctx.fillStyle = '#FF7F00';
        ctx.fillRect(11, 18, 18, 8);
        ctx.fillRect(9, 20, 22, 4);
        
        // Motores dobles
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(15, 30, 4, 6);
        ctx.fillRect(21, 30, 4, 6);
        
        // Armamento visible
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(12, 24, 3, 4);
        ctx.fillRect(25, 24, 3, 4);
        
        // Cola en V
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(15, 6, 10, 4);
        
        return canvas;
    }

    // Enemigo Tipo 4: Helicóptero (movimiento lateral)
    createEnemyHelicopter() {
        const canvas = document.createElement('canvas');
        canvas.width = 48;
        canvas.height = 48;
        const ctx = canvas.getContext('2d');

        // Rotor principal (animado visualmente como borroso)
        ctx.fillStyle = 'rgba(128, 128, 128, 0.4)';
        ctx.fillRect(8, 8, 32, 3);
        
        // Eje del rotor
        ctx.fillStyle = '#696969';
        ctx.fillRect(23, 8, 2, 6);
        
        // Cabina principal (gris militar)
        ctx.fillStyle = '#708090';
        ctx.fillRect(18, 14, 12, 14);
        
        // Cristal frontal
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(20, 16, 8, 6);
        
        // Cuerpo/fuselaje
        ctx.fillStyle = '#778899';
        ctx.fillRect(16, 22, 16, 8);
        
        // Tren de aterrizaje
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(18, 30, 2, 4);
        ctx.fillRect(28, 30, 2, 4);
        ctx.fillRect(16, 33, 6, 2);
        ctx.fillRect(26, 33, 6, 2);
        
        // Cola
        ctx.fillStyle = '#696969';
        ctx.fillRect(26, 20, 10, 4);
        
        // Rotor de cola (vertical)
        ctx.fillStyle = 'rgba(128, 128, 128, 0.4)';
        ctx.fillRect(35, 16, 2, 8);
        
        // Detalles
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(20, 26, 2, 2);
        ctx.fillRect(26, 26, 2, 2);
        
        return canvas;
    }

    // Mini-Boss: Avión grande
    createMiniBoss() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Cuerpo principal masivo (morado oscuro)
        ctx.fillStyle = '#4B0082';
        ctx.fillRect(26, 10, 12, 40);
        
        // Refuerzo central
        ctx.fillStyle = '#6A0DAD';
        ctx.fillRect(28, 12, 8, 36);
        
        // Cabina blindada
        ctx.fillStyle = '#8B008B';
        ctx.fillRect(28, 16, 8, 12);
        
        // Cristal cabina
        ctx.fillStyle = '#9370DB';
        ctx.fillRect(30, 18, 4, 6);
        
        // Alas gigantes
        ctx.fillStyle = '#483D8B';
        ctx.fillRect(6, 28, 52, 14);
        ctx.fillRect(10, 30, 44, 10);
        
        // Motores cuádruples
        ctx.fillStyle = '#2F2F4F';
        ctx.fillRect(12, 40, 6, 8);
        ctx.fillRect(22, 40, 6, 8);
        ctx.fillRect(36, 40, 6, 8);
        ctx.fillRect(46, 40, 6, 8);
        
        // Llamas potentes
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(13, 46, 4, 4);
        ctx.fillRect(23, 46, 4, 4);
        ctx.fillRect(37, 46, 4, 4);
        ctx.fillRect(47, 46, 4, 4);
        
        // Armamento pesado
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(8, 34, 4, 8);
        ctx.fillRect(52, 34, 4, 8);
        ctx.fillRect(18, 36, 3, 6);
        ctx.fillRect(43, 36, 3, 6);
        
        // Cola en forma de V invertida
        ctx.fillStyle = '#4B0082';
        ctx.fillRect(22, 6, 20, 6);
        
        // Blindaje extra
        ctx.fillStyle = '#191970';
        ctx.fillRect(26, 24, 2, 8);
        ctx.fillRect(36, 24, 2, 8);
        
        return canvas;
    }

    getSprite(type) {
        return this.sprites[type] || this.sprites.player;
    }
}

// Instancia global del gestor de sprites
const spriteManager = new SpriteManager();
