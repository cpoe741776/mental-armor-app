/* eslint-disable no-restricted-globals */
/* eslint-env worker */

// wordWorker.js - This file runs in a separate thread (Web Worker)

/**
 * Generates a word search grid containing the specified words.
 *
 * @param {string[]} words - An array of words to place in the grid.
 * @param {number} size - The size of the square grid (e.g., 12 for a 12x12 grid).
 * @returns {{grid: string[][], placedWords: string[]}} The generated grid and a list of words actually placed.
 */
function generateWordGrid(words, size) {
  const grid = Array.from({ length: size }, () => Array(size).fill(""));
  const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const placedWords = []; // Array to store words that were successfully placed

  /**
   * Attempts to place a single word into the grid.
   * Includes an attempt counter to prevent infinite loops for unplaceable words.
   *
   * @param {string} word - The word to place.
   * @returns {boolean} True if the word was placed, false otherwise.
   */
  function placeWord(word) {
    let placed = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 5000; // Increased attempts for better chance of placement

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
        placedWords.push(word); // Add to placedWords only if successful
      }
    }
    if (!placed) {
      console.warn(`Could not place word: "${word}" after ${MAX_ATTEMPTS} attempts.`);
    }
    return placed;
  }

  const shuffledWords = [...words].sort(() => 0.5 - Math.random());

  shuffledWords.forEach(word => {
    placeWord(word);
  });

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!grid[y][x]) {
        grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, placedWords }; // Ensure this returns the object { grid, placedWords }
}

self.onmessage = function(event) {
  const { words, size } = event.data;
  const { grid, placedWords } = generateWordGrid(words, size);
  self.postMessage({ grid, placedWords }); // THIS LINE IS THE MOST CRITICAL. It must send an object.
};