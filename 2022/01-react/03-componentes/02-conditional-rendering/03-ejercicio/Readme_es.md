# Ejercicio conditional Rendering

Vamos a partir del típico escenario de "esto es una mierda pero funciona"
:)

Queremos editar la ficha de un cliente, tenemos la siguiente casuística:

- El usuario puede tener la nacionalidad (NIF), ser residente (NIE), o ser extranjero (pasaporte).

- Si tiene la nacionalidad, debe rellenar campos NIF, nombre, apellidoA,
  apellidoB, provincia.

- Si es residente: NIE, nombre, ApellidoA, provincia

- Si es extranjero: Pasaporte, nombre, ApellidoA, provincia, país.

En este ejemplo tenemos una solución "hecha con los pies",
¿Cómo harías para refacotizarla?

Pistas:

- Componentiza.
- Utiliza *conditional rendering*.
- Evalúa si se puede sacar algún(os) componente común de ayuda.

Este ejercicio toma como punto de partida el ejemplo *00-boiler-plate*.

- Primero copiamos el ejemplo **00-boiler-plate**, y hacemos un *npm install*

```
npm install
```

# El código

_./components/client/model.ts_

```ts
const documentTypeCollection = ["NIF", "NIE", "PASSPORT"];

export interface Client {
  documentType: string;
  name: string;
  lastnameA: string;
  lastnameB: string;
  nif: string;
  nie: string;
  passport: string;
  province: string;
  country: string;
}

export const createEmptyClient = (): Client => ({
  documentType: "",
  name: "",
  lastnameA: "",
  lastnameB: "",
  nif: "",
  nie: "",
  passport: "",
  province: "",
  country: "",
});
```

_./components/client/client.api.ts_

```ts
import { Client } from "./model";

export const loadClient = (): Promise<Client> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        documentType: "NIF",
        name: "Paco",
        lastnameA: "Perez",
        lastnameB: "Lopez",
        nif: "12345678X",
        nie: "",
        passport: "",
        province: "Zaragoza",
        country: "",
      });
    }, 1000);
  });
};
```

_./components/client/bad/bad-client.component.css_

```css
.field {
  display: flex;
  justify-content: space-between;
  width: 300px;
  flex-direction: row;
  margin-bottom: 10px;
}
```

_./components/client/bad/bad-client.component.tsx_

```ts
import React, { useState } from "react";
import { Client } from "../model";
import { loadClient } from "../client.api";
import { createEmptyClient } from "../model";
import classes from "./bad-client.component.css";

export const BadClientComponent = () => {
  const [client, setClient] = useState<Client>(createEmptyClient());

  React.useEffect(() => {
    loadClient().then((client) => setClient(client));
  }, []);

  const handleOnChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setClient({ ...client, [key]: event.target.value });
    };

  const handleOnChangeDropDown =
    (key: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      setClient({ ...client, [key]: event.target.value });
    };

  return (
    <>
      <div>
        <h1>Client</h1>

        <div className={classes.field}>
          <label>Tipo documento</label>
          <select
            value={client.documentType}
            onChange={handleOnChangeDropDown("documentType")}
          >
            <option value="NIF">NIF</option>
            <option value="NIE">NIE</option>
            <option value="PASSPORT">PASSPORT</option>
          </select>
        </div>
        <div>
          {client.documentType == "NIF" && (
            <>
              <div className={classes.field}>
                <label>NIF</label>
                <input
                  type="text"
                  value={client.nif}
                  onChange={handleOnChange("nif")}
                />
              </div>
              <div className={classes.field}>
                <label>Nombre</label>
                <input value={client.name} onChange={handleOnChange("name")} />
              </div>
              <div className={classes.field}>
                <label>Primer Apellido</label>
                <input
                  value={client.lastnameA}
                  onChange={handleOnChange("lastnameA")}
                />
              </div>
              <div className={classes.field}>
                <label>Segundo Apellido</label>
                <input
                  value={client.lastnameB}
                  onChange={handleOnChange("lastnameB")}
                />
              </div>
              <div className={classes.field}>
                <label>Provincia</label>
                <input
                  value={client.province}
                  onChange={handleOnChange("province")}
                />
              </div>
            </>
          )}
          {client.documentType == "NIE" && (
            <>
              <div className={classes.field}>
                <label>NIE</label>
                <input
                  type="text"
                  value={client.nif}
                  onChange={handleOnChange("nie")}
                />
              </div>
              <div className={classes.field}>
                <label>Nombre</label>
                <input value={client.name} onChange={handleOnChange("name")} />
              </div>
              <div className={classes.field}>
                <label>Primer Apellido</label>
                <input
                  value={client.lastnameA}
                  onChange={handleOnChange("lastnameA")}
                />
              </div>

              <div className={classes.field}>
                <label>Provincia</label>
                <input
                  value={client.province}
                  onChange={handleOnChange("province")}
                />
              </div>
            </>
          )}
          {client.documentType == "PASSPORT" && (
            <>
              <div className={classes.field}>
                <label>PASSPORT</label>
                <input
                  type="text"
                  value={client.nif}
                  onChange={handleOnChange("PASSPORT")}
                />
              </div>
              <div className={classes.field}>
                <label>Nombre</label>
                <input value={client.name} onChange={handleOnChange("name")} />
              </div>
              <div className={classes.field}>
                <label>Primer Apellido</label>
                <input
                  value={client.lastnameA}
                  onChange={handleOnChange("lastnameA")}
                />
              </div>
              <div className={classes.field}>
                <label>Provincia</label>
                <input
                  value={client.province}
                  onChange={handleOnChange("province")}
                />
              </div>
              <div className={classes.field}>
                <label>Pais</label>
                <input
                  value={client.country}
                  onChange={handleOnChange("country")}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
```

_./index/components/client/index.ts_

```ts
export * from "./bad/bad-client.component";
```

Y en la aplicación principal:

_./src/app.tsx_

```ts
import React from "react";
import { BadClientComponent } from "./components/client";

export const App = () => {
  return <BadClientComponent />;
};
```
