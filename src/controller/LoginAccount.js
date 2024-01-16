import prisma from "../client.js";
import jwt from "jsonwebtoken";
const JWTSECRET = process.env.JWT_SECRET;

class LoginAccount {
  async login(req, res) {
    const { email, senha } = req.body;

    const userExiste = await prisma.users.findUnique({
      where: {
        email: email,
      },
      include: {
        infousuario: true,
      },
    });
    if (!userExiste) {
      res.status(400).json("Email nao existe");
    }

    try {
      if (userExiste.senha === senha) {
        const newToken = jwt.sign({ id: userExiste.id }, JWTSECRET, {
          expiresIn: 100000,
        });

        await prisma.infousuario.update({
          where: {
            userId: userExiste.id,
          },
          data: {
            SessionToken: newToken,
          },
        });

        res.setHeader("Authorization", newToken);
        return res.status(200).json("logado com sucesso");
      } else {
        return res.status(400).json("Senha incorreta");
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

export default new LoginAccount();
