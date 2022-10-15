import React from "react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div>
      <h2>Home</h2>
      <ul>
        <li>
          <Link to="/module-a/page-a">Module A - Page A</Link>
        </li>
        <li>
          <Link to="/module-a/page-b">Module A - Page B</Link>
        </li>
        <li>
          <Link to="/module-b/page-a">Module B - Page A</Link>
        </li>
        <li>
          <Link to="/module-b/page-b">Module B - Page B</Link>
        </li>
      </ul>
    </div>
  );
};
