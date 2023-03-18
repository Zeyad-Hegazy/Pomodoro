"use strict";

// elements
const timesBar = document.querySelector(".timers");
const timer = document.querySelectorAll(".timer");
const pomodoro = document.querySelector(".pomodoro");
const shortBreak = document.querySelector(".shortBreak");
const longBreak = document.querySelector(".longBreak");
const timerContanier = document.querySelector(".counter");
const stopper = document.querySelector(".stop");
const settings = document.querySelector(".settings");
const settings_overlay = document.querySelector(".settings-overlay");
const close = document.querySelector(".close");
const pomodoroInput = document.getElementById("pomo");
const shortInput = document.getElementById("short");
const longInput = document.getElementById("long");
const allClrsContanier = document.querySelector(".all-colors");
const allClrs = document.querySelectorAll(".clr");
const apply = document.querySelector(".apply");

let timeLimit, timePassed, timeLeft, timeInterval, running;

allClrsContanier.addEventListener("click", (e) => {
	if (e.target.classList.contains("clr")) {
		allClrs.forEach((e) => {
			e.classList.remove("clr-active");
		});
		e.target.classList.add("clr-active");
	}
});

function getSettings() {
	pomodoro.dataset.time = pomodoroInput.value * 60;
	shortBreak.dataset.time = shortInput.value * 60;
	longBreak.dataset.time = longInput.value * 60;
	const mainClr = document.querySelector(".clr-active").dataset.color;
	document.documentElement.style.setProperty("--mianColor", mainClr);
	init(document.querySelector(".active").dataset.time);
	closeOverlay();
}

apply.addEventListener("click", getSettings);

function closeOverlay() {
	settings_overlay.classList.add("hidden");
}

settings.addEventListener("click", () => {
	settings_overlay.classList.remove("hidden");
});

close.addEventListener("click", closeOverlay);
settings_overlay.addEventListener("click", (e) => {
	if (e.target.classList.contains("settings-overlay")) closeOverlay();
});
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") closeOverlay();
});

function init(time) {
	running = true;
	timeLimit = time;
	timePassed = 0;
	timeLeft = timeLimit;
	timeInterval = null;

	document.getElementById("app").innerHTML = `
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" />
          <path
          id="base-timer-path-remaining"
          stroke-dasharray="283"
          class="base-timer__path-remaining "
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">
      <!-- Remaining time label -->
      ${formatTimeLeft(timeLeft)}
    </span>
  </div>
  `;
}

init(1500);

timesBar.addEventListener("click", (e) => {
	if (e.target.classList.contains("timer")) {
		timer.forEach((e) => {
			e.classList.remove("active");
		});

		e.target.classList.add("active");
		init(+e.target.dataset.time);
	}
});

stopper.addEventListener("click", () => {
	running = false;
	console.log(false);
});

function onTimesUp() {
	clearInterval(timeInterval);
	running = true;
}

function startTimer() {
	stopper.classList.remove("hidden");

	console.log(true);
	timeInterval = setInterval(() => {
		if (running) {
			timePassed = timePassed += 1;

			timeLeft = timeLimit - timePassed;

			document.getElementById("base-timer-label").innerHTML =
				formatTimeLeft(timeLeft);

			if (timeLeft === 0) {
				let alarm = new Audio("./ESAlarmClock Bells.wav");
				alarm.play();
				setTimeout(() => {
					alarm.pause();
					alarm.currentTime = 0;
				}, 5000);
				onTimesUp();
				init(document.querySelector(".active").dataset.time);
			}

			setCircleDasharray();
		} else {
			onTimesUp();
		}
	}, 1000);
}

timerContanier.addEventListener("click", startTimer);

function calculateTimeFraction() {
	const rawTimeFraction = timeLeft / timeLimit;
	return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
	const circleDasharray = `${(calculateTimeFraction() * 283).toFixed(0)} 283`;
	document
		.getElementById("base-timer-path-remaining")
		.setAttribute("stroke-dasharray", circleDasharray);
}

function formatTimeLeft(time) {
	let minutes = Math.floor(time / 60);

	let seconds = time % 60;

	if (seconds < 10) seconds = `0${seconds}`;

	if (minutes < 0 || seconds < 0) return;

	return `${minutes}:${seconds}`;
}
