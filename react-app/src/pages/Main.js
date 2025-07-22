import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Main() {
  const navigate = useNavigate();

  const selectMode = (modeId) => {
    navigate('/setup', { state: { mode: modeId } });
  };

  const showLearn = (modeId) => {
    navigate('/learn', { state: { mode: modeId } });
  };

  const [playerStats, setPlayerStats] = useState({});
  const [savedGames, setSavedGames] = useState([]);

  // Загрузка статистики при старте
  useEffect(() => {
    const saved = localStorage.getItem('playerStats');
    if (saved) setPlayerStats(JSON.parse(saved));
  }, []);

  // Загрузка сохранённых партий
  useEffect(() => {
    const games = localStorage.getItem('savedGames');
    if (games) setSavedGames(JSON.parse(games));
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(/bg/table.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      fontFamily: 'Nunito, sans-serif',
      textShadow: '1px 1px 5px rgba(0,0,0,0.8)',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Градиентный фон */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)',
        zIndex: 1
      }} />
      
      <div style={{
        zIndex: 2,
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: 'clamp(20px, 6vw, 40px)',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontSize: 'clamp(28px, 8vw, 48px)',
          marginBottom: 'clamp(20px, 4vw, 40px)',
          textAlign: 'center',
          color: '#3498db',
          textShadow: '0 0 10px #3498db',
          fontWeight: 'bold',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          🎯 Палочки
        </h1>
        
        <p style={{
          fontSize: 'clamp(14px, 4vw, 18px)',
          maxWidth: '500px',
          margin: '0 auto clamp(40px, 6vw, 60px)',
          opacity: 0.9,
          textAlign: 'center'
        }}>
          Тренируйся, побеждай, становись чемпионом!
        </p>

        {/* Режимы */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'clamp(12px, 3vw, 20px)',
          width: '100%'
        }}>
          {[
            { id: 1, name: "Стандартно", desc: "1 до k палочек (любые)", color: '#3498db' },
            { id: 2, name: "Интервальный выбор", desc: "a до b палочек (любые)", color: '#e74c3c' },
            { id: 3, name: "Подряд", desc: "1 до k подряд идущих", color: '#2ecc71' },
            { id: 4, name: "Подряд и интервально", desc: "a до b подряд идущих", color: '#9b59b6' },
            { id: 5, name: "Особое", desc: "1, 2 любые или 3 подряд", color: '#f39c12' },
            { id: 6, name: "Мультиплеер", desc: "Игра против другого игрока", color: '#16a085' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => selectMode(mode.id)}
              style={{
                position: 'relative',
                padding: 'clamp(16px, 3vw, 22px) clamp(12px, 4vw, 30px)',
                fontSize: 'clamp(16px, 4vw, 20px)',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: mode.color,
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                overflow: 'hidden'
              }}
              onMouseOver={e => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.4)';
              }}
              onMouseOut={e => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                {mode.name}
              </span>
              <span style={{
                display: 'block',
                fontSize: 'clamp(12px, 3vw, 14px)',
                opacity: 0.9,
                marginTop: '6px',
                fontWeight: 'normal',
                position: 'relative',
                zIndex: 1
              }}>
                {mode.desc}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  showLearn(mode.id);
                }}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  width: '20px',
                  height: '20px'
                }}
              >
                ❓
              </button>
            </button>
          ))}
        </div>

        {/* Дополнительные функции внизу */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'clamp(12px, 3vw, 20px)',
          width: '100%',
          maxWidth: '600px',
          margin: 'clamp(30px, 6vw, 50px) auto 0'
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
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              e.target.style.backgroundColor = '#7f8c8d';
              e.target.style.transform = 'scale(1.02)';
            }}
            onMouseOut={e => {
              e.target.style.backgroundColor = '#95a5a6';
              e.target.style.transform = 'scale(1)';
            }}
          >
            📊 Статистика
          </button>

          <button
            onClick={() => navigate('/replay')}
            disabled={savedGames.length === 0}
            style={{
              padding: '12px 24px',
              fontSize: '18px',
              backgroundColor: savedGames.length === 0 ? '#7f8c8d' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: savedGames.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: savedGames.length === 0 ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={e => {
              if (savedGames.length > 0) {
                e.target.style.backgroundColor = '#2980b9';
                e.target.style.transform = 'scale(1.02)';
              }
            }}
            onMouseOut={e => {
              if (savedGames.length > 0) {
                e.target.style.backgroundColor = '#3498db';
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            📁 Сохранённые партии
          </button>
        </div>

        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          color: '#ccc',
          fontSize: '14px',
          zIndex: 10
        }}>
          <p>© 2023 Игра в палочки</p>
        </div>
      </div>
    </div>
  );
}