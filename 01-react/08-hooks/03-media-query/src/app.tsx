import React from "react";
import { MobileUserProfile } from "./mobile-user-profile";
import { UserProfile } from "./user-profile";

export const App = () => {
  const userProfile = {
    name: "John",
    lastname: "Doe",
    email: "john.doe@email.com",
    role: "admin",
  };
  const isHighResolution = useMediaQuery("only screen and (min-width: 600px)");

  return (
    <>
      {isHighResolution ? (
        <UserProfile
          name={userProfile.name}
          lastname={userProfile.lastname}
          email={userProfile.email}
          role={userProfile.role}
        />
      ) : (
        <MobileUserProfile
          name={userProfile.name}
          lastname={userProfile.lastname}
        />
      )}
    </>
  );
};

const useMediaQuery = (mediaQuery: string) => {
  const initialMediaQuery = window.matchMedia(mediaQuery);
  const [matches, setMatches] = React.useState(initialMediaQuery.matches);

  React.useEffect(() => {
    const onMatchMediaChange = (event) => setMatches(event.matches);

    window
      .matchMedia(mediaQuery)
      .addEventListener("change", onMatchMediaChange);

    return () => {
      window
        .matchMedia(mediaQuery)
        .removeEventListener("change", onMatchMediaChange);
    };
  }, [mediaQuery]);

  return matches;
};
