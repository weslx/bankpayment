import { Telegraf, Markup } from "telegraf";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.telegram.setWebhook(
  `${process.env.SERVER_URL}/webhook/${process.env.TELEGRAM_TOKEN}`
);

bot.start((ctx) =>
  ctx.reply(
    "Bem vindo ao bot de notificaçoes de transaçoes bancarias, escreva /help para ajuda",
    Markup.inlineKeyboard([
      Markup.button.callback("Help", "HELP"),
      Markup.button.callback("Código", "CODIGO"),
    ])
  )
);

bot.action("HELP", (ctx) =>
  ctx.reply(
    "Para receber notificações de futuras transaçoes, escreva: /codigo (Codigo que voce recebeu do site)"
  )
);

bot.action("CODIGO", async (ctx) => {
  const codigo = ctx.message.text.slice("/codigo".length).trim();

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

  if (!ChecarCodigo) {
    await ctx.reply("Erro, esse codigo nao existe");
    return;
  }

  try {
    const chatidString = ctx.message.from.id.toString();

    if (ChecarCodigo.verificado === 1 && chatidString === ChecarCodigo.chatId) {
      await ctx.reply("Voce ja vinculou esse codigo em sua conta");
      return;
    }

    if (chatidString !== ChecarCodigo.chatId) {
      await ctx.reply("Esse codigo ja foi registrado por outra pessoa");
      return;
    }

    await prisma.infotelegram.update({
      where: {
        tag: codigo,
      },
      data: {
        chatId: chatidString,
        nome: ctx.message.from.first_name,
        sobrenome: ctx.message.from.last_name,
        username: ctx.message.from.username || null,
        verificado: 1,
      },
    });

    await ctx.reply(
      `Telegram registrado com sucesso no email, ${ChecarCodigo.user.email}`
    );
  } catch (error) {
    console.error(error);
    await ctx.reply(error);
  }
});

export default bot;
