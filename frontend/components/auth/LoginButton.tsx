"use client";

export default function LoginButton() {
  return (
    <button
      className="px-6 py-3 border rounded text-white border-gray-500"
      onClick={() =>
        document.dispatchEvent(new CustomEvent("open-login"))
      }
    >
      Sign In
    </button>
  );
}
