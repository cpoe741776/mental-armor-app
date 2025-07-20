// src/pages/WordForgePage.js
import React, { useState, useEffect } from 'react';

const WORDS = [
  "OPTIMISM", "PURPOSE", "AWARENESS", "RESILIENCE", "FLEXIBILITY",
  "ANCHOR", "TOUGHTS", "CSF", "RHYTHM", "RATIONAL", "CONTROL",
  "FOCUS", "STRENGTH", "GRIT", "GROWTH", "PEER", "SUPPORT",
  "TOP", "RHONDA", "STORMY", "COOKIE", "BERTIE", "FORGE", "ARMOR"
];

const GRID_SIZE = 12;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function WordForgePage() {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  useEffect(() => {
    const emptyGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(""));
    const filledGrid = placeWordsInGrid(emptyGrid);
    setGrid(filledGrid);
  }, []);

  function placeWordsInGrid(grid) {
    const newGrid = [...grid.map(row => [...row])];

    const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    for (const word of WORDS) {
      let placed = false;
      while (!placed) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startX = Math.floor(Math.random() * GRID_SIZE);
        const startY = Math.floor(Math.random() * GRID_SIZE);
        let x = startX;
        let y = startY;
        let valid = true;

        for (let i = 0; i < word.length; i++) {
          if (
            x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE ||
            (newGrid[y][x] && newGrid[y][x] !== word[i])
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
            newGrid[y][x] = word[i];
            x += dir[0];
            y += dir[1];
          }
          placed = true;
        }
      }
    }

    // Fill empty cells
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!newGrid[y][x]) {
          newGrid[y][x] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
        }
      }
    }

    return newGrid;
  }

  function handleCellClick(x, y) {
    const key = `${x},${y}`;
    const isSelected = selected.some(([sx, sy]) => sx === x && sy === y);
    const updated = isSelected
      ? selected.filter(([sx, sy]) => !(sx === x && sy === y))
      : [...selected, [x, y]];
    setSelected(updated);

    // Build string from selected cells
    const selectedString = updated.map(([sx, sy]) => grid[sy][sx]).join("");

    for (const word of WORDS) {
      if (selectedString.includes(word) && !foundWords.includes(word)) {
        setFoundWords([...foundWords, word]);
        const sound = new Audio("https://freesound.org/data/previews/256/256113_3263906-lq.mp3");
        sound.volume = 0.3;
        sound.play();
        break;
      }
    }
  }

  const getGlowStyle = () => {
    const glowLevel = Math.min(foundWords.length, 10);
    const base = 10 + glowLevel * 2;
    const color = `rgba(255, ${100 + glowLevel * 10}, 0, ${0.3 + glowLevel * 0.05})`;
    return {
      boxShadow: `0 0 ${base}px ${base / 2}px ${color}`,
      animation: `forgeGlow 2s ease-in-out infinite`,
    };
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 Mental Armor Word Forge</h1>
      <p className="text-center mb-6 text-sm text-gray-400">
        A focused break for the mind — find resilience skills and trainer names to sharpen your recall and relax.
      </p>
      <div
        className="bg-gray-800 rounded-xl p-4 shadow-xl max-w-4xl mx-auto"
        style={getGlowStyle()}
      >
        <div className="grid grid-cols-12 gap-1 justify-center">
          {grid.map((row, y) =>
            row.map((letter, x) => {
              const isSelected = selected.some(([sx, sy]) => sx === x && sy === y);
              return (
                <div
                  key={`${x}-${y}`}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded select-none cursor-pointer
                    ${isSelected ? "bg-green-500" : "bg-gray-900"} hover:bg-indigo-500`}
                  onClick={() => handleCellClick(x, y)}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>
        <div className="mt-4 text-white text-sm font-mono">
          <strong>Find These Words:</strong>
          <div className="flex flex-wrap mt-1">
            {WORDS.map(word => (
              <span
                key={word}
                className={`m-1 p-1 rounded ${
                  foundWords.includes(word)
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WordForgePage;
