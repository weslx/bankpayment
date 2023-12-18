import { Router } from "express";
import CreateAccount from "../controller/CreateAccount.js";
import InfoUsers from "../controller/Deposits.js";
import UpdateUserStatus from "../controller/UpdateUserStatus.js";
import ValueTransfer from "../controller/ValueTransfer.js";

const routes = new Router();

routes.post("/criarusuario", CreateAccount.store);
routes.post("/depositar", InfoUsers.store);
routes.post("/mudar-status", UpdateUserStatus.update);
routes.post("/transferencia", ValueTransfer.send);

routes.get("/", (req, res) => {
  res.send("test");
});

export default routes;
