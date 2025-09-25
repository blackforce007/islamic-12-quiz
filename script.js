// script.js
const app = (() => {
  // DOM
  const el = (id) => document.getElementById(id);
  const startBtn = el('start-btn');
  const quizSec = el('quiz');
  const welcomeSec = el('welcome');
  const resultSec = el('result');
  const questionText = el('question-text');
  const optionsBox = el('options');
  const timerEl = el('timer');
  const nextBtn = el('next-btn');
  const feedbackEl = el('feedback');
  const playAgain = el('play-again');
  const resultSummary = el('result-summary');
  const resultStats = el('result-stats');

  // State
  let questions = [];
  let queue = [];
  let current = null;
  let totalTime = 15;
  let timer = null;
  let timeLeft = 0;
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;

  // Utilities
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  function loadQuestions() {
    return fetch("./questions.json")
      .then((r) => r.json())
      .catch(() => []);
  }

  function prepareQueue() {
    queue = questions.map((q) => q.id);
    shuffle(queue);
  }

  function pickNext() {
    if (queue.length === 0) {
      finishQuiz();
      return null;
    }
    const id = queue.shift();
    return questions.find((q) => q.id === id);
  }

  function startQuiz() {
    if (questions.length === 0) {
      alert("প্রশ্ন লোড হয়নি।");
      return;
    }
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    prepareQueue();
    welcomeSec.classList.add("hidden");
    resultSec.classList.add("hidden");
    quizSec.classList.remove("hidden");
    nextQuestion();
  }

  function nextQuestion() {
    stopTimer();
    current = pickNext();
    if (!current) return;
    renderQuestion(current);
    startTimer(totalTime);
  }

  function renderQuestion(q) {
    questionText.textContent = q.question;
    optionsBox.innerHTML = "";
    timerEl.textContent = `${totalTime}s`;
    q.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = opt;
      b.addEventListener("click", () => selectOption(i, b));
      optionsBox.appendChild(b);
    });
  }

  function selectOption(idx, btn) {
    stopTimer();
    const isCorrect = idx === current.answer;
    if (isCorrect) {
      btn.classList.add("option-correct");
      score += 10;
      correctCount++;
      feedbackEl.textContent = "✅ সঠিক উত্তর!";
    } else {
      btn.classList.add("option-wrong");
      const correctBtn = [...optionsBox.children][current.answer];
      if (correctBtn) correctBtn.classList.add("option-correct");
      score = Math.max(0, score - 5);
      wrongCount++;
      feedbackEl.textContent = "❌ ভুল উত্তর!";
    }
    [...optionsBox.children].forEach((b) => (b.disabled = true));
    setTimeout(nextQuestion, 1000);
  }

  function startTimer(sec) {
    timeLeft = sec;
    timerEl.textContent = `${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        stopTimer();
        wrongCount++;
        feedbackEl.textContent = "⏰ সময় শেষ!";
        setTimeout(nextQuestion, 800);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function finishQuiz() {
    stopTimer();
    quizSec.classList.add("hidden");
    resultSec.classList.remove("hidden");
    resultSummary.textContent = `আপনার স্কোর: ${score}`;
    resultStats.innerHTML = `
      <p>সঠিক: ${correctCount} | ভুল: ${wrongCount}</p>
    `;
  }

  function restartQuiz() {
    welcomeSec.classList.remove("hidden");
    resultSec.classList.add("hidden");
    quizSec.classList.add("hidden");
  }

  // Boot
  document.addEventListener("DOMContentLoaded", () => {
    loadQuestions().then((q) => (questions = q));
    startBtn.addEventListener("click", startQuiz);
    playAgain.addEventListener("click", restartQuiz);
  });

  return {};
})();
