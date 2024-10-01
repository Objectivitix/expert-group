// Get DOM elements
const countdownElement = document.getElementById('countdown');
const gameContainer = document.getElementById('game-container');
const trackContainer = document.getElementById('track-container');
const lanes = document.querySelectorAll('.lane');
const logContainer = document.getElementById('log-container');
const gameMusic = document.getElementById('gameMusic');
let countdown = 3;
let perfectStreak = 0;

// Constants for note intervals
const intervalMin = 500;
const intervalMax = 2000;

// Note queues for each lane
const noteQueues = [[], [], [], []];

// Utility function to log messages to the right-side log container
function logMessage(message, color = 'black') {
    logContainer.innerHTML = ''; // Clear previous log
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logEntry.classList.add('log-entry');
    logEntry.style.color = color; // Set log text color
    logContainer.appendChild(logEntry);
}

// Start countdown for the game
function startCountdown() {
    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownElement.textContent = countdown;
        } else if (countdown === 0) {
            countdownElement.textContent = 'Start!';
            setTimeout(() => {
                countdownElement.style.display = 'none'; // Hide countdown
                gameMusic.play();
                fetchBeatInfoAndStart(); // Start the game based on beat info
            });
        } else {
            clearInterval(interval); // Stop the countdown
        }
    }); // Update countdown every 1000 ms
}

// Generate falling boxes (notes) in random lanes
function generateFallingBox(laneIndex) {
    const fallingBox = document.createElement('div');
    fallingBox.classList.add('falling-box');
    fallingBox.style.top = '0px';
    lanes[laneIndex].appendChild(fallingBox);
    noteQueues[laneIndex].push(fallingBox);
    fallingBox.startTime = Date.now(); // Record the note's start time
}

// Update positions of falling boxes
function updateFallingBoxes() {
    noteQueues.forEach((queue, laneIndex) => {
        queue.forEach((box, boxIndex) => {
            const topPosition = parseInt(box.style.top);
            box.style.top = `${topPosition + 5}px`; // Move the box down
            if (topPosition > window.innerHeight) { // Remove if it reaches bottom
                box.remove();
                noteQueues[laneIndex].splice(boxIndex, 1);
                logMessage("Missed note", 'red'); // Log missed note
                perfectStreak = 0;
            }
        });
    });
}

// Handle key press events for hitting notes
document.addEventListener('keydown', (e) => {
    const laneIndex = {'d': 0, 'f': 1, 'j': 2, 'k': 3}[e.key]; // Map keys to lanes
    if (laneIndex !== undefined && noteQueues[laneIndex].length > 0) {
        const note = noteQueues[laneIndex].shift(); // Get the note from the queue
        const timeElapsed = Date.now() - note.startTime; // Calculate time since note started
        note.remove(); // Remove the note from the DOM

        // Determine note accuracy
        if (Math.abs(timeElapsed - 2590) < 100) {
            logMessage(`Perfect note x${++perfectStreak}`, 'gold');
        } else if (Math.abs(timeElapsed - 2590) < 250) {
            logMessage('Good note', 'green');
            perfectStreak = 0;
        } else {
            logMessage('Offbeat note', 'purple');
            perfectStreak = 0;
        }
    }
});

// Fetch beat info from the server and start generating notes
function fetchBeatInfoAndStart() {
    fetch('http://127.0.0.1:5000/beat-info')
    .then(response => response.json())
    .then(data => {
        const beatTimes = data.beat_times;
        if (beatTimes && beatTimes.length) {
            beatTimes.forEach((beatTime) => {
                const delay = beatTime * 1000;
                setTimeout(() => {
                    const laneIndex = Math.floor(Math.random() * 4);
                    generateFallingBox(laneIndex);
                }, delay);
            });
        } else {
            console.error('No beat times received');
        }
    })
    .catch(error => console.error('Error fetching beat info:', error));

    // Continuously update the positions of falling boxes
    setInterval(updateFallingBoxes, 50);
}

document.addEventListener('DOMContentLoaded', () => {
    const countdownElement = document.getElementById('countdown');
    const gameMusic = document.getElementById('gameMusic');

    // Now it's safe to use gameMusic
    if (gameMusic) {
        startCountdown(); // Your game logic
    } else {
        console.error('Audio element with id "gameMusic" not found');
    }
});




// Start the countdown and initiate the game
startCountdown();
