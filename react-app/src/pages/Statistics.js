import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function Statistics() {
  const navigate = useNavigate();
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    playerWins: 0,
    computerWins: 0,
    bestTime: 'Нет данных',
    lastGame: 'Нет данных'
  });
  const [playerStats, setPlayerStats] = useState({});
  const [savedGames, setSavedGames] = useState([]);

  // Загрузка данных при старте
  useEffect(() => {
    const loadStats = () => {
      const stats = localStorage.getItem('stickGameStats');
      if (stats) {
        setGameStats(JSON.parse(stats));
      }
    };

    const loadPlayerStats = () => {
      const stats = localStorage.getItem('playerStats');
      setPlayerStats(stats ? JSON.parse(stats) : {});
    };

    const loadSavedGames = () => {
      const games = localStorage.getItem('savedGames');
      setSavedGames(games ? JSON.parse(games) : []);
    };

    loadStats();
    loadPlayerStats();
    loadSavedGames();
    
    window.addEventListener('storage', () => {
      loadStats();
      loadPlayerStats();
      loadSavedGames();
    });
  }, []);

  // Сброс общей статистики
  const resetGameStats = () => {
    const newStats = {
      totalGames: 0,
      playerWins: 0,
      computerWins: 0,
      bestTime: 'Сброс',
      lastGame: 'Сброс'
    };
    localStorage.setItem('stickGameStats', JSON.stringify(newStats));
    setGameStats(newStats);
  };

  // Сброс рейтинга игроков
  const resetPlayerStats = () => {
    const newPlayerStats = {};
    localStorage.setItem('playerStats', JSON.stringify(newPlayerStats));
    setPlayerStats(newPlayerStats);
  };

  // Проверка, есть ли данные для отображения
  const hasPlayerStats = Object.keys(playerStats).length > 0;
  const hasSavedGames = savedGames.length > 0;

  return (
    <div style={{
      padding: '40px 20px',
      minHeight: '100vh',
      textAlign: 'center',
      backgroundImage: 'url(/bg/table.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      fontFamily: 'Nunito, sans-serif',
      textShadow: '1px 1px 5px rgba(0,0,0,0.8)',
      boxSizing: 'border-box'
    }}>
      {/* Общая статистика */}
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '28px', 
          marginBottom: '20px' 
        }}>📊 Игровая статистика</h2>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ flex: '1 1 45%', textAlign: 'left' }}>
            <p>Всего игр: <strong>{gameStats.totalGames || 0}</strong></p>
            <p>Победы игрока: <strong>{gameStats.playerWins || 0}</strong></p>
            <p>Победы компьютера: <strong>{gameStats.computerWins || 0}</strong></p>
            <p>Лучшее время: <strong>{gameStats.bestTime || 'Нет данных'}</strong></p>
            <p>Последняя игра: <strong>{gameStats.lastGame}</strong></p>
          </div>
          
          {/* График побед игрока и компьютера */}
          <div style={{ flex: '1 1 45%' }}>
            <BarChart width={300} height={200} data={[
              { name: 'Игрок', value: gameStats.playerWins || 0 },
              { name: 'Компьютер', value: gameStats.computerWins || 0 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3498db" />
            </BarChart>
          </div>
        </div>

        <button
          onClick={resetGameStats}
          style={{
            marginTop: '20px',
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
          Сбросить статистику
        </button>
      </div>

      {/* Рейтинг игроков */}
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '28px', 
          marginBottom: '20px' 
        }}>📈 Рейтинг игроков</h2>
        
        {hasPlayerStats ? (
          <BarChart 
            width={600} 
            height={300} 
            data={Object.entries(playerStats).map(([player, wins]) => ({ player, wins }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="player" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="wins" fill="#3498db" />
          </BarChart>
        ) : (
          <p style={{ margin: '40px 0' }}>Нет данных о рейтинге игроков</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <button
            onClick={resetPlayerStats}
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
            Сбросить рейтинг
          </button>
        </div>
      </div>

      {/* Сохранённые партии */}
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '28px', 
          marginBottom: '20px' 
        }}>📁 Сохранённые партии</h2>
        
        {hasSavedGames ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'center'
          }}>
            {savedGames.map((game, i) => (
              <button
                key={i}
                onClick={() => navigate('/replay', { state: { game } })}
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Партия {i + 1} — {game.history.length} ходов
              </button>
            ))}
          </div>
        ) : (
          <p>Нет сохранённых партий</p>
        )}
      </div>
    </div>
  );
}