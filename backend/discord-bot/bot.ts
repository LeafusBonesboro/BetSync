import "dotenv/config";
import fetch from "node-fetch";
import { Client, GatewayIntentBits, Message } from "discord.js";

// ✅ Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ✅ FanDuel link handler (still useful if people send direct links)
async function handleFanDuelLink(link: string, message: Message): Promise<void> {
  console.log("🎯 Found FanDuel link:", link);

  try {
    const res = await fetch("http://localhost:4000/bets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "FanDuel Bet Link",
        market: "Shared via Discord",
        stake: 0,
        odds: 0,
        status: "Pending",
        link,
      }),
    });

    const data = await res.json();
    console.log("✅ Sent link to backend:", data);
  } catch (err) {
    console.error("❌ Error sending FanDuel link:", err);
  }
}

// ✅ Handle any uploaded image (bet slip screenshots, photos, etc.)
async function handleUploadedSlip(imageUrl: string, message: Message): Promise<void> {
  console.log(`🖼️ Image uploaded: ${imageUrl}`);

  try {
    const ocrRes = await fetch("http://localhost:4000/ocr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    const parsedBet: any = await ocrRes.json();

    if (!ocrRes.ok || (parsedBet && parsedBet.statusCode >= 400)) {
      console.error("❌ OCR failed:", parsedBet);
      return;
    }

    console.log("🧠 OCR Parsed Bet:", parsedBet);

    // 💾 Save parsed bet to DB
    const saveRes = await fetch("http://localhost:4000/bets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedBet),
    });

    const saved: any = await saveRes.json();
    console.log("💾 Saved bet to DB:", saved);

    // 📨 Optional: reply in Discord
    await message.reply(
      `✅ Parsed bet saved:\n` +
        `• **Event:** ${parsedBet.event}\n` +
        `• **Market:** ${parsedBet.market}\n` +
        `• **Odds:** ${parsedBet.odds}\n` +
        `• **Stake:** $${parsedBet.stake}`
    );
  } catch (err) {
    console.error("❌ Error in OCR + save flow:", err);
  }
}

// 🟢 When bot starts
client.once("clientReady", () => {
  if (!client.user) {
    console.error("❌ Client user not ready");
    return;
  }
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// 💬 Message handler
client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  console.log(`📩 Message from ${message.author.username}: ${message.content}`);

  // 1️⃣ Handle FanDuel links
  if (message.content.includes("fanduel.com")) {
    await handleFanDuelLink(message.content, message);
  }

  // 2️⃣ Handle all image uploads
  if (message.attachments.size > 0) {
    for (const attachment of message.attachments.values()) {
      await handleUploadedSlip(attachment.url, message);
    }
  }
});

// 🚀 Start the bot
client.login(process.env.DISCORD_TOKEN);
