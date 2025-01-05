import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    Select,
    VStack,
    HStack,
    Spinner,
    useToast,
} from "@chakra-ui/react";
import { MdGraphicEq } from "react-icons/md";
import { TextEditor } from "../../Listings/AllSteps/Text-Editor";
import axios from "axios";
import Cookies from "js-cookie";

export const UserRequest = () => {
    const [formData, setFormData] = useState({
        id: null,
        locations: "",
        requestedDate: "",
        minPrice: 0,
        maxPrice: 50000,
        description: "",
    });
    const [loading, setLoading] = useState(true); // Page loading state
    const [updateLoading, setUpdateLoading] = useState(false); // Button loading state
    const [isDisabled, setIsDisabled] = useState(true); // Disable save button
    const toast = useToast(); // Chakra UI's toast

    useEffect(() => {
        const userId = Cookies.get("userId");
        if (userId) {
            axios
                .get(`http://localhost:8762/user-security-service/api/users/user-preference/${userId}`)
                .then((response) => {
                    const data = response.data;
                    setFormData({
                        id: data.id || null,
                        locations: data.locations || "",
                        requestedDate: data.requestedDate || "",
                        minPrice: data.minPrice || 0,
                        maxPrice: data.maxPrice || 20000,
                        description: data.description || "",
                    });
                })
                .catch((error) => {
                    console.error("Error fetching user preferences:", error);
                    toast({
                        title: "Error",
                        description: "Failed to fetch user preferences.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [toast]);

    // Check if all fields are empty or at default values
    useEffect(() => {
        const areFieldsEmpty =
            !formData.locations ||
            !formData.requestedDate ||
            formData.minPrice < 0 ||
            formData.maxPrice > 20000 ||
            !formData.description || formData.description === "<p><br></p>" ;
            console.log(!formData.locations ,
                !formData.requestedDate ,
                formData.minPrice < 0 ,
                formData.maxPrice > 20000 ,
                !formData.description)
        console.log(formData.description )
        setIsDisabled(areFieldsEmpty);
    }, [formData]);

    const handleSliderChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            minPrice: value[0],
            maxPrice: value[1],
        }));
    };

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        setUpdateLoading(true);
        axios
            .put("http://localhost:8762/user-security-service/api/user-preferences/update", formData)
            .then(() => {
                toast({
                    title: "Success",
                    description: "Preferences updated successfully!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            })
            .catch((error) => {
                console.error("Error updating preferences:", error);
                toast({
                    title: "Error",
                    description: "Failed to update preferences.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            })
            .finally(() => {
                setUpdateLoading(false);
            });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="pink.500"
                    size="xl"
                />
            </Box>
        );
    }

    return (
        <Box py={16}>
            <Box
                maxW="4xl"
                mx="auto"
                p={8}
                bg="white"
                border="1px solid"
                borderColor="blackAlpha.200"
                shadow="xl"
                borderRadius="xl"
            >
                <Heading fontSize="3xl" fontWeight="bold" textAlign="center" mb={6}>
                    Complete Preferences
                </Heading>
                <VStack spacing={5}>
                    <FormControl>
                        <FormLabel>Location</FormLabel>
                        <Input
                            focusBorderColor="pink.500"
                            placeholder="Where are you looking?"
                            value={formData.locations}
                            onChange={(e) => handleChange("locations", e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Date</FormLabel>
                        <Select
                            focusBorderColor="pink.500"
                            placeholder="Select requested date"
                            value={formData.requestedDate}
                            onChange={(e) => handleChange("requestedDate", e.target.value)}
                        >
                            <option value="ASAP">As Soon As Possible</option>
                            <option value="URGENT">Urgent (This week)</option>
                            <option value="NOT_URGENT">Not Urgent</option>
                        </Select>
                    </FormControl>



                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <TextEditor formData={formData.description} updateFormData={handleChange} field={"description"} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Price Range</FormLabel>
                        <RangeSlider
                            aria-label={["min", "max"]}
                            defaultValue={[formData.minPrice, formData.maxPrice]}
                            min={0}
                            max={20000}
                            onChange={handleSliderChange}
                        >
                            <RangeSliderTrack bg="red.100">
                                <RangeSliderFilledTrack bg="tomato" />
                            </RangeSliderTrack>
                            <RangeSliderThumb boxSize={6} index={0}>
                                <Box color="tomato" as={MdGraphicEq} />
                            </RangeSliderThumb>
                            <RangeSliderThumb boxSize={6} index={1}>
                                <Box color="tomato" as={MdGraphicEq} />
                            </RangeSliderThumb>
                        </RangeSlider>
                        <Box mt={2}>
                            <strong>Min Price:</strong> ${formData.minPrice} &nbsp;&nbsp;
                            <strong>Max Price:</strong> ${formData.maxPrice}
                        </Box>
                    </FormControl>
                    <HStack justifyContent="end" w="full" spacing={4} mt={4}>
                        <Button
                            px={5}
                            colorScheme="green"
                            onClick={handleSubmit}
                            isLoading={updateLoading}
                            isDisabled={isDisabled} // Disable the button if fields are empty
                        >
                            Save Preferences
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setFormData({
                                    id: null,
                                    locations: "",
                                    requestedDate: "",
                                    minPrice: 0,
                                    maxPrice: 50000,
                                    description: "",
                                })
                            }
                        >
                            Reset
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Box>
    );
};
