import React, { useEffect, useState } from 'react';
import { Box, Avatar, Text, VStack, Badge, Tooltip, Center } from '@chakra-ui/react';
import { LuBadgeCheck, LuBadgeMinus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const UserCard = ({ user, myPersonality }) => {
    const navigate = useNavigate();
    const [personality, setPersonality] = useState(myPersonality);

    useEffect(() => {
        setPersonality(myPersonality);
    }, [myPersonality]);

    const personalityMatchingLabel = () => {

        return user.personality === personality ? "Personality Matching" : "Personality Not Matching";
    };

    const personalityMatchingColor = () => {
        return user.personality === personality ? "#D53F8C" : "#FF7900";
    };

    return (
        <Box
            borderWidth="1px"
            borderColor="blackAlpha.100"
            borderRadius="xl"
            overflow="hidden"
            shadow="md"
            onClick={() => navigate(`/users/${user.id}`)}
            p={4}
            bg="white"
            position="relative"
            _hover={{
                boxShadow: "xl",
                cursor: "pointer",
                borderColor: "blackAlpha.300",
            }}
        >
            {user.personality ? (
                <Tooltip
                    label={personalityMatchingLabel()}
                    bg={personalityMatchingColor()}
                    color="white"
                    hasArrow
                    boxShadow="xl"
                    m={3}
                    placement="top"
                    p={2}
                    px={4}
                    borderRadius={9}
                >
                    <Box w="fit-content">
                        <LuBadgeCheck
                            color={personalityMatchingColor()}
                            size="28"
                            style={{
                                backgroundColor: "white",
                                borderRadius: "50%",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                    </Box>
                </Tooltip>
            ) : (
                <Tooltip
                    label="Complete Quiz To Get Badge"
                    bg="red.600"
                    color="white"
                    hasArrow
                    boxShadow="xl"
                    m={3}
                    placement="top"
                    p={2}
                    px={4}
                    borderRadius={9}
                >
                    <Box w="fit-content">
                        <LuBadgeMinus
                            color="red"
                            size={28}
                            style={{
                                backgroundColor: "white",
                                borderRadius: "50%",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                    </Box>
                </Tooltip>
            )}
            <Center>
                <Avatar
                    size="2xl"
                    name={`${user.firstName} ${user.lastName}`}
                    src={user.profilePicture?.url || null}
                    mb={4}
                />
            </Center>
            <VStack spacing={2} align="center">
                <Text fontWeight="bold" fontSize="lg">
                    {user.firstName} {user.lastName} · {user.age || "N/A"}
                </Text>
                <Badge px="9px" py="2px" borderRadius="full" colorScheme="blue">
                    username: {user.username}
                </Badge>
                {user.gender && (
                    <Badge
                        px="9px"
                        py="2px"
                        borderRadius="full"
                        colorScheme={user.gender === "H" ? "blue" : "pink"}
                    >
                        I'm a {user.gender === "H" ? "Male" : "Female"}
                    </Badge>
                )}
                <Badge px="9px" mt={2} py="2px" borderRadius="full" colorScheme={user.personality ? "green" : "red"}>
                    {user.personality ? "Quiz completed" : "Quiz not completed"}
                </Badge>
                {user.userPreference && (
                    <VStack mt={2} spacing={2} align="start">
                        {user.userPreference.locations && (
                            <Badge px="9px" py="2px" borderRadius="full" bgColor="blackAlpha.200">
                                Location: {user.userPreference.locations || "not specified"}
                            </Badge>
                        )}
                        {user.userPreference.requestedDate && (
                            <Badge px="9px" py="2px" borderRadius="full" bgColor="blackAlpha.200">
                                Requested Date: {user.userPreference.requestedDate || "not specified"}
                            </Badge>
                        )}
                        {user.userPreference.minPrice && (
                            <Badge px="9px" py="2px" borderRadius="full" bgColor="blackAlpha.200">
                                Price Range: {user.userPreference.minPrice}$ - {user.userPreference.maxPrice}$
                            </Badge>
                        )}
                    </VStack>
                )}
            </VStack>
        </Box>
    );
};

export default UserCard;
