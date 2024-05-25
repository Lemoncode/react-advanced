import { useEffect, useState } from "react";

export const useAudioVolume = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const [volume, setVolume] = useState<number>(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return [volume, setVolume] as const;
};
