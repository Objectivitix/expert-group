// Get DOM elements
const countdownElement = document.getElementById('countdown');
const gameContainer = document.getElementById('game-container');
const trackContainer = document.getElementById('track-container');
const lanes = document.querySelectorAll('.lane');
const logContainer = document.getElementById('log-container');
const gameMusic = document.getElementById('gameMusic');
let countdown = 3;
let perfectStreak = 0;
const maxNotes = 164;
numOfNotes = 0;

let updateInterval; // Declare the variable to store the interval ID

let gameStats = {
    score: 0,
    accuracy: 0,
    percentage: 0,
};


// Constants for note intervals
const intervalMin = 500;
const intervalMax = 2000;

// Note queues for each lane
const noteQueues = [[], [], [], []];    

let newIndicatorPx = calculateIndicatorPx(); // Initialize based on current height

// Utility function to log messages to the right-side log container
function logMessage(message, color = 'black') {
    logContainer.innerHTML = ''; // Clear previous log
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logEntry.classList.add('log-entry');
    logEntry.style.color = color; // Set log text color
    logContainer.appendChild(logEntry);
}

// Function to calculate the new margin-bottom for indicators
function calculateIndicatorPx() {
    return gameContainer.offsetHeight * 75 / 945 - 1;
}

// Function to update indicators' margin-bottom
function updateIndicatorMargins() {
    newIndicatorPx = calculateIndicatorPx(); // Recalculate newIndicatorPx
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach(indicator => {
        indicator.style.marginBottom = `${newIndicatorPx}px`;
    });
}

function startCountdown() {
    countdownElement.textContent = countdown; // Set initial value of countdown

    const interval = setInterval(() => {
        countdown--; // Decrease countdown value
        
        if (countdown > 0) {
            countdownElement.textContent = countdown;
        } else if (countdown === 0) {
            countdownElement.textContent = 'Start!'; // Display "Start!" at 0
            setTimeout(() => {
                countdownElement.style.display = 'none'; // Hide countdown after 1 second
                gameMusic.play(); // Start the music after the countdown
                fetchBeatInfoAndStart(); // Start the game after music starts
            }, 1000); // Wait 1 second before hiding countdown and starting music
        } else {
            clearInterval(interval); // Stop the countdown after it reaches 0
        }
    }, 1000); // Update countdown every 1000 ms
}

function generateFallingBox(laneIndex) {
    if (numOfNotes >= maxNotes){
        stopGame();
    }
    const fallingBox = document.createElement('div');
    fallingBox.classList.add('falling-box');
    lanes[laneIndex].appendChild(fallingBox);
    noteQueues[laneIndex].push(fallingBox);

    // Store the start time when the note is created
    fallingBox.startTime = Date.now();

    // After 3 seconds (duration of the fall), remove the note from the DOM
    setTimeout(() => {
        if (fallingBox.parentNode) {
            fallingBox.remove();
            noteQueues[laneIndex].shift(); // Remove it from the note queue
            logMessage("Missed note", 'red'); // Log missed note
            perfectStreak = 0;
        }
    }, 3000); // Matches the 3-second animation duration
    console.log(numOfNotes);
    numOfNotes ++ ;
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
            gameStats.score += 100; // Update score for perfect hit
        } else if (Math.abs(timeElapsed - 2590) < 250) {
            logMessage('Good note', 'green');
            gameStats.score += 50; // Update score for good hit
            perfectStreak = 0;
        } else {
            logMessage('Offbeat note', 'purple');
            perfectStreak = 0;
        }

        // Optionally update accuracy and percentage
        gameStats.accuracy = (perfectStreak / numOfNotes) * 100; // Example accuracy calculation
        gameStats.percentage = (gameStats.score / (numOfNotes * 100)) * 100; // Example percentage calculation
    }
});

// Fetch beat info from the server and start generating notes
// Fetch beat info from the server and start generating notes
function fetchBeatInfoAndStart() {
    fetch('http://127.0.0.1:5000/beat-info')
        .then(response => response.json())
        .then(data => {
            const beatTimes = data.beat_times;
            if (beatTimes && beatTimes.length) {
                beatTimes.forEach((beatTime) => {
                    const delay = (beatTime * 1000) - 2500;
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

    // Start the interval and assign it to updateInterval
    updateInterval = setInterval(updateFallingBoxes, 50); // Store the interval ID
}

document.addEventListener('DOMContentLoaded', () => {
    const countdownElement = document.getElementById('countdown');
    const gameMusic = document.getElementById('gameMusic');

    // Now it's safe to use gameMusic
    if (gameMusic) {
        startCountdown(); // Your game logic

        // resizeObserver for if screen res changes
        const resizeObserver = new ResizeObserver(() => {
            updateIndicatorMargins();
        });
        resizeObserver.observe(gameContainer);
    } else {
        console.error('Audio element with id "gameMusic" not found');
    }
});

function stopGame() {
    clearInterval(updateInterval); // Stop updating falling boxes
    gameMusic.pause(); // Pause the music
    gameMusic.currentTime = 0; // Reset the music to the beginning

    // Store game statistics in localStorage
    localStorage.setItem('gameStats', JSON.stringify(gameStats));

    // Redirect to the end screen immediately
    window.location.href = "endscreen.html"; // Redirect to the end screen
}

