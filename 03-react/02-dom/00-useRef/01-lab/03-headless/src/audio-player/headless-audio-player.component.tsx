import React, { useRef } from "react";
import { useAudioDuration, useAudioProgress, useAudioVolume } from "./hooks";

interface ChildrenProps {
  play: () => void;
  pause: () => void;
  stop: () => void;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (volume: number) => void;
}

interface Props {
  children: (childrenProps: ChildrenProps) => React.ReactNode;
}

export const HeadlessAudioPlayer: React.FC<Props> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useAudioVolume(audioRef);
  const currentTime = useAudioProgress(audioRef);
  const duration = useAudioDuration(audioRef);

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
    <>
      <audio ref={audioRef}>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
      {children({
        play: handlePlay,
        pause: handlePause,
        stop: handleStop,
        currentTime,
        duration,
        volume,
        setVolume,
      })}
    </>
  );
};
