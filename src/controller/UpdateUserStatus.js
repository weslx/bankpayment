import { PrismaClient } from "@prisma/client";
import * as Yup from "yup";

const prisma = new PrismaClient();

class UserStatus {
  async update(req, res) {
    const { cnpj, NomeLoja, token } = req.body;

    const idUsuario = token.id;

    try {
      const usuarioAtualizado = await prisma.users.update({
        where: {
          id: idUsuario,
        },
        data: {
          NomeLoja: NomeLoja,
          cnpj: cnpj,
          status: "Lojista",
        },
      });
      return res.status(200).json({
        message:
          "Parabéns voce atualizou o seu status de usuario para " +
          usuarioAtualizado.status +
          ". Apartir de agora voce so pode receber transaçoes",
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new UserStatus();
