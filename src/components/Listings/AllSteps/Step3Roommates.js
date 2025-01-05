import React, { useState, useEffect } from "react";
import {
    Badge,
    Box,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Text,
    VStack,
} from "@chakra-ui/react";

const Step3Roommates = ({ formData, updateFormData }) => {
    const [previousSituation, setPreviousSituation] = useState(formData.situation);

    useEffect(() => {
        if (formData.situation === "LIVE_ROOMMATE" && previousSituation !== "LIVE_ROOMMATE") {
            updateFormData("numberOfRoommates", Math.max(0, formData.numberOfRoommates + 1));
        } else if (formData.situation !== "LIVE_ROOMMATE" && previousSituation === "LIVE_ROOMMATE") {
            updateFormData("numberOfRoommates", Math.max(0, formData.numberOfRoommates - 1));
        }
        setPreviousSituation(formData.situation);
    }, [formData.situation, previousSituation, formData.numberOfRoommates, updateFormData]);

    return (
        <VStack spacing={5} mb={40}>
            <Container
                maxW="900px"
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
                    ROOMMATE PREFERENCES :
                </Heading>

                <HStack spacing={2} px={9} mt={4} mb={2}>
                    <Badge colorScheme="purple" px="6px" borderRadius="lg">
                        TIP
                    </Badge>
                    <Text color="purple.600" fontWeight="seminbold">
                        The system will automatically filter results based on your
                        personality and preferences here
                    </Text>
                </HStack>

                <Divider mt={7} mb={5} />
                <HStack px={9} spacing={9}>
                    <FormControl>
                        <FormLabel>Min age</FormLabel>
                        <NumberInput
                            w="full"
                            value={formData.minAge}
                            focusBorderColor="pink.500"
                            borderRadius="lg"
                            bgColor="#FBFBFB"
                            onChange={(valueString) => updateFormData("minAge", parseInt(valueString))}
                            min={10}
                            max={100}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Max age</FormLabel>
                        <NumberInput
                            w="full"
                            value={formData.maxAge}
                            focusBorderColor="pink.500"
                            borderRadius="lg"
                            bgColor="#FBFBFB"
                            onChange={(valueString) => updateFormData("maxAge", parseInt(valueString))}
                            min={10}
                            max={100}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </HStack>
                <Divider mt={7} mb={5} />
                <HStack px={9} spacing={9}>
                    <FormControl>
                        <FormLabel>Gender</FormLabel>
                        <Select
                            focusBorderColor="pink.500"
                            borderRadius="lg"
                            bgColor="#FBFBFB"
                            value={formData.gender}
                            placeholder="select gender..."

                            onChange={(e) => updateFormData('gender', e.target.value)}
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </Select>
                    </FormControl>
                </HStack>
            </Container>
            <Container
                maxW="900px"
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
                    CURRENT ROOMMATES :
                </Heading>

                <Divider mt={7} mb={5} />

                <FormControl px={9}>
                    <FormLabel>Current situation</FormLabel>
                    <Select
                        bgColor="#FBFBFB"
                        focusBorderColor="pink.500"
                        borderRadius="lg"
                        placeholder="Select current situation... "
                        value={formData.situation}
                        onChange={(e) => updateFormData('situation', e.target.value)}
                    >
                        <option value="NOT_LIVE_NO_PLAN">
                            I don't live here, and don't plan to in the future
                        </option>
                        <option value="NOT_LIVE_YET_PLAN">
                            I don't live here yet, but am planning to move in soon
                        </option>
                        <option value="LIVE_MOVE_OUT">
                            I live here currently, but will move out before new renter moves
                            in
                        </option>
                        <option value="LIVE_ROOMMATE">
                            I live here currently, and will be roommates with the new renter
                        </option>
                    </Select>
                </FormControl>
                <Box px={9} py={5}>
                    <FormControl>
                        <FormLabel>Number of roommates</FormLabel>
                        <NumberInput
                            w="full"
                            value={formData.numberOfRoommates}
                            focusBorderColor="pink.500"
                            borderRadius="lg"
                            bgColor="#FBFBFB"
                            onChange={(valueString) => updateFormData("numberOfRoommates", parseInt(valueString))}
                            min={0}
                            max={10}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                    <HStack spacing={2} mt={4} mb={2}>
                        <Badge colorScheme='purple' px='6px' borderRadius='lg'>REMINDER</Badge>
                        <Text color='purple.600' fontWeight='seminbold'>
                            Don't include yourself in the number of roommates?
                        </Text>
                    </HStack>
                </Box>
            </Container>
        </VStack>
    );
};

export default Step3Roommates;
