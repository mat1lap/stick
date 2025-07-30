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
          {/* Раздел 1: Правила */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ 
              color: '#3498db',
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Правила
            </h3>
            
            {/* Подраздел 1.1: Общие правила */}
            <div style={{ marginBottom: '30px' }}>
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
                padding: '20px',
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
            
            {/* Подраздел 1.2: Правила режимов */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                color: '#2ecc71',
                fontSize: '20px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Правила режимов
              </h4>
              
              {/* Режим 1 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Правило:</strong> за один ход можно взять от 1 до k палочек (любые, не обязательно подряд)
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Особенность:</strong> палочки можно брать произвольно, не обязательно подряд
                  </li>
                </ul>
              </div>
              
              {/* Режим 2 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Правило:</strong> за один ход можно взять от a до b палочек (любые, не обязательно подряд)
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Особенность:</strong> минимальное и максимальное количество палочек, которые можно взять за ход, задается параметрами a и b
                  </li>
                </ul>
              </div>
              
              {/* Режим 3 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Правило:</strong> за один ход можно взять от 1 до k палочек, расположенных подряд
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Особенность:</strong> палочки должны быть непрерывной последовательностью
                  </li>
                </ul>
              </div>
              
              {/* Режим 4 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Правило:</strong> за один ход можно взять от a до b палочек, расположенных подряд
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Особенность:</strong> комбинация режимов 2 и 3 - интервал количества и требование непрерывности
                  </li>
                </ul>
              </div>
              
              {/* Режим 5 */}
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#f39c12',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 5: Особое
                </h5>
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Правило:</strong> за один ход можно взять:
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>1 любую палочку</li>
                      <li style={{ marginBottom: '5px' }}>2 любые палочки (не обязательно подряд)</li>
                      <li>3 палочки, расположенные подряд</li>
                    </ul>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Особенность:</strong> три разных типа допустимых ходов
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Раздел 2: Советы и оптимальные стратегии */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ 
              color: '#3498db',
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Советы и оптимальные стратегии
            </h3>
            
            {/* Подраздел 2.1: Общие советы */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                color: '#2ecc71',
                fontSize: '20px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Общие советы и стратегии
              </h4>
              
              {/* Советы */}
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
                  Советы
                </h5>
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Анализируйте позицию:</strong> перед каждым ходом оценивайте текущую ситуацию и возможные ходы противника
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Изучайте шаблоны:</strong> многие режимы имеют повторяющиеся выигрышные и проигрышные позиции
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Практикуйтесь:</strong> чем больше вы играете, тем лучше понимаете тонкости каждого режима
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Используйте подсказки:</strong> включите подсказки в игре, чтобы видеть оптимальные ходы
                  </li>
                </ul>
              </div>
              
              {/* Оптимальная стратегия */}
              <div style={{ 
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                padding: '15px',
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
                    <strong>Теория игр:</strong> многие режимы можно решить с помощью теории комбинаторных игр и Grundy-чисел
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Позиционный анализ:</strong> разбивайте поле на сегменты и анализируйте их независимо
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Мекс-функция:</strong> для многих режимов оптимальная стратегия основана на вычислении минимального исключенного значения (mex)
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Симметрия:</strong> в некоторых режимах симметричные ходы приводят к выигрышной позиции
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Подраздел 2.2: Советы для режимов */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                color: '#2ecc71',
                fontSize: '20px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Советы и стратегии для каждого режима
              </h4>
              
              {/* Режим 1 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Советы:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Следите за количеством палочек по модулю (k+1)</li>
                      <li style={{ marginBottom: '5px' }}>Если осталось количество палочек, кратное (k+1), вы в проигрышной позиции, если противник играет оптимально</li>
                      <li style={{ marginBottom: '5px' }}>Стремитесь оставить количество палочек, кратное (k+1), после вашего хода</li>
                    </ul>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Оптимальная стратегия:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Если n % (k+1) == 0, то игрок, ходящий вторым, может выиграть при оптимальной игре</li>
                      <li style={{ marginBottom: '5px' }}>В противном случае игрок, ходящий первым, может выиграть, взяв n % (k+1) палочек</li>
                      <li style={{ marginBottom: '5px' }}>После этого всегда отвечайте ходом, дополняющим ход противника до (k+1)</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              {/* Режим 2 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Советы:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Следите за количеством палочек по модулю (a+b)</li>
                      <li style={{ marginBottom: '5px' }}>Если осталось количество палочек, кратное (a+b), вы в проигрышной позиции</li>
                      <li style={{ marginBottom: '5px' }}>Стремитесь оставить количество палочек, кратное (a+b), после вашего хода</li>
                    </ul>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Оптимальная стратегия:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>
                        {"Если n % (a+b) < a, то игрок, ходящий первым, проигрывает при оптимальной игре"}
                      </li>
                      <li style={{ marginBottom: '5px' }}>
                        {"В противном случае игрок, ходящий первым, должен взять (n % (a+b) - a + 1) палочек"}
                      </li>
                      <li style={{ marginBottom: '5px' }}>
                        После этого всегда отвечайте ходом, дополняющим ход противника до (a+b)
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              {/* Режим 3 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Советы:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Разбивайте поле на независимые сегменты</li>
                      <li style={{ marginBottom: '5px' }}>Следите за симметрией на поле</li>
                      <li style={{ marginBottom: '5px' }}>Избегайте создания сегментов длиной от 1 до k</li>
                    </ul>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Оптимальная стратегия:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Используйте Grundy-числа для каждого сегмента</li>
                      <li style={{ marginBottom: '5px' }}>Вычисляйте XOR всех Grundy-чисел сегментов</li>
                      <li style={{ marginBottom: '5px' }}>Если XOR равен 0, вы в проигрышной позиции при оптимальной игре противника</li>
                      <li style={{ marginBottom: '5px' }}>Цель - сделать ход, после которого XOR станет равным 0</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              {/* Режим 4 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Советы:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Анализируйте каждый сегмент отдельно</li>
                      <li style={{ marginBottom: '5px' }}>Следите за длинами сегментов и их комбинациями</li>
                      <li style={{ marginBottom: '5px' }}>Избегайте создания сегментов длиной от a до b</li>
                    </ul>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Оптимальная стратегия:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Используйте Grundy-числа для каждого сегмента</li>
                      <li style={{ marginBottom: '5px' }}>Вычисляйте XOR всех Grundy-чисел сегментов</li>
                      <li style={{ marginBottom: '5px' }}>Цель - сделать ход, после которого XOR станет равным 0</li>
                      <li style={{ marginBottom: '5px' }}>В случае, когда нет выигрышного хода, делайте минимальный допустимый ход (a палочек)</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              {/* Режим 5 */}
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#f39c12',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 5: Особое
                </h5>
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Советы:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Следите за возможностью взять 3 подряд идущие палочки</li>
                      <li style={{ marginBottom: '5px' }}>Избегайте создания сегментов длиной 4, 9, 14 и т.д.</li>
                      <li style={{ marginBottom: '5px' }}>Стремитесь оставить четное количество сегментов определенных длин</li>
                    </ul>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Оптимальная стратегия:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Используйте рекурсивное вычисление Grundy-чисел</li>
                      <li style={{ marginBottom: '5px' }}>Для каждого состояния вычисляйте минимальное исключенное значение (mex)</li>
                      <li style={{ marginBottom: '5px' }}>Цель - сделать ход, после которого Grundy-число станет равным 0</li>
                      <li style={{ marginBottom: '5px' }}>В случае, когда нет выигрышного хода, делайте ход, уменьшающий сложность позиции</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Раздел 3: Доказательства оптимальности */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ 
              color: '#3498db',
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              Доказательства оптимальности стратегий
            </h3>
            
            {/* Подраздел 3.1: Общие доказательства */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                color: '#2ecc71',
                fontSize: '20px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Общие доказательства оптимальности
              </h4>
              
              <div style={{ 
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                <ol style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Теория Шпрага-Гранди:</strong> все режимы являются impartial играми, поэтому к ним применима теория Шпрага-Гранди. Каждая позиция имеет Grundy-число (nimber), и позиция выигрышная тогда и только тогда, когда XOR всех Grundy-чисел сегментов не равен 0.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Выигрышные и проигрышные позиции:</strong> позиция является выигрышной, если существует ход, приводящий к проигрышной позиции для противника. Позиция является проигрышной, если все возможные ходы ведут к выигрышным позициям для противника.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Оптимальная стратегия:</strong> игрок должен делать ход, который приводит к позиции с Grundy-числом 0. Это гарантирует, что противник окажется в проигрышной позиции.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Минимальное исключенное значение (mex):</strong> Grundy-число позиции вычисляется как минимальное неотрицательное целое число, которое не встречается среди Grundy-чисел всех позиций, достижимых за один ход.
                  </li>
                </ol>
              </div>
            </div>
            
            {/* Подраздел 3.2: Доказательства для режимов */}
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ 
                color: '#2ecc71',
                fontSize: '20px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                Доказательства оптимальности для каждого режима
              </h4>
              
              {/* Режим 1 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Доказательство:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Рассмотрим игру как Nim с одним кучком. Grundy-число кучка из n палочек равно n % (k+1).</li>
                      <li style={{ marginBottom: '5px' }}>Если n % (k+1) == 0, то Grundy-число равно 0, и позиция проигрышная для игрока, делающего ход.</li>
                      <li style={{ marginBottom: '5px' }}>Если n % (k+1) ≠ 0, то игрок может сделать ход, уменьшив количество палочек на (n % (k+1)), приведя к Grundy-числу 0.</li>
                      <li style={{ marginBottom: '5px' }}>Таким образом, если n % (k+1) == 0, то игрок, ходящий вторым, выигрывает при оптимальной игре.</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              {/* Режим 2 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Доказательство:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Этот режим аналогичен режиму 1, но с другими параметрами a и b.</li>
                      <li style={{ marginBottom: '5px' }}>Grundy-число кучка из n палочек равно n % (a+b).</li>
                      <li style={{ marginBottom: '5px' }}>{"Если n % (a+b) < a, то игрок, ходящий первым, проигрывает при оптимальной игре."}</li>
                      <li style={{ marginBottom: '5px' }}>В противном случае игрок, ходящий первым, должен взять (n % (a+b) - a + 1) палочек.</li>
                      <li style={{ marginBottom: '5px' }}>После этого всегда отвечайте ходом, дополняющим ход противника до (a+b).</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              {/* Режим 3 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Доказательство:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Поле разбивается на независимые сегменты. Grundy-число каждого сегмента вычисляется рекурсивно.</li>
                      <li style={{ marginBottom: '5px' }}>Для сегмента длины len Grundy-число вычисляется как mex всех возможных ходов.</li>
                      <li style={{ marginBottom: '5px' }}>Возможный ход: взять от 1 до k палочек подряд, начиная с позиции pos.</li>
                      <li style={{ marginBottom: '5px' }}>После хода остаются два сегмента: слева длиной pos, справа длиной (len - take - pos).</li>
                      <li style={{ marginBottom: '5px' }}>Grundy-число нового состояния: g[pos] ^ g[len - take - pos].</li>
                      <li style={{ marginBottom: '5px' }}>Общее Grundy-число: XOR всех Grundy-чисел сегментов.</li>
                      <li style={{ marginBottom: '5px' }}>Цель - сделать ход, после которого общее Grundy-число станет равным 0.</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              {/* Режим 4 */}
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
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Доказательство:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Этот режим комбинирует режимы 2 и 3.</li>
                      <li style={{ marginBottom: '5px' }}>Grundy-число каждого сегмента вычисляется как в режиме 3, но с ограничениями a и b.</li>
                      <li style={{ marginBottom: '5px' }}>Возможный ход: взять от a до b палочек подряд, начиная с позиции pos.</li>
                      <li style={{ marginBottom: '5px' }}>После хода остаются два сегмента: слева длиной pos, справа длиной (len - take - pos).</li>
                      <li style={{ marginBottom: '5px' }}>Grundy-число нового состояния: g[pos] ^ g[len - take - pos].</li>
                      <li style={{ marginBottom: '5px' }}>Общее Grundy-число: XOR всех Grundy-чисел сегментов.</li>
                      <li style={{ marginBottom: '5px' }}>Цель - сделать ход, после которого общее Grundy-число станет равным 0.</li>
                      <li style={{ marginBottom: '5px' }}>В случае, когда нет выигрышного хода, делайте минимальный допустимый ход (a палочек).</li>
                    </ul>
                  </li>
                </ul>
              </div>
              
              {/* Режим 5 */}
              <div style={{ 
                marginBottom: '25px',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                padding: '15px',
                borderRadius: '8px'
              }}>
                <h5 style={{ 
                  color: '#f39c12',
                  fontSize: '18px',
                  marginBottom: '10px'
                }}>
                  Режим 5: Особое
                </h5>
                <ul style={{ 
                  paddingLeft: '20px',
                  lineHeight: '1.6'
                }}>
                  <li style={{ marginBottom: '8px' }}>
                    <strong>Доказательство:</strong>
                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                      <li style={{ marginBottom: '5px' }}>Этот режим имеет три типа ходов: 1 любая, 2 любые, 3 подряд.</li>
                      <li style={{ marginBottom: '5px' }}>Grundy-число вычисляется рекурсивно для состояния игры.</li>
                      <li style={{ marginBottom: '5px' }}>Состояние игры: массив длин сегментов.</li>
                      <li style={{ marginBottom: '5px' }}>Возможные ходы: удаление 1 палочки, 2 палочек или 3 подряд идущих.</li>
                      <li style={{ marginBottom: '5px' }}>После хода состояние игры изменяется: сегмент разбивается на части.</li>
                      <li style={{ marginBottom: '5px' }}>Grundy-число нового состояния: mex всех Grundy-чисел следующих состояний.</li>
                      <li style={{ marginBottom: '5px' }}>Цель - сделать ход, после которого Grundy-число станет равным 0.</li>
                      <li style={{ marginBottom: '5px' }}>В случае, когда нет выигрышного хода, делайте ход, уменьшающий сложность позиции.</li>
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