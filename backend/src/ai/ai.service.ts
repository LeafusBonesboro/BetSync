import { Injectable } from "@nestjs/common";
import { OpenAI } from "openai";
import { SupabaseClient } from "@supabase/supabase-js";
import { Inject } from "@nestjs/common";

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(
    @Inject("SUPABASE_ADMIN") private readonly supabase: SupabaseClient
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY!,
    });
  }

  async answerQuestion(userId: string, question: string) {
    // 1. Load user bets
    const { data: bets } = await this.supabase
      .from("bets")
      .select("*")
      .eq("user_id", userId);

    const betHistory = JSON.stringify(bets || [], null, 2);

    // 2. Dynamic smart prompt
    const systemPrompt = `
You are BetAdvisorAI — a friendly analytics assistant.

RULES:
- ONLY summarize win/loss stats if the user requests summaries.
- ONLY give improvement suggestions if asked.
- ONLY analyze best/worst teams when asked.
- DO NOT repeat the same structured block unless explicitly requested.
- DO NOT dump the same categories every answer.
- Use concise bullet points.
- Speak like a helpful sports analytics assistant.

USER BET HISTORY:
${betHistory}
`;

    // 3. OpenAI call
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
    });

    return {
      answer: response.choices[0].message.content,
    };
  }
}
