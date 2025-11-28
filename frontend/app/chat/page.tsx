"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/providers/AuthProvider";
import ChatMessage from "@/components/ChatMessage";

interface ChatMessageItem {
  role: "user" | "ai";
  text: string;
}

export default function ChatPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");

  // Greeting message
  useEffect(() => {
    if (!user) return;

    setMessages([
      {
        role: "ai",
        text: `Hello ${user.email}! 👋\nAsk me anything about your bets.`,
      },
    ]);
  }, [user]);

  const handleSend = async (text: string) => {
    if (!text.trim() || !user) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

const res = await fetch(`${API_URL}/ai/ask`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.id}`,
  },
  body: JSON.stringify({
    userId: user.id,
    question: text,
  }),
});


    const data = await res.json();

    let output = data?.answer;

// If backend accidentally returns the whole object again, clean it
if (typeof output !== "string") {
  output = JSON.stringify(output);
}

// Remove {"answer": "..."} wrapper if present
output = output.replace(/^{"answer":"/, "").replace(/"}$/, "");

// Fix escaped newlines
output = output.replace(/\\n/g, "\n");

// Fix escaped quotes
output = output.replace(/\\"/g, '"');

setMessages((prev) => [...prev, { role: "ai", text: output }]);
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 bg-gray-800 rounded text-white"
          placeholder="Ask about your bets..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={() => handleSend(input)}
          className="px-4 bg-green-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
