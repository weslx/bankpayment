import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class TransferValue {
  async send(req, res) {
    const { token, CpfReceber, valor } = req.body;

    const idUsuario = token.id;

    const UserTransferExiste = await prisma.users.findUnique({
      where: {
        id: idUsuario,
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

    if (UserTransferExiste.cpf === CpfReceber) {
      return res
        .status(400)
        .json("Não é possível transferir dinheiro para o mesmo CPF");
    }

    if (!UserTransferExiste) {
      return res
        .status(400)
        .json("Usuario com este cpf nao existe " + UserTransferExiste.cpf);
    }

    if (!UserReceberExiste) {
      return res
        .status(400)
        .json("Usuario que voce deseja enviar o dinheiro nao existe");
    }

    if (UserTransferExiste.infousuario[0].saldo < valor) {
      return res
        .status(400)
        .json("Saldo insuficiente para realizar a transferência");
    }

    await prisma.infousuario.update({
      where: {
        id: UserTransferExiste.infousuario[0].id,
      },
      data: {
        saldo: UserTransferExiste.infousuario[0].saldo - valor,
      },
    });

    await prisma.infousuario.update({
      where: {
        id: UserReceberExiste.infousuario[0].id,
      },
      data: {
        saldo: UserReceberExiste.infousuario[0].saldo + valor,
      },
    });
    return res.status(200).json("Transferência realizada com sucesso");
  }
}

export default new TransferValue();
