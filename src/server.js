import BotTelegram from "./utils/TelegramBot.js";
import app from "./app.js";

const port = process.env.PORT || 3000;
const bot = new BotTelegram();

app.listen(port, async () => {
  console.log(`Running on http://localhost:${port}`);
  await bot.Webhook();
});
