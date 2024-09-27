const countdownElement = document.getElementById('countdown');
const gameContainer = document.getElementById('game-container');
const trackContainer = document.getElementById('track-container');
const lane = document.querySelector('.lane');
const intervalMin = 500;
const intervalMax = 2000; 
let countdown = 3;

const noteQueues = [[], [], [], []];

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
            }, 1000);
        } else {
            clearInterval(interval);
        }
    }, 1000);
}

function startFallingBoxes() {
    generateFallingBox();
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd') {
            if (noteQueues[0].length === 0) {
                return;
            }
            const note = noteQueues[0].shift();
            const timeElapsed = Date.now() - note.startTime;
            note.remove();

            if (Math.abs(timeElapsed - 2590) < 100) {
                console.log("perfect note")
            } else if (Math.abs(timeElapsed - 2590) < 250) {
                console.log("good note")
            } else {
                console.log("offbeat note")
            }
        } else if (e.key === 'f') {
            if (noteQueues[1].length === 0) {
                return;
            }
            const note = noteQueues[1].shift();
            const timeElapsed = Date.now() - note.startTime;
            note.remove();

            if (Math.abs(timeElapsed - 2590) < 100) {
                console.log("perfect note")
            } else if (Math.abs(timeElapsed - 2590) < 250) {
                console.log("good note")
            } else {
                console.log("offbeat note")
            }
        } else if (e.key === 'j') {
            if (noteQueues[2].length === 0) {
                return;
            }
            const note = noteQueues[2].shift();
            const timeElapsed = Date.now() - note.startTime;
            note.remove();

            if (Math.abs(timeElapsed - 2590) < 100) {
                console.log("perfect note")
            } else if (Math.abs(timeElapsed - 2590) < 250) {
                console.log("good note")
            } else {
                console.log("offbeat note")
            }
        } else if (e.key === 'k') {
            if (noteQueues[3].length === 0) {
                return;
            }
            const note = noteQueues[3].shift();
            const timeElapsed = Date.now() - note.startTime;
            note.remove();

            if (Math.abs(timeElapsed - 2590) < 100) {
                console.log("perfect note")
            } else if (Math.abs(timeElapsed - 2590) < 250) {
                console.log("good note")
            } else {
                console.log("offbeat note")
            }
        }
    });
}

function generateFallingBox() {
    const newBox = document.createElement('div');
    newBox.classList.add('falling-box');

    const randomLane = Math.floor(Math.random() * 4);
    newBox.style.left = `${randomLane * (lane.offsetWidth + 20) + lane.offsetWidth / 2}px`
    // const randomX = Math.random() * (gameContainer.offsetWidth - 50); 
    // newBox.style.left = `${randomX}px`;

    trackContainer.appendChild(newBox);

    noteQueues[randomLane].push(newBox);

    newBox.style.animation = 'fall 3s linear forwards';
    newBox.startTime = Date.now();
    setTimeout(() => {
        if (!document.body.contains(newBox)) {
            return;
        }
        newBox.remove();
        noteQueues[randomLane].shift();
        console.log("missed note");
    }, 3000);

    const randomInterval = Math.random() * (intervalMax - intervalMin) + intervalMin;
    setTimeout(generateFallingBox, randomInterval);
}

startCountdown();
