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
    return process.env.NODE_ENV === "production"
      ? process.env.DISCORD_REDIRECT_URI_PROD
      : process.env.DISCORD_REDIRECT_URI;
  }

  redirectToDiscord(res: Response) {
    const redirectUri = this.getRedirectUri();

    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      redirect_uri: redirectUri!,
      response_type: "code",
      scope: "identify email"
    });

    return res.redirect(`https://discord.com/oauth2/authorize?${params}`);
  }

  async handleDiscordCallback(code: string, res: Response) {
    const redirectUri = this.getRedirectUri();

    // Exchange code for token
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

    const accessToken = tokenRes.data.access_token;

    // Fetch Discord user info
    const discordUser = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const { id, username, avatar } = discordUser.data;

    // Upsert user
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

    // Create JWT
    const jwtToken = this.jwt.sign({ sub: user.id });

    // Set cookie
    res.cookie("token", jwtToken, {
  httpOnly: true,
  sameSite: "none",
  secure: true,
});


    // Redirect home
    return res.redirect(process.env.FRONTEND_URL!);
  }

  async me(userId: string) {
    if (!userId) return null;

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
    return this.prisma.user.findUnique({
      where: { discordId },
    });
  }
}
