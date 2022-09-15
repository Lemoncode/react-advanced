# Laboratorio Ref

Vamos a mostrar un video y mostrar un indicador de progreso
en segundos.

# Pasos iniciales

- Copia el proyecto de boiler plate.

- Instala las dependencias

```bash
npm install
```

- Vamos a mostrar un tag de video:

```diff
import React from "react";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return (
+    <>
+      <video
+        ref={vRef}
+        autoPlay
+        muted
+        onTimeUpdate={onTimeUpdate}
+      >
+        <source src="https://www.w3schools.com/html/movie.mp4" />
+      </video>
+      <p>
+        Minuto segundos actual / Duración del video
+      </p>
+    </div>
)
};
```

# Desafío

- Ahora queremos mostrar el indicado de progreso... (minuto segundo actual y total duración).

# Pistas

- Pistas:
  - Mira el evento onTimeUpdate, eso se dispara cada vez que el video va avanzando.
  - ¿De donde sacas en el segundo actual y la duración? :) huele a que vas a tener que usar refs...
