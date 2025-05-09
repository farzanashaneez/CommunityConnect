importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCAHTbyXj-yKlbkbewluJZdTS0H_bfo_yc",
    authDomain: "community-connect-71fdb.firebaseapp.com",
    projectId: "community-connect-71fdb",
    storageBucket: "community-connect-71fdb.firebasestorage.app",
    messagingSenderId: "364597264106",
    appId: "1:364597264106:web:f643778a260770166a2193",
    measurementId: "G-4XX3EEMEDF"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
    badge: '/badge-icon.png',
    tag: 'new-message',
    // renotify: true
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
