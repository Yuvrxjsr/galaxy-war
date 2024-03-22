'use strict';

import Score from './score.js';

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
const backButton = document.getElementById('backButton');
const scoreboardDialog = document.querySelector('.dialog-box#scoreboard-dialog');

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
        playTimerSound();
        handleGameEnd(true);
        inputElement.value = '';
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

    countdownDialog.style.display = 'block';

    setTimeout(() => {
        showCountdown(3);
    }, 0);

    setTimeout(() => {
        showCountdown(2);
    }, 1000);

    setTimeout(() => {
        showCountdown(1);

        setTimeout(() => {
            document.body.classList.add('game-active');
            shuffleArray(words);
            seconds = 100;
            points = 0;
            scoreElement.textContent = points.toString().padStart(2, '0');
            displayNewWord();
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                seconds--;
                updateTimer();
            }, 1000);

            gameActive = true;
            countdownDialog.style.display = 'none';
            inputElement.value = '';
        }, 1000);
    }, 2000);
});


const scoreboardButton = document.querySelector('.scoreboard-b');

scoreboardButton.addEventListener('click', () => {
    const scoreboardTable = document.querySelector('#scoreboard-dialog');
    scoreboardTable.style.display = 'block';

    endGameDialog.style.display = 'none';

    showScoreboard();
});

startAgainButton.addEventListener('click', () => {
    shuffleArray(words);
    seconds = 101;
    points = 0;
    scoreElement.textContent = points.toString().padStart(2, '0');
    displayNewWord();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds--;
        updateTimer();
    }, 1000);

    gameActive = true;

    endGameDialog.style.display = 'none';
    document.body.classList.add('game-active');

    showScoreboard();
});

function handleGameEnd() {
    gameActive = false;
    clearInterval(timerInterval);
    document.body.classList.remove('game-active');

    const instructionsDialog = document.querySelector('#instructions-dialog');
    instructionsDialog.style.display = 'none';

    endGameDialog.style.display = 'block';

    const currentDate = new Date().toLocaleDateString();
    const score = { date: currentDate, points, percentage: ((points / words.length) * 100).toFixed(2) };

    updateScoresInStorage(score);

    scoreDisplay.innerHTML = `
        <p>Date: ${score.date}</p>
        <p>Points: ${score.points}</p>
        <p>Percentage: ${score.percentage}%</p>
    `;
    inputElement.value = '';
}

const restartButton = document.querySelector('.restart');

restartButton.addEventListener('click', () => {
    document.body.classList.add('game-active');
    shuffleArray(words);
    seconds = 101;
    points = 0;
    scoreElement.textContent = points.toString().padStart(2, '0');
    displayNewWord();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds--;
        updateTimer();
    }, 1000);

    gameActive = true;
    inputElement.value = '';
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

timerSound.preload = 'auto';
timerSound.load();

const countdownDialog = document.querySelector('.start-timer#countdown-dialog');

function showCountdown(number) {
    countdownDialog.textContent = number;
    countdownDialog.style.display = 'block';

    setTimeout(() => {
        countdownDialog.style.opacity = '0';
    }, 500);

    setTimeout(() => {
        countdownDialog.style.display = 'block';
        countdownDialog.style.opacity = '1';
    }, 1000);
}

function getScoresFromStorage() {
    const storedScores = localStorage.getItem('scores');
    return storedScores ? JSON.parse(storedScores) : [];
}

function updateScoresInStorage(score) {
    const scores = getScoresFromStorage();
    scores.push(score);
    scores.sort((a, b) => b.points - a.points);
    const topScores = scores.slice(0, 10);
    localStorage.setItem('scores', JSON.stringify(topScores));
}

function showScoreboard() {
    const scores = getScoresFromStorage();
    const scoreboardTable = document.querySelector('#scoreboard-table');

    scoreboardTable.innerHTML = '';

    scores.forEach((score, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td>.<td>${score.date}</td>&nbsp;<td>${score.points}</td>&nbsp;<td>${score.percentage}%</td>`;
        scoreboardTable.appendChild(row);
    });

    scoreboardTable.style.display = 'block';
}

backButton.addEventListener('click', () => {
    scoreboardDialog.style.display = 'none';
    endGameDialog.style.display = 'block';
});
