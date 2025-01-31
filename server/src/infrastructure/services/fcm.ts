import { messaging } from "firebase-admin";

interface NotificationMessage {
  notification: {
    title: string;
    body: string;
  };
  token: string;
}

interface MulticastMessage {
  notification: {
    title: string;
    body: string;
  };
  tokens: string[];
}

function sendNotification(token: string, title: string, body: string): Promise<string> {
  const message: NotificationMessage = {
    notification: {
      title,
      body
    },
    token
  };

  return messaging().send(message);
}

function sendMulticastNotification(tokens: string[], title: string, body: string): Promise<messaging.BatchResponse> {
  console.log({token:tokens,title:title,body:body})
  const message: MulticastMessage = {
    notification: {
      title,
      body
    },
    tokens
  };

  return messaging().sendEachForMulticast(message);
}

export { sendNotification, sendMulticastNotification };
