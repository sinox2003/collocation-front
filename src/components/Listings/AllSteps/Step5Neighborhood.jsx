import {
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Text,
    VStack
} from "@chakra-ui/react";
import { TextEditor } from "./Text-Editor";
import React from "react";
import Rating from "./Rating";

export default function Step5Neighborhood({ formData, updateFormData }) {
    // const handleRatingChange = (element, value) => {
    //     const keys = element.split('.');
    //     const updatedFormData = { ...formData };
    //
    //     let currentLevel = updatedFormData;
    //     for (let i = 0; i < keys.length - 1; i++) {
    //         currentLevel = currentLevel[keys[i]];
    //     }
    //
    //     currentLevel[keys[keys.length - 1]] = value;
    //     updateFormData(updatedFormData);
    // };

    return (
        <VStack spacing={5} mb={40}>
            <Container
                maxW="900px"
                w={"70vw"}
                py={6}
                shadow="md"
                border="1px solid"
                borderColor="blackAlpha.200"
                borderRadius="xl"
                bgColor="white"
                px={0}
            >
                <Heading px={9} color="blackAlpha.500" size="md">
                    NEIGHBORHOOD REVIEW :
                </Heading>

                <Divider mt={7} mb={5} />
                <Box px={9} spacing={9}>
                    <HStack spacing={2} mt={4} mb={2}>
                        <Badge colorScheme='purple' px='6px' borderRadius='lg'>PROMPTS</Badge>
                        <Text color='purple.600' fontWeight='seminbold'>
                            Give us a description about the neighborhood?
                        </Text>
                    </HStack>

                    <TextEditor formData={formData.neighborhoodDescription} updateFormData={updateFormData} field={'neighborhoodDescription'} />
                    <HStack spacing={2} my={4}>
                        <Badge colorScheme='purple' px='6px' borderRadius='lg'>TIP</Badge>
                        <Text color='purple.600' fontWeight='seminbold'>
                            The Correct AI button triggers an AI that corrects spelling and grammar mistakes
                        </Text>
                    </HStack>
                </Box>
            </Container>

            {/*<Container*/}
            {/*    maxW="900px"*/}
            {/*    w={"70vw"}*/}
            {/*    py={6}*/}
            {/*    mb={40}*/}
            {/*    shadow="md"*/}
            {/*    border="1px solid"*/}
            {/*    borderColor="blackAlpha.200"*/}
            {/*    borderRadius="xl"*/}
            {/*    bgColor="white"*/}
            {/*    px={0}*/}
            {/*>*/}
            {/*    <Heading px={9} color="blackAlpha.500" size="md">*/}
            {/*        NEIGHBORHOOD RATING :*/}
            {/*    </Heading>*/}

            {/*    <Divider mt={7} mb={5} />*/}
            {/*    <Grid templateRows='repeat(4, 2fr)' templateColumns='repeat(2, 1fr)' gap={8} pb={6} px={9} >*/}

            {/*            <GridItem w='full' spacing={7} >*/}
            {/*                <Heading size="md" >Food:</Heading>*/}
            {/*            </GridItem>*/}
            {/*        <GridItem>*/}
            {/*                <Rating rating={formData.neighborhood.food} updateFormData={handleRatingChange} element={'neighborhood.food'} />*/}
            {/*            </GridItem>*/}
            {/*            <GridItem w='full' spacing={7}>*/}
            {/*                <Heading size="md" >Safety:</Heading>*/}
            {/*            </GridItem>*/}
            {/*        <GridItem>*/}
            {/*                <Rating rating={formData.neighborhood.safety} updateFormData={handleRatingChange} element={'neighborhood.safety'} />*/}
            {/*            </GridItem>*/}
            {/*            <GridItem w='full' spacing={7}>*/}
            {/*                <Heading size="md" >Public Transport:</Heading>*/}
            {/*            </GridItem>*/}
            {/*        <GridItem>*/}
            {/*                <Rating rating={formData.neighborhood.public_transport} updateFormData={handleRatingChange} element={'neighborhood.public_transport'} />*/}
            {/*            </GridItem>*/}
            {/*            <GridItem w='full' spacing={7}>*/}
            {/*                <Heading size="md" >Cleanliness:</Heading>*/}
            {/*            </GridItem>*/}
            {/*        <GridItem>*/}
            {/*                <Rating rating={formData.neighborhood.cleanliness} updateFormData={handleRatingChange} element={'neighborhood.cleanliness'} />*/}
            {/*            </GridItem>*/}

            {/*    </Grid>*/}
            {/*</Container>*/}
            <Flex w='full'  justifyContent='right' >

                <Button   shadow='lg' border={'1px solid'} borderColor={'blackAlpha.200'} _hover={{backgroundColor:'whiteAlpha.500'}} backgroundColor='white' borderRadius='3xl'>Save and close</Button>
            </Flex>
        </VStack>
    );
}
