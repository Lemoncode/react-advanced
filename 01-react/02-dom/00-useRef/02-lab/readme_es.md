# Laboratorio Ref

Vamos a mostrar un video y mostrar un indicador de progreso
en segundos.

# Pasos iniciales

- Copia el proyecto de *boiler plate*.

- Instala las dependencias

```bash
npm install
```

- Vamos a mostrar un *tag* de video:

```diff
import React from "react";

export const App = () => {
-  return <h1>Hello React !!</h1>;
+  return (
+    <>
+      <video
+        autoPlay
+        muted
+      >
+        <source src="https://www.w3schools.com/html/movie.mp4" />
+      </video>
+      <p>
+        Minuto segundos actual / Duración del video
+      </p>
+    </>
+ )
};
```

# Desafío

- Ahora queremos mostrar el indicado de progreso... (minuto segundo actual y total duración).

# Pistas

- Pistas:
  - Mira el evento *onTimeUpdate*, eso se dispara cada vez que el video va avanzando.
  - ¿De dónde sacas en el segundo actual y la duración? :) huele a que vas a tener que usar *refs*...

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
