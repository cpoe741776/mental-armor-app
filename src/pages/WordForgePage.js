import React, { useEffect, useState, useMemo, useRef } from 'react';

export default function WordForgePage() {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isLoadingGrid, setIsLoadingGrid] = useState(true); // New state for loading

  const workerRef = useRef(null); // Ref to store the Web Worker instance

  const words = useMemo(() => [
    "OPTIMISM", "PURPOSE", "AWARENESS", "RESILIENCE", "FLEXIBILITY",
    "ANCHOR", "THOUGHTS", "CSF", "RHYTHM", "RATIONAL", "CONTROL",
    "FOCUS", "STRENGTH", "GRIT", "GROWTH", "PEER", "SUPPORT",
    "TOP", "RHONDA", "STORMY", "COOKIE", "BERTIE", "FORGE", "ARMOR"
  ], []);

  useEffect(() => {
    // Initialize Web Worker
    if (window.Worker) {
      workerRef.current = new Worker(new URL('./wordWorker.js', import.meta.url)); // Use import.meta.url for CRA/Vite compatibility

      workerRef.current.onmessage = (event) => {
        setGrid(event.data);
        setIsLoadingGrid(false); // Grid is loaded
      };

      workerRef.current.onerror = (error) => {
        console.error("Web Worker error:", error);
        setIsLoadingGrid(false); // Handle error case
      };

      // Start the grid generation in the worker
      setIsLoadingGrid(true); // Indicate loading
      workerRef.current.postMessage({ words, size: 12 });
    } else {
      // Fallback for browsers that don't support Web Workers (very rare now)
      console.warn("Web Workers not supported. Generating grid on main thread.");
      // You could put your generateWordGrid logic directly here as a fallback
      // or implement the "yielding" strategy below.
      const newGrid = generateWordGridFallback(words, 12); // Renamed to avoid confusion
      setGrid(newGrid);
      setIsLoadingGrid(false);
    }

    // Cleanup worker when component unmounts
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [words]);

  // A minimal fallback for generateWordGrid if workers aren't supported (or for testing)
  // This version would still block if run directly without yielding.
  function generateWordGridFallback(words, size) {
    const grid = Array.from({ length: size }, () => Array(size).fill(""));
    const directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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
        console.warn(`Fallback: Could not place word: ${word} after ${MAX_ATTEMPTS} attempts.`);
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
  // The rest of your WordForgePage component...

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
        {isLoadingGrid ? (
          <div className="text-center p-8 text-xl">Generating grid...</div>
        ) : (
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
        )}

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