document.addEventListener('DOMContentLoaded', () => {
    const gameCanvas = document.getElementById('gameCanvas');
    const patternCanvas = document.getElementById('patternCanvas');
    const gameCtx = gameCanvas.getContext('2d');
    const patternCtx = patternCanvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const completeButton = document.getElementById('completeButton');
    const message = document.getElementById('message');
    const roundCounter = document.getElementById('roundCounter');
    const scoreCounter = document.getElementById('scoreCounter');

    const points = [
        { x: 50, y: 50 }, { x: 150, y: 50 }, { x: 250, y: 50 },
        { x: 50, y: 150 }, { x: 150, y: 150 }, { x: 250, y: 150 },
        { x: 50, y: 250 }, { x: 150, y: 250 }, { x: 250, y: 250 }
    ];
    
    const patterns = [
        [0, 1, 2, 4, 6, 7, 8, 5, 3], 
        [0, 1, 4, 3, 6],
        [1, 2, 5, 8, 7, 4], 
        [0, 1, 2, 5, 8, 7, 6], 
        [0, 3, 6, 7, 8, 5, 2]
    ];

    let currentRound = 0;
    let userInput = [];
    let currentPattern = [];
    let score = 0;

    function drawGrid(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "white"; 
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawPattern(ctx, pattern, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        pattern.forEach((index, i) => {
            if (i === 0) {
                ctx.moveTo(points[index].x, points[index].y);
            } else {
                ctx.lineTo(points[index].x, points[index].y);
            }
        });
        ctx.stroke();
    }

    function startGame() {
        currentRound = 0;
        score = 0;
        roundCounter.textContent = currentRound + 1;
        scoreCounter.textContent = score;
        nextRound();
    }

    function nextRound() {
        if (currentRound < patterns.length) {
            userInput = [];
            currentPattern = patterns[currentRound];
            drawGrid(gameCtx);
            drawGrid(patternCtx);
            drawPattern(patternCtx, currentPattern, 'red'); 
            message.textContent = `Round ${currentRound + 1}: Draw the pattern!`;
            completeButton.style.display = "block"; 
        } else {
            message.textContent = 'Game Over! You completed all rounds.';
            completeButton.style.display = "none"; 
        }
    }

    function validateInput() {
        if (userInput.length !== currentPattern.length) {
            message.textContent = 'Pattern not matched! Try again.';
        } else if (userInput.every((val, index) => val === currentPattern[index])) {
            message.textContent = 'Pattern matched! Good job!';
            score++;
            scoreCounter.textContent = score;
        } else {
            message.textContent = 'Pattern not matched! Try again.';
        }

        setTimeout(() => {
            clearGameCanvas();
            currentRound++;
            roundCounter.textContent = currentRound + 1;
            nextRound();
        }, 2000);
    }

    function clearGameCanvas() {
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawGrid(gameCtx);
    }

    gameCanvas.addEventListener('mousedown', (e) => {
        const rect = gameCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedPointIndex = points.findIndex(point => 
            Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2) < 10
        );

        if (clickedPointIndex !== -1 && !userInput.includes(clickedPointIndex)) {
            userInput.push(clickedPointIndex);
            drawUserInput();
        }
    });

    gameCanvas.addEventListener('mousemove', (e) => {
        if (userInput.length > 0) {
            const rect = gameCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const hoveredPointIndex = points.findIndex(point => 
                Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2) < 10
            );

            if (hoveredPointIndex !== -1 && !userInput.includes(hoveredPointIndex)) {
                userInput.push(hoveredPointIndex);
                drawUserInput();
            }
        }
    });

    function drawUserInput() {
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawGrid(gameCtx);
        drawPattern(gameCtx, userInput, 'blue');
        drawPattern(patternCtx, currentPattern, 'red'); 
    }

    startButton.addEventListener('click', startGame);
    completeButton.addEventListener('click', validateInput);

    drawGrid(gameCtx);
    drawGrid(patternCtx); 
});