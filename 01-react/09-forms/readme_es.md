# 09 Forms

## Resumen

Manejar formularios tienen una serie de desafíos, cuando mostrar errores, cuando lanzar validaciones, como actualizar campos... y lo más importante como hacer para que tu código
no acabe siendo un spaghetti.

En este ejemplo vamos a meternos a simular un formulario real, el de transferencia
bancaria, los casos que vamos cubrir:

- Cuando mostrar lo mensajes de error (sólo cuando el campos este manchado o si ya se
  ha hecho submit del mismo).
- Como marcar validaciones de campos obligatorios de informar.
- Como validar que un campo se un correo bien informado.
- Como validar un iban.
- Como validar con expresiones regulares.
- Como crear validaciones custom tanto síncronas como asíncronas.
- Como añadir validaciones a nivel de registro.
- Como mostrar los mensajes de error.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- De librerías de manejo de formularios nos podemos encontrar con varias, las más populares:

  - React Final Form.
  - React Hooks Form.
  - Formik.

- En este ejemplo vamos a hacer uso de Formik.

```bash
npm install formik --save
```

- De cara a gestionar las validaciones de los formularios existen varias opciones, algunas de ellas:
  - Yups.
  - Fonk.

En nuestro caso vamos a usar Fonk, esta librería es la evolución de lc-formvalidation, la llevamos
usando en Lemoncode desde hace varios años con buenos resultados.

- Vamos a instalar Fonk y el adaptador para Formik:

```bash
npm install @lemoncode/fonk @lemoncode/fonk-formik --save
```

- Cuando trabajamos con librerías como Formik, lo ideal es crear wrappers de los controles de formularios que vamos a usar, para poder así extraer info de contexto (info de error etc..), en nuestro caso vamos a crearnos un wrapper para el input de tipo text.

_./src/common/input-formik.component.tsx_

```tsx
import React from "react";
import { useField } from "formik";

// Input props, we got this value by double clicking on a input element
// and going to definition (d.ts)
export const InputFormik: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = (props) => {
  // useField allows us to extract all formik metadata about that field
  const [field, meta] = useField(props.name);
  // If the field doesn't exist then treat this as a normal input
  const inputFieldProps = Boolean(field) ? field : props;
  // We only want to display the field validation error messsage
  // if formik is enabled, and is the field has been touched
  // not a very good UX experience to show a blank form full
  // of error a the initial state
  const hasError = Boolean(meta && meta.touched && meta.error);

  // Harcoded styles here... pending to add
  // CSS modules (next example) or CSS in JS solution :)
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <input
        {...props}
        name={inputFieldProps.name}
        onChange={inputFieldProps.onChange}
        onBlur={inputFieldProps.onBlur}
        value={inputFieldProps.value}
      />
      <span style={{ fontSize: "60%", color: "red" }}>
        {hasError ? meta.error : ""}
      </span>
    </div>
  );
};
```

- Vamos a crear un barrel:

_./src/common/index.ts_

```tsx
export * from "./input-formik.component";
```

- Vamos a definir el modelo de datos que vamos a manejar en nuestro formulario, para ello vamos a crear un fichero _model.ts_

_./src/transfer-form/transfer-form.model.ts_

```tsx
export interface TransferFormEntity {
  account: string;
  beneficiary: string;
  integerAmount: number;
  decimalAmount: number;
  reference: string;
  email: string;
}

export const createEmptyTransferFormEntity = (): TransferFormEntity => ({
  account: "",
  beneficiary: "",
  integerAmount: 0,
  decimalAmount: 0,
  reference: "",
  email: "",
});
```

- Vamos a crear un componente que llamaremos _transfer-form.component.tsx_ que será el que se encargue de mostrar el formulario de transferencia bancaria.

Empezamos por montar la fontaneria de Formik.

_./src/transfer-form/transfer-form.component.tsx_

```tsx
import React from "react";
import { Formik, Form } from "formik";
import { InputFormik } from "../common";
import {
  TransferFormEntity,
  createEmptyTransferFormEntity,
} from "./transfer-form.model";

export const TransferForm: React.FC = () => {
  return (
    <>
      <h1>Transfer From</h1>
      <Formik
        initialValues={createEmptyTransferFormEntity()}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {() => <Form></Form>}
      </Formik>
    </>
  );
};
```

- Lo añadimos al _app_ para que se muestre.

_./src/app.tsx_

```tsx
import React from "react";
import { TransferForm } from "./transfer-form/transfer-form.component";

export const App: React.FC = () => {
  return (
    <div>
      <TransferForm />
    </div>
  );
};
```

- Ya dejamos el proyecto arrancado para ir viendo los cambios:

```bash
npm start
```

- Siguiente paso, vamos a maquetar el formulario, para ello crearemos
  unos estilos y la maquetación:

_./src/transfer-form/transfer-form.component.css_

```css
form {
  max-width: 700px;
  margin: 10px auto;
  border: 1px solid #ccc;
  padding: 20px;
  box-shadow: 2px 2px 5px rgb(0 0 0 / 30%);
  border-radius: 3px;
}

.form-group {
  display: flex;
  align-items: flex-start;
  line-height: 2em;
  margin: 5px;
  flex-direction: row;
  width: 100%;
  margin-bottom: 1rem;
}

form > div label:first-of-type {
  color: #333;
  font-size: 1em;
  line-height: 32px;
  margin-right: 2rem;
  width: 150px;
  text-align: left;
}

.amount-fields {
  display: inline-flex;
  flex-direction: row;
  align-items: flex-start;
}

.buttons {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  margin-top: 15px;
}
```

_./src/transfer-form/transfer-form.component.tsx_

```diff
+ import classes from './transfer-form.component.css';

      <Formik
        initialValues={createEmptyTransferFormEntity()}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {() =>
          <Form>
+            <div className={classes.formGroup}>
+              <label htmlFor="account">Beneficiary IBAN</label>
+              <InputFormik id="account" name="account" />
+            </div>
+            <div className={classes.formGroup}>
+              <label htmlFor="beneficiary">Beneficiary fullname: </label>
+              <InputFormik id="beneficiary" name="beneficiary" />
+            </div>
+            <div className={classes.formGroup}>
+              <label htmlFor="amount">Amount of wire</label>
+              <div className={classes.amountFields}>
+                <InputFormik id="integerAmount" name="integerAmount" />
+                <div>.</div>
+                <InputFormik id="decimalAmount" name="decimalAmount" />
+              </div>
+            </div>
+            <div className={classes.formGroup}>
+              <label htmlFor="reference">Reference</label>
+              <InputFormik id="reference" name="reference" />
+            </div>
+            <div className={classes.formGroup}>
+              <label htmlFor="email">Email</label>
+              <InputFormik id="email" name="email" />
+            </div>
        </Form>}
      </Formik>
```

Vamos a añadir un botón para enviar el formulario:

```diff
            </div>
+           <div className={classes.buttons}>
+             <button type="submit">Submit</button>
+           </div>
        </Form>}
      </Formik>
```

- Ahora si le damos a submit podemos ver los valores por consola,
  pero nos faltan las validaciones.

Vamos a crear un fichero en el que definiremos las validaciones
del formulario, en el inicializamos un esquema de validaciones,
y se lo dejamos preparado para integrarse con un formulario de
formik.

_./src/transfer-form/transfer-form.validation.ts_

```tsx
import { createFormikValidation } from "@lemoncode/fonk-formik";

const validationSchema = {};

export const formValidation = createFormikValidation(validationSchema);
```

- Ahora vamos a indicar los campos que son obligatorios, para ello
  tenemos que hacer coincidir el nombre del campo con el nombre en el
  modelo de la entidad (si fueran campos compuestos usariamos las comillas
  por ejemplo: "address.street").

- En este caso Fonk incorporar una validación para campo obligatorio.

_./src/transfer-form/transfer-form.validation.ts_

```diff
+ import { Validators } from '@lemoncode/fonk';
import { createFormikValidation } from '@lemoncode/fonk-formik';

const validationSchema = {
+ field: {
+   account: [Validators.required],
+   beneficiary: [Validators.required],
+   name: [Validators.required],
+   integerAmount: [Validators.required],
+   decimalAmount: [Validators.required],
+   reference: [Validators.required],
+   email: [Validators.required],
+ },
};

export const formValidation = createFormikValidation(validationSchema);
```

Un tema interesante es que podemos implementar pruebas sobre esta
validación sin tener que irnos al formulario (simulamos unas pruebas)

_./src/transfer-form/transfer-form.validation.spec.ts_

```ts
import { TransferFormEntity } from "./transfer-form.model";
import { formValidation } from "./transfer-form.validation";

describe("formValidation", () => {
  it("should fail when account is empty", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "",
      beneficiary: "John Doe",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john.doe@gmail.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["account"]).toBeDefined();
  });

  it("should not fail when account is informed", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "GB33BUKB20201555555555",
      beneficiary: "John Doe",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "Taxes",
      email: "john.doe@gmail.com",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["account"]).not.toBeDefined();
  });
  it("should generate all field errors as required", async () => {
    // Arrange
    const values: TransferFormEntity = {
      account: "",
      beneficiary: "",
      integerAmount: 100,
      decimalAmount: 0,
      reference: "",
      email: "",
    };

    // Act
    const result = await formValidation.validateForm(values);

    // Assert
    expect(result["account"]).toBeDefined();
    expect(result["beneficiary"]).toBeDefined();
    expect(result["reference"]).toBeDefined();
    expect(result["email"]).toBeDefined();
  });
});
```

Vamos a añadir la validación al formulario:

_./src/transfer-form/transfer-form.component.tsx_

```diff
+ import { formValidation } from './transfer-form.validation';

      <Formik
        initialValues={createEmptyTransferFormEntity()}
        onSubmit={(values) => {
          console.log(values);
        }}
+       validate={values => formValidation.validateForm(values)}
      >
```

- Ya tenemos las validaciones apareciendo, todo genial :).

- Seguimos, ahora queremos que el campo de correo electrónico
  sea un email bien formado, para ello Fonk trae un validador ya hecho,
  lo añadimos:

_./src/transfer-form/transfer-form.validation.ts_

```diff
const validationSchema = {
  field: {
    account: [Validators.required],
    beneficiary: [Validators.required],
    name: [Validators.required],
    integerAmount: [Validators.required],
    decimalAmount: [Validators.required],
    reference: [Validators.required],
-    email: [Validators.required],
+    email: [Validators.required, Validators.email],
  },
};
```

Si queremos podemos añadir una prueba para este caso:

_./src/transfer-form.validation.spec.ts_

```diff
+  it("should fail when email is not valid", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "GB33BUKB20201555555555",
+      beneficiary: "John Doe",
+      integerAmount: 100,
+      decimalAmount: 0,
+      reference: "Taxes",
+      email: "john.doe",
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["email"]).toBeDefined();
+  });
+
+  it("should fail when email is valid", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "GB33BUKB20201555555555",
+      beneficiary: "John Doe",
+      integerAmount: 100,
+      decimalAmount: 0,
+      reference: "Taxes",
+      email: "john.doe@mail.com",
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["email"]).not.toBeDefined();
+  });
});
```

- También podemos comprobarlo en el UI.

- Ahora vamos a validar que el IBAN este bien formado, esta validación no
  viene en el core de Fonk (sería añadir peso innecesario), pero si tiene
  un ecosistema de validaciones que podemos instalar (son microlibrerías:
  https://lemoncode.github.io/fonk-doc/validators/third-party-validators)).

```bash
npm install @lemoncode/fonk-iban-validator
```

- Y vamos a añadirlo a nuestro esquema:

_./src/transfer-form/transfer-form.validation.ts_

```diff
import { Validators } from "@lemoncode/fonk";
import { createFormikValidation } from "@lemoncode/fonk-formik";
+ import { iban } from '@lemoncode/fonk-iban-validator';

const validationSchema = {
  field: {
+    account: [Validators.required,
+              iban.validator
+          ],
    beneficiary: [Validators.required],
```

- Podemos añadir pruebas aquí, ojo en este caso simplemente probamos que
  la validación se aplica al campo, el que se valide bien el IBAN ya lo
  tiene probado el validador.

_./src/transfer-form/transfer-form.validation.spec.ts_

```diff
+  it("should fail when account is not valid", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "GB33BUKB202000000",
+      beneficiary: "John Doe",
+      integerAmount: 100,
+      decimalAmount: 0,
+      reference: "Taxes",
+      email: "test@email.com",
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["account"]).toBeDefined();
+  });
+
+  it("should fail when account is valid", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "GB33BUKB20201555555555",
+      beneficiary: "John Doe",
+      integerAmount: 100,
+      decimalAmount: 0,
+      reference: "Taxes",
+      email: "john@email.com"
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["account"]).not.toBeDefined();
+  });
});
```

- Vamos a realizar otra validación, el importe:

  - En la cantidad entera queremos que la cifra esté entre 0 y 10.000
  - En la cantidad decimal quremos que la cifra esté entre 0 y 99.

- Vamos a tirar del ecosistema de Fonk y bajarnos el validador de rangos
  numéricos:

```bash
npm install @lemoncode/fonk-range-number-validator --save
```

- En este caso podemos usar TDD, vamos a crear los tests y después implementamos.

_./src/transfer-form/transfer-form.validation.spec.ts_

```diff
+  it("should fail when integerAmount is not valid", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "GB33BUKB20201555555555",
+      beneficiary: "John Doe",
+      integerAmount: 11000,
+      decimalAmount: 0,
+      reference: "Taxes",
+      email: "john@email.com",
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["integerAmount"]).toBeDefined();
+  });

+  it("should succeed when integerAmount is valid", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "GB33BUKB20201555555555",
+      beneficiary: "John Doe",
+      integerAmount: 1000,
+      decimalAmount: 0,
+      reference: "Taxes",
+      email:  "test@email.com"
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["integerAmount"]).not.toBeDefined();
+  });
+
+  it("should fail when decimalAmount is not valid", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "GB33BUKB20201555555555",
+      beneficiary: "John Doe",
+      integerAmount: 1000,
+      decimalAmount: 100,
+      reference: "Taxes",
+      email: "test@email.com"
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["decimalAmount"]).toBeDefined();
+  });
+
+  it("should succeed when decimalAmount is valid", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "GB33BUKB20201555555555",
+      beneficiary: "John Doe",
+      integerAmount: 1000,
+      decimalAmount: 99,
+      reference: "Taxes",
+      email: "test@email.com"
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["decimalAmount"]).not.toBeDefined();
+  });
});
```

- Vamos a por la implementación:

```diff
import { Validators } from "@lemoncode/fonk";
import { createFormikValidation } from "@lemoncode/fonk-formik";
import { iban } from "@lemoncode/fonk-iban-validator";
+ import { rangeNumber } from '@lemoncode/fonk-range-number-validator';


const validationSchema = {
  field: {
    account: [Validators.required, iban.validator],
    beneficiary: [Validators.required],
    name: [Validators.required],
    integerAmount: [
      Validators.required,
+      {
+       validator: rangeNumber,
+       customArgs: {
+         min: {
+           value: 0,
+           inclusive: true,
+         },
+         max: {
+           value: 10000,
+           inclusive: true,
+         },
+       },
+     },
     ],
    decimalAmount: [
      Validators.required,
+     {
+       validator: rangeNumber,
+       customArgs: {
+         min: {
+           value: 0,
+           inclusive: true,
+         },
+         max: {
+           value: 99,
+           inclusive: true,
+         },
+       },
+     },
    ],
    reference: [Validators.required],
    email: [Validators.required, , Validators.email],
  },
};
```

- Ahora imaginemos que hay un problema con Francia y que deshabilitar
  los envíos para este pais, lo que hacemos es que en el IBAN si el código
  del pais es el de Francia mostramos un error, para ellos usaremos
  el validador de expresión regular.

Vamos a por la prueba

**./src/transfer-form/transfer-form.validation.spec.ts**

```diff
+  it("should fail when account is from France", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "FR7630006000011234567890189",
+      beneficiary: "John Doe",
+      integerAmount: 1000,
+      decimalAmount: 0,
+      reference: "Taxes",
+      email: "john@email.com",
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["account"]).toBeDefined();
+  });
+
+  it("should succeed when account is not from France", async () => {
+    // Arrange
+    const values: TransferFormEntity = {
+      account: "GB33BUKB20201555555555",
+      beneficiary: "John Doe",
+      integerAmount: 1000,
+      decimalAmount: 0,
+      reference: "Taxes",
+      email: "john@email.com"
+    };
+
+    // Act
+    const result = await formValidation.validateForm(values);
+
+    // Assert
+    expect(result["account"]).not.toBeDefined();
+  });
```

Y ahora a añadirlo

```diff
const validationSchema = {
  field: {
    account: [
      Validators.required,
      iban.validator
+     {
+       validator: Validators.pattern,
+       customArgs: {
+         pattern: /^(?!FR)/i,
+       },
+       message: 'Transfers to France temporary disabled',
+     },
    ],
    beneficiary: [Validators.required],
```

- Esto de las validaciones estándares para resolverlo todo está muy bien,
  pero no siempre nos valen, vamos a ponernos en un caso en el que nos
  hace falta una validación custom, vamos a recibir una lista de paises
  que están en la lista negra y no podemos hacer transferencias, para ello
  vamos a crear un validador custom (en este caso como no conocemos la firma
  implementaremos el validador, y después los tests, pero cuando estemos
  familiarizados podemos empezar con un test, la firma, y seguir evolucionando...).

_./src/transfer-form/custom-validators/country-black-list.validator.ts_

```tsx
import { ValidationResult, Validators } from "@lemoncode/fonk";

export const countryBlackList = ({ value, customArgs }) => {
  const { countries } = customArgs;

  const countriesRegExp = countries.reduce(
    (regex, country, i) => (i === 0 ? `(${country})` : `${regex}|(${country})`),
    ""
  );
  const pattern = new RegExp(`^(?!${countriesRegExp})`, "i");

  const { succeeded } = Validators.pattern.validator({
    value,
    customArgs: { pattern },
  }) as ValidationResult;

  return {
    type: "COUNTRY_BLACK_LIST",
    succeeded,
    message: succeeded ? "" : "This country is not available",
  };
};
```

- En este caso si nos tenemos que esmerar con las pruebas, ya que es un validador
  que hemos hecho nosotros, hay que probar un buen número de casos.

_./src/transfer-form/custom-validators/country-black-list.validator.spec.ts_

```ts
import { countryBlackList } from "./country-black-list.validator";

describe("countryBlackList validator specs", () => {
  it("should return true when value is undefined", () => {
    // Arrange
    const value = undefined;
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeTruthy();
  });

  it("should return true when value is null", () => {
    // Arrange
    const value = null;
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeTruthy();
  });

  it("should return true when value is empty", () => {
    // Arrange
    const value = "";
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeTruthy();
  });

  it("should return true when value is valid", () => {
    // Arrange
    const value = "GB33BUKB20201555555555";
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeTruthy();
  });

  it("should return false when value is invalid", () => {
    // Arrange
    const value = "FR7630006000011234567890189";
    const customArgs = {
      countries: ["FR", "ES"],
    };

    // Act
    const result = countryBlackList({ value, customArgs });

    // Assert
    expect(result.succeeded).toBeFalsy();
  });
});
```

- Vamos a crear un barrel

_./src/transfer-form/custom-validators/index.ts_

```ts
export * from "./country-black-list.validator";
```

- Vamos ahora a darle uso (quitamos el de Francia y
  cubrimos el caso con el black list):

_./src/transfer-form/transfer-form.validation.ts_

```diff
import { Validators } from "@lemoncode/fonk";
import { createFormikValidation } from "@lemoncode/fonk-formik";
import { iban } from "@lemoncode/fonk-iban-validator";
import { rangeNumber } from "@lemoncode/fonk-range-number-validator";
+ import { countryBlackList } from "./custom-validators";

const validationSchema = {
  field: {
    account: [
      Validators.required,
      iban.validator,
-      {
-        validator: Validators.pattern,
-        customArgs: {
-          pattern: /^(?!FR)/i,
-        },
-        message: "Transfers to France temporary disabled",
-      },
+      {
+        validator: countryBlackList,
+        customArgs: { countries: ['FR', 'ES'] }
+      },
    ],
```

- Esto está muy bien, pero ¿Que pasa si esta lista la recibimos
  como llamada asíncrona? Podemos actualizar el esquema de validación
  una vez que recibamos este datos.

- Eliminamos la validación ya que de primeras no la tenemos
  (también podríamos haber puesto una lista vacía de paises,
  pero lo hacemos para ver como actualizar un esquema)

_./src/transfer-form/transfer-form.validation.ts_

```diff
const validationSchema = {
  field: {
    account: [
      Validators.required,
      iban.validator,
-      {
-        validator: countryBlackList,
-        customArgs: { countries: ["FR", "ES"] },
-      },
    ],
```

- Tenemos que eliminar las validaciones para ese caso.

_./src/transfer-form/transfer-form.validation.spec.ts_

```diff
-  it("should fail when account is from France", async () => {
-    // Arrange
-    const values: TransferFormEntity = {
-      account: "FR7630006000011234567890189",
-      beneficiary: "John Doe",
-      integerAmount: 1000,
-      decimalAmount: 0,
-      reference: "Taxes",
-      email: "john@email.com",
-    };
-
-    // Act
-    const result = await formValidation.validateForm(values);
-
-    // Assert
-    expect(result["account"]).toBeDefined();
-  });
-
-  it("should succeed when account is not from France", async () -=> {
-    // Arrange
-    const values: TransferFormEntity = {
-      account: "GB33BUKB20201555555555",
-      beneficiary: "John Doe",
-      integerAmount: 1000,
-      decimalAmount: 0,
-      reference: "Taxes",
-      email: "john@email.com",
-    };
-
-    // Act
-    const result = await formValidation.validateForm(values);
-
-    // Assert
-    expect(result["account"]).not.toBeDefined();
-  });
});
```

- Para ello vamos a simular una llamada a una API fake:

_./src/transfer-form/transfer-form.api.ts_

```ts
const mockCountries = ["FR", "ES"];

export const getDisabledCountryIBANCollection = () =>
  Promise.resolve(mockCountries);
```

Y en la parte del validador vamos a exponer un método para
actualizarlo:

_./src/transfer-form/validation.ts_

```diff
};

export const formValidation = createFormikValidation(validationSchema);

+ export const updateFormValidationSchemaWithBlackList = (countries: string[]) => {
+     const newValidationSchema = {
+       ...validationSchema,
+       field: {
+         ...validationSchema.field,
+         account: [
+           ...validationSchema.field.account,
+           {
+             validator: countryBlackList,
+             customArgs: {
+               countries,
+             },
+           },
+         ],
+       },
+     };
+     formValidation.updateValidationSchema(newValidationSchema);
+ };
```

- Vamos a probarlo, rescatamos los casos anteriores pero añadiendo _updateValidationSchema_

_./src/transfer-form/transfer-form.validation.spec.ts_

```diff
- import { formValidation} from "./transfer-form.validation";
+ import { formValidation, updateFormValidationSchemaWithBlackList } from "./transfer-form.validation";
```

_./src/transfer-form/transfer-form.validation.spec.ts_

```diff
+ it("Should update schema and fail with account france", async () => {
+   // Arrange
+   const values: TransferFormEntity = {
+     account: "FR7630006000011234567890189",
+     beneficiary: "John Doe",
+     integerAmount: 1000,
+     decimalAmount: 0,
+     reference: "Taxes",
+     email: "john@email.com",
+   };
+
+   // Act
+   updateFormValidationSchemaWithBlackList(["FR", "ES"]);
+
+   // Assert
+   const result = await formValidation.validateForm(values);
+   expect(result["account"]).toBeDefined();
+ });
+
+ it("Should update schema and succeed with account not france", async () => {
+   // Arrange
+   const values: TransferFormEntity = {
+     account: "GB33BUKB20201555555555",
+     beneficiary: "John Doe",
+     integerAmount: 1000,
+     decimalAmount: 0,
+     reference: "Taxes",
+     email: "john@email.com",
+   };
+
+   // Act
+   updateFormValidationSchemaWithBlackList(["FR", "ES"]);
+
+   // Assert
+   const result = await formValidation.validateForm(values);
+   expect(result["account"]).not.toBeDefined();
+ });
})
```

- Vamos añadirlo al componente

_./src/transfer-form/transfer-form.component.tsx_

```diff
import React from "react";
import { Formik, Form } from "formik";
import { InputFormik } from "../common";
import {
  TransferFormEntity,
  createEmptyTransferFormEntity,
} from "./transfer-form.model";
import classes from "./transfer-form.component.css";
- import { formValidation } from './transfer-form.validation';
+ import { formValidation, updateFormValidationSchemaWithBlackList } from './transfer-form.validation';
+ import { getDisabledCountryIBANCollection } from './transfer-form.api';

export const TransferForm: React.FC = () => {

+ React.useEffect(() => {
+   getDisabledCountryIBANCollection().then((countries) => {
+     updateFormValidationSchemaWithBlackList(countries);
+   });
+ },[])

  return (
```

Let's go for an asynchronous validation:
