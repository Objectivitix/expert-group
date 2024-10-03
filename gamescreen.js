// Get DOM elements
const countdownElement = document.getElementById('countdown');
const gameContainer = document.getElementById('game-container');
const trackContainer = document.getElementById('track-container');
const lanes = document.querySelectorAll('.lane');
const logContainer = document.getElementById('log-container');
const gameMusic = document.getElementById('gameMusic');
let countdown = 3;
let perfectStreak = 0;
const maxNotes = 400;
numOfNotes = 0;

let updateInterval; // Declare the variable to store the interval ID

let gameStats = {
    score: 0,
    accuracy: 0,
    percentage: 0,
};

// TODO: explain what this is
const countdownMusicOffset = 2590;


// Constants for note intervals
const intervalMin = 500;
const intervalMax = 2000;

// Note queues for each lane
const noteQueues = [[], [], [], []]; 

// HUMAN-DESIGNED LEVELS -- Mapped using an array of beats,
// an array of corresponding notes (expressed as lanes on
// which they should drop), and a bpm which gets converted
// to milliseconds per beat later on. The offset attribute
// is manually adjusted so that game and song align.
// testingStartAtBeat does exactly what you expect it to.
const fingerdash = {
    beats: [
        0, 1, 2, 3,
        4, 5, 6, 7,
        8, 9, 10, 11,
        12, 13, 14, 15,
        16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5,
        20, 20.5, 21, 21.5, 22, 22.5, 23, 23.5,
        24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5,
        28, 28.5, 29, 29.5, 30, 30.25, 30.75, 31, 31.5,
        32, 33, 34, 35,
        36, 37, 38, 38.25, 38.5, 38.75, 39, 39.25, 39.5, 39.75,
        40, 41, 42, 43,
        44, 45, 46, 47,
        48, 49, 50, 51,
        52, 53, 54, 54.25, 54.5, 54.75, 55, 55.25, 55.5, 55.75,
        56, 57, 58, 59,
        60, 61, 62, 62.5, 63,
        // wo - ba kit - ve ke de
        64, 65.25, 65.5, 67, 67.25, 67.75,
        // ve - be anthem - ba
        68, 69.25, 69.75, 70.75, 71.75,  
        // dem bem pe - eh
        72.5, 73, 73.5, 74.5,
        // oe oe um um
        76, 76.5, 77.25, 77.75,
        // wo - ba kit - ve ke de
        80, 81.25, 81.5, 83, 83.25, 83.75,
        // ve - be anthem - ba
        84, 85.25, 85.75, 86.75, 87.75,
        // dem bem pe - eh
        88.5, 89, 89.5, 90.5,
        // oe oe um um - [pre]
        92, 92.5, 93.25, 93.75, 95,
        // [drop] - ...
        96, 96.5, 96.75, 97.5, 98, 98.25, 99,
        100, 100.5, 100.75, 101.5, 102.25, 102.5, 102.75, 103, 103.25, 103.5,
        104, 104.5, 104.75, 105.5, 106,
        108, 108.5, 108.75, 109.5, 110.25, 110.75, 111, 111.25,
        112, 112.75, 113.5, 114.25,
        116, 116.75, 117.5, 118.25, 119, 119.5,
        120, 120.75, 121.5, 122.25,
        124, 124.75, 125.5, 126.25,
        128, 128.75, 129.5, 130.25, 131, 131.5,
        132, 132.75, 133.5, 134.25, 135, 135.5,
        136, 136.5, 137, 137.5, 138, 138.5, 139, 139.5,
        140, 140.25, 140.5, 140.75, 141, 141.25, 141.5, 141.75, 142, 142.25, 142.5, 142.75,
        // aaaand we stop at big beat drop
        144, 144.5,
    ],
    whereTheyreDropping: [
        [0, 1], [1, 2], [2, 3], [1, 2],
        [0, 1], [1, 2], [2, 3], [1, 2],
        [0, 3], [1, 2], [0, 1], [2, 3],
        [0, 2], [1, 3], [1, 2], [0, 3],
        [0], [1], [0], [1], [3], [2], [3], [2],
        [1], [2], [0], [3], [0], [1], [2], [3],
        [0], [1], [0, 2, 3], [1], [0], [1], [0, 2, 3], [1],
        [0], [1], [0, 2, 3], [1], [0], [1], [2], [3], [3],
        [0, 1, 2, 3], [0], [2], [1],
        [3], [1], [0], [1], [2], [3], [0], [1], [2], [3],
        [0, 1], [2, 3], [2], [1],
        [0], [0, 1], [0], [2, 3],
        [1], [2], [0], [3],
        [2], [1], [3], [2], [1], [0], [3], [2], [1], [0],
        [1], [3], [2], [0],
        [0, 2], [1, 3], [2, 3], [0, 1], [0, 1],
        // wo - ba kit - ve ke de
        [1, 2, 3], [0], [1], [0], [3], [1],
        // ve - be anthem - ba
        [2], [2], [1], [3], [3],
        // dem bem pe - eh
        [0], [2], [1], [3],
        // oe oe um um
        [1], [0], [3], [2],
        // wo - ba kit - ve ke de
        [1, 2], [0, 3], [1, 2], [2], [0], [3],
        // ve - be anthem - ba
        [1], [3], [2], [1], [3],
        // dem bem pe - eh
        [0], [2], [1], [3],
        // oe oe um um - [pre]
        [1], [0], [3], [2], [0],
        // [drop] - ...
        [0, 3], [2], [1], [0], [3], [0], [2],
        [3], [1], [2], [1], [2], [1], [2], [1], [2], [1],
        [0], [3], [3], [0], [0],
        [0], [3], [3], [0], [3], [3], [2], [3],
        [0], [0], [3], [3],
        [2], [2], [1], [1], [0], [0],
        [1], [1], [2], [2],
        [1], [1], [3], [3],
        [0, 2], [0, 2], [1, 3], [1, 3], [2], [0],
        [0, 2], [0, 2], [1, 3], [1, 3], [0], [2],
        [0, 2], [1, 3], [0, 2], [1, 3], [0, 2], [1, 3], [0, 2], [1, 3],
        [0], [3], [1], [2], [0], [3], [1], [2], [0], [3], [1], [2],
        // aaaand we stop at big beat drop
        [0, 1, 2, 3], [2],
    ],
    bpm: 112, offset: 230, testingStartAtBeat: 0,
};

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
                setTimeout(() => gameMusic.play(), countdownMusicOffset); // Start the music after the countdown
                startWithPrebuiltLevel(fingerdash); // Start the game after music starts
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
function fetchBeatInfoAndStart() {
    fetch('http://127.0.0.1:5000/beat-info')
        .then(response => response.json())
        .then(data => {
            const beatTimes = data.beat_times;
            if (beatTimes && beatTimes.length) {
                whereTheyreDropping = [];

                for (let i = 0; i < beatTimes.length; i++) {
                    whereTheyreDropping.push([Math.floor(Math.random() * 4)]);
                }
    
                scheduleFallingBoxes(beatTimes, whereTheyreDropping);
            } else {
                console.error('No beat times received');
            }
        })
        .catch(error => console.error('Error fetching beat info:', error));
}


function startWithPrebuiltLevel(level) {
    const msPerBeat = 60000 / level.bpm;

    const testingStartIndex = level.beats.indexOf(level.testingStartAtBeat);
    level.beats = level.beats.slice(testingStartIndex).map(beat => beat - level.testingStartAtBeat);
    level.whereTheyreDropping = level.whereTheyreDropping.slice(testingStartIndex);

    gameMusic.currentTime = level.testingStartAtBeat * 60 / level.bpm;

    scheduleFallingBoxes(level.beats.map(beat => beat * msPerBeat + level.offset), level.whereTheyreDropping);
}

function scheduleFallingBoxes(beatTimes, whereTheyreDropping) {
    zip(beatTimes, whereTheyreDropping).forEach(([beatTime, laneIndices]) => {
        laneIndices.forEach(laneIndex => {
            setTimeout(() => {
                generateFallingBox(laneIndex);
            }, beatTime);
        });
    });

    // Continuously update the positions of falling boxes
    // (Also store the interval ID in updateInterval)
    updateInterval = setInterval(updateFallingBoxes, 10);
}

// Convenience function for "zipping" up arrays.
// Usage example: zip([[0, 1, 2], [3, 4, 5]]) becomes [[0, 3], [1, 4], [2, 5]].
// Very practical for when you want to iterate arrays IN PARALLEL.
function zip(...rows) {
    return rows[0].map((_, i) => rows.map(row => row[i]))
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

