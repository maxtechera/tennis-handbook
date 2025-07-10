import React, { useEffect, useRef, useState, useCallback } from "react";
import Translate from "@docusaurus/Translate";
import clsx from "clsx";
import styles from "./TennisHero.module.css";
import { sessionManager } from "../../utils/session";
import { tennisBallEvents } from "../../utils/tennis-ball-events";

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
  sleepFrames: number;
  lastX: number;
  lastY: number;
  rotation: number;
  rotationSpeed: number;
  static ballImage: HTMLImageElement | null = null;
  static imageLoaded: boolean = false;

  constructor(x: number, y: number, radius: number = 15) {
    this.x = x;
    this.y = y;
    this.vx = 0; // No initial velocity, will be set explicitly
    this.vy = 0; // No initial velocity, will be set explicitly
    this.radius = 15; // Fixed size for all balls
    this.mass = Math.PI * this.radius * this.radius; // Mass based on area
    this.restitution = 0.75; // Tennis ball bounciness
    this.friction = 0.95; // Rolling friction
    this.airResistance = 0.998; // Air resistance
    this.gravityScale = 1;
    this.color = "#CFFF00";
    this.sleeping = false;
    this.sleepThreshold = 0.1; // Lower threshold so balls sleep less easily
    this.sleepFrames = 0;
    this.lastX = x;
    this.lastY = y;
    this.rotation = Math.random() * Math.PI * 2; // Random initial rotation
    this.rotationSpeed = 0; // Will be calculated based on velocity

    // Load the image once for all balls
    if (!InteractiveTennisBall.ballImage) {
      InteractiveTennisBall.ballImage = new Image();
      InteractiveTennisBall.ballImage.src = "/img/logo.png";
      InteractiveTennisBall.ballImage.onload = () => {
        InteractiveTennisBall.imageLoaded = true;
      };
    }
  }

  // Check if point is inside ball (for touching)
  containsPoint(x: number, y: number): boolean {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.radius;
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

    if (distance < this.radius) {
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

    if (distance < minDistance && distance > 0.001) {
      // Wake up sleeping balls on collision
      if (this.sleeping || other.sleeping) {
        this.sleeping = false;
        other.sleeping = false;
        this.sleepFrames = 0;
        other.sleepFrames = 0;
      }

      // Collision detected - separate balls with dampening
      const overlap = minDistance - distance;
      const separationDamping = this.sleeping || other.sleeping ? 0.3 : 0.5;
      const separationX = (dx / distance) * overlap * 0.5 * separationDamping;
      const separationY = (dy / distance) * overlap * 0.5 * separationDamping;

      // Only move non-sleeping balls
      if (!this.sleeping) {
        this.x -= separationX;
        this.y -= separationY;
      }
      if (!other.sleeping) {
        other.x += separationX;
        other.y += separationY;
      }

      // Add spin on collision
      const impactForce = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      this.rotationSpeed += (Math.random() - 0.5) * impactForce * 0.2;
      other.rotationSpeed += (Math.random() - 0.5) * impactForce * 0.2;

      // Calculate collision response (momentum transfer)
      const nx = dx / distance; // Normal vector
      const ny = dy / distance;

      // Relative velocity
      const rvx = other.vx - this.vx;
      const rvy = other.vy - this.vy;

      // Relative velocity in collision normal direction
      const speed = rvx * nx + rvy * ny;

      // Don't resolve if velocities are separating or too small
      if (speed > -0.1) return;

      // Collision impulse with mass consideration
      const impulse = (2 * speed) / (this.mass + other.mass);
      const restitution = Math.min(this.restitution, other.restitution) * 0.8; // More bouncy collisions

      // Apply impulse to both balls with dampening
      const impulseDamping = 0.85; // Less damping for livelier collisions
      if (!this.sleeping) {
        this.vx += impulse * other.mass * nx * restitution * impulseDamping;
        this.vy += impulse * other.mass * ny * restitution * impulseDamping;
      }
      if (!other.sleeping) {
        other.vx -= impulse * this.mass * nx * restitution * impulseDamping;
        other.vy -= impulse * this.mass * ny * restitution * impulseDamping;
      }

      // Always wake up on any collision
      const impulseMagnitude = Math.abs(impulse);
      if (impulseMagnitude > 0.5) {
        // Much lower threshold
        this.sleeping = false;
        other.sleeping = false;
        this.sleepFrames = 0;
        other.sleepFrames = 0;

        // Give a little boost to make collisions more fun
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
    // Wake up if shaken
    if (shake > 0) {
      this.sleeping = false;
      // Add POWERFUL shake force - balls go flying!
      this.vx += (Math.random() - 0.5) * shake * 8; // 4x stronger
      this.vy += (Math.random() - 0.5) * shake * 8; // 4x stronger
    }

    // Skip physics if ball is sleeping (like real balls at rest)
    if (this.sleeping) {
      // Wake up from significant device tilt or shake
      // Calculate gravity magnitude to detect significant tilts
      const gravityMagnitude = Math.sqrt(gravityX * gravityX + gravityY * gravityY);
      const defaultGravityMagnitude = 0.4;
      
      if (
        Math.abs(gravityX) > 0.2 || // Significant horizontal tilt
        Math.abs(gravityMagnitude - defaultGravityMagnitude) > 0.2 || // Significant tilt from default
        shake > 1
      ) {
        this.sleeping = false;
        this.sleepFrames = 0;
      } else {
        // Keep position stable when sleeping
        this.vx = 0;
        this.vy = 0;
        return;
      }
    }

    // Store previous position for sleep detection
    const prevX = this.x;
    const prevY = this.y;

    // Apply gravity based on device orientation (only if moving)
    if (!this.sleeping) {
      this.vx += gravityX * this.gravityScale; // Natural gravity effect
      this.vy += gravityY * this.gravityScale; // Natural gravity effect
    }

    // Apply air resistance (more realistic)
    this.vx *= this.airResistance;
    this.vy *= this.airResistance;

    // Clamp very small velocities to zero to prevent jittering
    if (Math.abs(this.vx) < 0.01) this.vx = 0;
    if (Math.abs(this.vy) < 0.01) this.vy = 0;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    // Update rotation based on velocity (rolling effect)
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    this.rotationSpeed = (this.vx / this.radius) * 0.5; // Rolling rotation

    // Add the stored rotation speed (from collisions, etc)
    this.rotation += this.rotationSpeed;

    // Dampen rotation speed over time
    this.rotationSpeed *= 0.98;

    // Enhanced boundary collisions with realistic physics
    let bounced = false;

    // Left and right walls
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = -this.vx * this.restitution;
      this.rotationSpeed = -this.rotationSpeed * 0.7; // Reverse spin on wall bounce
      bounced = true;
    } else if (this.x + this.radius > width) {
      this.x = width - this.radius;
      this.vx = -this.vx * this.restitution;
      this.rotationSpeed = -this.rotationSpeed * 0.7; // Reverse spin on wall bounce
      bounced = true;
    }

    // Top and bottom walls
    if (this.y - this.radius < 0) {
      this.y = this.radius;
      this.vy = -this.vy * this.restitution;
      // Add spin based on horizontal velocity
      this.rotationSpeed += this.vx * 0.1;
      bounced = true;
    } else if (this.y + this.radius > height) {
      this.y = height - this.radius;
      this.vy = -this.vy * this.restitution;
      // Ground friction when bouncing
      this.vx *= this.friction;
      // Add backspin on ground bounce
      this.rotationSpeed = -Math.abs(this.vy) * 0.2;
      bounced = true;
    }

    // Check if ball should go to sleep (like real physics)
    const totalVelocity = Math.abs(this.vx) + Math.abs(this.vy);
    const positionChange = Math.abs(this.x - prevX) + Math.abs(this.y - prevY);

    // Increment sleep frames if ball is barely moving
    if (
      totalVelocity < this.sleepThreshold &&
      positionChange < 0.05 &&
      !bounced
    ) {
      this.sleepFrames++;

      // Go to sleep after being still for much longer (30 frames instead of 10)
      if (this.sleepFrames > 30) {
        this.sleeping = true;
        this.vx = 0;
        this.vy = 0;
        // Snap to grid to prevent micro-movements
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
      }
    } else {
      // Reset sleep counter if moving
      this.sleepFrames = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw shadow
    const shadowOffset = 3;
    const shadowOpacity = 0.3;
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

    // If image is loaded, draw it, otherwise fallback to gradient
    if (InteractiveTennisBall.imageLoaded && InteractiveTennisBall.ballImage) {
      // Save context state for rotation
      ctx.save();

      // Translate to ball center and rotate
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // Draw the image centered at origin (after translation)
      ctx.drawImage(
        InteractiveTennisBall.ballImage,
        -this.radius,
        -this.radius,
        this.radius * 2,
        this.radius * 2
      );

      // Restore context state
      ctx.restore();
    } else {
      // Fallback to original gradient rendering
      const gradient = ctx.createRadialGradient(
        this.x - this.radius / 3,
        this.y - this.radius / 3,
        0,
        this.x,
        this.y,
        this.radius
      );
      gradient.addColorStop(0, "hsl(66, 100%, 85%)");
      gradient.addColorStop(0.3, "hsl(66, 100%, 75%)");
      gradient.addColorStop(0.7, "hsl(65, 95%, 65%)");
      gradient.addColorStop(1, "hsl(64, 90%, 55%)");

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Tennis ball seam
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.8, Math.PI, Math.PI * 2);
      ctx.stroke();

      // Highlight for 3D effect
      ctx.beginPath();
      ctx.arc(
        this.x - this.radius / 4,
        this.y - this.radius / 4,
        this.radius / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fill();
    }
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
  const frameSkipCounter = useRef<number>(0);
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
  const grabbedBall = useRef<InteractiveTennisBall | null>(null);
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
      // Fallback to a default value
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
      // Re-add events to queue on failure
      analyticsQueue.current = [...events, ...analyticsQueue.current];
    }
  }, []);

  // Track ball throws with batching
  const trackBallThrows = useCallback(
    (count: number) => {
      // Optimistically update UI
      setTotalBallsThrown((prev) => (prev || 0) + count);
      pendingThrows.current += count;

      // Add to analytics queue
      analyticsQueue.current.push({
        statType: "balls_thrown",
        count,
        sessionId: sessionId.current,
      });

      // Clear existing timer
      if (analyticsTimer.current) {
        clearTimeout(analyticsTimer.current);
      }

      // Set new timer to batch send after 500ms of inactivity
      analyticsTimer.current = setTimeout(() => {
        sendAnalyticsBatch();
      }, 500);
    },
    [sendAnalyticsBatch]
  );

  // Request device orientation permission
  const requestOrientationPermission = async () => {
    // Check if we need permission (iOS 13+)
    const needsOrientationPermission =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function";

    const needsMotionPermission =
      typeof DeviceMotionEvent !== "undefined" &&
      typeof (DeviceMotionEvent as any).requestPermission === "function";

    if (needsOrientationPermission || needsMotionPermission) {
      try {
        // Always request both permissions
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
          // Remove any existing listeners first
          window.removeEventListener(
            "deviceorientation",
            handleDeviceOrientation
          );
          window.removeEventListener("devicemotion", handleDeviceMotion);
          // Set up the event listeners now that we have permission
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
      // Not iOS 13+ or desktop - no permission needed
      setMotionPermission("granted");
      setIsPhysicsActive(true);
      return true;
    }
  };

  // Define event handlers outside so they can be referenced
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

      // Calculate shake intensity
      const deltaX = Math.abs(x - lastAcceleration.current.x);
      const deltaY = Math.abs(y - lastAcceleration.current.y);
      const deltaZ = Math.abs(z - lastAcceleration.current.z);
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
      if (now - lastShakeTime.current < 200) return; // Shorter debounce for responsiveness
      lastShakeTime.current = now;

      const canvas = canvasRef.current;
      if (!canvas || !ballsRef.current) return;

      // Add new ball very easily when shaking (super sensitive)
      if (intensity > 2 && Math.random() > 0.3) {
        // Even lower threshold for easier ball creation
        const maxBalls = 1000;

        // Remove oldest ball if we would exceed the limit (FIFO)
        if (ballsRef.current.length >= maxBalls) {
          ballsRef.current.shift(); // Remove oldest ball
        }

        // Get CTA button position for spawning
        const buttonRect = ctaButtonRef.current?.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const spawnY = buttonRect
          ? buttonRect.top - canvasRect.top - 30 // 30px above button
          : canvas.height * 0.5; // Fallback to middle

        const ball = new InteractiveTennisBall(
          canvas.width / 2 + (Math.random() - 0.5) * 60, // Center ± 30px
          spawnY
        );
        // Throw toward the walls with strong horizontal velocity and curve
        const direction = Math.random() < 0.5 ? -1 : 1; // Left or right
        // Add curve factor: 3-8 units of horizontal velocity for curve
        const curveFactor = 3 + Math.random() * 5;
        ball.vx =
          direction * (12 + Math.random() * 8) +
          curveFactor * (Math.random() < 0.5 ? -1 : 1); // Strong horizontal with curve
        ball.vy = -15 - Math.random() * 8; // Very strong upward velocity -15 to -23
        ballsRef.current.push(ball); // Add newest ball
        setBallCount(ballsRef.current.length);

        // Track shake-generated ball
        trackBallThrows(1);
      }

      // Set shake intensity for ball physics - Much stronger!
      shakeIntensity.current = Math.min(intensity / 2, 20); // 4x stronger, 4x higher max
    },
    [trackBallThrows]
  );

  // Function to spawn celebration balls
  const spawnCelebrationBalls = useCallback(
    (count: number = 20) => {
      const canvas = canvasRef.current;
      if (!canvas || !isPhysicsActive) return;

      const maxBalls = 1000;
      const ballsToAdd = count;

      // Remove oldest balls if we would exceed the limit (FIFO)
      const currentCount = ballsRef.current.length;
      const ballsToRemove = Math.max(0, currentCount + ballsToAdd - maxBalls);

      if (ballsToRemove > 0) {
        ballsRef.current.splice(0, ballsToRemove);
      }

      // Add celebration balls with firework-like pattern
      for (let i = 0; i < ballsToAdd; i++) {
        // Get center of canvas for spawn point
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const ball = new InteractiveTennisBall(
          centerX + (Math.random() - 0.5) * 40, // Center with small variation
          centerY
        );

        // Create firework explosion pattern
        const angle = (Math.PI * 2 * i) / ballsToAdd + Math.random() * 0.3;
        const speed = 15 + Math.random() * 10; // Strong outward velocity

        // Add curve factor to celebration balls
        const curveFactor = 2 + Math.random() * 6; // 2-8 units of curve
        ball.vx =
          Math.cos(angle) * speed +
          curveFactor * (Math.random() < 0.5 ? -1 : 1);
        ball.vy = Math.sin(angle) * speed - 5; // Slight upward bias

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
      // Ensure physics is active first
      if (!isPhysicsActive) {
        setIsPhysicsActive(true);
        // Wait a frame for physics to initialize
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
    // Only set up listeners if we don't need permission or have permission
    const checkAndSetupMotion = () => {
      const needsPermission =
        (typeof DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as any).requestPermission ===
            "function") ||
        (typeof DeviceMotionEvent !== "undefined" &&
          typeof (DeviceMotionEvent as any).requestPermission === "function");

      if (needsPermission) {
        // iOS 13+ - only set up if permission granted
        if (motionPermission === "granted") {
          window.addEventListener("deviceorientation", handleDeviceOrientation);
          window.addEventListener("devicemotion", handleDeviceMotion);
          setIsPhysicsActive(true);
        }
      } else {
        // Desktop or Android - no permission needed
        window.addEventListener("deviceorientation", handleDeviceOrientation);
        window.addEventListener("devicemotion", handleDeviceMotion);
        setIsPhysicsActive(true);
        setMotionPermission("granted");
      }
    };

    // Check immediately and also after a small delay (for iOS Safari)
    checkAndSetupMotion();
    const timeoutId = setTimeout(checkAndSetupMotion, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("devicemotion", handleDeviceMotion);
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

    // Set canvas size to match container's actual height
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight; // Use container's actual height (which uses dvh)
      }
    };
    resizeCanvas();

    // Use ResizeObserver for better viewport change detection
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    window.addEventListener("resize", resizeCanvas);

    // Initialize balls with realistic distribution - Many more balls!
    const initializeBalls = () => {
      ballsRef.current = [];
      const initialBallCount = Math.min(20, Math.floor(canvas.width / 40)); // Responsive ball count
      for (let i = 0; i < initialBallCount; i++) {
        // Get CTA button position for spawning
        const buttonRect = ctaButtonRef.current?.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const spawnY = buttonRect
          ? buttonRect.top - canvasRect.top - 30 // 30px above button
          : canvas.height * 0.5; // Fallback to middle

        const ball = new InteractiveTennisBall(
          canvas.width / 2 + (Math.random() - 0.5) * 60, // Center ± 30px
          spawnY
        );
        // Throw toward the walls with strong horizontal velocity and curve
        const direction = Math.random() < 0.5 ? -1 : 1; // Left or right
        // Add curve factor for initial balls
        const curveFactor = 3 + Math.random() * 5; // 3-8 units of curve
        ball.vx =
          direction * (12 + Math.random() * 8) +
          curveFactor * (Math.random() < 0.5 ? -1 : 1); // Strong horizontal with curve
        ball.vy = -15 - Math.random() * 8; // Very strong upward velocity -15 to -23
        ballsRef.current.push(ball);
      }
      setBallCount(ballsRef.current.length);
    };

    initializeBalls();

    // Mouse/Touch Event Handlers for Ball Grabbing
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const pos = getCanvasPos(event);
      mousePos.current = pos;

      // Create area-of-effect explosion pushing all nearby balls away
      const explosionRadius = 120; // Larger radius of effect
      let ballsAffected = 0;

      for (const ball of ballsRef.current) {
        const dx = ball.x - pos.x;
        const dy = ball.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < explosionRadius) {
          ballsAffected++;
          ball.sleeping = false;
          ball.sleepFrames = 0; // Reset sleep counter

          // Calculate direction away from click point
          const angle = Math.atan2(dy, dx);

          // Force decreases with distance (closer = stronger push)
          const maxForce = 20; // Stronger force
          const forceMultiplier = Math.max(0.3, 1 - distance / explosionRadius);
          const force = maxForce * forceMultiplier;

          // Apply force in direction away from click
          ball.vx += Math.cos(angle) * force;
          ball.vy += Math.sin(angle) * force;

          // Add some randomness for more natural effect
          ball.vx += (Math.random() - 0.5) * 3;
          ball.vy += (Math.random() - 0.5) * 3;
        }
      }

      // Only prevent default if we affected any balls
      if (ballsAffected > 0) {
        event.preventDefault();
      }
    };

    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      const pos = getCanvasPos(event);
      mousePos.current = pos;

      // Show crosshair cursor anywhere on canvas to indicate explosion area
      canvas.style.cursor = "crosshair";
    };

    const handlePointerUp = (event: MouseEvent | TouchEvent) => {
      // No longer need pointer up logic since we don't have grabbing
      canvas.style.cursor = "default";
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

    // Note: handleShake and handleDeviceMotion are defined outside this effect
    // and will be added/removed by the motion setup effect based on permissions

    // Optimized animation loop with spatial partitioning
    const animate = () => {
      // Check if any balls are awake
      const hasActiveBalls = ballsRef.current.some(
        (ball) =>
          !ball.sleeping || Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1
      );

      // Skip some frames if all balls are sleeping
      if (!hasActiveBalls && shakeIntensity.current < 0.1) {
        frameSkipCounter.current++;
        if (frameSkipCounter.current < 5) {
          animationRef.current = requestAnimationFrame(animate);
          return;
        }
      }
      frameSkipCounter.current = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate realistic gravity based on device orientation
      const { alpha, beta, gamma } = deviceOrientationRef.current;

      // Convert device orientation to realistic gravity
      // Beta: front-back tilt (-180 to 180, 0 = flat, 90 = vertical)
      // Gamma: left-right tilt (-90 to 90)
      
      // Convert angles to radians
      const betaRad = ((beta || 0) * Math.PI) / 180;
      const gammaRad = ((gamma || 0) * Math.PI) / 180;
      
      // Calculate gravity vector in world space
      // Gravity always points down in the real world
      const gravityMagnitude = 0.4; // Reduced from varying values to constant
      
      // Transform world gravity to screen coordinates based on device orientation
      // When phone is flat (beta ≈ 0), gravity points down the screen (positive Y)
      // When phone is vertical (beta ≈ 90), gravity still points down in world
      let gravityX = 0;
      let gravityY = gravityMagnitude;
      
      // Calculate gravity based on device orientation
      // The key insight: gravity always points "down" in the real world
      // We need to transform this to screen coordinates based on device rotation
      
      if (Math.abs(beta) < 30) {
        // Phone is nearly flat (lying on table)
        // Gamma controls X-axis tilt, beta controls Y-axis tilt
        gravityX = Math.sin(gammaRad) * gravityMagnitude * 0.5;
        gravityY = gravityMagnitude * 0.8; // Mostly downward
      } else {
        // Phone is tilted or vertical
        // Beta: 0° = flat, 90° = vertical portrait, ±180° = upside down
        // Gamma: side-to-side tilt
        
        // When phone rotates from portrait to landscape:
        // - Portrait (beta ≈ 90°): gravity points down screen (positive Y)
        // - Landscape left (gamma ≈ -90°): gravity points right (positive X)
        // - Landscape right (gamma ≈ 90°): gravity points left (negative X)
        
        // Calculate how vertical the phone is (0 = flat, 1 = vertical)
        const verticalness = Math.min(Math.abs(beta) / 90, 1);
        
        // Base gravity direction from beta angle
        const baseGravityY = Math.sign(90 - Math.abs(beta)) * Math.cos(betaRad) * gravityMagnitude;
        
        // When phone is vertical, gamma determines if we're in landscape
        if (verticalness > 0.7) {
          // Phone is mostly vertical
          if (Math.abs(gamma) > 60) {
            // Phone is rotated to landscape
            const landscapeAmount = Math.min(Math.abs(gamma) / 90, 1);
            gravityX = -Math.sign(gamma) * gravityMagnitude * landscapeAmount;
            gravityY = baseGravityY * (1 - landscapeAmount);
          } else {
            // Phone is in portrait
            gravityX = Math.sin(gammaRad) * gravityMagnitude * 0.5;
            gravityY = baseGravityY;
          }
        } else {
          // Phone is at an angle
          gravityX = Math.sin(gammaRad) * gravityMagnitude * verticalness * 0.6;
          gravityY = baseGravityY;
        }
      }
      
      // Apply smoothing to prevent jittery movement
      // Smooth the gravity changes with exponential moving average
      const smoothingFactor = 0.15; // Lower = smoother, higher = more responsive
      gravityX = prevGravityRef.current.x + (gravityX - prevGravityRef.current.x) * smoothingFactor;
      gravityY = prevGravityRef.current.y + (gravityY - prevGravityRef.current.y) * smoothingFactor;
      
      // Store for next frame
      prevGravityRef.current = { x: gravityX, y: gravityY };

      // Get CTA button rect for collisions
      let ctaRect = undefined;
      if (ctaButtonRef.current) {
        const buttonRect = ctaButtonRef.current.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        // Convert button position to canvas coordinates
        ctaRect = {
          x: buttonRect.left - canvasRect.left,
          y: buttonRect.top - canvasRect.top,
          width: buttonRect.width,
          height: buttonRect.height,
        };

        // Still handle physics balls for CTA collision
        ballsRef.current.forEach((ball) => {
          ball.checkCTACollision(ctaRect); // Just physics collision, no visual effect
        });
      }

      // Optimized collision detection with spatial partitioning
      // Only check collisions for nearby balls
      const gridSize = 100; // Size of each grid cell
      const grid = new Map<string, InteractiveTennisBall[]>();

      // Place balls in grid cells
      ballsRef.current.forEach((ball) => {
        const gridX = Math.floor(ball.x / gridSize);
        const gridY = Math.floor(ball.y / gridSize);
        const key = `${gridX},${gridY}`;

        if (!grid.has(key)) {
          grid.set(key, []);
        }
        grid.get(key)!.push(ball);
      });

      // Check collisions only within same and neighboring cells
      ballsRef.current.forEach((ball) => {
        const gridX = Math.floor(ball.x / gridSize);
        const gridY = Math.floor(ball.y / gridSize);

        // Check neighboring cells (3x3 grid around current cell)
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const key = `${gridX + dx},${gridY + dy}`;
            const cellBalls = grid.get(key);

            if (cellBalls) {
              cellBalls.forEach((otherBall) => {
                if (ball !== otherBall && ball.x < otherBall.x) {
                  // Only check each pair once
                  ball.checkCollisionWith(otherBall);
                }
              });
            }
          }
        }
      });

      // Apply shake effect and update balls
      ballsRef.current.forEach((ball, index) => {
        // Periodic random wake-up to keep things lively
        if (ball.sleeping && Math.random() < 0.001) {
          // 0.1% chance per frame (reduced frequency)
          ball.sleeping = false;
          ball.sleepFrames = 0;
          // Give a small random impulse without upward bias
          ball.vx = (Math.random() - 0.5) * 1.5;
          ball.vy = (Math.random() - 0.5) * 1.5; // No upward bias
        }

        ball.update(
          canvas.width,
          canvas.height,
          gravityX,
          gravityY,
          shakeIntensity.current
        );
        ball.draw(ctx);
      });

      // Update ball count
      setBallCount(ballsRef.current.length);

      // Reduce shake intensity over time
      shakeIntensity.current *= 0.9;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);

      resizeObserver.disconnect();

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
        {/* <div
          className={clsx(
            styles.urgencyBanner,
            !showUrgency && styles.urgencyBannerHidden
          )}
        >
          <span className={styles.fireEmoji}>📊</span>
          <Translate id="homepage.hero.urgency">
            87% menos raquetas rotas desde que entrenan con nosotros*
          </Translate>
        </div> */}

        {/* Main Title with Animation */}
        <h1 className={styles.heroTitle}>
          <span className={styles.titleLine1}>
            <Translate id="homepage.hero.title1">Entrena como</Translate>
          </span>
          <span className={styles.titleLine2}>
            <Translate id="homepage.hero.title2">los #1 del mundo</Translate>
          </span>
        </h1>

        {/* Add More Balls Button - Now below CTA */}
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
              {/* <Translate id="homepage.hero.stat2">
              </Translate> */}
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
            Arrastra las pelotas, agita el dispositivo e inclínalo para física
            realista
          </Translate>
        </p>

        <button
          onClick={async () => {
            // Always request motion permission on iOS when not granted
            if (motionPermission !== "granted") {
              const granted = await requestOrientationPermission();
              if (!granted) {
                // Permission denied, but still throw balls without motion controls
                console.log(
                  "Motion permission denied, balls will be thrown without motion controls"
                );
              }
            }

            // Always activate physics when button is clicked (even without motion)
            if (!isPhysicsActive) {
              setIsPhysicsActive(true);
            }

            const canvas = canvasRef.current;
            if (canvas) {
              const maxBalls = 1000;
              const ballsToAdd = 1;

              // Remove oldest balls if we would exceed the limit (FIFO)
              const currentCount = ballsRef.current.length;
              const ballsToRemove = Math.max(
                0,
                currentCount + ballsToAdd - maxBalls
              );

              if (ballsToRemove > 0) {
                ballsRef.current.splice(0, ballsToRemove); // Remove from beginning (oldest)
              }

              // Always add new balls
              for (let i = 0; i < ballsToAdd; i++) {
                // Get CTA button position for spawning
                const buttonRect =
                  ctaButtonRef.current?.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                const spawnY = buttonRect
                  ? buttonRect.top - canvasRect.top - 30 // 30px above button
                  : canvas.height * 0.5; // Fallback to middle

                const ball = new InteractiveTennisBall(
                  canvas.width / 2 + (Math.random() - 0.5) * 60, // Center ± 30px
                  spawnY
                );
                // Throw toward the walls with strong horizontal velocity and curve
                const direction = Math.random() < 0.5 ? -1 : 1; // Left or right
                // Add curve factor for button-spawned balls
                const curveFactor = 4 + Math.random() * 6; // 4-10 units of curve for more dramatic effect
                ball.vx =
                  direction * (15 + Math.random() * 5) +
                  curveFactor * (Math.random() < 0.5 ? -1 : 1); // Extra strong horizontal with curve
                ball.vy = -15 - Math.random() * 8; // Very strong upward velocity -15 to -23
                ballsRef.current.push(ball); // Add to end (newest)
              }
              setBallCount(ballsRef.current.length);

              // Track the ball throws
              trackBallThrows(ballsToAdd);
            }
          }}
          className={styles.addBallsButton}
          title={
            motionPermission === "granted"
              ? "Lanzar pelotas (Movimiento activado 📱)"
              : "Lanzar pelotas (Clic para activar movimiento)"
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
            )}{" "}
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
