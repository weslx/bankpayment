import { Router } from "express";
import CreateAccount from "../controller/CreateAccount.js";
import InfoUsers from "../controller/Deposits.js";
import UpdateUserStatus from "../controller/UpdateUserStatus.js";

const routes = new Router();

routes.post("/criarusuario", CreateAccount.store);
routes.post("/depositar", InfoUsers.store);
routes.post("/mudar-status", UpdateUserStatus.update);

routes.get("/", (req, res) => {
  res.send("test");
});

export default routes;
