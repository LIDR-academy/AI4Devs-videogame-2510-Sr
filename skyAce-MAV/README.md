# SkyAce - Classic Arcade Shooter

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Un juego arcade de aviones estilo **Aero Fighters** y **1942**, desarrollado con HTML5, CSS3 y JavaScript vanilla.

## 🎮 Características

- ✈️ **Jugabilidad clásica arcade** con scroll vertical
- 🔫 **Sistema de armas mejorable** (3 niveles)
- 👾 **4 tipos de enemigos** (básico, rápido, tanque, boss)
- 💊 **Power-ups** (vida, armas, escudo)
- 💥 **Sistema de partículas** para explosiones
- 🎯 **Sistema de puntuación** con high score guardado
- 📱 **Diseño responsive**
- 🎨 **Estética retro** con efectos neón

## 🕹️ Controles

- **← →** : Mover nave
- **ESPACIO** : Disparar
- **P** : Pausar/Reanudar

## 🚀 Cómo Jugar

1. Abre `index.html` en tu navegador
2. Haz clic en "START GAME"
3. Esquiva enemigos y dispara para ganar puntos
4. Recoge power-ups para mejorar tu nave
5. ¡Sobrevive el mayor tiempo posible!

## 📁 Estructura del Proyecto

```
skyAce-MAV/
├── index.html          # Página principal
├── README.md           # Este archivo
├── prompts.md          # Documentación de prompts
├── css/
│   └── styles.css      # Estilos del juego
├── js/
│   ├── game.js         # Motor principal
│   ├── player.js       # Lógica del jugador
│   ├── enemy.js        # Sistema de enemigos
│   ├── bullet.js       # Sistema de proyectiles
│   ├── powerup.js      # Power-ups
│   ├── collision.js    # Detección de colisiones
│   └── utils.js        # Utilidades
└── assets/             # Recursos (futuro)
```

## 🎯 Tipos de Enemigos

| Tipo | Vida | Velocidad | Puntos | Características |
|------|------|-----------|--------|-----------------|
| **Básico** | 30 | Normal | 100 | Movimiento recto |
| **Rápido** | 20 | Alta | 150 | Patrón zigzag |
| **Tanque** | 80 | Lenta | 250 | Alta resistencia |
| **Boss** | 200 | Media | 1000 | Patrón sinusoidal |

## 💊 Power-Ups

- **❤️ Vida** : Restaura 25 puntos de salud
- **🔫 Arma** : Mejora el nivel de arma (máx. 3)
- **🛡️ Escudo** : Protección temporal de 5 segundos

## 🛠️ Tecnologías Utilizadas

- **HTML5 Canvas** - Renderizado del juego
- **CSS3** - Estilos y animaciones
- **JavaScript ES6** - Lógica del juego
- **LocalStorage** - Guardado de high score

## 🎨 Arquitectura del Código

El juego utiliza una arquitectura orientada a objetos con los siguientes sistemas:

- **Object Pool Pattern** - Optimización de memoria para balas y enemigos
- **Game Loop** con `requestAnimationFrame` para animaciones fluidas
- **Sistema de Estados** - Menu, Playing, Paused, Game Over
- **Sistema de Partículas** - Efectos visuales
- **Collision Detection** - AABB (Axis-Aligned Bounding Box)

## 📈 Progresión del Juego

- Los niveles aumentan cada 30 segundos
- La dificultad incrementa progresivamente
- Los enemigos aparecen con mayor frecuencia
- Power-ups aparecen cada 15 segundos

## 🌐 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 Notas de Desarrollo

Este proyecto fue desarrollado como parte del curso **AI4Devs**, utilizando asistentes de IA para la generación de código y arquitectura del juego.

## 🚧 Mejoras Futuras

- [ ] Añadir efectos de sonido
- [ ] Música de fondo
- [ ] Más tipos de enemigos
- [ ] Sistema de logros
- [ ] Tabla de clasificación online
- [ ] Modo multijugador local

## 👤 Autor

**MAV** - Desarrollado para AI4Devs

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

**¡Disfruta el juego! 🎮✈️**
