import React from 'react';
import { Box, Container, Flex, Heading, Link } from '@chakra-ui/react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const CustomTabs = () => {
    const location = useLocation();

    return (
        <Box>
            <Container maxW="7xl">
                <Heading py={10}>My Listings Space</Heading>
            </Container>
            <Box as="nav" borderBottom="1px" borderColor="gray.200">
                <Container maxW="7xl">
                    <Flex>
                        {/* My Listings Tab */}
                        <Link
                            as={NavLink}
                            to="/Listing"
                            end // Ensures this link is only active for "/Listing" and not "/Listing/create"
                            textAlign="center"
                            px={5}
                            fontWeight="semibold"
                            fontSize="19px"
                            pb={1}
                            borderBottomWidth={3}
                            borderRadius="2px"
                            borderBottomColor={location.pathname === '/Listing' ? 'pink.500' : 'transparent'}
                            _hover={{ textDecoration: 'none' }}
                            _activeLink={{ color: 'pink.500', borderBottomColor: 'pink.500' }}
                        >
                            My Listings
                        </Link>

                        {/* Create Listing Tab */}
                        <Link
                            as={NavLink}
                            to="/Listing/create"
                            textAlign="center"
                            fontWeight="semibold"
                            px={5}
                            pb={1}
                            fontSize="19px"
                            borderRadius="2px"
                            borderBottomWidth={3}
                            borderBottomColor={location.pathname === '/Listing/create' ? 'pink.500' : 'transparent'}
                            _hover={{ textDecoration: 'none' }}
                            _activeLink={{ color: 'pink.500', borderBottomColor: 'pink.500' }}
                        >
                            Create Listing
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

const ListingsPage = () => {
    return (
        <Box>
            <CustomTabs />
            {/* Outlet to render the content of the selected tab */}
        </Box>
    );
};

export default ListingsPage;
