import styles from "./progress-bar.module.css";

interface ProgressBarProps {
    currentTime: number;
    duration: number;
  }
  
  export const ProgressBar = (props: ProgressBarProps) => {
    const { currentTime, duration } = props;
  
    return (
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFilled}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <p>Current Time: {Math.floor(currentTime)} seconds</p>
      </div>
    );
  };
  