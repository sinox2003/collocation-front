import React, { useState, useEffect } from "react";
import {Divider, InputGroup, InputLeftElement} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
    Box,
    SimpleGrid,
    Avatar,
    Text,
    Badge,
    VStack,

    Spinner,
    Center,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Select,
    Switch,
    HStack,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from "@chakra-ui/react";
import { FiFilter, FiChevronDown, FiDollarSign, FiSearch, FiMoreHorizontal } from "react-icons/fi"; // Icônes
import { AiFillCheckCircle } from "react-icons/ai";
import {MdFilterListAlt} from "react-icons/md";
import UserCard from "../components/ui/UserCard";
import Cookies from "js-cookie"; // Icône de vérification
// import Header from "../components/layout/Header";
// import Footer from "../components/layout/Footer";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(12); // Limite initiale d'utilisateurs affichés
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [myPersonality, setMyPersonality] = useState(null)

    const [searchQuery, setSearchQuery] = useState(""); // Recherche
    const [filters, setFilters] = useState({
        minAge: "",
        maxAge: "",
        gender: "",
        quizCompleted: false,
        personalityMatching:false
    });

    const getCookie = (cookieName) => {
        const cookies = document.cookie.split("; ").reduce((acc, current) => {
            const [key, value] = current.split("=");
            acc[key] = value;
            return acc;
        }, {});
        return cookies[cookieName];
    };

    useEffect(() => {
        const connectedUserId = getCookie("userId");
        console.log("Connected User ID:", connectedUserId); // Vérification

        // Fetch users depuis le backend
        fetch("http://localhost:8762/user-security-service/api/users")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                return response.json();
            })
            .then((data) => {
                // console.log("Fetched Users:", data); // Vérification des utilisateurs
                data.filter(u => {
                    if(u.id === parseInt(Cookies.get("userId"))) {
                        setMyPersonality(u.personality)
                        console.log("meeee"+u.personality)
                    }
                } )
                // Filtrer les utilisateurs pour exclure l'utilisateur connecté
                const filtered = data.filter(
                    (user) => String(user.id) !== String(connectedUserId)
                );
                setUsers(filtered);
                setFilteredUsers(filtered);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        console.log(myPersonality)
    }, [myPersonality]);

    // Fonction pour appliquer les filtres
    const applyFilters = () => {
        const { minAge, maxAge, gender, quizCompleted,personalityMatching } = filters;

        console.log("Applying filters:", filters);  // Log the applied filters

        const filtered = users.filter((user) => {
            const matchesSearch =
                user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesAge =
                (!minAge || user.age >= parseInt(minAge)) &&
                (!maxAge || user.age <= parseInt(maxAge));
            const matchesGender = !gender || user.gender === gender;
            const isQuizCompleted = !quizCompleted || user.personality;
            const personalitiesMatching = !personalityMatching || user.personality === myPersonality

            return matchesSearch && matchesAge && matchesGender && isQuizCompleted && personalitiesMatching;
        });

        console.log("Filtered Users:", filtered);  // Log the filtered users

        setFilteredUsers(filtered);
        onClose(); // Fermer le modal après application des filtres
    };


    // Fonction pour appliquer la recherche
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        const filtered = users.filter((user) => {
            return (
                user.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                user.lastName.toLowerCase().includes(e.target.value.toLowerCase())
            );
        });
        setFilteredUsers(filtered);
    };

    if (isLoading) {
        return (
            <Center minH="100vh">
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='pink.500'
                    size='xl'
                />
            </Center>
        );
    }

    return (
        <>
            {/* <Header /> */}
            <Box maxW="8xl" mx="auto" mt={10} px={6}>
                {/* Barre de recherche et de filtres */}
                <HStack spacing={4} justifyContent="space-between" mb={8}>
                    <Box  mt={10} px={6}>
                        {/* Barre de recherche et de filtres */}
                        <HStack spacing={4} justifyContent="flex-start" mb={8}>
                            <Box flex="1" maxW="300px">
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <FiSearch color="gray.400" />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        bg="white"
                                        boxShadow="sm"
                                        borderRadius="full"
                                        _focus={{ boxShadow: "outline" }}
                                    />
                                </InputGroup>
                            </Box>
                        </HStack>

                    </Box>

                    <HStack spacing={4}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rightIcon={<FiChevronDown />}
                                variant="outline"
                                _hover={{ bg:'blackAlpha.100', }} _active={{ bg: 'blackAlpha.100', }}
                            >
                                Sort by...
                            </MenuButton>
                            <MenuList px={3} minW={"200px"} borderRadius="xl" shadow={'2xl'} >
                                <MenuItem as={Button}  _hover={{ bg:'blackAlpha.50', }} _active={{ bg: 'blackAlpha.50', }} fontWeight={'500'} fontSize="sm" justifyContent={'start'} onClick={() => setFilteredUsers([...users])}>
                                    Default
                                </MenuItem>
                                <MenuItem
                                    as={Button}  _hover={{ bg:'blackAlpha.50', }} _active={{ bg: 'blackAlpha.50', }} justifyContent={'start'} fontWeight={'500'} fontSize="sm"
                                    onClick={() =>
                                        setFilteredUsers(
                                            [...filteredUsers].sort((a, b) => a.age - b.age)
                                        )
                                    }
                                >
                                    Age (Ascending)
                                </MenuItem>
                                <MenuItem
                                    as={Button}  _hover={{ bg:'blackAlpha.50', }} justifyContent={'start'} _active={{ bg: 'blackAlpha.50', }} fontWeight={'500'} fontSize="sm"
                                    onClick={() =>
                                        setFilteredUsers(
                                            [...filteredUsers].sort((a, b) => b.age - a.age)
                                        )
                                    }
                                >
                                    Age (Descending)
                                </MenuItem>
                            </MenuList>
                        </Menu>

                        <Button
                            leftIcon={<MdFilterListAlt size={20}/>}
                            variant="solid"
                            colorScheme="pink"
                            onClick={onOpen}
                        >
                            More filters
                        </Button>
                    </HStack>
                </HStack>

                {/* Grid des utilisateurs filtrés */}
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} mb={16}>
                    {filteredUsers.slice(0,visibleCount).map((user, index) => {
                        console.log('Sending myPersonality to UserCard:', myPersonality); // Log myPersonality value before passing
                        return <UserCard user={user} myPersonality={myPersonality} key={index} />;
                    })}
                </SimpleGrid>


                {/* Bouton "Show More" */}
                {visibleCount < filteredUsers.length && (
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
                        >
                            Show more
                        </Button>
                    </Center>
                )}
            </Box>

            <Box mt={8}>
                {/* <Footer /> */}
            </Box>

            {/* Modal des filtres */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent borderRadius="2xl" shadow={'2xl'}>
                    <ModalHeader>Filters</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Minimum Age</FormLabel>
                            <Input
                                type="number"
                                placeholder="Enter minimum age"
                                focusBorderColor='pink.400'
                                value={filters.minAge}
                                onChange={(e) =>
                                    setFilters({ ...filters, minAge: e.target.value })
                                }
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Maximum Age</FormLabel>
                            <Input
                                type="number"
                                placeholder="Enter maximum age"
                                focusBorderColor='pink.400'
                                value={filters.maxAge}
                                onChange={(e) =>
                                    setFilters({ ...filters, maxAge: e.target.value })
                                }
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Gender</FormLabel>
                            <Select
                                placeholder="Select gender"
                                focusBorderColor='pink.400'
                                value={filters.gender}
                                onChange={(e) =>
                                    setFilters({ ...filters, gender: e.target.value })
                                }
                            >
                                <option value="H">Male</option>
                                <option value="F">Female</option>
                            </Select>
                        </FormControl>

                        <FormControl display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <FormLabel htmlFor="isVerified" mb="0">
                                Only Show  Users Who Completed The Quiz
                            </FormLabel>
                            <Switch
                                id="isVerified"
                                colorScheme="pink"
                                size="lg"
                                isChecked={filters.quizCompleted}
                                onChange={(e) =>
                                    setFilters({ ...filters, quizCompleted: e.target.checked })
                                }
                            />
                        </FormControl>

                        <FormControl display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <FormLabel htmlFor="isVerified" mb="0">
                                Filter By Personality
                            </FormLabel>
                            <Switch
                                id="isVerified"
                                colorScheme="pink"
                                size="lg"
                                isChecked={filters.personalityMatching}
                                onChange={(e) =>
                                    setFilters({ ...filters, personalityMatching: e.target.checked })
                                }
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="pink" mr={3} onClick={applyFilters}>
                            Apply
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UsersList;
