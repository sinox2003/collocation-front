import axios from "axios";

const notificationService = {
    sendNotification: async (receiverId, notificationData) => {
        try {
            
            const response = await axios.post(
                `http://localhost:8762/notification-service/api/notifications/sendToUser/${receiverId}`,
                notificationData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'envoi de la notification :", error);
            throw error;
        }
    },
};

export default notificationService;
