import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Avatar,
    Text,
    Badge,
    VStack,
    Spacer,
    Flex,
    Divider,
    Button,
    Heading,
    HStack,
    Tag,
    Icon, Spinner, AvatarBadge, Tooltip,
} from "@chakra-ui/react";
import {IoArrowBack, IoCheckmarkCircleSharp} from "react-icons/io5";
import {LuBadgeCheck, LuBadgeMinus} from "react-icons/lu";
import Cookies from "js-cookie";

const UserDetails = () => {
    const { id } = useParams(); // ID de l'utilisateur consulté
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    // const personalityMatchingColor =()=>{
    //     return   user.personality === Cookies.get("userId")){
    //         return "pink.600";
    //     }else {
    //         return "#FF7900";
    //     }
    // }
    //
    // const personalityMatchingLabel =()=>{
    //     if(  user.personality === myPersonality){
    //         return "Personality  Matching";
    //     }else {
    //         return "Personality Not Matching"
    //     }
    // }

    useEffect(() => {
        // Fetch user details from backend
        fetch(`http://localhost:8762/user-security-service/api/users/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user details");
                }
                return response.json();
            })
            .then((data) => {
                setUser(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='pink.500'
                    size='lg'
                />
            </Flex>
        );
    }

    if (!user) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Text fontSize="xl" color="red.500">User not found</Text>
            </Flex>
        );
    }

    return (
        <>
            <Box maxW="8xl" mx="auto" px={6} py={8} bg="white" borderRadius="xl" boxShadow="2xl">
                {/* Bouton Back */}
                <Button
                    mb={10}
                    variant="link"
                    alignItems="center"
                    leftIcon={<IoArrowBack />}
                    onClick={() => navigate("/users")}
                    size="lg"
                >
                    Back to Home
                </Button>

                <Flex gap={10}>
                    {/* Section de gauche */}
                    <Box flex="2">
                        <Flex alignItems="center" gap={8} mb={8}>

                            <Avatar
                                size="2xl"
                                name={`${user.firstName} ${user.lastName}`}
                                src={user.profilePicture?.url}
                                boxShadow="lg"
                            >
                                <Box
                                    as="span"
                                    position="absolute"
                                    bottom="-3"
                                    right="-2"
                                    bg="white"
                                    borderRadius="full"
                                    boxSize="0.9em"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    boxShadow="sm"
                                >
                                    {user.personality ?
                                    <Icon as={ LuBadgeCheck} boxSize="0.8em" color="green.500" />
                                            :
                                    <Icon as={ LuBadgeMinus } boxSize="0.8em" color="red.500" />
                                    }
                                </Box>
                            </Avatar>

                            <Box>
                                <Heading size="xl" mb={2} fontWeight="bold" color="blackAlpha.700">
                                    Hi, I'm {user.firstName}
                                </Heading>
                                <HStack>
                                    <Tooltip
                                        label={user?.userPreference?.locations && user?.userPreference?.locations !== "" ? "Preferences Completed" : "Preferences Not Completed"}
                                        bg="white"
                                        color="black" // Ensure contrast for better readability
                                        hasArrow
                                        shadow="md"
                                        border="1px solid"
                                        borderColor="blackAlpha.100"
                                        m={3}
                                        placement="bottom"
                                        p={2}
                                        px={4}
                                        borderRadius={9}
                                    >
                                        <Badge px="9px" cursor="pointer" py="2px" borderRadius="full" colorScheme="purple">
                                            {user?.userPreference?.locations && user?.userPreference?.locations !== "" ? "Completed" : "Incomplete"}
                                        </Badge>
                                    </Tooltip>

                                </HStack>
                            </Box>
                            <Spacer />
                            <Text fontSize="lg" fontWeight="medium" color="blackAlpha.600">
                                {user.age} · {user.gender === "H" ? "Male" : "Female"}
                            </Text>
                        </Flex>

                        <Divider borderColor="blackAlpha.200" />

                        <VStack align="flex-start" spacing={8} mt={6}>
                            <Box>
                                <Text fontSize="2xl" fontWeight="bold" mb={3} color="blackAlpha.700">
                                    Introduction
                                </Text>
                                <div dangerouslySetInnerHTML={{ __html: user?.userPreference?.description || "This user hasn't provided an introduction yet." }} />


                            </Box>
                            <Box>
                                <Text fontSize="2xl" fontWeight="bold" mb={3} color="blackAlpha.700">
                                    User Information
                                </Text>
                                <VStack align="flex-start" spacing={2} fontSize="lg" color="blackAlpha.600">
                                    <Text>
                                        <strong>Email:</strong> {user.email}
                                    </Text>
                                    <Text>
                                        <strong>Username:</strong> {user.username}
                                    </Text>
                                    <Text>
                                        <strong>Full Name:</strong> {user.firstName || "Unknown"} {user.lastName || "Unknown"}
                                    </Text>
                                    <Text>
                                        <strong>Quiz:</strong> {user.personality ? "Completed" : "Uncompleted"}
                                    </Text>
                                </VStack>
                            </Box>

                            <Box>
                                <Text fontSize="2xl" fontWeight="bold" mb={3} color="blackAlpha.700">
                                    Account Activity
                                </Text>
                                <VStack align="flex-start" spacing={2} fontSize="lg" color="blackAlpha.600">
                                    <Text>
                                        <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
                                    </Text>

                                </VStack>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Section de droite */}
                    <Box
                        flex="1"
                        bg="blackAlpha.50"
                        borderRadius="lg"
                        boxShadow="lg"
                        h="fit-content"
                        py={6}
                        border="1px solid #E2E8F0"
                    >
                        <Text fontSize="2xl" px={6} fontWeight="bold" mb={6} color="blackAlpha.700">
                            My Renter Info
                        </Text>
                        <VStack align="flex-start"  spacing={4} fontSize="lg" color="blackAlpha.600">
                            <Text px={6} fontWeight="semibold" fontSize={"xl"}>
                                <strong>Urgency:</strong> {user?.userPreference?.requestedDate || "N/A"}
                            </Text>
                            <Text px={6} fontWeight="semibold" fontSize={"xl"} >
                                <strong>Budget:</strong> {user?.userPreference?.minPrice}$ - {user?.userPreference?.maxPrice}$
                            </Text>

                            <Text px={6} fontWeight="semibold" fontSize={"xl"}>
                                <strong>Looking in: </strong> {user?.userPreference?.locations || "N/A"}
                            </Text>
                        </VStack>
                        <Divider my={6} borderColor="blackAlpha.200" />
                        <Button
                            mx={6}
                            colorScheme="blue"
                            size="lg"
                            width="calc(100% - 45px)"
                            onClick={() => navigate(`/chat?receiverId=${id}`)}
                            _hover={{ bg: "blue.500", transform: "scale(1.02)" }}
                            transition="all 0.2s"
                        >
                            Start a Chat
                        </Button>
                    </Box>
                </Flex>
            </Box>
            <Box mt={8}></Box>
        </>
    );
};

export default UserDetails;
