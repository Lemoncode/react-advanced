import React from "react";
import classes from "./mobile-user-profile.css";

interface Props {
  name: string;
  lastname: string;
}

export const MobileUserProfile: React.FC<Props> = (props) => {
  const { name, lastname } = props;
  return (
    <div className={classes.root}>
      <p>
        User: {name} {lastname}
      </p>
    </div>
  );
};
