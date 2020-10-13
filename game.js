let STARTERS = 12000; // there are 12,000 12 letter words to populate the 2d array
let NUM_LETTERS = 12; // 12 letters to start every game
let string = ""; // will hold the letters that will be displayed
let currentScore = 0;
let prevGuesses = new Array();
let startVal = 0; // when 0, startGame can be called, when 1, startGame can't be
let seconds = 31; // number of seconds to play the game
var timer;

var firebaseConfig = {
    apiKey: "AIzaSyCF4S06cLFRsQh2drfEvm05pnoyDripvcE",
    authDomain: "wordgame-7c3b8.firebaseapp.com",
    databaseURL: "https://wordgame-7c3b8.firebaseio.com",
    projectId: "wordgame-7c3b8",
    storageBucket: "wordgame-7c3b8.appspot.com",
    messagingSenderId: "505290030265",
    appId: "1:505290030265:web:018d52fca9ed6c1b91af68"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let myDatabase = firebase.database();

var $ = function( id ) { return document.getElementById( id ); };

let startGame = function(){
  if(startVal == 0){
    $("guess").disabled = false;
    loadletters();
    seconds = 31;
    timer = setInterval(setUpTimer, 1000);
    startVal = 1;
  }
}

let endGame = function(){
  $('words').innerHTML = "";
  $('letters').innerHTML = "";
  $('score').innerHTML = "Score:  0";
  $('guess').value = "";
  $("over").innerHTML = "";
  string = "";
  prevGuesses = [];
  currentScore = 0;
  startVal = 0;
  seconds = 31;
  clearInterval(timer);
}

let loadletters = function(){
  let randomIndex = parseInt(Math.floor(Math.random() * STARTERS));
  myDatabase.ref("starters").child("alphabetized").child(randomIndex).once('value').then(snapshot =>
  {
      let letters = snapshot.val();
      string = letters;
      console.log(letters);

      for(var i = 0; i < letters.length; i++){
        $('letters').innerHTML += letters[i] + "       ";
        if(i == 3 || i == 7)
          $('letters').innerHTML += "<br>";
      }
  });
}

$('submit').addEventListener("click", function()
{
  let guess = $('guess').value;
  console.log(guess);
  checkGuess(guess);
});

$("start").addEventListener("click", function()
{
  startGame();
});

$("reset").addEventListener("click", function(){
  endGame();
});

function checkGuess(guess){
  let tmp = string        // used to determine if > # of correct letters are used
  for(var i = 0; i < guess.length; i++){
    let ch = guess[i];
    if(tmp.includes(ch)){
      tmp = tmp.replace(ch, "");
      console.log(tmp);
      continue;
    } else {
      alert("Invalid.  Please use only the letters on the board");
      return false;
      break;
    }
  }
  let firstChar = guess[0];
  myDatabase.ref("dictionary").child(firstChar).child(guess).once('value', ss=>{
    if(ss.exists() && !prevGuesses.includes(guess)){
      currentScore += guess.length;
      prevGuesses.push(guess);
      $('words').innerHTML += "-  " + guess + "<br>";
      $('score').innerHTML = "Score:  " + currentScore;
      return true;
    } else if(prevGuesses.includes(guess)) {
      alert("Word already found!");
    } else {
      alert("Not a word!");
      return false;
    }
  })
}

let setUpTimer = function(){
  if(seconds != 0){
    seconds--;
    $("time").innerHTML = "Time: " + seconds;
  }else {
    $("over").innerHTML = "GAME OVER" + "<br>" + "Final Score: " + currentScore;
    $("guess").disabled = true;
  }
  console.log(seconds);
}
