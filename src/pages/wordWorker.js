/* eslint-disable no-restricted-globals */
// wordWorker.js

function createEmptyGrid(size) {
    return Array(size).fill(null).map(() => Array(size).fill(''));
}

function getRandomLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

function getRandomDirection() {
    const directions = [
        [0, 1],   // Horizontal right
        [1, 1],   // Diagonal down-right
        [1, 0],   // Vertical down
        [1, -1],  // Diagonal down-left
        [0, -1],  // Horizontal left (reversed word handled in UI)
        [-1, -1], // Diagonal up-left (reversed word handled in UI)
        [-1, 0],  // Vertical up (reversed word handled in UI)
        [-1, 1]   // Diagonal up-right (reversed word handled in UI)
    ];
    return directions[Math.floor(Math.random() * directions.length)];
}

function canPlaceWord(grid, word, row, col, dr, dc) {
    const size = grid.length;
    for (let i = 0; i < word.length; i++) {
        const r = row + i * dr;
        const c = col + i * dc;

        if (r < 0 || r >= size || c < 0 || c >= size) {
            return false; // Out of bounds
        }
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
            return false; // Cell occupied by a different letter
        }
    }
    return true;
}

function placeWord(grid, word, row, col, dr, dc) {
    for (let i = 0; i < word.length; i++) {
        const r = row + i * dr;
        const c = col + i * dc;
        grid[r][c] = word[i];
    }
}

self.onmessage = (event) => {
    const { words, size } = event.data;
    let grid = createEmptyGrid(size);
    const placedWords = [];
    const sortedWords = [...words].sort((a, b) => b.length - a.length); // Try placing longer words first

    const maxAttemptsPerWord = 100; // Limit attempts for each word to prevent infinite loops

    for (const word of sortedWords) {
        let attempts = 0;
        let wordPlaced = false;
        while (attempts < maxAttemptsPerWord && !wordPlaced) {
            const startRow = Math.floor(Math.random() * size);
            const startCol = Math.floor(Math.random() * size);
            const [dr, dc] = getRandomDirection();

            if (canPlaceWord(grid, word, startRow, startCol, dr, dc)) {
                placeWord(grid, word, startRow, startCol, dr, dc);
                placedWords.push(word);
                wordPlaced = true;
            }
            attempts++;
        }
    }

    // Fill remaining empty cells with random letters
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c] === '') {
                grid[r][c] = getRandomLetter();
            }
        }
    }

    self.postMessage({ grid, placedWords });
};