

importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-messaging-compat.js');

firebase.initializeApp(
    {
        apiKey: "AIzaSyBo36RiSb7sMhAzoLDyQF9R095ZthJfns4",
        authDomain: "colocation-f08f1.firebaseapp.com",
        projectId: "colocation-f08f1",
        storageBucket: "colocation-f08f1.firebasestorage.app",
        messagingSenderId: "79854951241",
        appId: "1:79854951241:web:bc468ea69ee5a73d061898",
        measurementId: "G-YDN3VGER5W"
      }
);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message: ",
        payload
    );

    // Personnaliser la notification
    const notificationTitle = payload.notification.title || "Notification";
    const notificationOptions = {
      body: payload.notification.body || "Vous avez un nouveau message",
      icon: payload.notification.icon || "/firebase-logo.png"
    };
  
    // Afficher la notification
    self.registration.showNotification(notificationTitle, notificationOptions);
  });