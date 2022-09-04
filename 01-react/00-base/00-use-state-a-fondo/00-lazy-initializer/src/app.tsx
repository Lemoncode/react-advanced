import React from "react";

export const createClient = () => {
  console.log("factory invoked");
  return { name: "Pepe", lastname: "Perez" };
};

export const App = () => {
  const [myClient, setMyClient] = React.useState(() => createClient());

  return (
    <>
      <h1>{myClient.name}</h1>
      <input
        value={myClient.name}
        onChange={(e) => setMyClient({ ...myClient, name: e.target.value })}
      />
    </>
  );
};
