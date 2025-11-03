import dotenv from "dotenv";
dotenv.config();
console.log("🔍 GOOGLE_APPLICATION_CREDENTIALS =", process.env.GOOGLE_APPLICATION_CREDENTIALS);
import fs from "fs";
if (process.env.GOOGLE_APPLICATION_CREDENTIALS && !fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
  console.error("❌ Key file NOT FOUND at that path!");
}

import { Client, GatewayIntentBits, Message } from "discord.js";
import vision from "@google-cloud/vision";

// ✅ Initialize the Vision client (no manual key load — it reads GOOGLE_APPLICATION_CREDENTIALS)
const visionClient = new vision.ImageAnnotatorClient();

// ✅ Initialize Discord client
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


// 🧠 OCR function
async function extractTextFromImage(imageUrl: string) {
  try {
    const [result] = await visionClient.textDetection(imageUrl);
    const text = result.textAnnotations?.[0]?.description || "No text detected";
    console.log("🧠 Extracted text:\n", text);
    return text;
  } catch (err) {
    console.error("❌ Vision error:", err);
    return null;
  }
}

// 🖼️ Handle uploaded images
async function handleUploadedSlip(imageUrl: string, message: Message) {
  console.log(`🖼️ Image uploaded: ${imageUrl}`);
  const text = await extractTextFromImage(imageUrl);

  if (!text) {
    await message.reply("❌ Couldn't read text from that image.");
    return;
  }

  await message.reply(`🧠 **Extracted Text:**\n\`\`\`${text.slice(0, 1900)}\`\`\``);
}

// 💬 Handle messages
discord.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  if (message.attachments.size > 0) {
    for (const attachment of message.attachments.values()) {
      await handleUploadedSlip(attachment.url, message);
    }
  }
});

// 🚀 Start bot
discord.once("ready", () => {
  console.log(`🤖 Logged in as ${discord.user?.tag}`);
});

discord.login(process.env.DISCORD_TOKEN);
