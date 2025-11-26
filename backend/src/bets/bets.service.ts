import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { BetsGateway } from "./bets.gateway";

@Injectable()
export class BetsService {
  constructor(
    @Inject("SUPABASE_ADMIN") private admin: SupabaseClient,
    private gateway: BetsGateway
  ) {}

  // ======================================================
  // CREATE FROM DISCORD (no auth)
  // ======================================================
  async createFromDiscord(data: any) {
    // Find the user by their Discord ID
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

    // Insert the bet
    const { data: bet, error: betErr } = await this.admin
      .from("bets")
      .insert({
        event: data.event,
        market: data.market,
        stake: data.stake,
        odds: data.odds,
        status: data.status,
        image_url: data.imageUrl,
        link: data.link,
        raw_text: data.rawText,
        user_id: user.id,
      })
      .select()
      .single();

    if (betErr) throw betErr;

    // Emit via websocket
    this.gateway.emitNewBet(user.id, bet);
    return bet;
  }

  // ======================================================
  // MAP supabase auth_user -> public.users.id
  // ======================================================
  private async mapAuthUser(authUserId: string): Promise<string | null> {
    const { data: users, error } = await this.admin
      .from("users")
      .select("id")
      .eq("auth_user_id", authUserId)
      .limit(1);

    if (error) throw error;

    return users?.[0]?.id ?? null;
  }

  // ======================================================
  // GET MY BETS
  // ======================================================
  async findByUser(authUserId: string) {
    const realUserId = await this.mapAuthUser(authUserId);
    if (!realUserId) return [];

    const { data, error } = await this.admin
      .from("bets")
      .select("*")
      .eq("user_id", realUserId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  // ======================================================
  // GET ONE BET (auth protected)
  // ======================================================
  async findOne(betId: number, authUserId: string) {
    const realUserId = await this.mapAuthUser(authUserId);
    if (!realUserId) return null;

    const { data, error } = await this.admin
      .from("bets")
      .select("*")
      .eq("id", betId)
      .eq("user_id", realUserId)
      .single();

    if (error) throw error;
    return data;
  }

  // ======================================================
  // DELETE BET (auth protected)
  // ======================================================
  async delete(betId: number, authUserId: string) {
    const realUserId = await this.mapAuthUser(authUserId);
    if (!realUserId) return null;

    const { data, error } = await this.admin
      .from("bets")
      .delete()
      .eq("id", betId)
      .eq("user_id", realUserId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
