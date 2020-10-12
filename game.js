let STARTERS = 12000; // there are 12,000 12 letter words to populate the 2d array
let NUM_LETTERS = 12; // 12 letters to start every game
let string = ""; // will hold the letters that will be displayed
let currentScore = 0;
let prevGuesses = new Array();

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
myDatabase.ref("dictionary").child("a").child.("apple").once('value', ss=>{
  alert(ss.val());
})

let randomIndex = parseInt(Math.floor(Math.random() * STARTERS));
myDatabase.ref("starters").child("alphabetized").child(randomIndex).once('value').then(snapshot =>
{
    let letters = snapshot.val();
    string = letters;
    console.log(letters);

    for(var i = 0; i < letters.length; i++){
      document.getElementById("letters").innerHTML += letters[i] + "      ";
      if(i == 3 || i == 7)
        document.getElementById("letters").innerHTML += "<br>";
    }
});
  
document.getElementById("submit").addEventListener("click", function(){
  let guess = document.getElementById("guess").value;
  console.log(guess);
  checkGuess(guess);
});

function checkGuess(guess){
  for(var i = 0; i < guess.length; i++){
    if(string.includes(guess[i])){
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
      document.getElementById("words").innerHTML += "-  " + guess + "<br>";
      document.getElementById("score").innerHTML = "Score:  " + currentScore;
      return true;
    } else if(prevGuesses.includes(guess)) {
      alert("Word already found!");
    } else {
      return false;
    }
  })  
}
