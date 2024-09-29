// Get DOM elements
const countdownElement = document.getElementById('countdown');
const gameContainer = document.getElementById('game-container');
const trackContainer = document.getElementById('track-container');
const lane = document.querySelector('.lane');
const logContainer = document.getElementById('log-container'); // Get the log container
perfectStreak = 0;

// Constants for countdown and note intervals
const intervalMin = 500;
const intervalMax = 2000; 
let countdown = 3;

// Note queues for each lane
const noteQueues = [[], [], [], []];

// Utility function to log messages to the right-side log container
function logMessage(message) {
    // Clear any previous log message
    logContainer.innerHTML = '';

    // Create new log message
    const logEntry = document.createElement('div');
    logEntry.textContent = message;

    // Add a class for styling the log entry
    logEntry.classList.add('log-entry');

    logContainer.appendChild(logEntry);
}


// Start countdown for game
function startCountdown() {
    const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownElement.textContent = countdown;
        } else if (countdown === 0) {
            countdownElement.textContent = 'Start!';
            setTimeout(() => {
                countdownElement.style.display = 'none'; // Hide countdown
                startFallingBoxes();
            }, 1000);
        } else {
            clearInterval(interval); // Stop the countdown
        }
    }, 1000); // Update countdown every 1000 ms
}

// Start generating and handling falling boxes
function startFallingBoxes() {
    generateFallingBox(); // Generate first falling box
    document.addEventListener('keydown', (e) => {
        const laneIndex = {'d': 0, 'f': 1, 'j': 2, 'k': 3}[e.key]; // Map key presses to lanes

        if (laneIndex !== undefined && noteQueues[laneIndex].length > 0) {
            const note = noteQueues[laneIndex].shift(); // Get the note from the corresponding queue
            const timeElapsed = Date.now() - note.startTime; // Calculate time since note started
            note.remove(); // Remove the note from the DOM

            // Determine note accuracy
            if (Math.abs(timeElapsed - 2590) < 100) {
                logContainer.style.color = 'gold';
                perfectStreak ++;
                if (perfectStreak > 1){
                    logMessage("Perfect note\nx" + perfectStreak);
                }
                else{
                    logMessage("Perfect note");
                }
            } else if (Math.abs(timeElapsed - 2590) < 250) {
                logContainer.style.color = 'green';
                logMessage("Good note");
                perfectStreak = 0;
            } else {
                logMessage("Offbeat note");
                logContainer.style.color = 'purple';
                perfectStreak = 0;

            }
        }
    });
}

// Generate falling boxes (notes) in random lanes
function generateFallingBox() {
    const newNote = document.createElement('div');
    newNote.classList.add('falling-box');

    const randomLane = Math.floor(Math.random() * 4); // Select a random lane
    newNote.style.left = `${randomLane * (lane.offsetWidth + 20) + lane.offsetWidth / 2}px`; // Position note

    trackContainer.appendChild(newNote); // Add note to the DOM

    noteQueues[randomLane].push(newNote); // Add note to its queue

    newNote.style.animation = 'fall 3s linear forwards'; // Set animation -- 3s to reach bottom
    newNote.startTime = Date.now(); // Record start time

    // Remove note if it falls without being hit
    setTimeout(() => {
        if (!document.body.contains(newNote)) return; // If note has already been removed, return
        newNote.remove();
        noteQueues[randomLane].shift(); // Remove from the queue
        logContainer.style.color = 'red';
        logMessage("Missed note");
        perfectStreak = 0;
    }, 3000);

    // Schedule next note generation
    const randomInterval = Math.random() * (intervalMax - intervalMin) + intervalMin;
    setTimeout(generateFallingBox, randomInterval);
}

// Start the countdown to initiate the game
startCountdown();
