import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTodoList } from "./todo.api";
import classes from "./todo.page.css";

export const TodoPage: React.FC = () => {
  const { data } = useQuery(["todoList"], () => getTodoList());

  return (
    <>
      <h1>Todo Page</h1>
      <div className={classes.todoList}>
        {data?.map((todo) => (
          <>
            <div>{todo.isDone ? "✅" : "⭕️"}</div>
            <div>{todo.description}</div>
            <div>Command area</div>
          </>
        ))}
      </div>
      <Link to="/list">To List</Link>
    </>
  );
};
