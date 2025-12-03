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

  // Email + password form state
  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  /* --------------------------------------------------------
   * Load profile
   * --------------------------------------------------------*/
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
  }, [user, supabase]);

  /* --------------------------------------------------------
   * Update Email
   * --------------------------------------------------------*/
  async function updateEmail() {
    if (!user) return; // TS-SAFE

    setEmailMessage("");

    if (!newEmail || newEmail === user.email) {
      setEmailMessage("Please enter a different email.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) {
      setEmailMessage(error.message);
      return;
    }

    setEmailMessage("A confirmation email has been sent to the new address.");
    setNewEmail("");
  }

  /* --------------------------------------------------------
   * Update Password
   * --------------------------------------------------------*/
  async function updatePassword() {
    if (!user) return; // TS-SAFE

    setPasswordMessage("");

    if (!newPassword || newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordMessage(error.message);
      return;
    }

    setPasswordMessage("Password updated successfully.");
    setNewPassword("");
  }

  /* --------------------------------------------------------
   * Loading / Auth Guard
   * --------------------------------------------------------*/
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

  /* --------------------------------------------------------
   * Page
   * --------------------------------------------------------*/
  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">Account Settings</h1>

      {/* CURRENT EMAIL */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <p className="text-gray-400 text-sm">Current Email</p>
        <p className="text-xl">{user.email}</p>
      </div>

      {/* CHANGE EMAIL */}
      <div className="bg-gray-900 p-4 rounded-lg space-y-3">
        <p className="text-lg font-semibold">Change Email</p>

        <input
          type="email"
          placeholder="Enter new email"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />

        <button
          onClick={updateEmail}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md"
        >
          Update Email
        </button>

        {emailMessage && (
          <p className="text-yellow-400 text-sm">{emailMessage}</p>
        )}
      </div>

      {/* CHANGE PASSWORD */}
      <div className="bg-gray-900 p-4 rounded-lg space-y-3">
        <p className="text-lg font-semibold">Change Password</p>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          onClick={updatePassword}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md"
        >
          Update Password
        </button>

        {passwordMessage && (
          <p className="text-yellow-400 text-sm">{passwordMessage}</p>
        )}
      </div>

      {/* DISCORD SECTION */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <p className="text-gray-400 text-sm mb-2">Discord</p>

        {profile?.discord_id ? (
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
    </div>
  );
}
