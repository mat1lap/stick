import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOptimalMove, getSegments } from '../ai/ai';
import { isValidMove } from '../utils/gameLogic';
import { GameHeader, SticksSelectedCounter } from '../components/GameHeader';
import { ResultOverlay } from '../components/ResultOverlay';
import { ParametersBox } from '../components/GameParametersBox';
import { StickBoard } from '../components/StickBoard';
import { ConfirmButton, ReturnButton, HintsButton, ResetButton, ExitButton } from '../components/Buttons';

export default function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, n, k = 3, a = 2, b = 4, first } = location.state;
  const [sticks, setSticks] = useState(() => Array(n).fill(true));
  const [selected, setSelected] = useState(new Set());
  const [isPlayerTurn, setIsPlayerTurn] = useState(first === 'player');
  const [showHints, setShowHints] = useState(false);
  const [suggestedMove, setSuggestedMove] = useState([]);
  const [gameResult, setGameResult] = useState(null); // null, 'win', 'lose'
  const [hoveredStick, setHoveredStick] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const sticksRef = useRef(sticks);
  const isPlayerTurnRef = useRef(isPlayerTurn);
  const isGameOverRef = useRef(false);

  const isValidSelection = isValidMove(Array.from(selected), sticks, mode, k, a, b);
  const remainingSticks = sticks.filter(Boolean).length;
  const isGameOver = remainingSticks === 0;

  const canPlayerMove = useCallback(() => {
    if (remainingSticks === 0) return false;
    if (mode === 2 || mode === 4) {
      const segments = getSegments(sticks);
      for (const seg of segments) {
        if (seg.len >= a) return true;
      }
      return false;
    }
    return true;
  }, [sticks, mode, a]);

  const handleStickClick = (index) => {
    if (!isPlayerTurn || !sticks[index]) return;
    const newSelected = new Set(selected);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelected(newSelected);
  };

  const confirmMove = () => {
    const selectedIndices = Array.from(selected);
    if (!isValidMove(selectedIndices, sticks, mode, k, a, b)) {
      return;
    }

    const newSticks = [...sticks];
    selectedIndices.forEach(i => {
      newSticks[i] = false;
    });
    
    setMoveHistory(prev => [...prev.slice(0, currentMoveIndex + 1), {
      sticks: [...sticks],
      selected: new Set(selected),
      isPlayerTurn
    }]);
    setCurrentMoveIndex(prev => prev + 1);

    setSticks(newSticks);
    setSelected(new Set());
    setIsPlayerTurn(false);
  };

  const undoMove = () => {
    if (currentMoveIndex < 0) return;
    const previousState = moveHistory[currentMoveIndex];
    setSticks(previousState.sticks);
    setSelected(new Set());
    setIsPlayerTurn(previousState.isPlayerTurn);
    setCurrentMoveIndex(prev => prev - 1);
  };

  const resetGame = () => {
    const newSticks = Array(n).fill(true);
    setSticks(newSticks);
    setSelected(new Set());
    setIsPlayerTurn(first === 'player');
    setGameResult(null);
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
  };

  useEffect(() => {
    sticksRef.current = sticks;
    isPlayerTurnRef.current = isPlayerTurn;
    isGameOverRef.current = sticks.filter(Boolean).length === 0;
  }, [sticks, isPlayerTurn]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSticks(Array(n).fill(true));
      setIsPlayerTurn(first === 'player');
    }, 50);

    return () => clearTimeout(timer);
  }, [n, first]);

  useEffect(() => {
    if (!isPlayerTurn || isGameOver || !canPlayerMove()) {
      setSuggestedMove([]);
      return;
    }

    const move = getOptimalMove(mode, sticks, a, b, k);
    setSuggestedMove(move);
  }, [sticks, isPlayerTurn, isGameOver, mode, a, b, k, canPlayerMove]);

  useEffect(() => {
    if (isGameOver) {
      if (!isPlayerTurn) {
        setGameResult('win');
      } else {
        setGameResult('lose');
      }
      return;
    }

    if (!canPlayerMove()) {
      if (!isPlayerTurn) {
        setGameResult('win');
      } else {
        setGameResult('lose');
      }
    }
  }, [isGameOver, isPlayerTurn, canPlayerMove]);

  useEffect(() => {
    if (isPlayerTurn || isGameOver || !canPlayerMove()) return;

    const timer = setTimeout(() => {
      const move = getOptimalMove(mode, sticksRef.current, a, b, k);
      if (!Array.isArray(move) || move.length === 0) {
        setIsPlayerTurn(true);
        return;
      }

      setSticks(prevSticks => {
        const newSticks = [...prevSticks];
        move.forEach(i => {
          if (i >= 0 && i < newSticks.length) {
            newSticks[i] = false;
          }
        });
        return newSticks;
      });
      setSelected(new Set());
      setIsPlayerTurn(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, isGameOver, mode, a, b, k, canPlayerMove]);

  return (
    <div style={{
      padding: '20px',
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
      boxSizing: 'border-box',
      height: '100vh'
    }}>
      <ResultOverlay result={gameResult} />
      <ParametersBox mode={mode} params={{n, k, a, b}} first={first} />
      <GameHeader mode={mode} remaining={remainingSticks} result={gameResult} />
      <StickBoard
        sticks={sticks}
        selected={selected}
        onStickClick={handleStickClick}
        onHover={setHoveredStick}
        isValidSelection={isValidSelection}
        showHints={showHints}
        suggestedMove={suggestedMove}
        isPlayerTurn={isPlayerTurn}
        hoveredStick={hoveredStick}
      />
      
      <div style={{
        width: '100%',
        maxWidth: '500px',
        zIndex: 10
      }}>
        <div style={{ 
        marginBottom: gameResult ? '0px' : '20px',
        minHeight: gameResult ? '0px' : '70px'
        }}>
          <SticksSelectedCounter result={gameResult} selected={selected} isPlayerTurn={isPlayerTurn} canMove={canPlayerMove} />
          <ConfirmButton
            result={gameResult}
            isPlayerTurn={isPlayerTurn}
            canMove={canPlayerMove}
            confirmMove={confirmMove}
            isValidSelection={isValidSelection}
          />
        </div>
        <div style={{
        marginBottom: gameResult ? '0px' : '10px'
        }}>
          <ReturnButton result={gameResult} undoMove={undoMove} currentMoveIndex={currentMoveIndex} />
        </div>
        <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: gameResult ? '0px' : '20px',
            flexWrap: 'wrap'
        }}>
          <HintsButton result={gameResult} showHints={showHints} setShowHints={setShowHints} />
        </div>
        <ResetButton resetGame={resetGame} />
        <ExitButton navigate={navigate} />
      </div>
    </div>
  );
}