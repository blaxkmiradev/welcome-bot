import { Bot } from "grammy";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("❌ Please set BOT_TOKEN in your .env file!");
  process.exit(1);
}

// Initialize the bot
const bot = new Bot(BOT_TOKEN);

// Listen for new chat members
bot.on("message:new_chat_members", async (ctx) => {
  const newMembers = ctx.message.new_chat_members;
  
  for (const member of newMembers) {
    // If the bot itself is added to a group, send an intro message
    if (member.is_bot && member.id === ctx.me.id) {
      await ctx.reply("👋 Hello everyone! I am your new Welcome Bot. Thanks for adding me!");
      continue;
    }

    // Ignore other bots joining
    if (member.is_bot) continue;

    const userName = member.first_name || "Awesome Person";
    
    // Cool formatted welcome message using HTML
    const welcomeMessage = `
🎉 <b>Welcome to the community, <a href="tg://user?id=${member.id}">${userName}</a>!</b> 🎉

We are thrilled to have you here. 🌟 
Please take a moment to read the pinned rules and introduce yourself to the team!

<i>Enjoy your stay!</i> 🚀
`;

    // Send the message with an inline keyboard
    await ctx.reply(welcomeMessage, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📚 Read Rules", url: "https://t.me/your_rules_link" },
            { text: "🌐 Our Website", url: "https://example.com" }
          ]
        ]
      }
    });
  }
});

// Basic start command for private messages
bot.command("start", (ctx) => {
  ctx.reply("🤖 Hi! I'm a Welcome Bot. Add me to a group, make me an admin, and I will greet new members in style!");
});

// Handle errors gracefully
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`❌ Error while handling update ${ctx.update.update_id}:`);
  console.error(err.error);
});

// Start the bot
console.log("🚀 Welcome Bot is starting with Bun...");
bot.start();
