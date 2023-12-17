import { PrismaClient } from "@prisma/client";
import * as Yup from "yup";

const prisma = new PrismaClient();

class UserStatus {
  async update(req, res) {
    const schema = Yup.object().shape({
      cpf: Yup.string().required(),
      email: Yup.string().required(),
      cnpj: Yup.string().required(),
      senha: Yup.string().required(),
      NomeLoja: Yup.string().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: true });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }
    const { cpf, email, cnpj, senha, NomeLoja } = req.body;

    try {
      const usuarioAtualizado = await prisma.users.update({
        where: {
          cpf: cpf,
          email: email,
          senha: senha,
        },
        data: {
          NomeLoja: NomeLoja,
          cnpj: cnpj,
          status: "Lojista",
        },
      });
      return res.status(200).json({
        message:
          "Parabens voce atualizou o seu status de usuario para " +
          usuarioAtualizado.status,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new UserStatus();
