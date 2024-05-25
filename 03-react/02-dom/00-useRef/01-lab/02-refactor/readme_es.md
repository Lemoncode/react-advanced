# Refactor

Ya tenemos el player funcionando, pero el código que hemos dejado es una castaña, a poco que le vayamos metiendo más funcionalidad se va a convertir en un monstruo inmantenible. Vamos a refactorizarlo.

## Paso a paso

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
