// কুইজ অ্যাপ্লিকেশন মূল লজিক
class IslamicQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.timePerQuestion = 15;
        this.timer = null;
        this.timeLeft = 0;
        this.quizStartTime = 0;
        this.quizEndTime = 0;
        this.selectedCategory = 'all';
        this.soundEnabled = true;
        this.vibrationEnabled = true;
        this.theme = 'light';
        
        this.initializeApp();
    }
    
    // অ্যাপ্লিকেশন ইনিশিয়ালাইজেশন
    initializeApp() {
        this.loadQuestions();
        this.setupEventListeners();
        this.loadSettings();
        this.applyTheme();
        this.updateLeaderboardDisplay();
    }
    
    // প্রশ্ন লোড করা
    loadQuestions() {
        // questions.json থেকে প্রশ্ন লোড হবে
        // ডেমো উদ্দেশ্যে কিছু প্রশ্ন এখানে যোগ করা হলো
        this.questions = [
            {
                id: 1,
                question: "ইসলামের পাঁচটি স্তম্ভের মধ্যে প্রথমটি কী?",
                options: ["নামায", "রোযা", "শাহাদাহ", "হজ্জ"],
                correctAnswer: 2,
                category: "fiqh",
                explanation: "ইসলামের প্রথম স্তম্ভ হল শাহাদাহ বা ঈমানের সাক্ষ্য দেওয়া।"
            },
            {
                id: 2,
                question: "কুরআন মজিদে কয়টি সূরা আছে?",
                options: ["114", "120", "100", "99"],
                correctAnswer: 0,
                category: "quran",
                explanation: "পবিত্র কুরআনে মোট ১১৪টি সূরা রয়েছে।"
            },
            {
                id: 3,
                question: "প্রথম মুয়াযযিন কে ছিলেন?",
                options: ["হযরত উমর (রা)", "হযরত বিলাল (রা)", "হযরত আলী (রা)", "হযরত আবু বকর (রা)"],
                correctAnswer: 1,
                category: "history",
                explanation: "ইসলামের প্রথম মুয়াযযিন ছিলেন হযরত বিলাল (রা)।"
            },
            {
                id: 4,
                question: "রমজান মাসে রোযা রাখা ইসলামের কত নম্বর স্তম্ভ?",
                options: ["প্রথম", "দ্বিতীয়", "তৃতীয়", "চতুর্থ"],
                correctAnswer: 2,
                category: "fiqh",
                explanation: "রমজানের রোযা ইসলামের তৃতীয় স্তম্ভ।"
            },
            {
                id: 5,
                question: "কাবা শরীফ কোন শহরে অবস্থিত?",
                options: ["মদিনা", "জেদ্দা", "মক্কা", "রিয়াদ"],
                correctAnswer: 2,
                category: "history",
                explanation: "কাবা শরীফ সৌদি আরবের মক্কা নগরীতে অবস্থিত।"
            },
            {
                id: 6,
                question: "কুরআন মজিদের সর্ববৃহৎ সূরার নাম কী?",
                options: ["সূরা বাকারা", "সূরা আল-ইমরান", "সূরা নিসা", "সূরা ফাতিহা"],
                correctAnswer: 0,
                category: "quran",
                explanation: "কুরআনের সর্ববৃহৎ সূরা হল সূরা বাকারা যাতে ২৮৬টি আয়াত রয়েছে।"
            },
            {
                id: 7,
                question: "হাদিস সংকলনের ক্ষেত্রে সবচেয়ে নির্ভরযোগ্য গ্রন্থ কোনটি?",
                options: ["সহীহ বুখারী", "সহীহ মুসলিম", "সুনান আবু দাউদ", "জামে তিরমিজী"],
                correctAnswer: 0,
                category: "hadith",
                explanation: "সহীহ বুখারী হাদিসের সবচেয়ে নির্ভরযোগ্য গ্রন্থ হিসেবে স্বীকৃত।"
            },
            {
                id: 8,
                question: "ইসলামি বর্ষপঞ্জির প্রথম মাস কোনটি?",
                options: ["রমজান", "শাওয়াল", "মুহাররম", "সফর"],
                correctAnswer: 2,
                category: "history",
                explanation: "হিজরি সনের প্রথম মাস হল মুহাররম।"
            },
            {
                id: 9,
                question: "দৈনিক কয় ওয়াক্ত নামায ফরজ?",
                options: ["৩", "৪", "৫", "৬"],
                correctAnswer: 2,
                category: "fiqh",
                explanation: "প্রতিদিন ৫ ওয়াক্ত নামায মুসলমানদের উপর ফরজ।"
            },
            {
                id: 10,
                question: "ইসলামের সর্বশেষ নবী কে?",
                options: ["হযরত মুসা (আ)", "হযরত ঈসা (আ)", "হযরত ইব্রাহিম (আ)", "হযরত মুহাম্মদ (সা)"],
                correctAnswer: 3,
                category: "history",
                explanation: "হযরত মুহাম্মদ (সা) হলেন ইসলামের সর্বশেষ নবী।"
            }
        ];
    }
    
    // ইভেন্ট লিসেনার সেটআপ
    setupEventListeners() {
        // হোম স্ক্রিন বাটন
        document.getElementById('startQuiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('showLeaderboard').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('toggleTheme').addEventListener('click', () => this.toggleTheme());
        
        // কুইজ স্ক্রিন বাটন
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
        
        // ফলাফল স্ক্রিন বাটন
        document.getElementById('playAgain').addEventListener('click', () => this.playAgain());
        document.getElementById('shareResult').addEventListener('click', () => this.shareResult());
        document.getElementById('backToHome').addEventListener('click', () => this.backToHome());
        
        // লিডারবোর্ড স্ক্রিন বাটন
        document.getElementById('backFromLeaderboard').addEventListener('click', () => this.backToHome());
        
        // সেটিংস পরিবর্তন
        document.getElementById('categorySelect').addEventListener('change', (e) => {
            this.selectedCategory = e.target.value;
            this.saveSettings();
        });
        
        document.getElementById('timeSelect').addEventListener('change', (e) => {
            this.timePerQuestion = parseInt(e.target.value);
            this.saveSettings();
        });
        
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
            this.saveSettings();
        });
        
        document.getElementById('vibrationToggle').addEventListener('change', (e) => {
            this.vibrationEnabled = e.target.checked;
            this.saveSettings();
        });
    }
    
    // সেটিংস লোড করা
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('quizSettings')) || {};
        
        this.selectedCategory = settings.category || 'all';
        this.timePerQuestion = settings.timePerQuestion || 15;
        this.soundEnabled = settings.soundEnabled !== undefined ? settings.soundEnabled : true;
        this.vibrationEnabled = settings.vibrationEnabled !== undefined ? settings.vibrationEnabled : true;
        this.theme = settings.theme || 'light';
        
        // UI-তে সেটিংস আপডেট
        document.getElementById('categorySelect').value = this.selectedCategory;
        document.getElementById('timeSelect').value = this.timePerQuestion;
        document.getElementById('soundToggle').checked = this.soundEnabled;
        document.getElementById('vibrationToggle').checked = this.vibrationEnabled;
    }
    
    // সেটিংস সেভ করা
    saveSettings() {
        const settings = {
            category: this.selectedCategory,
            timePerQuestion: this.timePerQuestion,
            soundEnabled: this.soundEnabled,
            vibrationEnabled: this.vibrationEnabled,
            theme: this.theme
        };
        
        localStorage.setItem('quizSettings', JSON.stringify(settings));
    }
    
    // থিম টগল করা
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveSettings();
    }
    
    // থিম প্রয়োগ করা
    applyTheme() {
        document.body.setAttribute('data-theme', this.theme);
    }
    
    // কুইজ শুরু করা
    startQuiz() {
        // প্রশ্ন শাফল করা
        this.shuffleQuestions();
        
        // ভেরিয়েবল রিসেট করা
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.quizStartTime = Date.now();
        
        // স্ক্রিন পরিবর্তন
        this.showScreen('quizScreen');
        
        // প্রথম প্রশ্ন দেখানো
        this.displayQuestion();
        
        // টাইমার শুরু করা
        this.startTimer();
    }
    
    // প্রশ্ন শাফল করা
    shuffleQuestions() {
        // নির্বাচিত ক্যাটেগরির প্রশ্ন ফিল্টার করা
        let filteredQuestions = this.questions;
        if (this.selectedCategory !== 'all') {
            filteredQuestions = this.questions.filter(q => q.category === this.selectedCategory);
        }
        
        // ফিশার-য়েটস শাফল অ্যালগরিদম
        for (let i = filteredQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
        }
        
        // সর্বোচ্চ ১০টি প্রশ্ন নেওয়া
        this.quizQuestions = filteredQuestions.slice(0, 10);
    }
    
    // প্রশ্ন প্রদর্শন করা
    displayQuestion() {
        const currentQuestion = this.quizQuestions[this.currentQuestionIndex];
        
        // প্রশ্ন কাউন্টার আপডেট
        document.getElementById('questionCounter').textContent = 
            `প্রশ্ন: ${this.currentQuestionIndex + 1}/${this.quizQuestions.length}`;
        
        // স্কোর আপডেট
        document.getElementById('currentScore').textContent = this.score;
        
        // প্রশ্ন টেক্সট আপডেট
        document.getElementById('questionText').textContent = currentQuestion.question;
        
        // প্রোগ্রেস বার আপডেট
        const progressPercent = (this.currentQuestionIndex / this.quizQuestions.length) * 100;
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
        
        // অপশনগুলি তৈরি করা
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        currentQuestion.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        // পরবর্তী প্রশ্ন বাটন ডিসেবল করা
        document.getElementById('nextQuestion').disabled = true;
        
        // টাইমার রিসেট করা
        this.resetTimer();
    }
    
    // অপশন সিলেক্ট করা
    selectOption(selectedIndex) {
        // যদি ইতিমধ্যে উত্তর দেওয়া হয়ে থাকে, তাহলে আর কিছু না করা
        if (document.querySelector('.option.selected')) return;
        
        const currentQuestion = this.quizQuestions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        
        // নির্বাচিত অপশন মার্ক করা
        options[selectedIndex].classList.add('selected');
        
        // সঠিক উত্তর চেক করা
        if (selectedIndex === currentQuestion.correctAnswer) {
            // সঠিক উত্তর
            options[selectedIndex].classList.add('correct');
            this.correctAnswers++;
            
            // স্কোর ক্যালকুলেশন
            const timeBonus = this.timeLeft > 0 ? Math.floor(this.timeLeft / 3) : 0;
            const basePoints = 100;
            const bonusPoints = timeBonus;
            const totalPoints = basePoints + bonusPoints;
            
            this.score += totalPoints;
            
            // সাউন্ড এবং ভাইব্রেশন
            this.playSound('correct');
            this.vibrate([100]);
            
            // ফিডব্যাক দেখানো
            this.showFeedback(true, currentQuestion.explanation, bonusPoints);
        } else {
            // ভুল উত্তর
            options[selectedIndex].classList.add('wrong');
            options[currentQuestion.correctAnswer].classList.add('correct');
            this.wrongAnswers++;
            
            // সাউন্ড এবং ভাইব্রেশন
            this.playSound('wrong');
            this.vibrate([100, 50, 100]);
            
            // ফিডব্যাক দেখানো
            this.showFeedback(false, currentQuestion.explanation, 0);
        }
        
        // টাইমার বন্ধ করা
        this.stopTimer();
        
        // পরবর্তী প্রশ্ন বাটন এনাবল করা
        document.getElementById('nextQuestion').disabled = false;
    }
    
    // ফিডব্যাক দেখানো
    showFeedback(isCorrect, explanation, bonusPoints) {
        // এই অংশে ফিডব্যাক পপআপ বা টুলটিপ যোগ করা যেতে পারে
        console.log(isCorrect ? 'সঠিক উত্তর!' : 'ভুল উত্তর!', explanation, bonusPoints > 0 ? `বোনাস: ${bonusPoints}` : '');
    }
    
    // পরবর্তী প্রশ্ন
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.quizQuestions.length) {
            this.displayQuestion();
            this.startTimer();
        } else {
            this.finishQuiz();
        }
    }
    
    // কুইজ শেষ করা
    finishQuiz() {
        this.quizEndTime = Date.now();
        this.showResults();
        this.saveToLeaderboard();
    }
    
    // ফলাফল দেখানো
    showResults() {
        // স্ক্রিন পরিবর্তন
        this.showScreen('resultScreen');
        
        // মোট সময় ক্যালকুলেশন
        const timeTaken = Math.floor((this.quizEndTime - this.quizStartTime) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // ফলাফল আপডেট
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = `${this.correctAnswers}/${this.quizQuestions.length}`;
        document.getElementById('wrongAnswers').textContent = `${this.wrongAnswers}/${this.quizQuestions.length}`;
        document.getElementById('timeTaken').textContent = timeString;
        
        // ব্যাজ প্রদর্শন
        this.displayBadge();
        
        // অ্যাচিভমেন্ট প্রদর্শন
        this.displayAchievements();
    }
    
    // ব্যাজ প্রদর্শন
    displayBadge() {
        const badgeContainer = document.getElementById('resultBadge');
        badgeContainer.innerHTML = '';
        
        let badgeEmoji = '😊';
        let badgeText = 'ভালো চেষ্টা!';
        
        const accuracy = (this.correctAnswers / this.quizQuestions.length) * 100;
        
        if (accuracy === 100) {
            badgeEmoji = '🏆';
            badgeText = 'উত্তম! পারফেক্ট স্কোর!';
        } else if (accuracy >= 80) {
            badgeEmoji = '⭐';
            badgeText = 'অসাধারণ!';
        } else if (accuracy >= 60) {
            badgeEmoji = '👍';
            badgeText = 'ভালো হয়েছে!';
        } else if (accuracy >= 40) {
            badgeEmoji = '🙂';
            badgeText = 'চেষ্টা চালিয়ে যান!';
        }
        
        badgeContainer.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 10px;">${badgeEmoji}</div>
            <div style="font-size: 1.2rem; font-weight: bold;">${badgeText}</div>
        `;
    }
    
    // অ্যাচিভমেন্ট প্রদর্শন
    displayAchievements() {
        const achievementsContainer = document.getElementById('achievementsContainer');
        achievementsContainer.innerHTML = '';
        
        const achievements = [];
        
        // অ্যাচিভমেন্ট চেক করা
        if (this.correctAnswers === this.quizQuestions.length) {
            achievements.push({ emoji: '🏆', text: 'পারফেক্ট স্কোর' });
        }
        
        if (this.correctAnswers >= 8) {
            achievements.push({ emoji: '⭐', text: 'উচ্চ স্কোর' });
        }
        
        if (this.score > 800) {
            achievements.push({ emoji: '💎', text: 'স্কোর মাস্টার' });
        }
        
        if (this.timePerQuestion > 0 && this.wrongAnswers === 0) {
            achievements.push({ emoji: '⚡', text: 'দ্রুত উত্তর' });
        }
        
        // অ্যাচিভমেন্টগুলি প্রদর্শন
        achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement';
            achievementElement.innerHTML = `
                <span class="achievement-icon">${achievement.emoji}</span>
                <span>${achievement.text}</span>
            `;
            achievementsContainer.appendChild(achievementElement);
        });
        
        // যদি কোনো অ্যাচিভমেন্ট না থাকে
        if (achievements.length === 0) {
            achievementsContainer.innerHTML = '<p>আরও অ্যাচিভমেন্ট অর্জন করতে চেষ্টা চালিয়ে যান!</p>';
        }
    }
    
    // লিডারবোর্ডে সেভ করা
    saveToLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
        const timeTaken = Math.floor((this.quizEndTime - this.quizStartTime) / 1000);
        
        const entry = {
            score: this.score,
            correctAnswers: this.correctAnswers,
            totalQuestions: this.quizQuestions.length,
            timeTaken: timeTaken,
            date: new Date().toLocaleDateString('bn-BD')
        };
        
        leaderboard.push(entry);
        
        // স্কোর অনুযায়ী সাজানো (উচ্চ থেকে নিম্ন)
        leaderboard.sort((a, b) => b.score - a.score);
        
        // সর্বোচ্চ ১০টি এন্ট্রি রাখা
        if (leaderboard.length > 10) {
            leaderboard.splice(10);
        }
        
        localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));
        this.updateLeaderboardDisplay();
    }
    
    // লিডারবোর্ড আপডেট করা
    updateLeaderboardDisplay() {
        const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
        const leaderboardList = document.getElementById('leaderboardList');
        
        if (!leaderboardList) return;
        
        leaderboardList.innerHTML = '';
        
        if (leaderboard.length === 0) {
            leaderboardList.innerHTML = '<p>এখনও কোনো স্কোর সংরক্ষণ করা হয়নি। কুইজ খেলে আপনার স্কোর সংরক্ষণ করুন!</p>';
            return;
        }
        
        leaderboard.forEach((entry, index) => {
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';
            
            const minutes = Math.floor(entry.timeTaken / 60);
            const seconds = entry.timeTaken % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            leaderboardItem.innerHTML = `
                <div class="leaderboard-rank">${index + 1}</div>
                <div>
                    <div class="leaderboard-score">স্কোর: ${entry.score}</div>
                    <div>সঠিক: ${entry.correctAnswers}/${entry.totalQuestions}</div>
                </div>
                <div class="leaderboard-date">${entry.date}<br>${timeString}</div>
            `;
            
            leaderboardList.appendChild(leaderboardItem);
        });
    }
    
    // লিডারবোর্ড দেখানো
    showLeaderboard() {
        this.showScreen('leaderboardScreen');
        this.updateLeaderboardDisplay();
    }
    
    // আবার খেলা
    playAgain() {
        this.startQuiz();
    }
    
    // ফলাফল শেয়ার করা
    shareResult() {
        const accuracy = (this.correctAnswers / this.quizQuestions.length) * 100;
        const timeTaken = Math.floor((this.quizEndTime - this.quizStartTime) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        
        const shareText = `আমি ইসলামিক কুইজে ${this.score} স্কোর অর্জন করেছি! ${this.correctAnswers}/${this.quizQuestions.length} সঠিক উত্তর দিয়ে ${accuracy.toFixed(1)}% একুরেসি অর্জন করেছি। সময়: ${minutes}:${seconds.toString().padStart(2, '0')}। আপনিও খেলুন: ${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'ইসলামিক কুইজ ফলাফল',
                text: shareText,
                url: window.location.href
            }).catch(err => {
                console.log('শেয়ার ক্যানসেল্ড', err);
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }
    
    // ফ্যালব্যাক শেয়ার সিস্টেম
    fallbackShare(shareText) {
        // ক্লিপবোর্ডে কপি করার চেষ্টা করা
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে! আপনি এখন এটি শেয়ার করতে পারেন।');
            }).catch(err => {
                alert(shareText + '\n\nউপরের টেক্সটটি কপি করে শেয়ার করুন।');
            });
        } else {
            alert(shareText + '\n\nউপরের টেক্সটটি কপি করে শেয়ার করুন।');
        }
    }
    
    // হোমে ফিরে যাওয়া
    backToHome() {
        this.showScreen('homeScreen');
    }
    
    // স্ক্রিন দেখানো
    showScreen(screenId) {
        // সব স্ক্রিন লুকানো
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // টার্গেট স্ক্রিন দেখানো
        document.getElementById(screenId).classList.add('active');
    }
    
    // টাইমার ম্যানেজমেন্ট
    startTimer() {
        if (this.timePerQuestion === 0) return;
        
        this.timeLeft = this.timePerQuestion;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    // টাইমার আপডেট
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.timeLeft;
            
            // সময় কমে গলে রং পরিবর্তন
            if (this.timeLeft <= 5) {
                timerElement.style.color = 'var(--error)';
                timerElement.classList.add('pulse');
            } else {
                timerElement.style.color = 'var(--secondary-color)';
                timerElement.classList.remove('pulse');
            }
        }
    }
    
    // টাইম আপ
    timeUp() {
        this.stopTimer();
        this.playSound('timeUp');
        this.vibrate([200, 100, 200]);
        
        // স্বয়ংক্রিয়ভাবে পরবর্তী প্রশ্নে যাওয়া
        if (!document.querySelector('.option.selected')) {
            this.wrongAnswers++;
            this.nextQuestion();
        }
    }
    
    // টাইমার বন্ধ করা
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    // টাইমার রিসেট করা
    resetTimer() {
        this.stopTimer();
        this.timeLeft = this.timePerQuestion;
        this.updateTimerDisplay();
    }
    
    // সাউন্ড প্লে করা
    playSound(soundType) {
        if (!this.soundEnabled) return;
        
        const soundMap = {
            correct: document.getElementById('correctSound'),
            wrong: document.getElementById('wrongSound'),
            timeUp: document.getElementById('timeUpSound')
        };
        
        const sound = soundMap[soundType];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('সাউন্ড প্লে করা যায়নি:', e));
        }
    }
    
    // ভাইব্রেশন
    vibrate(pattern) {
        if (!this.vibrationEnabled || !navigator.vibrate) return;
        
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            console.log('ভাইব্রেশন সাপোর্ট করে না');
        }
    }
}

// অ্যাপ্লিকেশন শুরু করা যখন DOM লোড হয়
document.addEventListener('DOMContentLoaded', () => {
    new IslamicQuiz();
});
