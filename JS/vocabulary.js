window.onload = async function () {
    response = await fetch("../word.json");
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
      displayVocabulary();
  };

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