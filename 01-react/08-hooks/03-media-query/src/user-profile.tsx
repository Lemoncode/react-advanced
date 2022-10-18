import React from "react";
import classes from "./user-profile.css";

interface Props {
  name: string;
  lastname: string;
  email: string;
  role: string;
}

export const UserProfile: React.FC<Props> = (props) => {
  const { name, lastname, email, role } = props;
  return (
    <div className={classes.root}>
      <p>
        User: {name} {lastname}
      </p>
      <p>Email: {email}</p>
      <p>Role: {role}</p>
    </div>
  );
};
