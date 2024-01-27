let data;
let response;
let hintIndex;
let userInput;
let hintInput;
let currentIndex = 0;
let shuffledWords = [];
let userLevel = 1; // New variable to store the user's level

window.onload = async function () {
  response = await fetch("../word.json");

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  data = await response.json();
  shuffledWords = await shuffleArray(data.words); // Initialize shuffledWords
  displayWord();

  // Check if the current page is "index.html" before adding the keyup event listener
  if (window.location.pathname.includes("index.html")) {
    addKeyListener();
  }
  if (window.location.pathname.includes("vocabulary.html")) {
    displayVocabulary();
  }
};

function addKeyListener() {
  document.getElementById("first-input").addEventListener("keyup", function (event) {
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

// Add a new parameter to displayWord to control progress bar and user level update
async function displayWord(updateProgress = true) {
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

  // Clear existing content before adding new one
  japaneseWordElement.innerHTML = "";

  const jishoLink = document.createElement("a");
  jishoLink.href = `https://jisho.org/search/${currentWord.kanji}`;
  jishoLink.textContent = currentWord.kanji;
  jishoLink.target = "_blank";

  // Append the 'a' element as a child to 'japaneseWordElement'
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
      currentIndex++;

      // Increase user level and update progress bar
      userLevel++;
      displayWord();
    } else {
      document.getElementById("japanese-word").textContent = "完了";
    }
  } else {
    userInput.style.boxShadow = "0 0 10px #fb2577";
    hintInput.style.boxShadow = "0 0 10px #fb2577";
    userInput.style.borderColor = "#fb2577";
  }
  userInput.value = "";
  hintInput.value = "";
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
    const progressValue = (currentIndex / shuffledWords.length) * 100;
    progressBarElement.value = progressValue;
  }
}

async function displayVocabulary() {
  response = await fetch("../word.json");
  data = await response.json();

  const vocabTable = document.querySelector("#tableBody");
  vocabTable.innerHTML = "";

  for (let i = 0; i < data.words.length; i++) {
    const word = data.words[i];

    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${word.kanji}</td>
          <td>${word.reading}</td>
          <td>${word.meaning[0] + ",  " + word.meaning[1]}</td>
          <td>${word.romaji}</td>`;

    vocabTable.appendChild(row);
  }
}

function hint() {
  const currentWord = shuffledWords[currentIndex];

  hintInput = document.getElementById("second-input");
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
    displayWord(false); // Pass false to not update progress bar and user level
  } else {
    console.log("End of the word list reached.");
  }
}

async function reset() {
  currentIndex = 0;
  userLevel = 1;
  updateLevelHeader(); // Add this line to update the level header
  updateProgressBar(); // Add this line to reset the progress bar
  await displayWord();
}