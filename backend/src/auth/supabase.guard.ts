import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Inject } from "@nestjs/common";
import type { SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @Inject("SUPABASE_ADMIN")
    private readonly supabase: SupabaseClient
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Missing Authorization header");
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // ⭐ VERIFY TOKEN USING SERVICE ROLE CLIENT
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    req.user = data.user;
    return true;
  }
}
