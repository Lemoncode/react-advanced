import React, { useState, useRef, useEffect } from "react";
import styles from "./audio-player.module.css";
import { PlayIcon, PauseIcon, StopIcon } from "./icons";

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration ?? 0);
      };
    }
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handlePlay = () => {
    audioRef.current?.play();
  };

  const handlePause = () => {
    audioRef.current?.pause();
  };

  const handleStop = () => {
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>Winamp</div>
      </div>
      <audio ref={audioRef}>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
      <div className={styles.controls}>
        <button className={styles.button} onClick={handlePlay}>
          <PlayIcon />
        </button>
        <button className={styles.button} onClick={handlePause}>
          <PauseIcon />
        </button>
        <button className={styles.button} onClick={handleStop}>
          <StopIcon />
        </button>
      </div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFilled}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <p>Current Time: {Math.floor(currentTime)} seconds</p>
      </div>
      <div className={styles.volume}>
        <label htmlFor="volume">Volume: </label>
        <input
          id="volume"
          className={styles.slider}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};
