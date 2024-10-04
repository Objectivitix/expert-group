document.addEventListener('DOMContentLoaded', () => {
    // Retrieve game stats from localStorage
    const storedStats = localStorage.getItem('gameStats');
    const gameStats = storedStats ? JSON.parse(storedStats) : null;
    const songIndex = new URLSearchParams(window.location.search).get("songIndex");

    // Display the game stats on the end screen
    if (gameStats) {
       
        document.getElementById('accuracy').textContent = `Accuracy: ${gameStats.accuracy}%`;
        document.getElementById('score').textContent = `Score: ${gameStats.score}`;
    } else {
        console.error('No game statistics found in localStorage');
    }


    // Restart game
    document.getElementById('restartGameBtn').addEventListener('click', () => {window.location.href =  `gamescreen.html?songIndex=${songIndex}`;});


    // Go back to main menu
    document.getElementById('mainMenuBtn').addEventListener('click', () => {window.location.href =  `startscreen.html`;});


    // Save score
    document.getElementById('saveScoreBtn').addEventListener('click', () => {
        const username = prompt("Enter your username:");


        if (!username) {
            alert("Please enter Sky.");
            return;
        }


        const gameStats = JSON.parse(localStorage.getItem('gameStats'));
        if (gameStats) {
            fetch('http://127.0.0.1:5000/save_score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    score: gameStats.score,
                    accuracy: gameStats.accuracy
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            alert('No game statistics found in localStorage');
        }


    });


    // Check leaderboard
    document.getElementById('leaderboardBtn').addEventListener('click', () => {
        // Make a GET request to retrieve the leaderboard
        fetch('http://127.0.0.1:5000/leaderboard')
            .then(response => response.json())
            .then(data => {
                const leaderboardList = document.getElementById('leaderboardList'); // Assuming you have an HTML element with this ID
                leaderboardList.innerHTML = '';  // Clear the list first
   
                // Loop through each leaderboard entry and display it
                data.forEach((entry, index) => {
                    const li = document.createElement('li');
                    li.textContent = `${index + 1}: ${entry.username} - Score: ${entry.score}, Accuracy: ${entry.accuracy}%`;

                    leaderboardList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
            });
    });
   










})
