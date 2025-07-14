import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './TennisBallAnimation.module.css';

interface TennisBallAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  animation?: 'bounce' | 'spin' | 'float' | 'pulse' | 'none';
  className?: string;
  draggable?: boolean;
  onFlick?: (velocity: { x: number; y: number }) => void;
}

export function TennisBallAnimation({ 
  size = 'md', 
  animation = 'bounce',
  className = '',
  draggable = false,
  onFlick
}: TennisBallAnimationProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isFlying, setIsFlying] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  
  const ballRef = useRef<HTMLDivElement>(null);
  const dragDataRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocityX: 0,
    velocityY: 0
  });
  const animationRef = useRef<number>();
  
  const ballClasses = [
    styles.tennisBall,
    styles[size],
    !isDragging && !isFlying && animation !== 'none' ? styles[animation] : '',
    draggable ? styles.draggable : '',
    isDragging ? styles.dragging : '',
    isFlying ? styles.flying : '',
    className
  ].filter(Boolean).join(' ');

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setIsFlying(false);
    setHasMoved(false);
    
    const rect = ballRef.current?.getBoundingClientRect();
    if (rect) {
      dragDataRef.current = {
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        lastX: e.clientX,
        lastY: e.clientY,
        lastTime: Date.now(),
        velocityX: 0,
        velocityY: 0
      };
    }
  }, [draggable]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!draggable) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setIsFlying(false);
    setHasMoved(false);
    
    const touch = e.touches[0];
    const rect = ballRef.current?.getBoundingClientRect();
    if (rect) {
      dragDataRef.current = {
        startX: touch.clientX - rect.left,
        startY: touch.clientY - rect.top,
        lastX: touch.clientX,
        lastY: touch.clientY,
        lastTime: Date.now(),
        velocityX: 0,
        velocityY: 0
      };
    }
  }, [draggable]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !ballRef.current) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - dragDataRef.current.lastTime;
    
    if (deltaTime > 0) {
      const deltaX = clientX - dragDataRef.current.lastX;
      const deltaY = clientY - dragDataRef.current.lastY;
      
      // Track if there's been actual movement
      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        setHasMoved(true);
      }
      
      dragDataRef.current.velocityX = deltaX / deltaTime * 1000;
      dragDataRef.current.velocityY = deltaY / deltaTime * 1000;
      dragDataRef.current.lastX = clientX;
      dragDataRef.current.lastY = clientY;
      dragDataRef.current.lastTime = currentTime;
    }
    
    const rect = ballRef.current.getBoundingClientRect();
    const parent = ballRef.current.parentElement?.getBoundingClientRect();
    
    if (parent) {
      const newX = Math.max(-rect.width/2, Math.min(parent.width - rect.width/2, 
        clientX - parent.left - dragDataRef.current.startX));
      const newY = Math.max(-rect.height/2, Math.min(parent.height - rect.height/2, 
        clientY - parent.top - dragDataRef.current.startY));
      
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const velX = dragDataRef.current.velocityX;
    const velY = dragDataRef.current.velocityY;
    const speed = Math.sqrt(velX * velX + velY * velY);
    
    // Only trigger flick if there was actual movement and sufficient velocity
    if (speed > 300 && hasMoved) { // Minimum velocity AND actual movement
      setVelocity({ x: velX, y: velY });
      setIsFlying(true);
      onFlick?.({ x: velX, y: velY });
    }
  }, [isDragging, onFlick, hasMoved]);

  // Physics animation for flying ball
  useEffect(() => {
    if (!isFlying) return;
    
    const friction = 0.98;
    const gravity = 0.5;
    const bounceMinVelocity = 50;
    
    const animate = () => {
      setPosition(prev => {
        const newVelX = velocity.x * friction;
        const newVelY = velocity.y * friction + gravity;
        
        let newX = prev.x + newVelX * 0.016;
        let newY = prev.y + newVelY * 0.016;
        
        const parent = ballRef.current?.parentElement?.getBoundingClientRect();
        const rect = ballRef.current?.getBoundingClientRect();
        
        if (parent && rect) {
          // Boundary collision
          if (newX <= -rect.width/2) {
            newX = -rect.width/2;
            setVelocity(v => ({ ...v, x: -v.x * 0.7 }));
          } else if (newX >= parent.width - rect.width/2) {
            newX = parent.width - rect.width/2;
            setVelocity(v => ({ ...v, x: -v.x * 0.7 }));
          }
          
          if (newY <= -rect.height/2) {
            newY = -rect.height/2;
            setVelocity(v => ({ ...v, y: -v.y * 0.7 }));
          } else if (newY >= parent.height - rect.height/2) {
            newY = parent.height - rect.height/2;
            setVelocity(v => ({ ...v, y: -v.y * 0.7 }));
          }
        }
        
        setVelocity(v => ({ x: newVelX, y: newVelY }));
        
        // Stop animation when velocity is too low
        if (Math.abs(newVelX) < bounceMinVelocity && Math.abs(newVelY) < bounceMinVelocity) {
          setIsFlying(false);
        }
        
        return { x: newX, y: newY };
      });
      
      if (isFlying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isFlying, velocity]);

  // Handle simple clicks without drag
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!draggable) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // For draggable balls, prevent click events that might interfere
    e.preventDefault();
    e.stopPropagation();
  }, [draggable]);

  // Global mouse/touch event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => handleEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const ballStyle = draggable ? {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: isDragging || isFlying ? 'none' : 'transform 0.3s ease-out'
  } : {};

  return (
    <div 
      ref={ballRef}
      className={ballClasses}
      style={ballStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <div className={styles.ballSurface}>
        <div className={styles.ballCurve}></div>
      </div>
    </div>
  );
}

interface TennisCourtProps {
  children?: React.ReactNode;
  className?: string;
}

export function TennisCourt({ children, className = '' }: TennisCourtProps) {
  return (
    <div className={`${styles.tennisCourt} ${className}`}>
      <div className={styles.courtLines}>
        <div className={styles.baseline}></div>
        <div className={styles.serviceLine}></div>
        <div className={styles.centerLine}></div>
      </div>
      {children}
    </div>
  );
}

interface TennisRacketProps {
  size?: 'sm' | 'md' | 'lg';
  animation?: 'swing' | 'static';
  className?: string;
}

export function TennisRacket({ 
  size = 'md', 
  animation = 'static',
  className = ''
}: TennisRacketProps) {
  const racketClasses = [
    styles.tennisRacket,
    styles[`racket-${size}`],
    animation !== 'static' ? styles[`racket-${animation}`] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={racketClasses}>
      <div className={styles.racketHead}>
        <div className={styles.strings}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.string}></div>
          ))}
        </div>
      </div>
      <div className={styles.racketHandle}></div>
    </div>
  );
}

interface TennisSceneProps {
  showBall?: boolean;
  showRacket?: boolean;
  ballAnimation?: 'bounce' | 'spin' | 'float' | 'pulse' | 'none';
  racketAnimation?: 'swing' | 'static';
  className?: string;
  draggableBall?: boolean;
  onBallFlick?: (velocity: { x: number; y: number }) => void;
}

export function TennisScene({ 
  showBall = true,
  showRacket = false,
  ballAnimation = 'bounce',
  racketAnimation = 'static',
  className = '',
  draggableBall = false,
  onBallFlick
}: TennisSceneProps) {
  return (
    <div className={`${styles.tennisScene} ${className}`}>
      <TennisCourt>
        {showBall && (
          <TennisBallAnimation 
            size="lg" 
            animation={ballAnimation}
            className={styles.sceneBall}
            draggable={draggableBall}
            onFlick={onBallFlick}
          />
        )}
        {showRacket && (
          <TennisRacket 
            size="lg" 
            animation={racketAnimation}
            className={styles.sceneRacket}
          />
        )}
      </TennisCourt>
    </div>
  );
}