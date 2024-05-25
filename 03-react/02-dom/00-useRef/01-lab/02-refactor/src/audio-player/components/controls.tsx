import styles from "./controls.module.css";
import { PlayIcon, PauseIcon, StopIcon } from "./icons";

interface ControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const Controls = ({ onPlay, onPause, onStop }: ControlsProps) => {
  return (
    <div className={styles.controls}>
      <button className={styles.button} onClick={onPlay}>
        <PlayIcon />
      </button>
      <button className={styles.button} onClick={onPause}>
        <PauseIcon />
      </button>
      <button className={styles.button} onClick={onStop}>
        <StopIcon />
      </button>
    </div>
  );
};
