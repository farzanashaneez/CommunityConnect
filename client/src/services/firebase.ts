
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCAHTbyXj-yKlbkbewluJZdTS0H_bfo_yc",
  authDomain: "community-connect-71fdb.firebaseapp.com",
  projectId: "community-connect-71fdb",
  storageBucket: "community-connect-71fdb.firebasestorage.app",
  messagingSenderId: "364597264106",
  appId: "1:364597264106:web:f643778a260770166a2193",
  measurementId: "G-4XX3EEMEDF"
};

const app = initializeApp(firebaseConfig);

// Initialize messaging with type safety
let messagingInstance: any = null;

const initializeMessaging = async () => {
  try {
    const isMessagingSupported = await isSupported();
    if (isMessagingSupported) {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error initializing messaging:', error);
    return null;
  }
};

const getMessagingToken = async (vapidKey: string) => {
  try {
    const messaging = await initializeMessaging();
    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: vapidKey
    });
    return token;
  } catch (error) {
    console.error('Error getting messaging token:', error);
    return null;
  }
};

const subscribeToMessages = (callback: (payload: any) => void) => {
  if (!messagingInstance) return () => {};
  
  return onMessage(messagingInstance, (payload) => {
    callback(payload);
  });
};

export { initializeMessaging, getMessagingToken, subscribeToMessages };
