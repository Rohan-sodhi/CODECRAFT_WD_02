// DOM Elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const lapBtn = document.getElementById('lap-btn');
const resetBtn = document.getElementById('reset-btn');
const lapList = document.getElementById('lap-list');
const avgLapDisplay = document.getElementById('avg-lap');

// State Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let lapCount = 0;
let lapTimes = [];
const maxLaps = 8;

// Event Listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', resetTimer);

// Optimized Timer Function
function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 10);
    toggleButtons(true);
}

function pauseTimer() {
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime;
    toggleButtons(false);
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    lapCount = 0;
    lapTimes = [];
    lapList.innerHTML = '';
    updateDisplay(0);
    updateAverageLap();
    toggleButtons(false, true);
}

function updateTime() {
    elapsedTime = Date.now() - startTime;
    updateDisplay(elapsedTime);
}

function updateDisplay(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000));
    
    minutesDisplay.textContent = pad(minutes);
    secondsDisplay.textContent = pad(seconds);
    millisecondsDisplay.textContent = pad(milliseconds, 3);
}

function pad(num, size = 2) {
    return num.toString().padStart(size, '0');
}

function recordLap() {
    const lapTime = elapsedTime;
    lapTimes.push(lapTime);
    const formattedTime = `${pad(Math.floor(lapTime / 60000))}:${pad(Math.floor((lapTime % 60000) / 1000))}.${pad(Math.floor(lapTime % 1000), 3)}`;
    const lapItem = document.createElement('li');
    lapItem.textContent = `Lap ${++lapCount}: ${formattedTime}`;
    lapList.appendChild(lapItem);

    if (lapList.children.length > maxLaps) {
        lapList.scrollTop = lapList.scrollHeight;
    }

    updateAverageLap();
}

function updateAverageLap() {
    if (lapTimes.length === 0) {
        avgLapDisplay.textContent = '00:00.000';
        return;
    }
    const avgTime = lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length;
    const minutes = Math.floor(avgTime / 60000);
    const seconds = Math.floor((avgTime % 60000) / 1000);
    const milliseconds = Math.floor((avgTime % 1000));
    avgLapDisplay.textContent = `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`;
}

function toggleButtons(isRunning, isReset = false) {
    startBtn.disabled = isRunning;
    pauseBtn.disabled = !isRunning;
    lapBtn.disabled = !isRunning;
    resetBtn.disabled = isRunning && !isReset;
}