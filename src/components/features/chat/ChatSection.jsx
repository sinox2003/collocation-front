import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    VStack,
    Text,
    Avatar,
    Input,
    IconButton,
    Badge,
    Spinner,
    useToast,
} from "@chakra-ui/react";
import { FiSend, FiArrowLeft, FiSettings } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { useSearchParams, useNavigate } from "react-router-dom";

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [interactedUsers, setInteractedUsers] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [selectedReceiverId, setSelectedReceiverId] = useState(null);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const toast = useToast();
    const senderId = Cookies.get("userId");
    const defaultReceiverId = searchParams.get("receiverId");

    // Charger les utilisateurs ayant interagi
    useEffect(() => {
        const fetchInteractedUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:8762/messagerie-service/api/messages/users/interacted`, {
                    params: { userId: senderId },
                });
                const userIds = response.data;

                const userDetails = await Promise.all(
                    userIds.map((id) =>
                        axios.get(`http://localhost:8762/user-security-service/api/users/${id}`).then((res) => res.data)
                    )
                );
                setInteractedUsers(userDetails);
                setLoadingUsers(false);

                // Si un receiverId est passé par défaut, le définir comme destinataire
                if (defaultReceiverId) {
                    const defaultReceiver = userDetails.find(user => user.id.toString() === defaultReceiverId);
                    if (defaultReceiver) {
                        setSelectedReceiverId(defaultReceiverId);
                        setReceiver(defaultReceiver);
                    } else {
                        // Récupérer les informations si l'utilisateur n'est pas dans interactedUsers
                        const fetchDefaultReceiver = async () => {
                            try {
                                const res = await axios.get(`http://localhost:8762/user-security-service/api/users/${defaultReceiverId}`);
                                setReceiver(res.data);
                                setSelectedReceiverId(defaultReceiverId);
                                setInteractedUsers((prev) => [...prev, res.data]);
                            } catch (error) {
                                console.error("Erreur lors de la récupération du destinataire :", error);
                                toast({
                                    title: "Erreur",
                                    description: "Destinataire introuvable.",
                                    status: "error",
                                    duration: 4000,
                                    isClosable: true,
                                });
                            }
                        };
                        fetchDefaultReceiver();
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
                toast({
                    title: "Erreur",
                    description: "Impossible de charger la liste des utilisateurs.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            }
        };

        fetchInteractedUsers();
    }, [senderId, defaultReceiverId, toast]);

    // Charger l'historique des messages
    useEffect(() => {
        if (senderId && selectedReceiverId) {
            const fetchChatHistory = async () => {
                setLoadingMessages(true);
                try {
                    const response = await axios.get(`http://localhost:8762/messagerie-service/api/messages/chat-history`, {
                        params: { senderId, receiverId: selectedReceiverId },
                    });
                    setMessages(response.data);
                    setLoadingMessages(false);
                } catch (error) {
                    console.error("Erreur lors de la récupération de l'historique :", error);
                    setLoadingMessages(false);
                }
            };

            fetchChatHistory();
        }
    }, [senderId, selectedReceiverId]);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const messageData = {
                senderId: Number(senderId),
                receiverId: Number(selectedReceiverId),
                content: newMessage,
            };

            try {
                const response = await axios.post(`http://localhost:8762/messagerie-service/api/messages/send`, messageData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setMessages([...messages, response.data]);
                setNewMessage("");

                // Ajouter dynamiquement le receiver à interactedUsers s'il n'est pas encore dedans
                if (!interactedUsers.some((user) => user.id.toString() === selectedReceiverId)) {
                    const newReceiver = await axios.get(`http://localhost:8762/user-security-service/api/users/${selectedReceiverId}`);
                    setInteractedUsers((prev) => [...prev, newReceiver.data]);
                }
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
                toast({
                    title: "Erreur",
                    description: "Impossible d'envoyer le message.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Flex height="100vh" bg="gray.50">
            {/* Sidebar - Liste des utilisateurs */}
            <Box w="20%" bg="white" p={4} borderRight="1px solid" borderColor="gray.200">
                <IconButton icon={<FiArrowLeft />} mb={4} onClick={() => navigate("/")} />
                {loadingUsers ? (
                    <Spinner />
                ) : (
                    <VStack spacing={4} align="stretch">
                        {interactedUsers.map((user) => (
                            <Flex
                                key={user.id}
                                align="center"
                                p={3}
                                borderRadius="md"
                                bg={selectedReceiverId === user.id.toString() ? "gray.100" : "white"}
                                cursor="pointer"
                                _hover={{ bg: "gray.50" }}
                                onClick={() => {
                                    setSelectedReceiverId(user.id.toString());
                                    setReceiver(user);
                                    navigate(`/chat?receiverId=${user.id}`);
                                }}
                            >
                                <Avatar name={user.firstName} src={user.profilePicture} />
                                <Box ml={3}>
                                    <Text fontWeight="medium">
                                        {user.firstName} {user.lastName}
                                    </Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Dernier message
                                    </Text>
                                </Box>
                                <Badge colorScheme="blue" ml="auto">
                                    ACTIF
                                </Badge>
                            </Flex>
                        ))}
                    </VStack>
                )}
            </Box>

            {/* Section principale - Chat */}
            <Flex flex="1" direction="column">
                <Flex
                    bg="white"
                    p={4}
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    justify="space-between"
                >
                    <Text fontWeight="bold" fontSize="lg">
                        {receiver ? `${receiver.firstName} ${receiver.lastName}` : "Sélectionnez un utilisateur"}
                    </Text>
                    <IconButton icon={<FiSettings />} />
                </Flex>
                <VStack flex="1" p={4} spacing={4} overflowY="auto" align="stretch">
                    {loadingMessages ? (
                        <Spinner />
                    ) : selectedReceiverId ? (
                        messages.map((message) => (
                            <Flex
                                key={message.id}
                                justify={message.senderId === senderId ? "flex-end" : "flex-start"}
                            >
                                <Box
                                    bg={message.senderId === senderId ? "blue.100" : "gray.100"}
                                    p={3}
                                    borderRadius="md"
                                    maxW="70%"
                                >
                                    <Text>{message.content}</Text>
                                </Box>
                            </Flex>
                        ))
                    ) : (
                        <Text color="gray.500" align="center">
                            Sélectionnez un utilisateur pour commencer une conversation.
                        </Text>
                    )}
                </VStack>
                <Flex p={4} borderTop="1px solid" borderColor="gray.200">
                    <Input
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        mr={2}
                        disabled={!selectedReceiverId}
                    />
                    <IconButton
                        icon={<FiSend />}
                        colorScheme="blue"
                        onClick={handleSendMessage}
                        disabled={!selectedReceiverId}
                    />
                </Flex>
            </Flex>

            {/* Section à droite - Profil utilisateur */}
            <Box w="20%" bg="white" p={4}
                borderLeft="1px solid" borderColor="gray.200">
                {receiver ? (
                    <VStack spacing={4}>
                        <Avatar size="xl" src={receiver.profilePicture} />
                        <Text fontWeight="bold" fontSize="lg">
                            {receiver.firstName} • {receiver.age || "N/A"}
                        </Text>
                        <Text color="gray.500">{receiver.bio || "Aucune biographie disponible."}</Text>
                        <Box w="full" mt={4}>
                            <Text fontSize="sm" fontWeight="bold" color="gray.500">
                                Budget recherché :
                            </Text>
                            <Flex justify="space-between">
                                <Text>${receiver.budget || "N/A"}</Text>
                                <Text>ASAP</Text>
                            </Flex>
                            <Text fontSize="sm" fontWeight="bold" color="gray.500" mt={2}>
                                Localisation :
                            </Text>
                            <Text>{receiver.neighborhood || "N/A"}</Text>
                        </Box>
                    </VStack>
                ) : (
                    <Text color="gray.500" align="center">
                        Sélectionnez un utilisateur pour voir ses informations.
                    </Text>
                )}
            </Box>
        </Flex>
    );
};

export default ChatPage;
