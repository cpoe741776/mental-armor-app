import React, { useEffect, useState } from 'react';

export default function WordForgePage() {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  const words = [
    "OPTIMISM", "PURPOSE", "AWARENESS", "RESILIENCE", "FLEXIBILITY",
    "ANCHOR", "THOUGHTS", "CSF", "RHYTHM", "RATIONAL", "CONTROL",
    "FOCUS", "STRENGTH", "GRIT", "GROWTH", "PEER", "SUPPORT",
    "TOP", "RHONDA", "STORMY", "COOKIE", "BERTIE", "FORGE", "ARMOR"
  ];

  useEffect(() => {
    const newGrid = generateWordGrid(words, 12);
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes forgeGlow {
        0% { box-shadow: 0 0 10px rgba(255, 100, 0, 0.3); }
        50% { box-shadow: 0 0 25px rgba(255, 150, 0, 0.6); }
        100% { box-shadow: 0 0 10px rgba(255, 100, 0, 0.3); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  function generateWordGrid(words, size) {
    const grid = Array.from({ length: size }, () => Array(size).fill(""));
    const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function placeWord(word) {
      let placed = false;
      while (!placed) {
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
    }

    words.forEach(placeWord);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!grid[y][x]) {
          grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    return grid;
  }

  function handleCellClick(x, y) {
    const alreadySelected = selected.some(([sx, sy]) => sx === x && sy === y);
    const newSelected = alreadySelected
      ? selected.filter(([sx, sy]) => sx !== x || sy !== y)
      : [...selected, [x, y]];
    setSelected(newSelected);

    let str = "";
    newSelected.forEach(([sx, sy]) => {
      str += grid[sy][sx];
    });

    words.forEach(word => {
      if (str.includes(word) && !foundWords.includes(word)) {
        setFoundWords(prev => [...prev, word]);
        updateForgeGlow(newSelected.length);
        const sound = new Audio("https://freesound.org/data/previews/256/256113_3263906-lq.mp3");
        sound.volume = 0.3;
        sound.play();
      }
    });
  }

  function updateForgeGlow(intensity) {
    const glow = Math.min(intensity, 10);
    const base = 10 + glow * 2;
    const color = `rgba(255, ${100 + glow * 10}, 0, ${0.3 + glow * 0.05})`;

    const forge = document.getElementById("word-forge-container");
    if (forge) {
      forge.style.boxShadow = `0 0 ${base}px ${base / 2}px ${color}`;
      forge.style.animation = "forgeGlow 2s ease-in-out infinite";
    }
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 Mental Armor Word Forge</h1>
      <p className="text-center mb-6 text-sm text-gray-400">
        A focused break for the mind — find resilience skills and trainer names to sharpen your recall and relax.
      </p>

      <div
        id="word-forge-container"
        className="rounded-xl bg-gray-800 p-4 shadow-xl max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-12 gap-1 p-4">
          {grid.map((row, y) =>
            row.map((letter, x) => (
              <div
                key={`${x},${y}`}
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded select-none cursor-pointer
                  ${selected.some(([sx, sy]) => sx === x && sy === y)
                    ? "bg-green-500"
                    : "bg-gray-900"} hover:bg-indigo-500`}
                onClick={() => handleCellClick(x, y)}
              >
                {letter}
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-white text-sm font-mono">
          <strong>Find These Words:</strong><br />
          {words.map(w => (
            <span
              key={w}
              className={`inline-block m-1 p-1 rounded ${
                foundWords.includes(w) ? "bg-green-700" : "bg-gray-700"
              }`}
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
