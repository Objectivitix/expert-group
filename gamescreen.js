// Get DOM elements
const countdownElement = document.getElementById('countdown');
const gameContainer = document.getElementById('game-container');
const trackContainer = document.getElementById('track-container');
const lanes = document.querySelectorAll('.lane');
const logContainer = document.getElementById('log-container');
const gameMusic = document.getElementById('gameMusic');
let countdown = 3;
let perfectStreak = 0;
let updateInterval; // This will store the interval for updating falling boxes

 let gameStats={
        gold : 0,
        green : 0,
        purple : 0
        }
        
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
let noteCount = 0;
const maxNotes = 60; // Set the limit for maximum number of notes
function generateFallingBox(laneIndex, beatTime) {
    if (noteCount >= maxNotes) {
        stopGame();
        return; // Stop generating new notes
    }
    const fallingBox = document.createElement('div');
    fallingBox.classList.add('falling-box');
    
    // Set animation duration based on beat info if available
    const animationDuration = 2.59; // Adjust based on your beat timings (e.g., 2.59 seconds for a beat)
    fallingBox.style.animationDuration = `${animationDuration}s`;
    
    lanes[laneIndex].appendChild(fallingBox);
    noteQueues[laneIndex].push(fallingBox);
    
    // Remove the note once it has completed the animation
    fallingBox.addEventListener('animationend', () => {
 
        
        logMessage("Missed note", 'red'); // Log missed note
    });
    
    noteCount++; // Increment the note count
    fallingBox.startTime = beatTime;
}

function stopGame() {
    clearInterval(updateInterval); // Stop updating falling boxes
    gameMusic.pause(); // Pause the music
    gameMusic.currentTime = 0; // Reset the music to the beginning
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
    showEndScreen(); // Show the end screen
    
}
function showEndScreen() {
    window.location.href = "endscreen.html"; // Redirect to the end screen
}

function updateFallingBoxes() {
    const windowHeight = window.innerHeight; // Get the window height

    noteQueues.forEach((queue, laneIndex) => {
        queue.forEach((box, boxIndex) => {
            const topPosition = parseInt(box.style.top);
            box.style.top = `${topPosition + 5}px`; // Move the box down

            const laneHeight = lanes[laneIndex].offsetHeight; // Get the height of the lane

            // Check if the note has reached the bottom of the lane
            if (topPosition >= laneHeight - box.offsetHeight) {
                box.classList.add('fading-out'); // Apply fading effect
                setTimeout(() => {
                    box.remove(); // Remove the note from the DOM after fade-out
                    noteQueues[laneIndex].splice(boxIndex, 1); // Remove it from the queue
                }, 500); // Give it time to fade out
            }
        });
    });
}



// Handle key press events for hitting notes
document.addEventListener('keydown', (e) => {
    const laneIndex = {'d': 0, 'f': 1, 'j': 2, 'k': 3}[e.key]; // Map keys to lanes
    if (laneIndex !== undefined && noteQueues[laneIndex].length > 0) {
        const note = noteQueues[laneIndex][0]; // Get the first note from the queue
        const timeElapsed = Date.now() - note.startTime; // Calculate time since note started falling

        // Calculate note position
        const noteTopPosition = parseInt(note.style.top);
        const indicatorPosition = lanes[laneIndex].querySelector('.indicator').getBoundingClientRect().top;

        // Set timing and positional thresholds for hitting a note
        const hitWindow = 100;  // Milliseconds window for perfect hit
        const positionWindow = 50; // Pixels window for positioning accuracy

        // Determine note accuracy based on position and timing
        if (Math.abs(noteTopPosition - indicatorPosition) <= positionWindow && Math.abs(timeElapsed - 2590) <= hitWindow) {
            logMessage(`Perfect note x${++perfectStreak}`, 'gold');
            gameStats.gold++;

            // Remove the note from DOM and the queue
            note.remove(); // Remove the note from the DOM
            noteQueues[laneIndex].shift(); // Remove from queue
        } else if (Math.abs(noteTopPosition - indicatorPosition) <= positionWindow && Math.abs(timeElapsed - 2590) <= 2 * hitWindow) {
            logMessage('Good note', 'green');
            perfectStreak = 0;
            gameStats.purple++;

            // Remove the note from DOM and the queue
            note.remove(); // Remove the note from the DOM
            noteQueues[laneIndex].shift(); // Remove from queue
        } else {
            logMessage('Offbeat note', 'purple');
            perfectStreak = 0;
            gameStats.green++;

            // Remove the note from DOM and the queue
            note.remove(); // Remove the note from the DOM
            noteQueues[laneIndex].shift(); // Remove from queue
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
            const animationDuration = 2.59; // Duration of note fall animation in seconds

            // For each beat, calculate when to generate the note so it lands on the indicator at the right time
            beatTimes.forEach((beatTime, index) => {
                const timeToLand = beatTime - animationDuration; // Calculate when to start the note falling

                setTimeout(() => {
                    const laneIndex = Math.floor(Math.random() * 4); // Random lane
                    generateFallingBox(laneIndex, beatTime); // Generate a falling note
                }, timeToLand * 1000); // Convert to milliseconds for the delay
            });
        } else {
            console.error('No beat times received');
        }
    })
    .catch(error => console.error('Error fetching beat info:', error));

    // Start updating the falling boxes every 20ms (adjust the timing for smooth animation)
    updateInterval = setInterval(updateFallingBoxes, 20);
}



document.addEventListener('DOMContentLoaded', () => {
    const countdownElement = document.getElementById('countdown');
    const gameMusic = document.getElementById('gameMusic');

    // Now it's safe to use gameMusic
   
    if (gameMusic) {
        startCountdown(); // Your game logic
        startCountdown(); // Start the countdown
    } else {
        console.error('Audio element with id "gameMusic" not found');
    }
});




// Start the countdown and initiate the game
startCountdown();