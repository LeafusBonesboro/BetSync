import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { BetsModule } from './bets/bets.module';

@Module({
  imports: [
    SupabaseModule,   // MUST come first
    AuthModule,
    BetsModule,
  ],
})
export class AppModule {}
