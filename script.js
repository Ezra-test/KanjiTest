// Load learned kanji from localStorage
let learnedKanji = JSON.parse(localStorage.getItem("learnedKanji")) || [];

// DOM Elements
const kanjiInput = document.getElementById("kanji-input");
const meaningInput = document.getElementById("meaning-input");
const addKanjiBtn = document.getElementById("add-kanji-btn");
const kanjiCardsContainer = document.getElementById("kanji-cards-container");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const startQuizBtn = document.getElementById("start-quiz-btn");

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

    // Add Actions (Edit and Remove Buttons)
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("remove-btn");

    // Edit Button Functionality
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card flip
      const newKanji = prompt("Edit Kanji:", item.kanji);
      const newMeaning = prompt("Edit Meaning:", item.meaning);

      if (newKanji && newMeaning) {
        learnedKanji[index] = { kanji: newKanji, meaning: newMeaning };
        localStorage.setItem("learnedKanji", JSON.stringify(learnedKanji));
        renderKanjiCards();
      }
    });

    // Remove Button Functionality
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card flip
      if (confirm(`Are you sure you want to remove "${item.kanji}"?`)) {
        learnedKanji.splice(index, 1);
        localStorage.setItem("learnedKanji", JSON.stringify(learnedKanji));
        renderKanjiCards();
      }
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(removeBtn);
    card.appendChild(actionsDiv);

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

// Start Quiz
startQuizBtn.addEventListener("click", () => {
  if (learnedKanji.length === 0) {
    alert("No Kanji available for quiz!");
    return;
  }

  // Clone learnedKanji for the quiz
  let quizDeck = [...learnedKanji];
  let stats = {};
  let currentIndex = 0;

  // Create Quiz Window
  const quizWindow = document.createElement("div");
  quizWindow.classList.add("quiz-window");

  const quizContainer = document.createElement("div");
  quizContainer.classList.add("quiz-container");

  const quizCard = document.createElement("div");
  quizCard.classList.add("kanji-card");

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  quizCard.appendChild(cardInner);

  const quizActions = document.createElement("div");
  quizActions.classList.add("quiz-actions");

  const correctBtn = document.createElement("button");
  correctBtn.textContent = "✅";
  correctBtn.classList.add("correct");

  const incorrectBtn = document.createElement("button");
  incorrectBtn.textContent = "❌";
  incorrectBtn.classList.add("incorrect");

  quizActions.appendChild(correctBtn);
  quizActions.appendChild(incorrectBtn);

  quizContainer.appendChild(quizCard);
  quizContainer.appendChild(quizActions);

  quizWindow.appendChild(quizContainer);
  document.body.appendChild(quizWindow);

  // Function to update the quiz card
  function updateQuizCard() {
    if (currentIndex >= quizDeck.length) {
      // End of quiz, show stats
      quizCard.style.display = "none";
      quizActions.style.display = "none";

      const statsDiv = document.createElement("div");
      statsDiv.classList.add("quiz-stats");
      statsDiv.innerHTML = "<h3>Quiz Stats</h3>";

      for (const [kanji, count] of Object.entries(stats)) {
        statsDiv.innerHTML += `<p>${kanji}: ${count} incorrect attempts</p>`;
      }

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.addEventListener("click", () => {
        document.body.removeChild(quizWindow);
      });

      quizContainer.appendChild(statsDiv);
      quizContainer.appendChild(closeButton);
      return;
    }

    const currentKanji = quizDeck[currentIndex];
    cardFront.textContent = currentKanji.kanji;
    cardBack.textContent = currentKanji.meaning;
    quizCard.classList.remove("flipped");
  }

  // Flip Card on Click
  quizCard.addEventListener("click", () => {
    quizCard.classList.toggle("flipped");
  });

  // Event Listeners for Buttons
  correctBtn.addEventListener("click", () => {
    currentIndex++;
    updateQuizCard();
  });

  incorrectBtn.addEventListener("click", () => {
    const currentKanji = quizDeck[currentIndex];
    stats[currentKanji.kanji] = (stats[currentKanji.kanji] || 0) + 1;
    quizDeck.push(currentKanji); // Add to the bottom of the deck
    currentIndex++;
    updateQuizCard();
  });

  // Initialize Quiz
  updateQuizCard();
});

// Initialize App
function init() {
  renderKanjiCards();
}

init();
