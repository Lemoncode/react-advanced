import { useEffect, useState } from "react";

export const useAudioProgress = (
  audioRef: React.RefObject<HTMLAudioElement>
) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
};
