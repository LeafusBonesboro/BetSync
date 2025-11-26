import * as dotenv from "dotenv";
dotenv.config();

import { Module } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

@Module({
  providers: [
    {
      provide: "SUPABASE_ADMIN",
      useFactory: () => {
        console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
        console.log("SUPABASE_SERVICE_ROLE_KEY =", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10) + "...");

        return createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
      },
    },
  ],
  exports: ["SUPABASE_ADMIN"],
})
export class SupabaseModule {}
