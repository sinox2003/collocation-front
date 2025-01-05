import React, { useState, useEffect } from 'react';
import { Box,Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Container,
  Grid,
  Spinner,
  Center,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Drawer,
  DrawerContent, DrawerHeader, DrawerCloseButton, DrawerOverlay, DrawerBody, DrawerFooter, Badge, HStack
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ListingCard from '../components/ListingCard';
import SearchAndFilter from '../components/SearchAndFilter';
import AnnoncesService from '../services/AnnoncesService';
import { useNavigate } from "react-router-dom";
import fetchAnnoncesWithinRadius from '../services/AnnonceRestService';
import {FiMoreHorizontal } from "react-icons/fi"; // Icônes

import {TbMapPinSearch} from "react-icons/tb";

const RoomiInterface = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [radius, setRadius] = useState(10); // Default radius
  const [country, setCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [visibleCount, setVisibleCount] = useState(12); // Initial number of visible listings




  const handleSearchClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchSubmit = () => {
    setIsModalOpen(false);
    // Set the search query to be displayed in the search bar
    setSearchQuery(`You are looking in ${street}, ${city} within ${radius} km`);

    // You can also call your handleSearch function here to apply the filters
    handleSearch();
  };

  const handleClearSearch = () => {
    // Reset the form fields
    setCity('');
    setStreet('');
    setRadius(10); // Default radius
    setSearchQuery(''); // Clear the search query
  
    // You can optionally trigger a reset of the filtered listings or fetch all listings
    fetchListings();
    handleCloseModal();
  };
  


  const fetchListings = async () => {
    setLoading(true);
    try {
      const fetchedListings = await AnnoncesService.getAllAnnonces();
      if (fetchedListings && Array.isArray(fetchedListings.getAllAnnonces)) {
        const formattedListings = fetchedListings.getAllAnnonces.map((listing) => ({
          id: listing.id,
          price: listing.price,
          propertyType: listing.propertyType,
          layoutType: listing.layoutType,
          bedrooms: listing.bedrooms,
          numberOfRoommates: listing.numberOfRoommates,
          duration: listing.duration,
          availableFrom: listing.availableFrom,
          availableTo: listing.availableTo,
          address: {
            street: listing.address?.street || 'Unknown Street',
            city: listing.address?.city || 'Unknown City',
            country: listing.address?.country || 'Unknown Country',
          },
          photos: listing.photos || [],
          user: {
            id: listing.user?.id || 'Unknown User',
            firstName: listing.user?.firstName || 'Unknown First Name',
            lastName: listing.user?.lastName || 'Unknown Last Name',
            username: listing.user?.username || 'Unknown Username',
            profilePicture: listing.user?.profilePicture?.url || '/default-avatar.jpg',
          },
        }));
        setListings(formattedListings);
        setFilteredListings(formattedListings);
      } else {
        console.error('Invalid data structure or empty getAllAnnonces array');
        setError('Failed to load listings.');
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('An error occurred while loading listings.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchListings();
  }, []);

  const handleSort = (criteria) => {
    const sorted = [...filteredListings].sort((a, b) => {
      if (criteria === 'price') {
        return a.price - b.price;
      }
      return a[criteria]?.localeCompare(b[criteria]);
    });
    setFilteredListings(sorted);
  };

  const handleFilter = (filters) => {
    const filtered = listings.filter((listing) => {
      const matchesPrice =
          (!filters.priceRange ||
              (listing.price >= filters.priceRange[0] && listing.price <= filters.priceRange[1]));

      const matchesPropertyType =
          (!filters.propertyTypes  || filters.propertyTypes.length === 0 ||
              filters.propertyTypes.includes(listing.propertyType));
      const matchesLayoutType =
          (!filters.layout || filters.layout.length === 0 ||
              filters.layout.includes(listing.layoutType));
      const matchesBedrooms =
          (filters.bedrooms === null || listing.bedrooms === filters.bedrooms);
      //
      const matchesRoommates =
          (filters.roommates === null || listing.numberOfRoommates === filters.roommates);

      return matchesPrice && matchesPropertyType  && matchesLayoutType && matchesBedrooms && matchesRoommates;

    });
    setFilteredListings(filtered);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedAnnonces = await fetchAnnoncesWithinRadius(country, city, street, radius);
      
      // Check if the fetched data is in the correct format
      if (fetchedAnnonces && Array.isArray(fetchedAnnonces)) {
        const formattedAnnonces = fetchedAnnonces.map((listing) => ({
          id: listing.id,
          price: listing.price,
          propertyType: listing.propertyType,
          layoutType: listing.layoutType,
          bedrooms: listing.bedrooms,
          numberOfRoommates: listing.numberOfRoommates,
          duration: listing.duration,
          availableFrom: listing.availableFrom,
          availableTo: listing.availableTo,
          address: {
            street: listing.address?.street || 'Unknown Street',
            city: listing.address?.city || 'Unknown City',
            country: listing.address?.country || 'Unknown Country',
            longitude: listing.address?.longitude || 'Unknown Longitude',
            latitude: listing.address?.latitude || 'Unknown Latitude',
          },
          photos: listing.photos || [],
          user: {
            id: listing.user?.id || 'Unknown',
            firstName: listing.user?.firstName || 'Unknown First Name',
            lastName: listing.user?.lastName || 'Unknown Last Name',
            username: listing.user?.username || 'Unknown Username',
            profilePicture: listing.user?.profilePicture?.url || '/default-avatar.jpg',
          },
        }));
        setListings(formattedAnnonces);
        setFilteredListings(formattedAnnonces);
      } else {
        console.error('Invalid data structure or empty getAnnoncesWithinRadius array');
        setError('Failed to load annonces.');
      }
    } catch (err) {
      console.error('Error fetching annonces:', err);
      setError('An error occurred while loading annonces.');
    } finally {
      setLoading(false);
    }
};


  return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Box pt="50px" bgColor="white">
          <Container maxW="7xl" pb={20}>

            <Center mb={8}>
              <InputGroup
                width={{ base: 'full', md: '50%' }}
                boxShadow="sm"
                px={2}
                borderRadius="full"
                bgColor="white"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ boxShadow: 'md', borderColor: 'gray.300' }}
                onClick={handleSearchClick} // Open modal on click
                
              >
                <Input
                  placeholder="Search by city or street"
                  variant="unstyled"
                  pl={4}
                  py={3}
                  borderRadius="lg"
                  _focus={{ outline: 'none' }}
                  value={searchQuery} // Display the formatted query here
                  readOnly // Prevent typing in the input directly
                />
                <InputRightElement h="full" mr={2}>
                  <IconButton

                    aria-label="Search"
                    icon={<TbMapPinSearch size="27px" />}
                    variant="unstyled"
                    _hover={{ transform:"scale(1.05)translateY(-2px)" }}
                  />
                </InputRightElement>
              </InputGroup>
            </Center>


            <SearchAndFilter onSort={handleSort} onFilter={handleFilter} />
            {loading ? (
                <Center h="500px">
                  <Spinner
                      thickness='4px'
                      speed='0.65s'
                      emptyColor='gray.200'
                      color='pink.500'
                      size='xl'
                  />
                </Center>
            ) : error ? (
                <Center mt="100vh" color="red.500">
                  {error}
                </Center>
            ) : filteredListings.length > 0 ? (
                <Grid
                    templateColumns={{
                      base: '1fr',
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                    }}
                    gap={14}
                    // Adjust based on header/footer height
                >
                  {filteredListings.map((listing) => (
                      <ListingCard
                          key={listing.id}
                          listing={listing}
                          onClick={() => navigate(`/room-rental/${listing.id}`)}
                      />
                  ))}
                </Grid>
            ) : (
                <Center mt={10}>
                  <Text>No listings available.</Text>
                </Center>
            )}
          </Container>
        </Box>

        <Drawer isOpen={isModalOpen} placement="right" onClose={handleCloseModal} size="sm">
          <DrawerOverlay />
          <DrawerContent

              bgGradient="linear(to-br, white, gray.50)"
              boxShadow="2xl"
              borderRadius="lg"
              p={6}
          >
            <DrawerCloseButton color="gray.500" />
            <DrawerHeader fontSize="2xl" fontWeight="bold" color="gray.700" textAlign="center">
              Search Listings by Location
            </DrawerHeader>
            <DrawerBody>
              <Stack spacing={5}>
                <Input
                    placeholder="City"
                    size="lg"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    focusBorderColor="pink.400"
                    boxShadow="md"
                    borderRadius="lg"
                />
                <Input
                    placeholder="Street"
                    size="lg"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    focusBorderColor="pink.400"
                    boxShadow="md"
                    borderRadius="lg"
                />

                <NumberInput
                    value={radius+" Km"}
                    onChange={(value) => setRadius(value)}
                    size="lg"
                    focusBorderColor="pink.400"

                    min={0}
                    step={1}
                >
                  <NumberInputField
                      placeholder="Radius (in km)"
                      boxShadow="md"

                      borderRadius="lg"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Stack>
              <HStack spacing={2} my={4} >
                <Badge colorScheme='purple' px='6px' borderRadius='lg'  >Reminder</Badge>
                <Text  color='purple.600' fontWeight='seminbold' >
                  Street is not mandatory, but radius needs to be superior than 0 Km

                </Text>
              </HStack>
            </DrawerBody>
            <DrawerFooter justifyContent="center">
              {/* Search Button */}
              <Button
                  colorScheme="pink"
                  size="lg"
                  px={10}
                  borderRadius="full"
                  boxShadow="md"
                  onClick={handleSearchSubmit}
              >
                Search
              </Button>

              {/* Clear Search Button */}
              <Button
                  bg="blackAlpha.100"
                  _hover={{bg:"blackAlpha.200"}}
                  size="lg"
                  px={10}
                  borderRadius="full"
                  shadow="md"
                  onClick={handleClearSearch}
                  ml={4} // Add margin to separate the buttons
              >
                Clear Search
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

      </Box>
  );
};

export default RoomiInterface;
