import express from "express";
import app from "./app.js";

const port = 3000;

app.listen(port, () => {
  console.log(`Running on http://localhost:${port}`);
});
