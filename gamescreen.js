const countdownElement = document.getElementById('countdown');
const gameContainer = document.getElementById('game-container');
const intervalMin = 500;
const intervalMax = 2000; 
let countdown = 3;

function startCountdown() {
    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownElement.textContent = countdown;
        } else if (countdown === 0) {
            countdownElement.textContent = 'Start!';
            setTimeout(() => {
                countdownElement.style.display = 'none';
                startFallingBoxes();
            }, 2000);
        } else {
            clearInterval(interval);
        }
    }, 1500);
}

function startFallingBoxes() {
    
    generateFallingBox();
}

function generateFallingBox() {
    const newBox = document.createElement('div');
    newBox.classList.add('falling-box');
    
    const randomX = Math.random() * (gameContainer.offsetWidth - 50); 
    newBox.style.left = `${randomX}px`;
    
    gameContainer.appendChild(newBox);
    
    newBox.style.animation = 'fall 2s linear forwards';

    const randomInterval = Math.random() * (intervalMax - intervalMin) + intervalMin;
    setTimeout(generateFallingBox, randomInterval);
}

startCountdown();
