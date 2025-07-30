import { MODE_NAMES } from "../utils/constants"

export function ParametersBox({mode, params, first}) {
    return (
        <div style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            padding: '10px', 
            borderRadius: '8px',
            zIndex: 10
        }}>
            <p style={{ margin: '5px 0' }}><strong>Режим:</strong> {MODE_NAMES[mode]}</p>
            <p style={{ margin: '5px 0' }}><strong>n:</strong> {params.n}</p>
            {(mode === 1 || mode === 3) && <p style={{ margin: '5px 0' }}><strong>k:</strong> {params.k}</p>}
            {(mode === 2 || mode === 4) && (
            <>
                <p style={{ margin: '5px 0' }}><strong>a:</strong> {params.a}</p>
                <p style={{ margin: '5px 0' }}><strong>b:</strong> {params.b}</p>
            </>
            )}
            <p style={{ margin: '5px 0' }}><strong>Первый:</strong> {first === 'player' ? 'Игрок' : 'Компьютер'}</p>
        </div>
    );
}