import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { serverAddressURL } from "@/server/ServerAddress";

let client: Client | null = null;

export const connectChatSocket = (
  token: string,
  onMessage: (message: any) => void
) => {
  client = new Client({
    webSocketFactory: () =>
      new SockJS(`${serverAddressURL}/ws`),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log("CHAT CONNECTED");

    client?.subscribe(
      "/user/queue/chat",
      (message) => {
        const data = JSON.parse(message.body);

        onMessage(data);
      }
    );
  };

  client.activate();

  return client;
};

export const disconnectChatSocket = () => {
  client?.deactivate();
};

export const sendChatMessage = (
  receiverId: any,
  content: string
) => {
  client?.publish({
    destination: "/app/chat.send",

    body: JSON.stringify({
      receiverId,
      message: content,
    }),
  });
};