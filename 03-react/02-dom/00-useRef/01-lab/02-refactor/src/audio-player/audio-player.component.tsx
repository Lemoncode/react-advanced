import React, { useRef } from "react";
import styles from "./audio-player.module.css";
import { Header, Controls, ProgressBar, Volume } from "./components";
import { useAudioDuration, useAudioProgress, useAudioVolume } from "./hooks";

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useAudioVolume(audioRef);
  const currentTime = useAudioProgress(audioRef);
  const duration = useAudioDuration(audioRef);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
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
      <Header />
      <audio ref={audioRef}>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
      <Controls onPlay={handlePlay} onPause={handlePause} onStop={handleStop} />

      <ProgressBar currentTime={currentTime} duration={duration} />
      <Volume volume={volume} onVolumeChange={handleVolumeChange} />
    </div>
  );
};
