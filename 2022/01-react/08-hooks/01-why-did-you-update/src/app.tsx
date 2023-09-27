import React from "react";

interface Name {
  firstname: string;
  lastname: string;
}

const name: Name = {
  firstname: "John",
  lastname: "Doe",
};

export const App = () => {
  const [id, setId] = React.useState(0);
  const [count, setCount] = React.useState(0);

  return (
    <>
      <ChildComponent name={name} id={id} />
      <button onClick={() => setId(id + 1)}>Increment id</button>

      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
    </>
  );
};

interface ChildProps {
  name: Name;
  id: number;
}

export const ChildComponent: React.FC<ChildProps> = React.memo((props) => {
  useWhyDidYouUpdate("ChildComponent", props);

  return (
    <div>
      {props.name.firstname} {props.name.lastname} id: {props.id}
    </div>
  );
});

const useWhyDidYouUpdate = (name, props) => {
  const previousProps = React.useRef<any>();
  React.useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changesObj = {};
      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj);
      }
    }
    previousProps.current = props;
  });
};
