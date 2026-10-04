/**
 * ============================================================================
 * ✨ PARTICLE SYSTEM & VISUAL EFFECTS ✨
 * ============================================================================
 * - Interactive Twinkling Stars & Fireflies Background
 * - Mouse & Touch Sparkle Trails
 * - Confetti Cannon for Celebrations
 * - Floating Heart Explosions
 * ============================================================================
 */

class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.fireflies = [];
    this.mouse = { x: -1000, y: -1000, radius: 120 };
    this.sparkles = [];
    this.isActive = true;
    this.width = 0;
    this.height = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Track mouse & touch for subtle reactive glow
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (Math.random() < 0.25) {
        this.addSparkle(e.clientX, e.clientY);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        if (Math.random() < 0.3) {
          this.addSparkle(this.mouse.x, this.mouse.y);
        }
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    // Populate stars & fireflies
    this.createStars();
    this.createFireflies();

    // Start animation loop
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.createStars();
  }

  createStars() {
    this.stars = [];
    const starCount = Math.floor((this.width * this.height) / 5500);
    const count = Math.min(Math.max(starCount, 70), 200);

    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.8 + 0.5,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() > 0.3 ? '#ffffff' : (Math.random() > 0.5 ? '#E8DCF5' : '#FCE7F3')
      });
    }
  }

  createFireflies() {
    this.fireflies = [];
    const count = Math.min(Math.max(Math.floor(this.width / 70), 15), 35);

    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.35,
        pulseSpeed: Math.random() * 0.04 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2,
        baseRadius: Math.random() * 12 + 6,
        color: Math.random() > 0.4 ? 'rgba(253, 224, 71, ' : 'rgba(236, 72, 153, '
      });
    }
  }

  addSparkle(x, y) {
    if (this.sparkles.length > 25) return;
    this.sparkles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 2 + 1,
      alpha: 1,
      decay: Math.random() * 0.03 + 0.02,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2 - 0.5
    });
  }

  animate() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.width, this.height);
    const now = Date.now() * 0.001;

    // 1. Draw Stars
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const alpha = s.baseAlpha + Math.sin(now * 3 * s.twinkleSpeed * 100 + s.twinkleOffset) * 0.25;
      const clampedAlpha = Math.max(0.1, Math.min(1, alpha));

      const dx = this.mouse.x - s.x;
      const dy = this.mouse.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let boost = 0;
      if (dist < this.mouse.radius) {
        boost = (1 - dist / this.mouse.radius) * 0.4;
      }

      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = Math.min(1, clampedAlpha + boost);
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size + boost * 0.8, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Draw Fireflies
    for (let i = 0; i < this.fireflies.length; i++) {
      const f = this.fireflies[i];
      f.x += f.vx;
      f.y += f.vy;

      if (f.x < -20) f.x = this.width + 20;
      if (f.x > this.width + 20) f.x = -20;
      if (f.y < -20) f.y = this.height + 20;
      if (f.y > this.height + 20) f.y = -20;

      const pulse = (Math.sin(now * f.pulseSpeed * 60 + f.pulseOffset) + 1) * 0.5;
      const glowAlpha = pulse * 0.55 + 0.15;

      const grad = this.ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.baseRadius * (1 + pulse * 0.4));
      grad.addColorStop(0, f.color + glowAlpha + ')');
      grad.addColorStop(0.4, f.color + (glowAlpha * 0.4) + ')');
      grad.addColorStop(1, f.color + '0)');

      this.ctx.fillStyle = grad;
      this.ctx.globalAlpha = 1;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.baseRadius * 1.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = Math.min(1, glowAlpha * 1.4);
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 3. Draw Sparkles
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= sp.decay;

      if (sp.alpha <= 0) {
        this.sparkles.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = '#fff4bd';
      this.ctx.globalAlpha = sp.alpha;
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

/**
 * Confetti & Celebration Fireworks Effect
 */
window.ConfettiSystem = {
  trigger(options = {}) {
    const count = options.count || 120;
    const originX = options.x !== undefined ? options.x : window.innerWidth / 2;
    const originY = options.y !== undefined ? options.y : window.innerHeight / 2;

    const colors = [
      '#EC4899', '#8B5CF6', '#A78BFA', '#F472B6', 
      '#FDE047', '#60A5FA', '#34D399', '#FFFFFF'
    ];

    const container = document.createElement('div');
    container.className = 'confetti-burst-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 99999;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const isRibbon = Math.random() > 0.4;
      const size = Math.random() * 8 + 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 450 + 200;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity - 120;
      const rot = Math.random() * 720 - 360;
      const duration = Math.random() * 1.5 + 1.2;

      el.style.cssText = `
        position: absolute;
        left: ${originX}px;
        top: ${originY}px;
        width: ${isRibbon ? size * 0.4 : size}px;
        height: ${isRibbon ? size * 1.8 : size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        opacity: 1;
        transform: translate(-50%, -50%) rotate(0deg);
        transition: transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${duration}s ease-in;
      `;

      container.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty + 200}px)) rotate(${rot}deg)`;
        el.style.opacity = '0';
      });
    }

    setTimeout(() => {
      container.remove();
    }, 2800);
  },

  burstHearts(x, y, count = 18) {
    const emojis = ['❤️', '💖', '✨', '🌸', '🤍', '🫶'];
    const originX = x || window.innerWidth / 2;
    const originY = y || window.innerHeight / 2;

    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 99999;
      overflow: hidden;
    `;
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const size = Math.random() * 16 + 18;
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 140 + 70;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 40;
      const duration = Math.random() * 1.2 + 0.8;

      heart.style.cssText = `
        position: absolute;
        left: ${originX}px;
        top: ${originY}px;
        font-size: ${size}px;
        transform: translate(-50%, -50%) scale(0.3);
        opacity: 1;
        transition: transform ${duration}s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity ${duration}s ease-out;
      `;

      container.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.1)`;
        heart.style.opacity = '0';
      });
    }

    setTimeout(() => container.remove(), 2200);
  }
};
