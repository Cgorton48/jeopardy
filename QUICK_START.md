# Quick Start Guide

## 🎯 Your Jeopardy Game is Ready to Use!

Your game has been upgraded with a powerful admin interface and game management system. Here's how to get started in just a few minutes.

## ⚡ Quick Start (3 Steps)

### 1. Set Up Your First Game (2 minutes)

Open `admin.html` in your web browser and either:

**Option A: Use Existing Content**
- Your current marketing analytics game has been preserved
- Click on "Import/Export" tab
- Click "📚 Load Marketing Analytics Game"
- Your game is ready to play!

**Option B: Create New Game**
- Click "➕ Create New Game"
- Enter your game name
- Fill in categories and questions
- Click "💾 Save Game"

### 2. Start Playing (30 seconds)

- Open `index.html` in your web browser
- Select your game from the dropdown
- Choose number of teams
- Click "Start"
- Play!

### 3. Resume Later

- When you return, the game will ask if you want to resume
- Click "Resume Game" to continue where you left off
- Or click "Start New Game" to start fresh

## 🎮 Game Controls During Play

| Key | Action |
|-----|--------|
| Click on dollar amount | Show question |
| Spacebar | Reveal answer |
| ESC | Close question |
| Enter | Play thinking music |
| + Button | Award points (correct) |
| - Button | Deduct points (wrong) |
| 0-9 Keys | Soundboard effects |

## 📝 Creating Your First Custom Game

### Step 1: Open Admin Panel
```
Open: admin.html
```

### Step 2: Create Game
1. Click "My Games" tab
2. Click "➕ Create New Game"
3. Switch to "Game Editor" tab

### Step 3: Fill In Content

**Game Information:**
- Enter a descriptive game name (e.g., "Science Trivia Night")

**Categories (5 required):**
- Single Jeopardy: Regular category name
- Double Jeopardy: Related but advanced category name

Example:
- Single: "BASIC BIOLOGY"
- Double: "ADVANCED GENETICS"

**Questions (25 per round = 50 total):**

For each cell:
1. **Answer** (the clue shown to players): "This element is essential for human breathing"
2. **Question** (the correct response): "What is oxygen?"
3. Points are auto-calculated by row

### Step 4: Save & Test
1. Click "💾 Save Game"
2. Click "👁️ Preview Game" to test
3. Make adjustments if needed

## 🔄 Switching Between Games

You have multiple games? Easy!

1. Open `index.html`
2. Use the "Select Game" dropdown
3. Choose any game
4. Start playing!

Each game maintains its own progress, so you can switch without losing anything.

## 📤 Sharing Games

Want to share a game with friends or colleagues?

1. Open `admin.html`
2. Go to "Import/Export" tab
3. Select game to export
4. Click "📥 Download JSON"
5. Share the JSON file

**To Import:**
1. Open `admin.html`
2. Go to "Import/Export" tab
3. Drag & drop JSON file OR click "Choose File"
4. Done!

## 💡 Pro Tips

### Best Practices for Questions
- Keep "answers" (clues) concise - they display on the game board
- Use proper Jeopardy format: "What is..." or "Who is..."
- Test categories with varying difficulty across rows

### Game Management
- Export your games regularly as backups
- Create game variants (Easy, Medium, Hard)
- Use descriptive names: "Science - 7th Grade" vs just "Science"

### Playing the Game
- Use full-screen mode (F11 on Windows, View menu on Mac)
- Edit team names by clicking on them during setup
- Daily Doubles are randomly selected each game
- Progress auto-saves after every score change

## 🆘 Troubleshooting

### "No games available" message?
→ Open `admin.html` and import a sample game or create one

### Can't see my game in the list?
→ Make sure you clicked "Save Game" in the admin panel

### Lost my game?
→ Games are stored in browser localStorage. Check if you're using the same browser

### Want to start over?
→ Click "Reset Game Progress" button on the start screen

### Need to clear everything?
→ Open browser console (F12) and run: `localStorage.clear()`

## 📚 Available Sample Games

Three pre-made games to get you started:

1. **Marketing Analytics Jeopardy** - Your original custom game
2. **General Trivia Template** - Broad topics with example questions
3. **Blank Template** - Empty structure, ready to customize

Load any of these from: Admin Panel → Import/Export → Sample Games

## 🎉 You're Ready!

That's it! You now have a fully functional, customizable Jeopardy game system.

**Next Steps:**
1. Load the marketing game or create your first custom game
2. Play a round to familiarize yourself with controls
3. Start creating your own games for different topics

**Need more help?** See the full `README.md` for detailed documentation.

---

Have fun hosting your trivia nights! 🎊

