# Space Invaders

Classic Space Invaders game built with Vanilla JavaScript and HTML5 Canvas.

## Setup

Open `index.html` in a modern web browser.

## Controls

- **Arrow Keys** - Move left/right
- **SPACE** - Shoot
- **P** - Pause/Resume
- **R** - Restart after game over

## Features

- Multiple levels with increasing difficulty
- Power-ups (rapid fire, shield, extra life, multi-shot)
- Bonus UFO encounters
- Diving enemy attacks
- Particle effects
- Score and lives tracking

## Project Structure

```text
space-invaders-GDT/
├── index.html
├── css/style.css
├── js/
│   ├── main.js          # Entry point
│   ├── Game.js          # Main game loop
│   ├── GameState.js     # Game state management
│   ├── config.js        # Configuration
│   └── entities/        # Game entities
│       ├── Player.js
│       ├── Enemy.js
│       ├── DivingEnemy.js
│       ├── BonusUFO.js
│       ├── Bullet.js
│       ├── PowerUp.js
│       └── Particle.js
└── assets/images/       # Sprite images
```

## Tech Stack

- Vanilla JavaScript (ES6 modules)
- HTML5 Canvas
- CSS3
