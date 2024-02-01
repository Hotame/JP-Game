let data;
let response;
let hintIndex;
let userInput;
let hintInput;
let currentIndex = 0;
let userLevel = 1;
let userProgress = 0;

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const loadingScreen = document.getElementById("loading-screen");
    loadingScreen.style.display = "flex";

    loadUserData();
    response = await fetch("../word.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();

    loadingScreen.style.display = "none";
    document.body.style.display = "block";

    displayWord();
    addKeyListener();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

function addKeyListener() {
  document.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      submit();
    }
  });
}

async function displayWord() {
  if (!data || !data.words || data.words.length === 0) {
    console.error("Error: Data is not loaded or is empty.");
    return;
  }

  const index = userLevel - 1;

  if (userProgress === 100) {
    const japaneseWordElement = document.getElementById("japanese-word");
    if (japaneseWordElement) {
      japaneseWordElement.textContent = "完了";
      updateProgressBar();
      disable();
    }
    return;
  }
  updateProgressBar();

  const currentWord = data.words[index];

  const japaneseWordElement = document.getElementById("japanese-word");
  if (!japaneseWordElement) {
    console.error('Error: Element with id "japanese-word" not found.');
    return;
  }

  japaneseWordElement.innerHTML = currentWord.kanji;

  hintIndex = 0;
  currentIndex = index;

  updateLevelHeader();
  updateProgressBar();
}

async function submit() {

  if (isGameCompleted()) {
    return;
  }

  if (!data || !data.words || data.words.length === 0) {
    console.error("Error: Data is not loaded or is empty.");
    return;
  }

  const currentWord = data.words[currentIndex];
  userInput = document.getElementById("first-input");
  hintInput = document.getElementById("second-input");

  if (!userInput) {
    console.error('Error: Element with id "userInput" not found.');
    return;
  }

  const userInputValue = userInput.value.trim();

  if (
    userInputValue === currentWord.reading ||
    userInputValue === currentWord.romaji
  ) {
    if (currentIndex < data.words.length - 1) {
      userInput.style.boxShadow = "0 0 10px #03C988";
      hintInput.style.boxShadow = "0 0 10px #03C988";
      userInput.style.borderColor = "";
      currentIndex++;
      userLevel++;
      hintInput.value = "";
      displayWord();
      saveUserData();
    } else {
      currentIndex++;
      document.getElementById("japanese-word").textContent = "完了";
      updateProgressBar();
      disable();
      document.getElementById("first-input").style.boxShadow =
        "0 0 10px #3498dbc9";
      document.getElementById("second-input").style.boxShadow =
        "0 0 10px #3498dbc9";
      console.log("Up Current Index: " + currentIndex);
      saveUserData();
    }
  } else {
    userInput.style.boxShadow = "0 0 10px #fb2577";
    hintInput.style.boxShadow = "0 0 10px #fb2577";
    userInput.style.borderColor = "#fb2577";
  }
  userInput.value = "";
  updateProgressBar();
}

function updateLevelHeader() {
  const levelHeaderElement = document.getElementById("level-header");
  if (levelHeaderElement) {
    levelHeaderElement.textContent = `レベル ${userLevel}`;
  }
}

function updateProgressBar() {
  const progressBarElement = document.getElementById("progressBar");
  if (progressBarElement) {
    const totalWords = data.words.length;
    const progressValue = currentIndex / totalWords * 100;
    progressBarElement.value = progressValue;

    userProgress = progressValue;

    console.log("Current Index:", currentIndex);
    console.log("Total Words:", totalWords);
    console.log("Updated userProgress:", userProgress);
  }
}

function hint() {
  if (isGameCompleted()) {
    return;
  }

  const currentWord = data.words[currentIndex];

  hintInput = document.getElementById("second-input");

  if (!hintInput) {
    console.error('Error: Element with id "second-input" not found.');
    return;
  }

  if (hintIndex < currentWord.reading.length) {
    hintInput.value += currentWord.reading[hintIndex];
    hintIndex++;
  } else {
    hintInput.value = "";
    hintIndex = 0;
  }
  hintInput.readOnly = true;
}

function getJisho() {

  if (isGameCompleted()) {
    return;
  }

  const currentWord = data.words[userLevel - 1];
  const jishoLink = `https://jisho.org/search/${currentWord.kanji}`;
  window.open(jishoLink, "_blank");
}

function saveUserData() {
  localStorage.setItem("userLevel", userLevel);
  localStorage.setItem("userProgress", userProgress);
}

function loadUserData() {
  const savedUserLevel = localStorage.getItem("userLevel");
  const savedUserProgress = localStorage.getItem("userProgress");

  if (savedUserLevel && savedUserProgress) {
    userLevel = parseInt(savedUserLevel, 10);
    userProgress = parseFloat(savedUserProgress);
    hintIndex = 0;
  }
}

async function reset() {
  currentIndex = 0;
  userLevel = 1;
  userProgress = 0;
  document.getElementById("first-input").style.boxShadow = "0 0 10px #3498dbc9";
  document.getElementById("second-input").style.boxShadow =
    "0 0 10px #3498dbc9";
  document.getElementById("first-input").value = "";
  document.getElementById("second-input").value = "";
  updateLevelHeader();
  updateProgressBar();
  await displayWord();
  saveUserData();
  enable();
}

function isGameCompleted() {
  const japaneseWordElement = document.getElementById("japanese-word");

  if (japaneseWordElement.textContent === "完了") {
    return true;
  }

  const wordInput = document.getElementById("first-input");
  const hintInput = document.getElementById("second-input");

  if (currentIndex === data.words.length) {
    japaneseWordElement.textContent = "完了";
    updateProgressBar();
    localStorage.setItem("gameCompleted", true);
    localStorage.setItem("userProgress", 100);
    wordInput.style.boxShadow = "0 0 10px #3498dbc9";
    hintInput.style.boxShadow = "0 0 10px #3498dbc9";
    wordInput.value = "";
    disable();
    return true;
  }
  return false;
}


function disable() {
  document.getElementById("first-input").disabled = true;
  document.getElementById("second-input").disabled = true;
  document.getElementById("submit-button").disabled = true;
  document.getElementById("hint-button").disabled = true;
}

function enable() {
  document.getElementById("first-input").disabled = false;
  document.getElementById("second-input").disabled = false;
  document.getElementById("submit-button").disabled = false;
  document.getElementById("hint-button").disabled = false;
}
