import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';

// Define your module and word data
const MODULE_DATA = [
  {
    id: 'foundations',
    name: 'Foundations of Resilience',
    words: [
      "RESILIENCE", "ADAPT", "RECOVER", "GROW", "STRENGTH",
      "ENDURANCE", "SKILLS", "MYTHS", "FACTS", "BENEFITS",
      "PRACTICE", "MINDSET", "STRESSORS", "WELLBEING", "PURPOSE",
      "EMOTIONS", "CHALLENGES", "AWARE", "COMPOSED", "RESOURCES",
      "PERFORMANCE", "TEAMWORK", "LEADERSHIP", "DECISION", "IDEAS",
      "NAVIGATING", "CHANGING", "PHYSICAL", "HEALTH", "SYMPTOMS",
      "BURNOUT", "CYNICISM", "PESSIMISM", "REWIRE", "INTENTIONAL",
      "FIXED", "FEEDBACK", "JUDGEMENT"
    ]
  },
  {
    id: 'flexStrengths',
    name: 'Flex Your Strengths',
    words: [
      "STRENGTHS", "SIGNATURE", "REGULATION", "SPOTTING", "FLEXING",
      "CHARACTER", "VIA", "SURVEY", "VALUES", "CHALLENGE",
      "SELF-AWARENESS", "APPRECIATION", "EXPRESSION", "ENCOURAGEMENT", "WELLBEING",
      "GROWTH", "HABIT", "PRACTICE", "MOTIVATION", "ENERGY",
      "POSITIVE", "RESILIENCE", "ADAPT", "RECOGNITION", "EXPLORE",
      "INSPIRE", "FLOW", "REFLECTION", "PERSPECTIVE", "CONFIDENCE"
    ]
  },
  {
    id: 'valuesBased',
    name: 'Values Based Living',
    words: [
      "PURPOSE", "MEANING", "VALUES", "GOALS", "DIRECTION",
      "RENEWAL", "CHART", "COURSE", "INTERNAL", "EXTERNAL",
      "OBSTACLES", "OVERCOME", "DEFINE", "SET", "PLAN",
      "LONGTERM", "SHORTTERM", "IMMEDIATE", "PARTNER", "ACTION",
      "SHARE", "NAVIGATE", "JOURNEY", "REFLECTION", "MOTIVATION",
      "CLARITY", "INTENTIONAL", "ALIGNMENT", "COMMITMENT", "PRIORITIES"
    ]
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    words: [
      "PRESENCE", "FOCUS", "GROUNDING", "AWARENESS", "BREATH",
      "CALM", "REFLECTION", "OBSERVE", "DISTRACTION", "ATTENTION",
      "STILLNESS", "BALANCE", "CONSCIOUS", "ANCHORING", "GROUNDED",
      "RECENTER", "ACCEPTANCE", "SENSATIONS", "NONJUDGMENT", "PAUSE",
      "MEDITATION", "RESILIENCE", "RESPONSE", "MOMENT", "INTENTIONAL",
      "CLARITY", "CENTER", "STRESS", "ENGAGEMENT", "NOW"
    ]
  },
  {
    id: 'spiritual',
    name: 'Spiritual Resilience',
    words: [
      "PURPOSE", "BELIEFS", "VALUES", "MEANING", "FAITH",
      "HOPE", "STRENGTH", "GRACE", "GROWTH", "RESILIENT",
      "INSPIRE", "SPIRIT", "WELLNESS", "ENDURE", "COURAGE",
      "VISION", "TRUST", "ANCHORED", "REFLECT", "HEALING",
      "GROUNDED", "CLARITY", "CONNECTION", "PEACE", "MINDSET",
      "ACCEPTANCE", "BALANCE", "RENEWAL", "OPTIMISM", "PERSEVERE"
    ]
  },
  {
    id: 'gratitude',
    name: 'Cultivate Gratitude',
    words: [
      "GRATITUDE", "OPTIMISM", "APPRECIATION", "POSITIVITY", "REFLECTION",
      "PERSPECTIVE", "AWARENESS", "BLESSINGS", "THANKFULNESS", "PRESENCE",
      "GOODNESS", "JOY", "SAVORING", "KINDNESS", "CONTENTMENT",
      "HOPE", "REWIRE", "ANCHORING", "MINDSET", "WARMTH",
      "ATTITUDE", "FOCUS", "UPLIFT", "RECOGNITION", "ENERGY",
      "NOTICING", "ACKNOWLEDGMENT", "BALANCE", "CALM", "PURPOSE"
    ]
  },
  {
    id: 'reframe',
    name: 'ReFrame',
    words: [
      "THOUGHTS", "EVENTS", "REACTIONS", "EMOTION", "PHYSICAL",
      "AWARENESS", "PAUSE", "PERSPECTIVE", "CLARITY", "INTENTION",
      "SHIFT", "TRIGGER", "OBJECTIVITY", "PERCEPTION", "INFLUENCE",
      "INTERPRETATION", "RECOVERY", "FOCUS", "MODEL", "MINDSET",
      "EVALUATE", "ADJUST", "HARM", "HELP", "RESPONSE",
      "CHOICE", "REFLECTION", "PATTERN", "REFRAME", "STRENGTH"
    ]
  },
  {
    id: 'balanceThinking',
    name: 'Balance Your Thinking',
    words: [
      "ACCURACY", "EVIDENCE", "CLARITY", "REACTION", "EMOTION",
      "COGNITION", "BIAS", "STRATEGY", "PATTERN", "TRAPS",
      "BLAMING", "OBJECTIVITY", "MINDSET", "EXAMINE", "CHECK",
      "DOUBLE", "PHONEAFRIEND", "DISTORTION", "PERSPECTIVE", "RESPONSE",
      "REFRAME", "AWARENESS", "CLARIFY", "PAUSE", "EVALUATE",
      "FACTS", "CHALLENGE", "ASSUMPTION", "BALANCE", "THOUGHTS"
    ]
  },
  {
    id: 'mostImportant',
    name: "What's Most Important",
    words: [
      "AWARENESS", "REACTIONS", "PATTERNS", "PLAN", "TRIGGER",
      "VALUES", "GOALS", "RELATIONSHIPS", "EVENT", "OBJECTIVE",
      "THOUGHTS", "EMOTIONS", "REACTIONS", "INFLUENCE", "SHOULDS",
      "DIRECTORS", "REFRAME", "PERFORMANCE", "UNPRODUCTIVE", "PRODUCTIVE",
      "INTERNALBOARD", "CLARITY", "PERSPECTIVE", "RESET", "ANCHOR",
      "VOTE", "FILTER", "INTENTION", "REGULATE", "PAUSE"
    ]
  },
  {
    id: 'problemSolving',
    name: 'Interpersonal Problem Solving',
    words: [
      "CONFLICT", "RESOLUTION", "RESPECT", "FEEDBACK", "OPTIONS",
      "EMPATHY", "PROBLEM", "DIALOGUE", "DECISION", "AGREEMENT",
      "LISTENING", "TRUST", "HOMEWORK", "COMPETING", "COMPROMISE",
      "CHALLENGE", "AVOIDANCE", "EVALUATION", "INTENSITY", "CONFIRM",
      "ENGAGEMENT", "TRIVIALIZE", "COLLABORATE", "CLARITY", "REFLECTION",
      "REFRAME", "SHARE", "EXPLORE", "CONSIDER", "SUPPORT"
    ]
  },
  {
    id: 'celebrateNews',
    name: 'Celebrate Good News',
    words: [
      "CELEBRATE", "GOODNESS", "SHARING", "REJOICE", "LISTEN",
      "SUPPORT", "UPLIFT", "RESPOND", "BONDING", "EMOTION",
      "SQUASH", "STEAL", "PRAISE", "MOMENT", "MOTIVATE",
      "TRUST", "STORY", "EXAMPLE", "GROWTH", "CHEER",
      "JOYFUL", "CARING", "BANKED", "HABIT", "CONNECT",
      "SAVOR", "THANKFUL", "KINDNESS", "ENERGY", "SMILE"
    ]
  }
];

const MAX_MODULE_INDEX = MODULE_DATA.length - 1; // Used for disabled state of module navigation

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
  console.log('WordForgePage component render cycle start');

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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  // State for tracking the currently active module by its ID
  const [currentModuleId, setCurrentModuleId] = useState(MODULE_DATA[0].id);

  const workerRef = useRef(null);
  const gridRef = useRef(null);

  // Memoized audio instance for the success sound (word found)
  const successSound = useMemo(() => {
    console.log('useMemo: Creating successSound Audio object.');
    try {
        const audio = new Audio("/audio/AnvilSuccess.aac");
        audio.volume = 0.3;
        audio.load();
        console.log('Audio object created:', audio);
        return audio;
    } catch (e) {
        console.error("Error creating success sound object:", e);
        return null;
    }
  }, []);

  // Memoized audio instance for background music
  const bgMusic = useMemo(() => {
    console.log('useMemo: Creating bgMusic Audio object.');
    try {
        const audio = new Audio("/audio/WordGamebgmc.aac");
        audio.volume = 0.1;
        audio.loop = true;
        audio.load();
        console.log('Background music object created:', audio);
        return audio;
    } catch (e) {
        console.error("Error creating background music object:", e);
        return null;
    }
  }, []);

  // Memoized audio instance for level completion sound
  const nextLevelSound = useMemo(() => {
    console.log('useMemo: Creating nextLevelSound Audio object.');
    try {
        const audio = new Audio("/audio/NEXTLEVEL.aac");
        audio.volume = 0.5;
        audio.load();
        console.log('Next Level Sound object created:', audio);
        return audio;
    } catch (e) {
        console.error("Error creating next level sound object:", e);
        return null;
    }
  }, []);


  // Effect to control background music playback
  useEffect(() => {
    console.log('useEffect: Music playback control. isMusicPlaying:', isMusicPlaying);
    if (bgMusic) {
      if (isMusicPlaying) {
        bgMusic.play().catch(e => {
          console.warn("Background music autoplay failed:", e);
          setIsMusicPlaying(false);
        });
      } else {
        bgMusic.pause();
      }
    }
    return () => {
      console.log('useEffect cleanup: Pausing background music.');
      if (bgMusic) {
        bgMusic.pause();
      }
    };
  }, [isMusicPlaying, bgMusic]);

  // Effect to play sound when level is completed
  useEffect(() => {
    console.log('useEffect: Checking for level completion sound trigger. isLevelCompleted:', isLevelCompleted, 'isLoadingGrid:', isLoadingGrid);
    if (isLevelCompleted && !isLoadingGrid) { // Only play if level is completed and grid is not loading (stable state)
      if (nextLevelSound) {
        nextLevelSound.currentTime = 0; // Reset sound
        setTimeout(() => { // Using setTimeout to yield to event loop for potentially better autoplay policy compliance
          nextLevelSound.play().catch(e => {
            console.warn("Next level sound playback failed:", e);
          });
        }, 0);
      } else {
        console.log("Next level sound object is null.");
      }
    }
  }, [isLevelCompleted, isLoadingGrid, nextLevelSound]);


  const currentGridSize = useMemo(() => {
    const levelConfig = LEVELS.find(level => level.level === currentLevel);
    return levelConfig ? levelConfig.size : 12;
  }, [currentLevel]);

  // Get the words for the currently selected module
  const currentModuleWords = useMemo(() => {
    const module = MODULE_DATA.find(mod => mod.id === currentModuleId);
    return module ? module.words : [];
  }, [currentModuleId]);

  // theoreticallyPlayableWords now filters from currentModuleWords
  const theoreticallyPlayableWords = useMemo(() => {
    return currentModuleWords.filter(word => word.length <= currentGridSize);
  }, [currentModuleWords, currentGridSize]);

  // Effect to generate grid when module, level, or words change
  useEffect(() => {
    console.log('useEffect: Grid generation worker setup/trigger. Current level:', currentLevel, 'Module:', currentModuleId);
    if (window.Worker) {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      workerRef.current = new Worker(new URL('./wordWorker.js', import.meta.url));

      workerRef.current.onmessage = (event) => {
        console.log('Worker: Grid data received.', event.data);
        const { grid: receivedGrid, placedWords } = event.data;

        if (Array.isArray(receivedGrid) && receivedGrid.every(Array.isArray)) {
            setGrid(receivedGrid);
        } else {
            console.error("Worker returned malformed grid data:", receivedGrid);
            setGrid([]);
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
        setGrid([]);
      };

      setIsLoadingGrid(true);
      // Pass words from the current module
      workerRef.current.postMessage({ words: theoreticallyPlayableWords, size: currentGridSize });
    } else {
      console.warn("Web Workers not supported. Grid generation will block the main thread.");
      setGrid([[]]);
      setIsLoadingGrid(false);
      setIsLevelCompleted(false);
      setActualWordsInGrid([]);
    }

    return () => {
      console.log('useEffect cleanup: Grid generation worker termination.');
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [theoreticallyPlayableWords, currentGridSize, currentLevel, currentModuleId]);

  // Effect to check for level completion
  useEffect(() => {
    console.log('useEffect: Level completion check. Loading:', isLoadingGrid, 'Actual words:', actualWordsInGrid.length, 'Found words:', foundWords.length);
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
  const updateForgeGlow = useCallback((wordLength) => {
    const levelIntensity = currentLevel * 2;
    const wordBonus = wordLength * 0.5;
    const totalIntensity = Math.min(levelIntensity + wordBonus, 35);

    const baseShadow = 10 + totalIntensity;
    const blurRadius = 5 + totalIntensity * 0.5;
    const colorAlpha = 0.3 + totalIntensity * 0.02;

    const colorRed = 255;
    const colorGreen = Math.max(0, 150 - totalIntensity * 5);
    const colorBlue = Math.max(0, 0 + totalIntensity * 1);

    const color = `rgba(${colorRed}, ${colorGreen}, ${colorBlue}, ${Math.min(colorAlpha, 0.9)})`;


    const forge = document.getElementById("word-forge-container");
    if (forge) {
      forge.style.boxShadow = `0 0 ${blurRadius}px ${baseShadow}px ${color}`;
      forge.style.animation = `forgeGlow ${Math.max(0.5, 2 - (totalIntensity * 0.04))}s ease-in-out infinite alternate`;
    }
  }, [currentLevel]);

  // --- Touch Event Handlers (with useCallback) ---

  const getCellCoordinates = useCallback((event) => {
    const touch = event.touches ? event.touches[0] : event;
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

    let cellElement = targetElement;
    while (cellElement && (!cellElement.dataset || !cellElement.dataset.x || !cellElement.dataset.y) && cellElement !== gridRef.current && cellElement !== document.body) {
      cellElement = cellElement.parentElement;
    }

    if (cellElement && cellElement.dataset.x && cellElement.dataset.y) {
      const x = parseInt(cellElement.dataset.x, 10);
      const y = parseInt(cellElement.dataset.y, 10);
      if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
        return [x, y];
      }
    }
    console.log('getCellCoordinates: Could not find a valid cell under touch point. Touched element:', targetElement);
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
    console.log('handleTouchStart triggered.');
    if (event.touches.length === 1) {
        event.preventDefault();
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
    console.log('handleTouchMove triggered.');
    event.preventDefault();

    const coords = getCellCoordinates(event);
    if (coords && (coords[0] !== dragCurrentCell?.[0] || coords[1] !== dragCurrentCell?.[1])) {
        setDragCurrentCell(coords);

        const newSelectedCells = calculateCellsInLine(dragStartCell, coords);
        setSelected(newSelectedCells);
    }
  }, [isDragging, dragStartCell, dragCurrentCell, getCellCoordinates, calculateCellsInLine]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      console.log('handleTouchEnd triggered. Selected:', selected.length);
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
          updateForgeGlow(word.length);
          if (successSound) {
            successSound.currentTime = 0;
            setTimeout(() => {
                successSound.play().catch(e => {
                  console.warn("Audio playback failed (from handleTouchEnd):", e);
                });
            }, 0);
          } else {
             console.log("Sound not playing from handleTouchEnd: sound object null.");
          }
        }
      });
      setSelected([]);
    }
  }, [isDragging, selected, grid, actualWordsInGrid, foundWords, successSound, updateForgeGlow]);


  const handleCellClick = useCallback((x, y) => {
    console.log('handleCellClick triggered. Cell:', x, y);
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
          updateForgeGlow(word.length);
          if (successSound) {
            successSound.currentTime = 0;
            setTimeout(() => {
                successSound.play().catch(e => {
                  console.warn("Audio playback failed (from handleCellClick):", e);
                });
            }, 0);
          } else {
             console.log("Sound not playing from handleCellClick: sound object null.");
          }
          setSelected([]);
        }
      });
    }
  }, [isDragging, selected, grid, actualWordsInGrid, foundWords, successSound, updateForgeGlow]);


  const goToLevel = useCallback((level) => {
    console.log('goToLevel triggered. New level:', level);
    if (level >= 1 && level <= MAX_LEVEL) {
      setCurrentLevel(level);
    }
  }, []);

  // --- useEffect for manual touch event listeners ---
  useEffect(() => {
    console.log('useEffect: Attaching/Detaching touch listeners.');
    const gridElement = gridRef.current;
    if (gridElement) {
      console.log('Adding touch listeners to gridElement.');
      gridElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      gridElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      gridElement.addEventListener('touchend', handleTouchEnd, { passive: false });
      // touchcancel might also be useful for robustness
      // gridElement.addEventListener('touchcancel', handleTouchEnd, { passive: false });

      // Clean up event listeners when component unmounts or dependencies change
      return () => {
        console.log('Removing touch listeners from gridElement.');
        gridElement.removeEventListener('touchstart', handleTouchStart);
        gridElement.removeEventListener('touchmove', handleTouchMove);
        gridElement.removeEventListener('touchend', handleTouchEnd);
        // gridElement.removeEventListener('touchcancel', handleTouchEnd);
      };
    } else {
      console.log('gridRef.current is null when attempting to attach touch listeners.');
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);


  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 Mental Armor Word Forge</h1>
      <p className="text-center mb-6 text-sm text-gray-400">
        A focused break for the mind — Find key content for the Mental Armor™ Skills to sharpen your recall.
      </p>

      {/* Module Selection UI */}
      <div className="flex justify-center items-center mb-6 space-x-2">
        <button
          onClick={() => {
            const currentIndex = MODULE_DATA.findIndex(mod => mod.id === currentModuleId);
            if (currentIndex > 0) {
              setCurrentModuleId(MODULE_DATA[currentIndex - 1].id);
              setCurrentLevel(1); // Reset level to 1 when changing module
            }
          }}
          disabled={MODULE_DATA.findIndex(mod => mod.id === currentModuleId) === 0}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous Skill
        </button>
        <span className="text-xl font-bold">
          {MODULE_DATA.find(mod => mod.id === currentModuleId)?.name || 'Module'}
        </span>
        <button
          onClick={() => {
            const currentIndex = MODULE_DATA.findIndex(mod => mod.id === currentModuleId);
            if (currentIndex < MAX_MODULE_INDEX) { // Use MAX_MODULE_INDEX
              setCurrentModuleId(MODULE_DATA[currentIndex + 1].id);
              setCurrentLevel(1); // Reset level to 1 when changing module
            }
          }}
          disabled={MODULE_DATA.findIndex(mod => mod.id === currentModuleId) === MAX_MODULE_INDEX} // Use MAX_MODULE_INDEX
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Skill
        </button>
      </div>

      {/* Level Selection UI (with improved centering) */}
      <div className="flex items-center justify-between mb-6"> {/* Use justify-between */}
        <div className="flex-grow flex justify-end pr-2"> {/* Wrapper for left button */}
          <button
            onClick={() => goToLevel(currentLevel - 1)}
            disabled={currentLevel === 1 || isLoadingGrid}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Level
          </button>
        </div>
        <span className="text-xl font-bold text-center whitespace-nowrap"> {/* Center text and prevent wrapping */}
          Level {currentLevel} ({currentGridSize}x{currentGridSize})
        </span>
        <div className="flex-grow flex justify-start pl-2"> {/* Wrapper for right button */}
          <button
            onClick={() => goToLevel(currentLevel + 1)}
            disabled={currentLevel === MAX_LEVEL || isLoadingGrid || !isLevelCompleted}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Level
          </button>
        </div>
      </div>

      {/* Music Toggle Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsMusicPlaying(prev => !prev)}
          className={`px-4 py-2 rounded-lg font-bold
            ${isMusicPlaying ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
        >
          {isMusicPlaying ? 'Pause Music' : 'Play Music'}
        </button>
      </div>

      <div
        id="word-forge-container"
        className="rounded-xl bg-gray-800 p-4 shadow-xl max-w-4xl mx-auto"
        ref={gridRef}
      >
        {isLoadingGrid ? (
          <div className="text-center p-8 text-xl">Generating grid...</div>
        ) : (
          <div className={`grid gap-1 p-4`}
               style={{ gridTemplateColumns: `repeat(${currentGridSize}, minmax(0, 1fr))` }}
          >
            {grid && grid.length > 0 && grid.map((row, y) =>
              row && row.length > 0 && row.map((letter, x) => (
                <div
                  key={`${x},${y}`}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded select-none cursor-pointer
                    ${selected.some(([sx, sy]) => sx === x && sy === y)
                      ? "bg-green-500"
                      : "bg-gray-900"} hover:bg-indigo-500`}
                  onClick={() => handleCellClick(x, y)}
                  data-x={x}
                  data-y={y}
                >
                  {letter}
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-4 text-white text-sm font-mono">
          <strong>Find These Words:</strong><br />
          {/* Display actual words in grid based on the current module */}
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