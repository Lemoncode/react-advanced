import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTodoList } from "./todo.api";

export const TodoPage: React.FC = () => {
  const { data } = useQuery(["todoList"], () => getTodoList());

  return (
    <>
      <h1>Todo Page</h1>
      <ul>
        {data?.map((todo) => (
          <li key={todo.id}>
            {todo.isDone ? "✅" : "⭕️"} {todo.description} -
          </li>
        ))}
      </ul>
      <Link to="/list">To List</Link>
    </>
  );
};
