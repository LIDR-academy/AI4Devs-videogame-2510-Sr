/**
 * MathMaster - Juego Educativo de Matemáticas
 * Desarrollado por: EFC
 * Versión: 1.0
 *
 * Modo: Desafío por Puntuación Fija
 * El jugador debe responder correctamente un número fijo de preguntas (20/30/40)
 * Si responde incorrectamente, puede reintentar hasta acertar
 * El cronómetro es ascendente (sin presión de tiempo)
 */

// ==================== CONFIGURACIÓN DE NIVELES ====================

const LEVEL_CONFIG = {
    1: {
        name: "Básica y Tablas",
        description: "Sumas/Restas de 1 a 10. Resultado siempre positivo. Multiplicación y división de factores de 1 a 10.",
        suma: { min: 1, max: 10, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 10, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 10 }, factor2: { min: 1, max: 10 } },
        division: { divisor: { min: 1, max: 10 }, resultDecimals: 0 }
    },
    2: {
        name: "Números Medianos",
        description: "Sumas/Restas de 1 a 100. Resultado siempre positivo. Multiplicación hasta 15. División con cociente entero.",
        suma: { min: 1, max: 100, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 100, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 10 }, factor2: { min: 1, max: 15 } },
        division: { divisor: { min: 1, max: 15 }, resultDecimals: 0 }
    },
    3: {
        name: "Grandes Enteros",
        description: "Sumas/Restas de 1 a 1,000. Factores de multiplicación hasta 30. División con cociente entero.",
        suma: { min: 1, max: 1000, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 1000, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 30 }, factor2: { min: 1, max: 30 } },
        division: { divisor: { min: 1, max: 30 }, resultDecimals: 0 }
    },
    4: {
        name: "Decimales Simples",
        description: "Números hasta 10,000 con decimales simples (X.X). División con 1 decimal en resultado.",
        suma: { min: 1, max: 100, decimals: 1, allowNegative: false },
        resta: { min: 1, max: 100, decimals: 1, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 100 }, factor2: { min: 1, max: 100 } },
        division: { divisor: { min: 1, max: 50 }, resultDecimals: 1 }
    },
    5: {
        name: "Decimales Complejos",
        description: "Números hasta 100,000 con decimales (X.XXX). Multiplicación de números grandes. División con 2 decimales.",
        suma: { min: 1, max: 1000, decimals: 3, allowNegative: false },
        resta: { min: 1, max: 1000, decimals: 3, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 1000 }, factor2: { min: 1, max: 100 } },
        division: { divisor: { min: 1, max: 100 }, resultDecimals: 2 }
    },
    6: {
        name: "Números Negativos",
        description: "Suma y Resta con números negativos frecuentes (Ej: -10 + 25). Multiplicación de 3 dígitos. División con 3 decimales.",
        suma: { min: -50, max: 100, decimals: 0, allowNegative: true },
        resta: { min: -50, max: 100, decimals: 0, allowNegative: true },
        multiplicacion: { factor1: { min: 100, max: 999 }, factor2: { min: 100, max: 999 } },
        division: { divisor: { min: 1, max: 100 }, resultDecimals: 3 }
    },
    7: {
        name: "Cadenas de Operaciones",
        description: "Cadenas de suma/resta (Ej: 15 - 8 + 3). Multiplicación de 4x2 dígitos. División con decimales en divisor.",
        suma: { min: 1, max: 50, decimals: 0, allowNegative: true, chain: true },
        resta: { min: 1, max: 50, decimals: 0, allowNegative: true, chain: true },
        multiplicacion: { factor1: { min: 1000, max: 9999 }, factor2: { min: 10, max: 99 } },
        division: { divisor: { min: 1, max: 100 }, resultDecimals: 2, decimalDivisor: true }
    },
    8: {
        name: "Jerarquía Básica",
        description: "Operaciones combinadas sin paréntesis. Ej: 5 × 6 + 10 = ? o 100 ÷ 4 - 5 = ?",
        suma: { min: 1, max: 50, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 50, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 20 }, factor2: { min: 1, max: 20 } },
        division: { divisor: { min: 2, max: 10 }, resultDecimals: 0 },
        mixed: true
    },
    9: {
        name: "Pre-Álgebra",
        description: "Resolver la incógnita X. Ej: X + 15 = 27, 50 - X = 12, 4X = 48, X ÷ 5 = 15",
        suma: { min: 1, max: 100, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 100, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 12 }, factor2: { min: 1, max: 20 } },
        division: { divisor: { min: 2, max: 15 }, resultDecimals: 0 },
        algebra: true
    },
    10: {
        name: "PEMDAS/BODMAS",
        description: "Jerarquía de operaciones con paréntesis. Ej: 5 × (4 + 3) - 10 ÷ 2 = ?",
        suma: { min: 1, max: 20, decimals: 0, allowNegative: false },
        resta: { min: 1, max: 20, decimals: 0, allowNegative: false },
        multiplicacion: { factor1: { min: 1, max: 10 }, factor2: { min: 1, max: 10 } },
        division: { divisor: { min: 2, max: 10 }, resultDecimals: 0 },
        pemdas: true
    }
};

// Nombres de operaciones para mostrar
const OPERATION_NAMES = {
    suma: 'Suma',
    resta: 'Resta',
    multiplicacion: 'Multiplicación',
    division: 'División',
    tablas: 'Tablas de Multiplicar'
};

// ==================== ESTADO DEL JUEGO ====================

let gameState = {
    // Configuración seleccionada
    operation: null,
    level: null,
    selectedTable: null,
    totalQuestions: 30,

    // Estado del juego activo
    isPlaying: false,
    isPaused: false,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalAttempts: 0,
    currentQuestion: null,
    currentAnswer: null,

    // Temporizador
    startTime: null,
    elapsedSeconds: 0,
    timerInterval: null,
    pausedTime: 0
};

// ==================== ELEMENTOS DEL DOM ====================

const DOM = {};

function initDOM() {
    // Pantallas
    DOM.selectionScreen = document.getElementById('selection-screen');
    DOM.gameScreen = document.getElementById('game-screen');
    DOM.resultsScreen = document.getElementById('results-screen');
    DOM.pauseOverlay = document.getElementById('pause-overlay');

    // Controles de selección
    DOM.operationButtons = document.querySelectorAll('.operation-btn');
    DOM.levelButtons = document.querySelectorAll('.level-btn');
    DOM.levelSection = document.getElementById('level-section');
    DOM.tableSection = document.getElementById('table-section');
    DOM.tableButtons = document.querySelectorAll('.table-btn');
    DOM.questionsButtons = document.querySelectorAll('.questions-btn');
    DOM.levelDescription = document.getElementById('level-description');
    DOM.startBtn = document.getElementById('start-btn');

    // Elementos del juego
    DOM.operationIndicator = document.getElementById('operation-indicator');
    DOM.timer = document.getElementById('timer');
    DOM.score = document.getElementById('score');
    DOM.streak = document.getElementById('streak');
    DOM.progressBar = document.getElementById('progress-bar');
    DOM.questionText = document.getElementById('question-text');
    DOM.answerInput = document.getElementById('answer-input');
    DOM.submitBtn = document.getElementById('submit-btn');
    DOM.feedbackText = document.getElementById('feedback-text');
    DOM.hintText = document.getElementById('hint-text');
    DOM.numpadButtons = document.querySelectorAll('.numpad-btn');
    DOM.pauseBtn = document.getElementById('pause-btn');
    DOM.quitBtn = document.getElementById('quit-btn');

    // Elementos de pausa
    DOM.pauseScore = document.getElementById('pause-score');
    DOM.pauseTime = document.getElementById('pause-time');
    DOM.resumeBtn = document.getElementById('resume-btn');
    DOM.restartBtn = document.getElementById('restart-btn');
    DOM.pauseQuitBtn = document.getElementById('pause-quit-btn');

    // Elementos de resultados
    DOM.resultsTitle = document.getElementById('results-title');
    DOM.resultsEmoji = document.getElementById('results-emoji');
    DOM.finalScore = document.getElementById('final-score');
    DOM.totalTime = document.getElementById('total-time');
    DOM.bestStreakDisplay = document.getElementById('best-streak');
    DOM.accuracy = document.getElementById('accuracy');
    DOM.totalAttempts = document.getElementById('total-attempts');
    DOM.avgTime = document.getElementById('avg-time');
    DOM.recordSection = document.getElementById('record-section');
    DOM.retryBtn = document.getElementById('retry-btn');
    DOM.menuBtn = document.getElementById('menu-btn');
}

// ==================== INICIALIZACIÓN ====================

function init() {
    initDOM();
    setupEventListeners();
    loadRecords();
}

function setupEventListeners() {
    // Botones de operación
    DOM.operationButtons.forEach(btn => {
        btn.addEventListener('click', () => selectOperation(btn.dataset.operation));
    });

    // Botones de nivel
    DOM.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => selectLevel(parseInt(btn.dataset.level)));
    });

    // Botones de tabla
    DOM.tableButtons.forEach(btn => {
        btn.addEventListener('click', () => selectTable(btn.dataset.table));
    });

    // Botones de cantidad de preguntas
    DOM.questionsButtons.forEach(btn => {
        btn.addEventListener('click', () => selectQuestions(parseInt(btn.dataset.questions)));
    });

    // Botón de inicio
    DOM.startBtn.addEventListener('click', startGame);

    // Botón de verificar respuesta
    DOM.submitBtn.addEventListener('click', checkAnswer);

    // Enter en input de respuesta
    DOM.answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });

    // Teclado numérico
    DOM.numpadButtons.forEach(btn => {
        btn.addEventListener('click', () => handleNumpad(btn.dataset.value));
    });

    // Controles del juego
    DOM.pauseBtn.addEventListener('click', pauseGame);
    DOM.quitBtn.addEventListener('click', confirmQuit);

    // Controles de pausa
    DOM.resumeBtn.addEventListener('click', resumeGame);
    DOM.restartBtn.addEventListener('click', restartGame);
    DOM.pauseQuitBtn.addEventListener('click', quitToMenu);

    // Controles de resultados
    DOM.retryBtn.addEventListener('click', restartGame);
    DOM.menuBtn.addEventListener('click', quitToMenu);

    // Tecla Escape para pausar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && gameState.isPlaying) {
            if (gameState.isPaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        }
    });
}

// ==================== SELECCIÓN DE OPCIONES ====================

function selectOperation(operation) {
    gameState.operation = operation;

    // Actualizar botones activos
    DOM.operationButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.operation === operation);
    });

    // Mostrar/ocultar secciones según operación
    if (operation === 'tablas') {
        DOM.levelSection.classList.add('hidden');
        DOM.tableSection.classList.remove('hidden');
        gameState.level = 1; // Nivel fijo para tablas
    } else {
        DOM.levelSection.classList.remove('hidden');
        DOM.tableSection.classList.add('hidden');
        gameState.selectedTable = null;
    }

    validateStartButton();
}

function selectLevel(level) {
    gameState.level = level;

    // Actualizar botones activos
    DOM.levelButtons.forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.level) === level);
    });

    // Mostrar descripción del nivel
    const config = LEVEL_CONFIG[level];
    DOM.levelDescription.textContent = config.description;

    validateStartButton();
}

function selectTable(table) {
    gameState.selectedTable = table === 'todas' ? 'todas' : parseInt(table);

    // Actualizar botones activos
    DOM.tableButtons.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.table === table);
    });

    validateStartButton();
}

function selectQuestions(count) {
    gameState.totalQuestions = count;

    // Actualizar botones activos
    DOM.questionsButtons.forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.questions) === count);
    });
}

function validateStartButton() {
    let isValid = false;

    if (gameState.operation === 'tablas') {
        isValid = gameState.selectedTable !== null;
    } else {
        isValid = gameState.operation !== null && gameState.level !== null;
    }

    DOM.startBtn.disabled = !isValid;
}

// ==================== CONTROL DEL JUEGO ====================

function startGame() {
    // Reiniciar estado del juego
    gameState.isPlaying = true;
    gameState.isPaused = false;
    gameState.correctAnswers = 0;
    gameState.currentStreak = 0;
    gameState.bestStreak = 0;
    gameState.totalAttempts = 0;
    gameState.elapsedSeconds = 0;
    gameState.pausedTime = 0;
    gameState.startTime = Date.now();

    // Mostrar pantalla de juego
    showScreen('game');

    // Configurar indicador de operación
    updateOperationIndicator();

    // Actualizar UI inicial
    updateScore();
    updateStreak();
    updateProgress();
    updateTimerDisplay();

    // Iniciar temporizador
    startTimer();

    // Generar primera pregunta
    generateQuestion();

    // Enfocar input
    DOM.answerInput.focus();
}

function pauseGame() {
    if (!gameState.isPlaying || gameState.isPaused) return;

    gameState.isPaused = true;
    gameState.pausedTime = Date.now();
    clearInterval(gameState.timerInterval);

    // Actualizar estadísticas de pausa
    DOM.pauseScore.textContent = `${gameState.correctAnswers} / ${gameState.totalQuestions}`;
    DOM.pauseTime.textContent = formatTime(gameState.elapsedSeconds);

    // Mostrar overlay de pausa
    DOM.pauseOverlay.classList.remove('hidden');
}

function resumeGame() {
    if (!gameState.isPaused) return;

    gameState.isPaused = false;

    // Ajustar tiempo de inicio para compensar la pausa
    const pauseDuration = Date.now() - gameState.pausedTime;
    gameState.startTime += pauseDuration;

    // Ocultar overlay y reanudar temporizador
    DOM.pauseOverlay.classList.add('hidden');
    startTimer();
    DOM.answerInput.focus();
}

function restartGame() {
    DOM.pauseOverlay.classList.add('hidden');
    startGame();
}

function confirmQuit() {
    pauseGame();
}

function quitToMenu() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    DOM.pauseOverlay.classList.add('hidden');
    showScreen('selection');
    resetSelections();
}

function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);

    // Verificar récord
    const isNewRecord = checkAndSaveRecord();

    // Mostrar resultados
    displayResults(isNewRecord);
    showScreen('results');
}

function resetSelections() {
    gameState.operation = null;
    gameState.level = null;
    gameState.selectedTable = null;

    DOM.operationButtons.forEach(btn => btn.classList.remove('selected'));
    DOM.levelButtons.forEach(btn => btn.classList.remove('selected'));
    DOM.tableButtons.forEach(btn => btn.classList.remove('selected'));

    DOM.levelDescription.textContent = 'Selecciona un nivel para ver su descripción';
    DOM.startBtn.disabled = true;
}

// ==================== TEMPORIZADOR ====================

function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    DOM.timer.textContent = formatTime(gameState.elapsedSeconds);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ==================== GENERACIÓN DE PREGUNTAS ====================

function generateQuestion() {
    let question, answer;

    if (gameState.operation === 'tablas') {
        const result = generateTableQuestion();
        question = result.question;
        answer = result.answer;
    } else {
        const level = LEVEL_CONFIG[gameState.level];

        // Verificar características especiales del nivel
        if (level.pemdas) {
            const result = generatePEMDASQuestion(level);
            question = result.question;
            answer = result.answer;
        } else if (level.algebra) {
            const result = generateAlgebraQuestion(level);
            question = result.question;
            answer = result.answer;
        } else if (level.mixed) {
            const result = generateMixedQuestion(level);
            question = result.question;
            answer = result.answer;
        } else if (level[gameState.operation]?.chain) {
            const result = generateChainQuestion(level);
            question = result.question;
            answer = result.answer;
        } else {
            const result = generateBasicQuestion(gameState.operation, level);
            question = result.question;
            answer = result.answer;
        }
    }

    gameState.currentQuestion = question;
    gameState.currentAnswer = answer;

    // Mostrar pregunta
    DOM.questionText.textContent = question;
    DOM.answerInput.value = '';
    DOM.answerInput.classList.remove('correct', 'incorrect');
    DOM.feedbackText.textContent = '';
    DOM.feedbackText.className = 'feedback-text';
    DOM.hintText.textContent = '';
}

function generateTableQuestion() {
    let factor1, factor2;

    if (gameState.selectedTable === 'todas') {
        factor1 = randomInt(1, 10);
        factor2 = randomInt(1, 10);
    } else {
        factor1 = gameState.selectedTable;
        factor2 = randomInt(1, 10);
        // Aleatorizar orden 50% del tiempo
        if (Math.random() > 0.5) {
            [factor1, factor2] = [factor2, factor1];
        }
    }

    return {
        question: `${factor1} × ${factor2} = ?`,
        answer: factor1 * factor2
    };
}

function generateBasicQuestion(operation, level) {
    let question, answer;
    const config = level[operation];

    switch (operation) {
        case 'suma': {
            const num1 = generateNumber(config.min, config.max, config.decimals);
            const num2 = generateNumber(config.min, config.max, config.decimals);
            answer = roundToDecimals(num1 + num2, config.decimals);
            question = `${formatNumber(num1)} + ${formatNumber(num2)} = ?`;
            break;
        }

        case 'resta': {
            let minuend = generateNumber(config.min, config.max, config.decimals);
            let subtrahend = generateNumber(config.min, config.max, config.decimals);

            // Asegurar resultado positivo si no se permiten negativos
            if (!config.allowNegative && subtrahend > minuend) {
                [minuend, subtrahend] = [subtrahend, minuend];
            }

            answer = roundToDecimals(minuend - subtrahend, config.decimals);
            question = `${formatNumber(minuend)} − ${formatNumber(subtrahend)} = ?`;
            break;
        }

        case 'multiplicacion': {
            const factor1 = randomInt(config.factor1.min, config.factor1.max);
            const factor2 = randomInt(config.factor2.min, config.factor2.max);
            answer = factor1 * factor2;
            question = `${formatNumber(factor1)} × ${formatNumber(factor2)} = ?`;
            break;
        }

        case 'division': {
            const divisor = randomInt(config.divisor.min, config.divisor.max);

            if (config.resultDecimals === 0) {
                // División exacta
                const quotient = randomInt(1, 20);
                const dividend = divisor * quotient;
                answer = quotient;
                question = `${formatNumber(dividend)} ÷ ${formatNumber(divisor)} = ?`;
            } else {
                // División con decimales
                let dividend, result;
                if (config.decimalDivisor) {
                    // Divisor decimal
                    const decDivisor = roundToDecimals(divisor / 10, 1);
                    dividend = randomInt(divisor * 2, divisor * 20);
                    result = roundToDecimals(dividend / decDivisor, config.resultDecimals);
                    answer = result;
                    question = `${formatNumber(dividend)} ÷ ${formatNumber(decDivisor)} = ?`;
                } else {
                    dividend = randomInt(divisor * 2, divisor * 50);
                    result = roundToDecimals(dividend / divisor, config.resultDecimals);
                    answer = result;
                    question = `${formatNumber(dividend)} ÷ ${formatNumber(divisor)} = ?`;
                }
            }
            break;
        }
    }

    return { question, answer };
}

function generateChainQuestion(level) {
    const count = randomInt(3, 4); // 3-4 números en la cadena
    const numbers = [];
    const operations = [];

    for (let i = 0; i < count; i++) {
        numbers.push(randomInt(1, 30));
        if (i < count - 1) {
            operations.push(Math.random() > 0.5 ? '+' : '−');
        }
    }

    // Construir pregunta y calcular respuesta
    let questionStr = formatNumber(numbers[0]);
    let answer = numbers[0];

    for (let i = 0; i < operations.length; i++) {
        questionStr += ` ${operations[i]} ${formatNumber(numbers[i + 1])}`;
        if (operations[i] === '+') {
            answer += numbers[i + 1];
        } else {
            answer -= numbers[i + 1];
        }
    }

    questionStr += ' = ?';

    return { question: questionStr, answer };
}

function generateMixedQuestion(level) {
    const type = randomInt(1, 3);
    let question, answer;

    switch (type) {
        case 1: { // a × b + c
            const a = randomInt(2, 10);
            const b = randomInt(2, 10);
            const c = randomInt(1, 20);
            answer = a * b + c;
            question = `${a} × ${b} + ${c} = ?`;
            break;
        }

        case 2: { // a + b × c
            const a = randomInt(1, 20);
            const b = randomInt(2, 10);
            const c = randomInt(2, 10);
            answer = a + b * c;
            question = `${a} + ${b} × ${c} = ?`;
            break;
        }

        case 3: { // a ÷ b + c o a ÷ b - c
            const b = randomInt(2, 10);
            const quotient = randomInt(2, 10);
            const a = b * quotient;
            const c = randomInt(1, 15);
            const isAddition = Math.random() > 0.5;

            if (isAddition) {
                answer = a / b + c;
                question = `${a} ÷ ${b} + ${c} = ?`;
            } else {
                answer = a / b - c;
                question = `${a} ÷ ${b} − ${c} = ?`;
            }
            break;
        }
    }

    return { question, answer };
}

function generateAlgebraQuestion(level) {
    const type = randomInt(1, 4);
    let question, answer;

    switch (type) {
        case 1: { // X + a = b
            const a = randomInt(1, 50);
            const b = randomInt(a + 1, 100);
            answer = b - a;
            question = `X + ${a} = ${b}`;
            break;
        }

        case 2: { // a - X = b
            const a = randomInt(20, 100);
            const b = randomInt(1, a - 1);
            answer = a - b;
            question = `${a} − X = ${b}`;
            break;
        }

        case 3: { // a × X = b
            const a = randomInt(2, 12);
            const x = randomInt(1, 15);
            const b = a * x;
            answer = x;
            question = `${a} × X = ${b}`;
            break;
        }

        case 4: { // X ÷ a = b
            const a = randomInt(2, 10);
            const b = randomInt(2, 15);
            answer = a * b;
            question = `X ÷ ${a} = ${b}`;
            break;
        }
    }

    return { question, answer };
}

function generatePEMDASQuestion(level) {
    const type = randomInt(1, 4);
    let question, answer;

    switch (type) {
        case 1: { // a × (b + c)
            const a = randomInt(2, 8);
            const b = randomInt(2, 10);
            const c = randomInt(2, 10);
            answer = a * (b + c);
            question = `${a} × (${b} + ${c}) = ?`;
            break;
        }

        case 2: { // (a + b) × c - d
            const a = randomInt(2, 8);
            const b = randomInt(2, 8);
            const c = randomInt(2, 6);
            const d = randomInt(1, 10);
            answer = (a + b) * c - d;
            question = `(${a} + ${b}) × ${c} − ${d} = ?`;
            break;
        }

        case 3: { // a × (b + c) - d ÷ e
            const a = randomInt(2, 5);
            const b = randomInt(2, 8);
            const c = randomInt(2, 8);
            const e = randomInt(2, 5);
            const d = e * randomInt(1, 5); // Asegurar división exacta
            answer = a * (b + c) - d / e;
            question = `${a} × (${b} + ${c}) − ${d} ÷ ${e} = ?`;
            break;
        }

        case 4: { // (a - b) × (c + d)
            const a = randomInt(5, 15);
            const b = randomInt(1, a - 1);
            const c = randomInt(2, 8);
            const d = randomInt(2, 8);
            answer = (a - b) * (c + d);
            question = `(${a} − ${b}) × (${c} + ${d}) = ?`;
            break;
        }
    }

    return { question, answer };
}

// ==================== VERIFICACIÓN DE RESPUESTAS ====================

function checkAnswer() {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const userInput = DOM.answerInput.value.trim().replace(',', '.');
    const userAnswer = parseFloat(userInput);

    if (isNaN(userAnswer) || userInput === '') {
        showFeedback('Ingresa un número válido', 'incorrect');
        DOM.answerInput.classList.add('incorrect');
        setTimeout(() => {
            DOM.answerInput.classList.remove('incorrect');
        }, 500);
        return;
    }

    gameState.totalAttempts++;

    // Comparar respuestas (con tolerancia para decimales)
    const tolerance = gameState.level >= 4 ? 0.01 : 0.001;
    const isCorrect = Math.abs(userAnswer - gameState.currentAnswer) < tolerance;

    if (isCorrect) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
}

function handleCorrectAnswer() {
    gameState.correctAnswers++;
    gameState.currentStreak++;
    gameState.bestStreak = Math.max(gameState.bestStreak, gameState.currentStreak);

    // Actualizar UI
    updateScore();
    updateStreak();
    updateProgress();

    DOM.answerInput.classList.add('correct');

    // Mostrar feedback
    if (gameState.currentStreak >= 5) {
        showFeedback(`¡Excelente! Racha de ${gameState.currentStreak}`, 'correct');
    } else if (gameState.currentStreak >= 3) {
        showFeedback(`¡Muy bien! Racha de ${gameState.currentStreak}`, 'correct');
    } else {
        showFeedback('¡Correcto!', 'correct');
    }

    // Verificar si terminó el juego
    if (gameState.correctAnswers >= gameState.totalQuestions) {
        setTimeout(endGame, 800);
    } else {
        setTimeout(generateQuestion, 600);
    }
}

function handleIncorrectAnswer() {
    gameState.currentStreak = 0;

    // Actualizar UI
    updateStreak();
    DOM.answerInput.classList.add('incorrect');

    // Mostrar feedback con pista
    showFeedback('¡Incorrecto! Inténtalo de nuevo', 'incorrect');
    showHint();

    // Limpiar input después de un momento
    setTimeout(() => {
        DOM.answerInput.classList.remove('incorrect');
        DOM.answerInput.value = '';
        DOM.answerInput.focus();
    }, 500);
}

function showFeedback(message, type) {
    DOM.feedbackText.textContent = message;
    DOM.feedbackText.className = `feedback-text ${type}`;
}

function showHint() {
    // Generar una pista basada en la respuesta correcta
    const answer = gameState.currentAnswer;
    let hint = '';

    if (Number.isInteger(answer)) {
        if (answer > 0) {
            hint = `Pista: Es un número entre ${Math.max(0, answer - 10)} y ${answer + 10}`;
        } else {
            hint = `Pista: Es un número negativo`;
        }
    } else {
        const rounded = Math.round(answer);
        hint = `Pista: El resultado es aproximadamente ${rounded}`;
    }

    DOM.hintText.textContent = hint;
}

// ==================== ACTUALIZACIÓN DE UI ====================

function showScreen(screenName) {
    DOM.selectionScreen.classList.remove('active');
    DOM.gameScreen.classList.remove('active');
    DOM.resultsScreen.classList.remove('active');

    switch (screenName) {
        case 'selection':
            DOM.selectionScreen.classList.add('active');
            break;
        case 'game':
            DOM.gameScreen.classList.add('active');
            break;
        case 'results':
            DOM.resultsScreen.classList.add('active');
            break;
    }
}

function updateOperationIndicator() {
    let text;
    if (gameState.operation === 'tablas') {
        if (gameState.selectedTable === 'todas') {
            text = 'Tablas de Multiplicar - Todas';
        } else {
            text = `Tabla del ${gameState.selectedTable}`;
        }
    } else {
        text = `${OPERATION_NAMES[gameState.operation]} - Nivel ${gameState.level}`;
    }
    DOM.operationIndicator.textContent = text;
}

function updateScore() {
    DOM.score.textContent = `${gameState.correctAnswers} / ${gameState.totalQuestions}`;
}

function updateStreak() {
    DOM.streak.textContent = `🔥 ${gameState.currentStreak}`;
}

function updateProgress() {
    const progress = (gameState.correctAnswers / gameState.totalQuestions) * 100;
    DOM.progressBar.style.width = `${progress}%`;
}

function displayResults(isNewRecord) {
    const accuracy = gameState.totalAttempts > 0
        ? Math.round((gameState.correctAnswers / gameState.totalAttempts) * 100)
        : 0;

    const avgTimePerQuestion = gameState.correctAnswers > 0
        ? Math.round(gameState.elapsedSeconds / gameState.correctAnswers)
        : 0;

    // Título y emoji según rendimiento
    let title, emoji;
    if (accuracy >= 95) {
        title = '¡Perfecto!';
        emoji = '🏆';
    } else if (accuracy >= 80) {
        title = '¡Excelente!';
        emoji = '🌟';
    } else if (accuracy >= 60) {
        title = '¡Muy Bien!';
        emoji = '👏';
    } else {
        title = '¡Buen Intento!';
        emoji = '💪';
    }

    DOM.resultsTitle.textContent = title;
    DOM.resultsEmoji.textContent = emoji;
    DOM.finalScore.textContent = `${gameState.correctAnswers} / ${gameState.totalQuestions}`;
    DOM.totalTime.textContent = formatTime(gameState.elapsedSeconds);
    DOM.bestStreakDisplay.textContent = gameState.bestStreak;
    DOM.accuracy.textContent = `${accuracy}%`;
    DOM.totalAttempts.textContent = gameState.totalAttempts;
    DOM.avgTime.textContent = `${avgTimePerQuestion}s`;

    // Mostrar badge de récord si corresponde
    if (isNewRecord) {
        DOM.recordSection.classList.remove('hidden');
    } else {
        DOM.recordSection.classList.add('hidden');
    }
}

// ==================== TECLADO NUMÉRICO ====================

function handleNumpad(value) {
    if (!gameState.isPlaying || gameState.isPaused) return;

    switch (value) {
        case 'delete':
            DOM.answerInput.value = DOM.answerInput.value.slice(0, -1);
            break;
        case 'clear':
            DOM.answerInput.value = '';
            break;
        case 'enter':
            checkAnswer();
            break;
        default:
            DOM.answerInput.value += value;
    }

    DOM.answerInput.focus();
}

// ==================== RÉCORDS ====================

function loadRecords() {
    const records = localStorage.getItem('mathmaster_records');
    return records ? JSON.parse(records) : {};
}

function saveRecords(records) {
    localStorage.setItem('mathmaster_records', JSON.stringify(records));
}

function getRecordKey() {
    if (gameState.operation === 'tablas') {
        return `tablas_${gameState.selectedTable}_${gameState.totalQuestions}`;
    }
    return `${gameState.operation}_${gameState.level}_${gameState.totalQuestions}`;
}

function checkAndSaveRecord() {
    const recordKey = getRecordKey();
    const records = loadRecords();

    // Para este modo, el mejor récord es el menor tiempo
    const currentTime = gameState.elapsedSeconds;

    if (!records[recordKey] || currentTime < records[recordKey]) {
        records[recordKey] = currentTime;
        saveRecords(records);
        return true;
    }

    return false;
}

// ==================== UTILIDADES ====================

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNumber(min, max, decimals) {
    if (decimals === 0) {
        return randomInt(min, max);
    }

    const factor = Math.pow(10, decimals);
    const rawNumber = Math.random() * (max - min) + min;
    return Math.round(rawNumber * factor) / factor;
}

function roundToDecimals(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}

function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toLocaleString('es-ES');
    }
    return num.toLocaleString('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 3
    });
}

// ==================== GESTIÓN DE TEMAS ====================

/**
 * Inicializa el sistema de temas (claro/oscuro)
 * Carga la preferencia guardada o usa la preferencia del sistema
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('mathmaster_theme');

    // Verificar preferencia guardada o usar preferencia del sistema
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    // Event listener para el botón de cambio de tema
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('mathmaster_theme')) {
            setTheme(e.matches ? 'light' : 'dark');
        }
    });
}

/**
 * Cambia entre tema claro y oscuro
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('mathmaster_theme', newTheme);
}

/**
 * Aplica el tema especificado
 * @param {string} theme - 'light' o 'dark'
 */
function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

// ==================== INICIAR ====================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    init();
});
