"use client";

interface ChatMessageItem {
  role: "user" | "ai";
  text: string;
}

export default function ChatMessage({
  message,
}: {
  message: ChatMessageItem;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`w-fit max-w-full px-4 py-2 rounded-lg whitespace-pre-wrap ${
        isUser ? "bg-blue-600 ml-auto" : "bg-gray-700"
      }`}
    >
      {message.text}
    </div>
  );
}
