// Game object
var game = {
	lettersGuessed: [],
	incorrectLetters: [],
	guessesRemaining: 6,
	wins: 0,
	wordList: ["han solo","luke skywalker","tatooine","jedi","chewbacca","jakku","sith","light saber","blaster","alderaan","starkiller","kylo ren","stormtrooper","maz kanata","jabba the hutt","lando calrissian","emperor palpatine","princess leia organa","naboo","jar jar binks","gungan","hoth","poe dameron","tie fighter","darth vader","coruscant","darth maul","yoda","obi-wan kenobi","mace windu","padme amidala","wookie","ewok","jawa","rancor","greedo","george lucas","grand moff tarkin","general hux","general grievous","captain phasma","the force awakens","a new hope","revenge of the sith","return of the jedi","the phantom menace","the clone wars","the empire strikes back","death star","midi-chlorians","star destroyer","count dooku","qui-gon jinn","supreme leader snoke","lor san tekka","endor","pod racer","x-wing starfighter","boba fett","mos eisley","cloud city","millenium falcon","korriban","tantive four","guardians of the whills","porkins","kyber crystals","super star destroyer","grand admiral thrawn","the battle of endor"],
	displayWord: "",
	currentWord: "",
	wordState: [],
	lettersRemaining: 0,
	muted: false,
	saberFX: null,
	saber2FX: null,
	JediWinFX: null,
	VaderWinFX: null,
	SaberOnFX: null,
	crowdFX: null,

	// Pick a new word and initialize other game variables
	reset() {

		// Randomly pick a word from the list
		this.displayWord = this.wordList[Math.floor(Math.random()*this.wordList.length)];
		this.currentWord = this.displayWord.replace(/[- )(]/g,'');

	 	alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h','i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's','t', 'u', 'v', 'w', 'x', 'y', 'z'];

	 	// Initialize wordState, replace letters to guess with '_'
	 	this.wordState = [];
	 	for (var i=0; i<this.displayWord.length; i++) {
	 		if (alphabet.indexOf(this.displayWord[i]) == -1){
	 			this.wordState.push(this.displayWord[i]);
	 		} else {
	 			this.wordState.push("_");
	 		}
	 	}

		this.lettersRemaining = this.currentWord.length;
		this.lettersGuessed = [];
		this.incorrectLetters = [];
		this.guessesRemaining = 6;

		this.SaberOnFX.play();
	},

	// Trigger Mike KO animation and update win counter, then picks a new word
	win() {
		this.wins++;
		document.getElementById('score').innerHTML = 'WINS # '+this.wins;
		this.VaderKO();
		setTimeout(function(){
			game.reset();
			game.update();
		}, 1750);
	},

	// Trigger Mac KO animation then picks a new word
	lose() {
		this.lukeKO();
		setTimeout(function(){
			document.getElementById('wordState').innerHTML = game.displayWord;
		}, 1);
		setTimeout(function(){
			game.reset();
			game.update();
		}, 1750);
	},

	checkLetter(c) {
		// Check if letter has already been guessed before
		for (var j=0; j<this.lettersGuessed.length; j++){
			if (c===this.lettersGuessed[j]){
				// Letter has been already guessed, do nothing
				return;
			}
		}
		// Add letter to list of guessed letters
		this.lettersGuessed.push(c);

		var found = false; // Flags whether a letter was found

		// Check if currentWord contains the given letter and reveal them in wordState
		for (var i=0; i<this.displayWord.length; i++){		
			if (c===this.displayWord.charAt(i)){
				this.wordState[i] = c;
				this.lettersRemaining--;
				found = true;

				// Check if any letters left
				if (this.wordState.indexOf("_") == -1){
					console.log(this.lettersRemaining);
					this.win();
					return;					
				}
				// Perform saber animation
				this.slash();
			}
		}

		// Letter not found
		if (!found){
			this.incorrectLetters.push(c);
			this.guessesRemaining--;
			if (this.guessesRemaining===0){
				this.lose();
				return;
			}
			// Perform miss animation
			this.miss();

			console.log("Guesses remaining " + this.guessesRemaining);
		}
	},

	// Update screen elements
	update(){
		// Update blanks
		document.getElementById('wordState').innerHTML = this.wordState.join("");

		// Update incorrect letters
		document.getElementById('incorrectLetters').innerHTML = this.incorrectLetters.join(" ");

		// Update health bars
		var percentage = this.guessesRemaining/6;
		this.hpAnimate('CPUHP', Math.floor(percentage*215));
		percentage = this.lettersRemaining/this.currentWord.length;
		this.hpAnimate('playerHP', Math.floor(percentage*215));

		console.log("Word: "+this.currentWord);
		console.log("State: "+this.wordState.join(" "));
	},

	// Draw Luke Skywalker slashes Darth Vader
	slash(){
		if (this.wordState.indexOf("_") != -1){

			this.saberFX.play();
			
			// Hide default character animations
			document.getElementById('lukeskywalker').style.display = 'none';
			document.getElementById('darthvader').style.display = 'none';

			// Display "saber" frames
			document.getElementById('lukeskywalkerfights').style.display = 'block';
			document.getElementById('darthvaderslashed').style.display = 'block';	

			// Delay before resuming animation
			setTimeout(function(){
				document.getElementById('lukeskywalkerfights').style.display = 'none';
				document.getElementById('darthvaderslashed').style.display = 'none';

				document.getElementById('lukeskywalker').style.display = 'block';
				document.getElementById('darthvader').style.display = 'block';
			}, 750);
		}	
	},

	// Draw Darth Vader slashes Luke Skywalker
	miss(){
		this.saber2FX.play();

		// Hide default Little Mac and Mike animations
		document.getElementById('lukeskywalker').style.display = 'none';
		document.getElementById('darthvader').style.display = 'none';

		// Display "saber" frames
		
		document.getElementById('lukeskywalkerslashed').style.display = 'block';	
		document.getElementById('darthvaderfights').style.display = 'block';		

		// Delay before resuming animation
		setTimeout(function(){
			document.getElementById('lukeskywalkerslashed').style.display = 'none';
			document.getElementById('darthvaderfights').style.display = 'none';
			document.getElementById('lukeskywalker').style.display = 'block';
			document.getElementById('darthvader').style.display = 'block';
		}, 750);
	},


	// Luke getting KO'ed
	lukeKO() {
		this.VaderWinFX.play();
		var player = document.getElementById('lukeskywalker');
		var pc = document.getElementById('darthvader');
		var playerKO = document.getElementById('lukeskywalkerKO');
		var PCWins = document.getElementById('darthvaderwins');
		var wordState = document.getElementById('wordState');
		var fight = document.getElementById('darthvaderfights');

		// Hide default animation
		player.style.display = 'none';
		pc.style.display = 'none';
		fight.style.display = 'none';

		// Display KO frame
		playerKO.style.backgroundImage = "url('assets/images/lukeskywalkerKO.png')";
		PCWins.style.backgroundImage = "url('assets/images/darthvaderwins.png')";
		PCWins.style.display = 'block';		
		playerKO.style.display = 'block';

		// Delay before resuming animation
		setTimeout(function(){
			playerKO.style.display = 'none';
			PCWins.style.display = 'none';
			player.style.display = 'block';
			pc.style.display = 'block';
		}, 1750);
	},

	// Darth getting KO'ed
	VaderKO() {
		this.JediWinFX.play();
		var player = document.getElementById('lukeskywalker');
		var pc = document.getElementById('darthvader');
		var playerWins = document.getElementById('lukeskywalkerwins');
		var PCKO = document.getElementById('darthvaderKO');
		var fight = document.getElementById('lukeskywalkerfights');

		// Hide default animation
		player.style.display = 'none';
		pc.style.display = 'none';

		document.getElementById('lukeskywalkerfights').style.display = 'none';
		document.getElementById('darthvaderslashed').style.display = 'none';	

		// Display KO frame
		PCKO.style.display = 'block';		
		playerWins.style.display = 'block';

		// Delay before resuming animation
		setTimeout(function(){
			playerWins.style.display = 'none';
			PCKO.style.display = 'none';
			player.style.display = 'block';
			pc.style.display = 'block';
		}, 750);

	},

	// Animate the HP bar to the specified width
	hpAnimate(barID, targetWidth){
		var elem = document.getElementById(barID);
    	var currentWidth = elem.clientWidth;
    	var id = setInterval(frame, 5);
    	
    	function frame() {
        	if (currentWidth == targetWidth) {
            	clearInterval(id);
        	} else if (currentWidth > targetWidth) {
            	currentWidth--; 
            	elem.style.width = currentWidth+'px'; 
        	} else {
        		currentWidth++; 
            	elem.style.width = currentWidth+'px';
        	}
		}
	},

	// Toggle music on/off
	musicToggle() {
		document.getElementById('theme').muted = !this.muted;
		this.muted = !this.muted;
	}
};

// Initialize the game
game.saberFX = new Audio('assets/audio/saber-battle1.mp3');
game.saber2FX = new Audio('assets/audio/saber-battle2.mp3');
game.JediWinFX = new Audio('assets/audio/imajedi.mp3');
game.VaderWinFX = new Audio('assets/audio/Iamyourfather.mp3');
game.SaberOnFX = new Audio('assets/audio/saberon.mp3');

game.reset();
game.update();

// Key press handler
document.onkeyup = function(event){
	event = event || window.event;

	var key = event.keyCode;

 	// Check if letter key
 	if (key > 64 && key <91){
 		// Check if letter is in word
 		var letter = String.fromCharCode(key).toLowerCase();
 		console.log("Guessed '"+letter+"'");
 		game.checkLetter(letter);
 		game.update();
 	} else {
 	}
}