let data;
let response;

function addKeyListener() {
  document.getElementById("userInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      checkReading();
    }
  });
}

window.onload = async function () {
  response = await fetch("../word.json");

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  data = await response.json();
  displayWord();

  // Check if the current page is "index.html" before adding the keyup event listener
  if (window.location.pathname.includes("index.html")) {
    addKeyListener();
  }
  displayVocabulary();
};

let currentIndex = 0;
let shuffledWords = [];

async function shuffleArray(array) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

async function displayWord() {
  if (!data || !data.words || data.words.length === 0) {
    console.error("Error: Data is not loaded or is empty.");
    return;
  }

  document.getElementById("level").innerHTML = currentIndex + 1;

  if (currentIndex === 0) {
    shuffledWords = await shuffleArray(data.words);
  }

  const currentWord = shuffledWords[currentIndex];

  const japaneseWordElement = document.getElementById("japanese-word");
  if (!japaneseWordElement) {
    console.error('Error: Element with id "japanese-word" not found.');
    return;
  }

  // Clear existing content before adding a new one
  japaneseWordElement.innerHTML = "";

  const jishoLink = document.createElement("a");
  jishoLink.href = `https://jisho.org/search/${currentWord.kanji}`;
  jishoLink.textContent = currentWord.kanji;

  // Append the 'a' element as a child to 'japaneseWordElement'
  japaneseWordElement.appendChild(jishoLink);
}

async function checkReading() {
  if (!data || !data.words || data.words.length === 0) {
    console.error("Error: Data is not loaded or is empty.");
    return;
  }

  const currentWord = shuffledWords[currentIndex];
  const userInput = document.getElementById("userInput");

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
      userInput.style.boxShadow = "";
      userInput.style.borderColor = "";
      currentIndex++;

      // Save the current level
      localStorage.setItem("currentLevel", currentIndex.toString());
    } else {
      document.getElementById("japanese-word").textContent = "完了";
      document.getElementById("search-container").innerHTML = `<br><br>
              <button id="resetButton" onclick="resetGame()">リセット</button>
          `;
      document.getElementById("resetButton").style.display = "block";
      userInput.style.display = "none";
      return;
    }
  } else {
    userInput.style.boxShadow = "0 0 10px #fb2577";
    userInput.style.borderColor = "#fb2577";
  }
  userInput.value = "";

  displayWord();
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
          <td>${word.romaji}</td>`;

    vocabTable.appendChild(row);
  }
}

async function resetGame() {
  currentIndex = 0;
  await displayWord();

  // Clear the saved level
  localStorage.removeItem("currentLevel");

  const resetButton = document.getElementById("resetButton");
  if (resetButton) {
    resetButton.style.display = "none";
  }

  document.getElementById("search-container").innerHTML = `
    <input type="text" id="userInput" placeholder="">
    <button onclick="checkReading()">提出</button>
    <button id="resetButton" style="display:none; text-align: center;" onclick="resetGame()">リセット</button>
  `;
}
