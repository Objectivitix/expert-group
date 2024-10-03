document.addEventListener('DOMContentLoaded', () => {
    // Retrieve game stats from localStorage
    const storedStats = localStorage.getItem('gameStats');
    const gameStats = storedStats ? JSON.parse(storedStats) : null;

    // Display the game stats on the end screen
    if (gameStats) {
        document.getElementById('goldScore').textContent = `Gold Notes: ${gameStats.gold}`;
        document.getElementById('greenScore').textContent = `Green Notes: ${gameStats.green}`;
        document.getElementById('purpleScore').textContent = `Purple Notes: ${gameStats.purple}`;
        document.getElementById('accuracy').textContent = `Accuracy: ${gameStats.accuracy}%`;
        document.getElementById('score').textContent = `Score: ${gameStats.score}`;
    }

    // Restart game 
    document.getElementById('restartGameBtn').addEventListener('click', () => {window.location.href = `gamescreen.html`;});

    // Go back to main menu
    document.getElementById('mainMenuBtn').addEventListener('click', () => {window.location.href = "index.html";});

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
                gold: gameStats.gold,
                green: gameStats.green,
                purple: gameStats.purple,
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
                    li.textContent = `#${index + 1}: ${entry.username} - Gold: ${entry.gold}, Green: ${entry.green}, Purple: ${entry.purple}, Accuracy: ${entry.accuracy}%`;
                    leaderboardList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
            });
    });
    


})