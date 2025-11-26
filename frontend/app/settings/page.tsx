"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/providers/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import LinkDiscordButton from "@/components/LinkDiscordButton";

export default function SettingsPage() {
  const { user } = useUser();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    load();
  }, [user]);

  if (!user)
    return (
      <div className="p-6 text-center text-white">
        You must be logged in to view settings.
      </div>
    );

  if (loading)
    return (
      <div className="p-6 text-center text-white">Loading profile…</div>
    );

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">Account Settings</h1>

      {/* Email */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">Email</p>
        <p className="text-xl">{user.email}</p>
      </div>

      {/* Discord Section */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <p className="text-gray-400 text-sm mb-2">Discord</p>

        {profile.discord_id ? (
          <div className="flex items-center gap-4">
            <img
              src={profile.discord_avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full border border-gray-700"
            />
            <div>
              <p className="text-xl">{profile.discord_name}</p>
              <p className="text-gray-500 text-sm">
                ID: {profile.discord_id}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-yellow-400 mb-3">Not linked</p>
            <LinkDiscordButton />
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <p className="text-gray-400 text-sm mb-1">Debug User Object</p>
        <pre className="bg-black p-3 rounded-lg text-xs overflow-x-auto">
{JSON.stringify({ authUser: user, profile }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
