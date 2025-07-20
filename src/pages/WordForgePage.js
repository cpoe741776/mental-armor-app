import React, { useEffect, useCallback } from 'react';

export default function WordForgePage() {
  const injectForgeGlowKeyframes = useCallback(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes forgeGlow {
        0%   { box-shadow: 0 0 10px rgba(255, 100, 0, 0.3); }
        50%  { box-shadow: 0 0 25px rgba(255, 150, 0, 0.6); }
        100% { box-shadow: 0 0 10px rgba(255, 100, 0, 0.3); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const updateForgeGlow = useCallback((container, foundCount) => {
    let glowLevel = Math.min(foundCount, 10);
    const base = 10 + glowLevel * 2;
    const color = `rgba(255, ${100 + glowLevel * 10}, 0, ${0.3 + glowLevel * 0.05})`;
    container.style.boxShadow = `0 0 ${base}px ${base / 2}px ${color}`;
    container.style.animation = "forgeGlow 2s ease-in-out infinite";
  }, []);

  const renderWordForge = useCallback((containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    const words = [
      "OPTIMISM", "PURPOSE", "AWARENESS", "RESILIENCE", "FLEXIBILITY",
      "ANCHOR", "TOUGHTS", "CSF", "RHYTHM", "RATIONAL", "CONTROL",
      "FOCUS", "STRENGTH", "GRIT", "GROWTH", "PEER", "SUPPORT",
      "TOP", "RHONDA", "STORMY", "COOKIE", "BERTIE", "FORGE", "ARMOR"
    ];

    const gridSize = 12;
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
    const foundSound = new Audio("https://freesound.org/data/previews/256/256113_3263906-lq.mp3");
    foundSound.volume = 0.3;

    function placeWord(word) {
      const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
      let placed = false;
      while (!placed) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startX = Math.floor(Math.random() * gridSize);
        const startY = Math.floor(Math.random() * gridSize);
        let x = startX, y = startY, valid = true;

        for (let i = 0; i < word.length; i++) {
          if (x < 0 || y < 0 || x >= gridSize || y >= gridSize || (grid[y][x] && grid[y][x] !== word[i])) {
            valid = false;
            break;
          }
          x += dir[0]; y += dir[1];
        }

        if (valid) {
          x = startX; y = startY;
          for (let i = 0; i < word.length; i++) {
            grid[y][x] = word[i];
            x += dir[0]; y += dir[1];
          }
          placed = true;
        }
      }
    }

    words.forEach(word => placeWord(word));

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!grid[y][x]) {
          grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    const board = document.createElement("div");
    board.className = "grid grid-cols-12 gap-1 p-4 bg-gray-800 rounded-xl shadow-lg";
    const selectedCells = new Set();
    let foundWords = new Set();

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement("div");
        cell.textContent = grid[y][x];
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.className = "text-white bg-gray-900 w-8 h-8 flex items-center justify-center text-sm font-bold rounded hover:bg-indigo-500 cursor-pointer select-none";
        board.appendChild(cell);
      }
    }

    const wordList = document.createElement("div");
    wordList.className = "mt-4 text-white text-sm font-mono";
    wordList.innerHTML = "<strong>Find These Words:</strong><br>" +
      words.map(w => `<span class="inline-block m-1 p-1 bg-gray-700 rounded">${w}</span>`).join(" ");

    container.appendChild(board);
    container.appendChild(wordList);

    board.addEventListener("click", (e) => {
      if (!e.target.dataset.x) return;
      const cell = e.target;
      const key = cell.dataset.x + "," + cell.dataset.y;

      if (selectedCells.has(key)) {
        selectedCells.delete(key);
        cell.classList.remove("bg-green-500");
      } else {
        selectedCells.add(key);
        cell.classList.add("bg-green-500");
      }

      let selectedString = "";
      selectedCells.forEach(k => {
        const [x, y] = k.split(",").map(Number);
        selectedString += grid[y][x];
      });

      words.forEach(word => {
        if (selectedString.includes(word) && !foundWords.has(word)) {
          foundWords.add(word);
          foundSound.play();
          updateForgeGlow(container, foundWords.size);
        }
      });
    });

    updateForgeGlow(container, 0);
  }, [updateForgeGlow]);

  useEffect(() => {
  injectForgeGlowKeyframes();
  requestAnimationFrame(() => renderWordForge("word-forge-container"));
}, [injectForgeGlowKeyframes, renderWordForge]);


  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 Mental Armor Word Forge</h1>
      <p className="text-center mb-6 text-sm text-gray-400">
        A focused break for the mind — find resilience skills and trainer names to sharpen your recall and relax.
      </p>
      <div id="word-forge-container" className="rounded-xl bg-gray-800 p-4 shadow-xl max-w-4xl mx-auto" />
    </div>
  );
}
