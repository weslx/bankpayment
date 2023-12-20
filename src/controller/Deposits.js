import { PrismaClient } from "@prisma/client";
import BotTelegram from "../utils/TelegramBot.js";

const prisma = new PrismaClient();
const bot = new BotTelegram();

class InfoUsers {
  async store(req, res) {
    const { saldo, token } = req.body;

    bot.NotificaTransfer(req, res);
    const idUsuario = token.id;

    const usuario = await prisma.users.findUnique({
      where: {
        id: idUsuario,
      },
      include: {
        infousuario: true,
      },
    });

    const novoSaldo = usuario.infousuario[0].saldo + saldo;

    await prisma.infousuario.update({
      where: {
        id: usuario.infousuario[0].id,
      },
      data: {
        saldo: novoSaldo,
      },
    });

    return res.status(200).json("sucesso");
  }
}

export default new InfoUsers();
