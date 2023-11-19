import React from "react";
import { useDebounce } from "use-debounce";

export const App = () => {
  const [filter, setFilter] = React.useState("");
  const [debouncedFilter] = useDebounce(filter, 500);
  const [userCollection, setUserCollection] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://rickandmortyapi.com/api/character/?name=${debouncedFilter}`)
      .then((response) => response.json())
      .then((json) => setUserCollection(json.results || []));
  }, [debouncedFilter]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>
        {userCollection.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};
