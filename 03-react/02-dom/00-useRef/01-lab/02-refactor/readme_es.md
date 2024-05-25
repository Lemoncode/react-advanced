# Refactor

Ya tenemos el player funcionando, pero el código que hemos dejado es una castaña, a poco que le vayamos metiendo más funcionalidad se va a convertir en un monstruo inmantenible. Vamos a refactorizarlo.

## Paso a paso

### Refactorizando el markup

Lo primero vamos a simplificar el markup, ahora mismo tenemos un monstruito:

```tsx
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>Winamp</div>
      </div>
      <audio ref={audioRef}>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
      <div className={styles.controls}>
        <button className={styles.button} onClick={handlePlay}>
          <PlayIcon />
        </button>
        <button className={styles.button} onClick={handlePause}>
          <PauseIcon />
        </button>
        <button className={styles.button} onClick={handleStop}>
          <StopIcon />
        </button>
      </div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFilled}
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <p>Current Time: {Math.floor(currentTime)} seconds</p>
      </div>
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
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};
```

Si te fijas tenemos unas secciones bien definidas, ¿Y si se nos quedará el markup en algo así como?

```tsx
<div className={styles.container}>
  <Header />
  <audio ref={audioRef}>
    <source
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      type="audio/mpeg"
    />
    Your browser does not support the audio element.
  </audio>
  <Controls />
  <ProgressBar />
  <Volume />
</div>
```

> El component audio lo podríamos encapsular en un componente `Audio`, peros nos haría pasar la _ref_ al componente contenedor, esto lo veremos con las `forwardref`.

Vamos a crear una carpeta `components` y nos ponemos a refactorizar.

_./src/audio-player/components/header.tsx_

```tsx
export const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerText}>Winamp</div>
    </div>
  );
};
```

Y sacamos el CSS de header también:

_./src/audio-player/components/header.module.css_

```css
.header {
  background: linear-gradient(to right, #3a3a3a, #262626);
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.headerText {
  color: yellow;
  font-size: 20px;
}
```

Vamos a eliminar este CSS de la hoja del componente principal:

_./src/audio-player/audio-player.module.css_

```diff
.container {
  width: 350px;
  padding: 10px;
  background: black;
  color: white;
  border: 2px solid #000;
  border-radius: 10px;
  text-align: center;
  font-family: "Orbitron", sans-serif;
}

- .header {
-  background: linear-gradient(to right, #3a3a3a, #262626);
-  height: 40px;
-  display: flex;
-  align-items: center;
-  justify-content: center;
-  margin-bottom: 10px;
- }
-
- .headerText {
-  color: yellow;
-  font-size: 20px;
- }
```

Usamos estos estilos en el componente `Header`:

_./src/audio-player/components/header.tsx_

```diff
+ import styles from "./header.module.css";
```

Vamos a añadir un barrel:

_./src/audio-player/components/index.ts_

```tsx
export * from "./header";
```

Y reemplazamos enel componente principal:

_./src/audio-player/audio-player.component.tsx_

```diff
import React, { useState, useRef, useEffect } from "react";
import styles from "./audio-player.module.css";
import { PlayIcon, PauseIcon, StopIcon } from "./icons";
+ import { Header } from "./components";
```

```diff
  return (
    <div className={styles.container}>
-      <div className={styles.header}>
-        <div className={styles.headerText}>Winamp</div>
-      </div>
+     <Header />
      <audio ref={audioRef}>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
```

Vamos ahora a por la botonera de controles (play / pause / stop):

En este caso tendremos que exponer las funciones de control, así que vamos a pasarlas como props.

_./src/audio-player/components/controls.tsx_

```tsx
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
```

Aquí tenemos varias cosas:

- Los iconos no los encuentra, aquí podemos plantear:
  - Que estén en un sitio común.
  - Que estén directamente en SVG como recursos estático.
  - Ponerlo lo más cerca de donde se usan (si no se va a usar en otro sitio).

En este caso vamos a por la siguiente opción, lo mvemos justo debajo de components, movemos la carpeta `icons` y los iconos a la carpeta `components`, se nos queda así:

```
|- src
  |- audio-player
    |- components
      |- icons
        |- pause.svg
        |- play.svg
        |- stop.svg
      |- controls.tsx
      |- header.tsx
      |- index.ts
    |- audio-player.component.tsx
    |- audio-player.module.css
```

Vamos ahora a referenciarlo:

```diff
+ import { PlayIcon, PauseIcon, StopIcon } from "./icons";

interface ControlsProps {
```

Y vamos a sacar los estilos de la botonera:

_./src/audio-player/components/controls.module.css_

```css
.controls {
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
}

.button {
  background: transparent;
  border: none;
  cursor: pointer;
}
```

Y eliminarlos de la hoja principal:

_./src/audio-player/audio-player.module.css_

```diff
.container {
  width: 350px;
  padding: 10px;
  background: black;
  color: white;
  border: 2px solid #000;
  border-radius: 10px;
  text-align: center;
  font-family: "Orbitron", sans-serif;
}

- .controls {
-  display: flex;
-  justify-content: space-around;
-  margin: 10px 0;
- }

- .button {
-  background: transparent;
-  border: none;
-  cursor: pointer;
- }

.progressBarContainer {
```

Los importamos:

_./src/audio-player/components/controls.tsx_

```diff
+ import styles from "./controls.module.css";
```

Añadimos este componente al barrel de `components`:

_./src/audio-player/components/index.ts_

```diff
export * from "./header";
+ export * from "./controls";
```

Vamos a reemplazar en el componente principal:

_./src/audio-player/audio-player.component.tsx_

```diff
import { PlayIcon, PauseIcon, StopIcon } from "./components/icons";
- import { Header } from "./components";
+ import { Header, Controls } from "./components";


  return (
    <div className={styles.container}>
      <Header />
      <audio ref={audioRef}>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>

// (...)

  return (
    <div className={styles.container}>
      <Header />
      <audio ref={audioRef}>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
-      <div className={styles.controls}>
-        <button className={styles.button} onClick={handlePlay}>
-          <PlayIcon />
-        </button>
-        <button className={styles.button} onClick={handlePause}>
-          <PauseIcon />
-        </button>
-        <button className={styles.button} onClick={handleStop}>
-          <StopIcon />
-        </button>
+     <Controls
+       onPlay={handlePlay}
+       onPause={handlePause}
+       onStop={handleStop}
+     />
      </div>
      <div className={styles.progressBarContainer}>
```

Le toca el turno a la barra de progreso:

Analizamos que tenemos:

- Este control es de solo lectura.
- Recibe la duración y el tiempo actual.
- Pinta lo que haga falta

_./src/audio-player/components/progress-bar.tsx_

```tsx
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
```

Vamos a por los estilos:

_./src/audio-player/components/progress-bar.module.css_

```css
.progressBarContainer {
  margin-top: 10px;
}

.progressBar {
  height: 10px;
  background: #444;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progressFilled {
  height: 100%;
  background: yellow;
  width: 0%;
}
```

Los borramos del principal:

_./src/audio-player/audio-player.module.css_

```diff
.container {
  width: 350px;
  padding: 10px;
  background: black;
  color: white;
  border: 2px solid #000;
  border-radius: 10px;
  text-align: center;
  font-family: "Orbitron", sans-serif;
}

- .progressBarContainer {
-  margin-top: 10px;
- }
-
- .progressBar {
-  height: 10px;
-  background: #444;
-  border-radius: 5px;
-  overflow: hidden;
-  position: relative;
- }
-
- .progressFilled {
-  height: 100%;
-  background: yellow;
-  width: 0%;
- }
-
.volume {
```

Y lo importamos en el componente:

_./src/audio-player/components/progress-bar.tsx_

```diff
+ import styles from "./progress-bar.module.css";
```

Y lo añadimos al barrel:

_./src/audio-player/components/index.ts_

```diff
export * from "./header";
export * from "./controls";
+ export * from "./progress-bar";
```

Y lo usamos en el componente principal:

_./src/audio-player/audio-player.component.tsx_

```diff
import styles from "./audio-player.module.css";
- import { PlayIcon, PauseIcon, StopIcon } from "./components/icons";
- import { Header, Controls } from "./components";
+ import { Header, Controls, ProgressBar } from "./components";
```

```diff
      </audio>
      <Controls onPlay={handlePlay} onPause={handlePause} onStop={handleStop} />

-      <div className={styles.progressBarContainer}>
-        <div className={styles.progressBar}>
-          <div
-            className={styles.progressFilled}
-            style={{ width: `${(currentTime / duration) * 100}%` }}
-          ></div>
-        </div>
-        <p>Current Time: {Math.floor(currentTime)} seconds</p>
-      </div>
+     <ProgressBar currentTime={currentTime} duration={duration} />
      <div className={styles.volume}>
```

Ya sólo nos queda el control de volumen, vamos a ello:

_./src/audio-player/components/volume.component.tsx_

```tsx
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
```

Los estilos...

_./src/audio-player/components/volume.module.css_

```css
.volume {
  margin-top: 10px;
}

.slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 10px;
  background: #444;
  border-radius: 5px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background: yellow;
  cursor: pointer;
  border-radius: 50%;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background: yellow;
  cursor: pointer;
  border-radius: 50%;
}
```

Los eliminamos del principal:

_./src/audio-player/audio-player.module.css_

```diff
- .volume {
-  margin-top: 10px;
- }
-
- .slider {
-  width: 100%;
-  -webkit-appearance: none;
-  appearance: none;
-  height: 10px;
-  background: #444;
-  border-radius: 5px;
-  outline: none;
- }
-
- .slider::-webkit-slider-thumb {
-  -webkit-appearance: none;
-  appearance: none;
-  width: 15px;
-  height: 15px;
-  background: yellow;
-  cursor: pointer;
-  border-radius: 50%;
- }
-
- .slider::-moz-range-thumb {
-  width: 15px;
-  height: 15px;
-  background: yellow;
-  cursor: pointer;
-  border-radius: 50%;
- }
```

Añadimos el import:

_./src/audio-player/components/volume.tsx_

```diff
+ import styles from "./volume.module.css";
```

Lo añadimos al barrel:

_./src/audio-player/components/index.ts_

```diff
export * from "./header";
export * from "./controls";
export * from "./progress-bar";
+ export * from "./volume.component";
```

Y lo usamos en el componente principal:

_./src/audio-player/audio-player.component.tsx_

```diff
import styles from "./audio-player.module.css";
- import { Header, Controls, ProgressBar } from "./components";
+ import { Header, Controls, ProgressBar, Volume } from "./components";

// (...)

      <ProgressBar currentTime={currentTime} duration={duration} />
-      <div className={styles.volume}>
-        <label htmlFor="volume">Volume: </label>
-        <input
-          id="volume"
-          className={styles.slider}
-          type="range"
-          min="0"
-          max="1"
-          step="0.01"
-          value={volume}
-          onChange={handleVolumeChange}
-        />
-      </div>
-    </div>
+    <Volume volume={volume} onVolumeChange={handleVolumeChange} />
```

Esta vez tenemos que hacer un cambios más, hemo simplificado el valor que devolvemos en el `onChange` del `input`, ahora es directamente el número, así si en un futuro cambiaramos a otro tipo de componente en el hijo no impactaría al padre.

Vamos a cambiarlo en el player principal:

_./src/audio-player/audio-player.component.tsx_

```diff
-  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
+  const handleVolumeChange = (newVolume: number) => {
-    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
```

Y ya tenemos la parte de markup, fijate que ahora:

- De un plumazo sabes que secciones ahí.
- Si tienes que modificar una, puedes ir directamente a ella y no tienes ruido.
- Lo mismo con el CSS cada trozo tiene los suyos y son ficheros pequeños y manejables.
- También si varios compañeros tienen que trabajar en por ejemplo mejorar las diferentes partes, cada uno va a estar en su fichero y no se van a pisar.

Ahora toca centrarnos en código, también está un poco desordenado, vamos a refactorizarlo.

### Refactorizando el código

Aquí debemos tener cuidado, un error común que se suele cometer es:

Meto toda la lógica del componente en un hook y a tirar millas

Esto suele ser mala idea, porque al final lo que estoy haciendo es "llevar todo la mierda" a otro sitio.

Lo ideal es sacar hooks que hagan una cosa y bien, que sean fácilmente testeables e incluso en algún caso candidatos a ser reutilizados.

Un primero candidato a hook podría ser el que se encarga de calcular la duración del audio, vamos a ello:

_./src/audio-player/hooks/use-audio-duration.hook.ts_

```tsx
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
```

Vamos a crear un barrel:

_./src/audio-player/hooks/index.ts_

```tsx
export * from "./use-audio-duration.hook";
```

Vamos a reemplazarlo en el componente principal:

_./src/audio-player/audio-player.component.tsx_

```diff
import React, { useState, useRef, useEffect } from "react";
import styles from "./audio-player.module.css";
import { Header, Controls, ProgressBar, Volume } from "./components";
+ import { useAudioDuration } from "./hooks";

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
-  const [duration, setDuration] = useState<number>(0);
+  const duration = useAudioDuration(audioRef);

-  useEffect(() => {
-    if (audioRef.current) {
-      audioRef.current.onloadedmetadata = () => {
-        setDuration(audioRef.current?.duration ?? 0);
-      };
-    }
-  }, []);

  useEffect(() => {
```

Vamos a hacer un refactor con el progreso del audio:

_./src/audio-player/hooks/use-audio-progress.hook.ts_

```tsx
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
```

Lo añadimos al barrel:

_./src/audio-player/hooks/index.ts_

```diff
export * from "./use-audio-duration.hook";
+ export * from "./use-audio-progress.hook";
```

Y lo reemplazamos:

_./src/audio-player/audio-player.component.tsx_

```diff
import React, { useState, useRef, useEffect } from "react";
import styles from "./audio-player.module.css";
import { Header, Controls, ProgressBar, Volume } from "./components";
- import { useAudioDuration } from "./hooks";
+ import { useAudioDuration, useAudioProgress } from "./hooks";
```

```diff
export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState<number>(1);
-  const [currentTime, setCurrentTime] = useState<number>(0);
+ const currentTime = useAudioProgress(audioRef);
  const duration = useAudioDuration(audioRef);

-  useEffect(() => {
-    const updateProgress = () => {
-      if (audioRef.current) {
-        setCurrentTime(audioRef.current.currentTime);
-      }
-    };
-
-    const interval = setInterval(updateProgress, 1000);
-
-    return () => clearInterval(interval);
-  }, []);

  const handleVolumeChange = (newVolume: number) => {
```

Para terminar (aunque este paso igual no haría falta) podemos pasar también a hook la gestión de volumen, que tiene algún truquito:

_./src/audio-player/hooks/use-audio-volume.hook.ts_

```tsx
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
```

Lo añadimos al barrel:

_./src/audio-player/hooks/index.ts_

```diff
export * from "./use-audio-duration.hook";
export * from "./use-audio-progress.hook";
+ export * from "./use-audio-volume.hook";
```

Y lo reemplazamos:

_./src/audio-player/audio-player.component.tsx_

```diff
import React, { useState, useRef, useEffect } from "react";
import styles from "./audio-player.module.css";
import { Header, Controls, ProgressBar, Volume } from "./components";
- import { useAudioDuration, useAudioProgress } from "./hooks";
+ import { useAudioDuration, useAudioProgress, useAudioVolume } from "./hooks";
```

```diff
export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
-  const [volume, setVolume] = useState<number>(1);
+  const [volume, setVolume] = useAudioVolume(audioRef);
  const currentTime = useAudioProgress(audioRef);
  const duration = useAudioDuration(audioRef);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
-    if (audioRef.current) {
-      audioRef.current.volume = newVolume;
-    }
  };

  const handlePlay = () => {
    audioRef.current?.play();
  };
```

### Mejoras

Cosas que se podrían mejorar:

- `useAudioVolume`y `useAudioDuration`:
  - Deberían de devolver un objeto mejor que sólo el valor, ya que esto podría crecer a futuro.
  - También AudioVolume y Audio Duration podríamos haberlo agrupado en un hook, pero eso ya depende un poco de las preferencias de cada uno.

- El elemento audio lo podrámos meter en un subcomponente, eso lo haremos con las forwardref.

Una opción más tipo "fumada":
  - Podríamos crear un elemento audio:
    - Que fuera sin diseño, es decir la funcionalidad pura.
    - Este tiene un children para renderizar.
    - Con render props podemos pasarle los handlers y los valores.

Sería como un "headless audio".

su uso podría ser algo así como:

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

```tsx
export const HeadlessAudioPlayer: React.FC = ({ children }) => {
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
    audioRef.current.currentTime = 0;
  };

  return children({
    play: handlePlay,
    pause: handlePause,
    stop: handleStop,
    currentTime,
    duration,
    volume,
    setVolume,
  });
};
```
