import { useNavigate, useLocation } from 'react-router-dom';

export default function Learn() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || 1;

  // Обучение по каждому режиму
  const learnContent = {
    1: {
      title: "Режим 1: Стандартный",
      content: [
        "Можно брать от 1 до k палочек за ход",
        "Побеждает тот, кто возьмёт последнюю палочку",
        "Совет: если n % (k+1) == 0 — компьютер выиграет"
      ]
    },
    2: {
      title: "Режим 2: Интервальный выбор",
      content: [
        "Можно брать от a до b палочек за ход",
        "Побеждает тот, кто возьмёт последнюю палочку",
        "Совет: старайтесь оставить a-1 палочек"
      ]
    },
    3: {
      title: "Режим 3: Подряд",
      content: [
        "Можно брать от 1 до k палочек подряд",
        "Побеждает тот, кто возьмёт последнюю палочку",
        "Совет: разбейте поле на равные части"
      ]
    },
    4: {
      title: "Режим 4: Подряд и интервальный",
      content: [
        "Можно брать от a до b палочек подряд",
        "Побеждает тот, кто возьмёт последнюю палочку",
        "Совет: используйте те же стратегии, что и в режиме 2"
      ]
    },
    5: {
      title: "Режим 5: Особый",
      content: [
        "Можно брать: 1 любую, 2 любые или 3 подряд",
        "Побеждает тот, кто возьмёт последнюю палочку",
        "Совет: старайтесь оставлять кучи по 4, 9, 14 палочек"
      ]
    },
    6: {
      title: "Режим 6: Мультиплеер",
      content: [
        "Играют двое игроков по очереди",
        "Побеждает тот, кто возьмёт последнюю палочку",
        "Совет: используйте те же стратегии, что и в одиночной игре"
      ]
    }
  };

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
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        textAlign: 'center'
      }}>
        <h2 style={{
          marginBottom: '20px',
          fontSize: 'clamp(28px, 8vw, 48px)',
          color: '#3498db',
          textShadow: '0 0 10px #3498db',
          fontWeight: 'bold',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          {learnContent[mode].title}
        </h2>

        <div style={{
          textAlign: 'left',
          fontSize: 'clamp(16px, 4vw, 20px)',
          marginBottom: '30px'
        }}>
          {learnContent[mode].content.map((item, i) => (
            <p key={i} style={{ marginBottom: '15px' }}>
              {i+1}. {item}
            </p>
          ))}
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 24px',
            fontSize: 'clamp(18px, 5vw, 24px)',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            width: '100%',
            maxWidth: '500px'
          }}
          onMouseOver={e => {
            e.target.style.backgroundColor = '#2980b9';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={e => {
            e.target.style.backgroundColor = '#3498db';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Назад
        </button>
      </div>
    </div>
  );
}