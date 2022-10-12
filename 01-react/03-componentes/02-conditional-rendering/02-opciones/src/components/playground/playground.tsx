import React from "react";

export const PlayGround: React.FC = () => {
  const [clientNameCollection, setClientNameCollection] = React.useState<
    string[]
  >([]);

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
      {clientNameCollection.length
        ? clientNameCollection.map((name) => <h2 key={name}>{name}</h2>)
        : null}
    </div>
  );
};
