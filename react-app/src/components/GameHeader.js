import { MODE_NAMES } from '../utils/constants';

export function GameHeader({ mode, remaining, result}) {
    return (
        <div style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            marginBottom: '20px',
            marginTop: result ? '120px' : '50px'
        }}>
            <h2 style={{ marginBottom: '10px' }}>{MODE_NAMES[mode]}</h2>
            <p style={{ fontSize: '18px' }}>Осталось палочек: {remaining}</p>
        </div>
    );
}

export function SticksSelectedCounter({result, selected, isPlayerTurn, canMove}) {
    if (result) return null;
    return (
        <p style={{ 
            marginBottom: '10px',
            minHeight: '20px'
        }}>
            {isPlayerTurn && canMove() 
            ? `Выбрано палочек: ${selected.size}` 
            : isPlayerTurn && !canMove()
                ? "Нет допустимых ходов"
                : "Ходит компьютер..."
            }
        </p>
    );
}