var ishold = {
    a: false,
    s: false,
    d: false,
    f: false
}

var hits = {
    good: 0,
    well: 0,
    miss: 0
}

var isPlaying = false;
var speed = 0;
var FPS = 0;
var track;

let score = JSON.parse(localStorage.getItem('score')) || {};

noteElement = 

function generate(orbital,test,boolean,level){
//note is the object
let FPS;
if(level === 1){
    FPS = 30;
}
else if(level === 2){
    FPS = 60;
}
while(boolean){
    
    Math.random()*(orbital - 0)+0;
        //0 is the left and orbital is right
    
}

    
}

var initializeNotes = function () {
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
        trackElement.appendChild(noteElement);
      });
  
     
      trackContainer.appendChild(trackElement);
      tracks = document.querySelectorAll('.track');
    });
  };

  var movingNotes = function(){

  }
