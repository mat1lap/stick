import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOptimalMove } from '../ai/ai';

function useAudio(src, volume = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current = new Audio(src);
    ref.current.volume = volume;

    return () => {
      if (ref.current) {
        ref.current.pause();
        ref.current.src = '';
        ref.current = null;
      }
    };
  }, [src]);

  const play = useCallback(() => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(e => console.warn("Audio play failed:", e));
    }
  }, []);

  return play;
}

const useStickPickSound = () => useAudio('/sounds/pick.mp3', 0.4);
const useStickPlaceSound = () => useAudio('/sounds/place.mp3', 0.3);
const useWinSound = () => useAudio('/sounds/win.mp3', 0.5);
const useLoseSound = () => useAudio('/sounds/lose.mp3', 0.5);

// --- Вспомогательная функция: разбиение на сегменты ---
function getSegments(sticks) {
  const segments = [];
  let i = 0;
  const n = sticks.length;

  while (i < n) {
    if (sticks[i]) {
      const start = i;
      while (i < n && sticks[i]) i++;
      const len = i - start;
      segments.push({ start, len });
    } else {
      i++;
    }
  }
  return segments;
}

export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, n, k = 3, a = 2, b = 4, first } = location.state;

  const [sticks, setSticks] = useState(() => Array(n).fill(true));
  const [selected, setSelected] = useState(new Set());
  const [isPlayerTurn, setIsPlayerTurn] = useState(first === 'player');
  const [gameStarted, setGameStarted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [suggestedMove, setSuggestedMove] = useState([]);
  const [gameResult, setGameResult] = useState(null); // null, 'win', 'lose'
  const [hoveredStick, setHoveredStick] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  
  // Создаем ref для отслеживания текущего состояния звука
  const isSoundOnRef = useRef(isSoundOn);

  const pickSound = useStickPickSound();
  const placeSound = useStickPlaceSound();
  const winSound = useWinSound();
  const loseSound = useLoseSound();

  // Обновляем ref при изменении состояния звука
  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
  }, [isSoundOn]);

  // Используем ref вместо состояния для проверки в playSound
  const playSound = useCallback((sound) => {
    if (isSoundOnRef.current) {
      try {
        sound();
      } catch (e) {
        console.error("Error playing sound:", e);
      }
    }
  }, []);

  const sticksRef = useRef(sticks);
  const isPlayerTurnRef = useRef(isPlayerTurn);
  const isGameOverRef = useRef(false);

  useEffect(() => {
    sticksRef.current = sticks;
    isPlayerTurnRef.current = isPlayerTurn;
    isGameOverRef.current = sticks.filter(Boolean).length === 0;
  }, [sticks, isPlayerTurn]);

  const remaining = sticks.filter(Boolean).length;
  const isGameOver = remaining === 0;

  const canCurrentPlayerMove = useCallback(() => {
    if (remaining === 0) return false;
    if (mode === 2 || mode === 4) {
      // Проверяем, есть ли хотя бы один допустимый ход
      const segments = getSegments(sticks);
      for (const seg of segments) {
        if (seg.len >= a) return true;
      }
      return false;
    }
    return true;
  }, [sticks, mode, a]);

  // Анимация появления палочек - убрали playSound из зависимостей
  useEffect(() => {
    const timer = setTimeout(() => {
      setSticks(Array(n).fill(true));
      setGameStarted(true);
      setIsPlayerTurn(first === 'player');
      
      // Используем isSoundOnRef вместо состояния
      if (isSoundOnRef.current) {
        placeSound();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [n, first, placeSound]);

  // Подсказка
  useEffect(() => {
    if (!isPlayerTurn || isGameOver || !canCurrentPlayerMove()) {
      setSuggestedMove([]);
      return;
    }

    const move = getOptimalMove(mode, sticks, a, b, k);
    setSuggestedMove(move);
  }, [sticks, isPlayerTurn, isGameOver, mode, a, b, k, canCurrentPlayerMove]);

  // Обработка окончания игры
  useEffect(() => {
    if (isGameOver) {
      if (!isPlayerTurn) {
        setGameResult('win');
        playSound(winSound);
      } else {
        setGameResult('lose');
        playSound(loseSound);
      }
      return;
    }

    if (!canCurrentPlayerMove()) {
      if (!isPlayerTurn) {
        setGameResult('win');
        playSound(winSound);
      } else {
        setGameResult('lose');
        playSound(loseSound);
      }
    }
  }, [isGameOver, isPlayerTurn, canCurrentPlayerMove, playSound, winSound, loseSound]);

  // Ход компьютера
  useEffect(() => {
    if (isPlayerTurn || isGameOver || !canCurrentPlayerMove()) return;

    const timer = setTimeout(() => {
      const move = getOptimalMove(mode, sticksRef.current, a, b, k);

      if (!Array.isArray(move) || move.length === 0) {
        // Если нет допустимых ходов, компьютер проигрывает
        setIsPlayerTurn(true);
        return;
      }

      setSticks(prevSticks => {
        const newSticks = [...prevSticks];
        move.forEach(i => {
          if (i >= 0 && i < newSticks.length) {
            newSticks[i] = false;
          }
        });
        return newSticks;
      });
      setSelected(new Set());
      setIsPlayerTurn(true);
      playSound(pickSound);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, isGameOver, mode, a, b, k, canCurrentPlayerMove, playSound, pickSound]);

  const handleStickClick = (index) => {
    if (!isPlayerTurn || !sticks[index]) return;
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  const confirmMove = () => {
    const selectedIndices = Array.from(selected);
    if (!isValidMove(selectedIndices, sticks, mode, k, a, b)) {
      return;
    }

    const newSticks = [...sticks];
    selectedIndices.forEach(i => {
      newSticks[i] = false;
    });

    // Сохраняем текущее состояние в историю
    setMoveHistory(prev => [...prev.slice(0, currentMoveIndex + 1), {
      sticks: [...sticks],
      selected: new Set(selected),
      isPlayerTurn
    }]);
    setCurrentMoveIndex(prev => prev + 1);

    setSticks(newSticks);
    setSelected(new Set());
    setIsPlayerTurn(false);
    playSound(pickSound);
  };

  const undoMove = () => {
    if (currentMoveIndex < 0) return;
    
    const previousState = moveHistory[currentMoveIndex];
    setSticks(previousState.sticks);
    setSelected(new Set()); // Снимаем все выделения
    setIsPlayerTurn(previousState.isPlayerTurn);
    setCurrentMoveIndex(prev => prev - 1);
  };

  const resetGame = () => {
    // Сбрасываем все состояния к начальным
    const newSticks = Array(n).fill(true);
    setSticks(newSticks);
    setSelected(new Set());
    setIsPlayerTurn(first === 'player');
    setGameResult(null);
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    
    // Используем isSoundOnRef вместо состояния
    if (isSoundOnRef.current) {
      placeSound();
    }
  };

  // Постоянная ширина палочек
  const stickWidth = 20; // постоянная ширина
  const stickHeight = 120;

  // Проверка валидности текущего выбора
  const isValidSelection = isValidMove(Array.from(selected), sticks, mode, k, a, b);

  // Названия режимов
  const modeNames = {
    1: "Стандартный",
    2: "Интервальный выбор",
    3: "Подряд",
    4: "Подряд и интервально",
    5: "Особый"
  };

  return (
    <div style={{
      padding: '20px',
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundImage: 'url(/bg/game-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
      boxSizing: 'border-box',
      height: '100vh'
    }}>
      {/* Надпись о результате сверху */}
      {gameResult && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(32px, 8vw, 64px)',
          fontWeight: 'bold',
          color: gameResult === 'win' ? '#27ae60' : '#e74c3c',
          textShadow: '0 0 20px rgba(0,0,0,0.8)',
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '10px 20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          {gameResult === 'win' ? 'ВЫ ВЫИГРАЛИ' : 'ВЫ ПРОИГРАЛИ'}
        </div>
      )}

      {/* Параметры игры */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        right: '20px', 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        padding: '10px', 
        borderRadius: '8px',
        zIndex: 10
      }}>
        <p style={{ margin: '5px 0' }}><strong>Режим:</strong> {modeNames[mode]}</p>
        <p style={{ margin: '5px 0' }}><strong>n:</strong> {n}</p>
        {(mode === 1 || mode === 3) && <p style={{ margin: '5px 0' }}><strong>k:</strong> {k}</p>}
        {(mode === 2 || mode === 4) && (
          <>
            <p style={{ margin: '5px 0' }}><strong>a:</strong> {a}</p>
            <p style={{ margin: '5px 0' }}><strong>b:</strong> {b}</p>
          </>
        )}
        <p style={{ margin: '5px 0' }}><strong>Первый:</strong> {first === 'player' ? 'Игрок' : 'Компьютер'}</p>
      </div>

      {/* Заголовок и оставшиеся палочки */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        marginBottom: '20px',
        // Увеличен отступ сверху, чтобы избежать наложения с надписью о результате
        marginTop: gameResult ? '120px' : '0'
      }}>
        <h2 style={{ marginBottom: '10px' }}>{modeNames[mode]}</h2>
        <p style={{ fontSize: '18px' }}>Осталось палочек: {remaining}</p>
      </div>

      {/* Палочки */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          margin: '20px 0 40px',
          userSelect: 'none'
        }}
      >
        {sticks.map((exists, i) => (
          <div
            key={i}
            onClick={() => handleStickClick(i)}
            onMouseEnter={() => setHoveredStick(i)}
            onMouseLeave={() => setHoveredStick(null)}
            style={{
              width: `${stickWidth}px`,
              height: `${stickHeight}px`,
              borderRadius: '12px',
              backgroundColor: selected.has(i)
                ? isValidSelection
                  ? '#27ae60'  // зеленый если ход валиден
                  : '#e74c3c'  // красный если ход невалиден
                : showHints && suggestedMove.includes(i)
                  ? '#f39c12'
                  : (exists ? '#3498db' : '#c0c0c0'), // светло-серый для неактивных палочек
              opacity: exists ? 1 : 0.2, // более бледные и прозрачные неактивные палочки
              cursor: isPlayerTurn && exists ? 'pointer' : 'default',
              boxShadow: exists ? '0 4px 10px rgba(0,0,0,0.3)' : 'none',
              position: 'relative',
              transform: hoveredStick === i && exists ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }}
          />
        ))}
      </div>

      {/* Управление */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        zIndex: 10
      }}>
        {/* Кнопки управления */}
        {!gameResult && (
          <div style={{ 
            marginBottom: '20px',
            minHeight: '70px' // фиксированная высота, чтобы кнопки не съезжали
          }}>
            <p style={{ 
              marginBottom: '10px',
              minHeight: '20px' // фиксированная высота для текста
            }}>
              {isPlayerTurn && canCurrentPlayerMove() 
                ? `Выбрано палочек: ${selected.size}` 
                : isPlayerTurn && !canCurrentPlayerMove()
                  ? "Нет допустимых ходов"
                  : "Ходит компьютер..."
              }
            </p>
            <button
              onClick={isPlayerTurn && canCurrentPlayerMove() ? confirmMove : undefined}
              disabled={!isPlayerTurn || !canCurrentPlayerMove() || !isValidSelection}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: !isPlayerTurn || !canCurrentPlayerMove() || !isValidSelection ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                width: '100%',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseOver={e => {
                if (!isPlayerTurn || !canCurrentPlayerMove() || !isValidSelection) return;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
              }}
              onMouseOut={e => {
                if (!isPlayerTurn || !canCurrentPlayerMove() || !isValidSelection) return;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              {isPlayerTurn && canCurrentPlayerMove() ? "Подтвердить ход" : "Ход компьютера"}
            </button>
          </div>
        )}

        {/* Кнопка "Назад" - растянута по ширине, но скрыта после окончания игры */}
        {!gameResult && (
          <div style={{
            marginBottom: '10px'
          }}>
            <button
              onClick={undoMove}
              disabled={currentMoveIndex < 0}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: 'none',
                borderRadius: '6px',
                cursor: currentMoveIndex < 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: currentMoveIndex < 0 ? '#bdc3c7' : '#95a5a6',
                color: 'white',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseOver={e => {
                if (currentMoveIndex < 0) return;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
              }}
              onMouseOut={e => {
                if (currentMoveIndex < 0) return;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              ⏮️ Назад
            </button>
          </div>
        )}

        {/* Настройки звука и подсказок */}
        {!gameResult && (
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSoundOn(prev => !prev);
              }}
              style={{
                padding: '10px 14px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#3498db',
                color: 'white',
                flex: 1,
                minWidth: '45%',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseOver={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
              }}
              onMouseOut={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              {isSoundOn ? '🔊 Звук: Вкл' : '🔇 Звук: Выкл'}
            </button>

            <button
              onClick={() => setShowHints(prev => !prev)}
              style={{
                padding: '10px 14px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#3498db',
                color: 'white',
                flex: 1,
                minWidth: '45%',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseOver={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
              }}
              onMouseOut={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              {showHints ? '💡 Подсказки: Вкл' : '💡 Подсказки: Выкл'}
            </button>
          </div>
        )}

        {/* Кнопка "Заново" - всегда видима */}
        <button
          onClick={resetGame}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%',
            marginBottom: '10px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          onMouseOver={e => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
          }}
          onMouseOut={e => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          Заново
        </button>

        {/* Кнопка выхода в меню */}
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          onMouseOver={e => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
          }}
          onMouseOut={e => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          }}
        >
          Выйти в меню
        </button>
      </div>
    </div>
  );
}

function isValidMove(selected, sticks, mode, k, a, b) {
  const indices = Array.from(selected);
  if (indices.length === 0) return false;

  for (let i of indices) {
    if (i < 0 || i >= sticks.length || !sticks[i]) return false;
  }

  const count = indices.length;

  if (mode === 1) return count >= 1 && count <= k;
  if (mode === 2) return count >= a && count <= b;
  if (mode === 3) return count >= 1 && count <= k && areConsecutive(indices);
  if (mode === 4) return count >= a && count <= b && areConsecutive(indices);
  if (mode === 5) {
    if (count === 1) return true;
    if (count === 2) return true;
    if (count === 3) return areConsecutive(indices);
    return false;
  }

  return false;
}

function areConsecutive(arr) {
  if (arr.length === 0) return false;
  const sorted = arr.slice().sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) return false;
  }
  return true;
}