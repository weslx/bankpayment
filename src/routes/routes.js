import { Router } from "express";

const routes = new Router();

routes.get("/", (req, res) => {
  res.send("test");
});

export default routes;
