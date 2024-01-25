let data;

window.onload = async function () {
    const response = await fetch('word.json');

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();
    displayWord();
};

let currentIndex = 0;
let shuffledWords = [];

document
  .getElementById("userInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      checkReading();
    }
  });

async function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

async function displayWord() {
  document.getElementById("level").innerHTML = currentIndex + 1;

  if (currentIndex === 0) {
    shuffledWords = data.words;
    shuffleArray(shuffledWords);
  }

  const currentWord = shuffledWords[currentIndex];
  
  const japaneseWordElement = document.getElementById('japanese-word');
  const jishoLink = japaneseWordElement.querySelector('a');

  jishoLink.href = `https://jisho.org/search/${currentWord.kanji}`;
  jishoLink.textContent = currentWord.kanji;
}


async function checkReading() {

    const currentWord = shuffledWords[currentIndex];
    const userInput = document.getElementById('userInput');
    const userInputValue = userInput.value.trim();
    
    if (userInputValue === currentWord.reading || userInputValue === currentWord.romaji) {
      if (currentIndex < shuffledWords.length - 1) {
        userInput.style.boxShadow = '';
        userInput.style.borderColor = '';
        currentIndex++;
      } else {
        document.getElementById('japanese-word').textContent = '完了';
        document.getElementById('search-container').innerHTML = '<button id="resetButton" onclick="resetGame()">Reset</button>';
        return;
      }
    } else {
      userInput.style.boxShadow = '0 0 10px #fb2577';
      userInput.style.borderColor = '#fb2577';
    }
    userInput.value = '';

    displayWord();
}

async function resetGame() {
  currentIndex = 0;
  await displayWord();
  
  document.getElementById('search-container').innerHTML = `
    <input type="text" id="userInput" placeholder="">
    <button onclick="checkReading()">提出</button>
    <button id="resetButton" style="display:none;" onclick="resetGame()">Reset</button>
  `;
}
