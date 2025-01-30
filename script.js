// script.js

// Load learned kanji from localStorage
let learnedKanji = JSON.parse(localStorage.getItem("learnedKanji")) || [];

// DOM Elements
const kanjiInput = document.getElementById("kanji-input");
const meaningInput = document.getElementById("meaning-input");
const addKanjiBtn = document.getElementById("add-kanji-btn");
const kanjiCardsContainer = document.getElementById("kanji-cards-container");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Add New Kanji
addKanjiBtn.addEventListener("click", () => {
  const kanji = kanjiInput.value.trim();
  const meaning = meaningInput.value.trim();

  if (kanji && meaning) {
    // Add to learned kanji list
    learnedKanji.push({ kanji, meaning });
    localStorage.setItem("learnedKanji", JSON.stringify(learnedKanji));

    // Clear inputs
    kanjiInput.value = "";
    meaningInput.value = "";

    // Update the UI
    renderKanjiCards();
  } else {
    alert("Please enter both Kanji and its meaning.");
  }
});

// Render Kanji Cards
function renderKanjiCards() {
  kanjiCardsContainer.innerHTML = "";

  learnedKanji.forEach((item, index) => {
    if (!item.kanji || !item.meaning) return; // Skip invalid entries

    // Create Card
    const card = document.createElement("div");
    card.classList.add("kanji-card");

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.textContent = item.kanji;

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.textContent = item.meaning;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    // Flip Card on Click
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    // Append Card to Container
    kanjiCardsContainer.appendChild(card);
  });
}

// Dark Mode Toggle
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// Initialize Dark Mode
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
  darkModeToggle.checked = true;
}

// Initialize App
function init() {
  renderKanjiCards();
}

init();
