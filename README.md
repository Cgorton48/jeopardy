# Juliet Jeopardy Game

A fully customizable, browser-based Jeopardy game with an admin interface for easy content management.

## 🎮 Features

- **Dynamic Game Loading** - No more hardcoded content! All categories, questions, and answers are stored in JSON format
- **Admin Interface** - Create, edit, and manage multiple game sets through a user-friendly web interface
- **Game Progress Saving** - Automatically saves game progress including scores, answered questions, and current round
- **Multiple Games** - Switch between different game sets easily
- **Import/Export** - Share games with others by exporting/importing JSON files
- **Double Jeopardy** - Full support for single and double jeopardy rounds with automatic point doubling
- **Daily Double** - Random daily double selection for each round
- **Multiple Teams** - Support for up to 16 teams
- **Responsive Design** - Works on desktop and tablet devices

## 🚀 Getting Started

### Playing a Game

1. Open `index.html` in your web browser
2. Select a game from the dropdown menu
3. Choose the number of teams
4. Click "Start" to begin playing

### Creating/Editing Games

1. Open `admin.html` in your web browser
2. Navigate to the "Game Editor" tab
3. Fill in game information:
   - Game name
   - Category names (for both Single and Double Jeopardy)
   - Questions and answers for each cell
4. Click "Save Game" when finished
5. Use "Preview Game" to test your game

## 📁 Project Structure

```
juliet-jeopardy/
├── index.html              # Main game interface
├── admin.html              # Admin interface for game management
├── admin.js                # Admin interface JavaScript
├── game-manager.js         # Game data management module
├── styles.css              # Game styling
├── animate.css             # Animation library
├── jquery.js               # jQuery library
├── games/                  # Game data files
│   ├── default-game.json   # Default marketing game
│   └── blank-template.json # Blank template for new games
├── audio/                  # Sound effects
└── images/                 # Game images
```

## 💾 Data Storage

All game data and progress is stored in the browser's `localStorage`:

- **Game Data**: Stored as JSON objects with categories and questions
- **Game Progress**: Saves team names, scores, answered questions, and current round
- **Active Game**: Tracks which game is currently loaded

## 🎯 Game Data Format

Games are stored in JSON format with the following structure:

```json
{
  "id": "game_id",
  "name": "Game Name",
  "categories": [
    {
      "single": "Category Name",
      "double": "Double Jeopardy Category Name"
    }
    // ... 5 categories total
  ],
  "questions": {
    "single": [
      // 5 rows of questions
      [
        // 5 questions per row
        {
          "points": 100,
          "answer": "What is shown first (the clue)",
          "question": "What is the correct response"
        }
      ]
    ],
    "double": [
      // Same structure as single, with doubled points
    ]
  }
}
```

## 🎨 Admin Features

### My Games Tab
- View all saved games
- See which game is currently active
- Load, edit, or delete games
- Create new games or load templates

### Game Editor Tab
- Edit game name
- Configure category names for both rounds
- Create/edit all 25 questions per round (50 total)
- Save changes
- Preview game before playing

### Import/Export Tab
- Export games as JSON files for backup or sharing
- Import games from JSON files
- Load pre-made sample games
- Drag-and-drop file import support

## 🎲 Gameplay Features

### Game Controls
- **Spacebar**: Reveal the correct response
- **ESC**: Close question modal
- **Enter**: Play thinking music
- **Number Keys (0-9)**: Play soundboard effects

### Score Management
- **+ Button**: Award points to team (correct answer)
- **- Button**: Deduct points from team (incorrect answer)
- Points automatically doubled for Daily Double questions
- Auto-save after every score change

### Game Progress
- Resume previous game from where you left off
- Reset game progress at any time
- Progress saved per game (switch games without losing progress)

## 🔄 Workflow Example

### Creating a New Game

1. Open `admin.html`
2. Click "Create New Game" or "Load Blank Template"
3. Enter game name and category names
4. Fill in questions and answers for both Single and Double Jeopardy
5. Click "Save Game"
6. Click "Preview Game" or go to main game interface
7. Select your new game from the dropdown
8. Start playing!

### Importing a Shared Game

1. Open `admin.html`
2. Go to "Import/Export" tab
3. Click "Choose File" or drag-and-drop a JSON file
4. Game is automatically imported and available to play
5. Go to main game interface and select the imported game

## 🛠️ Technical Details

- **No Backend Required**: All data stored in browser localStorage
- **No Build Process**: Pure HTML, CSS, and JavaScript
- **jQuery**: Used for DOM manipulation and event handling
- **LocalStorage**: Persists game data and progress across sessions
- **JSON**: Human-readable data format for easy sharing

## 📝 Tips for Creating Great Games

1. **Keep answers concise**: They appear on the game board
2. **Use proper Jeopardy format**: Phrase responses as questions
3. **Test your game**: Use the Preview feature before hosting
4. **Export backups**: Regularly export your games as JSON files
5. **Organize categories**: Group related questions under clear category names

## 🎉 Credits

Original Jeopardy game interface enhanced with dynamic data management and admin capabilities.

## 📄 License

This is an educational/internal project for creating custom Jeopardy-style trivia games.

