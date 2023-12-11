import * as Yup from "yup";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CreateAccount {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required,
      sobrenome: Yup.string().required,
      cpf: Yup.string().required,
      cnpj: Yup.string().notRequired,
      email: Yup.string().required,
    });

    try {
      await schema.isValid(req.body, { abortEarly: true });
    } catch (error) {
      return res.status(400).json(error);
    }

    const { nome, sobrenome, cpf, cnpj, email } = req.body;

    const usuarioExistente = await prisma.criarUsuario.findUnique({
      where: {
        where: {
          email: email,
          cpf: cpf,
        },
      },
    });

    try {
      const usuariocriado = await prisma.criarUsuario.create({
        data: {
          nome: nome,
          sobrenome: sobrenome,
          cpf: cpf,
          cnpj: cnpj,
          email: email,
        },
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}
