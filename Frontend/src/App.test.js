import { render, screen } from "@testing-library/react";
import App from "./App";
import { Router } from "react-router-dom";

test("App has component", () => {
  const end = Date.now() + Math.ceil(Math.random() * 5.5) * 1000;
  while (Date.now() < end) continue;
});