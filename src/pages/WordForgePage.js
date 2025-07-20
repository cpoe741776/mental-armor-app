import React, { useEffect, useState } from 'react';

export default function WordForgePage() {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [foundWords, setFoundWords] = useState(new Set());

  const words = [
    "OPTIMISM", "PURPOSE", "AWARENESS", "RESILIENCE", "FLEXIBILITY",
    "ANCHOR", "TOUGHTS", "CSF", "RHYTHM", "RATIONAL", "CONTROL",
    "FOCUS", "STRENGTH", "GRIT", "GROWTH", "PEER", "SUPPORT",
    "TOP", "RHONDA", "STORMY", "COOKIE", "BERTIE", "FORGE", "ARMOR"
  ];

  const gridSize = 12;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Initial grid setup
  useEffect(() => {
    const newGrid = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill("")
    );

    function placeWord(word) {
      const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
      let placed = false;
      while (!placed) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const startX = Math.floor(Math.random() * gridSize);
        const startY = Math.floor(Math.random() * gridSize);
        let x = startX, y = startY, valid = true;

        for (let i = 0; i < word.length; i++) {
          if (
            x < 0 || y < 0 || x >= gridSize || y >= gridSize ||
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

    words.forEach(placeWord);

    // Fill remaining cells
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!newGrid[y][x]) {
          newGrid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    setGrid(newGrid);
  }, []);
  const toggleSelect = (x, y) => {
    const key = `${x},${y}`;
    const newSet = new Set(selected);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setSelected(newSet);

    // Build string from selection
    let selectedString = "";
    newSet.forEach(k => {
      const [sx, sy] = k.split(",").map(Number);
      selectedString += grid[sy][sx];
    });

    // Check for any found word
    for (let word of words) {
      if (selectedString.includes(word) && !foundWords.has(word)) {
        const updated = new Set(foundWords);
        updated.add(word);
        setFoundWords(updated);
        playSound();
      }
    }
  };

  const playSound = () => {
    const sound = new Audio("https://freesound.org/data/previews/256/256113_3263906-lq.mp3");
    sound.volume = 0.3;
    sound.play();
  };
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 Mental Armor Word Forge</h1>
      <p className="text-center mb-6 text-sm text-gray-400">
        A focused break for the mind — find resilience skills and trainer names to sharpen your recall and relax.
      </p>

      <div className="grid grid-cols-12 gap-1 bg-gray-800 p-4 rounded-xl max-w-4xl mx-auto shadow-xl">
        {grid.flatMap((row, y) =>
          row.map((letter, x) => {
            const key = `${x},${y}`;
            const isSelected = selected.has(key);
            return (
              <div
                key={key}
                onClick={() => toggleSelect(x, y)}
                className={`w-8 h-8 flex items-center justify-center font-bold text-sm rounded cursor-pointer select-none
                  ${isSelected ? 'bg-green-500' : 'bg-gray-900 hover:bg-indigo-500'} text-white`}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 max-w-4xl mx-auto">
        <p className="text-sm text-gray-300 mb-2 font-mono">Find These Words:</p>
        <div className="flex flex-wrap gap-2 text-sm font-mono">
          {words.map(word => (
            <span
              key={word}
              className={`px-2 py-1 rounded ${
                foundWords.has(word) ? 'bg-green-700' : 'bg-gray-700'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
