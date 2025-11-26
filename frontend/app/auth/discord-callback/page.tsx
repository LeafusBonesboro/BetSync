"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DiscordCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const run = async () => {
      // Get logged-in Supabase user
      const { data: userData } = await supabase.auth.getUser();
      const authUser = userData.user;

      if (!authUser) {
        console.error("No Supabase auth user");
        router.push("/login");
        return;
      }

      // Get identity list (includes Discord)
      const { data: identities } = await supabase.auth.getUserIdentities();

      const discordIdentity = identities?.identities?.find(
        (i: any) => i.provider === "discord"
      );

      if (!discordIdentity) {
        console.error("No Discord identity found");
        router.push("/settings");
        return;
      }

      const discordId = discordIdentity.identity_data?.provider_id;
      const discordName = discordIdentity.identity_data?.full_name;
      const discordAvatar = discordIdentity.identity_data?.avatar_url;

      // ---------- IMPORTANT ----------
      // Link to your public.users row using email
      // (Because before linking, we only know email!)
      // --------------------------------
      const { error } = await supabase
        .from("users")
        .update({
          auth_user_id: authUser.id,   // ⭐ LINK SUPABASE → USERS TABLE
          discord_id: discordId,
          discord_name: discordName,
          discord_avatar: discordAvatar
        })
        .eq("email", authUser.email);

      if (error) {
        console.error("Failed to update user row:", error);
      }

      router.push("/");
    };

    run();
  }, []);

  return (
    <p className="text-center mt-10 text-white">Linking Discord...</p>
  );
}
