import { useNavigate } from 'react-router-dom';

export default function Learn() {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '40px 20px',
      minHeight: '100vh',
      textAlign: 'center',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      fontFamily: 'Nunito, sans-serif',
      textShadow: '1px 1px 5px rgba(0,0,0,0.8)'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          marginBottom: '20px', 
          fontSize: '28px',
          color: '#3498db',
          textShadow: '0 0 10px #3498db'
        }}>
          📚 Как играть в Палочки
        </h2>

        <div style={{
          textAlign: 'left',
          fontSize: '16px',
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ 
              color: '#3498db',
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Правила
            </h3>
            <div>
              <h4 style={{ 
                color: '#2ecc71',
                fontSize: '20px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Общие правила
              </h4>
              
              <div style={{ 
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                padding: '20px 20px 1px 20px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                <ol style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Цель игры:</strong> взять последнюю палочку (в большинстве режимов) или заставить противника не иметь допустимых ходов.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Ходы игроков:</strong> игроки ходят по очереди, каждый ход игрок убирает одну или несколько палочек по правилам конкретного режима.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Победа:</strong> игрок, сделавший последний ход (взявший последнюю палочку или сделавший ход, после которого противник не может ходить), выигрывает.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Поражение:</strong> игрок, который не может сделать ход по правилам режима, проигрывает.
                  </li>
                </ol>
              </div>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                color: '#2ecc71',
                fontSize: '20px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Правила режимов
              </h4>
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#3498db',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 1: Стандартный
                </h5>
                <div style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                    За один ход можно взять от 1 до k палочек (любые, не обязательно подряд).
                </div>
              </div>
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#e74c3c',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 2: Интервальный выбор
                </h5>
                <div style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                    За один ход можно взять от a до b палочек (любые, не обязательно подряд).
                </div>
              </div>
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#2ecc71',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 3: Подряд
                </h5>
                <div style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                    За один ход можно взять от 1 до k палочек, расположенных подряд.
                </div>
              </div>
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#9b59b6',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 4: Подряд и интервально
                </h5>
                <div style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                    За один ход можно взять от a до b палочек, расположенных подряд.
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                padding: '15px 15px 1px 15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#f39c12',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 5: Особое
                </h5>
                <div style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                    За один ход можно взять:
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>1 любую палочку.</li>
                      <li style={{ marginBottom: '5px' }}>2 любые палочки (не обязательно подряд).</li>
                      <li>3 палочки, расположенные подряд.</li>
                    </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ 
              color: '#3498db',
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Советы и оптимальные стратегии
            </h3>
            
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                color: '#2ecc71',
                fontSize: '20px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Общие советы и стратегии
              </h4>
              
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                padding: '15px 15px 1px 15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#3498db',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Советы
                </h5>
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Анализируйте позицию:</strong> перед каждым ходом оценивайте текущую ситуацию и возможные ходы противника.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Изучайте шаблоны:</strong> многие режимы имеют повторяющиеся выигрышные и проигрышные позиции.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Практикуйтесь:</strong> чем больше вы играете, тем лучше понимаете тонкости каждого режима.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Используйте подсказки:</strong> включите подсказки в игре, чтобы видеть оптимальные ходы.
                  </li>
                </ul>
              </div>
              
              <div style={{ 
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                padding: '15px 15px 1px 15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#3498db',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Оптимальная стратегия
                </h5>
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Теория игр:</strong> многие режимы можно решить с помощью теории игр и в том числе теории Шпрага-Гранди.
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Симметрия:</strong> в некоторых режимах симметричные ходы приводят к выигрышной позиции.
                  </li>
                </ul>
              </div>
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                color: '#2ecc71',
                fontSize: '20px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Советы и стратегии для каждого режима
              </h4>
              
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                padding: '15px 15px 1px 15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#3498db',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 1: Стандартный
                </h5>
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Советы:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Следите за количеством палочек по модулю (k+1).</li>
                    </ul>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Оптимальная стратегия:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Если n % (k+1) == 0, то игрок, ходящий вторым, может выиграть при оптимальной игре.</li>
                      <li style={{ marginBottom: '5px' }}>В противном случае игрок, ходящий первым, может выиграть, взяв n % (k+1) палочек.</li>
                      <li style={{ marginBottom: '5px' }}>После этого всегда отвечайте ходом, дополняющим ход противника до (k+1).</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                padding: '15px 15px 1px 15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#e74c3c',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 2: Интервальный выбор
                </h5>
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Советы:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Следите за количеством палочек по модулю (a+b).</li>
                    </ul>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Оптимальная стратегия:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>
                        {"Если n % (a+b) < a, то игрок, ходящий первым, проигрывает при оптимальной игре."}
                      </li>
                      <li style={{ marginBottom: '5px' }}>
                        {"В противном случае игрок, ходящий первым, должен взять (n % (a+b) - a + 1) палочек."}
                      </li>
                      <li style={{ marginBottom: '5px' }}>
                        После этого всегда отвечайте ходом, дополняющим ход противника до (a+b).
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                padding: '15px 15px 1px 15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#2ecc71',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режимы 3-5
                </h5>
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Оптимальная стратегия:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Используйте числа Шпрага-Гранди для каждого отрезка палочек.</li>
                      <li style={{ marginBottom: '5px' }}>Вычисляйте XOR всех чисел Шпрага-Гранди отрезков палочек.</li>
                      <li style={{ marginBottom: '5px' }}>Цель - сделать ход, после которого XOR станет равным 0.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'all 0.2s',
            width: '100%'
          }}
          onMouseOver={e => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 6px 15px rgba(52,152,219,0.5)';
          }}
          onMouseOut={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
          }}
        >
          Назад
        </button>
      </div>
    </div>
  );
}