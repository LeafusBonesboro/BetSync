import "dotenv/config";
import fetch from "node-fetch";
import { Client, GatewayIntentBits } from "discord.js";

// ✅ Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 🟢 When bot starts
client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// 💬 Listen for messages
client.on("messageCreate", async (message) => {
  // Ignore messages from bots (including itself)
  if (message.author.bot) return;

  console.log(`📩 Message from ${message.author.username}: ${message.content}`);

  // 1️⃣ Detect FanDuel links
  if (message.content.includes("fanduel.com")) {
    console.log("🎯 Found FanDuel link:", message.content);

    try {
      const res = await fetch("http://localhost:4000/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "FanDuel Bet Link",
          market: "Shared via Discord",
          stake: 0,
          odds: 0,
          status: "Pending",
          link: message.content,
        }),
      });

      const data = await res.json();
      console.log("✅ Sent link to backend:", data);
    } catch (err) {
      console.error("❌ Error sending FanDuel link:", err);
    }
  }

  // 2️⃣ Detect uploaded bet slip images
  if (message.attachments.size > 0) {
    message.attachments.forEach(async (attachment) => {
      console.log(`🖼️ Image uploaded: ${attachment.url}`);

      try {
        const res = await fetch("http://localhost:4000/api/bets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "FanDuel Slip",
            market: "Pending Parse",
            stake: 0,
            odds: 0,
            status: "Pending",
            imageUrl: attachment.url,
          }),
        });

        const data = await res.json();
        console.log("✅ Sent image to backend:", data);
      } catch (err) {
        console.error("❌ Error sending image to backend:", err);
      }
    });
  }
});

// 🚀 Start the bot
client.login(process.env.DISCORD_TOKEN);
