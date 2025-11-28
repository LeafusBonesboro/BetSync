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
  credentials = JSON.parse(
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}"
  );

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
   SMART API ROUTING (LOCAL FOR YOU, PROD FOR EVERYONE ELSE)
------------------------------------------------------ */

// YOUR Discord ID — ONLY you get localhost access
const DEV_DISCORD_ID = "168204371929202689";

async function resolveApiUrl(authorId: string) {
  const localUrl = "http://localhost:4000/bets";
  const prodUrl = process.env.API_URL; // Render backend URL

  // Safety check
  if (!prodUrl) {
    console.error("❌ Missing API_URL in .env!");
    return localUrl; // fallback
  }

  // If author is NOT you → always use PROD
  if (authorId !== DEV_DISCORD_ID) {
    return prodUrl;
  }

  // For YOU → check if local backend is running
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);

    const res = await fetch(localUrl, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      console.log("🟢 Using LOCAL backend:", localUrl);
      return localUrl;
    }
  } catch (_) {
    // ignore
  }

  console.log("🟣 Using PROD backend:", prodUrl);
  return prodUrl;
}

/* ------------------------------------------------------
   SEND BET TO BACKEND
------------------------------------------------------ */
async function sendParsedBetToBackend(parsedBet: any) {
  const apiUrl = await resolveApiUrl(parsedBet.discordId);

  console.log("📤 Sending bet to:", apiUrl);

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

    console.log("🧠 OCR Extracted Text:", text.slice(0, 200));
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
  const line = text
    .split("\n")
    .find((l) => /(Pts|Yards|Rebounds|Goals)/i.test(l));
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
   HANDLE IMAGE LOGIC
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
    discordId: message.author.id, // ⭐ REQUIRED for mapping to Supabase user
  };

  console.log("📩 Parsed bet:", parsedBet);

  await sendParsedBetToBackend(parsedBet);

  await message.reply(
    `✅ Bet saved for **${message.author.username}**`
  );
}

/* ------------------------------------------------------
   DISCORD LISTENER
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
   READY EVENT
------------------------------------------------------ */
discord.once("ready", () => {
  console.log(`🤖 Logged in as ${discord.user?.tag}`);
});

/* ------------------------------------------------------
   LOGIN
------------------------------------------------------ */
discord.login(process.env.DISCORD_TOKEN);
