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

shuffleArray(words);

const displayWordsElement = document.querySelector('.display-words p');

function displayNewWord() {
    const currentWord = words.pop();
    displayWordsElement.textContent = currentWord;
}

displayNewWord();

const timerElement = document.querySelector('.timer p');
const scoreElement = document.querySelector('.score-board span');
let seconds = 99;
let points = 0;

function updateTimer() {
    timerElement.textContent = seconds;

    if (seconds === 0 || words.length === 0) {
        clearInterval(timerInterval);
        handleGameEnd(true);
    }
}

const inputElement = document.querySelector('.input-box input');

inputElement.addEventListener('input', () => {
    handleInput();
    startTimer();
});

let gameActive = true;
let timerInterval;

function startTimer() {
    if (!timerInterval && gameActive) {
        timerInterval = setInterval(() => {
            seconds--;
            updateTimer();
        }, 1000);
    }
}

const startButton = document.querySelector('#start-button');

function playStartSound() {
    const startSound = new Audio('./assets/audio/game-start.mp3');
    startSound.play();
}

startButton.addEventListener('click', () => {
    playStartSound();

    document.body.classList.add('game-active');
    shuffleArray(words);
    seconds = 99;
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

    const instructionsDialog = document.querySelector('#instructions-dialog');
    instructionsDialog.style.display = 'none';

    endGameDialog.style.display = 'block';

    const currentDate = new Date().toLocaleDateString();
    const score = new Score(currentDate, points, words.length);

    scoreDisplay.innerHTML = `
        <p>Date: ${score.date}</p>
        <p>Hits: ${score.hits}</p>
        <p>Percentage: ${score.percentage}%</p>
    `;

    startAgainButton.addEventListener('click', () => {
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
        playCorrectSound();
    }
}

function playCorrectSound() {
    correctSound.currentTime = 0;
    correctSound.play();
}

const timerSound = new Audio('./assets/audio/death-sound.mp3');

function playTimerSound() {
    timerSound.currentTime = 0;
    timerSound.play();
}

function updateTimer() {
    timerElement.textContent = seconds;

    if (seconds === 0 || words.length === 0) {
        clearInterval(timerInterval);
        playTimerSound();
        handleGameEnd(true);
    }
}

timerSound.preload = 'auto';
timerSound.load();