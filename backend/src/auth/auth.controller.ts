import {
  Controller,
  Get,
  Req,
  Res,
  Query,
  UseGuards,
  Param,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get("discord")
  redirectToDiscord(@Res() res) {
    return this.authService.redirectToDiscord(res);
  }

 @Get("discord/callback")
async discordCallback(@Query("code") code: string, @Res() res) {
  return this.authService.handleDiscordCallback(code, res);
}


  @Get("me")
@UseGuards(JwtAuthGuard)
me(@Req() req) {
  return this.authService.me(req.user.userId);
}

@Get("by-discord/:discordId")
async getUserByDiscord(@Param("discordId") discordId: string) {
  return this.authService.findByDiscordId(discordId);
}


}
