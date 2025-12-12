/**
 * Game Manager Module
 * Handles game data storage, retrieval, and management using localStorage
 */

class GameManager {
    constructor() {
        this.STORAGE_KEY_PREFIX = 'jeopardy_game_';
        this.PROGRESS_KEY_PREFIX = 'jeopardy_progress_';
        this.GAMES_LIST_KEY = 'jeopardy_games_list';
        this.CURRENT_GAME_KEY = 'jeopardy_current_game_id';
    }

    /**
     * Get list of all saved games
     * @returns {Array} Array of game objects with id and name
     */
    getGamesList() {
        const gamesListJson = localStorage.getItem(this.GAMES_LIST_KEY);
        return gamesListJson ? JSON.parse(gamesListJson) : [];
    }

    /**
     * Save games list to localStorage
     * @param {Array} gamesList - Array of game objects
     */
    saveGamesList(gamesList) {
        localStorage.setItem(this.GAMES_LIST_KEY, JSON.stringify(gamesList));
    }

    /**
     * Get current game ID
     * @returns {string|null} Current game ID
     */
    getCurrentGameId() {
        return localStorage.getItem(this.CURRENT_GAME_KEY);
    }

    /**
     * Set current game ID
     * @param {string} gameId - Game ID to set as current
     */
    setCurrentGameId(gameId) {
        localStorage.setItem(this.CURRENT_GAME_KEY, gameId);
    }

    /**
     * Load game data by ID
     * @param {string} gameId - Game ID to load
     * @returns {Object|null} Game data object or null if not found
     */
    loadGame(gameId) {
        const gameJson = localStorage.getItem(this.STORAGE_KEY_PREFIX + gameId);
        return gameJson ? JSON.parse(gameJson) : null;
    }

    /**
     * Save game data
     * @param {Object} gameData - Game data object
     * @returns {string} Game ID
     */
    saveGame(gameData) {
        const gameId = gameData.id || this.generateGameId();
        gameData.id = gameId;
        gameData.lastModified = new Date().toISOString();

        // Save game data
        localStorage.setItem(this.STORAGE_KEY_PREFIX + gameId, JSON.stringify(gameData));

        // Update games list
        let gamesList = this.getGamesList();
        const existingIndex = gamesList.findIndex(g => g.id === gameId);
        
        const gameListEntry = {
            id: gameId,
            name: gameData.name,
            lastModified: gameData.lastModified
        };

        if (existingIndex >= 0) {
            gamesList[existingIndex] = gameListEntry;
        } else {
            gamesList.push(gameListEntry);
        }

        this.saveGamesList(gamesList);
        return gameId;
    }

    /**
     * Delete game by ID
     * @param {string} gameId - Game ID to delete
     */
    deleteGame(gameId) {
        // Remove game data
        localStorage.removeItem(this.STORAGE_KEY_PREFIX + gameId);
        
        // Remove from games list
        let gamesList = this.getGamesList();
        gamesList = gamesList.filter(g => g.id !== gameId);
        this.saveGamesList(gamesList);

        // Remove progress
        localStorage.removeItem(this.PROGRESS_KEY_PREFIX + gameId);

        // If this was the current game, clear current game ID
        if (this.getCurrentGameId() === gameId) {
            localStorage.removeItem(this.CURRENT_GAME_KEY);
        }
    }

    /**
     * Load game progress
     * @param {string} gameId - Game ID
     * @returns {Object|null} Progress data or null
     */
    loadProgress(gameId) {
        const progressJson = localStorage.getItem(this.PROGRESS_KEY_PREFIX + gameId);
        return progressJson ? JSON.parse(progressJson) : null;
    }

    /**
     * Save game progress
     * @param {string} gameId - Game ID
     * @param {Object} progressData - Progress data object
     */
    saveProgress(gameId, progressData) {
        progressData.lastSaved = new Date().toISOString();
        localStorage.setItem(this.PROGRESS_KEY_PREFIX + gameId, JSON.stringify(progressData));
    }

    /**
     * Clear game progress
     * @param {string} gameId - Game ID
     */
    clearProgress(gameId) {
        localStorage.removeItem(this.PROGRESS_KEY_PREFIX + gameId);
    }

    /**
     * Generate unique game ID
     * @returns {string} Unique game ID
     */
    generateGameId() {
        return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Create empty game template
     * @returns {Object} Empty game data structure
     */
    createEmptyGame() {
        return {
            id: null,
            name: "New Game",
            categories: [
                { single: "Category 1", double: "Category 1" },
                { single: "Category 2", double: "Category 2" },
                { single: "Category 3", double: "Category 3" },
                { single: "Category 4", double: "Category 4" },
                { single: "Category 5", double: "Category 5" }
            ],
            questions: {
                single: this.createEmptyRound(),
                double: this.createEmptyRound()
            }
        };
    }

    /**
     * Create empty round (5x5 grid)
     * @returns {Array} 5x5 array of empty questions
     */
    createEmptyRound() {
        const round = [];
        for (let row = 0; row < 5; row++) {
            const rowData = [];
            for (let col = 0; col < 5; col++) {
                rowData.push({
                    points: (row + 1) * 100,
                    answer: "",
                    question: ""
                });
            }
            round.push(rowData);
        }
        return round;
    }

    /**
     * Export game as JSON file
     * @param {string} gameId - Game ID to export
     */
    exportGame(gameId) {
        const gameData = this.loadGame(gameId);
        if (!gameData) {
            throw new Error('Game not found');
        }

        const dataStr = JSON.stringify(gameData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `jeopardy_${gameData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Import game from JSON data
     * @param {Object} gameData - Game data object
     * @returns {string} New game ID
     */
    importGame(gameData) {
        // Remove old ID to create new game
        delete gameData.id;
        return this.saveGame(gameData);
    }

    /**
     * Validate game data structure
     * @param {Object} gameData - Game data to validate
     * @returns {boolean} True if valid
     */
    validateGameData(gameData) {
        if (!gameData.name || typeof gameData.name !== 'string') return false;
        if (!Array.isArray(gameData.categories) || gameData.categories.length !== 5) return false;
        if (!gameData.questions || !gameData.questions.single || !gameData.questions.double) return false;
        
        // Validate categories
        for (let cat of gameData.categories) {
            if (!cat.single || !cat.double) return false;
        }

        // Validate questions structure
        const validateRound = (round) => {
            if (!Array.isArray(round) || round.length !== 5) return false;
            for (let row of round) {
                if (!Array.isArray(row) || row.length !== 5) return false;
                for (let q of row) {
                    if (typeof q.points !== 'number' || typeof q.answer !== 'string' || typeof q.question !== 'string') {
                        return false;
                    }
                }
            }
            return true;
        };

        return validateRound(gameData.questions.single) && validateRound(gameData.questions.double);
    }
}

// Create global instance
const gameManager = new GameManager();

