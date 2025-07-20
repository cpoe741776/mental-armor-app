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
  console.log('WordForgePage component render cycle start'); // DEBUG LOG

  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [isLoadingGrid, setIsLoadingGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState(null);
  const [dragCurrentCell, setDragCurrentCell] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const [actualWordsInGrid, setActualWordsInGrid] = useState([]);

  const workerRef = useRef(null);
  const gridRef = useRef(null);

  const masterWordsList = useMemo(() => [
    "OPTIMISM", "PURPOSE", "AWARENESS", "RESILIENCE", "FLEXIBILITY",
    "ANCHOR", "THOUGHTS", "CSF", "RHYTHM", "RATIONAL", "CONTROL",
    "FOCUS", "STRENGTH", "GRIT", "GROWTH", "PEER", "SUPPORT",
    "TOP", "RHONDA", "STORMY", "COOKIE", "BERTIE", "FORGE", "ARMOR"
  ], []);

  // Create a memoized audio instance for the success sound
  const successSound = useMemo(() => {
    try {
        const audio = new Audio("https://freesound.org/data/previews/256/256113_3263906-lq.mp3");
        audio.volume = 0.3;
        audio.load(); // Attempt to preload
        return audio;
    } catch (e) {
        console.error("Error creating audio object:", e);
        return null;
    }
  }, []); // Created once

  const currentGridSize = useMemo(() => {
    const levelConfig = LEVELS.find(level => level.level === currentLevel);
    return levelConfig ? levelConfig.size : 12;
  }, [currentLevel]);

  const theoreticallyPlayableWords = useMemo(() => {
    return masterWordsList.filter(word => word.length <= currentGridSize);
  }, [masterWordsList, currentGridSize]);

  // Effect to generate grid when level changes or words change
  useEffect(() => {
    console.log('useEffect: Grid generation worker setup/trigger. Current level:', currentLevel); // DEBUG LOG
    if (window.Worker) {
      if (workerRef.current) {
        workerRef.current.terminate(); // Terminate existing worker if changing level
      }
      workerRef.current = new Worker(new URL('./wordWorker.js', import.meta.url));

      workerRef.current.onmessage = (event) => {
        console.log('Worker: Grid data received.', event.data); // DEBUG LOG
        const { grid: receivedGrid, placedWords } = event.data; // Renamed to avoid confusion

        // Defensive check: Ensure receivedGrid is an array of arrays
        if (Array.isArray(receivedGrid) && receivedGrid.every(Array.isArray)) {
            setGrid(receivedGrid);
        } else {
            console.error("Worker returned malformed grid data:", receivedGrid); // DEBUG: Error log for malformed grid
            setGrid([]); // Fallback to empty array if malformed
        }
        
        setActualWordsInGrid(placedWords);
        setIsLoadingGrid(false);
        setFoundWords([]);
        setIsLevelCompleted(false);
      };

      workerRef.current.onerror = (error) => {
        console.error("Web Worker error:", error);
        setIsLoadingGrid(false);
        setIsLevelCompleted(false);
        setActualWordsInGrid([]);
        setGrid([]); // Ensure grid is reset on error too
      };

      setIsLoadingGrid(true);
      workerRef.current.postMessage({ words: theoreticallyPlayableWords, size: currentGridSize });
    } else {
      console.warn("Web Workers not supported. Grid generation will block the main thread.");
      setGrid([[]]); // Ensure grid has basic structure even if worker not supported
      setIsLoadingGrid(false);
      setIsLevelCompleted(false);
      setActualWordsInGrid([]);
    }

    return () => {
      console.log('useEffect cleanup: Grid generation worker termination.'); // DEBUG LOG
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [theoreticallyPlayableWords, currentGridSize, currentLevel]);

  // Effect to check for level completion
  useEffect(() => {
    console.log('useEffect: Level completion check. Loading:', isLoadingGrid, 'Actual words:', actualWordsInGrid.length, 'Found words:', foundWords.length); // DEBUG LOG
    if (!isLoadingGrid && actualWordsInGrid.length > 0) {
      const allActualWordsFound = actualWordsInGrid.every(word => foundWords.includes(word));
      setIsLevelCompleted(allActualWordsFound);
    } else if (!isLoadingGrid && actualWordsInGrid.length === 0 && theoreticallyPlayableWords.length === 0) {
      setIsLevelCompleted(true);
    } else if (!isLoadingGrid && actualWordsInGrid.length === 0 && theoreticallyPlayableWords.length > 0) {
      setIsLevelCompleted(false);
    }
  }, [foundWords, actualWordsInGrid, isLoadingGrid, theoreticallyPlayableWords]);

  // Effect for global CSS animation
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

  // Define updateForgeGlow using useCallback so it's a stable function reference
  const updateForgeGlow = useCallback((wordLength) => { // wordLength is passed
    const levelIntensity = currentLevel * 2; // Scales 2 to 24
    const wordBonus = wordLength * 0.5; // Small bonus for longer words
    const totalIntensity = Math.min(levelIntensity + wordBonus, 35); // Cap max intensity slightly higher

    const baseShadow = 10 + totalIntensity;
    const blurRadius = 5 + totalIntensity * 0.5;
    const colorAlpha = 0.3 + totalIntensity * 0.02; // Max 0.3 + 35*0.02 = 1.0 (capped at 0.9)

    // Make it more orange/red and vibrant as intensity increases
    const colorRed = 255;
    const colorGreen = Math.max(0, 150 - totalIntensity * 5); // Goes from 150 down to 0
    const colorBlue = Math.max(0, 0 + totalIntensity * 1); // Goes from 0 up to 35, making it slightly purple-ish at max

    const color = `rgba(${colorRed}, ${colorGreen}, ${colorBlue}, ${Math.min(colorAlpha, 0.9)})`;


    const forge = document.getElementById("word-forge-container");
    if (forge) {
      forge.style.boxShadow = `0 0 ${blurRadius}px ${baseShadow}px ${color}`;
      // Make animation faster for higher levels / intensity
      forge.style.animation = `forgeGlow ${Math.max(0.5, 2 - (totalIntensity * 0.04))}s ease-in-out infinite alternate`;
    }
  }, [currentLevel]); // Dependency: currentLevel, because its logic depends on it.

  // --- Touch Event Handlers (with useCallback) ---

  const getCellCoordinates = useCallback((event) => {
    // Defensive check: use optional chaining for grid[0] to prevent errors if grid is empty or grid[0] is undefined
    if (!gridRef.current || grid.length === 0 || !grid[0] || grid[0].length === 0) {
      console.log('getCellCoordinates: Grid not ready or empty. gridRef:', !!gridRef.current, 'grid.len:', grid.length, 'grid[0]:', !!grid[0]); // DEBUG LOG
      return null;
    }

    const gridRect = gridRef.current.getBoundingClientRect();
    const cellWidth = gridRect.width / grid[0].length;
    const cellHeight = gridRect.height / grid.length;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const x = Math.floor((clientX - gridRect.left) / cellWidth);
    const y = Math.floor((clientY - gridRect.top) / cellHeight);

    if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
      return [x, y];
    }
    return null;
  }, [grid]);


  const calculateCellsInLine = useCallback((start, end) => {
    const uniqueCells = new Set();
    if (!start || !end) return [];

    let [x0, y0] = start;
    const [x1, y1] = end;

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = (x0 < x1) ? 1 : -1;
    const sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    if (!(dx === 0 || dy === 0 || dx === dy)) {
        return [end];
    }

    while (true) {
        uniqueCells.add(`${x0},${y0}`);

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
    return Array.from(uniqueCells).map(coordStr => coordStr.split(',').map(Number));
  }, []);


  const handleTouchStart = useCallback((event) => {
    console.log('handleTouchStart triggered.'); // DEBUG LOG
    if (event.touches.length === 1) {
        event.preventDefault(); // Prevent default touch actions like scrolling
        const coords = getCellCoordinates(event);
        if (coords) {
            setIsDragging(true);
            setDragStartCell(coords);
            setDragCurrentCell(coords);
            setSelected([coords]);
        }
    }
  }, [getCellCoordinates]);

  const handleTouchMove = useCallback((event) => {
    if (!isDragging) return;
    console.log('handleTouchMove triggered.'); // DEBUG LOG
    event.preventDefault(); // Prevent default touch actions like scrolling

    const coords = getCellCoordinates(event);
    if (coords && (coords[0] !== dragCurrentCell?.[0] || coords[1] !== dragCurrentCell?.[1])) {
        setDragCurrentCell(coords);

        const newSelectedCells = calculateCellsInLine(dragStartCell, coords);
        setSelected(newSelectedCells);
    }
  }, [isDragging, dragStartCell, dragCurrentCell, getCellCoordinates, calculateCellsInLine]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      console.log('handleTouchEnd triggered. Selected:', selected.length); // DEBUG LOG
      setIsDragging(false);
      setDragStartCell(null);
      setDragCurrentCell(null);

      let str = "";
      const sortedSelected = [...selected].sort((a, b) => {
        if (a[1] === b[1]) return a[0] - b[0];
        return a[1] - b[1];
      });

      sortedSelected.forEach(([sx, sy]) => {
        if (grid[sy] && grid[sy][sx]) {
            str += grid[sy][sx];
        }
      });

      const reversedStr = str.split('').reverse().join('');

      actualWordsInGrid.forEach(word => {
        if ((str === word || reversedStr === word) && !foundWords.includes(word)) {
          setFoundWords(prev => [...prev, word]);
          updateForgeGlow(word.length); // Pass actual word length
          if (successSound) {
            successSound.currentTime = 0; // Reset to start
            successSound.play().catch(e => {
              console.warn("Audio playback failed (likely autoplay policy):", e);
            });
          }
        }
      });
      setSelected([]);
    }
  }, [isDragging, selected, grid, actualWordsInGrid, foundWords, successSound, updateForgeGlow]);


  const handleCellClick = useCallback((x, y) => {
    console.log('handleCellClick triggered. Cell:', x, y); // DEBUG LOG
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

      actualWordsInGrid.forEach(word => {
        if ((str === word || reversedStr === word) && !foundWords.includes(word)) {
          setFoundWords(prev => [...prev, word]);
          updateForgeGlow(word.length); // Pass actual word length
          if (successSound) {
            successSound.currentTime = 0;
            successSound.play().catch(e => {
              console.warn("Audio playback failed (likely autoplay policy):", e);
            });
          }
          setSelected([]);
        }
      });
    }
  }, [isDragging, selected, grid, actualWordsInGrid, foundWords, successSound, updateForgeGlow]);


  const goToLevel = useCallback((level) => {
    console.log('goToLevel triggered. New level:', level); // DEBUG LOG
    if (level >= 1 && level <= MAX_LEVEL) {
      setCurrentLevel(level);
    }
  }, []);

  // --- useEffect for manual touch event listeners ---
  useEffect(() => {
    console.log('useEffect: Attaching/Detaching touch listeners.'); // DEBUG LOG
    const gridElement = gridRef.current;
    if (gridElement) {
      console.log('Adding touch listeners to gridElement.'); // DEBUG LOG
      gridElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      gridElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      gridElement.addEventListener('touchend', handleTouchEnd, { passive: false });
      // You might also add touchcancel if needed for robustness
      // gridElement.addEventListener('touchcancel', handleTouchEnd, { passive: false });

      // Clean up event listeners when component unmounts or dependencies change
      return () => {
        console.log('Removing touch listeners from gridElement.'); // DEBUG LOG
        gridElement.removeEventListener('touchstart', handleTouchStart);
        gridElement.removeEventListener('touchmove', handleTouchMove);
        gridElement.removeEventListener('touchend', handleTouchEnd);
        // gridElement.removeEventListener('touchcancel', handleTouchEnd);
      };
    } else {
      console.log('gridRef.current is null when attempting to attach touch listeners.'); // DEBUG LOG
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);


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
          disabled={currentLevel === MAX_LEVEL || isLoadingGrid || !isLevelCompleted}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Level
        </button>
      </div>


      <div
        id="word-forge-container"
        className="rounded-xl bg-gray-800 p-4 shadow-xl max-w-4xl mx-auto"
        ref={gridRef} // Ref attached to this div
      >
        {isLoadingGrid ? (
          <div className="text-center p-8 text-xl">Generating grid...</div>
        ) : (
          <div className={`grid gap-1 p-4`}
               style={{ gridTemplateColumns: `repeat(${currentGridSize}, minmax(0, 1fr))` }}
          >
            {/* Added defensive checks for grid and row before mapping */}
            {grid && grid.length > 0 && grid.map((row, y) =>
              row && row.length > 0 && row.map((letter, x) => ( // Also check if row is valid
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
          {actualWordsInGrid.map(w => (
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