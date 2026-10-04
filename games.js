/**
 * ============================================================================
 * 🎮 INTERACTIVE GAMES ENGINE 🎮
 * ============================================================================
 * Complete suite of 5 interactive best friend games:
 * 1. How Well Do You Know Me? (10-Question Quiz)
 * 2. How Well Do I Know You? (Interactive Flip Reveal Quiz)
 * 3. Catch the Hearts ❤️ (Falling Items Arcade Game)
 * 4. Memory Match (Card Matching Pair Game)
 * 5. Choose Your Path (Branching Interactive Adventure)
 * ============================================================================
 */

class FriendshipGames {
  constructor() {
    this.config = window.FRIENDSHIP_CONFIG?.games || {};
    this.activeGameId = 'game-1';
    
    // Game 1 State
    this.quiz1Current = 0;
    this.quiz1Score = 0;
    this.quiz1Answered = false;

    // Game 2 State
    this.quiz2Current = 0;

    // Game 3 State (Catch the Hearts)
    this.heartGame = {
      canvas: null,
      ctx: null,
      score: 0,
      combo: 0,
      timeLeft: 30,
      timerId: null,
      animId: null,
      hearts: [],
      isRunning: false,
      floatingTexts: []
    };

    // Game 4 State (Memory Match)
    this.memoryGame = {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      isLocked: false
    };

    // Game 5 State (Choose Your Path)
    this.storyCurrentNode = 'start';

    this.initTabs();
    this.initGame1();
    this.initGame2();
    this.initGame3();
    this.initGame4();
    this.initGame5();
  }

  initTabs() {
    const tabButtons = document.querySelectorAll('.game-tab-btn');
    const gamePanels = document.querySelectorAll('.game-panel');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-game');
        this.activeGameId = targetId;

        tabButtons.forEach(b => b.classList.remove('active'));
        gamePanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }

        if (targetId === 'game-3') {
          this.resizeHeartCanvas();
        } else if (this.heartGame.isRunning) {
          this.pauseHeartGame();
        }
      });
    });
  }

  // GAME 1
  initGame1() {
    this.quiz1Data = this.config.quizAboutMe || {};
    this.questions1 = this.quiz1Data.questions || [];
    this.renderQuiz1Question();

    const restartBtn = document.getElementById('quiz1-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.quiz1Current = 0;
        this.quiz1Score = 0;
        this.quiz1Answered = false;
        document.getElementById('quiz1-question-view').style.display = 'block';
        document.getElementById('quiz1-result-view').style.display = 'none';
        this.renderQuiz1Question();
      });
    }
  }

  renderQuiz1Question() {
    const questionEl = document.getElementById('quiz1-question-text');
    const optionsEl = document.getElementById('quiz1-options-container');
    const progressEl = document.getElementById('quiz1-progress-bar');
    const countEl = document.getElementById('quiz1-count-badge');
    const explanationEl = document.getElementById('quiz1-explanation');

    if (!questionEl || !optionsEl) return;

    if (this.quiz1Current >= this.questions1.length) {
      this.showQuiz1Result();
      return;
    }

    this.quiz1Answered = false;
    const currentQ = this.questions1[this.quiz1Current];
    const totalQ = this.questions1.length;

    questionEl.textContent = currentQ.q;
    countEl.textContent = `Question ${this.quiz1Current + 1} of ${totalQ}`;
    progressEl.style.width = `${((this.quiz1Current) / totalQ) * 100}%`;
    explanationEl.innerHTML = '';
    explanationEl.className = 'quiz-explanation-box';

    optionsEl.innerHTML = '';
    currentQ.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(65 + idx)}</span> <span class="opt-text">${optText}</span>`;
      btn.addEventListener('click', () => this.handleQuiz1Answer(idx, btn));
      optionsEl.appendChild(btn);
    });
  }

  handleQuiz1Answer(selectedIndex, clickedBtn) {
    if (this.quiz1Answered) return;
    this.quiz1Answered = true;

    const currentQ = this.questions1[this.quiz1Current];
    const isCorrect = selectedIndex === currentQ.correct;
    const allButtons = document.querySelectorAll('#quiz1-options-container .quiz-option-btn');
    const explanationEl = document.getElementById('quiz1-explanation');

    if (isCorrect) {
      this.quiz1Score++;
      clickedBtn.classList.add('correct');
      if (window.ConfettiSystem) {
        const rect = clickedBtn.getBoundingClientRect();
        window.ConfettiSystem.burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
      }
    } else {
      clickedBtn.classList.add('incorrect');
      if (allButtons[currentQ.correct]) {
        allButtons[currentQ.correct].classList.add('correct');
      }
    }

    explanationEl.innerHTML = `<strong>${isCorrect ? '✨ Spot on!' : '😅 Close enough!'}</strong> ${currentQ.explanation}`;
    explanationEl.classList.add('visible');

    setTimeout(() => {
      this.quiz1Current++;
      this.renderQuiz1Question();
    }, 2200);
  }

  showQuiz1Result() {
    const questionView = document.getElementById('quiz1-question-view');
    const resultView = document.getElementById('quiz1-result-view');
    const scoreVal = document.getElementById('quiz1-score-val');
    const scoreMsg = document.getElementById('quiz1-score-msg');
    const progressEl = document.getElementById('quiz1-progress-bar');

    if (progressEl) progressEl.style.width = '100%';
    questionView.style.display = 'none';
    resultView.style.display = 'block';

    const score = this.quiz1Score;
    const total = this.questions1.length;
    scoreVal.textContent = `${score} / ${total}`;

    const resConfig = this.quiz1Data.results || {};
    let msg = "";

    if (score <= 3) {
      msg = resConfig.low?.message || "Okay... we need to talk 😂";
    } else if (score <= 6) {
      msg = resConfig.mid?.message || "Not bad!";
    } else if (score <= 9) {
      msg = resConfig.high?.message || "Okay bestie, you actually know me.";
    } else {
      msg = resConfig.perfect?.message || "WHO GAVE YOU ACCESS TO MY BRAIN?! 😭❤️";
    }

    scoreMsg.textContent = msg;

    if (window.ConfettiSystem) {
      window.ConfettiSystem.trigger({ count: score >= 7 ? 120 : 60 });
    }
  }

  // GAME 2
  initGame2() {
    this.quiz2Data = this.config.quizAboutHer || {};
    this.questions2 = this.quiz2Data.questions || [];
    this.renderQuiz2Card();

    const prevBtn = document.getElementById('quiz2-prev-btn');
    const nextBtn = document.getElementById('quiz2-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.quiz2Current > 0) {
          this.quiz2Current--;
          this.renderQuiz2Card();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.quiz2Current < this.questions2.length - 1) {
          this.quiz2Current++;
          this.renderQuiz2Card();
        } else {
          this.showQuiz2Completion();
        }
      });
    }
  }

  renderQuiz2Card() {
    const card = document.getElementById('quiz2-card');
    const countEl = document.getElementById('quiz2-count');
    const questionEl = document.getElementById('quiz2-question');
    const answerEl = document.getElementById('quiz2-answer');
    const funnyNoteEl = document.getElementById('quiz2-funny-note');
    const prevBtn = document.getElementById('quiz2-prev-btn');
    const nextBtn = document.getElementById('quiz2-next-btn');

    if (!card) return;

    card.classList.remove('is-flipped');

    const total = this.questions2.length;
    const current = this.questions2[this.quiz2Current];

    countEl.textContent = `Card ${this.quiz2Current + 1} of ${total}`;
    questionEl.textContent = current.q;
    answerEl.textContent = current.answer;
    funnyNoteEl.textContent = current.funnyNote ? `"${current.funnyNote}"` : '';

    if (prevBtn) prevBtn.disabled = this.quiz2Current === 0;
    if (nextBtn) nextBtn.textContent = this.quiz2Current === total - 1 ? 'Finish & Celebrate ❤️' : 'Next Question →';

    card.onclick = () => {
      card.classList.toggle('is-flipped');
      if (card.classList.contains('is-flipped') && window.ConfettiSystem) {
        const rect = card.getBoundingClientRect();
        window.ConfettiSystem.burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
      }
    };
  }

  showQuiz2Completion() {
    const modal = document.getElementById('quiz2-complete-modal');
    if (modal) {
      modal.classList.add('visible');
      if (window.ConfettiSystem) {
        window.ConfettiSystem.trigger({ count: 100 });
      }
    }
  }

  // GAME 3: CATCH THE HEARTS
  initGame3() {
    const canvas = document.getElementById('catch-hearts-canvas');
    if (!canvas) return;

    this.heartGame.canvas = canvas;
    this.heartGame.ctx = canvas.getContext('2d');

    const startBtn = document.getElementById('catch-hearts-start-btn');
    const replayBtn = document.getElementById('catch-hearts-replay-btn');

    if (startBtn) startBtn.addEventListener('click', () => this.startHeartGame());
    if (replayBtn) replayBtn.addEventListener('click', () => this.startHeartGame());

    const handleTap = (clientX, clientY) => {
      if (!this.heartGame.isRunning) return;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      let caught = false;

      for (let i = this.heartGame.hearts.length - 1; i >= 0; i--) {
        const h = this.heartGame.hearts[i];
        const dist = Math.hypot(x - h.x, y - h.y);

        if (dist <= h.radius + 15) {
          caught = true;
          this.heartGame.combo++;
          const points = 1 * (this.heartGame.combo > 4 ? 2 : 1);
          this.heartGame.score += points;

          this.heartGame.floatingTexts.push({
            x: h.x,
            y: h.y,
            text: points > 1 ? `+${points} Combo!` : `+1`,
            alpha: 1,
            color: points > 1 ? '#FDE047' : '#FFFFFF'
          });

          if (window.ConfettiSystem) {
            window.ConfettiSystem.burstHearts(clientX, clientY, 5);
          }

          this.heartGame.hearts.splice(i, 1);
          break;
        }
      }

      if (!caught) {
        this.heartGame.combo = 0;
      }

      this.updateHeartGameHUD();
    };

    canvas.addEventListener('mousedown', (e) => handleTap(e.clientX, e.clientY));
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        handleTap(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.resizeHeartCanvas();
  }

  resizeHeartCanvas() {
    const container = document.getElementById('catch-hearts-arena');
    if (!container || !this.heartGame.canvas) return;

    this.heartGame.canvas.width = container.clientWidth;
    this.heartGame.canvas.height = 360;
  }

  startHeartGame() {
    this.heartGame.score = 0;
    this.heartGame.combo = 0;
    this.heartGame.timeLeft = this.config.catchTheHearts?.duration || 30;
    this.heartGame.hearts = [];
    this.heartGame.floatingTexts = [];
    this.heartGame.isRunning = true;

    document.getElementById('catch-hearts-start-screen').style.display = 'none';
    document.getElementById('catch-hearts-gameover-screen').style.display = 'none';
    this.updateHeartGameHUD();

    clearInterval(this.heartGame.timerId);
    this.heartGame.timerId = setInterval(() => {
      this.heartGame.timeLeft--;
      this.updateHeartGameHUD();
      if (this.heartGame.timeLeft <= 0) {
        this.endHeartGame();
      }
    }, 1000);

    this.loopHeartGame();
  }

  pauseHeartGame() {
    this.heartGame.isRunning = false;
    clearInterval(this.heartGame.timerId);
    cancelAnimationFrame(this.heartGame.animId);
  }

  updateHeartGameHUD() {
    const scoreEl = document.getElementById('catch-score-val');
    const timerEl = document.getElementById('catch-time-val');
    const comboEl = document.getElementById('catch-combo-val');

    if (scoreEl) scoreEl.textContent = this.heartGame.score;
    if (timerEl) timerEl.textContent = `${this.heartGame.timeLeft}s`;
    if (comboEl) {
      comboEl.textContent = this.heartGame.combo > 1 ? `x${this.heartGame.combo} Streak! 🔥` : '';
    }
  }

  loopHeartGame() {
    if (!this.heartGame.isRunning) return;

    const ctx = this.heartGame.ctx;
    const w = this.heartGame.canvas.width;
    const h = this.heartGame.canvas.height;

    ctx.clearRect(0, 0, w, h);

    if (Math.random() < 0.055) {
      const symbols = ['❤️', '💖', '💗', '🌸', '✨', '🤍'];
      this.heartGame.hearts.push({
        x: Math.random() * (w - 60) + 30,
        y: -30,
        vy: Math.random() * 2.5 + 2.0,
        radius: 20,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        rotation: (Math.random() - 0.5) * 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.03
      });
    }

    for (let i = this.heartGame.hearts.length - 1; i >= 0; i--) {
      const hrt = this.heartGame.hearts[i];
      hrt.y += hrt.vy;
      hrt.rotation += hrt.rotSpeed;

      ctx.save();
      ctx.translate(hrt.x, hrt.y);
      ctx.rotate(hrt.rotation);
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(hrt.symbol, 0, 0);
      ctx.restore();

      if (hrt.y > h + 40) {
        this.heartGame.hearts.splice(i, 1);
        this.heartGame.combo = 0;
        this.updateHeartGameHUD();
      }
    }

    for (let i = this.heartGame.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.heartGame.floatingTexts[i];
      ft.y -= 1.2;
      ft.alpha -= 0.025;

      if (ft.alpha <= 0) {
        this.heartGame.floatingTexts.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.font = 'bold 16px Poppins, sans-serif';
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.alpha;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    this.heartGame.animId = requestAnimationFrame(() => this.loopHeartGame());
  }

  endHeartGame() {
    this.heartGame.isRunning = false;
    clearInterval(this.heartGame.timerId);
    cancelAnimationFrame(this.heartGame.animId);

    const gameOverScreen = document.getElementById('catch-hearts-gameover-screen');
    const finalScoreEl = document.getElementById('catch-final-score');
    const punchlineEl = document.getElementById('catch-punchline');

    if (finalScoreEl) {
      finalScoreEl.textContent = `You collected ${this.heartGame.score} hearts.`;
    }
    if (punchlineEl) {
      punchlineEl.textContent = "But you still haven't collected all of mine. ❤️";
    }

    if (gameOverScreen) {
      gameOverScreen.style.display = 'flex';
    }

    if (window.ConfettiSystem) {
      window.ConfettiSystem.trigger({ count: 90 });
    }
  }

  // GAME 4: MEMORY MATCH
  initGame4() {
    this.memorySymbols = this.config.memoryMatch?.symbols || ['❤️', '🌸', '⭐', '🐱', '🦋', '✨'];
    this.setupMemoryBoard();

    const restartBtn = document.getElementById('memory-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.setupMemoryBoard());
    }
  }

  setupMemoryBoard() {
    const grid = document.getElementById('memory-grid');
    const movesEl = document.getElementById('memory-moves-val');
    const victoryEl = document.getElementById('memory-victory-message');
    if (!grid) return;

    if (victoryEl) victoryEl.style.display = 'none';

    this.memoryGame.flippedCards = [];
    this.memoryGame.matchedPairs = 0;
    this.memoryGame.moves = 0;
    this.memoryGame.isLocked = false;
    if (movesEl) movesEl.textContent = '0';

    const deck = [...this.memorySymbols, ...this.memorySymbols]
      .sort(() => Math.random() - 0.5);

    grid.innerHTML = '';

    deck.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.symbol = symbol;
      card.dataset.index = index;

      card.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-front">
            <span class="memory-card-icon">${symbol}</span>
          </div>
          <div class="memory-card-back">
            <span class="memory-card-q">✨</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => this.handleMemoryCardClick(card));
      grid.appendChild(card);
    });
  }

  handleMemoryCardClick(card) {
    if (this.memoryGame.isLocked) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    this.memoryGame.flippedCards.push(card);

    if (this.memoryGame.flippedCards.length === 2) {
      this.memoryGame.moves++;
      const movesEl = document.getElementById('memory-moves-val');
      if (movesEl) movesEl.textContent = this.memoryGame.moves;

      const [card1, card2] = this.memoryGame.flippedCards;
      const match = card1.dataset.symbol === card2.dataset.symbol;

      if (match) {
        this.memoryGame.matchedPairs++;
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.memoryGame.flippedCards = [];

        if (window.ConfettiSystem) {
          const rect = card2.getBoundingClientRect();
          window.ConfettiSystem.burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 7);
        }

        if (this.memoryGame.matchedPairs === this.memorySymbols.length) {
          setTimeout(() => {
            const victoryEl = document.getElementById('memory-victory-message');
            if (victoryEl) victoryEl.style.display = 'block';
            if (window.ConfettiSystem) {
              window.ConfettiSystem.trigger({ count: 120 });
            }
          }, 600);
        }
      } else {
        this.memoryGame.isLocked = true;
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          this.memoryGame.flippedCards = [];
          this.memoryGame.isLocked = false;
        }, 900);
      }
    }
  }

  // GAME 5: CHOOSE YOUR PATH
  initGame5() {
    this.storyTree = this.config.chooseYourPath?.storyTree || {};
    this.renderStoryNode('start');
  }

  renderStoryNode(nodeKey) {
    const textEl = document.getElementById('story-narrative-text');
    const optionsContainer = document.getElementById('story-options-container');

    if (!textEl || !optionsContainer) return;

    const node = this.storyTree[nodeKey];
    if (!node) return;

    this.storyCurrentNode = nodeKey;

    textEl.style.opacity = '0';
    textEl.style.transform = 'translateY(8px)';

    setTimeout(() => {
      textEl.textContent = node.text;
      textEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      textEl.style.opacity = '1';
      textEl.style.transform = 'translateY(0)';
    }, 200);

    optionsContainer.innerHTML = '';
    node.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'story-choice-btn';
      btn.textContent = opt.text;

      btn.addEventListener('click', () => {
        if (opt.next === 'final_twist' || opt.next === 'the_end') {
          if (window.ConfettiSystem) {
            window.ConfettiSystem.burstHearts(window.innerWidth / 2, window.innerHeight / 2, 14);
          }
        }
        this.renderStoryNode(opt.next);
      });

      optionsContainer.appendChild(btn);
    });
  }
}

window.FriendshipGames = FriendshipGames;
