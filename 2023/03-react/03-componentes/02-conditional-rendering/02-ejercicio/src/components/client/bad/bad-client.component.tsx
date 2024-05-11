import React, { useState } from "react";
import { Client } from "../model";
import { loadClient } from "../client.api";
import { createEmptyClient } from "../model";
import classes from "./bad-client.component.module.css";

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
