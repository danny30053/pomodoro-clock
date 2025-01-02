/************************************************************
 * Configuration: intervals array
 * Example cycle: 25-minute work, 5-minute short break,
 * repeated multiple times or expanded as needed.
 ************************************************************/
// For a simple 2-step cycle:
// const intervals = [
//   { name: 'Work', duration: 25 * 60 },
//   { name: 'Short Break', duration: 5 * 60 },
// ];

const intervals = [
  { name: "Work 1", duration: 1 * 10 },
  { name: "Short Break", duration: 1 * 10 },
  { name: "Work 2", duration: 1 * 10 },
  { name: "Short Break", duration: 1 * 10 },
  { name: "Work 3", duration: 1 * 10 },
  { name: "Short Break", duration: 1 * 10 },
  { name: "Work 4", duration: 1 * 10 },
  { name: "Long Break", duration: 1 * 10 },
];

/************************************************************
 * Global variables and DOM element references
 ************************************************************/
let currentIntervalIndex = 0;
let timeLeft = 0;
let timerInterval = null;

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const timerDisplay = document.getElementById("timer");
const intervalLabel = document.getElementById("intervalLabel");
const circle = document.querySelector(".circle");

// Modal elements
const modalElement = document.getElementById("intervalModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalNextBtn = document.getElementById("modalNextBtn");

// Initialize a Bootstrap modal instance (if using Bootstrap 5)
const intervalModal = new bootstrap.Modal(modalElement, {
  backdrop: "static", // optional: prevent closing by clicking outside
  keyboard: false, // optional: prevent closing with ESC
});

// The "Next" button in the modal starts the next interval
modalNextBtn.addEventListener("click", () => {
  intervalModal.hide();
  // Move to the next interval
  moveToNextInterval();
});

/************************************************************
 * Initialization
 ************************************************************/
// Load the first interval when the page is ready
loadInterval();

// Attach event listeners
startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);

/************************************************************
 * Functions
 ************************************************************/

/**
 * loadInterval()
 * Sets timeLeft from the intervals array based on currentIntervalIndex,
 * updates the display and resets the circle to full.
 */
function loadInterval() {
  const currentInterval = intervals[currentIntervalIndex];
  timeLeft = currentInterval.duration;

  // Update the numeric display
  updateDisplay(timeLeft);

  // Optional: display the name of the current interval
  if (intervalLabel) {
    intervalLabel.textContent = currentInterval.name;
  }

  // **Set the stroke color based on the interval name**
  if (currentInterval.name.toLowerCase().includes("break")) {
    // Green for break
    circle.style.stroke = "#28a745";
  } else {
    // Blue for work
    circle.style.stroke = "#007bff";
  }

  // Reset the circle visually
  updateCircle(true);
}

/**
 * startTimer()
 * Toggles the timer on/off. If it's running, pause it; if it's paused, start it.
 */
function startTimer() {
  if (timerInterval) {
    // Timer is running: pause it
    clearInterval(timerInterval);
    timerInterval = null;
    // Change the button text back to "Start"
    startButton.textContent = "Start";
    // Remove the gray color and add the blue color
    startButton.classList.remove("btn-secondary");
    startButton.classList.add("btn-primary");
  } else {
    // Timer is not running: start it
    timerInterval = setInterval(updateTimer, 1000);
    // Change the button text to "Stop"
    startButton.textContent = "Stop";
    // Remove the blue color and add the gray color
    startButton.classList.remove("btn-primary");
    startButton.classList.add("btn-secondary");
  }
}

/**
 * updateTimer()
 * Called every second (1000ms) to decrement the time.
 * If timeLeft hits 0, move to the next interval.
 */
function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    // Reset the Start/Stop button
    startButton.textContent = "Start";
    startButton.classList.remove("btn-secondary");
    startButton.classList.add("btn-primary");

    // Show a modal (instead of moving automatically)
    showCompletionModal();
    return;
  }

  timeLeft--;
  updateDisplay(timeLeft);
  updateCircle();
}

/**
 * showCompletionModal()
 * Displays a popup with a message. The user can press "Next" to move on.
 */
function showCompletionModal() {
  const currentInterval = intervals[currentIntervalIndex];
  // Check if we are at the last interval
  const isLastInterval = currentIntervalIndex === intervals.length - 1;

  if (isLastInterval) {
    // The last interval is complete
    modalTitle.textContent = "Full Pomodoro Cycle Complete!";
    modalBody.textContent = "You have completed a full Pomodoro cycle.";
    modalNextBtn.textContent = "Start New Cycle";
  } else {
    // We finished a Work or Break interval
    if (currentInterval.name.toLowerCase().includes("work")) {
      modalTitle.textContent = "Work Cycle Complete!";
      modalBody.textContent = "Great work! you have completed a work cycle!";
      modalNextBtn.textContent = "Start Break";
    } else {
      modalTitle.textContent = "Break Complete!";
      modalBody.textContent = "Time to get back to work!";
      modalNextBtn.textContent = "Start Next Work Cycle";
    }
  }

  // Show the modal
  intervalModal.show();
}

/**
 * resetTimer()
 * Stops the timer, resets to the first interval in the list.
 */
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  currentIntervalIndex = 0;
  loadInterval();
  // Reset the button text to "Start"
  startButton.textContent = "Start";
  startButton.classList.remove("btn-secondary");
  startButton.classList.add("btn-primary");
}

/**
 * moveToNextInterval()
 * Increments currentIntervalIndex. If it was the last interval,
 * we can reset or loop based on your preference.
 */
function moveToNextInterval() {
  // If we were at the last interval
  if (currentIntervalIndex === intervals.length - 1) {
    // Start a brand new cycle
    resetTimer();
    return;
  }

  // Otherwise, move on normally
  currentIntervalIndex++;
  loadInterval();
}

/**
 * updateDisplay(seconds)
 * Formats timeLeft in mm:ss and updates timerDisplay.
 */
function updateDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timerDisplay.textContent = `${minutes < 10 ? "0" + minutes : minutes}:${
    secs < 10 ? "0" + secs : secs
  }`;
}

/**
 * updateCircle(isReset)
 * Adjusts the SVG circle's stroke-dasharray to show time progress.
 */
function updateCircle(isReset = false) {
  if (isReset) {
    circle.style.strokeDasharray = "100, 100";
    return;
  }
  const currentInterval = intervals[currentIntervalIndex];
  const fractionLeft = (timeLeft / currentInterval.duration) * 100;
  circle.style.strokeDasharray = `${fractionLeft}, 100`;
}
