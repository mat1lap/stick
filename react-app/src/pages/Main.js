import { useNavigate } from 'react-router-dom';

export default function Main() {
  const navigate = useNavigate();

  const selectMode = (modeId) => {
    navigate('/setup', { state: { mode: modeId } });
  };

  const showLearn = () => {
    navigate('/learn');
  };

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
          fontSize: 'clamp(40px, 10vw, 72px)',
          marginBottom: 'clamp(30px, 6vw, 60px)',
          textAlign: 'center',
          color: '#3498db',
          textShadow: '0 0 15px #3498db, 0 0 30px #3498db',
          fontWeight: 'bold',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          fontFamily: 'Montserrat, Arial, sans-serif',
          position: 'relative',
          top: '-10px'
        }}>
          Палочки
        </h1>

        {/* Режимы */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'clamp(12px, 3vw, 20px)',
          width: '100%'
        }}>
          {[
            { id: 1, name: "Стандартно", desc: "1 до k палочек (любые)" },
            { id: 2, name: "Интервальный выбор", desc: "a до b палочек (любые)" },
            { id: 3, name: "Подряд", desc: "1 до k подряд идущих" },
            { id: 4, name: "Подряд и интервально", desc: "a до b подряд идущих" },
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => selectMode(mode.id)}
              style={{
                padding: 'clamp(16px, 3vw, 22px) clamp(12px, 4vw, 30px)',
                fontSize: 'clamp(16px, 4vw, 20px)',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: [
                  '#3498db', '#e74c3c', '#2ecc71', '#9b59b6'
                ][mode.id - 1],
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
              }}
            >
              <span style={{ display: 'block', pointerEvents: 'none' }}>
                {mode.name}
              </span>
              <span style={{
                display: 'block',
                fontSize: 'clamp(12px, 3vw, 14px)',
                opacity: 0.9,
                marginTop: '6px',
                fontWeight: 'normal',
                pointerEvents: 'none'
              }}>
                {mode.desc}
              </span>
            </button>
          ))}
          
          {/* Особый режим - растянут по ширине */}
          <button
            key={5}
            onClick={() => selectMode(5)}
            style={{
              padding: 'clamp(16px, 3vw, 22px) clamp(12px, 4vw, 30px)',
              fontSize: 'clamp(16px, 4vw, 20px)',
              fontWeight: 'bold',
              color: 'white',
              backgroundColor: '#f39c12',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              gridColumn: '1 / -1',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            }}
          >
            <span style={{ display: 'block', pointerEvents: 'none' }}>
              Особое
            </span>
            <span style={{
              display: 'block',
              fontSize: 'clamp(12px, 3vw, 14px)',
              opacity: 0.9,
              marginTop: '6px',
              fontWeight: 'normal',
              pointerEvents: 'none'
            }}>
              1, 2 любые или 3 подряд
            </span>
          </button>
        </div>

        {/* Единая кнопка "Как играть" */}
        <button
          onClick={showLearn}
          style={{
            marginTop: 'clamp(30px, 6vw, 50px)',
            padding: '16px 24px',
            fontSize: 'clamp(16px, 4vw, 20px)',
            backgroundColor: '#34495e',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
        >
          📚 Как играть
        </button>
      </div>
    </div>
  );
}