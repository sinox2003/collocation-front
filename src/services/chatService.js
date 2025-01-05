import axios from 'axios';

const API_URL = 'http://localhost:8084/api/messages';

const apiService = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const chatService = {

    // Envoi d'un message
    sendMessage: async (message) => {
        try {
            const response = await apiService.post('/send', message);  // Utilisation de apiService
            console.log('Message envoyé avec succès:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    },

    // Récupérer l'historique des messages entre deux utilisateurs
    getChatHistory: async (senderId, receiverId) => {
        try {
            const response = await apiService.get('/chat-history', {  // Utilisation de apiService
                params: { senderId, receiverId }
            });

            return response.data.map(message => ({
                id: message.id,
                senderId: message.senderId,
                receiverId: message.receiverId,
                content: message.content,
                timestamp: message.timestamp  // Optionnel: ajouter le timestamp si disponible
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique des messages:', error);
        }
    },

    // Récupérer les messages d'un utilisateur
    getUserMessages: async (userId) => {
        try {
            const response = await apiService.get('/user-messages', {  // Utilisation de apiService
                params: { userId }
            });
            console.log('Messages pour l\'utilisateur:', response.data);
            return response.data.map(message => ({
                id: message.id,
                senderId: message.senderId,
                receiverId: message.receiverId,
                content: message.content,
                timestamp: message.timestamp
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des messages de l\'utilisateur:', error);
        }
    },

    // Récupérer les utilisateurs avec lesquels l'utilisateur a interagi
    getInteractedUsers: async (userId) => {
        try {
            const response = await apiService.get('/users/interacted', {  // Utilisation de apiService
                params: { userId },
            });
            console.log('Utilisateurs ayant interagi:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs ayant interagi:', error);
        }
    },

    // Récupérer le dernier message échangé entre deux utilisateurs
    getLastMessageBetween: async (user1Id, user2Id) => {
        try {
            const response = await apiService.get(`/last/${user1Id}/${user2Id}`);  // Utilisation de apiService
            console.log('Dernier message entre les utilisateurs:', response.data);
            return {
                id: response.data.id,
                senderId: response.data.senderId,
                receiverId: response.data.receiverId,
                content: response.data.content,
                timestamp: response.data.timestamp
            };
        } catch (error) {
            console.error('Erreur lors de la récupération du dernier message entre les utilisateurs:', error);
        }
    },

    // Récupérer les derniers messages pour un utilisateur donné
    getLastMessagesForUser: async (userId) => {
        try {
            const response = await apiService.get(`/lastForUser/${userId}`);  // Utilisation de apiService
            console.log('Derniers messages pour l\'utilisateur:', response.data);
            return response.data.map(message => ({
                id: message.id,
                senderId: message.senderId,
                receiverId: message.receiverId,
                content: message.content,
                timestamp: message.timestamp
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des derniers messages pour l\'utilisateur:', error);
        }
    },
};

export default chatService;
