import React, { useState, useRef } from 'react';
import { Target } from './Target';
import { useGame } from '../context/GameContext';
import { Target as TargetIcon, Crosshair } from 'lucide-react';
import { playGunshotSound, playHitSound } from '../utils/soundEffects';

export const GameBoard = () => {
  const { room, socket, clickTarget } = useGame();
  const currentTarget = room?.game?.currentTarget;
  const currentPlayer = room?.players?.find(p => p.id === socket?.id);

  // Tactical Gun State
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50, visible: false });
  const [bulletHoles, setBulletHoles] = useState([]);
  const [flashes, setFlashes] = useState([]);
  const [popups, setPopups] = useState([]);
  const [isRecoiling, setIsRecoiling] = useState(false);
  const canvasRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCrosshairPos({ x, y, visible: true });
  };

  const handleMouseLeave = () => {
    setCrosshairPos(prev => ({ ...prev, visible: false }));
  };

  const handleBoardClick = (e) => {
    if (!room?.game?.active || !canvasRef.current) return;

    // Trigger Gunshot Sound
    playGunshotSound();

    // Trigger Canvas Recoil Effect
    setIsRecoiling(true);
    setTimeout(() => setIsRecoiling(false), 100);

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create Muzzle Flash & Bullet Hole Visual Effect
    const effectId = Date.now() + Math.random();
    setBulletHoles(prev => [...prev, { id: effectId, x, y }]);
    setFlashes(prev => [...prev, { id: effectId, x, y }]);

    // Clean up bullet hole effect after fade out
    setTimeout(() => {
      setBulletHoles(prev => prev.filter(b => b.id !== effectId));
      setFlashes(prev => prev.filter(f => f.id !== effectId));
    }, 1500);
  };

  const handleTargetShot = (targetId, e) => {
    e.stopPropagation();
    if (!room?.game?.active) return;

    // Play gunshot sound & hit confirmation ping
    playGunshotSound();
    playHitSound();

    // Trigger Recoil
    setIsRecoiling(true);
    setTimeout(() => setIsRecoiling(false), 100);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Add Floating +10 Score Popup
      const popupId = Date.now() + Math.random();
      setPopups(prev => [...prev, { id: popupId, x, y, text: '+10' }]);
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== popupId));
      }, 800);
    }

    // Emit server target click claim
    clickTarget(targetId);
  };

  return (
    <div className={`game-board-container ${isRecoiling ? 'canvas-recoil' : ''}`}>
      {/* Board Header Stats */}
      <div className="game-board-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '15px' }}>
          <Crosshair size={20} color="var(--accent-rose)" />
          <span>REACTION ARENA</span>
          <span style={{ fontSize: '11px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
            🔫 Tactical Laser Gun
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Your Score: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '16px' }}>{currentPlayer?.score || 0} pts</strong>
          </span>
        </div>
      </div>

      {/* Board Target Arena Canvas */}
      <div
        ref={canvasRef}
        className="game-board-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleBoardClick}
      >
        {/* Tactical Crosshair Cursor */}
        {crosshairPos.visible && room?.game?.active && (
          <div className="gun-crosshair" style={{ left: `${crosshairPos.x}px`, top: `${crosshairPos.y}px` }}>
            <div className="gun-dot" />
          </div>
        )}

        {/* Bullet Hole Marks */}
        {bulletHoles.map(hole => (
          <div key={hole.id} className="bullet-hole" style={{ left: `${hole.x}px`, top: `${hole.y}px` }} />
        ))}

        {/* Muzzle Flashes */}
        {flashes.map(flash => (
          <div key={flash.id} className="muzzle-flash" style={{ left: `${flash.x}px`, top: `${flash.y}px` }} />
        ))}

        {/* Floating Score Popups */}
        {popups.map(pop => (
          <div key={pop.id} className="score-popup" style={{ left: `${pop.x}px`, top: `${pop.y}px` }}>
            {pop.text}
          </div>
        ))}

        {/* Target */}
        {room?.game?.active && currentTarget ? (
          <Target target={currentTarget} onClick={handleTargetShot} />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '15px' }}>
            Waiting for target...
          </div>
        )}
      </div>
    </div>
  );
};
