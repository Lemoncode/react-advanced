import React from "react";
import styles from "./audio-player.module.css";
import { Header, Controls, ProgressBar, Volume } from "./components";
import { HeadlessAudioPlayer } from "./headless-audio-player.component";

export const AudioPlayer: React.FC = () => {
  return (
    <HeadlessAudioPlayer>
      {({ play, pause, stop, currentTime, duration, volume, setVolume }) => (
        <div className={styles.container}>
          <Header />
          <Controls onPlay={play} onPause={pause} onStop={stop} />

          <ProgressBar currentTime={currentTime} duration={duration} />
          <Volume volume={volume} onVolumeChange={setVolume} />
        </div>
      )}
    </HeadlessAudioPlayer>
  );
};
