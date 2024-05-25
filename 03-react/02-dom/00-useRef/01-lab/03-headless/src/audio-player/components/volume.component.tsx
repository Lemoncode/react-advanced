import styles from "./volume.module.css";

interface VolumeProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export const Volume = ({ volume, onVolumeChange }: VolumeProps) => {
  return (
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
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
      />
    </div>
  );
};
