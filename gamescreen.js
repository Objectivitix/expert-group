// Get DOM elements
const countdownElement = document.getElementById('countdown');
const gameContainer = document.getElementById('game-container');
const trackContainer = document.getElementById('track-container');
const lane = document.querySelector('.lane');

// Constants for countdown and note intervals
const intervalMin = 500;
const intervalMax = 2000; 
let countdown = 3;

// Note queues for each lane
const noteQueues = [[], [], [], []];

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
            // Stop the function from continuing to run
            // periodically once countdown is finished
            clearInterval(interval);
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

            // Determine note accuracy.
            // 2590 ms is obtained via trial and error
            // to be an okay approximation of how long
            // it takes for a note to get to the hit
            // indicator
            if (Math.abs(timeElapsed - 2590) < 100) {
                console.log("perfect note");
            } else if (Math.abs(timeElapsed - 2590) < 250) {
                console.log("good note");
            } else {
                console.log("offbeat note");
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
        console.log("missed note");
    }, 3000);

    // Schedule next note generation
    const randomInterval = Math.random() * (intervalMax - intervalMin) + intervalMin;
    setTimeout(generateFallingBox, randomInterval);
}

// Start the countdown to initiate the game
startCountdown();
