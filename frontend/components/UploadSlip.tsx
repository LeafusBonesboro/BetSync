"use client";

import { useState } from "react";

export default function UploadSlip() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return setMessage("Please choose an image first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bets`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      setMessage("✅ Uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-blue-300">Upload Bet Slip</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="cursor-pointer"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-md text-white font-medium"
      >
        Upload
      </button>
      {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
    </div>
  );
}
