window.onload = async function () {
    try {
        const response = await fetch("../word.json");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        displayVocabulary(data);
    } catch (error) {
        console.error("Error loading vocabulary:", error);
    }
};

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

function displayVocabulary(data) {
    const vocabTable = document.querySelector("#tableBody");
    let tableHTML = "";

    for (let i = 0; i < data.words.length; i++) {
        const word = data.words[i];

        tableHTML += `
            <tr>
                <td>${word.kanji}</td>
                <td>${word.reading}</td>
                <td>${toTitleCase(word.meaning[0])}${word.meaning[1] ? `, ${toTitleCase(word.meaning[1])}` : ''}</td>
                <td>${toTitleCase(word.romaji)}</td>
            </tr>`;
    }

    vocabTable.innerHTML = tableHTML;
}