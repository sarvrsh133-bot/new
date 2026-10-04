# To My Favorite Human ❤️ — Personal Interactive Gift Website

A custom-designed, emotion-driven interactive website gift for your best friend. Designed with a soft twilight, lavender, blush, and starlight aesthetic with glassmorphism, smooth animations, audio player, interactive games, 3D envelope letters, and hidden surprises.

---

## 🎵 Current Soundtrack
* **Song:** Main Koi Aisa Geet Gaoon
* **Artist:** Abhijeet Bhattacharya, Alka Yagnik • Yes Boss
* **Source:** Configured via YouTube stream (`vzlXfZlH5dk`) in `config.js`

---

## 🌟 Quick Start: How to Open & View

You can open the website immediately in any web browser without needing to install anything!

1. Open your file manager and navigate to:
   ```
   C:\Users\SARWESH\.gemini\antigravity\scratch\best-friend-gift\
   ```
2. Double-click **`index.html`** to open it in Chrome, Edge, Safari, or Firefox.
3. Or in PowerShell:
   ```powershell
   Start-Process 'C:\Users\SARWESH\.gemini\antigravity\scratch\best-friend-gift\index.html'
   ```

---

## 🎨 How to Customize All Content

All text, names, dates, memories, quiz questions, letters, jokes, and compliments are centralized in **`config.js`**. You don't need to touch any HTML or CSS!

Open `config.js` in any text editor (Notepad, VS Code, etc.) to customize:

### 1. Basic Information
```javascript
info: {
  bestFriendName: "Her Name / Nickname",
  myNickname: "Your Nickname",
  friendshipSince: "2021",
  siteTitle: "To My Favorite Human ❤️",
  siteSubtitle: "A little corner of the internet made just for you."
}
```

### 2. Timeline (Our Story)
Edit `ourStory` array to add your own milestones, photos, and stories:
- `title`: e.g. "Day 1 — When we first met"
- `date`: e.g. "August 14, 2021"
- `story`: Your personal recollection
- `caption`: Funny or sweet caption
- `image`: Path to photo (e.g. `assets/images/photo1.jpg`)

### 3. Why You're Special (12 Reveal Cards)
Edit the `whyYoureSpecial` array to tweak reasons.

### 4. Memory Polaroid Gallery
Edit `memories.items` with your real photos, captions, and dates. Includes a full Lightbox modal view when clicked.

### 5. Best Friend Awards 🏆
Edit `awards` to change the funny and emotional certificate citations.

### 6. Games 🎮
- **Game 1 ("How Well Do You Know Me?")**: 10 customizable multiple choice questions with 4 options and funny score evaluations (0–3, 4–6, 7–9, 10/10).
- **Game 2 ("How Well Do I Know You?")**: 10 questions where you reveal funny and sweet habits about her.
- **Game 3 ("Catch the Hearts ❤️")**: Interactive canvas arcade game where falling hearts are tapped to gain points and streaks within 30 seconds.
- **Game 4 ("Memory Match")**: Card pair matching game unlocking the "Bestie level unlocked 🔓❤️".
- **Game 5 ("Choose Your Path")**: Branching adventure story leading to the plot twist.

### 7. Open When... Envelopes 💌
Edit the 8 heartfelt letters inside `openWhen`.

### 8. The Handwritten Letter
Edit `letter.paragraphs` to write your personal message.

### 9. Inside Jokes Wall 😂
Add or edit your funny inside jokes and moments in `insideJokes`.

### 10. Soundtrack 🎵
In `config.js`, you can switch between YouTube and MP3 anytime:
```javascript
soundtrack: {
  youtubeUrl: "https://youtu.be/vzlXfZlH5dk", // Or any YouTube link
  mp3Src: "assets/audio/music.mp3",           // Or your local MP3 file
  title: "Main Koi Aisa Geet Gaoon",
  artist: "Abhijeet Bhattacharya, Alka Yagnik • Yes Boss"
}
```

---

## 🌐 How to Send It to Her (Free Online Hosting)

### Option A: Netlify Drop (Easiest — 30 seconds)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `best-friend-gift` folder onto the page.
3. You will get a free live link (e.g. `https://your-gift-name.netlify.app`) to send to her!

### Option B: Vercel / GitHub Pages
Push this repository or folder to GitHub and enable GitHub Pages under repository settings.
