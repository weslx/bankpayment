import { Router } from "express";
import VerificarToken from "../utils/VerificarTokens.js";
import CreateAccount from "../controller/CreateAccount.js";
import LoginAccount from "../controller/LoginAccount.js";
import InfoUsers from "../controller/Deposits.js";
import UpdateUserStatus from "../controller/UpdateUserStatus.js";
import ValueTransfer from "../controller/ValueTransfer.js";
import ConnectTelegram from "../controller/ConnectUserTelegram.js";
import BotTelegram from "../utils/TelegramBot.js";

const routes = new Router();
const bot = new BotTelegram();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

routes.post("/criarusuario", CreateAccount.store);
routes.post("/login", LoginAccount.login);
routes.post("/depositar", VerificarToken, InfoUsers.store);
routes.put("/mudar-status", VerificarToken, UpdateUserStatus.update);
routes.post("/transferencia", VerificarToken, ValueTransfer.send);
routes.post("/telegram", VerificarToken, ConnectTelegram.connect);
routes.post(`/webhook/${TELEGRAM_TOKEN}`, bot.NotificaTransfer);

routes.get("/", (req, res) => {
  res.send("test");
});

export default routes;
