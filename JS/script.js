let data;
let response;
let hintIndex;
let userInput;
let hintInput;
let currentIndex = 0;
let shuffledWords = [];
let userLevel = 1;
let userProgress = 0;

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const loadingScreen = document.getElementById("loading-screen");

    loadingScreen.style.display = "flex";

    // Load user data from localStorage
    loadUserData();

    response = await fetch("../word.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();
    shuffledWords = await shuffleArray(data.words);

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

async function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

async function displayWord(updateProgress = true) {
  hintIndex = 0;

  if (!data || !data.words || data.words.length === 0) {
    console.error("Error: Data is not loaded or is empty.");
    return;
  }

  const currentWord = shuffledWords[currentIndex];

  const japaneseWordElement = document.getElementById("japanese-word");
  if (!japaneseWordElement) {
    console.error('Error: Element with id "japanese-word" not found.');
    return;
  }

  japaneseWordElement.innerHTML = "";

  const jishoLink = document.createElement("a");
  jishoLink.href = `https://jisho.org/search/${currentWord.kanji}`;
  jishoLink.textContent = currentWord.kanji;
  jishoLink.target = "_blank";

  japaneseWordElement.appendChild(jishoLink);

  if (updateProgress) {
    updateLevelHeader();
    updateProgressBar();
  }
}

async function submit() {
  if (!data || !data.words || data.words.length === 0) {
    console.error("Error: Data is not loaded or is empty.");
    return;
  }

  const currentWord = shuffledWords[currentIndex];
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
    if (currentIndex < shuffledWords.length - 1) {
      userInput.style.boxShadow = "0 0 10px #03C988";
      hintInput.style.boxShadow = "0 0 10px #03C988";
      userInput.style.borderColor = "";

      // Remove completed word from the array
      shuffledWords.splice(currentIndex, 1);

      currentIndex++;
      userLevel++;
      userProgress = currentIndex / shuffledWords.length * 100;
      hintInput.value = "";
      displayWord();

      // Save user data to localStorage
      saveUserData();
    } else {
      currentIndex++;
      document.getElementById("japanese-word").textContent = "完了";
      updateProgressBar();
      document.getElementById("first-input").style.boxShadow = "0 0 10px #3498dbc9";
      document.getElementById("second-input").style.boxShadow = "0 0 10px #3498dbc9";

      // Remove completed word from the array
      shuffledWords.splice(currentIndex - 1, 1);

      // Save user data to localStorage
      saveUserData();
    }
  } else {
    userInput.style.boxShadow = "0 0 10px #fb2577";
    hintInput.style.boxShadow = "0 0 10px #fb2577";
    userInput.style.borderColor = "#fb2577";
  }
  userInput.value = "";
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
    progressBarElement.value = userProgress;
  }
}

function hint() {
  const currentWord = shuffledWords[currentIndex];

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
}

function skip() {
  if (currentIndex < shuffledWords.length - 1) {
    currentIndex++;
    document.getElementById("second-input").value = "";
    document.getElementById("first-input").value = "";
    displayWord(false);

    // Save user data to localStorage
    saveUserData();
  } else {
    console.log("End of the word list reached.");
  }
}

async function reset() {
  currentIndex = 0;
  userLevel = 1;
  userProgress = 0;
  document.getElementById("first-input").style.boxShadow = "0 0 10px #3498dbc9";
  document.getElementById("second-input").style.boxShadow = "0 0 10px #3498dbc9";
  document.getElementById("first-input").value = "";
  document.getElementById("second-input").value = "";
  updateLevelHeader();
  updateProgressBar();
  await displayWord();

  // Save user data to localStorage
  saveUserData();
}

function saveUserData() {
  localStorage.setItem('userLevel', userLevel);
  localStorage.setItem('userProgress', userProgress);
}

function loadUserData() {
  const savedUserLevel = localStorage.getItem('userLevel');
  const savedUserProgress = localStorage.getItem('userProgress');
  if (savedUserLevel && savedUserProgress) {
    userLevel = parseInt(savedUserLevel, 10);
    userProgress = parseFloat(savedUserProgress);
  }
}