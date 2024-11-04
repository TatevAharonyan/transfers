import React from "react";
import Transfers from "./Screen/Transfers/Transfers";
import Result from "./Screen/Result/Result";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Transfers />,
    },
    { path: "/result", element: <Result /> },
  ],
  { basename: process.env.PUBLIC_URL }
);

const App = () => {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
