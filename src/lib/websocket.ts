import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { store } from "@/store/store";
import { serverAddressURL } from "../server/ServerAddress";
export const connectNotificationSocket = (callback: (data: any) => void) => {
  const token = store.getState().auth.accessToken;
  const client = new Client({
    webSocketFactory: () => new SockJS(`${serverAddressURL}/ws`),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    console.log("CONNECTED");
    client.subscribe(
      "/user/queue/notifications",
      (message) => {
        console.log("MESSAGE", message.body);
        callback(JSON.parse(message.body));
      }
    );
  };

  client.activate();

  return client;
};
