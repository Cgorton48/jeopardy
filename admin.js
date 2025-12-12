/**
 * Admin Interface JavaScript
 * Handles game creation, editing, and management
 */

let currentEditingGame = null;
let currentEditingRound = 'single';

$(document).ready(function() {
    // Initialize
    loadGamesList();
    initializeEditor();
    populateExportSelect();
    
    // Tab switching
    $('.tab').click(function() {
        const tabName = $(this).data('tab');
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.tab-content').removeClass('active');
        $('#tab-' + tabName).addClass('active');
    });
    
    // Games tab actions
    $('#createNewGame').click(createNewGame);
    $('#loadTemplate').click(loadBlankTemplate);
    
    // Editor actions
    $('#saveGame').click(saveCurrentGame);
    $('#previewGame').click(previewGame);
    
    // Round selector
    $('.round-selector button').click(function() {
        $('.round-selector button').removeClass('active');
        $(this).addClass('active');
        currentEditingRound = $(this).data('round');
        renderQuestionsGrid();
    });
    
    // Import/Export actions
    $('#exportGame').click(exportSelectedGame);
    $('#selectFile').click(() => $('#fileInput').click());
    $('#fileInput').change(handleFileSelect);
    $('#loadDefaultGame').click(loadDefaultGameTemplate);
    $('#loadGeneralTrivia').click(loadGeneralTriviaTemplate);
    $('#loadBlankGame').click(loadBlankTemplate);
    
    // Drag and drop
    const dropZone = document.getElementById('dropZone');
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
});

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = $(`<div class="alert alert-${type}">${message}</div>`);
    $('#alertContainer').html(alertDiv);
    setTimeout(() => alertDiv.fadeOut(() => alertDiv.remove()), 5000);
}

// Load games list
function loadGamesList() {
    const games = gameManager.getGamesList();
    const currentGameId = gameManager.getCurrentGameId();
    const container = $('#gamesList');
    
    container.empty();
    
    if (games.length === 0) {
        container.html('<p style="color: #666;">No games yet. Create your first game!</p>');
        return;
    }
    
    games.forEach(game => {
        const isActive = game.id === currentGameId;
        const card = $(`
            <div class="game-card ${isActive ? 'active' : ''}" data-game-id="${game.id}">
                <h3>${game.name}</h3>
                <div class="meta">
                    ${isActive ? '<strong>✓ Active Game</strong><br>' : ''}
                    Last modified: ${new Date(game.lastModified).toLocaleDateString()}
                </div>
                <div class="actions">
                    <button class="btn btn-primary btn-edit">Edit</button>
                    <button class="btn btn-success btn-load">Load</button>
                    <button class="btn btn-danger btn-delete">Delete</button>
                </div>
            </div>
        `);
        
        card.find('.btn-edit').click(() => editGame(game.id));
        card.find('.btn-load').click(() => loadGame(game.id));
        card.find('.btn-delete').click(() => deleteGame(game.id));
        
        container.append(card);
    });
    
    // Update current game indicator
    if (currentGameId) {
        const currentGame = games.find(g => g.id === currentGameId);
        if (currentGame) {
            $('#currentGameName').text(currentGame.name);
            $('#currentGameIndicator').show();
        }
    } else {
        $('#currentGameIndicator').hide();
    }
}

// Create new game
function createNewGame() {
    currentEditingGame = gameManager.createEmptyGame();
    currentEditingGame.name = "New Game " + new Date().toLocaleString();
    initializeEditor();
    $('.tab[data-tab="editor"]').click();
    showAlert('New game created. Don\'t forget to save!', 'info');
}

// Load blank template
function loadBlankTemplate() {
    fetch('games/blank-template.json')
        .then(response => response.json())
        .then(data => {
            delete data.id; // Remove ID to create new game
            currentEditingGame = data;
            initializeEditor();
            $('.tab[data-tab="editor"]').click();
            showAlert('Blank template loaded!', 'success');
        })
        .catch(err => {
            showAlert('Error loading template: ' + err.message, 'error');
        });
}

// Edit existing game
function editGame(gameId) {
    const gameData = gameManager.loadGame(gameId);
    if (gameData) {
        currentEditingGame = gameData;
        initializeEditor();
        $('.tab[data-tab="editor"]').click();
        showAlert('Game loaded for editing', 'info');
    }
}

// Load game as active
function loadGame(gameId) {
    gameManager.setCurrentGameId(gameId);
    loadGamesList();
    populateExportSelect();
    showAlert('Game set as active!', 'success');
}

// Delete game
function deleteGame(gameId) {
    if (confirm('Are you sure you want to delete this game? This cannot be undone.')) {
        gameManager.deleteGame(gameId);
        loadGamesList();
        populateExportSelect();
        showAlert('Game deleted', 'success');
    }
}

// Initialize editor with current game
function initializeEditor() {
    if (!currentEditingGame) {
        currentEditingGame = gameManager.createEmptyGame();
    }
    
    // Set game name
    $('#gameName').val(currentEditingGame.name);
    
    // Render categories
    renderCategoriesGrid();
    
    // Render questions
    renderQuestionsGrid();
}

// Render categories grid
function renderCategoriesGrid() {
    const container = $('#categoriesGrid');
    container.empty();
    
    currentEditingGame.categories.forEach((cat, idx) => {
        const categoryDiv = $(`
            <div class="category-input">
                <label>Category ${idx + 1}</label>
                <input type="text" class="cat-single" data-idx="${idx}" placeholder="Single Jeopardy" value="${cat.single}">
                <input type="text" class="cat-double" data-idx="${idx}" placeholder="Double Jeopardy" value="${cat.double}">
            </div>
        `);
        
        categoryDiv.find('.cat-single').on('input', function() {
            currentEditingGame.categories[idx].single = $(this).val();
        });
        
        categoryDiv.find('.cat-double').on('input', function() {
            currentEditingGame.categories[idx].double = $(this).val();
        });
        
        container.append(categoryDiv);
    });
}

// Render questions grid
function renderQuestionsGrid() {
    const round = currentEditingGame.questions[currentEditingRound];
    const table = $('#questionsTable');
    table.empty();
    
    // Header row
    const headerRow = $('<tr></tr>');
    headerRow.append('<th>Points</th>');
    for (let col = 0; col < 5; col++) {
        const catName = currentEditingGame.categories[col][currentEditingRound];
        headerRow.append(`<th>${catName || 'Category ' + (col + 1)}</th>`);
    }
    table.append(headerRow);
    
    // Question rows
    round.forEach((row, rowIdx) => {
        const tr = $('<tr></tr>');
        tr.append(`<td style="text-align: center; font-weight: bold; background: #f7fafc;">${row[0].points}</td>`);
        
        row.forEach((question, colIdx) => {
            const cell = $(`
                <td>
                    <div class="question-cell">
                        <label>Answer (shown first):</label>
                        <textarea class="q-answer" data-row="${rowIdx}" data-col="${colIdx}">${question.answer}</textarea>
                        <label>Question (revealed):</label>
                        <textarea class="q-question" data-row="${rowIdx}" data-col="${colIdx}">${question.question}</textarea>
                    </div>
                </td>
            `);
            
            cell.find('.q-answer').on('input', function() {
                currentEditingGame.questions[currentEditingRound][rowIdx][colIdx].answer = $(this).val();
            });
            
            cell.find('.q-question').on('input', function() {
                currentEditingGame.questions[currentEditingRound][rowIdx][colIdx].question = $(this).val();
            });
            
            tr.append(cell);
        });
        
        table.append(tr);
    });
}

// Save current game
function saveCurrentGame() {
    // Get game name
    currentEditingGame.name = $('#gameName').val() || 'Untitled Game';
    
    // Validate
    if (!gameManager.validateGameData(currentEditingGame)) {
        showAlert('Invalid game data. Please check all fields.', 'error');
        return;
    }
    
    // Save
    const gameId = gameManager.saveGame(currentEditingGame);
    currentEditingGame.id = gameId;
    
    // Reload games list
    loadGamesList();
    populateExportSelect();
    
    showAlert('Game saved successfully!', 'success');
}

// Preview game
function previewGame() {
    if (!currentEditingGame.id) {
        if (confirm('Game needs to be saved before preview. Save now?')) {
            saveCurrentGame();
            if (currentEditingGame.id) {
                gameManager.setCurrentGameId(currentEditingGame.id);
                window.open('index.html', '_blank');
            }
        }
    } else {
        gameManager.setCurrentGameId(currentEditingGame.id);
        window.open('index.html', '_blank');
    }
}

// Populate export select
function populateExportSelect() {
    const games = gameManager.getGamesList();
    const select = $('#exportGameSelect');
    
    select.empty();
    select.append('<option value="">Select a game to export...</option>');
    
    games.forEach(game => {
        select.append(`<option value="${game.id}">${game.name}</option>`);
    });
}

// Export selected game
function exportSelectedGame() {
    const gameId = $('#exportGameSelect').val();
    if (!gameId) {
        showAlert('Please select a game to export', 'error');
        return;
    }
    
    try {
        gameManager.exportGame(gameId);
        showAlert('Game exported successfully!', 'success');
    } catch (err) {
        showAlert('Error exporting game: ' + err.message, 'error');
    }
}

// Handle file select
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        importGameFile(file);
    }
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    $('#dropZone').addClass('dragover');
}

// Handle drag leave
function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    $('#dropZone').removeClass('dragover');
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    $('#dropZone').removeClass('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        importGameFile(files[0]);
    }
}

// Import game file
function importGameFile(file) {
    if (!file.name.endsWith('.json')) {
        showAlert('Please select a JSON file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const gameData = JSON.parse(e.target.result);
            
            if (!gameManager.validateGameData(gameData)) {
                showAlert('Invalid game data format', 'error');
                return;
            }
            
            const gameId = gameManager.importGame(gameData);
            loadGamesList();
            populateExportSelect();
            showAlert('Game imported successfully!', 'success');
        } catch (err) {
            showAlert('Error importing game: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    $('#fileInput').val('');
}

// Load default game template
function loadDefaultGameTemplate() {
    fetch('games/default-game.json')
        .then(response => response.json())
        .then(data => {
            delete data.id; // Remove ID to create new game
            data.name = "Marketing Analytics Game (Copy)";
            const gameId = gameManager.importGame(data);
            loadGamesList();
            populateExportSelect();
            showAlert('Default game imported!', 'success');
        })
        .catch(err => {
            showAlert('Error loading default game: ' + err.message, 'error');
        });
}

// Load general trivia template
function loadGeneralTriviaTemplate() {
    fetch('games/general-trivia-template.json')
        .then(response => response.json())
        .then(data => {
            delete data.id; // Remove ID to create new game
            data.name = "General Trivia Game (Copy)";
            const gameId = gameManager.importGame(data);
            loadGamesList();
            populateExportSelect();
            showAlert('General trivia game imported!', 'success');
        })
        .catch(err => {
            showAlert('Error loading general trivia game: ' + err.message, 'error');
        });
}

