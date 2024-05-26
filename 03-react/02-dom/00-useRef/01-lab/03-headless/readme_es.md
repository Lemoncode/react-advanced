# Headles player

Vamos a terminar con una fumada, vamos a crear un `headlessPlayer` y así que podamos implementar los players que veamos manteniendo el cogollo de funcionalidad.

## Paso a paso

Una opción más tipo "fumada":

- Podríamos crear un elemento audio:
  - Que fuera sin diseño, es decir la funcionalidad pura.
  - Este tiene un children para renderizar.
  - Con render props podemos pasarle los handlers y los valores.

Sería como un "headless audio".

su uso podría ser algo así como:

_./src/audio-player/headless-audioaudio-player.tsx_

```tsx
<HeadlessAudioPlayer>
  {({ play, pause, stop, currentTime, duration, volume, setVolume }) => (
    <>
      <Header />
      <Controls onPlay={play} onPause={pause} onStop={stop} />
      <ProgressBar currentTime={currentTime} duration={duration} />
      <Volume volume={volume} onVolumeChange={setVolume} />
    </>
  )}
</HeadlessAudioPlayer>
```

Y la implementación de `HeadlesAudioPlayer` sería algo así como:

_./src/audio-player/headless-audio-player.tsx_

```tsx
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
```

Y ahora en audio-player podemos refactorizar:

_./src/audio-player/audio-player.tsx_

```diff
import React, { useRef } from "react";
import styles from "./audio-player.module.css";
import { Header, Controls, ProgressBar, Volume } from "./components";
- import { useAudioDuration, useAudioProgress, useAudioVolume } from "./hooks";
+ import { HeadlessAudioPlayer } from "./headless-audio-player";

export const AudioPlayer: React.FC = () => {
-  const audioRef = useRef<HTMLAudioElement>(null);
-  const [volume, setVolume] = useAudioVolume(audioRef);
-  const currentTime = useAudioProgress(audioRef);
-  const duration = useAudioDuration(audioRef);
-
-  const handleVolumeChange = (newVolume: number) => {
-    setVolume(newVolume);
-  };
-
-  const handlePlay = () => {
-    audioRef.current?.play();
-  };
-
-  const handlePause = () => {
-    audioRef.current?.pause();
-  };
-
-  const handleStop = () => {
-    audioRef.current?.pause();
-    if (audioRef.current) {
-      audioRef.current.currentTime = 0;
-    }
-  };
-
  return (
-    <div className={styles.container}>
-      <Header />
-      <audio ref={audioRef}>
-        <source
-          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
-          type="audio/mpeg"
-        />
-        Your browser does not support the audio element.
-      </audio>
-      <Controls onPlay={handlePlay} onPause={handlePause} onStop={handleStop} />
-
-      <ProgressBar currentTime={currentTime} duration={duration} />
-      <Volume volume={volume} onVolumeChange={handleVolumeChange} />
-    </div>
+    <HeadlessAudioPlayer>
+      {({ play, pause, stop, currentTime, duration, volume, setVolume }) => (
+        <div className={styles.container}>
+          <Header />
+          <Controls onPlay={play} onPause={pause} onStop={stop} />
+          <ProgressBar currentTime={currentTime} duration={duration} />
+          <Volume volume={volume} onVolumeChange={setVolume} />
+        </div>
+      )}
  );
};
```
