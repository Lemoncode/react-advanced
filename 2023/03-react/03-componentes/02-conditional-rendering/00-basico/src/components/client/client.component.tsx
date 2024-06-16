import React, { useState } from "react";
import { Client } from "./model";
import { loadClient } from "./client.api";
import { createEmptyClient } from "./model";

export const ClientComponent = () => {
  const [client, setClient] = useState<Client>(createEmptyClient());

  React.useEffect(() => {
    loadClient().then((client) => setClient(client));
  }, []);

  if (!client) {
    return null;
  }

  return (
    <div>
      <h1>Client</h1>
      <h2>{client.name}</h2>
    </div>
  );
};
