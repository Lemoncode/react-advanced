# 00 Render Prop

## Resumen

Poder hacer animaciones mientras se hace *scroll* y se vea a nivel de página es algo muy interesante,
vamos a ver que trae *framer* para estos casos.

## Paso a Paso

- Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

```bash
npm install
```

- Si partimos del *boiler plate* necesitaremos instalar el paquete
  de framer/motion

```bash
npm install framer-motion --save
```

- Vamos a empezar por controlar el *scroll* a nivel de página.

- Para ello vamos a crear un componente que tenga un montón de texto _loremp ipsum_.

_./src/components/lorem-ipsum.component.tsx_

```tsx
import React from "react";

export function LoremIpsum() {
  return (
    <>
      <article>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac
          rhoncus quam.
        </p>
        <p>
          Fringilla quam urna. Cras turpis elit, euismod eget ligula quis,
          imperdiet sagittis justo. In viverra fermentum ex ac vestibulum.
          Aliquam eleifend nunc a luctus porta. Mauris laoreet augue ut felis
          blandit, at iaculis odio ultrices. Nulla facilisi. Vestibulum cursus
          ipsum tellus, eu tincidunt neque tincidunt a.
        </p>
        <h2>Sub-header</h2>
        <p>
          In eget sodales arcu, consectetur efficitur metus. Duis efficitur
          tincidunt odio, sit amet laoreet massa fringilla eu.
        </p>
        <p>
          Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna.
          Mauris id mauris vel arcu commodo venenatis. Aliquam eu risus arcu.
          Proin sit amet lacus mollis, semper massa ut, rutrum mi.
        </p>
        <p>Sed sem nisi, luctus consequat ligula in, congue sodales nisl.</p>
        <p>
          Vestibulum bibendum at erat sit amet pulvinar. Pellentesque pharetra
          leo vitae tristique rutrum. Donec ut volutpat ante, ut suscipit leo.
        </p>
        <h2>Sub-header</h2>
        <p>
          Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
          aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
          sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
          metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
          enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
          pretium.
        </p>
        <p>
          Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
          elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
          ultricies, mollis mi in, euismod dolor.
        </p>
        <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
        <p>
          Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna.
          Mauris id mauris vel arcu commodo venenatis. Aliquam eu risus arcu.
          Proin sit amet lacus mollis, semper massa ut, rutrum mi.
        </p>
        <p>Sed sem nisi, luctus consequat ligula in, congue sodales nisl.</p>
        <p>
          Vestibulum bibendum at erat sit amet pulvinar. Pellentesque pharetra
          leo vitae tristique rutrum. Donec ut volutpat ante, ut suscipit leo.
        </p>
        <h2>Sub-header</h2>
        <p>
          Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
          aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
          sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
          metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
          enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
          pretium.
        </p>
        <p>
          Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
          elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
          ultricies, mollis mi in, euismod dolor.
        </p>
        <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
        <h2>Sub-header</h2>
        <p>
          Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
          aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
          sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
          metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
          enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
          pretium.
        </p>
        <p>
          Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
          elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
          ultricies, mollis mi in, euismod dolor.
        </p>
        <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
        <h2>Sub-header</h2>
        <p>
          Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
          aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
          sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
          metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
          enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
          pretium.
        </p>
        <p>
          Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
          elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
          ultricies, mollis mi in, euismod dolor.
        </p>
        <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
        <h2>Sub-header</h2>
        <p>
          Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
          aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
          sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
          metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
          enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
          pretium.
        </p>
        <p>
          Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
          elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
          ultricies, mollis mi in, euismod dolor.
        </p>
        <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
        <h2>Sub-header</h2>
        <p>
          Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
          aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
          sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
          metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
          enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
          pretium.
        </p>
        <p>
          Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
          elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
          ultricies, mollis mi in, euismod dolor.
        </p>
        <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
        <h2>Sub-header</h2>
        <p>
          Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
          aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
          sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
          metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
          enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
          pretium.
        </p>
        <p>
          Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
          elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
          ultricies, mollis mi in, euismod dolor.
        </p>
        <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
        <h2>Sub-header</h2>
        <p>
          Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
          aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
          sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
          metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
          enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
          pretium.
        </p>
        <p>
          Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
          elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
          ultricies, mollis mi in, euismod dolor.
        </p>
        <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
        <h2>Sub-header</h2>
        <p>
          Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla
          aliquet. Pellentesque auctor vehicula malesuada. Aliquam id feugiat
          sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula
          metus ac, interdum nibh. Curabitur vitae convallis ligula. Integer ac
          enim vel felis pharetra laoreet. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Pellentesque hendrerit ac augue quis
          pretium.
        </p>
        <p>
          Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique,
          elit metus efficitur elit, ac pretium sapien nisl nec ante. In et ex
          ultricies, mollis mi in, euismod dolor.
        </p>
        <p>Quisque convallis ligula non magna efficitur tincidunt.</p>
      </article>
    </>
  );
}
```

- Y vamos a añadirlo a la página principal:

_./src/app.tsx_

```tsx
import React from "react";
import { LoremIpsum } from "./components/lorem-ipsum.component";

export const App = () => {
  return (
    <>
      <LoremIpsum />
    </>
  );
};
```

- Ahora vamos a crear un componente que nos permita tener *feedback* visual del *scroll*,
  para ello vamos a crear un *div* que se vaya poniendo de color rojo conforme vayamos llegando
  a cierto punto de progreso, para ello, creamos el armazón:

_./src/components/progress-bar.component.css_

```css
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  background: Aquamarine;
  transform-origin: 0%;
}
```

_./src/components/progress-bar.component.tsx_

```tsx
import React from "react";
import { motion, MotionValue } from "framer-motion";
import classes from "./progress-bar.component.css";

interface Props {
  progress: MotionValue<number> | number; // Value in between 0 and 1
}

export const ProgressBar = ({ progress }: Props) => {
  return (
    <>
      <motion.div
        className={classes.progressBar}
        style={{
          scaleX: progress,
        }}
      />
    </>
  );
};
```

- Vamos añadir el *progress bar* a la aplicación:

_./src/app.tsx_

```diff
import React from "react";
import { LoremIpsum } from "./components/lorem-ipsum.component";
+ import { ProgressBar } from "./components/progress-bar.component";

export const App = () => {
  return (
    <>
+     <ProgressBar progress={0.5} />
      <LoremIpsum />
    </>
  );
};
```

- Y ahora vamos a usar el *hook* de *framer* para *tracker* el *scroll useScroll* (por defecto a nivel de página), y vamos a mapear el valor que da entre 0 y 1 para transformarlo a ancho del *div* *qué* queremos mostrar.

_./src/app.tsx_

```diff
import React from "react";
import { LoremIpsum } from "./components/lorem-ipsum.component";
import { ProgressBar } from "./components/progress-bar.component";
+ import { useScroll } from "framer-motion";

export const App = () => {
+  const { scrollYProgress } = useScroll();

  return (
    <>
      <ProgressBar
-        progress={0.5}
+        progress={scrollYProgress}
      />
      <LoremIpsum />
    </>
  );
};
```

- Ya podemos quitar de las *Props* de *ProgressBar* el tipado a *number*, lo usamos para ver un ejemplo visual y ya no sería necesario.

_./src/components/progress-bar.component.tsx_

```diff
import React from "react";
import { motion, MotionValue } from "framer-motion";
import classes from "./progress-bar.component.css";

interface Props {
-  	progress: MotionValue<number> | number;
+	progress: MotionValue<number>;
}
```

- Fíjate lo que obtenemos ahora.

```bash
npm start
```

- Esto está muy bien, pero ¿y si tuviéramos dos *divs* con *scroll*? Usando las *refs* de React podemos hacer que el *scroll* se refiera a un elemento en concreto. Vamos a por ello:

Vamos a crear un contenedor *flex* para mostrar dos *divs*.

_./src/app.css_

```css
.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}
```

Y vamos a instanciar dos *loremipsum*, uno a la izquierda y otro a la derecha.

_./src/app.tsx_

```diff
import React from "react";
import { LoremIpsum } from "./components/lorem-ipsum.component";
import { ProgressBar } from "./components/progress-bar.component";
import { useScroll } from "framer-motion";
+ import classes from "./app.css";
```

_./src/app.tsx_

```diff
  return (
-    <>
+    <div className={classes.container}>
+      <div style={{ width: "200px" }}>
        <ProgressBar progress={scrollYProgress} />
        <LoremIpsum />
+      </div>
+      <div style={{ width: "200px" }}>
+        <ProgressBar progress={scrollYProgress} />
+        <LoremIpsum />
+      </div>
-    </>
+    </div>
  );
```

- Los progress bar vamos quitarle la posición absoluta

_./src/components/progress-bar.component.css_

```diff
.progress-bar {
-  position: fixed;
-  top: 0;
-  left: 0;
-  right: 0;
  height: 10px;
  background: Aquamarine;
  transform-origin: 0%;
}
```

Y en el *lorem ipsum* lo encapsulamos en un div con un *overflow* auto:

_./src/components/lorem-ipsum.component.tsx_

```diff
import React from "react";

export function LoremIpsum() {
  return (
-    <>
+    <div style={{ height: "300px", overflow: "auto", border: "1px solid red" }}>
    // (...)
-    </>
+    </div>
```

Ahora queremos enganchar el *useScroll* con cada *div*, para ello tenemos que sacarlo como *ref* de cada componente (podemos usar *forwardref*), y ya acoplarlo al *useScroll*.

_./src/components/lorem-ipsum.component.tsx_

```diff
import React from "react";

- export function LoremIpsum() {
+ export const LoremIpsum = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div style={{ height: 300px, overflow: auto, borxer: 1px solid red }}
+      ref={ref}
    >

    //(...)
- };
+ });
```

Y en el *app.tsx* vamos a engancharlo con el *useScroll*:

_./src/app.tsx_

```diff
// (...)

export const App = () => {
+ const refDivTextA = React.useRef(null);
+ const refDivTextB = React.useRef(null);

// (...)

      <div>
        <ProgressBar progress={currentPosition} />
-        <LoremIpsum />
+        <LoremIpsum ref={refDivTextA} />
      </div>
      <div>
        <ProgressBar progress={currentPosition} />

-        <LoremIpsum />
+        <LoremIpsum ref={refDivTextB} />
      </div>

```

Y vamos a enlzarlos con el useScroll:

_./src/app.tsx_

```diff
-  const { scrollYProgress } = useScroll();
+  const { scrollYProgress: scrollYProgressA } = useScroll({ container: refDivTextA });
+  const { scrollYProgress: scrollYProgressB } = useScroll({ container: refDivTextB });
```

Y vamos a pasarle el valor de cada uno a su progress bar:

```diff
      <div>
-        <ProgressBar progress={scrollYProgress} />
+        <ProgressBar progress={scrollYProgressA} />

        <LoremIpsum />
      </div>
      <div>
-        <ProgressBar progress={scrollYProgress} />
+        <ProgressBar progress={scrollYProgressB} />
        <LoremIpsum />
      </div>
```

- Vamos a probar a ver qué tal queda esto:

```bash
npm start
```

También podrías implementar un indicador circular:

- Vamos primero al *progress-bar.component.tsx*, y añadimos *svg* circular y *motion.circle*:

./src/components/progress-bar.component.tsx

```diff
<>
+      <svg id="progress" width="100" height="100" viewBox="0 0 100 100">
+        <circle
+          cx="50"
+          cy="50"
+          r="30"
+          className={classes.backgroundCircle}
+        />
+        <motion.circle
+          cx="50"
+          cy="50"
+          r="30"
+          className={classes.indicatorCircle}
+          style={{ pathLength: progress }}
+        />
+      </svg>
      <motion.div
        className={classes.progressBar}
        style={{
          scaleX: progress,
        }}
      />
    </>
```

- Añadimos sus estilos

./src/components/progress-bar.component.css_

```diff
.progress-bar {
  height: 10px;
  background: Aquamarine;
  transform-origin: 0%;
}

+ circle {
+  stroke-dashoffset: 0;
+  stroke-width: 15%;
+  fill: none;
+ }

+ .background-circle {
+   stroke: Aquamarine;
+   opacity: 0.4;
+ }

+ .indicator-circle {
+   stroke: Aquamarine;
+ }
```

Y vemos que nos funcionaría perfectamente tanto la barra y el círculo de progreso en la lectura del *loremipsum*.

