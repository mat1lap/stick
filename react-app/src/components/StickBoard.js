import { STICK_WIDTH, STICK_HEIGHT } from "../utils/constants";

export function StickBoard({sticks, selected, onStickClick, onHover, isValidSelection, showHints, suggestedMove, isPlayerTurn, hoveredStick}) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            margin: '20px 0 40px',
            userSelect: 'none'
        }}>
            {sticks.map((exists, i) => (
            <div
                key={i}
                onClick={() => onStickClick(i)}
                onMouseEnter={() => onHover(i)}
                onMouseLeave={() => onHover(null)}
                style={{
                width: `${STICK_WIDTH}px`,
                height: `${STICK_HEIGHT}px`,
                borderRadius: '12px',
                backgroundColor: selected.has(i)
                    ? isValidSelection
                    ? '#27ae60'
                    : '#e74c3c'
                    : showHints && suggestedMove.includes(i)
                    ? '#f39c12'
                    : (exists ? '#3498db' : '#c0c0c0'),
                opacity: exists ? 1 : 0.2,
                cursor: isPlayerTurn && exists ? 'pointer' : 'default',
                boxShadow: exists ? '0 4px 10px rgba(0,0,0,0.3)' : 'none',
                position: 'relative',
                transform: hoveredStick === i && exists ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease'
                }}
            />
            ))}
        </div>

    );
}
