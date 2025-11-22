import {
  Controller,
  Get,
  Req,
  Res,
  Query,
  UseGuards,
  Param,
  Post,
  Body,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("discord")
  redirectToDiscord(@Res() res: Response) {
    console.log("➡️ /auth/discord redirect requested");
    return this.authService.redirectToDiscord(res);
  }

  // ⭐ GET callback (for direct redirect from Discord in dev)
  @Get("discord/callback")
  async discordCallbackGET(
    @Query("code") code: string,
    @Res() res: Response
  ) {
    console.log("📥 GET /auth/discord/callback");
    console.log("📥 Received code:", code);
    return this.authService.handleDiscordCallback(code, res);
  }

  // ⭐ POST callback (frontend -> backend in prod)
  @Post("discord/callback")
  async discordCallbackPOST(
    @Body("code") code: string,
    @Res() res: Response
  ) {
    console.log("📥 POST /auth/discord/callback");
    console.log("📥 Received code:", code);
    return this.authService.handleDiscordCallback(code, res);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req) {
    console.log("🔎 /auth/me (userId):", req.user?.userId);
    return this.authService.me(req.user.userId);
  }
}
