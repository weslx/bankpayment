import "dotenv/config";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const SERVER_URL = process.env.SERVER_URL;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const URI = `/webhook/${TELEGRAM_TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

class BotTelegram {
  async Webhook() {
    const response = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
    );
    console.log(response.data);
  }

  async NotificaTransfer(req, res) {
    const message = req.body.message;
    console.log(message);
    if (message.text.startsWith("/start")) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: message.chat.id,
        text: "Bem vindo ao bot de notificaçoes de transaçoes bancarias, escreva /help para ajuda",
      });
    }

    if (message.text.startsWith("/help")) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: message.chat.id,
        text: "Para receber notificações de futuras transaçoes, escreva: /codigo (Codigo que voce recebeu do site)",
      });
    }
    if (message.text.startsWith("/codigo")) {
      const codigo = message.text.slice("/codigo".length).trim();

      const ChecarCodigo = await prisma.infotelegram.findUnique({
        where: {
          tag: codigo,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      const chatid = message.from.id;
      console.log(chatid);
      const chatidString = chatid.toString();
      console.log(chatidString);

      if (!ChecarCodigo) {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: message.chat.id,
          text: "Erro, esse codigo nao existe",
        });
        return res.send();
      }

      try {
        if (ChecarCodigo.verificado === 1) {
          if (chatidString === ChecarCodigo.chatId) {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
              chat_id: message.chat.id,
              text: `Voce ja vinculou esse codigo em sua conta`,
            });
            return res.send();
          }
        }

        if (chatidString !== ChecarCodigo.chatId) {
          await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: message.chat.id,
            text: `Esse codigo ja foi registrado por outra pessoa`,
          });
          return res.send();
        }

        await prisma.infotelegram.update({
          where: {
            tag: codigo,
          },
          data: {
            chatId: chatidString,
            nome: message.from.first_name,
            sobrenome: message.from.last_name,
            username: message.from.username || null,
            verificado: 1,
          },
        });

        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: message.chat.id,
          text: `Telegram registrado com sucesso no email, ${ChecarCodigo.user.email}`,
        });
      } catch (error) {
        console.log(error);
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: message.chat.id,
          text: error,
        });
      }
      return res.send();
    }
  }
}

export default BotTelegram;
