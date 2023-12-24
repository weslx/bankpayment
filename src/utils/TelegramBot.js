import { Telegraf, Markup } from "telegraf";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const SERVER_URL = process.env.SERVER_URL;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

bot.telegram.setWebhook(`${SERVER_URL}/webhook/${TELEGRAM_TOKEN}`);

bot.start((ctx) => {
  ctx.reply(
    "🚀Bem-vindo ao bot de notificações de transações bancárias!🚀\n\nPor favor, siga as instruções abaixo para começar:\n\n1️⃣ Clique no botão 'Código' abaixo.\n2️⃣ Insira o código que você recebeu.\n\n",
    Markup.inlineKeyboard([Markup.button.callback("🔑 *Código*", "CODIGO")])
  );
});

let EsperandoCodigo = false;

export async function notificar(chatId, texto) {
  await bot.telegram.sendMessage(chatId, texto);
}

bot.action("CODIGO", (ctx) => {
  ctx.reply("Por favor, insira o seu código:");
  EsperandoCodigo = true;
});

bot.use(async (ctx) => {
  if (!EsperandoCodigo) return;

  const codigo = ctx.message.text.trim();
  EsperandoCodigo = false;

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

    if (ChecarCodigo.chatId && chatidString !== ChecarCodigo.chatId) {
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
