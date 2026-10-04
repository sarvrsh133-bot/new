/**
 * ============================================================================
 * 💖 MAIN APPLICATION CONTROLLER 💖
 * ============================================================================
 * Orchestrates:
 * - Cinematic Intro Sequence & Page Transition
 * - Floating Navigation & Mobile Hamburger Drawer
 * - Dynamic Section Rendering from config.js
 * - Envelope Open Animations & Modal Reader
 * - Memory Polaroid Lightbox
 * - "You Are..." Compliment Generator
 * - 5 Hidden Surprises (Easter Eggs) Tracker & Toasts
 * - Final Surprise Grand Climax & Replay
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.FRIENDSHIP_CONFIG || {};

  // 1. Initialize Particles Background
  const particles = new ParticleBackground('stars-canvas');

  // 2. Initialize Audio Player
  const audioPlayer = new FriendshipAudioPlayer();

  // 3. Initialize Interactive Games Engine
  const gamesEngine = new FriendshipGames();

  // 4. Initialize Secrets Tracker
  const secretsState = {
    discovered: new Set(),
    total: config.hiddenSurprises?.length || 5
  };

  // ─── 5. CINEMATIC INTRO SEQUENCE ──────────────────────────────────────────
  const introOverlay = document.getElementById('cinematic-intro-overlay');
  const mainApp = document.getElementById('main-website-wrapper');
  const line1 = document.getElementById('intro-line-1');
  const line2 = document.getElementById('intro-line-2');
  const line3 = document.getElementById('intro-line-3');
  const introBtn = document.getElementById('intro-enter-btn');
  const warningText = document.getElementById('intro-warning-text');

  if (config.landing) {
    if (line1) line1.textContent = config.landing.firstLine || "Hey you... 👀";
    if (line2) line2.textContent = config.landing.secondLine || "Yes, YOU.";
    if (line3) line3.textContent = config.landing.thirdLine || "I made something for you.";
    if (introBtn) introBtn.querySelector('.btn-label').textContent = config.landing.buttonText || "Enter My Little Universe ✨";
    if (warningText) warningText.textContent = config.landing.warningText || "Warning: You may accidentally smile a lot.";
  }

  setTimeout(() => { if (line1) line1.classList.add('visible'); }, 600);
  setTimeout(() => { if (line2) line2.classList.add('visible'); }, 1800);
  setTimeout(() => { if (line3) line3.classList.add('visible'); }, 3000);
  setTimeout(() => {
    if (introBtn) introBtn.classList.add('visible');
    if (warningText) warningText.classList.add('visible');
  }, 4200);

  if (introBtn) {
    introBtn.addEventListener('click', () => {
      if (window.ConfettiSystem) {
        window.ConfettiSystem.burstHearts(window.innerWidth / 2, window.innerHeight / 2, 20);
      }
      
      introOverlay.classList.add('portal-transition');
      mainApp.classList.add('visible');
      window.scrollTo({ top: 0, behavior: 'instant' });

      setTimeout(() => {
        introOverlay.style.display = 'none';
        initScrollAnimations();
      }, 1100);
    });
  }

  // ─── 6. NAVIGATION & MOBILE DRAWER ────────────────────────────────────────
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navDrawer = document.getElementById('nav-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');
  const floatingNav = document.getElementById('floating-navbar');
  const secretsCounterBadge = document.getElementById('secrets-badge-count');

  if (mobileToggle && navDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          if (navDrawer) {
            navDrawer.classList.remove('open');
            if (mobileToggle) mobileToggle.classList.remove('active');
          }
          const navHeight = floatingNav ? floatingNav.offsetHeight + 24 : 80;
          const targetY = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    });
  });

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => {
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });
      }
    });

    if (floatingNav) {
      if (window.scrollY > 40) {
        floatingNav.classList.add('scrolled');
      } else {
        floatingNav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  const floatingMusicBtn = document.getElementById('floating-music-btn');
  if (floatingMusicBtn) {
    floatingMusicBtn.addEventListener('click', () => {
      audioPlayer.togglePlay();
    });
  }

  // ─── 6b. DAILY REMINDER 🌷 ────────────────────────────────────────────────
  const reminderTextEl = document.getElementById('daily-reminder-text');
  const refreshReminderBtn = document.getElementById('refresh-reminder-btn');
  const reminders = config.dailyReminders || [
    "You are doing better than you think.",
    "You are allowed to rest.",
    "You are deeply loved.",
    "You don't have to have everything figured out.",
    "You're someone's favorite person.",
    "You make the world better just by being you."
  ];

  let currentReminderIndex = Math.floor(Math.random() * reminders.length);
  if (reminderTextEl) {
    reminderTextEl.textContent = `"${reminders[currentReminderIndex]}"`;
  }

  if (refreshReminderBtn && reminderTextEl) {
    refreshReminderBtn.addEventListener('click', () => {
      let nextIndex = Math.floor(Math.random() * reminders.length);
      if (reminders.length > 1 && nextIndex === currentReminderIndex) {
        nextIndex = (currentReminderIndex + 1) % reminders.length;
      }
      currentReminderIndex = nextIndex;

      reminderTextEl.style.opacity = '0';
      reminderTextEl.style.transform = 'translateY(5px)';

      setTimeout(() => {
        reminderTextEl.textContent = `"${reminders[currentReminderIndex]}"`;
        reminderTextEl.style.opacity = '1';
        reminderTextEl.style.transform = 'translateY(0)';
      }, 200);

      if (window.ConfettiSystem) {
        const rect = refreshReminderBtn.getBoundingClientRect();
        window.ConfettiSystem.burstHearts(rect.left + 12, rect.top + 12, 6);
      }
    });
  }

  // ─── 7. RENDER SECTION 1: OUR STORY (TIMELINE) ───────────────────────────
  const timelineContainer = document.getElementById('story-timeline-container');
  if (timelineContainer && config.ourStory) {
    timelineContainer.innerHTML = '';
    config.ourStory.forEach((item, index) => {
      const isEven = index % 2 === 0;
      const card = document.createElement('div');
      card.className = `timeline-item ${isEven ? 'left' : 'right'} scroll-reveal`;

      card.innerHTML = `
        <div class="timeline-dot">
          <span class="dot-pulse"></span>
        </div>
        <div class="timeline-card glass-card">
          <div class="timeline-tag">${item.tag || 'Memory'}</div>
          <div class="timeline-date">${item.date}</div>
          <h3 class="timeline-title">${item.title}</h3>
          <div class="timeline-img-wrapper">
            <img src="${item.image}" alt="${item.title}" loading="lazy" class="timeline-photo" />
          </div>
          <p class="timeline-story">${item.story}</p>
          <div class="timeline-caption">"${item.caption}"</div>
        </div>
      `;
      timelineContainer.appendChild(card);
    });
  }

  // ─── 8. RENDER SECTION 2: WHY YOU'RE SPECIAL ─────────────────────────────
  const specialGrid = document.getElementById('special-cards-grid');
  if (specialGrid && config.whyYoureSpecial) {
    specialGrid.innerHTML = '';
    config.whyYoureSpecial.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'special-flip-card scroll-reveal';
      card.innerHTML = `
        <div class="special-card-inner">
          <div class="special-card-front glass-card">
            <div class="card-sparkle-icon">${item.icon}</div>
            <div class="card-badge">${item.badge}</div>
            <h3 class="card-title">${item.title}</h3>
            <p class="card-tap-hint">Tap to reveal 🤍</p>
          </div>
          <div class="special-card-back glass-card">
            <div class="card-back-icon">✨</div>
            <h4 class="card-back-title">${item.title}</h4>
            <p class="card-back-text">${item.reveal}</p>
            <span class="card-back-footer">Forever Appreciated ❤️</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        if (card.classList.contains('flipped') && window.ConfettiSystem) {
          const rect = card.getBoundingClientRect();
          window.ConfettiSystem.burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
        }
      });

      specialGrid.appendChild(card);
    });
  }

  // ─── 9. RENDER SECTION 3: MEMORIES ───────────────────────────────────────
  const galleryGrid = document.getElementById('memories-gallery-grid');
  const memoryCounterEl = document.getElementById('memory-counter-text');
  const lightboxModal = document.getElementById('memory-lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxDate = document.getElementById('lightbox-date');
  const lightboxStory = document.getElementById('lightbox-story');
  const lightboxClose = document.getElementById('lightbox-close-btn');
  const lightboxPrev = document.getElementById('lightbox-prev-btn');
  const lightboxNext = document.getElementById('lightbox-next-btn');

  let currentLightboxIndex = 0;
  const memoryList = config.memories?.items || [];

  if (memoryCounterEl && config.memories?.counterText) {
    memoryCounterEl.textContent = config.memories.counterText;
  }

  if (galleryGrid && memoryList.length > 0) {
    galleryGrid.innerHTML = '';
    memoryList.forEach((mem, idx) => {
      const rot = (Math.sin(idx * 1.7) * 3).toFixed(1);
      const polaroid = document.createElement('div');
      polaroid.className = 'polaroid-card scroll-reveal';
      polaroid.style.setProperty('--rot', `${rot}deg`);

      polaroid.innerHTML = `
        <div class="polaroid-pin"></div>
        <div class="polaroid-photo-frame">
          <img src="${mem.image}" alt="${mem.title}" loading="lazy" class="polaroid-photo" />
          <div class="polaroid-overlay">
            <span>Click to view ✨</span>
          </div>
        </div>
        <div class="polaroid-caption-area">
          <p class="polaroid-caption">"${mem.caption}"</p>
          <span class="polaroid-date">${mem.date}</span>
        </div>
      `;

      polaroid.addEventListener('click', () => openLightbox(idx));
      galleryGrid.appendChild(polaroid);
    });
  }

  function openLightbox(index) {
    currentLightboxIndex = index;
    const mem = memoryList[currentLightboxIndex];
    if (!mem || !lightboxModal) return;

    lightboxImg.src = mem.image;
    lightboxCaption.textContent = `"${mem.caption}"`;
    lightboxDate.textContent = mem.date;
    lightboxStory.textContent = mem.story || '';
    lightboxModal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex - 1 + memoryList.length) % memoryList.length;
      openLightbox(currentLightboxIndex);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentLightboxIndex = (currentLightboxIndex + 1) % memoryList.length;
      openLightbox(currentLightboxIndex);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('visible')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev?.click();
    if (e.key === 'ArrowRight') lightboxNext?.click();
  });

  // ─── 9b. MEMORY CAPSULE ✨ (LOCAL STORAGE PERSISTENCE) ───────────────────
  const capsuleInput = document.getElementById('capsule-input-text');
  const capsuleSaveBtn = document.getElementById('capsule-save-btn');
  const capsuleList = document.getElementById('capsule-memories-list');
  const capsuleBadge = document.getElementById('capsule-count-badge');
  const CAPSULE_STORAGE_KEY = 'bestfriend_memory_capsule';

  function getCapsuleMemories() {
    try {
      const stored = localStorage.getItem(CAPSULE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read localStorage:", e);
    }
    return [
      {
        id: 1,
        text: "The day we talked for hours without looking at the clock once.",
        date: "Special Milestone"
      },
      {
        id: 2,
        text: "That hilarious moment when we couldn't stop laughing in public for no reason.",
        date: "Forever Memory"
      }
    ];
  }

  function saveCapsuleMemories(memories) {
    try {
      localStorage.setItem(CAPSULE_STORAGE_KEY, JSON.stringify(memories));
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  }

  function renderCapsuleMemories() {
    if (!capsuleList) return;
    const memories = getCapsuleMemories();
    capsuleList.innerHTML = '';

    if (capsuleBadge) {
      capsuleBadge.textContent = `${memories.length} ${memories.length === 1 ? 'memory' : 'memories'} sealed`;
    }

    if (memories.length === 0) {
      capsuleList.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 1.5rem;">The capsule is waiting for its first memory... ✨</p>`;
      return;
    }

    memories.forEach((mem) => {
      const card = document.createElement('div');
      card.className = 'capsule-item-card';
      card.innerHTML = `
        <p class="capsule-item-text">"${mem.text}"</p>
        <div class="capsule-item-footer">
          <span>📅 ${mem.date}</span>
          <button class="capsule-item-delete" title="Remove memory" data-id="${mem.id}">✕</button>
        </div>
      `;

      const delBtn = card.querySelector('.capsule-item-delete');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const updated = getCapsuleMemories().filter(m => m.id !== mem.id);
          saveCapsuleMemories(updated);
          renderCapsuleMemories();
        });
      }

      capsuleList.appendChild(card);
    });
  }

  if (capsuleSaveBtn && capsuleInput) {
    capsuleSaveBtn.addEventListener('click', () => {
      const text = capsuleInput.value.trim();
      if (!text) {
        capsuleInput.focus();
        capsuleInput.style.borderColor = 'var(--blush-400)';
        setTimeout(() => capsuleInput.style.borderColor = '', 1200);
        return;
      }

      const memories = getCapsuleMemories();
      const newMemory = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      memories.unshift(newMemory);
      saveCapsuleMemories(memories);
      renderCapsuleMemories();

      capsuleInput.value = '';
      showToast(config.memoryCapsule?.savedNotice || "Memory saved ❤️");

      if (window.ConfettiSystem) {
        const rect = capsuleSaveBtn.getBoundingClientRect();
        window.ConfettiSystem.burstHearts(rect.left + rect.width / 2, rect.top - 10, 10);
      }
    });
  }

  // Initial render of memory capsule
  renderCapsuleMemories();

  // ─── 10. RENDER SECTION 4: BEST FRIEND AWARDS 🏆 ─────────────────────────
  const awardsGrid = document.getElementById('awards-grid');
  if (awardsGrid && config.awards) {
    awardsGrid.innerHTML = '';
    config.awards.forEach((award, idx) => {
      const card = document.createElement('div');
      card.className = 'award-card glass-card scroll-reveal';
      const isSecretLocation = idx === 6;

      card.innerHTML = `
        <div class="award-ribbon-badge">${award.ribbon}</div>
        <div class="award-icon-box">
          <span class="award-icon">${award.icon}</span>
        </div>
        <h3 class="award-title">${award.title}</h3>
        <p class="award-desc">${award.desc}</p>
        <div class="award-citation">
          <em>${award.citation}</em>
          ${isSecretLocation ? '<span class="hidden-easter-egg micro-heart" id="secret-heart-elem" title="Hmm?">💖</span>' : ''}
        </div>
      `;

      card.addEventListener('mouseenter', () => {
        if (window.ConfettiSystem && Math.random() < 0.3) {
          const rect = card.getBoundingClientRect();
          window.ConfettiSystem.burstHearts(rect.left + rect.width / 2, rect.top + 30, 4);
        }
      });

      awardsGrid.appendChild(card);
    });
  }

  // ─── 11. RENDER SECTION 6: OPEN WHEN... (8 ENVELOPES) ─────────────────────
  const envelopesGrid = document.getElementById('envelopes-grid');
  const letterModal = document.getElementById('envelope-letter-modal');
  const modalEnvelopeTitle = document.getElementById('modal-envelope-title');
  const modalEnvelopeTag = document.getElementById('modal-envelope-tag');
  const modalEnvelopeLetter = document.getElementById('modal-envelope-letter');
  const modalEnvelopeClose = document.getElementById('modal-envelope-close');

  if (envelopesGrid && config.openWhen) {
    envelopesGrid.innerHTML = '';
    config.openWhen.forEach((env) => {
      const item = document.createElement('div');
      item.className = 'envelope-wrapper scroll-reveal';
      item.innerHTML = `
        <div class="envelope-card glass-card">
          <div class="envelope-top-flap"></div>
          <div class="envelope-seal">💌</div>
          <div class="envelope-content-preview">
            <span class="env-tag">${env.tag}</span>
            <h3 class="env-title">${env.title}</h3>
            <p class="env-sub">${env.subtitle}</p>
            <button class="open-env-btn">Open Letter ✉️</button>
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        item.classList.add('opening');
        if (window.ConfettiSystem) {
          const rect = item.getBoundingClientRect();
          window.ConfettiSystem.burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
        }

        setTimeout(() => {
          openEnvelopeModal(env);
          item.classList.remove('opening');
        }, 500);
      });

      envelopesGrid.appendChild(item);
    });
  }

  function openEnvelopeModal(env) {
    if (!letterModal) return;
    modalEnvelopeTitle.textContent = env.title;
    modalEnvelopeTag.textContent = env.tag;
    modalEnvelopeLetter.textContent = env.letter;
    letterModal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeEnvelopeModal() {
    if (!letterModal) return;
    letterModal.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (modalEnvelopeClose) modalEnvelopeClose.addEventListener('click', closeEnvelopeModal);
  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) closeEnvelopeModal();
    });
  }

  // ─── 12. RENDER SECTION 7: THE LETTER 💌 ─────────────────────────────────
  const letterContainer = document.getElementById('letter-content-body');
  const letterSalutation = document.getElementById('letter-salutation');
  const letterClosing = document.getElementById('letter-closing');
  const letterSignature = document.getElementById('letter-signature');

  if (config.letter) {
    if (letterSalutation) letterSalutation.textContent = config.letter.salutation;
    if (letterClosing) letterClosing.textContent = config.letter.closing;
    if (letterSignature) letterSignature.textContent = config.letter.signature;

    if (letterContainer && config.letter.paragraphs) {
      letterContainer.innerHTML = '';
      config.letter.paragraphs.forEach((pText) => {
        const p = document.createElement('p');
        p.className = 'letter-paragraph scroll-reveal';
        p.textContent = pText;
        letterContainer.appendChild(p);
      });
    }
  }

  // ─── 13. RENDER SECTION 8: INSIDE JOKES WALL 😂 ──────────────────────────
  const jokesWall = document.getElementById('inside-jokes-wall');
  if (jokesWall && config.insideJokes) {
    jokesWall.innerHTML = '';
    config.insideJokes.forEach((joke, idx) => {
      const pinColor = idx % 2 === 0 ? '#EC4899' : '#8B5CF6';
      const rot = (Math.cos(idx * 2.1) * 3).toFixed(1);

      const jokeCard = document.createElement('div');
      jokeCard.className = `joke-card joke-color-${joke.color} scroll-reveal`;
      jokeCard.style.setProperty('--rot', `${rot}deg`);

      const hasSecretCat = idx === 3;

      jokeCard.innerHTML = `
        <div class="tape-strip" style="--tape-bg: ${pinColor}"></div>
        <div class="joke-quote">"${joke.quote}"</div>
        <div class="joke-punchline">${joke.punchline}</div>
        <div class="joke-footer">
          <button class="joke-laugh-btn" aria-label="Laugh at joke">${joke.reactions}</button>
          ${hasSecretCat ? '<span class="hidden-easter-egg secret-cat-elem" id="secret-cat-elem" title="Meow?">🐱</span>' : ''}
        </div>
      `;

      const laughBtn = jokeCard.querySelector('.joke-laugh-btn');
      let laughs = 999;
      laughBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        laughs++;
        laughBtn.textContent = `😂 ${laughs}+ laughs!`;
        if (window.ConfettiSystem) {
          const rect = laughBtn.getBoundingClientRect();
          window.ConfettiSystem.burstHearts(rect.left + rect.width / 2, rect.top, 5);
        }
      });

      jokesWall.appendChild(jokeCard);
    });
  }

  // ─── 14. SECTION 10: PHOTO SPOTLIGHT ─────────────────────────────────────
  const spotlightImg = document.getElementById('spotlight-photo-img');
  const spotlightQuote = document.getElementById('spotlight-quote-text');
  const spotlightSub = document.getElementById('spotlight-subtext');

  if (config.photoSpotlight) {
    if (spotlightImg) spotlightImg.src = config.photoSpotlight.image;
    if (spotlightQuote) spotlightQuote.textContent = `"${config.photoSpotlight.quote}"`;
    if (spotlightSub) spotlightSub.textContent = config.photoSpotlight.subtext;
  }

  // ─── 15. SECTION 11: THE "YOU ARE..." GENERATOR ─────────────────────────
  const complimentBtn = document.getElementById('compliment-generator-btn');
  const complimentDisplay = document.getElementById('compliment-display-card');
  const complimentText = document.getElementById('compliment-text-value');
  const complimentsList = config.compliments || [];

  if (complimentBtn && complimentText) {
    let lastIndex = -1;

    complimentBtn.addEventListener('click', () => {
      let randIndex;
      do {
        randIndex = Math.floor(Math.random() * complimentsList.length);
      } while (randIndex === lastIndex && complimentsList.length > 1);

      lastIndex = randIndex;
      const quote = complimentsList[randIndex];

      complimentDisplay.classList.add('generating');
      setTimeout(() => {
        complimentText.textContent = `"${quote}"`;
        complimentDisplay.classList.remove('generating');

        if (window.ConfettiSystem) {
          const rect = complimentBtn.getBoundingClientRect();
          window.ConfettiSystem.burstHearts(rect.left + rect.width / 2, rect.top - 20, 12);
        }
      }, 250);
    });
  }

  // ─── 16. SECTION 12: 5 HIDDEN SURPRISES (EASTER EGGS) ────────────────────
  function triggerSecret(secretId) {
    if (secretsState.discovered.has(secretId)) {
      showToast("You've already uncovered this secret bestie! 💖");
      return;
    }

    secretsState.discovered.add(secretId);
    const count = secretsState.discovered.size;

    if (secretsCounterBadge) {
      secretsCounterBadge.textContent = `${count}/${secretsState.total}`;
    }

    const secretConfig = config.hiddenSurprises?.find(s => s.id === secretId);
    const msg = secretConfig ? secretConfig.message : "You found a secret! 👀";

    showToast(`🕵️ ${msg}`);

    if (window.ConfettiSystem) {
      window.ConfettiSystem.trigger({ count: 60 });
    }

    if (count === secretsState.total) {
      setTimeout(() => {
        showAchievementModal();
      }, 1500);
    }
  }

  const secretStar = document.getElementById('secret-star-elem');
  if (secretStar) secretStar.addEventListener('click', () => triggerSecret('secret-star'));

  const secretHeart = document.getElementById('secret-heart-elem');
  if (secretHeart) secretHeart.addEventListener('click', () => triggerSecret('secret-heart'));

  const secretBtn = document.getElementById('secret-button-elem');
  if (secretBtn) secretBtn.addEventListener('click', () => triggerSecret('secret-button'));

  const secretFirefly = document.getElementById('secret-firefly-elem');
  if (secretFirefly) secretFirefly.addEventListener('click', () => triggerSecret('secret-firefly'));

  document.addEventListener('click', (e) => {
    const catTarget = e.target.closest('#secret-cat-elem, .secret-cat-elem, .secret-cat-hidden');
    if (catTarget) {
      triggerSecret('secret-cat');
      const catModal = document.getElementById('secret-cat-modal');
      if (catModal) catModal.classList.add('visible');
    }
  });

  const closeSecretCatBtn = document.getElementById('close-secret-cat-btn');
  if (closeSecretCatBtn) {
    closeSecretCatBtn.addEventListener('click', () => {
      document.getElementById('secret-cat-modal')?.classList.remove('visible');
    });
  }

  const secretGem = document.getElementById('secret-capsule-gem');
  if (secretGem) secretGem.addEventListener('click', () => triggerSecret('secret-capsule-gem'));

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'secret-toast glass-card';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  function showAchievementModal() {
    const modal = document.getElementById('secrets-all-unlocked-modal');
    if (modal) {
      modal.classList.add('visible');
      if (window.ConfettiSystem) {
        window.ConfettiSystem.trigger({ count: 180 });
      }
    }
  }

  const closeAchievementBtn = document.getElementById('close-achievement-btn');
  if (closeAchievementBtn) {
    closeAchievementBtn.addEventListener('click', () => {
      document.getElementById('secrets-all-unlocked-modal')?.classList.remove('visible');
    });
  }

  // ─── 17. SECTION 13: FINAL SURPRISE & GRAND FINALE ───────────────────────
  const finalBtn = document.getElementById('final-one-last-thing-btn');
  const finalClimaxView = document.getElementById('final-climax-view');
  const replayBtn = document.getElementById('final-replay-btn');
  const footerTextEl = document.getElementById('final-footer-text');

  if (footerTextEl && config.finalSurprise?.footerText) {
    footerTextEl.textContent = config.finalSurprise.footerText;
  }

  if (finalBtn) {
    finalBtn.addEventListener('click', () => {
      finalBtn.style.display = 'none';
      if (finalClimaxView) {
        finalClimaxView.classList.add('visible');
      }

      if (window.ConfettiSystem) {
        window.ConfettiSystem.trigger({ count: 200 });
        setTimeout(() => window.ConfettiSystem.trigger({ count: 160 }), 700);
        setTimeout(() => window.ConfettiSystem.burstHearts(window.innerWidth / 2, window.innerHeight / 2, 35), 1400);
      }
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        introOverlay.style.display = 'flex';
        introOverlay.classList.remove('portal-transition');
        mainApp.classList.remove('visible');
      }, 800);
    });
  }

  // ─── 18. INTERSECTION OBSERVER SCROLL REVEALS ────────────────────────────
  function initScrollAnimations() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }
});
