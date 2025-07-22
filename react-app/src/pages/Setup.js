import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Setup() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || 1;
  const isMultiplayer = mode === 6;

  // Состояния параметров
  const [n, setN] = useState(10);
  const [k, setK] = useState(3);
  const [a, setA] = useState(2);
  const [b, setB] = useState(4);
  const [first, setFirst] = useState('player');
  const [errors, setErrors] = useState({});
  const [showParams, setShowParams] = useState(true);

  // Синхронизация b с a
  useEffect(() => {
    if (mode === 2 || mode === 4) {
      if (a > b) setB(a);
    }
  }, [a, b, mode]);

  // Валидация параметров
  const validate = useCallback(() => {
    const newErrors = {};
    if (n < 5 || n > 50) newErrors.n = `n: от 5 до 50`;
    
    if (!isMultiplayer) {
      if (mode === 1 || mode === 3) {
        if (k < 1 || k > n) newErrors.k = `k: от 1 до ${n}`;
      }
      
      if (mode === 2 || mode === 4) {
        if (a < 2 || a > b) newErrors.a = `a: от 2 до b`;
        if (b < a || b > n) newErrors.b = `b: от a до ${n}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [n, k, a, b, mode, isMultiplayer]);

  // Автоматическая валидация при изменении
  useEffect(() => {
    validate();
  }, [n, k, a, b, mode, validate]);

  // Обработка отправки формы
  const handleSubmit = () => {
    if (!validate()) return;

    const settings = { 
      mode, 
      n, 
      isMultiplayer,
      first: isMultiplayer ? 'player' : first 
    };
    
    if (!isMultiplayer) {
      if (mode === 1 || mode === 3) settings.k = k;
      if (mode === 2 || mode === 4) {
        settings.a = a;
        settings.b = b;
      }
    }
    
    navigate('/game', { state: settings });
  };

  // Ползунок с drag-поддержкой
  const Slider = ({ label, value, onChange, min, max }) => {
    const trackRef = useRef(null);
    const isDraggingRef = useRef(false);

    const updateValue = useCallback((clientX) => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newValue = Math.round(min + pos * (max - min));
      onChange(Math.min(max, Math.max(min, newValue)));
    }, [min, max, onChange]);

    const handleMouseDown = useCallback((e) => {
      e.preventDefault();
      isDraggingRef.current = true;
      document.body.style.userSelect = 'none';
      updateValue(e.clientX);
    }, [updateValue]);

    const handleMouseMove = useCallback((e) => {
      if (!isDraggingRef.current) return;
      updateValue(e.clientX);
    }, [updateValue]);

    const handleMouseUp = useCallback(() => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.userSelect = '';
      }
    }, []);

    // Обработчики событий
    useEffect(() => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [handleMouseMove, handleMouseUp]);

    // Вычисление заполнения слайдера
    const fillWidth = ((value - min) / (max - min)) * 100;

    return (
      <div style={fieldStyle}>
        <label style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'clamp(14px, 4vw, 16px)',
          marginBottom: '6px'
        }}>
          <span>{label}</span>
          <strong>{value}</strong>
        </label>
        <div
          ref={trackRef}
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#ddd',
            borderRadius: '4px',
            position: 'relative',
            cursor: 'pointer'
          }}
          onMouseDown={handleMouseDown}
        >
          <div
            style={{
              height: '100%',
              width: `${fillWidth}%`,
              backgroundColor: '#3498db',
              borderRadius: '4px 0 0 4px'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `calc(${fillWidth}% - 8px)`,
              width: '16px',
              height: '16px',
              backgroundColor: '#3498db',
              borderRadius: '50%',
              transform: 'translateY(-50%)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              cursor: 'grab',
              zIndex: 2
            }}
            onMouseDown={handleMouseDown}
          />
        </div>
        {errors[label] && <p style={errorStyle}>{errors[label]}</p>}
      </div>
    );
  };

  // Стили
  const fieldStyle = {
    margin: '25px 0 10px 0',
    textAlign: 'left'
  };

  const errorStyle = {
    color: '#e74c3c',
    fontSize: '13px',
    marginTop: '6px'
  };

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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(20px, 5%, 40px)',
      backgroundImage: 'url(/bg/table.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      fontFamily: 'Nunito, sans-serif',
      textShadow: '1px 1px 5px rgba(0,0,0,0.8)',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        padding: 'clamp(20px, 6vw, 40px)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        textAlign: 'center',
        zIndex: 1,
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: 'clamp(24px, 6vw, 32px)',
            color: '#3498db'
          }}>
            {isMultiplayer ? 'Мультиплеер' : `Режим ${mode}`}
          </h2>
          
          <button 
            onClick={() => setShowParams(prev => !prev)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3498db',
              fontSize: '20px',
              cursor: 'pointer',
              width: '20px',
              height: '20px'
            }}
          >
            {showParams ? '⬅️' : '➡️'}
          </button>
        </div>
        
        <p style={{ 
          fontSize: 'clamp(14px, 4vw, 16px)',
          marginBottom: '30px',
          opacity: 0.8
        }}>
          {isMultiplayer ? 'Игра против другого игрока' : 'Настройка параметров режима'}
        </p>

        {/* Палочек */}
        {showParams && (
          <Slider
            label="Палочек"
            value={n}
            onChange={setN}
            min={5}
            max={50}
          />
        )}
        {showParams && errors.n && <p style={errorStyle}>{errors.n}</p>}

        {/* Режимы 1 и 3 */}
        {!isMultiplayer && (mode === 1 || mode === 3) && showParams && (
          <Slider
            label={`Максимум за ход (k): 1–${n}`}
            value={k}
            onChange={setK}
            min={1}
            max={n}
          />
        )}

        {/* Режимы 2 и 4 */}
        {!isMultiplayer && (mode === 2 || mode === 4) && (
          <>
            {showParams && (
              <>
                <Slider
                  label={`Минимум (a): 2–${b}`}
                  value={a}
                  onChange={setA}
                  min={2}
                  max={b}
                />
                {errors.a && <p style={errorStyle}>{errors.a}</p>}
              </>
            )}

            {showParams && (
              <>
                <Slider
                  label={`Максимум (b): ${a}–${n}`}
                  value={b}
                  onChange={setB}
                  min={a}
                  max={n}
                />
                {errors.b && <p style={errorStyle}>{errors.b}</p>}
              </>
            )}
          </>
        )}

        {/* Кто ходит первым (не в мультиплеере) */}
        {!isMultiplayer && showParams && (
          <div style={fieldStyle}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: 'clamp(14px, 4vw, 16px)',
              color: '#3498db'
            }}>
              Кто ходит первым:
            </label>
            <select
              value={first}
              onChange={e => setFirst(e.target.value)}
              style={{
                width: '100%',
                padding: 'clamp(10px, 2vw, 12px)',
                fontSize: 'clamp(14px, 4vw, 16px)',
                backgroundColor: '#ecf0f1',
                color: '#2c3e50',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              <option value="player">Игрок</option>
              <option value="computer">Компьютер</option>
            </select>
          </div>
        )}

        {/* Кнопка начала игры */}
        <button
          onClick={handleSubmit}
          style={{
            marginTop: '30px',
            padding: '14px 30px',
            fontSize: 'clamp(16px, 4vw, 18px)',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseOver={e => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.backgroundColor = '#2980b9';
          }}
          onMouseOut={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = '#3498db';
          }}
        >
          {isMultiplayer ? 'Начать мультиплеер' : 'Начать игру'}
        </button>

        {/* Кнопка "Назад" */}
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          Назад
        </button>
      </div>
    </div>
  );
}