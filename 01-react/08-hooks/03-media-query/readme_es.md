# 03 Media query

## Resumen

Este ejemplo toma como punto de partida el ejemplo _00-boiler-plate_.

Las media queries de CSS son un recurso super importante para poder hacer un diseño web responsivo, ya que hoy dia, la mayor parte del tráfico que llega a nuestras webs son desde dispositivos móviles y si además queremos que nuestra web se vea decente en otras resoluciones, es la mejor baza que podemos tener.

Uno de los problemas que nos podemos encontrar en un proyecto real cuando queremos hacer un diseño responsivo, es que muchas veces, el componente que queremos mostrar en resolución móvil es tan diferente del de la resolución en escritorio que hacerlo en un solo componente con media queries de CSS puede añadir complejidad a la implementación, además de que si ocultamos los elementos HTML desde CSS, siguen estando en el DOM, por tanto estamos gastando CPU en renderizar un componente que no se ve por pantalla, ¿hay alguna forma de detectar en qué resolución estoy para mostrar un componente u otro desde JavaScript?

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

Vamos a arrancarlo

```bash
npm start
```

Para este ejemplo, vamos a añadir dos ficheros que representan el mismo componente, pero uno es para la resolución móvil y el otro para la resolución a partir de tablet.

_./src/mobile-user-profile.tsx_

```tsx
import React from "react";
import classes from "./mobile-user-profile.css";

interface Props {
  name: string;
  lastname: string;
}

export const MobileUserProfile: React.FC<Props> = (props) => {
  const { name, lastname } = props;
  return (
    <div className={classes.root}>
      <p>
        User: {name} {lastname}
      </p>
    </div>
  );
};

```

_./src/mobile-user-profile.css_

```css
.root {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  background-color: #B39CD0;
}

```

_./src/user-profile.tsx_

```tsx
import React from "react";
import classes from "./user-profile.css";

interface Props {
  name: string;
  lastname: string;
  email: string;
  role: string;
}

export const UserProfile: React.FC<Props> = (props) => {
  const { name, lastname, email, role } = props;
  return (
    <div className={classes.root}>
      <p>
        User: {name} {lastname}
      </p>
      <p>Email: {email}</p>
      <p>Role: {role}</p>
    </div>
  );
};

```

_./src/user-profile.css_

```css
.root {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 0.5rem;
  padding: 0 0.5rem;
  background-color: #00C9A7;
}

```

Usamos ambos componentes en el fichero principal:

_./src/app.tsx_

```diff
import React from "react";
+ import { MobileUserProfile } from "./mobile-user-profile";
+ import { UserProfile } from "./user-profile";

export const App = () => {
+ const userProfile = {
+   name: "John",
+   lastname: "Doe",
+   email: "john.doe@email.com",
+   role: "admin",
+ };

- return <h1>Hello React !!</h1>;
+ return (
+   <>
+     <MobileUserProfile
+       name={userProfile.name}
+       lastname={userProfile.lastname}
+     />
+     <UserProfile
+       name={userProfile.name}
+       lastname={userProfile.lastname}
+       email={userProfile.email}
+       role={userProfile.role}
+     />
+   </>
+ );
};

```

Como vemos, el contenido del usuario se ve más apelotonado en el componente pensado para una resolución mayor, ahora vamos a mostrar un componente u otro usando media queries desde CSS:

_./src/app.css_

```css
.mobile-user-profile {
  display: block;
}

.user-profile {
  display: none;
}

@media only screen and (min-width: 600px) {
  .mobile-user-profile {
    display: none;
  }

  .user-profile {
    display: block;
  }
}

```

_./src/app.tsx_

```diff
import React from "react";
import { MobileUserProfile } from "./mobile-user-profile";
import { UserProfile } from "./user-profile";
+ import classes from "./app.css";

export const App = () => {
  const userProfile = {
    name: "John",
    lastname: "Doe",
    email: "john.doe@email.com",
    role: "admin",
  };
  
  return (
    <>
+     <div className={classes.mobileUserProfile}>
        <MobileUserProfile
          name={userProfile.name}
          lastname={userProfile.lastname}
        />
+     </div>
+     <div className={classes.userProfile}>
        <UserProfile
          name={userProfile.name}
          lastname={userProfile.lastname}
          email={userProfile.email}
          role={userProfile.role}
        />
+     </div>
    </>
  );
};

```

Con esto ya hemos conseguido el objetivo visualmente, pero si miramos las _Dev tools_ del navegador, veremos que en el DOM se están pintando ambos componentes para todas las resoluciones. Para este ejemplo no influye al ser un componente tan simple, pero si nos encontramos ante otro mucho más complejo, estaremos haciendo _renders_ innecesarios para un componente que está oculto.

¿Qué podemos hacer? Pues vamos a crear un custom hook para que detecte la resolución actual de la pantalla desde JavaScript y muestre un componente u otro, al igual que hacemos en la media query:

_./src/app.tsx_

```diff
import React from "react";
import { MobileUserProfile } from "./mobile-user-profile";
import { UserProfile } from "./user-profile";
- import classes from "./app.css";

export const App = () => {
  const userProfile = {
    name: "John",
    lastname: "Doe",
    email: "john.doe@email.com",
    role: "admin",
  };
+ const isHighResolution = useMediaQuery("only screen and (min-width: 600px)");

  return (
    <>
-     <div className={classes.mobileUserProfile}>
-       <MobileUserProfile
-         name={userProfile.name}
-         lastname={userProfile.lastname}
-       />
-     </div>
-     <div className={classes.userProfile}>
-       <UserProfile
-         name={userProfile.name}
-         lastname={userProfile.lastname}
-         email={userProfile.email}
-         role={userProfile.role}
-       />
-     </div>
+     {isHighResolution ? (
+       <UserProfile
+         name={userProfile.name}
+         lastname={userProfile.lastname}
+         email={userProfile.email}
+         role={userProfile.role}
+       />
+     ) : (
+       <MobileUserProfile
+         name={userProfile.name}
+         lastname={userProfile.lastname}
+       />
+     )}
    </>
  );
};

+ const useMediaQuery = (mediaQuery: string) => {
+   const initialMediaQuery = window.matchMedia(mediaQuery);
+   const [matches, setMatches] = React.useState(initialMediaQuery.matches);

+   React.useEffect(() => {
+     const onMatchMediaChange = (event) => setMatches(event.matches);

+     window
+       .matchMedia(mediaQuery)
+       .addEventListener("change", onMatchMediaChange);

+     return () => {
+       window
+         .matchMedia(mediaQuery)
+         .removeEventListener("change", onMatchMediaChange);
+     };
+   }, [mediaQuery]);

+   return matches;
+ };

```

Ahora estamos usando la misma media query pero desde JavaScript, y no necesitamos el fichero css.

> Borramos el fichero _app.css_
