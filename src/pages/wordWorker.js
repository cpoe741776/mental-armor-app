/* eslint-env worker */

// wordWorker.js - This file runs in a separate thread (Web Worker)

/**
 * Generates a word search grid containing the specified words.
 *
 * @param {string[]} words - An array of words to place in the grid.
 * @param {number} size - The size of the square grid (e.g., 12 for a 12x12 grid).
 * @returns {string[][]} The generated grid as a 2D array of characters.
 */
function generateWordGrid(words, size) {
  const grid = Array.from({ length: size }, () => Array(size).fill(""));
  // Directions: [row_change, col_change]
  // [0, 1] = right, [1, 0] = down, [1, 1] = diagonal down-right, [-1, 1] = diagonal up-right
  const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  /**
   * Attempts to place a single word into the grid.
   * Includes an attempt counter to prevent infinite loops for unplaceable words.
   *
   * @param {string} word - The word to place.
   */
  function placeWord(word) {
    let placed = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 1000; // Limit attempts per word to prevent infinite loops

    while (!placed && attempts < MAX_ATTEMPTS) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startX = Math.floor(Math.random() * size);
      const startY = Math.floor(Math.random() * size);
      let x = startX;
      let y = startY;
      let valid = true;

      // First, check if the word can be placed without going out of bounds
      // or conflicting with existing letters
      for (let i = 0; i < word.length; i++) {
        if (
          x < 0 || y < 0 || x >= size || y >= size || // Out of bounds
          (grid[y][x] && grid[y][x] !== word[i]) // Conflict with existing letter
        ) {
          valid = false;
          break;
        }
        x += dir[0]; // Move to next character position based on direction
        y += dir[1];
      }

      // If the word fits and doesn't conflict, place it in the grid
      if (valid) {
        x = startX; // Reset to start position for placement
        y = startY;
        for (let i = 0; i < word.length; i++) {
          grid[y][x] = word[i];
          x += dir[0];
          y += dir[1];
        }
        placed = true;
      }
    }
    // Optional: Log a warning if a word couldn't be placed
    if (!placed) {
      console.warn(`Could not place word: "${word}" after ${MAX_ATTEMPTS} attempts.`);
    }
  }

  // Shuffle the words before placing them to vary the grid layout
  const shuffledWords = [...words].sort(() => 0.5 - Math.random());
  shuffledWords.forEach(placeWord);

  // Fill any remaining empty cells with random letters
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!grid[y][x]) {
        grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return grid;
}

// This is the entry point for the Web Worker.
// It listens for messages from the main thread.
self.onmessage = function(event) {
  // Extract words and size from the received message data
  const { words, size } = event.data;

  // Generate the grid
  const newGrid = generateWordGrid(words, size);

  // Send the generated grid back to the main thread
  self.postMessage(newGrid);
};