import React, { useState, useRef, useEffect } from 'react';
import { VideoSegment, Annotation } from '../../../types/technique';
import { useProgress } from '../core/ProgressProvider';
import styles from './TechniquePlayer.module.css';

interface TechniquePlayerProps {
  videoUrl: string;
  title: string;
  segments?: VideoSegment[];
  annotations?: Annotation[];
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export default function TechniquePlayer({
  videoUrl,
  title,
  segments = [],
  annotations = [],
  onProgress,
  onComplete,
}: TechniquePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [activeAnnotation, setActiveAnnotation] = useState<Annotation | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { startTracking, stopTracking } = useProgress();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      onProgress?.(video.currentTime / video.duration);

      const active = annotations.find(
        (ann) =>
          video.currentTime >= ann.timestamp &&
          video.currentTime <= ann.timestamp + ann.duration
      );
      setActiveAnnotation(active || null);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      stopTracking();
      onComplete?.();
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [annotations, onProgress, onComplete, stopTracking]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      stopTracking();
    } else {
      videoRef.current.play();
      startTracking();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newTime = percentage * duration;
    handleSeek(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaybackRateChange = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
    setPlaybackRate(newRate);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector(`.${styles.playerContainer}`);
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    handleSeek(newTime);
  };

  return (
    <div 
      className={styles.playerContainer}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          src={videoUrl}
          className={styles.video}
          onClick={togglePlay}
        />
        
        {activeAnnotation && (
          <div 
            className={styles.annotation}
            style={{
              left: `${activeAnnotation.position?.x || 50}%`,
              top: `${activeAnnotation.position?.y || 20}%`,
            }}
          >
            {activeAnnotation.content}
          </div>
        )}

        <div className={`${styles.controls} ${showControls ? styles.visible : ''}`}>
          <div className={styles.progressBar} onClick={handleProgressClick}>
            <div className={styles.progressBuffer} />
            <div 
              className={styles.progressFilled} 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {segments.map((segment) => (
              <div
                key={segment.id}
                className={styles.chapterMarker}
                style={{ left: `${(segment.start / duration) * 100}%` }}
                title={segment.title}
              />
            ))}
          </div>

          <div className={styles.controlButtons}>
            <div className={styles.leftControls}>
              <button onClick={togglePlay} className={styles.controlButton}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <button 
                onClick={() => skipTime(-10)} 
                className={styles.controlButton}
                title="Skip back 10s"
              >
                ⏪
              </button>
              
              <button 
                onClick={() => skipTime(10)} 
                className={styles.controlButton}
                title="Skip forward 10s"
              >
                ⏩
              </button>

              <div className={styles.volumeControl}>
                <button onClick={toggleMute} className={styles.controlButton}>
                  {isMuted ? '🔇' : '🔊'}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className={styles.volumeSlider}
                />
              </div>

              <span className={styles.timeDisplay}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className={styles.rightControls}>
              <button 
                onClick={handlePlaybackRateChange}
                className={styles.controlButton}
                title="Playback speed"
              >
                {playbackRate}x
              </button>
              
              <select 
                className={styles.segmentSelect}
                onChange={(e) => {
                  const segment = segments.find(s => s.id === e.target.value);
                  if (segment) handleSeek(segment.start);
                }}
                value=""
              >
                <option value="">Jump to...</option>
                {segments.map((segment) => (
                  <option key={segment.id} value={segment.id}>
                    {segment.title}
                  </option>
                ))}
              </select>

              <button 
                onClick={toggleFullscreen}
                className={styles.controlButton}
                title="Fullscreen"
              >
                {isFullscreen ? '🗙' : '⛶'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.videoInfo}>
        <h3>{title}</h3>
        {segments.length > 0 && (
          <div className={styles.chapterList}>
            {segments.map((segment) => (
              <button
                key={segment.id}
                className={`${styles.chapterButton} ${
                  currentTime >= segment.start && currentTime <= segment.end
                    ? styles.activeChapter
                    : ''
                }`}
                onClick={() => handleSeek(segment.start)}
              >
                <span className={styles.chapterTime}>{formatTime(segment.start)}</span>
                <span className={styles.chapterTitle}>{segment.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}