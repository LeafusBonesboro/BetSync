import fs from "fs";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { Client, GatewayIntentBits, Message } from "discord.js";
import vision from "@google-cloud/vision";

dotenv.config();

// ✅ Load Google Vision credentials
let credentials: any = {};
try {
  credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}");

  // 🔧 Fix for private_key newline issue
  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  }

  console.log("✅ Loaded Vision credentials for:", credentials.client_email);
} catch (err) {
  console.error("❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", err);
}

// 🧠 Initialize Google Vision Client
const visionClient = new vision.ImageAnnotatorClient({ credentials });

// 🤖 Initialize Discord Client
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 📡 Send parsed bet to backend
async function sendParsedBetToBackend(parsedBet: any) {
  const apiUrl = process.env.API_URL || "http://localhost:4000/bets";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedBet),
  });

  if (!response.ok) {
    console.error("❌ Failed to send bet to backend:", await response.text());
  } else {
    console.log("✅ Bet sent to backend successfully!");
  }
}

// 🧠 Extract text from image using Google Vision
async function extractTextFromImage(imageUrl: string) {
  try {
    const [result] = await visionClient.textDetection(imageUrl);
    const text = result.textAnnotations?.[0]?.description || "";
    console.log("🧠 OCR Extracted Text (first 200 chars):", text.slice(0, 200));
    return text;
  } catch (err) {
    console.error("❌ Vision error:", err);
    return "";
  }
}

// 🧩 Parsing helpers
function extractEventName(text: string): string {
  const line = text.split("\n").find((l) => /vs|@/i.test(l));
  return line || "Unknown Event";
}

function extractMarket(text: string): string {
  const line = text.split("\n").find((l) => /(Pts|Yards|Rebounds|Goals)/i);
  return line || "Unknown Market";
}

function extractStake(text: string): number {
  const match = text.match(/\$?(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function extractOdds(text: string): number {
  const match = text.match(/([-+]\d{3})/);
  return match ? parseInt(match[1]) : 0;
}

// 🖼️ Handle uploaded images
async function handleUploadedSlip(imageUrl: string, message: Message) {
  console.log(`🖼️ Image uploaded: ${imageUrl}`);
  const text = await extractTextFromImage(imageUrl);

  if (!text) {
    await message.reply("❌ Couldn't read text from that image.");
    return;
  }

  const parsedBet = {
    event: extractEventName(text),
    market: extractMarket(text),
    stake: extractStake(text),
    odds: extractOdds(text),
    status: "Pending",
    imageUrl,
    link: message.url,
    rawText: text,
  };

  await sendParsedBetToBackend(parsedBet);
  await message.reply(`✅ Bet saved: **${parsedBet.event}** (${parsedBet.market})`);
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
