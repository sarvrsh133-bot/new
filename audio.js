/**
 * ============================================================================
 * 🎵 HIGH-FIDELITY SOUNDTRACK AUDIO ENGINE 🎵
 * ============================================================================
 * Plays the user's dedicated song ("Main Koi Aisa Geet Gaoon") directly via 
 * native HTML5 Audio with 100% reliability, zero CORS/sandbox issues,
 * smooth scrubbing, synchronized floating mini player, and ambient visualizer.
 * ============================================================================
 */

class FriendshipAudioPlayer {
  constructor() {
    this.config = window.FRIENDSHIP_CONFIG?.soundtrack || {};
    this.isPlaying = false;
    this.volume = 0.8;
    this.duration = 334; // 5:34
    this.currentTime = 0;
    this.savedVolume = 0.8;

    // Use native audio element from DOM or create one
    this.audio = document.getElementById('friendship-native-audio') || new Audio();
    this.setupAudioSource();

    this.initDOM();
    this.setupAudioEvents();
  }

  setupAudioSource() {
    const primarySrc = this.config.audioSrc || 'assets/audio/song.m4a';
    const fallbackSrc = this.config.audioFallbackSrc || 'assets/audio/song.mp3';

    // If source not already set or loaded
    if (!this.audio.src || this.audio.src.endsWith('/')) {
      const canPlayM4A = this.audio.canPlayType('audio/mp4; codecs="mp4a.40.2"');
      this.audio.src = canPlayM4A ? primarySrc : fallbackSrc;
    }

    this.audio.volume = this.volume;
    this.audio.preload = 'auto';

    // Fallback error handler
    this.audio.addEventListener('error', (e) => {
      console.warn("Primary audio source error, switching to fallback:", e);
      if (this.audio.src.endsWith('song.m4a')) {
        this.audio.src = fallbackSrc;
        if (this.isPlaying) {
          this.audio.play().catch(() => {});
        }
      }
    });
  }

  initDOM() {
    // Main Player Elements
    this.playBtn = document.getElementById('music-play-btn');
    this.prevBtn = document.getElementById('music-prev-btn');
    this.nextBtn = document.getElementById('music-next-btn');
    this.progressBar = document.getElementById('music-progress-bar');
    this.progressFill = document.getElementById('music-progress-fill');
    this.timeCurrentEl = document.getElementById('music-time-current');
    this.timeDurationEl = document.getElementById('music-time-duration');
    this.titleEl = document.getElementById('music-player-title');
    this.artistEl = document.getElementById('music-player-artist');
    this.volumeSlider = document.getElementById('music-volume-slider');
    this.volumeIcon = document.getElementById('music-volume-icon');
    this.discEl = document.getElementById('music-vinyl-disc');
    this.mainMusicCard = document.getElementById('main-music-player-card');
    this.nowPlayingIndicator = document.getElementById('now-playing-indicator');
    this.musicPromptText = document.getElementById('music-prompt-text');

    // Floating Mini Widget Elements
    this.miniWidget = document.getElementById('floating-music-widget');
    this.miniPlayBtn = document.getElementById('mini-play-btn');
    this.miniSongTitle = document.getElementById('mini-song-title');
    this.miniProgressFill = document.getElementById('mini-progress-fill');
    this.miniProgressBar = document.getElementById('mini-progress-bar');
    this.miniTimeDisplay = document.getElementById('mini-time-display');
    this.miniMinimizeBtn = document.getElementById('mini-minimize-btn');
    this.miniToggleIcon = document.getElementById('mini-toggle-icon');
    this.miniMuteBtn = document.getElementById('mini-mute-btn');
    this.floatingNavBtn = document.getElementById('floating-music-btn');

    // ─── Attach Listeners ───────────────────────────────────────────────────
    if (this.playBtn) this.playBtn.addEventListener('click', () => this.togglePlay());
    if (this.miniPlayBtn) {
      this.miniPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlay();
      });
    }
    if (this.floatingNavBtn) {
      this.floatingNavBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.audio.currentTime = 0;
        this.play();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.audio.currentTime = 0;
        this.play();
      });
    }

    // Volume Slider & Mute
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
    }

    if (this.volumeIcon) {
      this.volumeIcon.addEventListener('click', () => this.toggleMute());
    }

    if (this.miniMuteBtn) {
      this.miniMuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMute();
      });
    }

    // Progress Scrubber (Main)
    if (this.progressBar) {
      this.progressBar.addEventListener('click', (e) => {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seek(percent);
      });
    }

    // Progress Scrubber (Mini)
    if (this.miniProgressBar) {
      this.miniProgressBar.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = this.miniProgressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seek(percent);
      });
    }

    // Mini Widget Minimize/Maximize
    if (this.miniMinimizeBtn) {
      this.miniMinimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.miniWidget) {
          const isMin = this.miniWidget.classList.toggle('minimized');
          if (this.miniToggleIcon) this.miniToggleIcon.textContent = isMin ? '+' : '−';
        }
      });
    }

    this.updateTrackInfo();
  }

  setupAudioEvents() {
    // 1. Duration / Metadata loaded
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio.duration && !isNaN(this.audio.duration)) {
        this.duration = this.audio.duration;
        if (this.timeDurationEl) {
          this.timeDurationEl.textContent = this.formatTime(this.duration);
        }
      }
    });

    // 2. Continuous timeupdate for progress
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      if (this.audio.duration && !isNaN(this.audio.duration)) {
        this.duration = this.audio.duration;
      }
      this.updateProgressUI();
    });

    // 3. Play state triggers
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayStateUI(true);
    });

    // 4. Pause state triggers
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayStateUI(false);
    });

    // 5. Track finished (loop with love)
    this.audio.addEventListener('ended', () => {
      this.audio.currentTime = 0;
      this.play();
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.updatePlayStateUI(true);
        })
        .catch((error) => {
          console.warn("Audio play prevented or interrupted:", error);
          this.isPlaying = false;
          this.updatePlayStateUI(false);
        });
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayStateUI(false);
  }

  seek(percent) {
    if (this.duration && !isNaN(this.duration)) {
      this.audio.currentTime = percent * this.duration;
      this.updateProgressUI();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audio.volume = this.volume;

    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume;
    }

    const icon = this.volume === 0 ? '🔇' : (this.volume < 0.4 ? '🔉' : '🔊');
    if (this.volumeIcon) this.volumeIcon.textContent = icon;
    if (this.miniMuteBtn) this.miniMuteBtn.textContent = icon;
  }

  toggleMute() {
    if (this.volume > 0) {
      this.savedVolume = this.volume;
      this.setVolume(0);
    } else {
      this.setVolume(this.savedVolume || 0.8);
    }
  }

  updateTrackInfo() {
    const title = this.config.title || "Main Koi Aisa Geet Gaoon";
    const artist = this.config.artist || "Abhijeet Bhattacharya, Alka Yagnik • Yes Boss";

    if (this.titleEl) this.titleEl.textContent = title;
    if (this.artistEl) this.artistEl.textContent = artist;
    if (this.miniSongTitle) this.miniSongTitle.textContent = title;
    if (this.timeDurationEl) this.timeDurationEl.textContent = this.formatTime(this.duration);
  }

  updateProgressUI() {
    const percent = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    
    if (this.progressFill) this.progressFill.style.width = `${percent}%`;
    if (this.miniProgressFill) this.miniProgressFill.style.width = `${percent}%`;

    if (this.timeCurrentEl) this.timeCurrentEl.textContent = this.formatTime(this.currentTime);
    if (this.timeDurationEl) this.timeDurationEl.textContent = this.formatTime(this.duration);

    if (this.miniTimeDisplay) {
      this.miniTimeDisplay.textContent = `${this.formatTime(this.currentTime)} / ${this.formatTime(this.duration)}`;
    }
  }

  updatePlayStateUI(isPlaying) {
    // Main button icon
    if (this.playBtn) {
      const playSvg = document.getElementById('music-play-icon');
      const pauseSvg = document.getElementById('music-pause-icon');
      if (playSvg && pauseSvg) {
        playSvg.style.display = isPlaying ? 'none' : 'block';
        pauseSvg.style.display = isPlaying ? 'block' : 'none';
      }
      this.playBtn.setAttribute('aria-label', isPlaying ? 'Pause Music' : 'Play Music');
    }

    // Mini button icon
    if (this.miniPlayBtn) {
      this.miniPlayBtn.textContent = isPlaying ? '❚❚' : '▶';
      this.miniPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause Music' : 'Play Music');
    }

    // Floating navbar button
    if (this.floatingNavBtn) {
      if (isPlaying) this.floatingNavBtn.classList.add('playing');
      else this.floatingNavBtn.classList.remove('playing');
    }

    // Vinyl Disc spinning animation
    if (this.discEl) {
      if (isPlaying) this.discEl.classList.add('spinning');
      else this.discEl.classList.remove('spinning');
    }

    // Card visualizer animation
    if (this.mainMusicCard) {
      if (isPlaying) this.mainMusicCard.classList.add('playing');
      else this.mainMusicCard.classList.remove('playing');
    }

    // Mini widget visualizer animation
    if (this.miniWidget) {
      if (isPlaying) this.miniWidget.classList.add('playing');
      else this.miniWidget.classList.remove('playing');
    }

    // "Now Playing" pill
    if (this.nowPlayingIndicator) {
      this.nowPlayingIndicator.style.display = isPlaying ? 'inline-flex' : 'none';
    }

    // Emotional Prompt Text Transition
    if (this.musicPromptText) {
      if (isPlaying) {
        this.musicPromptText.textContent = this.config.musicMoment?.afterPlayText || "Okay... now continue exploring. ❤️";
        this.musicPromptText.classList.add('playing-active');
      } else {
        // Keep gentle prompt
        this.musicPromptText.classList.remove('playing-active');
      }
    }

    // Floating music notes
    if (isPlaying) {
      this.spawnMusicNotes();
    }
  }

  spawnMusicNotes() {
    const symbols = ['♪', '♫', '♩', '✨', '💖'];
    const originEl = this.playBtn || document.getElementById('floating-music-widget') || document.body;
    const rect = originEl.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const note = document.createElement('div');
        note.className = 'floating-music-note';
        note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        note.style.left = `${Math.max(10, rect.left + rect.width / 2 + (Math.random() * 80 - 40))}px`;
        note.style.top = `${Math.max(10, rect.top + (Math.random() * 30 - 15))}px`;
        document.body.appendChild(note);

        setTimeout(() => note.remove(), 2500);
      }, i * 280);
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

window.FriendshipAudioPlayer = FriendshipAudioPlayer;
