import React from "react";
import { Box, VStack, Avatar, Flex, Text } from "@chakra-ui/react";

const Sidebar = ({ users, onUserSelect }) => {
    return (
        <Box bg="white" p={4} borderRight="1px solid" borderColor="gray.200" width="320px">
            <VStack spacing={2} align="stretch">
                {users.map((user) => (
                    <UserItem
                        key={user.id}
                        user={user}
                        onSelect={() => onUserSelect(user.id)}
                    />
                ))}
            </VStack>
        </Box>
    );
};

const UserItem = ({ user, onSelect }) => (
    <Flex
        p={3}
        alignItems="center"
        borderRadius="lg"
        cursor="pointer"
        _hover={{ bg: "gray.50" }}
        onClick={onSelect}
    >
        <Avatar src={user.avatar || "/placeholder-avatar.png"} name={user.firstName} size="md" />
        <Box ml={3} flex={1}>
            <Flex justify="space-between" align="center">
                <Text fontWeight="medium">{user.firstName} {user.lastName}</Text>
            </Flex>
        </Box>
    </Flex>
);

export default Sidebar;
