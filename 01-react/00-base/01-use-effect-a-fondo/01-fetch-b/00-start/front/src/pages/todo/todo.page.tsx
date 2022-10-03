import React from "react";
import { Link } from "react-router-dom";

export const TodoPage: React.FC = () => {
  return (
    <>
      <h1>Todo Page</h1>
      <Link to="/list">To List</Link>
    </>
  );
};
