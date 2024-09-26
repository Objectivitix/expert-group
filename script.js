let countdown = 3;

var ishold = {
  a: false,
  s: false,
  d: false,
  f: false
};

var hits = {
  good: 0,
  well: 0,
  miss: 0
};

var isPlaying = false;
var speed = 0;
var FPS = 0;
var track;

let score = JSON.parse(localStorage.getItem('score')) || {};

let noteElement;


function generate(orbital, test, boolean, level) {
  if (level === 1) {
      FPS = 30;
  } else if (level === 2) {
      FPS = 60;
  }

  while (boolean) {
     
      let randomPosition = Math.random() * (orbital - 0) + 0;

     
      console.log(`Generated note at position: ${randomPosition}`);

      boolean = false;
  }
}

var initializeNotes = function (song) {
  let trackContainer = document.getElementById('track-container');
  var noteElement;
  var trackElement;

  while (trackContainer.hasChildNodes()) {
      trackContainer.removeChild(trackContainer.lastChild);
  }

  song.sheet.forEach(function (key, index) {
      trackElement = document.createElement('div');
      trackElement.classList.add('track');

      key.notes.forEach(function (note) {
          noteElement = document.createElement('div');
          noteElement.classList.add('note');
          noteElement.classList.add('note--' + index);

          noteElement.style.top = '-50px';

          trackElement.appendChild(noteElement);
      });

      trackContainer.appendChild(trackElement);
  });

  tracks = document.querySelectorAll('.track');
};

var movingNotes = function () {
 
  tracks.forEach(function (track) {
      let notes = track.querySelectorAll('.note');
      
      notes.forEach(function (note) {
          let topPosition = parseFloat(window.getComputedStyle(note).getPropertyValue('top'));
          
         
          if (topPosition < window.innerHeight) {
             
              note.style.top = `${topPosition + speed}px`;
          } else {
            
              hits.miss++;
              note.remove();
          }
      });
  });

  requestAnimationFrame(movingNotes);
};



function startGame(song, gameSpeed) {
  isPlaying = true;
  speed = gameSpeed;


  initializeNotes(song);
  movingNotes();
}


const song = {
  sheet: [
      { notes: [{}, {}, {}] },  
      { notes: [{}, {}] },      
      { notes: [{}] },       
      { notes: [{}, {}, {}] }  
  ]
};


startGame(song, 2);  

function startCountdown() {
  const interval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
          countdownElement.textContent = countdown;
      } else if (countdown === 0) {
          countdownElement.textContent = 'Start!';
          setTimeout(() => {
              countdownElement.style.display = 'none';
              startFallingBoxes();
          }, 2000);
      } else {
          clearInterval(interval);
      }
  }, 1500);
}

