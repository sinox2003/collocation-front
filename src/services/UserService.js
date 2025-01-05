import axios from "axios";

// URL de base pour l'API des utilisateurs
const BASE_URL = "http://localhost:8762/user-security-service/api/users";

const UserService = {
  // Ajouter un utilisateur
  addUser: async (user) => {
    try {
      const response = await axios.post(`${BASE_URL}/add`, user);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error.response?.data || error.message);
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error.response?.data || error.message);
      throw error;
    }
  },

  // Vérifier si un utilisateur existe
  userExists: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/exists/${id}`);
      return response.data; // Renvoie un booléen
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur :", error.response?.data || error.message);
      throw error;
    }
  },

  // Récupérer tous les utilisateurs
  getAllUsers: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error.response?.data || error.message);
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, userInput) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, userInput);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error.response?.data || error.message);
      throw error;
    }
  },

  // Téléverser une photo de profil
  uploadProfilePicture: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${BASE_URL}/${userId}/uploadProfilePicture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors du téléversement de l'image :", error.response?.data || error.message);
      throw error;
    }
  },

  // Vérifier si un email existe
  checkEmail: async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/check-email`, { email });
      return response.data.exists; // Renvoie un booléen
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email :", error.response?.data || error.message);
      throw error;
    }
  },

  // Vérifier si un username existe
  checkUsername: async (username) => {
    try {
      const response = await axios.post(`${BASE_URL}/check-username`, { username });
      return response.data.exists; // Renvoie un booléen
    } catch (error) {
      console.error("Erreur lors de la vérification du username :", error.response?.data || error.message);
      throw error;
    }
  },

  // Vérifier si un utilisateur est vérifié
  isUserVerified: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}/is-verified`);
      return response.data.isVerified; // Renvoie un booléen
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur :", error.response?.data || error.message);
      throw error;
    }
  },

  // Mot de passe oublié
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
      return response.data; // Message de succès ou d'erreur
    } catch (error) {
      console.error("Erreur lors de la demande de mot de passe oublié :", error.response?.data || error.message);
      throw error;
    }
  },

  // Réinitialiser le mot de passe
  resetPassword: async (requestData) => {
    try {
      const response = await axios.post(`${BASE_URL}/reset-password`, requestData);
      return response.data; // Message de succès ou d'erreur
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe :", error.response?.data || error.message);
      throw error;
    }
  },

  // Connexion
  loginUser: async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      return response.data; // Message de succès
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.response?.data || error.message);
      throw error;
    }
  },

  // Vérification du compte
  verifyUser: async (email, verificationCode) => {
    try {
      const response = await axios.post(`${BASE_URL}/verify`, { email, verificationCode });
      return response.data; // Message de succès ou d'erreur
    } catch (error) {
      console.error("Erreur lors de la vérification du compte :", error.response?.data || error.message);
      throw error;
    }
  },
};

export default UserService;
