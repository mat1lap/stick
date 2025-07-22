import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Replay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { game } = location.state || { game: { n: 10, history: [] } };
  const [sticks, setSticks] = useState(() => Array(game.n).fill(true));
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(800);
  const moveTimeout = useRef(null);

  // Воспроизведение текущего хода
  const playMove = useCallback(() => {
    if (currentMoveIndex >= game.history.length) {
      setPlaying(false);
      return;
    }

    const move = game.history[currentMoveIndex].move;
    setSticks(prevSticks => {
      const newSticks = [...prevSticks];
      move.forEach(i => {
        if (i >= 0 && i < newSticks.length) {
          newSticks[i] = false;
        }
      });
      return newSticks;
    });

    moveTimeout.current = setTimeout(() => {
      setCurrentMoveIndex(prev => prev + 1);
    }, speed);
  }, [currentMoveIndex, game.history, speed]);

  // Автоматическое воспроизведение
  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        if (currentMoveIndex < game.history.length) {
          setCurrentMoveIndex(prev => prev + 1);
        } else {
          setPlaying(false);
        }
      }, speed);
    }
    return () => clearInterval(interval);
  }, [playing, currentMoveIndex, speed, game.history.length]);

  // Перезапуск партии
  const restartGame = () => {
    setSticks(Array(game.n).fill(true));
    setCurrentMoveIndex(0);
    setPlaying(true);
  };

  // Заголовки режимов
  const modeLabels = {
    1: `Стандартно: 1 до ${game.k || 3}`,
    2: `Интервал: ${game.a || 2} до ${game.b || 4}`,
    3: `Подряд: 1 до ${game.k || 3}`,
    4: `Подряд и интервально: ${game.a || 2} до ${game.b || 4}`,
    5: `Особое: 1, 2 любые или 3 подряд`,
    6: `Мультиплеер: ${game.n} палочек`
  };

  return (
    <div style={{
      padding: '40px 20px',
      minHeight: '100vh',
      textAlign: 'center',
      backgroundImage: 'url(/bg/wood.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      fontFamily: 'Nunito, sans-serif',
      textShadow: '1px 1px 5px rgba(0,0,0,0.8)',
      boxSizing: 'border-box'
    }}>
      <h2 style={{
        marginBottom: '20px',
        fontSize: '28px',
        color: '#3498db'
      }}>
        {modeLabels[game.mode]}
      </h2>
      <p style={{ fontSize: '18px' }}>Палочек: {game.n}</p>
      <p style={{ fontSize: '18px' }}>Ход: {currentMoveIndex} / {game.history.length}</p>

      {/* Палочки */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '16px',
        margin: '20px 0',
        width: '100%',
        maxWidth: '100vw'
      }}>
        {sticks.map((exists, i) => (
          <div
            key={i}
            style={{
              width: '20px',
              height: '120px',
              borderRadius: '12px',
              backgroundColor: exists ? '#8B4513' : 'transparent',
              opacity: exists ? 1 : 0.1,
              boxShadow: exists ? '0 6px 12px rgba(0,0,0,0.5)' : 'none',
              margin: '2px',
              flexShrink: 0,
              flexGrow: 0,
              flexBasis: '20px',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Контроллеры */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '20px 0'
      }}>
        <button
          onClick={() => setPlaying(prev => !prev)}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: playing ? '#e74c3c' : '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {playing ? 'Пауза' : 'Воспроизведение'}
        </button>

        <button
          onClick={restartGame}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Перезапустить
        </button>
      </div>

      {/* Управление скоростью */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        margin: '10px 0'
      }}>
        <button
          onClick={() => setSpeed(prev => Math.max(200, prev - 100))}
          style={{
            padding: '10px 16px',
            fontSize: '16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Ускорить
        </button>
        
        <button
          onClick={() => setSpeed(prev => prev + 100)}
          style={{
            padding: '10px 16px',
            fontSize: '16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Замедлить
        </button>
      </div>

      {/* Скорость */}
      <div style={{
        margin: '10px 0',
        textAlign: 'center'
      }}>
        <p>Скорость: {speed} мс</p>
      </div>

      {/* Навигация */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '20px 0'
      }}>
        <button
          onClick={() => navigate('/statistics')}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Статистика
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Главное меню
        </button>
      </div>
    </div>
  );
}