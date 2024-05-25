import React, { useState } from "react";
import styles from "./audio-player.module.css";
import { PlayIcon, PauseIcon, StopIcon } from "./icons";

export const AudioPlayer: React.FC = () => {
  const [volume] = useState<number>(1);
  const [currentTime] = useState<number>(0);
  const [duration] = useState<number>(0);

  const handleVolumeChange = () => {
    console.log("Aquí debería cambiar el volumen");
  };

  const handlePlay = () => {
    console.log("Aquí debería empezar a sonar la música");
  };

  const handlePause = () => {
    console.log("Aquí debería pausarse la música");
  };

  const handleStop = () => {
    console.log("Aquí debería detenerse la música y ponerse al principio");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>Winamp</div>
      </div>
      <audio>
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
