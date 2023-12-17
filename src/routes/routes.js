import { Router } from "express";
import CreateAccount from "../controller/CreateAccount.js";
import InfoUsers from "../controller/InfoUsers.js";

const routes = new Router();

routes.post("/criarusuario", CreateAccount.store);
routes.post("/depositar", InfoUsers.store);

routes.get("/", (req, res) => {
  res.send("test");
});

export default routes;
