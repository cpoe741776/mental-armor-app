/* eslint-env worker */

// wordWorker.js
function generateWordGrid(words, size) {
  // ... (rest of your worker code)
}

// Listen for messages from the main thread
self.onmessage = function(event) { // Line 68:1
  const { words, size } = event.data;
  const newGrid = generateWordGrid(words, size);
  // Send the result back to the main thread
  self.postMessage(newGrid); // Line 72:3
};

// wordWorker.js
function generateWordGrid(words, size) {
  const grid = Array.from({ length: size }, () => Array(size).fill(""));
  const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function placeWord(word) {
    let placed = false;
    let attempts = 0; // Add an attempt counter to prevent infinite loops for impossible placements
    const MAX_ATTEMPTS = 1000; // Limit attempts per word

    while (!placed && attempts < MAX_ATTEMPTS) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const startX = Math.floor(Math.random() * size);
      const startY = Math.floor(Math.random() * size);
      let x = startX;
      let y = startY;
      let valid = true;

      // Check if word fits and doesn't conflict
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

      // If valid, place the word
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
    // If a word couldn't be placed after MAX_ATTEMPTS, you might want to log a warning
    if (!placed) {
      console.warn(`Could not place word: ${word} after ${MAX_ATTEMPTS} attempts.`);
    }
  }

  // Shuffle words to potentially avoid getting stuck on earlier difficult words
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

// Listen for messages from the main thread
self.onmessage = function(event) {
  const { words, size } = event.data;
  const newGrid = generateWordGrid(words, size);
  // Send the result back to the main thread
  self.postMessage(newGrid);
};