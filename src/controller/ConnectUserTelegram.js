import { PrismaClient } from "@prisma/client";
import generateCode from "../utils/GenerateTelegramCode.js";

const prisma = new PrismaClient();

class ConnectTelegram {
  async connect(req, res) {
    const { token } = req.body;

    const idUsuario = token.id;
    const codigo = generateCode();

    const userExiste = await prisma.users.findUnique({
      where: {
        id: idUsuario,
      },
      include: {
        infousuario: true,
        infotelegram: true,
      },
    });
    if (!userExiste) {
      res.status(400).json("Usuario nao encontrado");
    }

    const tagExiste = userExiste.infotelegram.tag;

    const SetarCodigo = await prisma.infotelegram.update({
      where: {
        userId: userExiste.id,
      },
      data: {
        tag: codigo,
      },
    });

    res
      .status(200)
      .json(
        "Seu token para conexão no telegram foi gerado, digite no telegram: /codigo " +
          codigo
      );
  }
}

export default new ConnectTelegram();
