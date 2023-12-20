import "dotenv/config";
import axios from "axios";

const TELEGRAM_TOKEN = process.env.TOKEN;
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
    console.log(req.body);

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: "6508254640",
      text: "oi",
    });
    return res.send();
  }
}

export default BotTelegram;
