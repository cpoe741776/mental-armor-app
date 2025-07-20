/* eslint-disable no-restricted-globals */
/* eslint-env worker */ // Keep this just in case it ever starts working or for local linting

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
    const MAX_ATTEMPTS = 1000;

    while (!placed && attempts < MAX_ATTEMPTS) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startX = Math.floor(Math.random() * size);
      const startY = Math.floor(Math.random() * size);
      let x = startX;
      let y = startY;
      let valid = true;

      for (let i = 0; i < word.length; i++) {
        if (
          x < 0 || y < 0 || x >= size || y >= size ||
          (grid[y][x] && grid[y][x] !== word[i])
        ) {
          valid = false;
          break;
        }
        x += dir[0];
        y += dir[1];
      }

      if (valid) {
        x = startX;
        y = startY;
        for (let i = 0; i < word.length; i++) {
          grid[y][x] = word[i];
          x += dir[0];
          y += dir[1];
        }
        placed = true;
      }
    }
    if (!placed) {
      console.warn(`Could not place word: "${word}" after ${MAX_ATTEMPTS} attempts.`);
    }
  }

  const shuffledWords = [...words].sort(() => 0.5 - Math.random());
  shuffledWords.forEach(placeWord);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!grid[y][x]) {
        grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return grid;
}

self.onmessage = function(event) {
  const { words, size } = event.data;
  const newGrid = generateWordGrid(words, size);
  self.postMessage(newGrid);
};