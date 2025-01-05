import React from 'react';
import {
    Box,
    VStack,
    Text,
    Avatar,
    Card,
    CardBody,
    Flex,
} from '@chakra-ui/react';
import { FiZap } from 'react-icons/fi';

const ProfileSection = ({ receiver }) => {
    return (
        <Box bg="white" width="100%" p={4}>
            <VStack spacing={6} align="stretch">
                <ProfileCard receiver={receiver} />
                <UserDetails receiver={receiver} />
            </VStack>
        </Box>
    );
};

const ProfileCard = ({ receiver }) => {
    return (
        <VStack spacing={4}>
            <Box position="relative">
                <Avatar size="2xl" src={receiver?.profilePicture || "/placeholder-avatar.png"} />
                <Box
                    position="absolute"
                    bottom={0}
                    right={0}
                    bg="white"
                    p={1}
                    borderRadius="full"
                >
                    <FiZap size={20} color="blue" />
                </Box>
            </Box>
            <Text fontSize="xl" fontWeight="semibold">
                {receiver?.firstName} {receiver?.lastName} • {receiver?.age || "N/A"}
            </Text>
            <Text color="gray.500">
                {receiver?.bio || "Pas de description disponible"}
            </Text>
        </VStack>
    );
};

const UserDetails = ({ receiver }) => {
    return (
        <Card>
            <CardBody>
                <VStack spacing={4} align="stretch">
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.500">
                            Email :
                        </Text>
                        <Text>{receiver?.email}</Text>
                    </Box>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.500">
                            Emplacement :
                        </Text>
                        <Text>{receiver?.location || "N/A"}</Text>
                    </Box>
                    <Box>
                        <Text fontSize="sm" fontWeight="medium" color="gray.500">
                            Budget :
                        </Text>
                        <Text>{receiver?.budget || "N/A"}</Text>
                    </Box>
                </VStack>
            </CardBody>
        </Card>
    );
};

export default ProfileSection;
