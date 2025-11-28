import { Controller, Post, Body } from "@nestjs/common";
import { AiService } from "./ai.service";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("ask")
  async ask(@Body() body: { userId: string; question: string }) {
    const { userId, question } = body;

    // No auth, no token validation, no header checks.
    return {
      answer: await this.aiService.answerQuestion(userId, question),
    };
  }
}
