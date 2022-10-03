import React from "react";
import { Link } from "react-router-dom";

export const ListPage: React.FC = () => {
  return (
    <>
      <h1>List Page</h1>
      <Link to="/todo">To ToDo</Link>
    </>
  );
};
