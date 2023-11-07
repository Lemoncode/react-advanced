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
        {({ dirty }) => (
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
            {dirty && <p>(*) El formulario tiene cambios</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};
