import React, {useEffect, useRef, useState} from "react";
import {
  Box,
  Spinner,
  Text,
  Image,
  Center,
  Grid,
  Container,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useDisclosure, useToast
} from "@chakra-ui/react";
import AnnoncesService from "../../../services/AnnoncesService";
import Cookies from "js-cookie";
import {MyListingCard} from "./MyListingCard";
import annoncesService from "../../../services/AnnoncesService";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef();
  const [selectedId,setSelectedId] = useState();
  const toast = useToast();
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchListings = async () => {
    setLoading(true);
    try {
      const userId = Number(Cookies.get("userId"));
      const fetchedListings = await AnnoncesService.getAnnoncesByUser(userId);
      if (fetchedListings && Array.isArray(fetchedListings.getAnnoncesByUser)) {
        const formattedListings = fetchedListings.getAnnoncesByUser.map((listing) => ({
          id: listing.id,
          price: listing.price,
          propertyType: listing.propertyType,
          availableFrom: listing.availableFrom,
          availableTo: listing.availableTo,
          numberOfRoommates: listing.numberOfRoommates,
          statusAnnonce: listing.statusAnnonce,
          duration: listing.duration,
          bedrooms:listing.bedrooms,
          layoutType:listing.layoutType,
          createdAt:listing.createdAt,
          address: {
            street: listing.address?.street || "Unknown Street",
            city: listing.address?.city || "Unknown City",
            country: listing.address?.country || "Unknown Country",
          },
          photos: listing.photos || [],
          user: {
            firstName: listing.user?.firstName || "Unknown First Name",
            lastName: listing.user?.lastName || "Unknown Last Name",
            username: listing.user?.username || "Unknown Username",
            profilePicture: listing.user?.profilePicture || "/default-avatar.jpg",
          },
        }));
        setListings(formattedListings);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("An error occurred while loading listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDeleteListing = async () => {
    setDeleteLoading(true);
    try {
      await annoncesService.deleteAnnonce(parseInt(selectedId));

      // Remove the deleted listing from the listings state
      setListings((prevListings) =>
          prevListings.filter((listing) => listing.id !== selectedId)
      );

      toast({
        title: "Listing Deleted",
        description: "Your listing has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an issue deleting your listing. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleteLoading(false);
      onClose();
    }
  };


  const openDialog=(id)=>{
    setSelectedId(id);
    onOpen()
  }


  return (
      <Box className="grid gap-4">
        {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <Spinner
                  thickness='4px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='pink.500'
                  size='xl'
              />
            </Box>
        )}
        {error && <Text color="red.500">{error}</Text>}
        {!loading && !error && listings.length === 0 && (
            <Center h="calc(100vh - 56px)">
              <Text color="gray.500" textAlign="center">
                No listings available at the moment.
              </Text>
            </Center>

        )}
        <Container maxW="7xl" h="calc(100vh - 56px)" py={20}>
            <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                }}
                gap={6}
                overflowY="auto"
                maxHeight="calc(100%)" // Adjust based on header/footer height
            >
              {!loading &&
                  !error &&
                  listings.length > 0 &&
                  listings.map((listing,index) => (
                     <MyListingCard listing={listing} deleteListing={openDialog} key={index} index={index} />
                  ))}
            </Grid>
        </Container>
        <AlertDialog
            motionPreset='slideInBottom'
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete Listing
              </AlertDialogHeader>

              <AlertDialogBody fontWeight='semibold'>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' isLoading={deleteLoading} onClick={handleDeleteListing} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>



      </Box>
  );
};

export default Listings;
