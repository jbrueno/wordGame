let STARTERS = 12000; // there are 12,000 12 letter words to populate the 2d array
let NUM_LETTERS = 12; // 12 letters to start every game
let string = ""; // will hold the letters that will be displayed
let currentScore = 0;
let prevGuesses = new Array();
//let seconds = 31; //all timer funcionality is commented out, could not sync it for all users
//var timer;  
var chars; 
let clicked = 0;

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
myDatabase.ref("ending").set(2);

var $ = function( id ) { return document.getElementById( id ); };

let loadLetters = function(){
  let randomIndex = parseInt(Math.floor(Math.random() * STARTERS));
  myDatabase.ref("starters").child("alphabetized").child(randomIndex).on('value', snapshot =>
  {
      let letters = snapshot.val();
      myDatabase.ref("currentLetter").set(letters);
      string = letters;
      console.log(letters);
  });
}

let showLetters = function(){
  myDatabase.ref("currentLetter").on("value", ss=>{
    let chars = ss.val();
    if($('avail').innerHTML == ""){
      $('avail').innerHTML += "Available Letters";
    }
    if($('letters').innerHTML == ""){
      for(var i = 0; i < chars.length; i++){
        $('letters').innerHTML += chars[i] + "          ";
        if(i == 3 || i == 7)
          $('letters').innerHTML += '<br>';
      }
    }
  });
}

$('info').addEventListener("click", function(){
  if(clicked %2 == 0){
    $('info').innerHTML = "When the game starts, you will see 12 random letters appear.  " + "<br>" + "Using these letters, try make as many words as possible.  " + "<br>" + "You will be playing along with anyone else on the site to try and get the highest possible score together."
  }
});

$('submit').addEventListener("click", function()
{
  let guess = $('guess').value;
  console.log(guess);
  checkGuess(guess);
});

$('guess').addEventListener('keypress', function(e){
  if(e.key == 'Enter'){
    let guess = $('guess').value;
    console.log(guess);
  }
});

myDatabase.ref("ending").on('value', snap=>{
  let val = snap.val();
  if(val == 1){
    showFinal();
    currentScore = 0;
    $("reset").disabled = true;
  }else{
    $("over").innerHTML = "";
    $("reset").disabled = false;
  }
});

let showFinal = function(){
  $("over").innerHTML = "GAME OVER" + "<br>" + "Final Score: " + currentScore;
}


myDatabase.ref("starting").on('value', ss4=>{
  let val = ss4.val();
  if(val == 1){
    $('start').disabled = true;
    $("submit").disabled = false;
    //loadLetters();
    showLetters();
    showGuesses();
    $("over").innerHTML = "";
    $('letters').innerHTML = string;  
  } else {
    $('start').disabled = false;
    $("submit").disabled = true;
    myDatabase.ref("currentLetter").set("");
    $('words').innerHTML = "";
    $('letters').innerHTML = "";
    $('score').innerHTML = "Score:  0";
    $('guess').value = "";
    $('avail').innerHTML = "";
    string = "";
    prevGuesses = [];
    //currentScore = 0;
  }
});

$("start").addEventListener("click", function()
{
  loadLetters();
  myDatabase.ref("starting").set(1);
  myDatabase.ref("ending").set(0);
  myDatabase.ref("seconds").set(31);
  $("guess").disabled = false;
  $("submit").disabled = false;
  $('start').disabled = true;
  $("over").innerHTML = "";
  //seconds = 31;
  //timer = setInterval(setUpTimer, 1000);
});


$("reset").addEventListener("click", function(){
  myDatabase.ref("starting").set(0);
  myDatabase.ref("ending").set(1);
  myDatabase.ref("prevGuesses").remove();
  //$("over").innerHTML = "GAME OVER" + "<br>" + "Final Score: " + currentScore;
  //let g = myDatabase.ref("prevGuesses").orderByKey();
  //clearGuesses();
  //clearInterval(timer);
  //seconds = 31;
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
    if(ss.exists()){
      myDatabase.ref("prevGuesses").child(guess).once('value', ss2=>{
        if(ss2.exists()){
          alert("Word already found!");
        }else{
          myDatabase.ref("prevGuesses").child(guess).push();
          myDatabase.ref("prevGuesses").child(guess).set(guess);
          currentScore += guess.length;
          myDatabase.ref("score").set(currentScore);
          //showGuesses();
          //$('words').innerHTML += "-  " + guess + "<br>";
          myDatabase.ref("score").on('value', ss3=>{
            $('score').innerHTML = "Score:  " + ss3.val();
          });
          //$('score').innerHTML = "Score:  " + currentScore;
          $('guess').value = '';
          return true;
        }
      });
    }else {
      alert("Not a word!");
      return false;
    }
  });
}
 

let showGuesses = function(){
  let g = myDatabase.ref("prevGuesses").orderByKey();
  g.on('value', ss=>{
    ss.forEach(function(child){
      if(!$('words').innerHTML.includes(child.val()))
        $('words').innerHTML += "-  " + child.val() + "<br>";
    });
  });
}


