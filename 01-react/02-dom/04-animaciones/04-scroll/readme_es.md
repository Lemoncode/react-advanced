# 00 Render Prop

## Resumen

Poder hacer animaciones mientras se hace scroll se a nivel de página es algo muy interesante,
vamos a ver que trae framer para estos casos.

## Paso a Paso

- Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Si partimos del boiler plate necesitaremos instalar el paquete
  de framer/motion

```bash
npm install framer-motion --save
```

- Vamos a empezar por controlar el scroll a nivel de página.

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
import { LoremIpsum } from "/src/components/lorem-ipsum.component.tsx";

export const App = () => {
  return (
    <>
      <LoremIpsum />
    </>
  );
};
```

- Ahora vamos a crear un componente que nos permita tener feedback visual del scroll,
  para ello vamos a crear un div que se vaya poniendo de color rojo conforme vayamos llegando
  a cierto punto de progreso, para ello, creamos el armazon:

_./src/components/progress-bar.css_

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

_./src/components/progress-bar.tsx_

```tsx
import React from "react";
import { motion } from "framer-motion";
import classes from "./progress-bar.components.css";

interface Props {
  progress: number; // Value in between 0 and 1
}

export const ProgressBar = ({ progress }: Props) => {
  return (
    <motion.div
      className={classes.progressBar}
      style={{
        transform: `scaleX(${progress})`,
      }}
    />
  );
};
```

- Vamos añadir el progress bar a la aplicaión:

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

- Y ahora vamos a usar el hook de framer para tracker el scroll _useScroll_ (por defecto a nivel de página), y vamos a mapear el valor que da entre 0 y 1 para transformalo a ancho del div
  que queremos mostrar.

_./src/app.tsx_

```diff
import React from "react";
import { LoremIpsum } from "./components/lorem-ipsum.component";
import { ProgressBar } from "./components/progress-bar.component";
+ import { useScroll } from "framer-motion";

export const App = () => {
+  const { scrollYProgress } = useScroll();
+  const [currentPosition, setcurrentPosition] = React.useState(0);

+  React.useEffect(() => {
+    return scrollYProgress.onChange((latest) => {
+      setcurrentPosition(latest);
+    });
+  }, []);

  return (
    <>
      <ProgressBar
-        progress={0.5}
+        progress={currentPosition}
      />
      <LoremIpsum />
    </>
  );
};
```

- Fijate lo que obtenemos ahora.

```bash
npm start
```

- Esto está muy bien, pero ¿y si tuvieramos dos divs con scroll? Usando las _refs_ de react podemos hacer que el scroll se refiera a un elemento en concreto. Vamos a por ello:

Vamos a crear un contenedor flex para mostrar dos divs.

_./src/app.css_

```css
.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}
```

Y vamos a instanciar dos loremipsum, uno a la izquierda y otro a la derecha.

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
+      <div>
        <ProgressBar progress={currentPosition} />
        <LoremIpsum />
+      </div>
+      <div>
+        <ProgressBar progress={currentPosition} />
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

Y en el lorem ipsum lo encapsulamos en un div con un overflow auto:

_./src/components/lorem-ipsum.component.tsx_

```diff
import React from "react";

export function LoremIpsum() {
  return (
-    <>
+    <div style={{height: 300px, overflow: auto, borxer: 1px solid red}}>
    // (...)
-    </>
+    </div>
```

Ahora queremos enganchar el useScroll con cada div, para ello
tenemos que sacarlo como ref de cada componente (podemos usar
\_forwardref), y ya acoplarlo al useScroll.

_./src/components/lorem-ipsum.component.tsx_

```diff
import React from "react";
+ import { forwardRef } from "react";

- export function LoremIpsum() {
+ export const LoremIpsum = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div style={{ height: 300px, overflow: auto, borxer: 1px solid red }}
+      ref={ref}
    >

    //(...)

+  )
```

Y en el app.tsx vamos a engancharlo con el useScroll:

_./src/app.tsx_

```diff
+ import React from "react";
import React, { useRef } from "react";
// (...)

export const App = () => {
+ const refDivTextA = useRef(null);
+ const refDivTextB = useRef(null);

// (...)

      <div style={{ width: "200px" }}>
        <ProgressBar progress={currentPosition} />
-        <LoremIpsum />
+        <LoremIpsum ref={refDivTextA} />
      </div>
      <div style={{ width: "200px" }}>
        <ProgressBar progress={currentPosition} />

-        <LoremIpsum />
+        <LoremIpsum ref={refDivTextB} />
      </div>

```

Y vamos a enlzarlos con el useScroll:

_./src/app.tsx_

```diff
-  const { scrollYProgress } = useScroll();
+  const { scrollYProgressA } = useScroll({container: refDivTextA}));
+  const { scrollYProgressB } = useScroll({container: refDivTextB}));

-  const [currentPosition, setcurrentPosition] = React.useState(0);
+  const [currentPositionA, setcurrentPositionA] = React.useState(0);
+  const [currentPositionB, setcurrentPositionB] = React.useState(0);



  React.useEffect(() => {
-    return scrollYProgress.onChange((latest) => {
+    scrollYProgressA.onChange((latest) => {
+      setcurrentPositionA(latest);
+    });

+    scrollYProgressB.onChange((latest) => {
+      setcurrentPositionB(latest);
+    });
  }, []);
```

Y vamos a pasarle el valor de cada uno a su progress bar:

```diff
      <div style={{ width: "200px" }}>
-        <ProgressBar progress={currentPosition} />
+        <ProgressBar progress={currentPositionA} />

        <LoremIpsum />
      </div>
      <div style={{ width: "200px" }}>
-        <ProgressBar progress={currentPosition} />
+        <ProgressBar progress={currentPositionB} />
        <LoremIpsum />
      </div>
```

- Vamos a probar a ver que tal queda esto:

```bash
npm start
```

También podrías implementar un indicador circular:
