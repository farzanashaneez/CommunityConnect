import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

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
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };

  
  