export function ConfirmButton({result, isPlayerTurn, canMove, confirmMove, isValidSelection}) {
    if (result) return null;
    return (
        <button
            onClick={isPlayerTurn && canMove() ? confirmMove : undefined}
            disabled={!isPlayerTurn || !canMove() || !isValidSelection}
            style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: !isPlayerTurn || !canMove() || !isValidSelection ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            width: '100%',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => {
            if (!isPlayerTurn || !canMove() || !isValidSelection) return;
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
            if (!isPlayerTurn || !canMove() || !isValidSelection) return;
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
        >
            {isPlayerTurn && canMove() ? "Подтвердить ход" : "Ход компьютера"}
        </button>
    );
}

export function ReturnButton({result, undoMove, currentMoveIndex}) {
    if (result) return null;
    return (
        <button
            onClick={undoMove}
            disabled={currentMoveIndex < 0}
            style={{
                width: '100%',
                padding: '10px 14px',
                border: 'none',
                borderRadius: '6px',
                cursor: currentMoveIndex < 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: currentMoveIndex < 0 ? '#bdc3c7' : '#95a5a6',
                color: 'white',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => {
                if (currentMoveIndex < 0) return;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
                if (currentMoveIndex < 0) return;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
        >
            ⏮️ Назад
        </button>
    );
}

export function HintsButton({result, showHints, setShowHints}) {
    if (result) return null;
    return (
        <button
            onClick={() => setShowHints(prev => !prev)}
            style={{
                padding: '10px 14px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#3498db',
                color: 'white',
                flex: 1,
                minWidth: '45%',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
            {showHints ? '💡 Подсказки: Вкл' : '💡 Подсказки: Выкл'}
        </button>
    );
}

export function ResetButton({resetGame}) {
    return (
        <button
          onClick={resetGame}
          style={{
            padding: '12px 24px',
            fontSize: '18px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%',
            marginBottom: '10px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
          Заново
        </button>
    );
}

export function ExitButton({navigate}) {
    return (
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
          Выйти в меню
        </button>
    );
}