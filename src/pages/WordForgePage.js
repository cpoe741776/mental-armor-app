import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';

// Define your level configurations
const LEVELS = [
  { level: 1, size: 5, label: "Beginner (5x5)" },
  { level: 2, size: 6, label: "Easy (6x6)" },
  { level: 3, size: 7, label: "Moderate (7x7)" },
  { level: 4, size: 8, label: "Intermediate (8x8)" },
  { level: 5, size: 9, label: "Challenging (9x9)" },
  { level: 6, size: 10, label: "Hard (10x10)" },
  { level: 7, size: 11, label: "Expert (11x11)" },
  { level: 8, size: 12, label: "Master (12x12)" },
];
const MAX_LEVEL = LEVELS.length;

export default function WordForgePage() {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isLoadingGrid, setIsLoadingGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState(null);
  const [dragCurrentCell, setDragCurrentCell] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1); // New state for current level

  const workerRef = useRef(null);
  const gridRef = useRef(null);

  const words = useMemo(() => [
    "OPTIMISM", "PURPOSE", "AWARENESS", "RESILIENCE", "FLEXIBILITY",
    "ANCHOR", "THOUGHTS", "CSF", "RHYTHM", "RATIONAL", "CONTROL",
    "FOCUS", "STRENGTH", "GRIT", "GROWTH", "PEER", "SUPPORT",
    "TOP", "RHONDA", "STORMY", "COOKIE", "BERTIE", "FORGE", "ARMOR"
  ], []);

  // Determine current grid size based on level
  const currentGridSize = useMemo(() => {
    const levelConfig = LEVELS.find(level => level.level === currentLevel);
    return levelConfig ? levelConfig.size : 12; // Default to 12 if level not found
  }, [currentLevel]);

  // Effect to generate grid when level changes or words change
  useEffect(() => {
    if (window.Worker) {
      if (workerRef.current) {
        workerRef.current.terminate(); // Terminate existing worker if changing level
      }
      workerRef.current = new Worker(new URL('./wordWorker.js', import.meta.url));

      workerRef.current.onmessage = (event) => {
        setGrid(event.data);
        setIsLoadingGrid(false);
        setFoundWords([]); // Reset found words for new grid
      };

      workerRef.current.onerror = (error) => {
        console.error("Web Worker error:", error);
        setIsLoadingGrid(false);
      };

      setIsLoadingGrid(true);
      workerRef.current.postMessage({ words, size: currentGridSize });
    } else {
      console.warn("Web Workers not supported. Generating grid on main thread.");
      setGrid([]);
      setIsLoadingGrid(false);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [words, currentGridSize]); // Add currentGridSize to dependencies

  // ... (rest of your useEffect for style, handleTouchStart, handleTouchMove, handleTouchEnd, getCellCoordinates, calculateCellsInLine, handleCellClick, updateForgeGlow functions remain the same) ...

  const goToLevel = (level) => {
    if (level >= 1 && level <= MAX_LEVEL) {
      setCurrentLevel(level);
      // The useEffect above will handle regenerating the grid
    }
  };


  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 Mental Armor Word Forge</h1>
      <p className="text-center mb-6 text-sm text-gray-400">
        A focused break for the mind — find resilience skills and trainer names to sharpen your recall and relax.
      </p>

      {/* Level Selection UI */}
      <div className="flex justify-center items-center mb-6 space-x-2">
        <button
          onClick={() => goToLevel(currentLevel - 1)}
          disabled={currentLevel === 1 || isLoadingGrid}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Level
        </button>
        <span className="text-xl font-bold">
          Level {currentLevel} ({currentGridSize}x{currentGridSize})
        </span>
        <button
          onClick={() => goToLevel(currentLevel + 1)}
          disabled={currentLevel === MAX_LEVEL || isLoadingGrid}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Level
        </button>
      </div>


      <div
        id="word-forge-container"
        className="rounded-xl bg-gray-800 p-4 shadow-xl max-w-4xl mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={gridRef}
      >
        {isLoadingGrid ? (
          <div className="text-center p-8 text-xl">Generating grid...</div>
        ) : (
          <div className={`grid gap-1 p-4`}
               style={{ gridTemplateColumns: `repeat(${currentGridSize}, minmax(0, 1fr))` }} // Dynamic columns
          >
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