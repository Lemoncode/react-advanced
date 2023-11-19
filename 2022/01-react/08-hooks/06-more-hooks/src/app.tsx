import React from "react";
import useGeolocationState from "beautiful-react-hooks/useGeolocationState";

export const App = () => {
  const { isSupported, isRetrieving, position, onError } = useGeolocationState();

  onError((error) => {
    alert(error.message);
  });

  return (
    <div>
      {isRetrieving && <span>Loading Geolocation...</span>}
      {isSupported && position && (
        <>
          <pre>{JSON.stringify(position, null, 2)}</pre>
        </>
      )}
    </div>
  );
};
