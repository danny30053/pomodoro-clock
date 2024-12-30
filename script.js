// Get the elements
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const timerDisplay = document.getElementById("timer");
const circle = document.querySelector(".circle"); // Our colored circle path

// Set the initial timer time (25 minutes in seconds)
let timeLeft = 1 * 60; // 25 minutes
let timerInterval = null; // We'll set this to null initially
const totalTime = 1 * 60; 

// Function to start or pause the timer
function startTimer() {
  // If there's an active interval, clear it (pause)
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  } else {
    // Start a new timer if not running
    timerInterval = setInterval(updateTimer, 1000); // Update every second
  }
}

// Function to update the timer display
function updateTimer() {
  if (timeLeft <= 0) {
    clearInterval(timerInterval); // Stop the timer when it reaches 0
    timerInterval = null; // Reset the interval variable
    alert("Pomodoro session complete!");
    return;
  }

  timeLeft--; // Decrease the time by 1 second

  // Format time in mm:ss format
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;

  // Update the circle
  updateCircle();
}

// Function to reset the timer
function resetTimer() {
  clearInterval(timerInterval); // Stop the timer if it's running
  timerInterval = null; // Reset the interval variable
  timeLeft = 1 * 60; // Reset time to 25 minutes
  timerDisplay.textContent = "01:00"; // Reset the display
  updateCircle(true); // Reset circle to full
}

// Update the SVG circle to reflect the current time left
function updateCircle(isReset = false) {
  if (isReset) {
    // For a reset, just fill the circle back to 100%
    circle.style.strokeDasharray = "100, 100";
    return;
  }

  // Calculate the percentage of time remaining
  const fractionLeft = (timeLeft / totalTime) * 100;
  // strokeDasharray format: "<filled>, 100"
  // As timeLeft decreases, fractionLeft gets smaller
  circle.style.strokeDasharray = `${fractionLeft}, 100`;
}
// Event listeners
startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);

// Initialize the circle to 100% on page load
updateCircle(true);
