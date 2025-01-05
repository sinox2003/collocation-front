import axios from 'axios';

const API_URL = 'http://localhost:8762/annonces-service/graphql';

/**
 * Effectue une requête GraphQL.
 * @param {string} query - La requête GraphQL.
 * @param {object} variables - Les variables pour la requête.
 * @returns {Promise} - Une promesse contenant les données de la réponse.
 */
const graphqlRequest = async (query, variables = {}) => {
    try {
        const response = await axios.post(API_URL, { query, variables });
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data.data;
    } catch (error) {
        console.error('GraphQL Request Error:', error.message);
        throw error;
    }
};

const AnnonceService = {
    /**
     * Créer une annonce.
     * @param {object} annonce - Les données de l'annonce.
     * @returns {Promise} - La promesse de création de l'annonce.
     */
    async createAnnonce(annonce) {
        const query = `
            mutation CreateAnnonce($annonce: AnnonceDTO!) {
                createAnnonce(annonce: $annonce) {
                    id
                    description
                    price
                    userId
                    
                    user {
                        id
                        username
                        firstName
                        
                        lastName
                        email
                        profilePicture
                    }
                    address {
                        id
                        city
                        street
                        country
                        longitude
                        latitude
                    }
                    photos
                    statusAnnonce
                    availableFrom
                    availableTo
                    numberOfRoommates
                    bathrooms
                    bedrooms
                    duration
                    gender
                    minAge
                    maxAge
                }
            }
        `;
        return graphqlRequest(query, { annonce });
    },


    /**
     * Récupérer toutes les annonces.
     * @returns {Promise} - La promesse contenant toutes les annonces.
     */
    async getAllAnnonces() {
        const query = `
            query {
                getAllAnnonces {
                        id
                        description
                        price
                        photos {
                            url
                        }
                        address {
                            id
                            city
                            street
                            country
                            longitude
                            latitude
                        }
                        user {
                            id
                            email
                            username
                            lastName
                                                        
                           
                            profilePicture {
                                url
                                publicId
                            }
                            firstName
                            age
                            personality
                        }
                        availableFrom
                        availableTo
                        numberOfRoommates
                        statusAnnonce
                        propertyType
                        views
                        createdAt
                        updatedAt
                        duration
                        layoutType
                        bedrooms
                        bathrooms
                        situation
                        amenities
                    }
                }
        `;
        return graphqlRequest(query);
    },

    /**
     * Récupérer une annonce par son ID.
     * @param {number} id - L'ID de l'annonce.
     * @returns {Promise} - La promesse contenant l'annonce.
     */
    async getAnnonceById(id) {
        const query = `
            query($id: ID!) {
                getAnnonceById(id: $id) {
                    id
                    description
                    price
                    photos {
                        url
                        publicId
                    }
                    address {
                        id
                        city
                        street
                        country
                        longitude
                        latitude
                    }
                    user {
                        email
                        username
                        lastName
                  
                        id
                        firstName
                        age
                        personality
                        profilePicture {
                            url
                        }
                    }
                    availableFrom
                    availableTo
                    numberOfRoommates
                    statusAnnonce
                    propertyType
                    views
                    minAge
                    maxAge
                    gender
                    createdAt
                    updatedAt
                    duration
                    layoutType
                    bedrooms
                    bathrooms
                    situation
                    amenities
                }
            }
        `;
        const variables = { id };
        return graphqlRequest(query, variables);
    },

    /**
     * Récupérer les annonces par utilisateur.
     * @param {number} userID - L'ID de l'utilisateur.
     * @returns {Promise} - La promesse contenant les annonces.
     */
    async getAnnoncesByUser(userID) {
        const query = `
            query($userID: ID!) {
                getAnnoncesByUser(userID: $userID) {
                    id
                    description
                    price
                    photos {
                    url
                    publicId
                    }
                    address {
                        id
                        city
                        street
                        country
                        longitude
                        latitude
                    }
                    user {
                        email
                        username
                        lastName
                        profilePicture {
                                url
                                publicId
                            }
                        firstName
                    }
                    availableFrom
                    availableTo
                    duration
                    createdAt
                    
                    bedrooms
                    layoutType
                    numberOfRoommates
                    statusAnnonce
                    propertyType
                }
            }
        `;
        const variables = { userID };
        return graphqlRequest(query, variables);
    },

    /**
     * Mettre à jour une annonce.
     * @param {number} id - L'ID de l'annonce.
     * @param {object} annonceInput - Les données mises à jour de l'annonce.
     * @returns {Promise} - La promesse contenant l'annonce mise à jour.
     */
    async updateAnnonce(id, annonceInput) {
        const query = `
            mutation($id: Long!, $annonceInput: AnnonceInput!) {
                updateAnnonce(id: $id, annonceInput: $annonceInput) {
                    id
                    description
                    price
                    userId
                    user {
                        id
                        username
                        firstName
                        lastName
                        email
                        profilePicture
                    }
                    address {
                        id
                        city
                        street
                        country
                        longitude
                        latitude
                    }
                    photos
                    statusAnnonce
                    availableFrom
                    availableTo
                    numberOfRoommates
                    bathrooms
                    bedrooms
                    duration
                    gender
                    minAge
                    maxAge
                }
            }
        `;
        const variables = { id, annonceInput };
        return graphqlRequest(query, variables);
    },

    /**
     * Supprimer une annonce.
     * @param {number} id - L'ID de l'annonce.
     * @returns {Promise} - La promesse de suppression de l'annonce.
     */
    async deleteAnnonce(id) {
        const query = `
            mutation($id: ID!) {
                deleteAnnonce(id: $id)
            }
        `;
        const variables = { id };
        return graphqlRequest(query, variables);
    },

    /**
     * Récupérer les annonces par plage de prix.
     * @param {number} minPrice - Le prix minimum.
     * @param {number} maxPrice - Le prix maximum.
     * @returns {Promise} - La promesse contenant les annonces dans la plage de prix.
     */
    async getAnnoncesByPriceRange(minPrice, maxPrice) {
        const query = `
            query($minPrice: Float!, $maxPrice: Float!) {
                getAnnoncesByPriceRange(minPrice: $minPrice, maxPrice: $maxPrice) {
                    id
                    description
                    price
                    availableFrom
                    availableTo
                    bedrooms
                    bathrooms
                    address {
                        street
                        city
                        country
                        latitude
                        longitude
                    }
                    user {
                        id
                        username
                        firstName
                        lastName
                    }
                }
            }
        `;
        const variables = { minPrice, maxPrice };
        return graphqlRequest(query, variables);
    },

    /**
     * Récupérer les annonces par type de propriété.
     * @param {string} propertyType - Le type de propriété (par exemple, Appartement).
     * @returns {Promise} - La promesse contenant les annonces du type de propriété.
     */
    async getAnnoncesByPropertyType(propertyType) {
        const query = `
            query($propertyType: PropertyType!) {
                getAnnoncesByPropertyType(propertyType: $propertyType) {
                    id
                    description
                    price
                    user {
                        id
                        username
                        firstName
                        lastName
                    }
                    availableFrom
                    availableTo
                    bedrooms
                    bathrooms
                    address {
                        street
                        city
                        country
                        latitude
                        longitude
                    }
                }
            }
        `;
        const variables = { propertyType };
        return graphqlRequest(query, variables);
    },

    /**
     * Récupérer les annonces par nombre de chambres.
     * @param {number} bedrooms - Le nombre de chambres.
     * @returns {Promise} - La promesse contenant les annonces.
     */
    async getAnnoncesByBedrooms(bedrooms) {
        const query = `
            query($bedrooms: Int!) {
                getAnnoncesByBedrooms(bedrooms: $bedrooms) {
                    id
                    description
                    price
                    user {
                        id
                        username
                        firstName
                        lastName
                    }
                    availableFrom
                    availableTo
                    bedrooms
                    bathrooms
                    address {
                        street
                        city
                        country
                        latitude
                        longitude
                    }
                }
            }
        `;
        const variables = { bedrooms };
        return graphqlRequest(query, variables);
    },

    /**
     * Récupérer les annonces par type de disposition.
     * @param {string} layoutType - Le type de disposition (par exemple, PRIVATE_ROOM).
     * @returns {Promise} - La promesse contenant les annonces.
     */
    async getAnnoncesByLayoutType(layoutType) {
        const query = `
            query($layoutType: String!) {
                getAnnoncesByLayoutType(layoutType: $layoutType) {
                    id
                    description
                    price
                    user {
                        id
                        username
                        firstName
                        lastName
                    }
                    availableFrom
                    availableTo
                    bedrooms
                    bathrooms
                    address {
                        street
                        city
                        country
                        latitude
                        longitude
                    }
                }
            }
        `;
        const variables = { layoutType };
        return graphqlRequest(query, variables);
    },
    async incrementViews(id) {
        const query = `
            mutation IncrementViews($id: ID!) {
                incrementViews(id: $id)
            }
        `;
        return graphqlRequest(query, { id });
    },
};

export default AnnonceService;
