import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  private getRedirectUri() {
    const uri = process.env.NODE_ENV === "production"
      ? process.env.DISCORD_REDIRECT_URI_PROD
      : process.env.DISCORD_REDIRECT_URI;

    console.log("🔄 getRedirectUri():", uri);
    return uri;
  }

  redirectToDiscord(res: Response) {
    const redirectUri = this.getRedirectUri();

    console.log("➡️ redirectToDiscord() - redirecting to Discord OAuth");
    console.log("➡️ Using redirect URI:", redirectUri);

    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      redirect_uri: redirectUri!,
      response_type: "code",
      scope: "identify email"
    });

    return res.redirect(`https://discord.com/oauth2/authorize?${params}`);
  }

  async handleDiscordCallback(code: string, res: Response) {
    console.log("📥 handleDiscordCallback() FIRED");
    console.log("📥 Received OAuth code:", code);

    const redirectUri = this.getRedirectUri();
    console.log("🔄 Using redirectUri for token exchange:", redirectUri);

    try {
      // Exchange code for token
      console.log("🔑 Exchanging code for Discord token...");
      const tokenRes = await axios.post(
        "https://discord.com/api/oauth2/token",
        new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID!,
          client_secret: process.env.DISCORD_CLIENT_SECRET!,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri!
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      console.log("🔑 Token exchange success!");
      const accessToken = tokenRes.data.access_token;

      // Fetch Discord user info
      console.log("👤 Fetching Discord user...");
      const discordUser = await axios.get("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      console.log("👤 Discord user data:", discordUser.data);

      const { id, username, avatar } = discordUser.data;

      // Upsert user
      console.log("📝 Upserting user with Discord ID:", id);
      const user = await this.prisma.user.upsert({
        where: { discordId: id },
        update: {
          discordName: username,
          discordAvatar: avatar
        },
        create: {
          discordId: id,
          username: username,
          discordName: username,
          discordAvatar: avatar
        }
      });

      console.log("📝 User upserted:", user.id);

      // Create JWT
      const jwtToken = this.jwt.sign({ sub: user.id });
      console.log("🔐 JWT generated for user:", user.id);

      // Set cookie
      console.log("🍪 Attempting to set cookie...");
      res.cookie("token", jwtToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      console.log("🍪 Cookie set COMPLETE");

      // Redirect home
      const redirect = process.env.FRONTEND_URL!;
      console.log("🔁 Redirecting user to frontend:", redirect);
      return res.redirect(redirect);

    } catch (err) {
      console.error("❌ ERROR in handleDiscordCallback():", err);
      return res.status(500).json({ error: "OAuth callback failed", details: err });
    }
  }

  async me(userId: string) {
    console.log("🔎 /auth/me called with userId:", userId);

    if (!userId) {
      console.log("🔎 No userId detected → returning null");
      return null;
    }

    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        discordId: true,
        discordName: true,
        discordAvatar: true,
        createdAt: true
      }
    });
  }

  async findByDiscordId(discordId: string) {
    console.log("🔍 findByDiscordId:", discordId);
    return this.prisma.user.findUnique({
      where: { discordId },
    });
  }
}
