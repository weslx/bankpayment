import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TrasnferValue {
  async send(req, res) {
    const { CpfTransfer, CpfReceber, valor } = req.body;

    const UserTransferExiste = await prisma.users.findUnique({
      where: {
        cpf: CpfTransfer,
      },
      include: {
        infousuario: true,
      },
    });
    const UserReceberExiste = await prisma.users.findUnique({
      where: {
        cpf: CpfReceber,
      },
      include: {
        infousuario: true,
      },
    });

    if (!UserTransferExiste) {
      return res
        .status(400)
        .json("Usuario com este cpf nao existe " + CpfTransfer);
    }

    if (!UserReceberExiste) {
      return res
        .status(400)
        .json("Usuario que voce deseja enviar o dinheiro nao existe");
    }

    console.log(UserTransferExiste);
  }
}

export default new TrasnferValue();
