import { Router } from "express";
import CreateAccount from "../controller/CreateAccount.js";

const routes = new Router();

routes.post("/criarusuario", CreateAccount.store);

routes.get("/", (req, res) => {
  res.send("test");
});

export default routes;
