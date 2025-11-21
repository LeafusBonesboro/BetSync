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
    return this.authService.redirectToDiscord(res);
  }

  // ⭐ Keep GET for local dev callback
 // Dev: Discord -> Backend
@Get("discord/callback")
async discordCallbackGET(
  @Query("code") code: string,
  @Res() res: Response
) {
  return this.authService.handleDiscordCallback(code, res);
}

// Prod: Discord -> Frontend -> Backend
@Post("discord/callback")
async discordCallbackPOST(
  @Body("code") code: string,
  @Res() res: Response
) {
  return this.authService.handleDiscordCallback(code, res);
}


  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req) {
    return this.authService.me(req.user.userId);
  }
}

