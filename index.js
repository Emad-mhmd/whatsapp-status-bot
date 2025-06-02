const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

// بوت تيليجرام
const bot = new TelegramBot(config.telegramToken, { polling: false });

// واتساب بوت
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('👀 امسح الكود في واتساب.');
});

client.on('ready', () => {
  console.log('✅ واتساب جاهز.');
});

client.on('message', async msg => {
  if (msg.body === '!ping') {
    msg.reply('البوت شغال ✅');
  }
});

client.on('message_revoke_everyone', async (after, before) => {
  const contact = await before.getContact();
  const name = contact.pushname || contact.number;
  const text = `📢 حالة جديدة من: ${name}`;
  bot.sendMessage(config.telegramChatId, text);
});

client.initialize();
