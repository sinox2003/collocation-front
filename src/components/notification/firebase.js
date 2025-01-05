// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo36RiSb7sMhAzoLDyQF9R095ZthJfns4",
  authDomain: "colocation-f08f1.firebaseapp.com",
  projectId: "colocation-f08f1",
  storageBucket: "colocation-f08f1.firebasestorage.app",
  messagingSenderId: "79854951241",
  appId: "1:79854951241:web:bc468ea69ee5a73d061898",
  measurementId: "G-YDN3VGER5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
// Export `messaging` so it can be used in other files
export { messaging };

// Fonction pour demander la permission de notification et obtenir le token FCM
export const generateToken = async () => {
    const permission = await  Notification.requestPermission();
    console.log(permission)
    if (permission === "granted") {
      try {
        const token = await getToken(messaging, {
            vapidKey: "BL-5wQSLBn3RGpMq_iqxEAeOTBF3Bolo2lYKFgaOam4dokSDrho4gT8hcTWEZbZAXhhQ-3BunS7oBikOVwjPSqg" // Remplacez par votre clé VAPID publique
        });
        console.log("Token FCM :", token);
        return token; // Retourne le token pour l'envoyer à votre backend si nécessaire
      } catch (error) {
        console.error("Erreur lors de l'obtention du token FCM :", error);
      }
    } else {
      console.warn("Permission de notification non accordée");
    }
  };
