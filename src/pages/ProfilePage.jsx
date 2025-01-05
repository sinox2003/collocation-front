import {NavLink, Outlet, useLocation} from "react-router-dom";
import {Box, Container, Flex, Heading, Link} from "@chakra-ui/react";
import React from "react";

export const ProfilePage = () => {

    const location = useLocation();

    return (
        <Box>
            <Container maxW="7xl">
                <Heading py={10}>User Space</Heading>
            </Container>
            <Box as="nav" borderBottom="1px" borderColor="gray.200">
                <Container maxW="7xl">
                    <Flex>
                        {/* My Listings Tab */}
                        <Link
                            as={NavLink}
                            to="/profile"
                            end // Ensures this link is only active for "/profile" and not "/profile/create"
                            textAlign="center"
                            px={5}
                            fontWeight="semibold"
                            fontSize="19px"
                            pb={1}
                            color='blackAlpha.600'
                            borderBottomWidth={3}
                            borderRadius="2px"
                            borderBottomColor={location.pathname === '/profile' ? 'pink.500' : 'transparent'}
                            _hover={{ textDecoration: 'none' }}
                            _activeLink={{ color: 'pink.500', borderBottomColor: 'pink.500' }}
                        >
                            Preferences
                        </Link>

                        {/* Create Listing Tab */}
                        <Link
                            as={NavLink}
                            to="/profile/edit"
                            textAlign="center"
                            fontWeight="semibold"
                            px={5}
                            color='blackAlpha.600'
                            pb={1}
                            fontSize="19px"
                            borderRadius="2px"
                            borderBottomWidth={3}
                            borderBottomColor={location.pathname === '/profile/edit' ? 'pink.500' : 'transparent'}
                            _hover={{ textDecoration: 'none' }}
                            _activeLink={{ color: 'pink.500', borderBottomColor: 'pink.500' }}
                        >
                            Edit profile
                        </Link>
                    </Flex>
                </Container>
            </Box>

            <Box bg="blackAlpha.50">
                <Outlet />
            </Box>
        </Box>
    );
};