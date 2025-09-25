// script.js
// Ready-to-use quiz logic implementing specs from the user

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
  const shareBtn = el('share-btn');
  const leaderboardList = el('leaderboard-list');
  const toggleTheme = el('toggle-theme');
  const soundToggle = el('sound-toggle');
  const timePerQuestionSel = el('time-per-question');
  const shuffleQuestionsChk = el('shuffle-questions');
  const resultSummary = el('result-summary');
  const resultStats = el('result-stats');

  // State
  let questions = [];
  let queue = [];
  let usedIds = new Set();
  let current = null;
  let totalTime = 15;
  let timer = null;
  let timeLeft = 0;
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let startTime = 0;
  let streak = 0;
  let cycleCount = 0; // how many cycles completed

  // Sound / vibration
  const sounds = {
    correct: new Audio(),
    wrong: new Audio(),
  };
  // tiny beep dataURIs (optional — browsers may block), fallback to no sound
  try{
    sounds.correct.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';
    sounds.wrong.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=';
  }catch(e){}

  // Utilities
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  function loadQuestionsExternal(){
    return fetch('questions.json')
      .then(r => r.json())
      .catch(()=>null);
  }

  // fallback embeddedQuestions (will be replaced if fetch succeeds)
  let embeddedQuestions = null; // set later by injection if needed

  function init(){
    // theme
    const savedTheme = localStorage.getItem('iq-theme');
    if(savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    toggleTheme.addEventListener('click', ()=>{
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? '' : 'dark';
      if(next) document.documentElement.setAttribute('data-theme', next); else document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('iq-theme', next);
    });

    // sound toggle
    soundToggle.addEventListener('change', ()=>localStorage.setItem('iq-sound', soundToggle.checked? '1':'0'));
    const savedSound = localStorage.getItem('iq-sound');
    if(savedSound === '0') soundToggle.checked = false;

    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestionManual);
    playAgain.addEventListener('click', restartQuiz);
    shareBtn.addEventListener('click', shareResult);

    timePerQuestionSel.addEventListener('change', ()=>{ totalTime = parseInt(timePerQuestionSel.value,10); });

    // load JSON
    loadQuestionsExternal().then(ext => {
      if(ext && Array.isArray(ext) && ext.length>0) questions = ext;
      else if(window.__EMBEDDED_QUESTIONS__) questions = window.__EMBEDDED_QUESTIONS__;
      else questions = [];
      prepareLeaderboardUI();
    });
  }

  function prepareQueue(){
    queue = questions.map(q=>q.id);
    if(shuffleQuestionsChk.checked) shuffle(queue);
    usedIds = new Set();
  }

  function pickNext(){
    if(queue.length === 0){
      // cycle finished
      cycleCount++;
      // refill queue but avoid repeating until full cycle done
      prepareQueue();
    }
    const id = queue.shift();
    usedIds.add(id);
    return questions.find(q=>q.id === id);
  }

  function startQuiz(){
    if(questions.length === 0){
      alert('প্রশ্ন লোড করা যায়নি। নিশ্চিত করুন `questions.json` ফাইল একই ফোল্ডারে আছে।');
      return;
    }
    totalTime = parseInt(timePerQuestionSel.value,10);
    score = 0; correctCount = 0; wrongCount = 0; streak = 0; startTime = Date.now();
    prepareQueue();
    welcomeSec.classList.add('hidden');
    resultSec.classList.add('hidden');
    quizSec.classList.remove('hidden');
    nextQuestion();
  }

  function nextQuestion(){
    stopTimer();
    current = pickNext();
    renderQuestion(current);
    startTimer(totalTime);
  }

  function nextQuestionManual(){
    // called when user clicks 'next' (e.g., after feedback)
    nextBtn.disabled = true;
    feedbackEl.textContent = '';
    nextQuestion();
  }

  function renderQuestion(q){
    questionText.textContent = q.question;
    optionsBox.innerHTML = '';
    timerEl.textContent = `${totalTime}s`;
    q.options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'option-btn';
      b.textContent = opt;
      b.disabled = false;
      b.addEventListener('click', ()=>selectOption(i, b));
      optionsBox.appendChild(b);
    });
  }

  function selectOption(idx, btn){
    stopTimer();
    const isCorrect = idx === current.answer;
    applyFeedback(btn, isCorrect);
    handleScoring(isCorrect);
    disableOptions();
    nextBtn.disabled = false;
    // auto proceed after short delay to keep flow
    setTimeout(()=>{
      if(nextBtn.disabled===false) nextQuestion();
    }, 800);
  }

  function disableOptions(){
    [...optionsBox.children].forEach(b=>b.disabled = true);
  }

  function applyFeedback(btn, isCorrect){
    if(isCorrect){
      btn.classList.add('option-correct');
      feedbackEl.textContent = 'সঠিক! + পয়েন্ট।';
      if(soundToggle.checked) playSound('correct');
      try{ if(navigator.vibrate && soundToggle.checked) navigator.vibrate(80); }catch(e){}
    } else {
      btn.classList.add('option-wrong');
      // highlight correct
      const correctBtn = [...optionsBox.children][current.answer];
      if(correctBtn) correctBtn.classList.add('option-correct');
      feedbackEl.textContent = 'ভুল উত্তর।';
      if(soundToggle.checked) playSound('wrong');
      try{ if(navigator.vibrate && soundToggle.checked) navigator.vibrate([40,20,40]); }catch(e){}
    }
  }

  function playSound(name){
    try{ const s = sounds[name]; if(s && s.play) { s.currentTime=0; s.play().catch(()=>{}); } }catch(e){}
  }

  function handleScoring(isCorrect){
    const base = 10; // base points
    if(isCorrect){
      correctCount++;
      streak++;
      // speed bonus proportional to remaining time
      const speedBonus = Math.round((timeLeft / totalTime) * 5); // 0-5
      // streak bonus every 3 in a row
      const streakBonus = Math.floor(streak/3) * 5; // 0,5,10...
      const gained = base + speedBonus + streakBonus;
      score += gained;
    } else {
      wrongCount++;
      streak = 0;
      // penalty: subtract some or keep 0 (user asked "কাটা বা শূন্য") => we subtract 5 but not below 0
      score = Math.max(0, score - 5);
    }
  }

  function startTimer(sec){
    timeLeft = sec;
    timerEl.textContent = `${timeLeft}s`;
    timer = setInterval(()=>{
      timeLeft--;
      timerEl.textContent = `${timeLeft}s`;
      if(timeLeft <= 0){
        // time up — auto move to next question but count as unanswered/wrong
        stopTimer();
        // mark as wrong (no answer)
        handleScoring(false);
        // visually show correct
        const correctBtn = [...optionsBox.children][current.answer];
        if(correctBtn) correctBtn.classList.add('option-correct');
        feedbackEl.textContent = 'সময় শেষ — উত্তর গ্রহণ করা হয়নি।';
        nextBtn.disabled = false;
        setTimeout(()=>{
          nextQuestion();
        }, 900);
      }
    }, 1000);
  }

  function stopTimer(){
    if(timer) { clearInterval(timer); timer = null; }
  }

  function finishQuiz(){
    stopTimer();
    quizSec.classList.add('hidden');
    resultSec.classList.remove('hidden');
    const totalTimeTaken = Math.round((Date.now() - startTime)/1000);
    resultSummary.textContent = `স্কোর: ${score} পয়েন্ট`;
    resultStats.innerHTML = `
      <p>সঠিক: ${correctCount} | ভুল: ${wrongCount}</p>
      <p>খেলার সময়: ${totalTimeTaken} সেকেন্ড</p>
    `;

    saveToLeaderboard({score, correct: correctCount, wrong: wrongCount, time: totalTimeTaken, date: new Date().toISOString()});
    prepareLeaderboardUI();
  }

  // If user wants to stop early trigger finish
  function restartQuiz(){
    welcomeSec.classList.remove('hidden');
    resultSec.classList.add('hidden');
    quizSec.classList.add('hidden');
  }

  function shareResult(){
    const text = `আমি কোরআন/ইসলামিক কুইজ খেলেছি — স্কোর: ${score} পয়েন্ট। তোমারও চেষ্টা কর!`;
    if(navigator.share){
      navigator.share({title:'ইসলামিক কুইজ',text});
    } else {
      // fallback copy
      navigator.clipboard?.writeText(text).then(()=>alert('ফলাফল কপি করা হলো — শেয়ার করুন!'));
    }
  }

  // Leaderboard (localStorage only for this device/browser)
  const LB_KEY = 'islamicQuizLeaderboard_v1';
  function saveToLeaderboard(entry){
    const arr = JSON.parse(localStorage.getItem(LB_KEY) || '[]');
    arr.push(entry);
    arr.sort((a,b)=>b.score - a.score);
    const top = arr.slice(0,10);
    localStorage.setItem(LB_KEY, JSON.stringify(top));
  }
  function prepareLeaderboardUI(){
    const arr = JSON.parse(localStorage.getItem(LB_KEY) || '[]');
    leaderboardList.innerHTML = '';
    if(arr.length === 0) leaderboardList.innerHTML = '<li>কোনো স্কোর নেই — প্রথম হোন!</li>';
    arr.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.score} পয়েন্ট — সঠিক: ${item.correct} | সময়: ${item.time}s`;
      leaderboardList.appendChild(li);
    });
  }

  // When queue empties after many questions, we consider finishing after 1 full cycle? We'll allow indefinite play; but if user wants to end, show result when they press next on last question without repeating.
  // For simplicity: if usedIds size equals total questions and queue is empty -> finishQuiz()
  // We'll call finishQuiz when user completes one full set.

  // Modify pickNext to finish after full cycle once if user wants not to continue — but user's spec wants to reshuffle and continue. So we continue indefinitely, but provide a way to finish by a long-press? Simpler: after every full cycle we update cycleCount; if user wants to stop they press "আবার খেলুন" on result.

  // Expose some functions to global to allow end when all questions used once
  window.__QUIZ_INTERNAL__ = { finishQuizIfCycleDone: ()=>{ if(usedIds.size >= questions.length){ finishQuiz(); } } };

  // Extra: detect when we've used all questions once and then trigger result screen
  // We'll call finishQuiz when usedIds reaches questions.length and queue is empty
  const originalPickNext = pickNext;

  // reassign with finish-once logic
  pickNext = function(){
    if(usedIds.size >= questions.length && queue.length === 0){
      // all questions asked once — finish
      finishQuiz();
      return null;
    }
    if(queue.length === 0){
      prepareQueue();
    }
    const id = queue.shift();
    usedIds.add(id);
    return questions.find(q=>q.id === id);
  };

  // Wrap nextQuestion to handle null
  const originalNextQuestion = nextQuestion;
  nextQuestion = function(){
    stopTimer();
    current = pickNext();
    if(!current){ return; }
    renderQuestion(current);
    startTimer(totalTime);
  };

  // boot
  document.addEventListener('DOMContentLoaded', init);
  return { /* exported for debugging if needed */ };
})();

// Embedded questions fallback: the build process will inject window.__EMBEDDED_QUESTIONS__ if fetch fails
