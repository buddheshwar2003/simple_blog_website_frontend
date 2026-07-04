"use client";

import { useEffect, useRef, useState } from "react";

import api from "@/api/api";

import {
  connectChatSocket,
  disconnectChatSocket,
  sendChatMessage,
} from "@/lib/chatSocket";

import { useAppSelector } from "@/TypeTs/reduxHooks";
import { store } from "@/store/store";
import { TimeFormeter } from "@/utility/TimeFormeter";

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export default function ChatWindow({
  friend,
}: {
  friend: any;
}) {
  const currentUserId =
    useAppSelector(
      (state) => state.auth.user?.id
    );

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [text, setText] =
    useState("");

  const bottomRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [friend.id]);

  const loadMessages = async () => {
    try {
      const res = await api.get(
        `/chat/${friend.id}`
      );

      setMessages(
        res.data.content ??
          res.data.results ??
          []
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token =
      store.getState().auth.accessToken;

    if (!token) return;

    connectChatSocket(
      token,
      (message) => {
        if (
          message.senderId === friend.id
        ) {
          setMessages((prev) => [
            ...prev,
            message,
          ]);
        }
      }
    );

    return () => {
      disconnectChatSocket();
    };
  }, [friend.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    const tempMessage = {
      id: crypto.randomUUID(),
      senderId: currentUserId!,
      receiverId: friend.id,
      content: text,
      createdAt:
        new Date().toISOString(),
    };

    setMessages((prev) => [
      ...prev,
      tempMessage,
    ]);

    sendChatMessage(
      friend.id,
      text
    );

    setText("");
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <div className="relative">
          <img
            src={
              friend.profileImage ||
              "/avatar.png"
            }
            className="w-10 h-10 rounded-full"
          />

          {friend.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>

        <div>
          <h2 className="font-semibold">
            {friend.name}
          </h2>

          <p className="text-sm text-gray-500">
            {friend.online
              ? "Online"
              : <span>Last seen at {TimeFormeter(friend?.lastSeen)}</span>}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${
              msg.senderId ===
              currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-sm ${
                msg.senderId ===
                currentUserId
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) =>
              setText(
                e.target.value
              )
            }
            placeholder="Type message..."
            className="flex-1 border rounded-full px-4 py-2 outline-none"
          />

          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-6 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}