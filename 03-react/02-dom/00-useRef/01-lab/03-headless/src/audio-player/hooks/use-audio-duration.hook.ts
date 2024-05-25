import { useEffect, useState } from "react";

export const useAudioDuration = (
  audioRef: React.RefObject<HTMLAudioElement>
) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, [audioRef.current]);

  return duration;
};
