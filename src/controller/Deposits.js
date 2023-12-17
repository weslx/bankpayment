import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class InfoUsers {
  async store(req, res) {
    const { cpf, saldo } = req.body;

    const usuario = await prisma.users.findUnique({
      where: {
        cpf: cpf,
      },
    });

    const depositar = await prisma.infousuario.create({
      data: {
        userId: usuario.id,
        saldo: saldo,
      },
    });

    return res.status(200).json("sucesso" + depositar);
  }
}

export default new InfoUsers();
