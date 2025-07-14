import React, { useEffect, useRef, useState, useCallback } from "react";
import Translate from "@docusaurus/Translate";
import clsx from "clsx";
import styles from "./TennisHero.module.css";
import { sessionManager } from "../../utils/session";
import { tennisBallEvents } from "../../utils/tennis-ball-events";
import * as PIXI from "pixi.js";
import Matter from "matter-js";

// Tennis ball class that syncs Matter.js physics with Pixi.js rendering
class TennisBall {
  body: Matter.Body;
  sprite: PIXI.Sprite;
  radius: number = 15;
  static ballTexture: PIXI.Texture | null = null;
  static fallbackTexture: PIXI.Texture | null = null;

  constructor(
    x: number,
    y: number,
    world: Matter.World,
    container: PIXI.Container
  ) {
    // Create Matter.js physics body
    this.body = Matter.Bodies.circle(x, y, this.radius, {
      restitution: 0.75, // More bouncy for fun
      friction: 0.3, // Less friction for more sliding
      frictionAir: 0.005, // Less air resistance for faster movement
      density: 0.001, // Slightly heavier for better momentum
      label: "tennisBall",
      sleepThreshold: 60, // Allow balls to sleep when velocity is low
      slop: 0.05, // Small position correction tolerance
    });

    Matter.World.add(world, this.body);

    // Create Pixi.js sprite
    this.sprite = new PIXI.Sprite(
      TennisBall.ballTexture || TennisBall.fallbackTexture!
    );
    this.sprite.anchor.set(0.5);
    this.sprite.width = this.radius * 2;
    this.sprite.height = this.radius * 2;
    container.addChild(this.sprite);

    this.updateSprite();
  }

  updateSprite() {
    this.sprite.position.set(this.body.position.x, this.body.position.y);
    this.sprite.rotation = this.body.angle;
  }

  static async loadTextures(app: PIXI.Application) {
    // Try to load the logo image
    try {
      TennisBall.ballTexture = await PIXI.Assets.load("/img/logo.png");
    } catch (e) {
      console.log("Logo not found, using fallback tennis ball");
    }

    // Create fallback tennis ball texture
    if (!TennisBall.ballTexture) {
      const graphics = new PIXI.Graphics();
      const radius = 30;

      // Main ball
      graphics.beginFill(0xcfff00);
      graphics.drawCircle(radius, radius, radius);
      graphics.endFill();

      // Tennis ball seam
      graphics.lineStyle(2, 0xffffff, 0.8);
      graphics.arc(radius, radius, radius * 0.8, 0, Math.PI);
      graphics.arc(radius, radius, radius * 0.8, Math.PI, Math.PI * 2);

      // Highlight
      graphics.beginFill(0xffffff, 0.3);
      graphics.drawCircle(radius * 0.75, radius * 0.75, radius * 0.25);
      graphics.endFill();

      TennisBall.fallbackTexture = app.renderer.generateTexture(graphics);
      graphics.destroy();
    }
  }

  destroy(world: Matter.World) {
    Matter.World.remove(world, this.body);
    this.sprite.destroy();
  }
}

export default function TennisHero() {
  // DOM refs
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballContainerRef = useRef<PIXI.Container | null>(null);
  const dragVisualsRef = useRef<PIXI.Graphics | null>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const tennisBallButtonRef = useRef<HTMLButtonElement>(null);
  const ballsRef = useRef<TennisBall[]>([]);

  // State
  const [isPhysicsActive, setIsPhysicsActive] = useState(false);
  const [motionPermission, setMotionPermission] = useState<string>("unknown");
  const deviceOrientationRef = useRef<{
    alpha: number;
    beta: number;
    gamma: number;
  }>({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  
  // Smoothed orientation values for stable physics
  const smoothedOrientationRef = useRef<{
    beta: number;
    gamma: number;
  }>({
    beta: 0,
    gamma: 0,
  });
  const [ballCount, setBallCount] = useState(0);
  const [totalBallsThrown, setTotalBallsThrown] = useState<number | null>(null);
  const [fps, setFps] = useState(0);
  const [showFps, setShowFps] = useState(false);
  
  // Shake detection refs
  const lastShakeTime = useRef<number>(0);
  const accelerationHistory = useRef<number[]>([]);
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragCurrent, setDragCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const dragThresholdRef = useRef<boolean>(false);
  const clickStartTimeRef = useRef<number>(0);

  // Matter.js walls
  const wallsRef = useRef<Matter.Body[]>([]);

  // Track ball throws
  const trackBallThrows = useCallback((count: number) => {
    // Update the session manager
    sessionManager.incrementBallsThrown(count);
    // Update the UI state
    setTotalBallsThrown(sessionManager.getTotalBallsThrown());
  }, []);

  // Fetch total ball count from database
  const fetchBallStats = useCallback(async () => {
    try {
      const total = sessionManager.getTotalBallsThrown();
      setTotalBallsThrown(total);
    } catch (error) {
      console.error("Failed to fetch ball stats:", error);
    }
  }, []);

  // Spawn tennis balls
  const spawnBalls = useCallback(
    (count: number, x: number, y: number, vx?: number, vy?: number) => {
      if (!engineRef.current || !ballContainerRef.current) return;

      for (let i = 0; i < count; i++) {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 20;

        const ball = new TennisBall(
          x + offsetX,
          y + offsetY,
          engineRef.current.world,
          ballContainerRef.current
        );

        if (vx !== undefined && vy !== undefined) {
          // Use provided velocity
          Matter.Body.setVelocity(ball.body, { x: vx, y: vy });
        } else {
          // Random spread pattern
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
          const speed = 15 + Math.random() * 20; // Faster initial speed
          Matter.Body.setVelocity(ball.body, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed - 10, // More upward velocity
          });
        }

        ballsRef.current.push(ball);
      }

      setBallCount(ballsRef.current.length);
      trackBallThrows(count);
    },
    [trackBallThrows]
  );

  // Shake handler
  const handleShake = useCallback((totalDelta: number) => {
    const currentTime = Date.now();
    if (currentTime - lastShakeTime.current > 1000) {
      lastShakeTime.current = currentTime;
      
      if (appRef.current && containerRef.current) {
        const canvasRect = containerRef.current.getBoundingClientRect();
        const ctaRect = ctaButtonRef.current?.getBoundingClientRect();
        const spawnX = ctaRect && canvasRect
          ? (ctaRect.left + ctaRect.width / 2 - canvasRect.left)
          : appRef.current.screen.width / 2;
        const spawnY = ctaRect && canvasRect
          ? (ctaRect.top - canvasRect.top - 50)
          : appRef.current.screen.height * 0.4;
          
        // Spawn more balls with higher shake intensity
        const intensity = Math.min(totalDelta / 5, 3);
        const ballCount = Math.floor(5 * intensity);
        spawnBalls(ballCount, spawnX, spawnY);
      }
    }
  }, [spawnBalls]);

  // Device motion handler for shake detection
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

  // Device orientation permission
  const requestOrientationPermission = async () => {
    try {
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const orientationPermission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        let motionPermissionResult = "denied";

        if (
          typeof (DeviceMotionEvent as any).requestPermission === "function"
        ) {
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

        if (finalPermission === "granted") {
          setIsPhysicsActive(true);
          window.addEventListener("deviceorientation", handleDeviceOrientation);
          window.addEventListener("devicemotion", handleDeviceMotion);
        }

        return finalPermission === "granted";
      }
    } catch (error) {
      console.log("Permission request error:", error);
      setMotionPermission("denied");
      return false;
    }
  };

  // Device orientation handler
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
      deviceOrientationRef.current = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      };
    }
  };

  // Initialize Pixi.js and Matter.js
  useEffect(() => {
    if (!containerRef.current) return;

    const initApp = async () => {
      try {
        const width = containerRef.current!.offsetWidth;
        const height = containerRef.current!.offsetHeight;

        // Initialize Pixi.js
        const app = new PIXI.Application();
        await app.init({
          width,
          height,
          backgroundColor: 0x000000,
          backgroundAlpha: 0,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });

        appRef.current = app;
        containerRef.current!.appendChild(app.canvas);

        // Initialize Matter.js
        const engine = Matter.Engine.create();
        engine.gravity.y = 1; // Stronger gravity for faster falling
        engine.gravity.scale = 0.001; // This is the default scale
        engine.enableSleeping = true; // Enable sleeping to improve performance
        engineRef.current = engine;

        // Create walls
        const walls = [
          // Bottom - positioned at the bottom edge of the canvas
          Matter.Bodies.rectangle(width / 2, height - 5, width, 20, {
            isStatic: true,
            restitution: 0.6, // More bounce from floor too
            friction: 0.5, // Medium friction
            label: "floor",
          }),
          // Left
          Matter.Bodies.rectangle(-50, height / 2, 100, height, {
            isStatic: true,
            restitution: 0.5,
            friction: 0.3,
          }),
          // Right
          Matter.Bodies.rectangle(width + 50, height / 2, 100, height, {
            isStatic: true,
            restitution: 0.5,
            friction: 0.3,
          }),
          // Removed top wall to let balls fly off the top
        ];

        Matter.World.add(engine.world, walls);
        wallsRef.current = walls;

        // Create containers
        const ballContainer = new PIXI.Container();
        ballContainerRef.current = ballContainer;
        app.stage.addChild(ballContainer);

        const dragVisuals = new PIXI.Graphics();
        dragVisualsRef.current = dragVisuals;
        app.stage.addChild(dragVisuals);

        // Load textures
        await TennisBall.loadTextures(app);
        
        // Spawn initial balls
        const initialBallCount = Math.min(20, Math.floor(width / 40));
        for (let i = 0; i < initialBallCount; i++) {
          const ctaRect = ctaButtonRef.current?.getBoundingClientRect();
          const canvasRect = containerRef.current?.getBoundingClientRect();
          const spawnX = ctaRect && canvasRect
            ? (ctaRect.left + ctaRect.width / 2 - canvasRect.left)
            : width / 2;
          const spawnY = ctaRect && canvasRect
            ? (ctaRect.top - canvasRect.top - 50)
            : height * 0.4;
            
          const ball = new TennisBall(
            spawnX + (Math.random() - 0.5) * 60,
            spawnY,
            engine.world,
            ballContainer
          );
          
          // Random initial velocity
          const angle = (Math.PI * 2 * i) / initialBallCount + (Math.random() - 0.5) * 0.5;
          const speed = 15 + Math.random() * 10;
          Matter.Body.setVelocity(ball.body, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed - 10
          });
          
          ballsRef.current.push(ball);
        }
        setBallCount(ballsRef.current.length);

        // Create CTA button collision body
        const updateCTABody = () => {
          if (ctaButtonRef.current && containerRef.current) {
            const buttonRect = ctaButtonRef.current.getBoundingClientRect();
            const canvasRect = containerRef.current.getBoundingClientRect();

            const ctaBody = Matter.Bodies.rectangle(
              buttonRect.left - canvasRect.left + buttonRect.width / 2,
              buttonRect.top - canvasRect.top + buttonRect.height / 2,
              buttonRect.width,
              buttonRect.height,
              {
                isStatic: true,
                restitution: 0.8,
                label: "ctaButton",
              }
            );

            Matter.World.add(engine.world, ctaBody);
          }
        };

        updateCTABody();

        // Physics loop
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        // FPS tracking
        let frameCount = 0;
        let lastTime = performance.now();

        // Render loop
        app.ticker.add(() => {
          // Update device orientation gravity with realistic physics
          const { beta, gamma } = deviceOrientationRef.current;
          
          // Phone orientation angles (in degrees):
          // beta: -180 to 180 (front-to-back tilt, positive = tilting back)
          // gamma: -90 to 90 (left-to-right tilt, positive = tilting right)
          
          // Apply deadzone to prevent tiny movements
          const deadzone = 5; // degrees
          const betaAdjusted = Math.abs(beta || 0) < deadzone ? 0 : (beta || 0);
          const gammaAdjusted = Math.abs(gamma || 0) < deadzone ? 0 : (gamma || 0);
          
          // Smoothing factor (0.1 = very smooth, 1 = no smoothing)
          const smoothingFactor = 0.15;
          smoothedOrientationRef.current.beta += 
            (betaAdjusted - smoothedOrientationRef.current.beta) * smoothingFactor;
          smoothedOrientationRef.current.gamma += 
            (gammaAdjusted - smoothedOrientationRef.current.gamma) * smoothingFactor;
          
          // Use smoothed values for physics
          const smoothBeta = smoothedOrientationRef.current.beta;
          const smoothGamma = smoothedOrientationRef.current.gamma;
          
          // Realistic gravity calculation
          // When phone tilts, gravity vector changes direction
          // Max tilt angle for full gravity effect (30 degrees is more realistic)
          const maxTiltAngle = 30;
          
          // Calculate gravity components based on tilt
          // Normalize to -1 to 1 range, then scale by gravity strength
          const tiltX = Math.max(-1, Math.min(1, smoothGamma / maxTiltAngle));
          const tiltY = Math.max(-1, Math.min(1, smoothBeta / maxTiltAngle));
          
          // Base gravity strength (9.8 m/s² in real world, scaled for our game)
          const baseGravity = 1;
          
          // Apply tilt to gravity vector
          // X-axis: side-to-side gravity from gamma (left/right tilt)
          // Use quadratic scaling for more natural feel at small angles
          const xEffect = Math.sign(tiltX) * Math.pow(Math.abs(tiltX), 1.5);
          engine.gravity.x = xEffect * baseGravity * 0.2; // Further reduced for stability
          
          // Y-axis: maintain strong downward gravity
          // Only slightly reduce when tilted forward, never increase beyond base
          const gravityReduction = tiltY < 0 ? Math.abs(tiltY) * 0.15 : 0;
          engine.gravity.y = baseGravity * (1 - gravityReduction);

          // Update ball sprites
          ballsRef.current.forEach((ball: TennisBall) => ball.updateSprite());

          // Calculate FPS
          frameCount++;
          const currentTime = performance.now();
          const deltaTime = currentTime - lastTime;

          if (deltaTime >= 1000) {
            const currentFps = Math.round((frameCount * 1000) / deltaTime);
            setFps(currentFps);
            frameCount = 0;
            lastTime = currentTime;
          }
        });

        // Handle resize
        const handleResize = () => {
          if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            const height = containerRef.current.offsetHeight;
            app.renderer.resize(width, height);

            // Update walls
            const newWalls = [
              Matter.Bodies.rectangle(width / 2, height - 5, width, 20, {
                isStatic: true,
                restitution: 0.4,
                friction: 0.8,
                label: "floor",
              }),
              Matter.Bodies.rectangle(-50, height / 2, 100, height, {
                isStatic: true,
                restitution: 0.5,
                friction: 0.3,
              }),
              Matter.Bodies.rectangle(width + 50, height / 2, 100, height, {
                isStatic: true,
                restitution: 0.5,
                friction: 0.3,
              }),
            ];

            wallsRef.current.forEach((wall: Matter.Body) =>
              Matter.World.remove(engine.world, wall)
            );
            Matter.World.add(engine.world, newWalls);
            wallsRef.current = newWalls;
          }
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
          window.removeEventListener("resize", handleResize);
          ballsRef.current.forEach((ball: TennisBall) =>
            ball.destroy(engine.world)
          );
          Matter.Engine.clear(engine);
          Matter.Runner.stop(runner);
          app.destroy(true, true);
        };
      } catch (error) {
        console.error("Failed to initialize tennis hero:", error);
      }
    };

    initApp();
  }, []);

  // Motion permission setup
  useEffect(() => {
    const checkAndSetupMotion = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        // iOS 13+ device
      } else {
        // Non-iOS or older device
        window.addEventListener("deviceorientation", handleDeviceOrientation);
        window.addEventListener("devicemotion", handleDeviceMotion);
        setIsPhysicsActive(true);
        setMotionPermission("granted");
      }
    };

    checkAndSetupMotion();

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, [motionPermission]);

  // Get position from mouse or touch event
  const getEventPosition = (
    e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent
  ): { x: number; y: number } => {
    if ("touches" in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if ("clientX" in e) {
      return { x: e.clientX, y: e.clientY };
    }
    return { x: 0, y: 0 };
  };

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getEventPosition(e);
    setDragStart(pos);
    setDragCurrent(pos);
    dragThresholdRef.current = false;
    clickStartTimeRef.current = Date.now();
  };

  // Handle drag move
  const handleDragMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
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
    },
    [isDragging, dragStart]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      const timeSinceStart = Date.now() - clickStartTimeRef.current;
      if (!dragThresholdRef.current && timeSinceStart < 300 && dragStart) {
        // Click - spawn 10 balls
        if (motionPermission !== "granted") {
          requestOrientationPermission();
        }

        if (!isPhysicsActive) {
          setIsPhysicsActive(true);
        }

        if (appRef.current && containerRef.current) {
          const canvasRect = containerRef.current.getBoundingClientRect();
          const ctaRect = ctaButtonRef.current?.getBoundingClientRect();
          const spawnX =
            ctaRect && canvasRect
              ? ctaRect.left + ctaRect.width / 2 - canvasRect.left
              : appRef.current.screen.width / 2;
          const spawnY =
            ctaRect && canvasRect
              ? ctaRect.top - canvasRect.top - 50
              : appRef.current.screen.height * 0.4;

          spawnBalls(5, spawnX, spawnY);
        }
      } else if (isDragging && dragStart && dragCurrent) {
        // Drag - aimed throw
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

          if (containerRef.current) {
            const canvasRect = containerRef.current.getBoundingClientRect();
            const spawnX = dragStart.x - canvasRect.left;
            const spawnY = dragStart.y - canvasRect.top;

            const maxDistance = 200;
            const power = Math.min(distance / maxDistance, 1);
            const angle = Math.atan2(-dy, -dx);
            const speed = 15 + 30 * power; // Faster drag throws

            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            spawnBalls(5, spawnX, spawnY, vx, vy);
          }
        }
      }

      setIsDragging(false);
      setDragStart(null);
      setDragCurrent(null);
      dragThresholdRef.current = false;
    },
    [
      isDragging,
      dragStart,
      dragCurrent,
      motionPermission,
      isPhysicsActive,
      spawnBalls,
    ]
  );

  // Setup global drag event listeners
  useEffect(() => {
    if (dragStart) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDragMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd, { passive: false });

      return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [dragStart, handleDragMove, handleDragEnd]);

  // Draw drag visualization
  useEffect(() => {
    if (!isDragging || !dragStart || !dragCurrent || !dragVisualsRef.current)
      return;

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
      graphics.beginFill(0xcfff00, 0.3);
      graphics.drawCircle(startX, startY, 15);
      graphics.endFill();

      // Draw aim line
      graphics.lineStyle(3, 0xcfff00, 0.8);
      graphics.moveTo(startX, startY);
      graphics.lineTo(startX - dx * 2, startY - dy * 2);

      // Draw power indicator
      const maxDistance = 200;
      const power = Math.min(distance / maxDistance, 1);
      const powerColor =
        power > 0.7 ? 0xff4444 : power > 0.4 ? 0xffaa00 : 0x44ff44;
      graphics.lineStyle(5, powerColor, 0.8);
      graphics.drawCircle(startX, startY, 25 + power * 25);

      // Draw trajectory preview
      graphics.lineStyle(2, 0xffffff, 0.5);
      const previewSteps = 20;
      const angle = Math.atan2(-dy, -dx);
      const speed = 10 + 20 * power;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      for (let i = 0; i < previewSteps; i++) {
        const t = i * 0.05;
        const px = startX + vx * t;
        const py = startY + vy * t + 0.5 * 980 * t * t * 0.01; // Gravity preview

        if (i === 0) {
          graphics.moveTo(px, py);
        } else {
          graphics.lineTo(px, py);
        }
      }
    }
  }, [isDragging, dragStart, dragCurrent]);

  // Subscribe to tennis ball events
  useEffect(() => {
    const unsubscribe = tennisBallEvents.subscribe((count) => {
      if (!isPhysicsActive) {
        setIsPhysicsActive(true);
        setTimeout(() => {
          if (appRef.current) {
            const centerX = appRef.current.screen.width / 2;
            const centerY = appRef.current.screen.height / 2;
            spawnBalls(count, centerX, centerY);
          }
        }, 100);
      } else if (appRef.current) {
        const centerX = appRef.current.screen.width / 2;
        const centerY = appRef.current.screen.height / 2;
        spawnBalls(count, centerX, centerY);
      }
    });

    return unsubscribe;
  }, [isPhysicsActive, spawnBalls]);

  // Fetch ball stats on mount
  useEffect(() => {
    fetchBallStats();
  }, [fetchBallStats]);

  // Toggle FPS with 'F' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        setShowFps((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className={styles.tennisHero}>
      {/* Interactive Physics Canvas Container */}
      <div ref={containerRef} className={styles.physicsScene} />

      {/* Drag visualization is handled by the dragVisualsRef Graphics object in PIXI */}

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
          onClick={() => (window.location.href = "/docs/intro")}
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
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
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
            {totalBallsThrown !== null ? (
              <span>
                🎾 {totalBallsThrown.toLocaleString()} pelotas lanzadas
              </span>
            ) : (
              <span>Cargando...</span>
            )}
          </div>
        </div>
      </div>

      {/* FPS Counter */}
      {showFps && (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            backgroundColor:
              fps > 50
                ? "rgba(0, 255, 0, 0.8)"
                : fps > 30
                ? "rgba(255, 255, 0, 0.8)"
                : "rgba(255, 0, 0, 0.8)",
            color: "black",
            padding: "5px 10px",
            borderRadius: "5px",
            fontFamily: "monospace",
            fontSize: "14px",
            fontWeight: "bold",
            zIndex: 10000,
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setShowFps(false)}
          title="Click to hide FPS counter"
        >
          FPS: {fps} | Balls: {ballCount}
        </div>
      )}
    </div>
  );
}
