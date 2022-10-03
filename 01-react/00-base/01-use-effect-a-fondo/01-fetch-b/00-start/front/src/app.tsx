import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { TodoPage, ListPage } from "./pages";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        <Route path="/list" element={<ListPage />} />
      </Routes>
    </HashRouter>
  );
};
