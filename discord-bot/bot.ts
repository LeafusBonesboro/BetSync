import fs from "fs";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { Client, GatewayIntentBits, Message } from "discord.js";
import vision from "@google-cloud/vision";

dotenv.config();

/* ------------------------------------------------------
   GOOGLE VISION CREDENTIALS
------------------------------------------------------ */
let credentials: any = {};
try {
  credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}");

  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  }

  console.log("✅ Loaded Vision credentials for:", credentials.client_email);
} catch (err) {
  console.error("❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:", err);
}

/* ------------------------------------------------------
   GOOGLE VISION CLIENT
------------------------------------------------------ */
const visionClient = new vision.ImageAnnotatorClient({ credentials });

/* ------------------------------------------------------
   DISCORD CLIENT
------------------------------------------------------ */
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

/* ------------------------------------------------------
   SEND BET TO BACKEND WITH USER
------------------------------------------------------ */
async function sendParsedBetToBackend(parsedBet: any) {
  const apiUrl = process.env.API_URL || "http://localhost:4000/bets";

  console.log("📤 Sending bet:", parsedBet); // DEBUG

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedBet),
  });

  if (!res.ok) {
    console.error("❌ Backend error:", await res.text());
  } else {
    console.log("✅ Bet sent to backend successfully!");
  }
}

/* ------------------------------------------------------
   OCR
------------------------------------------------------ */
async function extractTextFromImage(imageUrl: string) {
  try {
    const [result] = await visionClient.textDetection(imageUrl);
    const text = result.textAnnotations?.[0]?.description || "";

    console.log("🧠 OCR Extracted Text (first 200 chars):", text.slice(0, 200));
    return text;
  } catch (err) {
    console.error("❌ Vision API error:", err);
    return "";
  }
}

/* ------------------------------------------------------
   PARSER
------------------------------------------------------ */
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

/* ------------------------------------------------------
   HANDLE UPLOADED SLIP (MAIN LOGIC)
------------------------------------------------------ */
async function handleUploadedSlip(imageUrl: string, message: Message) {
  console.log(`🖼️ Image uploaded: ${imageUrl}`);

  const text = await extractTextFromImage(imageUrl);
  if (!text) {
    await message.reply("❌ Couldn't read text from the image.");
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
    discordId: message.author.id, // ⭐ ALWAYS ATTACH THE USER ID
  };

  console.log("📤 Sending bet with discordId:", message.author.id);

  await sendParsedBetToBackend(parsedBet);

  await message.reply(
    `✅ Bet saved for **${message.author.username}**: **${parsedBet.event}** (${parsedBet.market})`
  );
}

/* ------------------------------------------------------
   LISTEN FOR DISCORD MESSAGES
------------------------------------------------------ */
discord.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  if (message.attachments.size > 0) {
    for (const attachment of message.attachments.values()) {
      await handleUploadedSlip(attachment.url, message);
    }
  }
});

/* ------------------------------------------------------
   CORRECT READY EVENT (YOU HAD THIS BROKEN!)
------------------------------------------------------ */
discord.once("ready", () => {
  console.log(`🤖 Logged in as ${discord.user?.tag}`);
});

/* ------------------------------------------------------
   LOGIN
------------------------------------------------------ */
discord.login(process.env.DISCORD_TOKEN);
