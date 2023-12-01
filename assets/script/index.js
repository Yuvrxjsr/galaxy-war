'use strict';

class Score {
    #date;
    #hits;
    #percentage;

    constructor(date, hits, totalWords) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = this.calculatePercentage(hits, totalWords);
    }

    get date() {
        return this.#date;
    }

    get hits() {
        return this.#hits;
    }

    get percentage() {
        return this.#percentage;
    }

    calculatePercentage(hits, totalWords) {
        return totalWords === 0 ? 0 : ((hits / totalWords) * 100).toFixed(2);
    }
}

const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
    'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute', 'discipline', 
    'machine', 'accurate', 'connection', 'rainbow', 'bicycle', 'eclipse', 'calculator', 'trouble', 
    'watermelon', 'developer', 'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 
    'agency', 'chocolate', 'eleven', 'technology', 'promise', 'alphabet', 'knowledge', 'magician', 
    'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution', 'banana', 'perfume', 
    'computer', 'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess', 'laptop', 
    'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library', 'unboxing', 'bookstore', 'language', 
    'homework', 'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow', 'keyboard', 'window', 'beans', 
    'truck', 'sheep', 'band', 'level', 'hope' ,'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 
    'mask', 'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion', 'rebel', 'amber', 'jacket', 
    'article', 'paradox', 'social', 'resort', 'escape'
];

const endGameDialog = document.querySelector('.dialog-box#end-game-dialog');
const scoreDisplay = endGameDialog.querySelector('.score-display');
const startAgainButton = endGameDialog.querySelector('.start-again');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Call the shuffle function before starting the game
shuffleArray(words);

const displayWordsElement = document.querySelector('.display-words p');

// Function to display a new word
function displayNewWord() {
    const currentWord = words.pop(); // Get the last word from the shuffled array
    displayWordsElement.textContent = currentWord;
}

// Call the displayNewWord function when starting the game
displayNewWord();

const timerElement = document.querySelector('.timer p');
const scoreElement = document.querySelector('.score-board span');
let seconds = 99; // Initial time limit
let points = 0;

// Function to update the timer and check game end conditions
function updateTimer() {
    timerElement.textContent = seconds;

    if (seconds === 0 || words.length === 0) {
        // End the game due to the timer
        clearInterval(timerInterval);
        handleGameEnd(true);
    }
}

const inputElement = document.querySelector('.input-box input');

inputElement.addEventListener('input', () => {
    handleInput();
    startTimer(); // Call the startTimer function on input
});

let gameActive = true; // Add a variable to track the game state
let timerInterval; // Remove const to be able to modify it later

function startTimer() {
    if (!timerInterval && gameActive) {
        timerInterval = setInterval(() => {
            seconds--;
            updateTimer();
        }, 1000);
    }
}

const startButton = document.querySelector('#start-button');

// Function to play the start sound
function playStartSound() {
    // You can adjust the audio file path and type based on your setup
    const startSound = new Audio('./assets/audio/game-start.mp3');
    startSound.play();
}

startButton.addEventListener('click', () => {
    playStartSound(); // Call the function to play the sound

    document.body.classList.add('game-active');
    shuffleArray(words);
    seconds = 10;
    points = 0;
    scoreElement.textContent = points.toString().padStart(2, '0');
    displayNewWord();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds--;
        updateTimer();
    }, 1000);

    gameActive = true;
});

function handleGameEnd() {
    gameActive = false;
    clearInterval(timerInterval);
    document.body.classList.remove('game-active');

    // Hide the instructions dialog
    const instructionsDialog = document.querySelector('#instructions-dialog');
    instructionsDialog.style.display = 'none';

    // Show the end game dialog
    endGameDialog.style.display = 'block';

    // Create a Score object
    const currentDate = new Date().toLocaleDateString();
    const score = new Score(currentDate, points, words.length);

    // Display the score details in the end dialog
    scoreDisplay.innerHTML = `
        <p>Date: ${score.date}</p>
        <p>Hits: ${score.hits}</p>
        <p>Percentage: ${score.percentage}%</p>
    `;

    // Set up the click event for the "Start Again" button
    startAgainButton.addEventListener('click', () => {
        // Reload the entire page
        location.reload();
    });
}

const restartButton = document.querySelector('.restart');

restartButton.addEventListener('click', () => {
    document.body.classList.add('game-active');
    shuffleArray(words);
    seconds = 99;
    points = 0;
    scoreElement.textContent = points.toString().padStart(2, '0'); // Format points as two digits
    displayNewWord();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds--;
        updateTimer();
    }, 1000);

    gameActive = true;
});

const correctSound = document.getElementById('correctSound');

function handleInput() {
    if (!gameActive) {
        return;
    }

    const userInput = inputElement.value.trim().toLowerCase();
    const currentWord = displayWordsElement.textContent.toLowerCase();

    if (userInput === currentWord) {
        points++;
        scoreElement.textContent = points.toString().padStart(2, '0');
        inputElement.value = '';
        displayNewWord();
        playCorrectSound(); // Call the function to play the sound
    }
}

function playCorrectSound() {
    correctSound.currentTime = 0; // Reset the audio to the beginning
    correctSound.play();
}

const timerSound = new Audio('./assets/audio/death-sound.mp3');

// Function to play the timer sound
function playTimerSound() {
    timerSound.currentTime = 0; // Reset the audio to the beginning
    timerSound.play();
}

// Function to update the timer and check game end conditions
function updateTimer() {
    timerElement.textContent = seconds;

    if (seconds === 0 || words.length === 0) {
        // End the game due to the timer
        clearInterval(timerInterval);
        playTimerSound(); // Play the timer sound
        handleGameEnd(true);
    }
}

timerSound.preload = 'auto';
timerSound.load();