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

# ¿Y esto?

Es útil dependiende del escenario, algunas librerías famosas:

- Tan Stack headless table (no es exactamente render props pero se parece).

- [Downshift](https://github.com/downshift-js/downshift): Downshift es una librería para crear componentes de selección como autocompletados, menús desplegables, y más. Utiliza render props para proporcionar control total sobre el comportamiento y la apariencia de los componentes.

```tsx
<Downshift
  onChange={(selection) => alert(`You selected ${selection}`)}
  itemToString={(item) => (item ? item.value : "")}
>
  {({
    getInputProps,
    getItemProps,
    getMenuProps,
    isOpen,
    inputValue,
    highlightedIndex,
    selectedItem,
  }) => (
    <div>
      <input {...getInputProps()} />
      <ul {...getMenuProps()}>
        {isOpen
          ? items
              .filter((item) => !inputValue || item.value.includes(inputValue))
              .map((item, index) => (
                <li
                  {...getItemProps({
                    key: item.id,
                    index,
                    item,
                    style: {
                      backgroundColor:
                        highlightedIndex === index ? "lightgray" : "white",
                      fontWeight: selectedItem === item ? "bold" : "normal",
                    },
                  })}
                >
                  {item.value}
                </li>
              ))
          : null}
      </ul>
    </div>
  )}
</Downshift>
```

- [React-Motion](https://github.com/chenglou/react-motion): React-Motion es una librería para animaciones en React. Utiliza render props para permitir a los desarrolladores definir cómo se deben renderizar las animaciones.

```tsx
<Motion defaultStyle={{ x: 0 }} style={{ x: spring(10) }}>
  {(value) => <div>{value.x}</div>}
</Motion>
```

- Y incluso alguna tool simple como [React CopyToClipboard](https://github.com/nkbt/react-copy-to-clipboard):

```tsx
import { CopyToClipboard } from "react-copy-to-clipboard";

function MyComponent() {
  return (
    <CopyToClipboard text="Hello, world!" onCopy={() => alert("Copied!")}>
      {({ copy }) => <button onClick={copy}>Copy to clipboard</button>}
    </CopyToClipboard>
  );
}
```
