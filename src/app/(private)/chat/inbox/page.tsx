"use client";

import { useEffect, useState } from "react";
import api from "@/api/api";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";


export default function Page() {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const res = await api.get("/friend/chat/friends");

      setFriends(res?.data);

      if (res?.data?.length > 0) {
        setSelectedFriend(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <ChatSidebar
        friends={friends}
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
      />

      {selectedFriend && (
        <ChatWindow friend={selectedFriend} />
      )}
    </div>
  );
}