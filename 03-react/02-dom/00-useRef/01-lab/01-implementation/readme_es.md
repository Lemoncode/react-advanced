# Le damos caña al audio

Nos han dejado un cartón piedra muy bonito de player, pero claro ahora mismo no suena, vamos a darle caña...

## Primer paso

Si nos vamos al componente audio player, vemos que hay un componente `audio` que tiene un atributo `src` que es la url del audio que queremos reproducir.

Vamos a ver si suena, para ello podemos probar a poner `controls` en el elemento `audio` para que nos aparezcan los controles de reproducción.

```diff
      <div className={styles.header}>
        <div className={styles.headerText}>Winamp</div>
      </div>
-      <audio>
+      <audio controls>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
```

Vale... al menos sabemos que funciona, pero no podemos presentar esto, ... lo que que quieren ese que la funcionalidad esté integrada en el reproductor.

Así que quitamos le controls y vamos a hacerlo nosotros.

```diff
      <div className={styles.header}>
        <div className={styles.headerText}>Winamp</div>
      </div>
+      <audio>
-      <audio controls>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
```

¿Qué me hace falta? Pues tener una referencia al elemento `audio` para poder controlarlo, así que vamos a crear un `useRef` para ello.

```diff
- import React, { useState } from "react";
+ import React, { useState, useRef } from "react";
import styles from "./audio-player.module.css";
import { PlayIcon, PauseIcon, StopIcon } from "./icons";

export const AudioPlayer: React.FC = () => {
+  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [volume] = useState<number>(1);
```

Y lo referenciamos al componente audio:

```diff
      </div>
-      <audio>
+      <audio ref={audioRef}>
        <source
          src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
```

Ahora que tenemos la referencia al elemento audio, podemos enlazar los botones de play, pause y stop.

Empezamos por el play:

```diff
  const handlePlay = () => {
-    console.log("Aquí debería empezar a sonar la música");
+    audioRef.current?.play();
  };
```

¿Qué hacemos aquí? Tenemos la referencia al elemento audio, y llamamos al método `play` del elemento audio, el interrogante nos sirve como guarda, por si por lo que fuera no estuviera definido el elemento audio.

Vamos a probarlo:

Te toca a ti, implementa el botón de pausa y el de stop.

Pistas: - Para el de pausa busca el elemento `pause` del elemento audio. - Para el stop ¿Qué es un stop? Pues que lo pausas y lo pones en el segundo 0 de la canción, busca como hacerlo.

Solucíon:

```diff
  const handlePause = () => {
-    console.log("Aquí debería pausarse la música");
+    audioRef.current?.pause();
  };

  const handleStop = () => {
-    console.log("Aquí debería detenerse la música y ponerse al principio");
+    audioRef.current?.pause();
+    if(audioRef.current) {
+      audioRef.current.currentTime = 0;
+    }
  };
```

Oye y mostrar cuanto tiempo lleva la canción, ¿cómo lo hacemos? Te toca de nuevo.

Pistas: - El tiempo nos lo da el atributo `currentTime` del elemento audio que hemos usado antes. - Lo que nos hace falta es una forma de ir leyéndolo cada X tiempo y que se actulice. - ¿Qué podemos hacer? Pues un `setInterval` que cada X tiempo lea el `currentTime` y tenemos ya dos state, uno para el `currentTime` y otro con la duración de la misma (así podemos motrar una barra de progreso). - ¿Donde lo enganchamos? En un `useEffect` que se ejecute cuando el audio cambie de estado.

Solución:

```diff
- import React, { useState, useRef } from "react";
+ import React, { useState, useRef, useEffect } from "react";
import styles from "./audio-player.module.css";
import { PlayIcon, PauseIcon, StopIcon } from "./icons";

export const AudioPlayer: React.FC = () => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [volume] = useState<number>(1);
-  const [currentTime] = useState<number>(0);
+  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration] = useState<number>(0);

+  useEffect(() => {
+    const updateProgress = () => {
+      if (audioRef.current) {
+        setCurrentTime(audioRef.current.currentTime);
+      }
+    };
+
+    const interval = setInterval(updateProgress, 1000);
+
+    return () => clearInterval(interval);
+  }, []);


  const handleVolumeChange = () => {
    console.log("Aquí debería cambiar el volumen");
  };
```

Vamos ahora a sacar la duración total de la canción y así se puede hacer el calculo de la barra de progreso, para ello podemos tirar de los metadatos del audio.

```diff
  const [currentTime, setCurrentTime] = useState<number>(0);
-  const [duration] = useState<number>(0);
+  const [duration, setDuration] = useState<number>(0);

+ useEffect(() => {
+    if (audioRef.current) {
+      audioRef.current.onloadedmetadata = () => {
+        setDuration(audioRef.current?.duration ?? 0);
+      };
+    }
+  }, []);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, []);
```

Si te fijas aquí usamos dos `useEffect` ¿Por qué? Pues para que el código sea más legible, cada uno de estos hace una cosa y una sóla cosa, podrían ser candidatos a ser extraidos a un hook, pero por ahora nos vale así.

Por último vamos a por el volumen:

```diff
export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
-  const [volume] = useState<number>(1);
+  const [volume, setVolume] = useState<number>(1);
```

```diff
-  const handleVolumeChange = () => {
+  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
-    console.log("Aquí debería cambiar el volumen")
+    const newVolume = parseFloat(event.target.value);
+    setVolume(newVolume);
+    if (audioRef.current) {
+      audioRef.current.volume = newVolume;
+    }
  };
```
