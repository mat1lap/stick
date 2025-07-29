import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Slider } from 'antd';
import 'antd/dist/reset.css';

export default function Setup() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || 1;

  const [n, setN] = useState(10);
  const [k, setK] = useState(3);
  const [a, setA] = useState(2);
  const [b, setB] = useState(4);
  const [first, setFirst] = useState('player');
  const [errors, setErrors] = useState({});

  // Основной эффект для синхронизации значений и валидации
  useEffect(() => {
    let newErrors = {};
    let hasChanges = false;
    
    // Корректировка значений
    const correctedN = Math.min(Math.max(n, 5), 50);
    if (correctedN !== n) {
      setN(correctedN);
      hasChanges = true;
    }
    
    // Для режимов 1 и 3
    if (mode === 1 || mode === 3) {
      const correctedK = Math.min(Math.max(k, 1), correctedN);
      if (correctedK !== k) {
        setK(correctedK);
        hasChanges = true;
      }
    }
    
    // Для режимов 2 и 4
    if (mode === 2 || mode === 4) {
      // Сначала корректируем a
      const correctedA = Math.min(Math.max(a, 2), correctedN);
      if (correctedA !== a) {
        setA(correctedA);
        hasChanges = true;
      }
      
      // Теперь корректируем b с учетом исправленного a
      let correctedB = Math.min(Math.max(b, correctedA), correctedN);
      if (correctedB !== b) {
        setB(correctedB);
        hasChanges = true;
      }
    }
    
    // Если были изменения, пропускаем валидацию и ждем следующего рендера
    if (hasChanges) return;
    
    // Валидация после всех корректировок
    if (correctedN < 5 || correctedN > 50) newErrors.n = `n: от 5 до 50`;
    
    if (mode === 1 || mode === 3) {
      if (k < 1 || k > correctedN) newErrors.k = `k: от 1 до ${correctedN}`;
    }
    
    if (mode === 2 || mode === 4) {
      if (a < 2 || a > b) newErrors.a = `a: от 2 до b`;
      if (b < a || b > correctedN) newErrors.b = `b: от a до ${correctedN}`;
    }
    
    setErrors(newErrors);
  }, [n, k, a, b, mode]);

  const handleSubmit = () => {
    // Проверка перед отправкой
    let newErrors = {};
    const correctedN = Math.min(Math.max(n, 5), 50);
    
    if (correctedN < 5 || correctedN > 50) newErrors.n = `n: от 5 до 50`;
    
    if (mode === 1 || mode === 3) {
      const correctedK = Math.min(Math.max(k, 1), correctedN);
      if (correctedK < 1 || correctedK > correctedN) newErrors.k = `k: от 1 до ${correctedN}`;
    }
    
    if (mode === 2 || mode === 4) {
      const correctedA = Math.min(Math.max(a, 2), correctedN);
      const correctedB = Math.min(Math.max(b, correctedA), correctedN);
      
      if (correctedA < 2 || correctedA > correctedB) newErrors.a = `a: от 2 до b`;
      if (correctedB < correctedA || correctedB > correctedN) newErrors.b = `b: от a до ${correctedN}`;
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const settings = { mode, n: correctedN, first };
      if (mode === 1 || mode === 3) settings.k = Math.min(Math.max(k, 1), correctedN);
      if (mode === 2 || mode === 4) {
        settings.a = Math.min(Math.max(a, 2), correctedN);
        settings.b = Math.min(Math.max(b, settings.a), correctedN);
      }
      
      navigate('/game', { state: settings });
    }
  };

  return (
    <div style={{
      padding: '40px 20px',
      minHeight: '100vh',
      display: 'flex',
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
      <div style={{
        position: 'absolute',
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
        maxWidth: '500px',
        margin: '0 auto',
        padding: 'clamp(20px, 6vw, 40px)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ 
          marginBottom: '30px', 
          fontSize: 'clamp(24px, 6vw, 32px)',
          textAlign: 'center',
          color: '#3498db'
        }}>
          Настройки
        </h2>

        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '15px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            margin: '25px 0 10px 0',
            textAlign: 'left'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'clamp(14px, 4vw, 16px)',
              marginBottom: '6px'
            }}>
              <span>Палочек (n)</span>
              <strong>{n}</strong>
            </div>
            <Slider
              min={5}
              max={50}
              step={1}
              value={n}
              onChange={setN}
              tipFormatter={null}
              styles={{
                track: { backgroundColor: '#3498db' },
                handle: { 
                  borderColor: '#3498db',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#aaa',
              marginTop: '4px'
            }}>
              <span>5</span>
              <span>50</span>
            </div>
            {errors.n && <p style={errorStyle}>{errors.n}</p>}
          </div>
        </div>

        {(mode === 1 || mode === 3) && (
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            padding: '15px', 
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              margin: '25px 0 10px 0',
              textAlign: 'left'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'clamp(14px, 4vw, 16px)',
                marginBottom: '6px'
              }}>
                <span>Максимум за ход (k)</span>
                <strong>{k}</strong>
              </div>
              <Slider
                min={1}
                max={n}
                step={1}
                value={k}
                onChange={setK}
                tipFormatter={null}
                styles={{
                  track: { backgroundColor: '#3498db' },
                  handle: { 
                    borderColor: '#3498db',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#aaa',
                marginTop: '4px'
              }}>
                <span>1</span>
                <span>{n}</span>
              </div>
              {errors.k && <p style={errorStyle}>{errors.k}</p>}
            </div>
          </div>
        )}

        {(mode === 2 || mode === 4) && (
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            padding: '15px', 
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              margin: '25px 0 10px 0',
              textAlign: 'left'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'clamp(14px, 4vw, 16px)',
                marginBottom: '6px'
              }}>
                <span>Интервал (a-b)</span>
                <strong>{a} – {b}</strong>
              </div>
              <Slider
                range
                min={2}
                max={n}
                step={1}
                value={[a, b]}
                onChange={([newA, newB]) => {
                  if (newA <= newB) {
                    setA(newA);
                    setB(newB);
                  } else {
                    // Если a > b, устанавливаем b = a
                    setA(newB);
                    setB(newB);
                  }
                }}
                tipFormatter={null}
                styles={{
                  track: { backgroundColor: '#3498db' },
                  handle: { 
                    borderColor: '#3498db',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#aaa',
                marginTop: '4px'
              }}>
                <span>2</span>
                <span>{n}</span>
              </div>
              {errors.a && <p style={errorStyle}>{errors.a}</p>}
              {errors.b && <p style={errorStyle}>{errors.b}</p>}
            </div>
          </div>
        )}

        {/* Компактный дизайн для выбора первого игрока */}
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '12px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            margin: '10px 0 5px 0',
            textAlign: 'left'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'clamp(14px, 4vw, 16px)',
              marginBottom: '5px'
            }}>
              <span>Кто ходит первым</span>
              <strong>{first === 'player' ? 'Игрок' : 'Компьютер'}</strong>
            </div>
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={() => setFirst('player')}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  backgroundColor: first === 'player' ? '#3498db' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  fontSize: 'clamp(14px, 4vw, 16px)'
                }}
                onMouseOver={e => {
                  if (first !== 'player') {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  }
                }}
                onMouseOut={e => {
                  if (first !== 'player') {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  }
                }}
              >
                Игрок
              </button>
              <button
                onClick={() => setFirst('computer')}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  backgroundColor: first === 'computer' ? '#3498db' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  fontSize: 'clamp(14px, 4vw, 16px)'
                }}
                onMouseOver={e => {
                  if (first !== 'computer') {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                  }
                }}
                onMouseOut={e => {
                  if (first !== 'computer') {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                  }
                }}
              >
                Компьютер
              </button>
            </div>
          </div>
        </div>
        
        {/* Кнопка "Назад" */}
        <button
          onClick={() => navigate(-1)}
          style={{
            width: '100%',
            padding: '10px 20px',
            fontSize: 'clamp(16px, 4vw, 18px)',
            fontWeight: 'bold',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '15px',
            transition: 'all 0.3s ease'
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
        Назад
        </button>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: 'clamp(16px, 4vw, 18px)',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            marginTop: '15px',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => {
            e.target.style.transform = 'scale(1.03)';
            e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
          }}
          onMouseOut={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
        >
          Начать игру
        </button>
      </div>
    </div>
  );
}

const fieldStyle = {
  margin: '25px 0 10px 0',
  textAlign: 'left'
};

const errorStyle = {
  color: '#e74c3c',
  fontSize: '13px',
  marginTop: '6px',
  textAlign: 'left'
};