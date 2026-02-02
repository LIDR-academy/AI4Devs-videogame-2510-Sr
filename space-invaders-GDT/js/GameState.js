// ============================================================================
// GAME STATE
// ============================================================================

export class GameState {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.isRunning = false;
        this.isPaused = false;
        this.gameOver = false;
    }
}
