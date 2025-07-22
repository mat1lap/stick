import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOptimalMove } from '../ai/ai';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, n, k = 3, a = 2, b = 4, first, isMultiplayer = false } = location.state;

  // Основные состояния
  const [sticks, setSticks] = useState(() => Array(n).fill(true));
  const [selected, setSelected] = useState(new Set());
  const [isPlayerTurn, setIsPlayerTurn] = useState(first === 'player');
  const [message, setMessage] = useState(first === 'player' ? 'Ваш ход' : 'Ход компьютера...');
  const [showHints, setShowHints] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [suggestedMove, setSuggestedMove] = useState([]);
  const [showParams, setShowParams] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState(isMultiplayer ? 1 : null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [playerStats, setPlayerStats] = useState({});
  const [savedGames, setSavedGames] = useState([]);

  // Звуки
  const winSound = new Audio('/sounds/win.mp3');
  const loseSound = new Audio('/sounds/lose.mp3');
  const pickSound = new Audio('/sounds/pick.mp3');
  const placeSound = new Audio('/sounds/place.mp3');

  const playSound = useCallback((sound) => {
    if (isSoundOn && sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.warn("Аудио не проиграно:", e));
    }
  }, [isSoundOn]);

  // Refs для избежания циклов
  const sticksRef = useRef(sticks);
  const isPlayerTurnRef = useRef(isPlayerTurn);
  const isGameOverRef = useRef(false);
  const historyRef = useRef(moveHistory);

  // Обновление refs при изменении состояния
  useEffect(() => {
    sticksRef.current = sticks;
    isPlayerTurnRef.current = isPlayerTurn;
    isGameOverRef.current = sticks.filter(Boolean).length === 0;
  }, [sticks, isPlayerTurn]);

  // Оставшиеся палочки и проверка окончания игры
  const remaining = sticks.filter(Boolean).length;
  const isGameOver = remaining === 0;

  // Проверка допустимости хода
  const canCurrentPlayerMove = useCallback(() => {
    if (remaining === 0) return false;
    if (mode === 2 || mode === 4) return remaining >= a;
    return true;
  }, [remaining, mode, a]);

  // Загрузка статистики при старте игры
  useEffect(() => {
    const saved = localStorage.getItem('playerStats');
    if (saved) setPlayerStats(JSON.parse(saved));
  }, []);

  // Загрузка сохранённых партий
  useEffect(() => {
    const games = localStorage.getItem('savedGames');
    if (games) setSavedGames(JSON.parse(games));
  }, []);

  // Подсказка для игрока
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
      const winner = isMultiplayer ? `Игрок ${currentPlayer}` : isPlayerTurn ? "Компьютер" : "Вы";
      setMessage(`${winner} победил!`);
      
      // Обновление статистики
      const stats = JSON.parse(localStorage.getItem('playerStats') || '{}');
      if (isMultiplayer) {
        stats[winner] = (stats[winner] || 0) + 1;
      } else {
        stats.computerWins = (stats.computerWins || 0) + (isPlayerTurn ? 0 : 1);
        stats.playerWins = (stats.playerWins || 0) + (isPlayerTurn ? 1 : 0);
      }
      localStorage.setItem('playerStats', JSON.stringify(stats));
      setPlayerStats(stats);
      
      // Звук победы/поражения
      if (!isMultiplayer) {
        playSound(isPlayerTurn ? loseSound : winSound);
      }
      return;
    }

    // Обработка случая, когда текущий игрок не может сделать ход
    if (!canCurrentPlayerMove()) {
      const winner = isPlayerTurn ? "Компьютер" : "Вы";
      setMessage(`Нет допустимых ходов. ${winner} победил!`);
      
      // Обновление статистики
      const stats = JSON.parse(localStorage.getItem('playerStats') || '{}');
      if (isMultiplayer) {
        stats[winner] = (stats[winner] || 0) + 1;
      } else {
        stats.computerWins = (stats.computerWins || 0) + (isPlayerTurn ? 0 : 1);
        stats.playerWins = (stats.playerWins || 0) + (isPlayerTurn ? 1 : 0);
      }
      localStorage.setItem('playerStats', JSON.stringify(stats));
      setPlayerStats(stats);
      
      // Звук победы/поражения
      if (!isMultiplayer) {
        playSound(isPlayerTurn ? loseSound : winSound);
      }
    }
  }, [isGameOver, canCurrentPlayerMove, isMultiplayer, isPlayerTurn]);

  // Ход компьютера
  useEffect(() => {
    if (isMultiplayer || isPlayerTurn || isGameOver || !canCurrentPlayerMove()) return;

    const timer = setTimeout(() => {
      const move = getOptimalMove(mode, sticksRef.current, a, b, k);
      if (move.length === 0) {
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
      
      recordMove("Компьютер", move);
      setSelected(new Set());
      setIsPlayerTurn(true);
      setMessage(`Компьютер взял ${move.length} палочек`);
      playSound(pickSound);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, isGameOver, mode, a, b, k, canCurrentPlayerMove]);

  // Обработка клика по палочке
  const handleStickClick = (index) => {
    if (!isPlayerTurn || !sticks[index]) return;
    const newSelected = new Set(selected);
    newSelected.has(index) ? newSelected.delete(index) : newSelected.add(index);
    setSelected(newSelected);
  };

  // Подтверждение хода
  const confirmMove = () => {
    const selectedIndices = Array.from(selected);
    if (!isValidMove(selectedIndices, sticks, mode, k, a, b)) {
      setMessage("Недопустимый ход!");
      return;
    }

    const newSticks = [...sticks];
    selectedIndices.forEach(i => {
      newSticks[i] = false;
    });

    setSticks(newSticks);
    recordMove(`Игрок ${currentPlayer}`, selectedIndices);
    setSelected(new Set());
    
    if (isMultiplayer) {
      setIsPlayerTurn(true);
      setCurrentPlayer(prev => prev === 1 ? 2 : 1);
      setMessage(`Игрок ${currentPlayer} взял ${selectedIndices.length} палочек`);
    } else {
      setIsPlayerTurn(false);
      setMessage(`Вы взяли ${selected.size} палочек`);
    }
    
    playSound(pickSound);
  };

  // Запись хода в историю
  const recordMove = (player, move) => {
    const newHistory = [...historyRef.current, { player, move, timestamp: new Date().toLocaleString() }];
    setMoveHistory(newHistory);
    historyRef.current = newHistory;
  };

  // Отмена последнего хода
  const undoMove = () => {
    if (historyRef.current.length === 0) return;
    
    const prevMove = historyRef.current[historyRef.current.length - 1];
    setSticks(prevSticks => {
      const newSticks = [...prevSticks];
      prevMove.move.forEach(i => {
        newSticks[i] = true;
      });
      return newSticks;
    });
    
    setMoveHistory(historyRef.current.slice(0, -1));
    historyRef.current = historyRef.current.slice(0, -1);
    setIsPlayerTurn(true);
    setMessage(`Ход отменён`);
    playSound(placeSound);
  };

  // Сброс игры
  const resetGame = () => {
    navigate('/');
  };

  // Сохранение партии
  const saveGame = () => {
    const games = [...savedGames, { mode, n, history: moveHistory }];
    localStorage.setItem('savedGames', JSON.stringify(games));
    setSavedGames(games);
    playSound(placeSound);
  };

  // Заголовки режимов
  const modeLabels = {
    1: `Стандартно: 1 до ${k}`,
    2: `Интервал: ${a} до ${b}`,
    3: `Подряд: 1 до ${k}`,
    4: `Подряд и интервально: ${a} до ${b}`,
    5: `Особое: 1, 2 любые или 3 подряд`,
    6: `Мультиплеер: ${n} палочек`
  };

  // Размер палочки (адаптивный)
  const stickSize = Math.max(16, Math.min(24, 700 / n));

  // Подсказка для игрока
  const hint = showHints && suggestedMove.length > 0 && !isGameOver
    ? `Совет: возьмите палочки ${suggestedMove.join(', ')}` : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px',
      backgroundImage: 'url(/bg/wood.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      fontFamily: 'Nunito, sans-serif',
      textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
      boxSizing: 'border-box',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Меню параметров */}
      <div style={{
        position: 'fixed',
        left: showParams ? '20px' : '-260px',
        top: '20px',
        width: '240px',
        backgroundColor: 'rgba(44, 62, 80, 0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'left 0.3s ease',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 'bold' }}>
            🎮 Параметры игры
          </h3>
          <button 
            onClick={() => setShowParams(prev => !prev)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              width: '20px',
              height: '20px'
            }}
          >
            {showParams ? '⬅️' : '➡️'}
          </button>
        </div>
        <p style={{ margin: '5px 0' }}><strong>Режим:</strong> {mode}</p>
        <p style={{ margin: '5px 0' }}><strong>Правила:</strong> {modeLabels[mode]}</p>
        <p style={{ margin: '5px 0' }}><strong>Палочек:</strong> {n}</p>
        <p style={{ margin: '5px 0' }}><strong>Ход:</strong> {isMultiplayer ? `Игрок ${currentPlayer}` : (isPlayerTurn ? 'Ваш' : 'Компьютера')}</p>
      </div>

      {/* Основной контейнер */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '100vw',
        marginLeft: showParams ? '260px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        <h2 style={{
          marginBottom: '20px',
          fontSize: 'clamp(24px, 5vw, 28px)',
          textAlign: 'center'
        }}>
          Режим {mode}
        </h2>
        <p style={{ fontSize: 'clamp(14px, 4vw, 16px)', textAlign: 'center' }}>
          Осталось: {remaining} палочек
        </p>
        <p style={{
          fontSize: 'clamp(18px, 5vw, 20px)',
          fontWeight: 'bold',
          margin: '10px 0 20px',
          minHeight: '40px',
          textAlign: 'center'
        }}>
          {message}
        </p>

        {/* Палочки */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 'clamp(6px, 2vw, 16px)',
          width: '100%',
          padding: '0 20px',
          boxSizing: 'border-box'
        }}>
          {sticks.map((exists, i) => (
            <div
              key={i}
              onClick={() => handleStickClick(i)}
              style={{
                width: `${stickSize}px`,
                height: 'clamp(80px, 12vh, 120px)',
                borderRadius: '8px',
                backgroundColor: selected.has(i)
                  ? '#27ae60'
                  : showHints && suggestedMove.includes(i)
                    ? '#f39c12'
                    : (exists ? '#8B4513' : 'transparent'),
                opacity: exists ? 1 : 0.1,
                cursor: isPlayerTurn && exists ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                transform: selected.has(i) ? 'scale(1.05)' : 'scale(1)',
                boxShadow: exists ? '0 4px 8px rgba(0,0,0,0.5)' : 'none',
                margin: '2px',
                flexShrink: 0,
                flexGrow: 0,
                flexBasis: `${stickSize}px`,
                position: 'relative'
              }}
            />
          ))}
        </div>

        {/* Панель управления */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',
          padding: '10px 20px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: '16px',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '20px'
        }}>
          {isPlayerTurn && !isGameOver && canCurrentPlayerMove() && (
            <>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                Выбрано: {selected.size} палочка(и)
              </p>
              <button
                onClick={confirmMove}
                disabled={selected.size === 0}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  fontSize: 'clamp(14px, 4vw, 16px)',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: selected.size === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Подтвердить ход
              </button>
            </>
          )}

          {/* Отмена хода */}
          {!isMultiplayer && isPlayerTurn && (
            <button
              onClick={undoMove}
              disabled={moveHistory.length === 0}
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: '16px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: moveHistory.length === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}
            >
              Отменить ход
            </button>
          )}

          {/* Управление звуком и подсказками */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '500px'
          }}>
            <button
              onClick={() => setIsSoundOn(prev => !prev)}
              style={btnStyle}
            >
              {isSoundOn ? '🔊 Звук: Вкл' : '🔇 Звук: Выкл'}
            </button>

            <button
              onClick={() => setShowHints(prev => !prev)}
              style={btnStyle}
            >
              {showHints ? '💡 Подсказки: Вкл' : '💡 Подсказки: Выкл'}
            </button>
          </div>

          {/* Кнопка "Заново" */}
          <button
            onClick={resetGame}
            style={{
              width: '100%',
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            Выйти в меню
          </button>
        </div>

        {/* График статистики */}
        {isMultiplayer && (
          <div style={{
            width: '90%',
            maxWidth: '600px',
            margin: '20px auto',
            textAlign: 'center'
          }}>
            <BarChart width={600} height={300} data={Object.entries(playerStats).map(([player, wins]) => ({ player, wins }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="player" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="wins" fill="#3498db" />
            </BarChart>
          </div>
        )}

        {/* Кнопка "Заново" */}
        {isGameOver && (
          <button
            onClick={resetGame}
            style={{
              position: 'fixed',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '12px 30px',
              fontSize: '18px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              e.target.style.backgroundColor = '#2980b9';
              e.target.style.transform = 'translateX(-50%) scale(1.02)';
            }}
            onMouseOut={e => {
              e.target.style.backgroundColor = '#3498db';
              e.target.style.transform = 'translateX(-50%) scale(1)';
            }}
          >
            Заново
          </button>
        )}
      </div>
    </div>
  );
}

// Проверка допустимости хода
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
    if (count === 1 || count === 2) return true;
    if (count === 3) return areConsecutive(indices);
    return false;
  }
  return false;
}

// Проверка последовательности
function areConsecutive(arr) {
  if (arr.length === 0) return false;
  const sorted = [...arr].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) return false;
  }
  return true;
}

// Стиль кнопок
const btnStyle = {
  padding: '10px 14px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  backgroundColor: '#3498db',
  color: 'white',
  flex: 1,
  minWidth: '45%'
};