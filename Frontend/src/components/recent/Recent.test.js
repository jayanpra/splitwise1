import { render, screen } from "@testing-library/react";
import Recent from "./Recent";
import { Router } from "react-router-dom";

test("Recent has component", () => {
  const end = Date.now() + Math.ceil(Math.random() * 5.5) * 1000;
  while (Date.now() < end) continue;
});