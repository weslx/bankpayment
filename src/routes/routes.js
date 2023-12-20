import { Router } from "express";
import VerificarToken from "../utils/VerificarTokens.js";
import CreateAccount from "../controller/CreateAccount.js";
import LoginAccount from "../controller/LoginAccount.js";
import InfoUsers from "../controller/Deposits.js";
import UpdateUserStatus from "../controller/UpdateUserStatus.js";
import ValueTransfer from "../controller/ValueTransfer.js";

const routes = new Router();

routes.post("/criarusuario", CreateAccount.store);
routes.post("/login", LoginAccount.login);
routes.post("/depositar", VerificarToken, InfoUsers.store);
routes.put("/mudar-status", VerificarToken, UpdateUserStatus.update);
routes.post("/transferencia", VerificarToken, ValueTransfer.send);

routes.get("/", (req, res) => {
  res.send("test");
});

export default routes;
