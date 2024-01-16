import prisma from "../client.js";
import { notificar } from "../utils/TelegramBot.js";

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
        infotelegram: true,
      },
    });

    if (!UserTransferExiste) {
      return res.status(400).json("Seu usuario nao existe");
    }

    if (!UserReceberExiste) {
      return res
        .status(400)
        .json("Usuario que voce deseja enviar o dinheiro nao existe");
    }

    if (UserTransferExiste.status === "Lojista") {
      return res
        .status(400)
        .json("Este usuario e lojista e nao pode transferir dinheiro");
    }
    if (UserTransferExiste.cpf === CpfReceber) {
      return res
        .status(400)
        .json("Não é possível transferir dinheiro para o mesmo CPF");
    }
    if (valor <= 0) {
      return res.status(400).json("O valor deve ser maior que 0");
    }

    if (UserTransferExiste.infousuario[0].saldo < valor) {
      return res
        .status(400)
        .json("Saldo insuficiente para realizar a transferência");
    }

    const transferencia = await prisma.$transaction([
      prisma.infousuario.update({
        where: {
          id: UserTransferExiste.infousuario[0].id,
        },
        data: {
          saldo: UserTransferExiste.infousuario[0].saldo - valor,
        },
      }),
      prisma.infousuario.update({
        where: {
          id: UserReceberExiste.infousuario[0].id,
        },
        data: {
          saldo: UserReceberExiste.infousuario[0].saldo + valor,
        },
      }),
    ]);

    const texto =
      "Voce acabou de receber uma transferencia no valor de R$" +
      valor +
      ", pelo usuario com cpf " +
      UserTransferExiste.cpf;

    const chatid = UserReceberExiste.infotelegram.chatId;

    await notificar(chatid, texto);

    if (!transferencia) {
      throw new Error("Falha na transferência");
    }

    return res.status(200).json("Transferência realizada com sucesso");
  }
}

export default new TransferValue();
