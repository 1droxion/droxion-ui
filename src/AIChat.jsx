import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Droxion AI assistant. Ask me anything about our system."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI assistant that explains the Droxion system. Droxion is an AI-powered video platform that generates scripts, voice, and videos with subtitles and music. It posts to Instagram/YouTube. Guide users on how to use it clearly."
            },
            ...newMessages
          ]
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json"
          }
        }
      );

      const reply = res.data.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("❌ Chat Error:", err.response?.data || err.message);
      alert("Error talking to AI");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto scroll to bottom when messages change
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  return (
    <div className="p-6 text-white h-[calc(100vh-80px)] flex flex-col">
      <h1 className="text-2xl font-bold text-purple-400 mb-4">🤖 Droxion AI Chatboard</h1>

      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto bg-[#1e1e1e] rounded p-4 shadow-inner space-y-4 border border-gray-700"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 max-w-xl whitespace-pre-wrap rounded-lg ${
              msg.role === "user"
                ? "ml-auto bg-blue-700 text-white text-right"
                : "mr-auto bg-gray-700 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 italic mt-2">✍️ AI is typing...</div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about Droxion..."
          className="flex-grow p-3 rounded text-black"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default AIChat;
