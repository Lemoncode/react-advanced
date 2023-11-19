# Render prop uso

Acabas de ver las render props y seguramente estés pensando ¿Y esto que uso le doy? Vamos a verlo en acción utilizando Formik una librería de validación de formularios (más adelante veremos más en detalle como funciona esta librería).

Formik es una librería que nos permite gestionar formularios, y utiliza una render prop para pasar información a nuestro componente (estado de validación, si el formulario ha sido enviado, si tiene cambios...)

# Pasos

Partimos del boiler plate (o si lo prefieres del ejemplo anterior y borramos el contenido de _my-form.component.tsx_).

Instalamos formik:

```bash
npm install formik --save
```

Definimos estilos (en el caso de que no estén):

_./my-form.component.module.tsx_

```css
.form {
  display: flex;
  flex-direction: column;
}

.form > div {
  display: flex;
  flex-direction: column;
}
```

Vamos a crear un formulario sencillo:

_./my-form.component.tsx_

```tsx
import React from "react";
import { Formik, Form, Field } from "formik";
import classes from "./my-form.component.module.css";

interface FormValues {
  username: string;
  email: string;
  password: string;
}

export const MyForm: React.FC = () => {
  const initialValues: FormValues = {
    username: "",
    email: "",
    password: "",
  };

  const onSubmit = (values: FormValues) => {
    console.log(values); // Realiza alguna acción con los valores del formulario
  };

  return (
    <div>
      <h1>Registro de Usuario</h1>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {() => (
          <Form className={classes.form}>
            <div>
              <label htmlFor="username">Nombre de usuario:</label>
              <Field type="text" id="username" name="username" />
            </div>

            <div>
              <label htmlFor="email">Email:</label>
              <Field type="email" id="email" name="email" />
            </div>

            <div>
              <label htmlFor="password">Contraseña:</label>
              <Field type="password" id="password" name="password" />
            </div>

            <button type="submit">Registrarse</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
```

Fijate en la render prop, esa función expone un monton de parametros, vamos pedirle que nos de el dirty (si el formulario tiene cambios) y lo vamos a mostrar en pantalla.

```diff
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
-       {() => (
+       {({ dirty }) => (
```

```diff
  <button type="submit">Registrarse</button>
+  {dirty && <p>(*) El formulario tiene cambios</p>}
 </Form>
```

Instanciamos este componente en APP

_./src/App.tsx_

```diff
import "./App.css";
+ import { MyForm } from "./my-form.component";
import "animate.css";

function App() {
  return (
    <>
+      <MyForm />
    </>
  );
}

export default App;
```

Fíjate que le hemos informado el dirty, si queremos ver todo lo que ofrece, ponemos una coma dentro del destructuring y control espacio podemos ver el resto de propiedades

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

También puedes apuntarte a nuestro Bootcamp de Back End [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#inicio-banner)

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
