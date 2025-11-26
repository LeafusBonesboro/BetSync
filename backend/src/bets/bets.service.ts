import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { BetsGateway } from "./bets.gateway";

@Injectable()
export class BetsService {
  constructor(
    @Inject("SUPABASE_ADMIN") private admin: SupabaseClient,
    private gateway: BetsGateway
  ) {}

  async createFromDiscord(data: any) {
    const { data: users, error: userErr } = await this.admin
      .from("users")
      .select("*")
      .eq("discord_id", data.discordId)
      .limit(1);

    if (userErr) throw userErr;
    if (!users || users.length === 0) {
      throw new BadRequestException(
        `No user found with discordId: ${data.discordId}`
      );
    }

    const user = users[0];

    const { data: bet, error: betErr } = await this.admin
      .from("bets")
      .insert({
        event: data.event,
        market: data.market,
        stake: data.stake,
        odds: data.odds,
        status: data.status,
        link: data.link,
        raw_text: data.rawText,
        image_url: data.imageUrl,
        user_id: user.id,
      })
      .select()
      .single();

    if (betErr) throw betErr;

    // Emit to socket listeners
    this.gateway.emitNewBet(user.id, bet);

    return bet;
  }

  async findByUser(authUserId: string) {
    // 1) Translate auth ID → internal user.id
    const { data: users, error: userErr } = await this.admin
      .from("users")
      .select("id")
      .eq("auth_user_id", authUserId)
      .limit(1);

    if (userErr) throw userErr;
    if (!users || users.length === 0) return [];

    const realUserId = users[0].id;

    // 2) Fetch bets for that user
    const { data: bets, error } = await this.admin
      .from("bets")
      .select("*")
      .eq("user_id", realUserId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // 3) Normalize rows → frontend expects camelCase
    return bets.map((b) => ({
      id: b.id,
      event: b.event,
      market: b.market,
      stake: b.stake,
      odds: b.odds,
      status: b.status,
      link: b.link,
      rawText: b.raw_text,
      createdAt: b.created_at,
      imageUrl: b.image_url,
    }));
  }
}
