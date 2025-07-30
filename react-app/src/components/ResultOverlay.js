export function ResultOverlay({result}) {
    if (!result) return null;
    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'clamp(32px, 8vw, 64px)',
            fontWeight: 'bold',
            color: result === 'win' ? '#27ae60' : '#e74c3c',
            textShadow: '0 0 20px rgba(0,0,0,0.8)',
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px 20px',
            borderRadius: '10px',
            textAlign: 'center'
        }}>
            {result === 'win' ? 'ВЫ ВЫИГРАЛИ' : 'ВЫ ПРОИГРАЛИ'}
        </div>
    );
}