/**
 * Retro Racer - Game Script
 * A pseudo-3D racing game logic.
 */

// --- CONFIGURATION & CONSTANTS ---
const CONFIG = {
    fps: 60,
    roadWidth: 2000,
    segmentLength: 200,
    drawDistance: 500,
    fieldOfView: 100,
    cameraHeight: 1000,
    cameraDepth: null,
    lanes: 3,
    colors: {
        sky: '#3399ff',
        grass: ['#00aa00', '#00cc00'],
        road: ['#333333', '#3a3a3a'],
        border: ['#ffffff', '#ff0000'],
        start: ['#ffffff', '#000000'],
        finish: ['#000000', '#ffffff']
    },
    speeds: {
        max: 7000,
        accel: 80,
        decel: 150,
        offRoadDecel: 400,
        turnSpeed: 3000
    }
};

// --- GAME STATE ---
const State = {
    menu: 0,
    settings: 1,
    countdown: 2,
    running: 3,
    finished: 4,
    paused: 5
};

let gameState = State.menu;
let canvas, ctx;
let width, height;

// Player
let player = {
    x: 0, // -1 to 1
    z: 0,
    speed: 0,
    maxSpeed: CONFIG.speeds.max,
    width: 600
};

// Controls
let keys = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    isLeft: false,
    isRight: false
};

// Race
let track = [];
let trackLength = 0;
let raceTime = 0;
let raceDuration = 60;
let lastTime = 0;
let score = 0;
let topScore = 20000;
let lap = 0; // 0 = Qualifying


// Checkpoints
const CHECKPOINT_DISTANCE = 1000 * 100; // 1km in abstract units (roughly)
let nextCheckpoint = CHECKPOINT_DISTANCE;

// Sprites Assets
// Sprites Assets
const Sprites = {
    PLAYER: { color: '#ff0055', w: 80, h: 40 },
    CAR: { color: '#00eeff', w: 80, h: 40 }, // Bright Cyan for opponents
    CONE: { color: '#ffaa00', w: 40, h: 40 }, // Bigger cones
    BOULDER: { color: '#888888', w: 100, h: 80 }, // New Big Obstacle
    START_BANNER: { w: 600, h: 300 },
    FINISH_BANNER: { w: 600, h: 300 }
};

// DOM Elements
// DOM Elements
const els = {
    time: null,
    dist: null,
    speed: null,
    screens: {
        menu: null,
        settings: null,
        gameOver: null,
        msg: null
    },
    lights: null, // moved out of screens to avoid loop issues or just keep separate
    msgText: null
};

// --- INITIALIZATION ---

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Cache DOM
    els.time = document.getElementById('time-display');
    els.score = document.getElementById('score-display');
    els.topScore = document.getElementById('top-score');
    els.speed = document.getElementById('speed-display');
    els.lap = document.getElementById('lap-display');

    els.screens.menu = document.getElementById('main-menu');
    els.screens.settings = document.getElementById('settings-menu');
    els.screens.gameOver = document.getElementById('game-over');
    els.screens.pause = document.getElementById('pause-menu'); // New
    els.screens.msg = document.getElementById('message-overlay');

    els.lights = document.getElementById('start-lights');
    els.msgText = document.getElementById('message-text');

    // Resize
    resize();
    window.addEventListener('resize', resize);

    // Inputs
    window.addEventListener('keydown', handleKey('down'));
    window.addEventListener('keyup', handleKey('up'));
    window.addEventListener('keydown', handleGlobalKeys); // New

    // UI Bindings
    document.querySelectorAll('.menu-btn[data-time]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            raceDuration = parseInt(e.target.dataset.time);
            startCountdown();
        });
    });

    document.getElementById('settings-btn').addEventListener('click', () => switchScreen(State.settings));
    document.getElementById('back-btn').addEventListener('click', () => switchScreen(State.menu));

    // Key Config
    setupKeyConfig('btn-key-left', 'left');
    setupKeyConfig('btn-key-right', 'right');

    // Start Loop
    CONFIG.cameraDepth = 1 / Math.tan((CONFIG.fieldOfView / 2) * Math.PI / 180);
    resetRoad(); // Initialize track for background rendering
    gameLoop();
};

function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    width = canvas.width;
    height = canvas.height;
}

// --- INPUT & SETTINGS ---

function handleKey(type) {
    return (e) => {
        // Prevent default only for game keys to avoid blocking F5/DevTools
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }

        const isDown = type === 'down';
        if (e.code === keys.left) keys.isLeft = isDown;
        if (e.code === keys.right) keys.isRight = isDown;
    };
}

function handleGlobalKeys(e) {
    if (e.code === 'KeyP') {
        if (gameState === State.running) {
            switchScreen(State.paused);
        } else if (gameState === State.paused) {
            switchScreen(State.running);
            lastTime = performance.now(); // Reset time to avoid jump
            requestAnimationFrame(gameLoop);
        }
    }
    if (e.code === 'Escape') {
        if (gameState === State.running || gameState === State.paused || gameState === State.finished) {
            switchScreen(State.menu);
        }
    }
}

function setupKeyConfig(btnId, action) {
    const btn = document.getElementById(btnId);
    btn.innerText = keys[action].replace('Arrow', '').toUpperCase();

    btn.addEventListener('click', () => {
        btn.innerText = 'PRESS KEY...';
        btn.classList.add('waiting');

        const handler = (e) => {
            if (e.key === "Escape") return;
            e.preventDefault();
            keys[action] = e.code;
            btn.innerText = e.code.replace('Arrow', '').toUpperCase(); // Clean up name
            btn.classList.remove('waiting');
            window.removeEventListener('keydown', handler);
        };

        window.addEventListener('keydown', handler, { once: true });
    });
}

// --- GAME LOGIC ---

function switchScreen(newState) {
    gameState = newState;
    // Hide all screens
    Object.values(els.screens).forEach(el => el.classList.add('hidden'));

    // Hide lights specifically if not countdown
    if (newState !== State.countdown) {
        els.lights.classList.add('hidden');
    }

    if (newState === State.menu) els.screens.menu.classList.remove('hidden');
    if (newState === State.settings) els.screens.settings.classList.remove('hidden');
    if (newState === State.finished) els.screens.gameOver.classList.remove('hidden');
    if (newState === State.paused) els.screens.pause.classList.remove('hidden'); // New
    // Countdown handled by lights overlay, no separate screen container needed in loop
}

function showMessage(text, duration = 2000) {
    els.msgText.innerText = text;
    els.screens.msg.classList.remove('hidden');
    setTimeout(() => {
        els.screens.msg.classList.add('hidden');
    }, duration);
}

function startCountdown() {
    switchScreen(State.countdown);
    els.lights.classList.remove('hidden');

    const lights = els.lights.querySelectorAll('.light');
    lights.forEach(l => l.classList.remove('on'));

    // Sequence: Red -> Yellow -> Green -> GO
    let stage = 0;

    // Reset road if needed, or keep the background one?
    // Pole position usually starts with car stationary on track.
    // If we want to reset for the RACE specifically:
    // We can call resetRoad here if we want a fresh track, OR just reset player state.
    // Let's reset purely player state in startGame so the background doesn't jump.
    // BUT random track generation means different track. simpler to reset here or in startGame.
    // If we reset in onload, we have a track.

    const interval = setInterval(() => {
        stage++;
        if (stage === 1) lights[0].classList.add('on'); // Red
        if (stage === 2) {
            lights[0].classList.remove('on');
            lights[1].classList.add('on'); // Yellow
        }
        if (stage === 3) {
            lights[1].classList.remove('on');
            lights[2].classList.add('on'); // Green
        }
        if (stage === 4) {
            clearInterval(interval);
            els.lights.classList.add('hidden');
            startGame();
        }
    }, 1000);
}

function startGame() {
    // resetRoad(); // Previously created new track. Let's create new track for every race to ensure fairness/randomness
    resetRoad();
    player.speed = 0;
    player.x = 0;
    player.z = 0;
    raceTime = 0;
    score = 0;
    lap = 1; // Start Lap 1
    nextCheckpoint = CHECKPOINT_DISTANCE;
    lastTime = performance.now();
    switchScreen(State.running);
}

// --- TRACK GENERATION ---

function resetRoad() {
    track = [];
    const totalSegments = 10000;

    for (let n = 0; n < totalSegments; n++) {
        track.push({
            index: n,
            curve: 0,
            color: Math.floor(n / 3) % 2 ? CONFIG.colors.grass[0] : CONFIG.colors.grass[1],
            roadColor: Math.floor(n / 3) % 2 ? CONFIG.colors.road[0] : CONFIG.colors.road[1],
            sprites: []
        });
    }

    // Procedural generation
    for (let i = 0; i < totalSegments; i += 500) {
        let length = Math.floor(Math.random() * 200) + 100;
        let curve = (Math.random() * 10) - 5; // Increased curve intensity
        addCurve(i, length, curve);
    }

    // Sprites (Obstacles & Traffic)
    for (let n = 20; n < totalSegments - 20; n++) {
        if (Math.random() < 0.05) {
            const lane = (Math.random() * 1.8) - 0.9;
            const type = Math.random() > 0.5 ? 'BOULDER' : 'CONE'; // 50% chance for BOULDER or CONE
            const scale = 1.0 + Math.random() * 1.0; // Random size 1x to 2x
            track[n].sprites.push({ type: type, offset: lane, speed: 0, scale: scale });
        }
        if (Math.random() < 0.02) {
            const lane = (Math.random() * 1.5) - 0.75;
            const speed = CONFIG.speeds.max * (0.3 + Math.random() * 0.4);
            track[n].sprites.push({ type: 'CAR', offset: lane, speed: speed, z: n * CONFIG.segmentLength });
        }
    }

    // Start/Finish
    for (let n = 0; n < 20; n++) { // Longer start grid
        track[n].roadColor = (Math.floor(n / 2) % 2) ? CONFIG.colors.start[0] : CONFIG.colors.start[1];
    }
    // Add Start Banner
    track[1].sprites.push({ type: 'START_BANNER', offset: 0, speed: 0 });

    trackLength = track.length * CONFIG.segmentLength;

    // Finish Banner
    track[track.length - 20].sprites.push({ type: 'FINISH_BANNER', offset: 0, speed: 0 });
}

function addCurve(enter, hold, curve) {
    for (let n = 0; n < hold; n++) {
        const i = enter + n;
        if (track[i]) track[i].curve = curve;
    }
}

// --- MAIN LOOP ---

function gameLoop(time) {
    if (!lastTime) lastTime = time;
    const dt = Math.min(1, (time - lastTime) / 1000);
    lastTime = time;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
}

function update(dt) {
    if (gameState !== State.running) return;

    raceTime += dt;
    const remaining = Math.max(0, raceDuration - raceTime);

    // Score calculation: speed * constant
    if (player.speed > 0) {
        score += Math.floor((player.speed / 100) * dt * 5);
    }

    updateHUD(remaining);

    if (remaining <= 0) {
        finishGame();
        return;
    }

    const accel = CONFIG.speeds.accel * dt * 60;
    if (player.speed < player.maxSpeed) {
        player.speed += accel;
    }

    const speedRatio = (player.speed / player.maxSpeed);

    // Normalized steering speed: turnSpeed(3000) / roadWidth(2000) = 1.5 units per second.
    // Boosted multiplier to 2.5 for very snappy arcade feel.
    const dx = (CONFIG.speeds.turnSpeed / CONFIG.roadWidth) * dt * speedRatio * 2.5;

    if (keys.isLeft) player.x -= dx;
    if (keys.isRight) player.x += dx;

    // Curve Centrifugal Force
    const playerSegmentIndex = Math.floor(player.z / CONFIG.segmentLength);
    const playerSeg = track[playerSegmentIndex];
    if (playerSeg) {
        // Reduced force and scaled by speedRatio squared for more realism
        player.x -= (playerSeg.curve * speedRatio * speedRatio * dt * 0.3);
    }

    player.x = Math.max(-2.5, Math.min(2.5, player.x));

    if ((player.x < -1 || player.x > 1) && player.speed > CONFIG.speeds.max / 4) {
        player.speed -= CONFIG.speeds.offRoadDecel * dt * 60;
    }

    player.z += player.speed * dt;

    if (player.z > nextCheckpoint) {
        showMessage("CHECKPOINT REACHED!");
        nextCheckpoint += CHECKPOINT_DISTANCE;
    }

    // Collision Detection
    for (let i = 0; i < 5; i++) {
        const idx = (playerSegmentIndex + i);
        if (idx >= track.length) break;

        const seg = track[idx];
        seg.sprites.forEach(spr => {
            if (spr.speed > 0) {
                spr.z += spr.speed * dt; // Traffic moves
                // Approximate Z check for traffic
            }

            const spriteGlobalZ = (spr.z !== undefined) ? spr.z : (idx * CONFIG.segmentLength);
            // Collision Box
            const scale = spr.scale || 1;
            const hitDepth = 80 * scale;
            const hitWidth = 0.15 * scale;

            if (player.z > spriteGlobalZ - hitDepth && player.z < spriteGlobalZ + hitDepth) {
                if (Math.abs(player.x - spr.offset) < hitWidth) {
                    player.speed = player.maxSpeed * 0.2;
                    showMessage(spr.type === 'CAR' ? "TRAFFIC HIT!" : "CRASH!", 500);
                }
            }
        });
    }

    if (player.z >= trackLength) finishGame();
}

function updateHUD(timeLeft) {
    // Time
    const remainingToUse = Math.ceil(timeLeft); // Show integer seconds like arcade
    els.time.innerText = remainingToUse;

    // Speed
    const speedVal = Math.floor((player.speed / CONFIG.speeds.max) * 300); // 0-300 km/h approx
    els.speed.innerText = speedVal;

    // Score
    els.score.innerText = score.toString().padStart(5, '0');
    els.topScore.innerText = Math.max(topScore, score).toString().padStart(5, '0');

    // Lap (Distance approximation or just static for this mode)
    // In Pole Position, lap time checks are key, here we use laps as checkpoints?
    // For now: Just display 1 or distance.
    const distKm = (player.z / 10000).toFixed(1);
    els.lap.innerText = distKm;
}

function finishGame() {
    gameState = State.finished;
    const distKm = (player.z / 10000).toFixed(2);
    document.getElementById('final-score').innerText = score;
    document.getElementById('final-dist').innerText = distKm;
    let perf = distKm > 20 ? "Legendary!" : (distKm > 10 ? "Amazing Racer!" : "Good Job!");
    document.getElementById('performance-msg').innerText = perf;
    switchScreen(State.finished);
}

// --- RENDERING ENGINE (IMPROVED) ---

function render() {
    ctx.clearRect(0, 0, width, height);

    // Parallax Background
    renderBackground();

    if (track.length > 0) {
        renderScene(); // Draws road and sprites
        renderPlayer(); // Draws car
    }
}

function renderBackground() {
    // Sky
    ctx.fillStyle = CONFIG.colors.sky;
    ctx.fillRect(0, 0, width, height);

    // Mountains (Simple procedural jagged lines)
    const curve = track[Math.floor(player.z / CONFIG.segmentLength)]?.curve || 0;
    const bgOffset = (player.x * 200) + (curve * 50); // Simple parallax shift

    ctx.fillStyle = '#006600'; // Dark Green Mountains
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    for (let i = 0; i <= width; i += 50) {
        // Create mountains based on x, shift by player movement
        let h = 50 + Math.sin((i + player.z * 0.01) * 0.01) * 20;
        h += Math.sin((i + player.x * 500) * 0.02) * 20; // Pseudo random look
        // Actually for pure retro, static mountains that scroll are better.
        // Let's do a static shape that scrolls.
        let mY = (Math.sin((i + bgOffset) * 0.01) * 30) + (Math.cos((i + bgOffset) * 0.03) * 20);
        ctx.lineTo(i, height / 2 - 40 - mY);
    }
    ctx.lineTo(width, height / 2);
    ctx.fill();

    // Clouds (Pixelated Rects)
    ctx.fillStyle = '#ffffff';
    // Draw a few clouds drifting
    const cloudOffset = (Date.now() * 0.05) % width;
    ctx.fillRect((100 + cloudOffset) % width, 100, 60, 20);
    ctx.fillRect((120 + cloudOffset) % width, 80, 40, 20);

    ctx.fillRect((500 + cloudOffset * 0.5) % width, 150, 80, 20);
}

function renderScene() {
    const baseSegment = Math.floor(player.z / CONFIG.segmentLength);
    const startPos = player.z % CONFIG.segmentLength;
    let dx = 0;
    let maxy = height;

    let visibleSegments = [];

    // 1. Calculate Projections (Front-to-Back)
    for (let n = 0; n < CONFIG.drawDistance; n++) {
        const idx = (baseSegment + n) % track.length;
        const segment = track[idx];
        const looped = idx < baseSegment;

        let segmentWorldZ = (n * CONFIG.segmentLength) - startPos;
        if (looped) segmentWorldZ += trackLength; // Handle loop if we had one, but we don't for logic yet

        if (segmentWorldZ < CONFIG.cameraDepth) continue;

        dx += segment.curve;

        const cameraX = -player.x * CONFIG.roadWidth - dx;
        const cameraY = CONFIG.cameraHeight;
        const cameraZ = segmentWorldZ;

        const scale = CONFIG.cameraDepth / cameraZ;
        const screenX = width / 2 + (scale * cameraX * width / 2);
        const screenY = height / 2 + (scale * cameraY * height / 2); // Changed - to + to fix inversion
        const screenW = scale * CONFIG.roadWidth * width / 2;

        const p1 = { x: screenX, y: screenY, w: screenW, scale: scale };

        // Store for drawing
        visibleSegments.push({ segment, p1 });
    }

    // 2. Draw (Back-to-Front)
    for (let n = visibleSegments.length - 1; n > 0; n--) {
        const curr = visibleSegments[n]; // Far
        const prev = visibleSegments[n - 1]; // Near

        renderRoadSegment(prev, curr, prev.segment); // Draw segment between prev and curr
        renderSprites(prev, prev.segment);
    }
}

function renderRoadSegment(pNear, pFar, segment) {
    const p1 = pNear.p1;
    const p2 = pFar.p1;

    // Grass
    ctx.fillStyle = segment.color; // Green variants
    ctx.fillRect(0, p2.y, width, p1.y - p2.y);

    // Road
    ctx.fillStyle = segment.roadColor;
    drawPoly(p1.x, p1.y, p1.w, p2.x, p2.y, p2.w);

    // Curbs (Red/White) - Distinct blocks
    const type = (Math.floor(segment.index / 3)) % 2;
    ctx.fillStyle = type ? CONFIG.colors.border[1] : CONFIG.colors.border[0]; // Red/White

    // Make curbs visually wider to distinguish curves better
    const curbW1 = p1.w * 0.4; // 40% of road width (Was 20%)
    const curbW2 = p2.w * 0.4;

    // Left Curb
    ctx.beginPath();
    ctx.moveTo(p1.x - p1.w, p1.y);
    ctx.lineTo(p2.x - p2.w, p2.y);
    ctx.lineTo(p2.x - p2.w - curbW2, p2.y);
    ctx.lineTo(p1.x - p1.w - curbW1, p1.y);
    ctx.fill();

    // Right Curb
    ctx.beginPath();
    ctx.moveTo(p1.x + p1.w, p1.y);
    ctx.lineTo(p2.x + p2.w, p2.y);
    ctx.lineTo(p2.x + p2.w + curbW2, p2.y);
    ctx.lineTo(p1.x + p1.w + curbW1, p1.y);
    ctx.fill();
}

function renderSprites(proj, segment) {
    if (!segment.sprites.length) return;

    for (let spr of segment.sprites) {
        const scale = proj.p1.scale;
        const spriteX = proj.p1.x + (spr.offset * proj.p1.w);
        const spriteY = proj.p1.y;

        // Custom Banner Rendering
        if (spr.type === 'START_BANNER' || spr.type === 'FINISH_BANNER') {
            renderBanner(spriteX, spriteY, scale, spr.type === 'START_BANNER' ? "START" : "GOAL");
            continue;
        }

        const spriteScale = scale * width * 0.6; // Base scale for all sprites
        const currentSpriteScale = (spr.scale || 1) * spriteScale; // Apply sprite specific scale
        const sw = Sprites[spr.type].w * currentSpriteScale;
        const sh = Sprites[spr.type].h * currentSpriteScale;

        const drawX = spriteX - sw / 2;
        const drawY = spriteY - sh;

        // Draw Shadows
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.ellipse(spriteX, spriteY, sw / 2, sh / 5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (spr.type === 'CAR') {
            // Arcade opponent car (Simple shape)
            ctx.fillStyle = '#ffffff'; // White body
            ctx.fillRect(drawX, drawY + sh * 0.5, sw, sh * 0.5); // Body
            ctx.fillStyle = '#00dd00'; // Green Stripe for visibility
            ctx.fillRect(drawX, drawY + sh * 0.6, sw, sh * 0.2);
            ctx.fillStyle = '#000'; // Tires
            ctx.fillRect(drawX - sw * 0.1, drawY + sh * 0.6, sw * 0.2, sh * 0.4);
            ctx.fillRect(drawX + sw * 0.9, drawY + sh * 0.6, sw * 0.2, sh * 0.4);
            // Wing
            ctx.fillStyle = '#333';
            ctx.fillRect(drawX, drawY + sh * 0.4, sw, sh * 0.1);
        } else {
            // Generic (Cone, etc)
            ctx.fillStyle = Sprites[spr.type].color;
            ctx.fillRect(drawX, drawY, sw, sh);
        }
    }
}

function renderBanner(x, y, scale, text) {
    const w = 1500 * scale * (width * 0.001); // Wide banner
    const h = 100 * scale * (width * 0.001); // Height of banner beam
    const poleH = 400 * scale * (width * 0.001);

    // Poles
    ctx.fillStyle = '#cc0000'; // Red poles
    ctx.fillRect(x - w / 2, y - poleH, w * 0.05, poleH);
    ctx.fillRect(x + w / 2 - w * 0.05, y - poleH, w * 0.05, poleH);

    // Top Beam
    ctx.fillStyle = '#ffff00'; // Yellow Frame
    ctx.fillRect(x - w / 2, y - poleH, w, h);

    // Checkered pattern inside beam
    const checkSize = h / 2;
    for (let i = 0; i < w / checkSize; i++) {
        ctx.fillStyle = (i % 2 === 0) ? '#000' : '#fff';
        ctx.fillRect(x - w / 2 + i * checkSize, y - poleH, checkSize, h);
    }

    // Text Plate
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x - w / 4, y - poleH + h * 0.1, w / 2, h * 0.8);

    // Text
    ctx.font = `${Math.floor(h * 0.6)}px "Press Start 2P"`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y - poleH + h * 0.7);
}

function drawPoly(x1, y1, w1, x2, y2, w2) {
    ctx.beginPath();
    ctx.moveTo(x1 - w1, y1);
    ctx.lineTo(x2 - w2, y2);
    ctx.lineTo(x2 + w2, y2);
    ctx.lineTo(x1 + w1, y1);
    ctx.fill();
}

function renderPlayer() {
    // F1 Style Car: Red
    const scale = 1.0;
    const w = 200 * scale;
    const h = 100 * scale;
    const x = width / 2 - w / 2;
    const y = height - h - 30;

    const bounce = (player.speed > 0) ? Math.cos(Date.now() / 20) * 2 : 0;

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2 + bounce);

    if (keys.isLeft) ctx.rotate(-0.05);
    if (keys.isRight) ctx.rotate(0.05);

    // Tires
    ctx.fillStyle = '#111';
    const tireW = w * 0.25;
    const tireH = h * 0.4;
    ctx.fillRect(-w / 2 - 10, -h / 4, tireW, tireH); // Rear Left
    ctx.fillRect(w / 2 + 10 - tireW, -h / 4, tireW, tireH); // Rear Right

    // Rear Wing
    ctx.fillStyle = '#000';
    ctx.fillRect(-w / 2, -h / 2, w, h * 0.2); // Wing
    ctx.fillStyle = '#cc0000'; // Wing Text area?
    ctx.fillRect(-w / 2 + 5, -h / 2 + 2, w - 10, h * 0.15);

    // Body (Engine cover)
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-w * 0.25, -h / 2, w * 0.5, h * 0.8);

    // Side pods
    ctx.fillStyle = '#cc0000';
    ctx.fillRect(-w * 0.4, -h * 0.1, w * 0.8, h * 0.4);

    // Cockpit / Driver
    ctx.fillStyle = '#333'; // Inside
    ctx.fillRect(-w * 0.1, -h * 0.3, w * 0.2, h * 0.3);
    ctx.fillStyle = '#ffff00'; // Helmet
    ctx.beginPath();
    ctx.arc(0, -h * 0.2, w * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Blue Number Plate
    ctx.fillStyle = '#0033cc';
    ctx.fillRect(-w * 0.15, 0, w * 0.3, h * 0.25);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('1', -3, 18);

    ctx.restore();
}
