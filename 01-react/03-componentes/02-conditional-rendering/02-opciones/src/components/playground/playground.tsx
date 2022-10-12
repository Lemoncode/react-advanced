import React from "react";

const ClientNameCollectionComponent: React.FC<{
  clientNameCollection: string[];
}> = ({ clientNameCollection }) => (
  <>
    {clientNameCollection.map((name) => (
      <h2 key={name}>{name}</h2>
    ))}
  </>
);

export const PlayGround: React.FC = () => {
  const [clientNameCollection, setClientNameCollection] = React.useState<
    string[]
  >([]);

  function renderClientNameCollection() {
    if (clientNameCollection.length) {
      return clientNameCollection.map((name) => <h2 key={name}>{name}</h2>);
    } else {
      return null;
    }
  }

  React.useEffect(() => {
    setClientNameCollection(["Pepe", "Juan", "Maria"]);
  }, []);

  return (
    <div>
      <h1>PlayGround Conditional Rendering</h1>
      {clientNameCollection.length ? (
        <ClientNameCollectionComponent
          clientNameCollection={clientNameCollection}
        />
      ) : null}
    </div>
  );
};
