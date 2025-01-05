import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    Image,
    Stack,
    Modal,
    Center,
    ModalContent,
    ModalBody, useToast, Grid, Container, Spinner
} from "@chakra-ui/react";
import {useSpring, animated, easings} from '@react-spring/web';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ListingCard from "../components/ListingCard";
import image1 from "../../src/assets/images/image.jpg";
import image3 from "../../src/assets/images/image2.jpg";
import image4 from "../../src/assets/images/download.jpg";
import AnnoncesService from "../services/AnnoncesService";
import EmailStep from "../components/features/auth/EmailStep";
import PasswordStep from "../components/features/auth/PasswordStep";
import SignUpStep from "../components/features/register/SignUpStep";
import VerificationStep from "../components/features/register/VerificationStep";
import handleEmailContinue from "../components/layout/Header";
import handlePasswordSubmit from "../components/layout/Header";
import handleLoginSuccess from "../components/layout/Header";
import { useNavigate } from "react-router-dom";
import {FiMoreHorizontal } from "react-icons/fi"; // Icônes


const HomePage = () => {
    const [listings, setListings] = useState([]);
    const [sortedListings, setSortedListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentStep, setCurrentStep] = useState("email");
    const [email, setEmail] = useState("");
    const [jwt, setJwt] = useState("");
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(12); // Show 12 listings initially



    const images = [
        image1, image3, image4
    ];
    const [showModal, setShowModal] = useState(false);


    const handleGetStartedClick = () => {
        setShowModal(true);
        setCurrentStep("email");
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentStep("email");
        setEmail("");
        setJwt("");
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [images.length]);

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
                        profilePicture: listing.user?.profilePicture || '/default-avatar.jpg',
                    },
                }));
                setListings(formattedListings);
                setSortedListings(formattedListings);
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

    const props = useSpring({
        opacity: 1,
        reset: true,
        config: { duration: 1500,easing:easings.easeInOutCubic },
    });

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">

            <Box bg="gray.50" py={10}>
                <Flex
                    direction={{ base: "column", md: "row" }}
                    align="center"
                    justify="space-between"
                    maxW="1200px"
                    mx="auto"
                    px={8}
                >
                    <Box w={{ base: "100%", md: "50%" }}>
                        <Heading as="h1" size="2xl" mb={4}>
                            Join Millions of Verified Renters
                        </Heading>
                        <Text fontSize="lg" mb={6}>
                            CasaLink connects you to other verified renters in your area that are
                            looking for roommates and posting rooms you can't find anywhere
                            else. Stop stressing and let us help you find a better place to
                            live!
                        </Text>
                        <Stack direction="row" spacing={4}>
                            <Button variant="outline" colorScheme="blue" onClick={handleGetStartedClick}>
                                Get Started for Free
                            </Button>
                        </Stack>
                    </Box>
                    <Box
                        w={{ base: "100%", md: "44%" }}
                        mt={{ base: 6, md: 0 }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <animated.div style={{ ...props, width: '100%', height: '100%', marginTop: '70px' }}>
                            <Image
                                src={images[currentImageIndex]}
                                alt="Rotating Example"
                                borderRadius="40px"
                                objectFit="cover"
                                width="100%"
                                height={{ base: "300px", md: "500px" }}
                            />
                        </animated.div>
                    </Box>

                </Flex>
            </Box>

            {/* Section des Listings */}
            <Box py={10} bg="white">
                <Heading as="h2" size="lg" mb={6} textAlign="center">
                    Featured Listings
                </Heading>
                {
                    loading ?
                        <Center h="500px">
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='pink.500'
                                size='lg'
                            />
                        </Center>
                        :
                <Container maxW="7xl" pb={20}>
                    <Grid
                        templateColumns={{
                            base: '1fr',
                            md: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                        }}
                        gap={6}
                    >
                        {sortedListings.slice(0, visibleCount).map((listing) => (
                            <ListingCard key={listing.id} listing={listing} onClick={() => navigate(`/room-rental/${listing.id}`)}/>
                        ))}

                    </Grid>
                    {visibleCount < sortedListings.length && (
                        <Center>
                            <Button
                                onClick={() => setVisibleCount((prev) => prev + 12)}
                                colorScheme="teal"
                                variant="outline"
                                size="lg"
                                leftIcon={<FiMoreHorizontal />}
                                borderRadius="full"
                                boxShadow="sm"
                                _hover={{ boxShadow: "md" }}
                                mb={10}
                            >
                                Show More
                            </Button>
                        </Center>
                    )}

                </Container>
                }
            </Box>

            <Modal isOpen={showModal} onClose={handleCloseModal} motionPreset="none">

                <ModalContent>
                    <ModalBody>
                        {currentStep === "email" && (
                            <EmailStep onClose={handleCloseModal} onContinue={handleEmailContinue}  onLoginSuccess={handleLoginSuccess} />
                        )}
                        {currentStep === "password" && (
                            <PasswordStep
                                email={email}
                                onClose={handleCloseModal}
                                onSubmit={handlePasswordSubmit}
                            />
                        )}
                        {currentStep === "signup" && (
                            <SignUpStep
                                email={email}
                                onClose={handleCloseModal}
                                onStepChange={setCurrentStep}
                                setJwt={setJwt}
                                setUser={(user) => {
                                    setUserId(user.id);
                                    setUserName(user.name);
                                    setUserEmail(user.email);
                                }}
                            />
                        )}
                        {currentStep === "verification" && (
                            <VerificationStep email={email} onClose={handleCloseModal} onVerify={() => { }} />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default HomePage;
