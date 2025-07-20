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
  const [currentLevel, setCurrentLevel] = useState(1);

  const workerRef = useRef(null);
  const gridRef = useRef(null); // Ref to the grid container for calculating cell positions

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
      console.warn("Web Workers not supported. Grid generation will block the main thread.");
      // Fallback: If Web Workers are not supported, you would run the grid generation here.
      // This part is intentionally omitted to keep the worker path clean,
      // but in a real app, you'd have generateWordGridFallback here or a simpler grid.
      setGrid([[]]); // Set an empty grid or a very small default
      setIsLoadingGrid(false);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [words, currentGridSize]); // Add currentGridSize to dependencies

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

  // --- Drag Selection Logic ---

  // Helper to get grid coordinates from touch/mouse event
  const getCellCoordinates = useCallback((event) => {
    if (!gridRef.current || grid.length === 0 || grid[0].length === 0) return null;

    const gridRect = gridRef.current.getBoundingClientRect();
    const cellWidth = gridRect.width / grid[0].length;
    const cellHeight = gridRect.height / grid.length;

    // Use changedTouches[0] for touch events, or event for mouse events
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const x = Math.floor((clientX - gridRect.left) / cellWidth);
    const y = Math.floor((clientY - gridRect.top) / cellHeight);

    // Ensure coordinates are within grid bounds
    if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
      return [x, y];
    }
    return null;
  }, [grid]);


  // Helper to calculate cells in a straight line between two points (Bresenham's algorithm)
  const calculateCellsInLine = useCallback((start, end) => {
    const cells = [];
    if (!start || !end) return cells;

    let [x0, y0] = start;
    const [x1, y1] = end;

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    // Allow only strictly horizontal, vertical, or diagonal lines for word search
    // This part ensures selections are meaningful for word search
    if (!(dx === 0 || dy === 0 || dx === dy || dx === -dy)) {
        // If not a straight line, only select the start and end cell
        // Or, better, just the current cell if it's the only one valid
        return [end]; // Only select the current cell if not a valid line
    }

    while (true) {
        // Add cell if it's not already in the path (to avoid duplicates from line algorithm)
        if (!cells.some(c => c[0] === x0 && c[1] === y0)) {
            cells.push([x0, y0]);
        }

        if (x0 === x1 && y0 === y1) break;

        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    return cells;
  }, []);


  const handleTouchStart = useCallback((event) => {
    // Only respond to the first touch to prevent multi-touch issues with selection
    if (event.touches.length === 1) {
        event.preventDefault(); // Prevent scrolling on touch
        const coords = getCellCoordinates(event);
        if (coords) {
            setIsDragging(true);
            setDragStartCell(coords);
            setDragCurrentCell(coords); // Initialize current cell
            setSelected([coords]); // Start selection with the first touched cell
        }
    }
  }, [getCellCoordinates]);

  const handleTouchMove = useCallback((event) => {
    if (!isDragging) return;
    event.preventDefault(); // Prevent scrolling on touch

    const coords = getCellCoordinates(event);
    if (coords && (coords[0] !== dragCurrentCell?.[0] || coords[1] !== dragCurrentCell?.[1])) {
        setDragCurrentCell(coords); // Update current cell only if it changed

        // Calculate and set the new selected cells based on drag path
        const newSelectedCells = calculateCellsInLine(dragStartCell, coords);
        setSelected(newSelectedCells);
    }
  }, [isDragging, dragStartCell, dragCurrentCell, getCellCoordinates, calculateCellsInLine]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragStartCell(null);
      setDragCurrentCell(null);

      // Finalize the word check after drag ends
      let str = "";
      // Sort selected cells to form the word in reading order (left-to-right, top-to-bottom)
      // This is crucial for correct word matching, as drag path might be irregular
      const sortedSelected = [...selected].sort((a, b) => {
        if (a[1] === b[1]) return a[0] - b[0]; // Same row, sort by column
        return a[1] - b[1]; // Sort by row
      });

      sortedSelected.forEach(([sx, sy]) => {
        if (grid[sy] && grid[sy][sx]) { // Defensive check
            str += grid[sy][sx];
        }
      });

      // Check if the formed string or its reverse is a word
      const reversedStr = str.split('').reverse().join(''); // Word search words can be reversed

      let wordFound = false;
      words.forEach(word => {
        if ((str === word || reversedStr === word) && !foundWords.includes(word)) {
          setFoundWords(prev => [...prev, word]);
          updateForgeGlow(selected.length);
          const sound = new Audio("https://freesound.org/data/previews/256/256113_3263906-lq.mp3");
          sound.volume = 0.3;
          sound.play();
          wordFound = true;
        }
      });
      setSelected([]); // Clear selection after checking

      // If a word was found, consider generating a new grid or just celebrating
      // For now, it just clears selection and celebrates
    }
  }, [isDragging, selected, grid, words, foundWords]);


  // --- Existing single-click logic adjusted ---
  const handleCellClick = useCallback((x, y) => {
    // If not dragging, allow single clicks to select/deselect
    // (This path will likely be less used with drag select but kept for completeness)
    if (!isDragging) {
      const alreadySelected = selected.some(([sx, sy]) => sx === x && sy === y);
      const newSelected = alreadySelected
        ? selected.filter(([sx, sy]) => sx !== x || sy !== y)
        : [...selected, [x, y]];
      setSelected(newSelected);

      let str = "";
      const sortedSelected = [...newSelected].sort((a, b) => {
        if (a[1] === b[1]) return a[0] - b[0];
        return a[1] - b[1];
      });

      sortedSelected.forEach(([sx, sy]) => {
        if (grid[sy] && grid[sy][sx]) {
            str += grid[sy][sx];
        }
      });

      const reversedStr = str.split('').reverse().join('');

      words.forEach(word => {
        if ((str === word || reversedStr === word) && !foundWords.includes(word)) {
          setFoundWords(prev => [...prev, word]);
          updateForgeGlow(newSelected.length);
          const sound = new Audio("https://freesound.org/data/previews/256/256113_3263906-lq.mp3");
          sound.volume = 0.3;
          sound.play();
          setSelected([]); // Clear selection after finding a word on single click
        }
      });
    }
  }, [isDragging, selected, grid, words, foundWords]);


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

  const goToLevel = useCallback((level) => {
    if (level >= 1 && level <= MAX_LEVEL) {
      setCurrentLevel(level);
      // The useEffect above will handle regenerating the grid
    }
  }, []);

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
               style={{ gridTemplateColumns: `repeat(${currentGridSize}, minmax(0, 1fr))` }}
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