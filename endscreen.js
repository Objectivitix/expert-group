
document.addEventListener('DOMContentLoaded', () => {
    const gameStats = JSON.parse(localStorage.getItem('gameStats'));

    if (gameStats) {
        document.querySelector('.percentage').textContent = `${gameStats.perfectNotes} Perfect Notes`;
        document.querySelector('.accuracy').textContent = `${gameStats.goodNotes} Good Notes, ${gameStats.offbeatNotes} Offbeat Notes`;
    }
});