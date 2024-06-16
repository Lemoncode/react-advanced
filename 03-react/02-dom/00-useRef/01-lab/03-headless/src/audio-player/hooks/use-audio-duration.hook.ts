import { useEffect, useState } from "react";

export const useAudioDuration = (
  audioRef: React.RefObject<HTMLAudioElement>
) => {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration ?? 0);
      };
    }
  }, [audioRef.current]);

  return duration;
};
