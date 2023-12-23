import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class InfoUsers {
  async store(req, res) {
    const { saldo, token } = req.body;

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
