const app = (() => {
  // DOM Shortcuts
  const el = (id) => document.getElementById(id);
  const startBtn = el("start-btn");
  const quizSec = el("quiz");
  const welcomeSec = el("welcome");
  const resultSec = el("result");
  const questionText = el("question-text");
  const optionsBox = el("options");
  const timerEl = el("timer");
  const feedbackEl = el("feedback");
  const playAgain = el("play-again");
  const resultSummary = el("result-summary");
  const resultStats = el("result-stats");

  // Live stats
  const liveScoreEl = el("live-score");
  const liveCorrectEl = el("live-correct");
  const liveWrongEl = el("live-wrong");

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

  // Load questions from JSON
  function loadQuestions() {
    return fetch("./questions.json")
      .then((r) => r.json())
      .catch(() => []);
  }

  // Prepare question queue
  function prepareQueue() {
    queue = questions.map((q) => q.id);
    shuffle(queue);
  }

  // Pick next question
  function pickNext() {
    if (queue.length === 0) {
      finishQuiz();
      return null;
    }
    const id = queue.shift();
    return questions.find((q) => q.id === id);
  }

  // Start quiz
  function startQuiz() {
    if (questions.length === 0) {
      alert("❌ প্রশ্ন লোড হয়নি।");
      return;
    }
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    updateLiveStats();
    prepareQueue();
    welcomeSec.classList.add("hidden");
    resultSec.classList.add("hidden");
    quizSec.classList.remove("hidden");
    nextQuestion();
  }

  // Show next question
  function nextQuestion() {
    stopTimer();
    current = pickNext();
    if (!current) return;
    renderQuestion(current);
    startTimer(totalTime);
  }

  // Render question and options
  function renderQuestion(q) {
    questionText.textContent = q.question;
    optionsBox.innerHTML = "";
    feedbackEl.innerHTML = "";
    timerEl.textContent = `${totalTime}s`;

    q.options.forEach((opt, i) => {
      const b = document.createElement("button");
      b.className = "option-btn";
      b.textContent = opt;
      b.addEventListener("click", () => selectOption(i, b));
      optionsBox.appendChild(b);
    });
  }

  // Handle option selection
  function selectOption(idx, btn) {
    stopTimer();
    const isCorrect = idx === current.answer;

    if (isCorrect) {
      btn.classList.add("option-correct");
      score += 10;
      correctCount++;
      feedbackEl.innerHTML = `<div class="big-symbol correct">✅</div><p>সঠিক উত্তর!</p>`;
    } else {
      btn.classList.add("option-wrong");
      const correctBtn = [...optionsBox.children][current.answer];
      if (correctBtn) correctBtn.classList.add("option-correct");
      score = Math.max(0, score - 5);
      wrongCount++;
      feedbackEl.innerHTML = `<div class="big-symbol wrong">❌</div><p>ভুল উত্তর!</p>`;
    }

    updateLiveStats();
    [...optionsBox.children].forEach((b) => (b.disabled = true));
    setTimeout(nextQuestion, 1200);
  }

  // Start timer
  function startTimer(sec) {
    timeLeft = sec;
    timerEl.textContent = `${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        stopTimer();
        wrongCount++;
        feedbackEl.innerHTML = `<div class="big-symbol wrong">⏰</div><p>সময় শেষ!</p>`;
        updateLiveStats();
        const correctBtn = [...optionsBox.children][current.answer];
        if (correctBtn) correctBtn.classList.add("option-correct");
        [...optionsBox.children].forEach((b) => (b.disabled = true));
        setTimeout(nextQuestion, 1000);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Finish quiz
  function finishQuiz() {
    stopTimer();
    quizSec.classList.add("hidden");
    resultSec.classList.remove("hidden");
    resultSummary.textContent = `আপনার মোট স্কোর: ${score}`;
    resultStats.innerHTML = `
      <p>✅ সঠিক: ${correctCount}</p>
      <p>❌ ভুল: ${wrongCount}</p>
    `;
  }

  // Restart quiz
  function restartQuiz() {
    welcomeSec.classList.remove("hidden");
    resultSec.classList.add("hidden");
    quizSec.classList.add("hidden");
  }

  // Update live stats
  function updateLiveStats() {
    liveScoreEl.textContent = score;
    liveCorrectEl.textContent = correctCount;
    liveWrongEl.textContent = wrongCount;
  }

  // Boot
  document.addEventListener("DOMContentLoaded", () => {
    loadQuestions().then((q) => (questions = q));
    startBtn.addEventListener("click", startQuiz);
    playAgain.addEventListener("click", restartQuiz);
  });

  return {};
})();
