// Path to the file that contains all questions
const QUESTIONS_URL = "data/phrases-questions.json";

// Views
const startView = document.getElementById("start-view");
const quizView = document.getElementById("quiz-view");
const resultView = document.getElementById("result-view");

// Start view elements
const startButton = document.getElementById("start-button");
const errorMessage = document.getElementById("error-message");

// Quiz view elements
const progressText = document.getElementById("progress");
const phraseText = document.getElementById("phrase");
const romanizationText = document.getElementById("romanization");
const optionsContainer = document.getElementById("options");
const feedbackBox = document.getElementById("feedback");
const feedbackText = document.getElementById("feedback-text");
const feedbackNote = document.getElementById("feedback-note");
const nextButton = document.getElementById("next-button");

// Result view elements
const scoreText = document.getElementById("score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-button");

// Quiz state
let allQuestions = [];   // All questions loaded from the JSON file
let questions = [];      // The questions for the current round, in shuffled order
let currentIndex = 0;    // Index of the question being shown
let score = 0;           // Number of correct answers

// Returns a new array with the items in random order (Fisher-Yates shuffle)
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Hides all views and shows only the given one
function showView(view) {
  [startView, quizView, resultView].forEach((v) => v.classList.add("hidden"));
  view.classList.remove("hidden");
}

// Loads the questions from the JSON file and enables the start button
async function loadQuestions() {
  try {
    const response = await fetch(QUESTIONS_URL);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    const data = await response.json();
    allQuestions = data.questions;
    startButton.disabled = false;
    startButton.textContent = "Start quiz";
  } catch (error) {
    console.error("Could not load questions:", error);
    startButton.textContent = "Start quiz";
    errorMessage.textContent =
      "Could not load the questions. Make sure the page is opened through a local server (for example Live Server in VS Code).";
    errorMessage.classList.remove("hidden");
  }
}

// Resets the state and starts a new round with shuffled questions
function startQuiz() {
  questions = shuffle(allQuestions);
  currentIndex = 0;
  score = 0;
  showView(quizView);
  showQuestion();
}

// Shows the current question and creates one button per answer option
function showQuestion() {
  const question = questions[currentIndex];

  progressText.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  phraseText.textContent = question.phrase;
  romanizationText.textContent = question.romanization;

  feedbackBox.classList.add("hidden");
  nextButton.classList.add("hidden");

  optionsContainer.innerHTML = "";
  shuffle(question.options).forEach((option) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(button, question));
    optionsContainer.appendChild(button);
  });
}

// Checks the selected answer and shows right/wrong feedback directly
function checkAnswer(selectedButton, question) {
  const isCorrect = selectedButton.textContent === question.answer;
  if (isCorrect) {
    score++;
  }

  // Lock all options and always highlight the correct one
  for (const button of optionsContainer.children) {
    button.disabled = true;
    if (button.textContent === question.answer) {
      button.classList.add("correct");
    }
  }
  if (!isCorrect) {
    selectedButton.classList.add("wrong");
  }

  feedbackText.textContent = isCorrect
    ? "Correct!"
    : `Wrong. The correct answer is "${question.answer}".`;
  feedbackNote.textContent = question.note || "";
  feedbackBox.className = isCorrect ? "feedback correct" : "feedback wrong";

  const isLastQuestion = currentIndex === questions.length - 1;
  nextButton.textContent = isLastQuestion ? "See result" : "Next";
  nextButton.classList.remove("hidden");
  nextButton.focus();
}

// Goes to the next question, or to the result view after the last one
function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// Shows the final score and a short message based on the percentage
function showResult() {
  const percent = Math.round((score / questions.length) * 100);
  scoreText.textContent = `${score} / ${questions.length} (${percent}%)`;

  if (percent === 100) {
    resultMessage.textContent = "Perfect! 잘했어요! (Well done!)";
  } else if (percent >= 70) {
    resultMessage.textContent = "Great job! You know most of the phrases.";
  } else if (percent >= 40) {
    resultMessage.textContent = "Good start! Try again to learn the rest.";
  } else {
    resultMessage.textContent = "Keep practicing. You will get there!";
  }

  showView(resultView);
}

startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
restartButton.addEventListener("click", startQuiz);

loadQuestions();
