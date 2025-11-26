import { Module } from "@nestjs/common";
import { BetsService } from "./bets.service";
import { BetsController } from "./bets.controller";
import { BetsGateway } from "./bets.gateway";

import { SupabaseModule } from "../supabase/supabase.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    SupabaseModule,   // Provides SUPABASE_ADMIN client
    AuthModule        // Provides SupabaseAuthGuard
  ],
  controllers: [BetsController],
  providers: [BetsService, BetsGateway],
  exports: [BetsGateway],
})
export class BetsModule {}
