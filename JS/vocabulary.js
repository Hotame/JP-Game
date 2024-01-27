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

function displayVocabulary(data) {
    const vocabTable = document.querySelector("#tableBody");
    let tableHTML = "";

    for (let i = 0; i < data.words.length; i++) {
        const word = data.words[i];

        tableHTML += `
            <tr>
                <td>${word.kanji}</td>
                <td>${word.reading}</td>
                <td>${word.meaning[0]}, ${word.meaning[1]}</td>
                <td>${word.romaji}</td>
            </tr>`;
    }

    vocabTable.innerHTML = tableHTML;
}