import * as Yup from "yup";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CreateAccount {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      sobrenome: Yup.string().required(),
      cpf: Yup.string().required(),
      cnpj: Yup.string().notRequired(),
      email: Yup.string().required(),
      senha: Yup.string().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: true });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const { nome, sobrenome, cpf, cnpj, email, senha } = req.body;

    const emailExistente = await prisma.criarusuario.findUnique({
      where: {
        email: email,
      },
    });

    const cpfExistente = await prisma.criarusuario.findUnique({
      where: {
        cpf: cpf,
      },
    });

    if (emailExistente || cpfExistente) {
      return res.status(409).json("Este usuario ja existe, tente fazer login");
    }

    try {
      const usuariocriado = await prisma.criarusuario.create({
        data: {
          nome: nome,
          sobrenome: sobrenome,
          cpf: cpf,
          cnpj: cnpj,
          email: email,
          senha: senha,
        },
      });
      return res.status(200).json({ message: "Usuario Criado", usuariocriado });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new CreateAccount();
