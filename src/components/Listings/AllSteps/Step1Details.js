import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Divider,
    Badge,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Input,
    VStack,
    Heading,
    InputLeftElement,
    InputGroup,
    InputRightElement,
    Skeleton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Image,
    Text, Select,
} from "@chakra-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

const Step1Details = ({ formData, updateFormData }) => {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);

    // Fetch countries and flags on component mount
    useEffect(() => {
        const fetchCountries = async () => {
            setLoadingCountries(true);
            try {
                const response = await fetch(
                    "https://countriesnow.space/api/v0.1/countries/flag/images"
                );
                const data = await response.json();
                setCountries(data.data || []);
            } catch (error) {
                console.error("Error fetching countries:", error);
            } finally {
                setLoadingCountries(false);
            }
        };

        fetchCountries();
    }, []);


    useEffect(() => {
        if(formData.address.country && formData.address.country !== ""){
            fetchCities(formData.address.country);
        }
    }, []);


    // Fetch cities based on selected country
    const fetchCities = async (country) => {
        setLoadingCities(true);
        try {
            const response = await fetch(
                "https://countriesnow.space/api/v0.1/countries/cities",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ country }),
                }
            );
            const data = await response.json();
            setCities(data.data || []);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoadingCities(false);
        }
    };

    const handleCountrySelect = (country) => {
        updateFormData("address", { ...formData.address, country, city: "" });
        if (country) {
            fetchCities(country);
        } else {
            setCities([]);
        }
    };

    return (
        <Container
            maxW="900px"
            mb={40}
            w={"70vw"}
            py={6}
            px={0}
            shadow="md"
            border="1px solid"
            borderColor="blackAlpha.200"
            borderRadius="xl"
            bgColor="white"
        >
            <Heading px={9} color="blackAlpha.500" size="md">
                INFOS:
            </Heading>
            <Divider mt={7} mb={5} />
            <VStack px={9} spacing={5}>
                <HStack spacing={9} w="full">
                    <FormControl isInvalid={formData.address.country === ""}>
                        <FormLabel>Country</FormLabel>
                        {loadingCountries ? (
                            <Skeleton bgColor="blackAlpha.50" height="40px" borderRadius="lg" />
                        ) : (
                            <Menu >
                                <MenuButton
                                    as={Button}
                                    rightIcon={<ChevronDownIcon />}
                                    w="full"
                                    bgColor="#FBFBFB"
                                    border="2px solid "
                                    _hover={{borderColor:"pink.500"}}
                                    textAlign={"start"}
                                    borderColor={formData.address.country === ""?"#E53E3E":"gray.100"}
                                    borderRadius="lg"
                                >
                                    {formData.address.country || "Select a country"}
                                </MenuButton>
                                <MenuList maxH="300px" overflowY="auto">
                                    {countries.map((country) => (
                                        <MenuItem
                                            key={country.iso3}
                                            onClick={() => handleCountrySelect(country.name)}
                                        >
                                            <HStack>
                                                <Image
                                                    boxSize="20px"
                                                    src={country.flag}
                                                    alt={country.name}
                                                />
                                                <Text>{country.name}</Text>
                                            </HStack>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        )}
                    </FormControl>

                    <FormControl isInvalid={formData.address.city === ""}>
                        <FormLabel>City</FormLabel>
                        {loadingCities ? (
                            <Skeleton bgColor="blackAlpha.50" height="40px" borderRadius="lg" />
                        ) : (
                            <Select
                                placeholder="Select a city"
                                focusBorderColor="pink.500"
                                bgColor="#FBFBFB"
                                borderRadius="lg"
                                isDisabled={!formData.address.country}
                                value={formData.address.city}
                                onChange={(e) =>
                                    updateFormData("address", {
                                        ...formData.address,
                                        city: e.target.value,
                                    })
                                }
                            >
                                {cities.map((city, index) => (
                                    <option key={index} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </FormControl>
                </HStack>
                <FormControl isInvalid={formData.address.street === ""}>
                    <FormLabel>Street</FormLabel>
                    <Input
                        focusBorderColor="pink.500"
                        type="text"
                        bgColor="#FBFBFB"
                        placeholder="Type the street..."
                        borderRadius="lg"
                        value={formData.address.street}
                        onChange={(e) =>
                            updateFormData("address", {
                                ...formData.address,
                                street: e.target.value,
                            })
                        }
                    />
                </FormControl>
            </VStack>
            <Divider mt={7} mb={5}  />
            <HStack spacing={9} px={9}>
                <Box w='full'>
                    <FormLabel>Monthly rent</FormLabel>
                    <InputGroup >
                        <InputLeftElement pointerEvents='none' color='blackAlpha.700' fontSize='1.2em' fontWeight='semibold'>
                            $
                        </InputLeftElement>
                        <Input focusBorderColor='pink.500'
                               isInvalid={formData.price > 0}
                               type="number"
                               borderRadius='lg'
                               bgColor='#FBFBFB'
                               value={formData.price}
                               onChange={(e) => updateFormData("price", parseFloat(e.target.value))}
                        />
                        <InputRightElement>
                            <CheckIcon color='green.500' />
                        </InputRightElement>
                    </InputGroup>
                </Box>


            </HStack>
            <Divider mt={7} mb={5}  />
            <FormControl px={9} isInvalid={formData.availableFrom === ''}>
                <FormLabel>Available date</FormLabel>
                <Input focusBorderColor='pink.500'
                       type="date"
                       bgColor='#FBFBFB'
                       borderRadius='lg'
                       value={formData.availableFrom}
                       onChange={(e) => updateFormData("availableFrom", e.target.value)}
                />
                <HStack spacing={2} mt={4} >
                    <Badge colorScheme='purple' px='6px' borderRadius='lg'  >TIP</Badge>
                    <FormHelperText  color='purple.600' fontWeight='seminbold' >
                        Your listing will be deactivated shortly after the available date has passed
                    </FormHelperText>
                </HStack>

            </FormControl>
            <Divider mt={7} mb={5}  />
            <FormControl px={9} >
                <FormLabel>Duration</FormLabel>
                <Select focusBorderColor='pink.500'
                        type="date"
                        bgColor='#FBFBFB'
                        placeholder="select duration..."
                        value={formData.duration}
                        onChange={(e) => updateFormData("duration", e.target.value)}
                        borderRadius='lg'
                >
                    <option value='FLEXIBLE'>FLEXIBLE</option>
                    <option value='TWELVE_MONTHS'>12 MONTHS</option>
                    <option value='FIXED'>FIXED</option>
                </Select>
                <Box>
                    <HStack spacing={2} mt={4} >
                        <Badge colorScheme='purple' px='6px' borderRadius='lg'  >FLEXIBLE</Badge>
                        <FormHelperText  color='purple.600' fontWeight='seminbold' >
                            The move-out date is kept open, can be discussed in person
                        </FormHelperText>
                    </HStack>
                    <HStack spacing={2} mt={4} >
                        <Badge colorScheme='purple' px='6px' borderRadius='lg'  >12 MONTHS</Badge>
                        <FormHelperText  color='purple.600' fontWeight='seminbold' >
                            A commitment of at least 12 months is required
                        </FormHelperText>
                    </HStack>
                    <HStack spacing={2} mt={4} >
                        <Badge colorScheme='purple' px='6px' borderRadius='lg'  >FIXED</Badge>
                        <FormHelperText  color='purple.600' fontWeight='seminbold' >
                            Needs to fit within a specific timeframe, ex: Aug 1 - Dec 15
                        </FormHelperText>
                    </HStack>
                </Box>
            </FormControl>
            {
                formData.duration === 'FIXED' &&
                <Box>
                    <Divider mt={7} mb={5}  />
                    <FormControl px={9} isInvalid={formData.availableTo === ''}>
                        <FormLabel>Move out date</FormLabel>
                        <Input focusBorderColor='pink.500'
                               min={Date.now()}
                               type="date"
                               bgColor='#FBFBFB'
                               borderRadius='lg'

                               value={formData.availableTo}
                               onChange={(e) => updateFormData("availableTo", e.target.value)}
                        />
                    </FormControl>
                </Box>
            }


        </Container>
    );
};

export default Step1Details;
