import React, { useEffect, useState, useRef } from "react";
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
    useToast, Center,
} from "@chakra-ui/react";
import { FiSend, FiArrowLeft, FiSettings } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { useSearchParams, useNavigate } from "react-router-dom";
import notificationService from "../services/notificationService"; // Importation du service de notification
import UserService from "../services/UserService"; // Importation du service utilisateur
const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [interactedUsers, setInteractedUsers] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [selectedReceiverId, setSelectedReceiverId] = useState(null);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const websocketRef = useRef(null);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const toast = useToast();
    const senderId = Cookies.get("userId"); // ID de l'utilisateur connecté
    const defaultReceiverId = searchParams.get("receiverId"); // ID du destinataire depuis l'URL

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

                // Éliminer les doublons par `id`
                const uniqueUsers = userDetails.filter(
                    (user, index, self) => index === self.findIndex((u) => u.id === user.id)
                );

                setInteractedUsers(uniqueUsers);
                setLoadingUsers(false);

                if (defaultReceiverId) {
                    const defaultReceiver = uniqueUsers.find(user => user.id.toString() === defaultReceiverId);
                    if (defaultReceiver) {
                        setSelectedReceiverId(defaultReceiverId);
                        setReceiver(defaultReceiver);
                    } else {
                        const res = await axios.get(`http://localhost:8762/user-security-service/api/users/${defaultReceiverId}`);
                        const newReceiver = res.data;

                        // Ajouter le destinataire à la liste sans doublons
                        setInteractedUsers((prev) => {
                            const updatedList = [...prev, newReceiver];
                            return updatedList.filter(
                                (user, index, self) => index === self.findIndex((u) => u.id === user.id)
                            );
                        });
                        setReceiver(newReceiver);
                        setSelectedReceiverId(defaultReceiverId);
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

    // Configurer WebSocket pour écouter les nouveaux messages
    useEffect(() => {
        if (senderId) {
            const webSocketUrl = `ws://localhost:8095/ws/messages?userId=${senderId}`;
            websocketRef.current = new WebSocket(webSocketUrl);

            websocketRef.current.onopen = () => {
                console.log("WebSocket connection established.");
            };

            websocketRef.current.onmessage = (event) => {
                const rawMessage = event.data;

                try {
                    const receivedMessage = JSON.parse(rawMessage);

                    if (
                        receivedMessage.senderId === Number(selectedReceiverId) ||
                        receivedMessage.receiverId === Number(selectedReceiverId)
                    ) {
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    }
                } catch (error) {
                    console.warn("Non-JSON message received:", rawMessage);
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            id: Date.now(),
                            senderId: null,
                            receiverId: Number(selectedReceiverId),
                            content: rawMessage,
                            timestamp: new Date().toISOString(),
                        },
                    ]);
                }
            };



            websocketRef.current.onclose = () => {
                console.log("WebSocket connection closed.");
            };

            return () => {
                websocketRef.current?.close();
            };
        }
    }, [senderId, selectedReceiverId, toast]);



    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const messageData = {
                senderId: Number(senderId),
                receiverId: Number(selectedReceiverId),
                content: newMessage,
                timestamp: new Date().toISOString(),
                status: "sent", // Initial status
            };

            try {
                const response = await axios.post(
                    `http://localhost:8762/messagerie-service/api/messages/send`,
                    messageData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const sentMessage = { ...response.data, status: "sent" };
                setMessages((prevMessages) => [...prevMessages, sentMessage]);
                setNewMessage("");

                // Récupérer les informations de l'utilisateur expéditeur
                const sender = await UserService.getUserById(senderId);

                // Préparer les données de notification
                const notificationData = {
                    title: `${sender.firstName} vous a envoyé un message`,
                    body: newMessage,
                    imageUrl: sender.profilePicture.url || "",
                };
                
                // Envoyer la notification
                await notificationService.sendNotification(selectedReceiverId, notificationData);

                // Mettre à jour le statut à "notified"
                setMessages((prevMessages) =>
                    prevMessages.map((message) =>
                        message.id === sentMessage.id
                            ? { ...message, status: "notified" }
                            : message
                    )
                );
            } catch (error) {
                console.error("Erreur lors de l'envoi du message ou de la notification :", error);
                toast({
                    title: "Erreur",
                    description: "Impossible d'envoyer le message ou la notification.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            }
        }
    };


    return (
        <Flex height="100vh" bg="gray.50">
            {/* Barre latérale - Liste des utilisateurs */}
            <Box w="20%" bg="white" p={4} borderRight="1px solid" borderColor="gray.200">
                <IconButton icon={<FiArrowLeft />} mb={4} onClick={() => navigate("/")} />
                {loadingUsers ? (
                    <Center h={"full"} w="full">
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='pink.500'
                            size='lg'
                        />
                    </Center>

                ) : (
                      <VStack spacing={4} align="stretch">
                    {interactedUsers.map((user) => {
                        if (!user || !user.id) return null; // Ajout de la vérification
                
                        return (
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
                                <Avatar name={user.firstName} src={user.profilePicture || ""} />
                                <Box ml={3}>
                                    <Text fontWeight="medium">
                                        {user.firstName} {user.lastName}
                                    </Text>
                                </Box>
                            </Flex>
                        );
                    })}
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
                        <Center h={"full"} w="full">
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='pink.500'
                                size='lg'
                            />
                        </Center>
                    ) : selectedReceiverId ? (
                        messages.map((message) => (
                            <Flex
                                key={message.id}
                                justify={Number(message.senderId) === Number(senderId) ? "flex-end" : "flex-start"}
                            >
                                <Box
                                    bg={Number(message.senderId) === Number(senderId) ? "blue.100" : "gray.100"}
                                    p={3}
                                    maxW="70%"
                                    borderRadius="20px" // Coins arrondis pour ressembler à WhatsApp
                                    borderTopRightRadius={
                                        Number(message.senderId) === Number(senderId) ? "0px" : "20px"
                                    } // Bord supérieur droit plat pour les messages envoyés
                                    borderTopLeftRadius={
                                        Number(message.senderId) === Number(senderId) ? "20px" : "0px"
                                    } // Bord supérieur gauche plat pour les messages reçus
                                    position="relative"
                                    boxShadow="md" // Légère ombre pour un effet d'élévation
                                >
                                    <Text>{message.content}</Text>
                                    <Text fontSize="xs" color="gray.500" mt={1} textAlign="right">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>

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
            {/* Affichage des informations utilisateur à droite */}
            <Box w="20%" bg="white" p={4} borderLeft="1px solid" borderColor="gray.200">
                {receiver ? (
                    <VStack spacing={4}>
                        <Avatar
                            size="xl"
                            src={
                                receiver.profilePicture?.length > 0
                                    ? `http://localhost:8762/user-security-service/${receiver.profilePicture}`
                                    : ""
                            }
                        />
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
