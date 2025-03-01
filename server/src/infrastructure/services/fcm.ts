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

function sendNotification(
  token: string,
  title: string,
  body: string
): Promise<string> {
  const message: NotificationMessage = {
    notification: {
      title,
      body,
    },
    token,
  };

  return messaging().send(message);
}

function sendMulticastNotification(
  tokens: string[],
  title: string,
  body: string
): Promise<messaging.BatchResponse> {
  const obj = [
    `${"fPTa8Rsx5KRklb8hq-G8rz:APA91bHJWCU30Hay01_EC-rp4xL8KQcYDy00QbDuRX0TboHi0_4IhlH7MMQHkoJpaG7g9ZoZiFZRrkKECnLcJG6a7-qNwN8ZTBZQM5t6CYiitzoFJm9rWEc"}`,
  ];
  const message: MulticastMessage = {
    notification: {
      title,
      body,
    },
    tokens: tokens,
  };

  return messaging().sendEachForMulticast(message);
}

export { sendNotification, sendMulticastNotification };
