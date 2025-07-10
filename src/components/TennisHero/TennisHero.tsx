import React, { useEffect, useRef, useState } from "react";
import Translate from "@docusaurus/Translate";
import clsx from "clsx";
import styles from "./TennisHero.module.css";

// Ultra-realistic physics ball class with collision and grabbing
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
  color: string;
  sleeping: boolean;
  sleepThreshold: number;
  isGrabbed: boolean;
  grabOffset: { x: number; y: number };
  lastMousePos: { x: number; y: number };
  grabStartTime: number;

  constructor(x: number, y: number, radius: number = 15) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = 15; // Fixed size for all balls
    this.mass = Math.PI * this.radius * this.radius; // Mass based on area
    this.restitution = 0.75; // Tennis ball bounciness
    this.friction = 0.95; // Rolling friction
    this.airResistance = 0.998; // Air resistance
    this.gravityScale = 1;
    this.color = "#CFFF00";
    this.sleeping = false;
    this.sleepThreshold = 0.1; // Velocity below which ball "sleeps"
    this.isGrabbed = false;
    this.grabOffset = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.grabStartTime = 0;
  }

  // Check if point is inside ball (for grabbing)
  containsPoint(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
  }

  // Start grabbing the ball
  startGrab(mouseX: number, mouseY: number) {
    this.isGrabbed = true;
    this.sleeping = false;
    this.grabOffset.x = mouseX - this.x;
    this.grabOffset.y = mouseY - this.y;
    this.lastMousePos.x = mouseX;
    this.lastMousePos.y = mouseY;
    this.grabStartTime = Date.now();
    // Reduce velocity when grabbed
    this.vx *= 0.5;
    this.vy *= 0.5;
  }

  // Update position while being dragged
  updateGrab(mouseX: number, mouseY: number) {
    if (!this.isGrabbed) return;

    // Calculate new position
    const newX = mouseX - this.grabOffset.x;
    const newY = mouseY - this.grabOffset.y;

    // Calculate velocity from mouse movement (for realistic throw effect)
    const dt = 16; // Assume 60fps
    this.vx = ((newX - this.x) / dt) * 0.8;
    this.vy = ((newY - this.y) / dt) * 0.8;

    this.x = newX;
    this.y = newY;

    this.lastMousePos.x = mouseX;
    this.lastMousePos.y = mouseY;
  }

  // Stop grabbing and apply throw velocity
  stopGrab() {
    if (!this.isGrabbed) return;

    this.isGrabbed = false;
    // Apply some momentum from the drag (realistic throw effect)
    const throwMultiplier = 0.3;
    this.vx *= throwMultiplier;
    this.vy *= throwMultiplier;
  }

  // Ball-to-CTA button collision detection and response
  checkCTACollision(buttonRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    // Find closest point on rectangle to circle center
    const closestX = Math.max(
      buttonRect.x,
      Math.min(this.x, buttonRect.x + buttonRect.width)
    );
    const closestY = Math.max(
      buttonRect.y,
      Math.min(this.y, buttonRect.y + buttonRect.height)
    );

    // Calculate distance from circle center to closest point
    const distanceX = this.x - closestX;
    const distanceY = this.y - closestY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < this.radius && !this.isGrabbed) {
      // Collision detected
      const overlap = this.radius - distance;

      // Calculate collision normal
      let normalX = distanceX / distance;
      let normalY = distanceY / distance;

      // Handle edge case when ball center is exactly on rectangle
      if (distance === 0) {
        // Push ball away from center of rectangle
        const centerX = buttonRect.x + buttonRect.width / 2;
        const centerY = buttonRect.y + buttonRect.height / 2;
        normalX = this.x - centerX;
        normalY = this.y - centerY;
        const length = Math.sqrt(normalX * normalX + normalY * normalY);
        normalX /= length;
        normalY /= length;
      }

      // Move ball out of collision
      this.x += normalX * overlap;
      this.y += normalY * overlap;

      // Reflect velocity with some energy loss and add some randomness
      const dotProduct = this.vx * normalX + this.vy * normalY;
      this.vx -= 2 * dotProduct * normalX * 0.8; // 0.8 for some energy loss
      this.vy -= 2 * dotProduct * normalY * 0.8;

      // Add slight random component for more interesting bounces
      this.vx += (Math.random() - 0.5) * 0.5;
      this.vy += (Math.random() - 0.5) * 0.5;

      this.sleeping = false;
      return true; // Collision occurred
    }
    return false; // No collision
  }

  // Ball-to-ball collision detection and response
  checkCollisionWith(other: InteractiveTennisBall) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = this.radius + other.radius;

    if (distance < minDistance && distance > 0) {
      // Collision detected - separate balls
      const overlap = minDistance - distance;
      const separationX = (dx / distance) * overlap * 0.5;
      const separationY = (dy / distance) * overlap * 0.5;

      // Only move if not grabbed
      if (!this.isGrabbed) {
        this.x -= separationX;
        this.y -= separationY;
      }
      if (!other.isGrabbed) {
        other.x += separationX;
        other.y += separationY;
      }

      // Calculate collision response (momentum transfer)
      const nx = dx / distance; // Normal vector
      const ny = dy / distance;

      // Relative velocity
      const rvx = other.vx - this.vx;
      const rvy = other.vy - this.vy;

      // Relative velocity in collision normal direction
      const speed = rvx * nx + rvy * ny;

      // Don't resolve if velocities are separating
      if (speed > 0) return;

      // Collision impulse with mass consideration
      const impulse = (2 * speed) / (this.mass + other.mass);
      const restitution = Math.min(this.restitution, other.restitution);

      // Apply impulse only if balls aren't grabbed
      if (!this.isGrabbed) {
        this.vx += impulse * other.mass * nx * restitution;
        this.vy += impulse * other.mass * ny * restitution;
        this.sleeping = false;
      }
      if (!other.isGrabbed) {
        other.vx -= impulse * this.mass * nx * restitution;
        other.vy -= impulse * this.mass * ny * restitution;
        other.sleeping = false;
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
    // Skip physics if being grabbed
    if (this.isGrabbed) return;

    // Wake up if shaken
    if (shake > 0) {
      this.sleeping = false;
      // Add random shake force
      this.vx += (Math.random() - 0.5) * shake * 2;
      this.vy += (Math.random() - 0.5) * shake * 2;
    }

    // Skip physics if ball is sleeping (like real balls at rest)
    if (this.sleeping) {
      const totalVelocity = Math.abs(this.vx) + Math.abs(this.vy);
      if (
        totalVelocity < this.sleepThreshold &&
        Math.abs(gravityX) < 0.1 &&
        Math.abs(gravityY) < 0.8
      ) {
        return;
      } else {
        this.sleeping = false;
      }
    }

    // Apply gravity based on real device orientation
    this.vx += gravityX * this.gravityScale * 0.8;
    this.vy += gravityY * this.gravityScale * 0.8;

    // Apply air resistance (more realistic)
    this.vx *= this.airResistance;
    this.vy *= this.airResistance;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Enhanced boundary collisions with realistic physics
    let bounced = false;

    // Left and right walls
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = -this.vx * this.restitution;
      bounced = true;
    } else if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.vx = -this.vx * this.restitution;
      bounced = true;
    }

    // Top and bottom walls
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy = -this.vy * this.restitution;
      bounced = true;
    } else if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.vy = -this.vy * this.restitution;
      // Ground friction when bouncing
      this.vx *= this.friction;
      bounced = true;
    }

    // Check if ball should go to sleep (like real physics)
    const totalVelocity = Math.abs(this.vx) + Math.abs(this.vy);
    if (totalVelocity < this.sleepThreshold && !bounced) {
      this.sleeping = true;
      this.vx *= 0.8;
      this.vy *= 0.8;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Tennis ball with realistic shadow and grab highlight
    const shadowOffset = this.isGrabbed ? 6 : 3;
    const shadowOpacity = this.isGrabbed ? 0.4 : 0.3;

    // Draw shadow
    ctx.globalAlpha = shadowOpacity;
    ctx.beginPath();
    ctx.ellipse(
      this.x + shadowOffset,
      this.y + shadowOffset,
      this.radius * 0.8,
      this.radius * 0.4,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#000000";
    ctx.fill();

    ctx.globalAlpha = 1;

    // Tennis ball gradient (brighter when grabbed)
    const brightness = this.isGrabbed ? 1.2 : 1;
    const gradient = ctx.createRadialGradient(
      this.x - this.radius / 3,
      this.y - this.radius / 3,
      0,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(
      0,
      `hsl(66, 100%, ${Math.min(85 * brightness, 100)}%)`
    );
    gradient.addColorStop(
      0.3,
      `hsl(66, 100%, ${Math.min(75 * brightness, 100)}%)`
    );
    gradient.addColorStop(
      0.7,
      `hsl(65, 95%, ${Math.min(65 * brightness, 100)}%)`
    );
    gradient.addColorStop(
      1,
      `hsl(64, 90%, ${Math.min(55 * brightness, 100)}%)`
    );

    // Draw ball with optional grab outline
    if (this.isGrabbed) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Tennis ball seam (more detailed)
    ctx.strokeStyle = this.isGrabbed
      ? "rgba(255, 255, 255, 1)"
      : "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.8, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Highlight for 3D effect (brighter when grabbed)
    ctx.beginPath();
    ctx.arc(
      this.x - this.radius / 4,
      this.y - this.radius / 4,
      this.radius / 4,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = this.isGrabbed
      ? "rgba(255, 255, 255, 0.5)"
      : "rgba(255, 255, 255, 0.3)";
    ctx.fill();
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const ballsRef = useRef<InteractiveTennisBall[]>([]);
  const animationRef = useRef<number>();
  const [isPhysicsActive, setIsPhysicsActive] = useState(false);
  const [motionPermission, setMotionPermission] = useState<string>("prompt");
  const [showMotionPrompt, setShowMotionPrompt] = useState(false);
  const deviceOrientationRef = useRef<{
    alpha: number;
    beta: number;
    gamma: number;
  }>({ alpha: 0, beta: 0, gamma: 0 });
  const lastShakeTime = useRef<number>(0);
  const shakeIntensity = useRef<number>(0);
  const accelerationHistory = useRef<number[]>([]);
  const grabbedBall = useRef<InteractiveTennisBall | null>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ballCount, setBallCount] = useState(0);

  // Request device orientation permission
  const requestOrientationPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        setMotionPermission(permission);
        setShowMotionPrompt(false);
        if (permission === "granted") {
          setIsPhysicsActive(true);
        }
        return permission === "granted";
      } catch (error) {
        console.log("Orientation permission error:", error);
        setShowMotionPrompt(false);
        return false;
      }
    } else {
      setIsPhysicsActive(true);
      return true;
    }
  };

  // Setup device orientation detection
  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
        deviceOrientationRef.current = {
          alpha: event.alpha, // compass direction
          beta: event.beta, // front-back tilt (-180 to 180)
          gamma: event.gamma, // left-right tilt (-90 to 90)
        };
      }
    };

    // Check if we need to request permission
    if (typeof DeviceOrientationEvent !== "undefined") {
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        // iOS 13+ needs permission
        if (motionPermission === "prompt") {
          setShowMotionPrompt(true);
        } else if (motionPermission === "granted") {
          window.addEventListener("deviceorientation", handleDeviceOrientation);
        }
      } else {
        // Android or older iOS
        window.addEventListener("deviceorientation", handleDeviceOrientation);
        setIsPhysicsActive(true);
      }
    } else {
      // Desktop - activate physics immediately
      setIsPhysicsActive(true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [motionPermission]);

  // Get mouse/touch position relative to canvas
  const getCanvasPos = (
    event: MouseEvent | TouchEvent
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX =
      "touches" in event ? event.touches[0]?.clientX || 0 : event.clientX;
    const clientY =
      "touches" in event ? event.touches[0]?.clientY || 0 : event.clientY;

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  // Initialize ultra-realistic physics simulation with interactivity
  useEffect(() => {
    if (!isPhysicsActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to full hero height
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = window.innerHeight; // Full viewport height
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize balls with realistic distribution - Many more balls!
    const initializeBalls = () => {
      ballsRef.current = [];
      const initialBallCount = Math.min(20, Math.floor(canvas.width / 40)); // Responsive ball count
      for (let i = 0; i < initialBallCount; i++) {
        ballsRef.current.push(
          new InteractiveTennisBall(
            Math.random() * (canvas.width - 60) + 30,
            Math.random() * (canvas.height - 60) + 30
          )
        );
      }
      setBallCount(ballsRef.current.length);
    };

    initializeBalls();

    // Mouse/Touch Event Handlers for Ball Grabbing
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const pos = getCanvasPos(event);
      mousePos.current = pos;

      // Find the topmost ball at this position
      for (let i = ballsRef.current.length - 1; i >= 0; i--) {
        const ball = ballsRef.current[i];
        if (ball.containsPoint(pos.x, pos.y)) {
          grabbedBall.current = ball;
          ball.startGrab(pos.x, pos.y);
          canvas.style.cursor = "grabbing";
          break;
        }
      }
    };

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const pos = getCanvasPos(event);
      mousePos.current = pos;

      if (grabbedBall.current) {
        grabbedBall.current.updateGrab(pos.x, pos.y);
      } else {
        // Check if hovering over a ball
        let hoveringBall = false;
        for (const ball of ballsRef.current) {
          if (ball.containsPoint(pos.x, pos.y)) {
            hoveringBall = true;
            break;
          }
        }
        canvas.style.cursor = hoveringBall ? "grab" : "default";
      }
    };

    const handlePointerUp = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (grabbedBall.current) {
        grabbedBall.current.stopGrab();
        grabbedBall.current = null;
        canvas.style.cursor = "default";
      }
    };

    // Add event listeners for both mouse and touch
    canvas.addEventListener("mousedown", handlePointerDown);
    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("mouseup", handlePointerUp);
    canvas.addEventListener("mouseleave", handlePointerUp);

    canvas.addEventListener("touchstart", handlePointerDown, {
      passive: false,
    });
    canvas.addEventListener("touchmove", handlePointerMove, { passive: false });
    canvas.addEventListener("touchend", handlePointerUp, { passive: false });

    // Enhanced shake detection
    const handleShake = (intensity: number) => {
      const now = Date.now();
      if (now - lastShakeTime.current < 200) return; // Shorter debounce for responsiveness
      lastShakeTime.current = now;

      // Add new ball occasionally when shaking hard
      if (
        intensity > 15 &&
        ballsRef.current.length < 35 &&
        Math.random() > 0.5
      ) {
        ballsRef.current.push(
          new InteractiveTennisBall(
            Math.random() * (canvas.width - 60) + 30,
            20
          )
        );
        setBallCount(ballsRef.current.length);
      }

      // Set shake intensity for ball physics
      shakeIntensity.current = Math.min(intensity / 10, 5);
    };

    // Advanced shake detection with acceleration tracking
    let lastX = 0,
      lastY = 0,
      lastZ = 0;
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

        // Calculate shake intensity
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);
        const totalDelta = deltaX + deltaY + deltaZ;

        // Track acceleration history for more accurate shake detection
        accelerationHistory.current.push(totalDelta);
        if (accelerationHistory.current.length > 10) {
          accelerationHistory.current.shift();
        }

        // Calculate average recent acceleration
        const avgAcceleration =
          accelerationHistory.current.reduce((a, b) => a + b, 0) /
          accelerationHistory.current.length;

        if (totalDelta > 12 || avgAcceleration > 8) {
          handleShake(totalDelta);
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    window.addEventListener("devicemotion", handleDeviceMotion);

    // Ultra-realistic animation loop with collision detection
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate realistic gravity based on device orientation
      const { alpha, beta, gamma } = deviceOrientationRef.current;

      // Convert device orientation to realistic gravity
      // Beta: front-back tilt (when phone is vertical, beta is around 90)
      // Gamma: left-right tilt

      let gravityX = 0;
      let gravityY = 0.5; // Default downward gravity

      // Detect orientation and apply realistic gravity
      if (Math.abs(beta) < 30) {
        // Phone is roughly flat (horizontal)
        gravityX = ((gamma || 0) / 90) * 0.3; // Very gentle tilt response
        gravityY = 0.1; // Almost no gravity when flat
      } else if (Math.abs(beta - 90) < 30) {
        // Phone is vertical (portrait)
        gravityX = ((gamma || 0) / 90) * 0.5;
        gravityY = 1.0; // Full gravity downward
      } else if (Math.abs(beta + 90) < 30) {
        // Phone is upside down vertical
        gravityX = (-(gamma || 0) / 90) * 0.5;
        gravityY = -1.0; // Gravity upward (upside down)
      } else {
        // Phone is tilted at an angle
        const tiltFactor = Math.abs(beta) / 90;
        gravityX = ((gamma || 0) / 90) * 0.6 * tiltFactor;
        gravityY = 0.8 * tiltFactor;
      }

      // Check CTA button collisions
      if (ctaButtonRef.current) {
        const buttonRect = ctaButtonRef.current.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        // Convert button position to canvas coordinates
        const ctaRect = {
          x: buttonRect.left - canvasRect.left,
          y: buttonRect.top - canvasRect.top,
          width: buttonRect.width,
          height: buttonRect.height,
        };

        ballsRef.current.forEach((ball) => {
          ball.checkCTACollision(ctaRect); // Just physics collision, no visual effect
        });
      }

      // Check collisions between all balls
      for (let i = 0; i < ballsRef.current.length; i++) {
        for (let j = i + 1; j < ballsRef.current.length; j++) {
          ballsRef.current[i].checkCollisionWith(ballsRef.current[j]);
        }
      }

      // Apply shake effect and update balls
      ballsRef.current.forEach((ball) => {
        ball.update(
          canvas.width,
          canvas.height,
          gravityX,
          gravityY,
          shakeIntensity.current
        );
        ball.draw(ctx);
      });

      // Reduce shake intensity over time
      shakeIntensity.current *= 0.9;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("devicemotion", handleDeviceMotion);

      canvas.removeEventListener("mousedown", handlePointerDown);
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("mouseup", handlePointerUp);
      canvas.removeEventListener("mouseleave", handlePointerUp);
      canvas.removeEventListener("touchstart", handlePointerDown);
      canvas.removeEventListener("touchmove", handlePointerMove);
      canvas.removeEventListener("touchend", handlePointerUp);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPhysicsActive]);

  return (
    <div className={styles.tennisHero}>
      {/* Interactive Physics Canvas */}
      <canvas ref={canvasRef} className={styles.physicsScene} />

      {/* Motion Permission Prompt */}
      {showMotionPrompt && (
        <div className={styles.motionPrompt}>
          <button
            onClick={requestOrientationPermission}
            className={styles.motionButton}
          >
            🎾 Activar Física Realista
          </button>
        </div>
      )}

      {/* Court Lines Background */}
      <div className={styles.courtLines}>
        <div className={styles.baseline} />
        <div className={styles.serviceLine} />
        <div className={styles.centerLine} />
        <div className={styles.netPost} />
      </div>

      {/* Content Container */}
      <div className={styles.contentContainer}>
        {/* Urgency Banner */}
        {showUrgency && (
          <div className={styles.urgencyBanner}>
            <span className={styles.fireEmoji}>🔥</span>
            <Translate id="homepage.hero.urgency">
              Más de 500 descargas este mes
            </Translate>
          </div>
        )}

        {/* Main Title with Animation */}
        <h1 className={styles.heroTitle}>
          <span className={styles.titleLine1}>
            <Translate id="homepage.hero.title1">Entrena como</Translate>
          </span>
          <span className={styles.titleLine2}>
            <Translate id="homepage.hero.title2">los #1 del mundo</Translate>
          </span>
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          <Translate id="homepage.hero.subtitle">
            Arrastra las pelotas, agita el dispositivo e inclínalo para física
            realista
          </Translate>
        </p>

        {/* Add More Balls Button */}
        <button
          onClick={() => {
            const canvas = canvasRef.current;
            if (canvas && ballsRef.current.length < 50) {
              // Add 3 balls at once
              for (let i = 0; i < 3; i++) {
                ballsRef.current.push(
                  new InteractiveTennisBall(
                    Math.random() * (canvas.width - 60) + 30,
                    Math.random() * 100 + 50 // Start from top
                  )
                );
              }
              setBallCount(ballsRef.current.length);
            }
          }}
          className={styles.addBallsButton}
        >
          🎾 Más Pelotas ({ballCount})
        </button>

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
              <Translate id="homepage.hero.stat2">
                Respaldo científico
              </Translate>
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
          aria-label="Descargar rutina gratis"
        >
          <span className={styles.ctaText}>
            <Translate id="homepage.hero.cta">
              DESCARGAR RUTINA GRATIS
            </Translate>
          </span>
          <div className={styles.ctaIcon}>⚡</div>
        </button>

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

        {/* Social Proof */}
        <div className={styles.socialProof}>
          <div className={styles.activityBadge}>
            <Translate id="homepage.hero.activity">
              ACTIVIDAD RECIENTE
            </Translate>
          </div>
          <div className={styles.activityText}>
            <Translate id="homepage.hero.downloads">
              248 personas descargaron la rutina en las últimas 24 horas
            </Translate>
          </div>
        </div>
      </div>
    </div>
  );
}
