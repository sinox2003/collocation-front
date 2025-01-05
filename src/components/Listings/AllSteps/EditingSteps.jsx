import React, { useEffect, useState } from "react";
import Step1Details from "./Step1Details";
import Step2Layout from "./Step2Layout";
import Step3Roommates from "./Step3Roommates";
import Step4Images from "./Step4Images";
import {
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    Stepper,
    StepStatus,
    StepTitle,
    useSteps,
    Box,
    StepSeparator,
    VStack,
    Container,
    Button, Center, Spinner,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import AnnonceService from "../../../services/AnnoncesService";
import Step4ImagesEditing from "./Step4ImagesEditing";

const steps = [
    { title: "First", description: "Infos" },
    { title: "Second", description: "Details" },
    { title: "Third", description: "Roommates" },
    { title: "Fourth", description: "Images" },
];

const EditingSteps = () => {
    const { annonceId } = useParams();
    const userId = Cookies.get("userId");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: "",
        description: "",
        price: 0,
        photos: [],
        address: {
            id: "",
            city: "",
            street: "",
            country: "",
            longitude: null,
            latitude: null,
        },
        user: {
            email: "",
            username: "",
            lastName: "",
            id: "",
            firstName: "",
            age: null,
            personality: null,
        },
        availableFrom: null,
        availableTo: null,
        numberOfRoommates: 0,
        statusAnnonce: "",
        propertyType: "",
        views: 0,
        createdAt: null,
        updatedAt: null,
        duration: "",
        layoutType: "",
        bedrooms: 0,
        bathrooms: 0,
        situation: "",
        amenities: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { activeStep, setActiveStep } = useSteps({
        index: 0,
        count: steps.length,
    });

    useEffect(() => {
        const fetchAnnonceData = async () => {
            if (!Number.isInteger(Number(annonceId)) || Number(annonceId) <= 0) {
                navigate("/home");

                return;
            }

            try {
                const data = await AnnonceService.getAnnonceById(parseInt(annonceId, 10));
                console.log(data.getAnnonceById)

                if (!data?.getAnnonceById || data.getAnnonceById.user?.id !== userId) {
                    navigate("/home");
                    console.log(data.getAnnonceById)

                    return;
                }
                setFormData(data.getAnnonceById);
                console.log(formData)
            } catch (err) {
                console.error("Error fetching annonce:", err);
                setError("Failed to fetch data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnnonceData();
    }, [annonceId, navigate, userId]);

    if (loading) {
        return <Center h="calc(100vh - 200px)"><Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='pink.500'
            size='xl'
        /></Center>; // Show loading state until data is fetched
    }

    if (error) {
        return <Box color="red.500">{error}</Box>; // Optionally display error message
    }






        const validateStep = (stepIndex) => {
            if (!formData) return false; // Return invalid if formData is null or undefined

            const validations = [
                () => {
                    const { address, price, duration, availableFrom } = formData || {};
                    return (
                        address?.country &&
                        address?.city &&
                        address?.street &&
                        price > 0 &&
                        duration &&
                        availableFrom
                    );
                },
                () => {
                    const { layoutType, bedrooms, bathrooms, propertyType, description } = formData || {};
                    return (
                        layoutType &&
                        bedrooms >= 0 &&
                        bathrooms > 0 &&
                        propertyType &&
                        description
                    );
                },
                () => {
                    const { numberOfRoommates, minAge, maxAge, gender, situation } = formData || {};
                    return (
                        numberOfRoommates >= 0 &&
                        minAge >= 18 &&
                        maxAge >= minAge &&
                        gender &&
                        situation
                    );
                },
                () => true,
            ];

            return validations[stepIndex]();
        };


    const permissionToNextStep = () => !validateStep(activeStep);



    const updateFormData = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const nextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        }
    };

    const previousStep = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    };

    return (
        <Box w="full" h="full" minH="100vh" bgColor="#F7F7F7">
            <Container maxW="900px" px={0} w="70vw">
                <VStack spacing={8}>
                    <Stepper
                        display={{ base: "none", md: "flex" }}
                        colorScheme="pink"
                        gap={3}
                        w="full"
                        mt="60px"
                        index={activeStep}
                    >
                        {steps.map((step, index) => (
                            <Step key={index} onClick={() => setActiveStep(index)}>
                                <StepIndicator>
                                    <StepStatus
                                        complete={<StepIcon />}
                                        incomplete={<StepNumber />}
                                        active={<StepNumber />}
                                    />
                                </StepIndicator>
                                <Box flexShrink="0">
                                    <StepTitle>{step.title}</StepTitle>
                                    <StepDescription>{step.description}</StepDescription>
                                </Box>
                                <StepSeparator style={{ width: "100%", height: "2px" }} />
                            </Step>
                        ))}
                    </Stepper>

                    <Box w="full">
                        {activeStep > 0 && (
                            <Button
                                float="left"
                                colorScheme="blackAlpha"
                                bgColor="#CACACA"
                                onClick={previousStep}
                            >
                                Back
                            </Button>
                        )}

                        {steps[activeStep + 1] && (
                            <Button
                                colorScheme="pink"
                                isDisabled={permissionToNextStep()}
                                float="right"
                                onClick={nextStep}
                            >
                                Next: {steps[activeStep + 1].description}
                            </Button>
                        )}
                    </Box>

                    <Box w="fit-content">
                        {activeStep === 0 && <Step1Details formData={formData} updateFormData={updateFormData} />}
                        {activeStep === 1 && <Step2Layout formData={formData} updateFormData={updateFormData} />}
                        {activeStep === 2 && <Step3Roommates formData={formData} updateFormData={updateFormData} />}
                        {activeStep === 3 && <Step4ImagesEditing formData={formData} updateFormData={updateFormData} />}
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default EditingSteps;
