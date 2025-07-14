import React, { useEffect, useRef, useState, useCallback } from "react";
import Translate from "@docusaurus/Translate";
import clsx from "clsx";
import styles from "./TennisHero.module.css";
import { sessionManager } from "../../utils/session";
import { tennisBallEvents } from "../../utils/tennis-ball-events";
import * as PIXI from "pixi.js";

// Spatial partitioning for collision detection optimization
class SpatialGrid {
  private cellSize: number;
  private cells: Map<string, Set<InteractiveTennisBall>>;
  private width: number;
  private height: number;
  
  constructor(width: number, height: number, cellSize: number = 100) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.cells = new Map();
  }
  
  clear() {
    this.cells.clear();
  }
  
  private getKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }
  
  insert(ball: InteractiveTennisBall) {
    const key = this.getKey(ball.x, ball.y);
    if (!this.cells.has(key)) {
      this.cells.set(key, new Set());
    }
    this.cells.get(key)!.add(ball);
  }
  
  getNearby(ball: InteractiveTennisBall): Set<InteractiveTennisBall> {
    const nearby = new Set<InteractiveTennisBall>();
    const cellX = Math.floor(ball.x / this.cellSize);
    const cellY = Math.floor(ball.y / this.cellSize);
    
    // Check surrounding cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        const cell = this.cells.get(key);
        if (cell) {
          cell.forEach(b => {
            if (b !== ball) nearby.add(b);
          });
        }
      }
    }
    
    return nearby;
  }
}

// Object pool for reusing ball instances
class BallPool {
  private pool: InteractiveTennisBall[] = [];
  private container: PIXI.Container;
  
  constructor(container: PIXI.Container) {
    this.container = container;
  }
  
  acquire(x: number, y: number): InteractiveTennisBall {
    let ball = this.pool.pop();
    if (!ball) {
      ball = new InteractiveTennisBall(x, y, this.container);
    } else {
      ball.reset(x, y);
    }
    return ball;
  }
  
  release(ball: InteractiveTennisBall) {
    ball.sprite.visible = false;
    this.pool.push(ball);
  }
}

// Ultra-realistic physics ball class optimized for Pixi.js
class InteractiveTennisBall {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  restitution: number;
  friction: number;
  airResistance: number;
  gravityScale: number;
  sleeping: boolean;
  sleepThreshold: number;
  sleepFrames: number;
  lastX: number;
  lastY: number;
  rotation: number;
  rotationSpeed: number;
  sprite: PIXI.Sprite;
  interactive: boolean = true;
  static ballTexture: PIXI.Texture | null = null;
  static fallbackTexture: PIXI.Texture | null = null;

  constructor(x: number, y: number, container: PIXI.Container) {
    this.radius = 15;
    this.sprite = new PIXI.Sprite(InteractiveTennisBall.ballTexture || InteractiveTennisBall.fallbackTexture!);
    this.sprite.anchor.set(0.5);
    this.sprite.width = this.radius * 2;
    this.sprite.height = this.radius * 2;
    this.sprite.eventMode = 'static';
    this.sprite.cursor = 'pointer';
    container.addChild(this.sprite);
    
    this.reset(x, y);
  }

  reset(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.mass = Math.PI * this.radius * this.radius;
    this.restitution = 0.75;
    this.friction = 0.95;
    this.airResistance = 0.998;
    this.gravityScale = 1;
    this.sleeping = false;
    this.sleepThreshold = 0.1;
    this.sleepFrames = 0;
    this.lastX = x;
    this.lastY = y;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = 0;
    this.sprite.visible = true;
    this.sprite.position.set(x, y);
    this.sprite.rotation = this.rotation;
  }

  static async loadTextures(app: PIXI.Application) {
    // Try to load the logo image
    try {
      InteractiveTennisBall.ballTexture = await PIXI.Assets.load('/img/logo.png');
    } catch (e) {
      console.log('Logo not found, using fallback tennis ball');
    }
    
    // Create fallback tennis ball texture
    const graphics = new PIXI.Graphics();
    const radius = 30;
    
    // Main ball
    graphics.beginFill(0xCFFF00);
    graphics.drawCircle(radius, radius, radius);
    graphics.endFill();
    
    // Tennis ball seam
    graphics.lineStyle(2, 0xFFFFFF, 0.8);
    graphics.arc(radius, radius, radius * 0.8, 0, Math.PI);
    graphics.arc(radius, radius, radius * 0.8, Math.PI, Math.PI * 2);
    
    // Highlight
    graphics.beginFill(0xFFFFFF, 0.3);
    graphics.drawCircle(radius * 0.75, radius * 0.75, radius * 0.25);
    graphics.endFill();
    
    InteractiveTennisBall.fallbackTexture = app.renderer.generateTexture(graphics);
    graphics.destroy();
  }

  containsPoint(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }

  checkCTACollision(buttonRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    const closestX = Math.max(
      buttonRect.x,
      Math.min(this.x, buttonRect.x + buttonRect.width)
    );
    const closestY = Math.max(
      buttonRect.y,
      Math.min(this.y, buttonRect.y + buttonRect.height)
    );

    const distanceX = this.x - closestX;
    const distanceY = this.y - closestY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < this.radius) {
      const overlap = this.radius - distance;
      let normalX = distanceX / distance;
      let normalY = distanceY / distance;

      if (distance === 0) {
        const centerX = buttonRect.x + buttonRect.width / 2;
        const centerY = buttonRect.y + buttonRect.height / 2;
        normalX = this.x - centerX;
        normalY = this.y - centerY;
        const length = Math.sqrt(normalX * normalX + normalY * normalY);
        normalX /= length;
        normalY /= length;
      }

      this.x += normalX * overlap;
      this.y += normalY * overlap;

      const dotProduct = this.vx * normalX + this.vy * normalY;
      this.vx -= 2 * dotProduct * normalX * 0.8;
      this.vy -= 2 * dotProduct * normalY * 0.8;

      this.vx += (Math.random() - 0.5) * 0.5;
      this.vy += (Math.random() - 0.5) * 0.5;

      this.sleeping = false;
      return true;
    }
    return false;
  }

  checkCollisionWith(other: InteractiveTennisBall) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = this.radius + other.radius;

    if (distance < minDistance && distance > 0.001) {
      if (this.sleeping || other.sleeping) {
        this.sleeping = false;
        other.sleeping = false;
        this.sleepFrames = 0;
        other.sleepFrames = 0;
      }

      const overlap = minDistance - distance;
      const separationDamping = this.sleeping || other.sleeping ? 0.3 : 0.5;
      const separationX = (dx / distance) * overlap * 0.5 * separationDamping;
      const separationY = (dy / distance) * overlap * 0.5 * separationDamping;

      if (!this.sleeping) {
        this.x -= separationX;
        this.y -= separationY;
      }
      if (!other.sleeping) {
        other.x += separationX;
        other.y += separationY;
      }

      const impactForce = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      this.rotationSpeed += (Math.random() - 0.5) * impactForce * 0.2;
      other.rotationSpeed += (Math.random() - 0.5) * impactForce * 0.2;

      const nx = dx / distance;
      const ny = dy / distance;
      const rvx = other.vx - this.vx;
      const rvy = other.vy - this.vy;
      const speed = rvx * nx + rvy * ny;

      if (speed > -0.1) return;

      const impulse = (2 * speed) / (this.mass + other.mass);
      const restitution = Math.min(this.restitution, other.restitution) * 0.8;
      const impulseDamping = 0.85;

      if (!this.sleeping) {
        this.vx += impulse * other.mass * nx * restitution * impulseDamping;
        this.vy += impulse * other.mass * ny * restitution * impulseDamping;
      }
      if (!other.sleeping) {
        other.vx -= impulse * this.mass * nx * restitution * impulseDamping;
        other.vy -= impulse * this.mass * ny * restitution * impulseDamping;
      }

      const impulseMagnitude = Math.abs(impulse);
      if (impulseMagnitude > 0.5) {
        this.sleeping = false;
        other.sleeping = false;
        this.sleepFrames = 0;
        other.sleepFrames = 0;

        if (impulseMagnitude > 1) {
          const boostFactor = 1.2;
          this.vx *= boostFactor;
          this.vy *= boostFactor;
          other.vx *= boostFactor;
          other.vy *= boostFactor;
        }
      }
    }
  }

  update(
    width: number,
    height: number,
    gravityX: number,
    gravityY: number,
    shake: number = 0
  ) {
    if (shake > 0) {
      this.sleeping = false;
      this.vx += (Math.random() - 0.5) * shake * 8;
      this.vy += (Math.random() - 0.5) * shake * 8;
    }

    if (this.sleeping) {
      const gravityMagnitude = Math.sqrt(
        gravityX * gravityX + gravityY * gravityY
      );
      const defaultGravityMagnitude = 0.4;

      if (
        Math.abs(gravityX) > 0.2 ||
        Math.abs(gravityMagnitude - defaultGravityMagnitude) > 0.2 ||
        shake > 1
      ) {
        this.sleeping = false;
        this.sleepFrames = 0;
      } else {
        this.vx = 0;
        this.vy = 0;
        return;
      }
    }

    const prevX = this.x;
    const prevY = this.y;

    if (!this.sleeping) {
      this.vx += gravityX * this.gravityScale;
      this.vy += gravityY * this.gravityScale;
    }

    this.vx *= this.airResistance;
    this.vy *= this.airResistance;

    if (Math.abs(this.vx) < 0.01) this.vx = 0;
    if (Math.abs(this.vy) < 0.01) this.vy = 0;

    this.x += this.vx;
    this.y += this.vy;

    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    this.rotationSpeed = (this.vx / this.radius) * 0.5;
    this.rotation += this.rotationSpeed;
    this.rotationSpeed *= 0.98;

    let bounced = false;

    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = -this.vx * this.restitution;
      this.rotationSpeed = -this.rotationSpeed * 0.7;
      bounced = true;
    } else if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.vx = -this.vx * this.restitution;
      this.rotationSpeed = -this.rotationSpeed * 0.7;
      bounced = true;
    }

    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy = -this.vy * this.restitution;
      this.rotationSpeed += this.vx * 0.1;
      bounced = true;
    } else if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.vy = -this.vy * this.restitution;
      this.vx *= this.friction;
      this.rotationSpeed = -Math.abs(this.vy) * 0.2;
      bounced = true;
    }

    const totalVelocity = Math.abs(this.vx) + Math.abs(this.vy);
    const positionChange = Math.abs(this.x - prevX) + Math.abs(this.y - prevY);

    if (
      totalVelocity < this.sleepThreshold &&
      positionChange < 0.05 &&
      !bounced
    ) {
      this.sleepFrames++;

      if (this.sleepFrames > 30) {
        this.sleeping = true;
        this.vx = 0;
        this.vy = 0;
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
      }
    } else {
      this.sleepFrames = 0;
    }

    // Update sprite position
    this.sprite.position.set(this.x, this.y);
    this.sprite.rotation = this.rotation;
  }
}

interface TennisHeroProps {
  onCTAClick: () => void;
  showUrgency?: boolean;
}

export default function TennisHero({
  onCTAClick,
  showUrgency,
}: TennisHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const ballContainerRef = useRef<PIXI.Container | null>(null);
  const spatialGridRef = useRef<SpatialGrid | null>(null);
  const dragVisualsRef = useRef<PIXI.Graphics | null>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const tennisBallButtonRef = useRef<HTMLButtonElement>(null);
  const ballsRef = useRef<InteractiveTennisBall[]>([]);
  const ballPoolRef = useRef<BallPool | null>(null);
  const [isPhysicsActive, setIsPhysicsActive] = useState(false);
  const [motionPermission, setMotionPermission] = useState<string>("unknown");
  const [showMotionPrompt, setShowMotionPrompt] = useState(false);
  const deviceOrientationRef = useRef<{
    alpha: number;
    beta: number;
    gamma: number;
  }>({ alpha: 0, beta: 0, gamma: 0 });
  const lastShakeTime = useRef<number>(0);
  const shakeIntensity = useRef<number>(0);
  const accelerationHistory = useRef<number[]>([]);
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevGravityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0.4 });
  const [ballCount, setBallCount] = useState(0);
  const [totalBallsThrown, setTotalBallsThrown] = useState<number | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const pendingThrows = useRef<number>(0);
  const analyticsQueue = useRef<
    Array<{ statType: string; count: number; sessionId: string }>
  >([]);
  const analyticsTimer = useRef<NodeJS.Timeout | null>(null);
  const sessionId = useRef<string>(sessionManager.getSessionId());
  
  // Drag-to-aim state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null);
  
  // Track if it's a click or drag
  const dragThresholdRef = useRef<boolean>(false);
  const clickStartTimeRef = useRef<number>(0);

  // Fetch total ball count from database
  const fetchBallStats = useCallback(async () => {
    try {
      const response = await fetch("/api/track-stats?statType=balls_thrown");
      if (response.ok) {
        const data = await response.json();
        setTotalBallsThrown(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching ball stats:", error);
      setTotalBallsThrown(1337);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Send analytics in batch
  const sendAnalyticsBatch = useCallback(async () => {
    if (analyticsQueue.current.length === 0) return;

    const events = [...analyticsQueue.current];
    analyticsQueue.current = [];

    try {
      await fetch("/api/track-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error("Error sending analytics:", error);
      analyticsQueue.current = [...events, ...analyticsQueue.current];
    }
  }, []);

  // Track ball throws with batching
  const trackBallThrows = useCallback(
    (count: number) => {
      setTotalBallsThrown((prev) => (prev || 0) + count);
      pendingThrows.current += count;

      analyticsQueue.current.push({
        statType: "balls_thrown",
        count,
        sessionId: sessionId.current,
      });

      if (analyticsTimer.current) {
        clearTimeout(analyticsTimer.current);
      }

      analyticsTimer.current = setTimeout(() => {
        sendAnalyticsBatch();
      }, 500);
    },
    [sendAnalyticsBatch]
  );

  // Request device orientation permission
  const requestOrientationPermission = async () => {
    const needsOrientationPermission =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function";

    const needsMotionPermission =
      typeof DeviceMotionEvent !== "undefined" &&
      typeof (DeviceMotionEvent as any).requestPermission === "function";

    if (needsOrientationPermission || needsMotionPermission) {
      try {
        let orientationPermission = "granted";
        let motionPermissionResult = "granted";

        if (needsOrientationPermission) {
          orientationPermission = await (
            DeviceOrientationEvent as any
          ).requestPermission();
        }

        if (needsMotionPermission) {
          try {
            motionPermissionResult = await (
              DeviceMotionEvent as any
            ).requestPermission();
          } catch (error) {
            console.log("Motion permission error:", error);
          }
        }

        const finalPermission =
          orientationPermission === "granted" &&
          motionPermissionResult === "granted"
            ? "granted"
            : "denied";
        setMotionPermission(finalPermission);
        setShowMotionPrompt(false);

        if (finalPermission === "granted") {
          setIsPhysicsActive(true);
          window.removeEventListener(
            "deviceorientation",
            handleDeviceOrientation
          );
          window.removeEventListener("devicemotion", handleDeviceMotion);
          window.addEventListener("deviceorientation", handleDeviceOrientation);
          window.addEventListener("devicemotion", handleDeviceMotion);
        }

        return finalPermission === "granted";
      } catch (error) {
        console.log("Permission request error:", error);
        setShowMotionPrompt(false);
        setMotionPermission("denied");
        return false;
      }
    } else {
      setMotionPermission("granted");
      setIsPhysicsActive(true);
      return true;
    }
  };

  // Define event handlers
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
      deviceOrientationRef.current = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      };
    }
  };

  const handleDeviceMotion = (event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    if (
      acceleration &&
      acceleration.x !== null &&
      acceleration.y !== null &&
      acceleration.z !== null
    ) {
      const x = acceleration.x;
      const y = acceleration.y;
      const z = acceleration.z;

      const deltaX = Math.abs(x - lastAcceleration.current.x);
      const deltaY = Math.abs(y - lastAcceleration.current.y);
      const deltaZ = Math.abs(z - lastAcceleration.current.z);
      const totalDelta = deltaX + deltaY + deltaZ;

      accelerationHistory.current.push(totalDelta);
      if (accelerationHistory.current.length > 10) {
        accelerationHistory.current.shift();
      }

      const avgAcceleration =
        accelerationHistory.current.reduce((a, b) => a + b, 0) /
        accelerationHistory.current.length;

      if (totalDelta > 1.5 || avgAcceleration > 1) {
        handleShake(totalDelta);
      }

      lastAcceleration.current = { x, y, z };
    }
  };

  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Enhanced shake detection
  const handleShake = useCallback(
    (intensity: number) => {
      const now = Date.now();
      if (now - lastShakeTime.current < 200) return;
      lastShakeTime.current = now;

      if (!appRef.current || !ballsRef.current) return;

      if (intensity > 2 && Math.random() > 0.3) {

        const canvasRect = containerRef.current?.getBoundingClientRect();
        const ctaRect = ctaButtonRef.current?.getBoundingClientRect();
        const spawnX = ctaRect && canvasRect
          ? (ctaRect.left + ctaRect.width / 2 - canvasRect.left)
          : appRef.current.screen.width / 2;
        const spawnY = ctaRect && canvasRect
          ? (ctaRect.top - canvasRect.top - 50)
          : appRef.current.screen.height * 0.5;

        const ball = ballPoolRef.current!.acquire(
          spawnX + (Math.random() - 0.5) * 60,
          spawnY
        );
        
        const direction = Math.random() < 0.5 ? -1 : 1;
        const curveFactor = 3 + Math.random() * 5;
        ball.vx =
          direction * (12 + Math.random() * 8) +
          curveFactor * (Math.random() < 0.5 ? -1 : 1);
        ball.vy = -15 - Math.random() * 8;
        
        ballsRef.current.push(ball);
        setBallCount(ballsRef.current.length);
        trackBallThrows(1);
      }

      shakeIntensity.current = Math.min(intensity / 2, 20);
    },
    [trackBallThrows]
  );

  // Function to spawn celebration balls
  const spawnCelebrationBalls = useCallback(
    (count: number = 20) => {
      if (!appRef.current || !isPhysicsActive || !ballPoolRef.current) return;

      const ballsToAdd = count;

      const centerX = appRef.current.screen.width / 2;
      const centerY = appRef.current.screen.height / 2;

      for (let i = 0; i < ballsToAdd; i++) {
        const ball = ballPoolRef.current.acquire(
          centerX + (Math.random() - 0.5) * 40,
          centerY
        );

        const angle = (Math.PI * 2 * i) / ballsToAdd + Math.random() * 0.3;
        const speed = 15 + Math.random() * 10;
        const curveFactor = 2 + Math.random() * 6;
        
        ball.vx = Math.cos(angle) * speed + curveFactor * (Math.random() < 0.5 ? -1 : 1);
        ball.vy = Math.sin(angle) * speed - 5;

        ballsRef.current.push(ball);
      }

      setBallCount(ballsRef.current.length);
      trackBallThrows(ballsToAdd);
    },
    [isPhysicsActive, trackBallThrows]
  );

  // Subscribe to tennis ball events
  useEffect(() => {
    const unsubscribe = tennisBallEvents.subscribe((count) => {
      if (!isPhysicsActive) {
        setIsPhysicsActive(true);
        setTimeout(() => spawnCelebrationBalls(count), 100);
      } else {
        spawnCelebrationBalls(count);
      }
    });

    return unsubscribe;
  }, [isPhysicsActive, spawnCelebrationBalls]);

  // Fetch ball stats on mount
  useEffect(() => {
    fetchBallStats();
  }, [fetchBallStats]);

  // Setup device orientation and motion detection
  useEffect(() => {
    const checkAndSetupMotion = () => {
      const needsPermission =
        (typeof DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as any).requestPermission === "function") ||
        (typeof DeviceMotionEvent !== "undefined" &&
          typeof (DeviceMotionEvent as any).requestPermission === "function");

      if (needsPermission) {
        if (motionPermission === "granted") {
          window.addEventListener("deviceorientation", handleDeviceOrientation);
          window.addEventListener("devicemotion", handleDeviceMotion);
          setIsPhysicsActive(true);
        }
      } else {
        window.addEventListener("deviceorientation", handleDeviceOrientation);
        window.addEventListener("devicemotion", handleDeviceMotion);
        setIsPhysicsActive(true);
        setMotionPermission("granted");
      }
    };

    checkAndSetupMotion();
    const timeoutId = setTimeout(checkAndSetupMotion, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [motionPermission]);

  // Get position from mouse or touch event
  const getEventPosition = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): { x: number; y: number } => {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if ('clientX' in e) {
      return { x: e.clientX, y: e.clientY };
    }
    return { x: 0, y: 0 };
  };

  // Handle drag start on the button
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getEventPosition(e);
    setDragStart(pos);
    setDragCurrent(pos);
    dragThresholdRef.current = false;
    clickStartTimeRef.current = Date.now();
  };

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragStart) return;
    e.preventDefault();
    const pos = getEventPosition(e);
    
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 10 && !isDragging) {
      setIsDragging(true);
      dragThresholdRef.current = true;
    }
    
    if (isDragging) {
      setDragCurrent(pos);
    }
  }, [isDragging, dragStart]);

  // Handle drag end
  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    
    const timeSinceStart = Date.now() - clickStartTimeRef.current;
    if (!dragThresholdRef.current && timeSinceStart < 300 && dragStart) {
      // This is a click - spawn random ball
      if (motionPermission !== "granted") {
        requestOrientationPermission();
      }

      if (!isPhysicsActive) {
        setIsPhysicsActive(true);
      }

      if (appRef.current && ballPoolRef.current) {
        const ballsToAdd = 10;

        const canvasRect = containerRef.current?.getBoundingClientRect();
        const ctaRect = ctaButtonRef.current?.getBoundingClientRect();
        const spawnX = ctaRect && canvasRect
          ? (ctaRect.left + ctaRect.width / 2 - canvasRect.left)
          : appRef.current.screen.width / 2;
        const spawnY = ctaRect && canvasRect
          ? (ctaRect.top - canvasRect.top - 50)
          : appRef.current.screen.height * 0.5;

        for (let i = 0; i < ballsToAdd; i++) {
          const ball = ballPoolRef.current.acquire(
            spawnX + (Math.random() - 0.5) * 40,
            spawnY + (Math.random() - 0.5) * 20
          );
          
          const angle = (Math.PI * 2 * i) / ballsToAdd + (Math.random() - 0.5) * 0.5;
          const speed = 15 + Math.random() * 10;
          ball.vx = Math.cos(angle) * speed;
          ball.vy = Math.sin(angle) * speed - 10;
          
          ballsRef.current.push(ball);
        }
        setBallCount(ballsRef.current.length);
        trackBallThrows(ballsToAdd);
      }
    } else if (isDragging && dragStart && dragCurrent) {
      // This is a drag - use drag-to-aim behavior
      const dx = dragCurrent.x - dragStart.x;
      const dy = dragCurrent.y - dragStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 20) {
        if (motionPermission !== "granted") {
          requestOrientationPermission();
        }

        if (!isPhysicsActive) {
          setIsPhysicsActive(true);
        }

        if (appRef.current && ballPoolRef.current) {
          const ballsToAdd = 10;

          const canvasRect = containerRef.current?.getBoundingClientRect();
          if (!canvasRect) return;
          const spawnX = (dragStart.x - canvasRect.left);
          const spawnY = (dragStart.y - canvasRect.top);

          const maxDistance = 200;
          const power = Math.min(distance / maxDistance, 1);
          const baseAngle = Math.atan2(-dy, -dx);
          const minSpeed = 10;
          const maxSpeed = 25;
          const speed = minSpeed + (maxSpeed - minSpeed) * power;
          
          for (let i = 0; i < ballsToAdd; i++) {
            const ball = ballPoolRef.current.acquire(
              spawnX + (Math.random() - 0.5) * 20,
              spawnY + (Math.random() - 0.5) * 20
            );
            
            const spreadAngle = (Math.random() - 0.5) * 0.5; // Spread the balls
            const angle = baseAngle + spreadAngle;
            
            ball.vx = Math.cos(angle) * speed;
            ball.vy = Math.sin(angle) * speed;
            
            const curveFactor = 2 + Math.random() * 4;
            ball.vx += curveFactor * (Math.random() < 0.5 ? -1 : 1);
            
            ballsRef.current.push(ball);
          }
          setBallCount(ballsRef.current.length);
          trackBallThrows(ballsToAdd);
        }
      }
    }
    
    setIsDragging(false);
    setDragStart(null);
    setDragCurrent(null);
    dragThresholdRef.current = false;
  }, [isDragging, dragStart, dragCurrent, motionPermission, isPhysicsActive, trackBallThrows, requestOrientationPermission]);

  // Setup global drag event listeners
  useEffect(() => {
    if (dragStart) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove, { passive: false });
      window.addEventListener('touchend', handleDragEnd, { passive: false });
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [dragStart, handleDragMove, handleDragEnd]);

  // Draw drag visualization
  useEffect(() => {
    if (!isDragging || !dragStart || !dragCurrent || !dragVisualsRef.current) return;
    
    const graphics = dragVisualsRef.current;
    graphics.clear();
    
    const canvasRect = containerRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const startX = dragStart.x - canvasRect.left;
    const startY = dragStart.y - canvasRect.top;
    const currentX = dragCurrent.x - canvasRect.left;
    const currentY = dragCurrent.y - canvasRect.top;
    
    const dx = currentX - startX;
    const dy = currentY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      // Draw ball spawn indicator
      graphics.beginFill(0xCFFF00, 0.3);
      graphics.drawCircle(startX, startY, 15);
      graphics.endFill();
      
      // Draw aim line
      graphics.lineStyle(3, 0xCFFF00, 0.8);
      graphics.moveTo(startX, startY);
      graphics.lineTo(startX - dx * 2, startY - dy * 2);
      
      // Draw trajectory preview
      const trajectorySteps = 10;
      const angle = Math.atan2(-dy, -dx);
      const maxDistance = 200;
      const power = Math.min(distance / maxDistance, 1);
      const speed = 10 + 15 * power;
      
      graphics.beginFill(0xCFFF00, 0.6);
      for (let i = 1; i <= trajectorySteps; i++) {
        const t = i / trajectorySteps;
        const x = startX + Math.cos(angle) * speed * t * 20;
        const y = startY + Math.sin(angle) * speed * t * 20 + (t * t * 100);
        const radius = 5 - t * 3;
        if (radius > 0) {
          graphics.drawCircle(x, y, radius);
        }
      }
      graphics.endFill();
      
      // Draw power indicator
      const powerColor = new PIXI.Color([
        1 - power * 0.5,
        1,
        0
      ]).toHex();
      
      graphics.lineStyle(2, powerColor);
      const arcRadius = 20 + power * 30;
      graphics.arc(startX, startY, arcRadius, angle - 0.5, angle + 0.5);
      
      // Power text
      const text = new PIXI.Text(`${Math.round(power * 100)}%`, {
        fontSize: 16,
        fontWeight: 'bold',
        fill: powerColor,
      });
      text.position.set(startX + 10, startY - arcRadius - 25);
      graphics.addChild(text);
    }
  }, [isDragging, dragStart, dragCurrent]);

  // Initialize Pixi.js
  useEffect(() => {
    if (!isPhysicsActive || !containerRef.current) return;

    let app: PIXI.Application | null = null;

    const initApp = async () => {
      app = new PIXI.Application();
      
      await app.init({
        width: containerRef.current!.offsetWidth,
        height: containerRef.current!.offsetHeight,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      appRef.current = app;
      containerRef.current!.appendChild(app.canvas);

    // Create optimized container for balls
    const ballContainer = new PIXI.Container();
    ballContainer.sortableChildren = false; // Disable sorting for performance
    ballContainerRef.current = ballContainer;
    app.stage.addChild(ballContainer);
    
    // Initialize spatial grid for collision optimization  
    spatialGridRef.current = new SpatialGrid(app.screen.width, app.screen.height);

    // Create graphics layer for drag visuals
    const dragVisuals = new PIXI.Graphics();
    dragVisualsRef.current = dragVisuals;
    app.stage.addChild(dragVisuals);

    // Initialize ball pool
    ballPoolRef.current = new BallPool(ballContainer);

    // Load textures and initialize
    InteractiveTennisBall.loadTextures(app).then(() => {
      // Initialize balls
      const initialBallCount = Math.min(20, Math.floor(app.screen.width / 40));
      for (let i = 0; i < initialBallCount; i++) {
        const spawnY = app.screen.height * 0.5;
        const ball = ballPoolRef.current!.acquire(
          app.screen.width / 2 + (Math.random() - 0.5) * 60,
          spawnY
        );
        
        const direction = Math.random() < 0.5 ? -1 : 1;
        const curveFactor = 3 + Math.random() * 5;
        ball.vx = direction * (12 + Math.random() * 8) + curveFactor * (Math.random() < 0.5 ? -1 : 1);
        ball.vy = -15 - Math.random() * 8;
        ballsRef.current.push(ball);
      }
      setBallCount(ballsRef.current.length);
    });

    // Handle canvas interactions
    const canvas = app.canvas;
    
    const getCanvasPos = (event: MouseEvent | TouchEvent): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0]?.clientX || 0 : event.clientX;
      const clientY = 'touches' in event ? event.touches[0]?.clientY || 0 : event.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const pos = getCanvasPos(event);
      mousePos.current = pos;

      const explosionRadius = 120;
      let ballsAffected = 0;

      for (const ball of ballsRef.current) {
        const dx = ball.x - pos.x;
        const dy = ball.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < explosionRadius) {
          ballsAffected++;
          ball.sleeping = false;
          ball.sleepFrames = 0;

          const angle = Math.atan2(dy, dx);
          const maxForce = 20;
          const forceMultiplier = Math.max(0.3, 1 - distance / explosionRadius);
          const force = maxForce * forceMultiplier;

          ball.vx += Math.cos(angle) * force;
          ball.vy += Math.sin(angle) * force;
          ball.vx += (Math.random() - 0.5) * 3;
          ball.vy += (Math.random() - 0.5) * 3;
        }
      }

      if (ballsAffected > 0) {
        event.preventDefault();
      }
    };

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const pos = getCanvasPos(event);
      mousePos.current = pos;
      canvas.style.cursor = "crosshair";
    };

    const handlePointerUp = () => {
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("mouseup", handlePointerUp);
    canvas.addEventListener("mouseleave", handlePointerUp);
    canvas.addEventListener("touchstart", handlePointerDown, { passive: false });
    canvas.addEventListener("touchmove", handlePointerMove, { passive: false });
    canvas.addEventListener("touchend", handlePointerUp, { passive: false });

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        app.renderer.resize(width, height);
        
        // Update spatial grid dimensions
        if (spatialGridRef.current) {
          spatialGridRef.current = new SpatialGrid(width, height);
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", handleResize);

    // Animation loop
    app.ticker.add(() => {
      const hasActiveBalls = ballsRef.current.some(
        (ball) => !ball.sleeping || Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1
      );

      if (!hasActiveBalls && shakeIntensity.current < 0.1) {
        return;
      }

      // Calculate gravity
      const { alpha, beta, gamma } = deviceOrientationRef.current;
      const betaRad = ((beta || 0) * Math.PI) / 180;
      const gammaRad = ((gamma || 0) * Math.PI) / 180;
      const gravityMagnitude = 0.4;

      let gravityX = 0;
      let gravityY = gravityMagnitude;

      if (Math.abs(beta) < 30) {
        gravityX = Math.sin(gammaRad) * gravityMagnitude * 0.5;
        gravityY = gravityMagnitude * 0.8;
      } else {
        const verticalness = Math.min(Math.abs(beta) / 90, 1);
        const baseGravityY = Math.sign(90 - Math.abs(beta)) * Math.cos(betaRad) * gravityMagnitude;

        if (verticalness > 0.7) {
          if (Math.abs(gamma) > 60) {
            const landscapeAmount = Math.min(Math.abs(gamma) / 90, 1);
            gravityX = -Math.sign(gamma) * gravityMagnitude * landscapeAmount;
            gravityY = baseGravityY * (1 - landscapeAmount);
          } else {
            gravityX = Math.sin(gammaRad) * gravityMagnitude * 0.5;
            gravityY = baseGravityY;
          }
        } else {
          gravityX = Math.sin(gammaRad) * gravityMagnitude * verticalness * 0.6;
          gravityY = baseGravityY;
        }
      }

      const smoothingFactor = 0.15;
      gravityX = prevGravityRef.current.x + (gravityX - prevGravityRef.current.x) * smoothingFactor;
      gravityY = prevGravityRef.current.y + (gravityY - prevGravityRef.current.y) * smoothingFactor;
      prevGravityRef.current = { x: gravityX, y: gravityY };

      // Get CTA button rect for collisions
      let ctaRect = undefined;
      if (ctaButtonRef.current && containerRef.current) {
        const buttonRect = ctaButtonRef.current.getBoundingClientRect();
        const canvasRect = containerRef.current.getBoundingClientRect();
        ctaRect = {
          x: buttonRect.left - canvasRect.left,
          y: buttonRect.top - canvasRect.top,
          width: buttonRect.width,
          height: buttonRect.height,
        };

        ballsRef.current.forEach((ball) => {
          ball.checkCTACollision(ctaRect!);
        });
      }

      // Use spatial grid for optimized collision detection
      if (spatialGridRef.current) {
        spatialGridRef.current.clear();
        
        // Insert all active balls into spatial grid
        ballsRef.current.forEach((ball) => {
          if (!ball.sleeping || Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1) {
            spatialGridRef.current!.insert(ball);
          }
        });
        
        // Check collisions only with nearby balls
        ballsRef.current.forEach((ball) => {
          if (!ball.sleeping) {
            const nearby = spatialGridRef.current!.getNearby(ball);
            nearby.forEach((otherBall) => {
              if (ball.x < otherBall.x) { // Avoid duplicate checks
                ball.checkCollisionWith(otherBall);
              }
            });
          }
        });
      }

      // Update balls
      ballsRef.current.forEach((ball) => {
        if (ball.sleeping && Math.random() < 0.001) {
          ball.sleeping = false;
          ball.sleepFrames = 0;
          ball.vx = (Math.random() - 0.5) * 1.5;
          ball.vy = (Math.random() - 0.5) * 1.5;
        }

        ball.update(
          app.screen.width,
          app.screen.height,
          gravityX,
          gravityY,
          shakeIntensity.current
        );
      });

      setBallCount(ballsRef.current.length);
      shakeIntensity.current *= 0.9;
    });

      // Store cleanup function for this app instance
      (app as any).cleanup = () => {
        window.removeEventListener("resize", handleResize);
        resizeObserver.disconnect();
        canvas.removeEventListener("mousedown", handlePointerDown);
        canvas.removeEventListener("mousemove", handlePointerMove);
        canvas.removeEventListener("mouseup", handlePointerUp);
        canvas.removeEventListener("mouseleave", handlePointerUp);
        canvas.removeEventListener("touchstart", handlePointerDown);
        canvas.removeEventListener("touchmove", handlePointerMove);
        canvas.removeEventListener("touchend", handlePointerUp);
      };
    };

    initApp();

    return () => {
      if (appRef.current) {
        if ((appRef.current as any).cleanup) {
          (appRef.current as any).cleanup();
        }
        appRef.current.destroy(true);
      }
    };
  }, [isPhysicsActive]);

  return (
    <div className={styles.tennisHero}>
      {/* Pixi.js Container */}
      <div 
        ref={containerRef} 
        className={styles.physicsScene}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Court Lines Background */}
      <div className={styles.courtLines}>
        <div className={styles.baseline} />
        <div className={styles.serviceLine} />
        <div className={styles.centerLine} />
        <div className={styles.netPost} />
      </div>

      {/* Content Container */}
      <div className={styles.contentContainer}>
        {/* Main Title with Animation */}
        <h1 className={styles.heroTitle}>
          <span className={styles.titleLine1}>
            <Translate id="homepage.hero.title1">Entrena como</Translate>
          </span>
          <span className={styles.titleLine2}>
            <Translate id="homepage.hero.title2">los #1 del mundo</Translate>
          </span>
        </h1>

        {/* Visual Stats */}
        <div className={styles.visualStats}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>🏆</div>
            <span className={styles.statText}>
              <Translate id="homepage.hero.stat1">Métodos ATP</Translate>
            </span>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>📊</div>
            <span className={styles.statText}>
              Respaldo <br /> científico
            </span>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>🎯</div>
            <span className={styles.statText}>
              <Translate id="homepage.hero.stat3">Personalizado</Translate>
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          ref={ctaButtonRef}
          onClick={onCTAClick}
          className={styles.ctaButton}
          aria-label="DESCARGAR RUTINA GRATIS"
        >
          <span className={styles.ctaText}>
            <Translate id="homepage.hero.cta">DESCARGAR RUTINA</Translate>
          </span>
          <div className={styles.ctaIcon}>⚡</div>
        </button>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          <Translate id="homepage.hero.subtitle">
            Hace click en la pelota, agita el dispositivo e inclínalo para jugar
            a la pelota
          </Translate>
        </p>

        <button
          ref={tennisBallButtonRef}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className={styles.addBallsButton}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none'
          }}
          title={
            isDragging 
              ? "Arrastra para apuntar y suelta para lanzar"
              : motionPermission === "granted"
                ? "Clic o arrastra para lanzar pelotas (Movimiento activado 📱)"
                : "Clic o arrastra para lanzar pelotas"
          }
        >
          🎾 {motionPermission !== "granted" && "📱"}
        </button>
        
        {/* Social Proof */}
        <div className={styles.socialProof}>
          <div className={styles.activityText}>
            {isLoadingStats ? (
              <span>Cargando...</span>
            ) : (
              <span>
                🎾 {totalBallsThrown?.toLocaleString() || "0"} pelotas lanzadas
              </span>
            )}
            {/* Trust Indicators */}
            <div className={styles.trustIndicators}>
              <span className={styles.trustItem}>
                ✅{" "}
                <Translate id="homepage.hero.trust1">
                  Sin tarjetas de crédito
                </Translate>
              </span>
              <span className={styles.trustItem}>
                ✅{" "}
                <Translate id="homepage.hero.trust2">
                  Acceso inmediato por email
                </Translate>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}