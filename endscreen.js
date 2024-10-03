document.addEventListener('DOMContentLoaded', () => {
    const gameStats = JSON.parse(localStorage.getItem('gameStats'));
    const songIndex = new URLSearchParams(window.location.search).get("songIndex");

    if (gameStats) {
        document.querySelector('.percentage').textContent = `${gameStats.perfectNotes} Perfect Notes`;
        document.querySelector('.accuracy').textContent = `${gameStats.goodNotes} Good Notes, ${gameStats.offbeatNotes} Offbeat Notes`;
    }

    // Add replay functionality
    document.getElementById('replay-button').addEventListener('click', () => {
        // Clear game stats from local storage
        localStorage.removeItem('gameStats');

        // Redirect to the game start screen or directly to the game
        window.location.href = `gamescreen.html?songIndex=${songIndex}`;
    });
});
