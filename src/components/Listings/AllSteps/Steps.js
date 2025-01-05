import React, {useEffect, useState} from "react";
import Step1Details from "./Step1Details";
import Step2Layout from "./Step2Layout";
import Step3Roommates from "./Step3Roommates";
import Step4Images from "./Step4Images";
import {
  Step,
  StepDescription, StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepStatus,
  StepTitle,
  useSteps,
  Box, StepSeparator, Flex, Center, Heading, Button, Spacer, VStack, Container, HStack, IconButton
} from "@chakra-ui/react";
import {SeparatorHorizontal} from "lucide-react";
import Header from "../../layout/Header";
import Step5Neighborhood from "./Step5Neighborhood";
import {CgClose} from "react-icons/cg";
import Cookies from "js-cookie";

const steps = [
  { title: 'First', description: 'Infos' },
  { title: 'Second', description: 'Details' },
  { title: 'Third', description: 'Roommates' },
  { title: 'Fourth', description: 'Images' },
  // { title: 'Fifth', description: 'Neighborhood' },
]


const Steps = () => {
  // const [step, setStep] = useState(1);
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })
  const [formData, setFormData] = useState({
    address: {
      country:"",
      city:"",
      street:""
    },  // Assuming address will be an object, similar to the Address entity
    description: "",
    price: 0,
    photos: [],
    userID: Cookies.get("userId"),  // Assuming userId will be a Long
    layoutType: "",  // Assuming layoutType will be a string representing the enum
    duration: "",  // Assuming duration will be a string representing the enum
    bedrooms: -1 ,
    bathrooms: 0,
    propertyType: "",  // Assuming propertyType will be a string representing the enum
    availableFrom: "",  // Assuming availableFrom will be a date string in "yyyy-MM-dd" format
    availableTo: "",  // Assuming availableTo will be a date string in "yyyy-MM-dd" format
    numberOfRoommates: 0,
    statusAnnonce: "",  // Assuming statusAnnonce will be a string representing the enum
    amenities:[],
    minAge: 18,
    maxAge: 99,
    gender: "",
    situation: "",  // Assuming situation will be a string representing the enum
   });



  const add = ()=>{
    if (activeStep < steps.length){
      if(!permissionToNextStep()){
        setActiveStep(prevState => prevState + 1);
      }
    }
  }

  const permissionToNextStep = () => {
    if (activeStep === 0) {
      const { address, price, duration, availableFrom } = formData;

      // Disable button if any Step 0 field is invalid
      if (
          !address.country ||
          !address.city ||
          !address.street ||
          isNaN(price) || price <= 0 ||
          !duration ||
          !availableFrom ) {
        return true; // Disable the button
      }
    }

    if (activeStep === 1) {
      const { layoutType, bedrooms, bathrooms, propertyType, description } = formData;

      // Disable button if any Step 1 field is invalid
      if (
          !layoutType ||
          bedrooms < 0 ||
          bathrooms <= 0 ||
          !propertyType ||
          !description
      ) {
        return true; // Disable the button
      }
    }

    if (activeStep === 2) {
      const { numberOfRoommates, minAge, maxAge, gender, situation } = formData;

      // Disable button if any Step 2 field is invalid
      if (
          numberOfRoommates < 0 ||
          minAge < 18 ||
          maxAge < minAge ||
          !gender ||
          !situation
      ) {
        return true; // Disable the button
      }
    }

    return false; // Enable the button
  };


  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

const substract = ()=>{
  if (activeStep > 0){
      setActiveStep(prevState => prevState - 1);
  }
  }
  useEffect(() => {
    console.log(formData)
  }, [formData]);

  return (
      <Box  w='full' h='full' minH='100vh' bgColor="#F7F7F7"  >
        {/*<Box w='full' h='150px' bgColor='white' shadow='sm'>*/}
        {/*  <Container maxW='900px' px={0} w={'70vw'}  >*/}
        {/*    <HStack pt='30px'>*/}
        {/*      <Heading >*/}
        {/*        Create Listing*/}
        {/*      </Heading>*/}
        {/*      <Spacer />*/}
        {/*      <IconButton icon={<CgClose strokeWidth={1} size={25}/>}  variant='unstyled' isRound aria-label={"close"}/>*/}

        {/*    </HStack>*/}
        {/*  </Container>*/}
        {/*</Box>*/}

        <Container maxW='900px' px={0} w={'70vw'}>
          <VStack   spacing={8} >
            <Stepper display={{base:'none',md:'flex'}} colorScheme='pink'  gap={3} w={'full'} mt={'60px'} index={activeStep}  >
              {steps.map((step, index) => (

                    <Step key={index} onClick={() => setActiveStep(index)}>
                      <StepIndicator>
                        <StepStatus
                            complete={<StepIcon/>}
                            incomplete={<StepNumber/>}
                            active={<StepNumber/>}
                        />
                      </StepIndicator>

                      <Box flexShrink='0'>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDescription>{step.description}</StepDescription>

                      </Box>


                      <StepSeparator  style={{width:'100%',height:'2px'}} />

                    </Step>




              ))}
            </Stepper>
            <Box  w={'full'} >
              {
                  activeStep > 0 &&
                  <Button float='left'  colorScheme='blackAlpha' bgColor='#CACACA' onClick={substract}>Back</Button>
              }

              {steps[activeStep + 1] && <Button colorScheme='pink' isDisabled={permissionToNextStep()} float='right' onClick={add}>Next: {steps[activeStep + 1].description} </Button>}
            </Box>
            <Box w={'fit-content'} >




              {activeStep === 0 && (
                <Step1Details

                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {activeStep === 1 && (
                <Step2Layout


                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {activeStep === 2 && (
                <Step3Roommates


                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {activeStep === 3 && (
                <Step4Images

                  formData={formData}
                  updateFormData={updateFormData}
                />
              )}
              {/*{activeStep === 4 && (*/}
              {/*    <Step5Neighborhood*/}

              {/*        formData={formData}*/}
              {/*        updateFormData={updateFormData}*/}
              {/*    />*/}
              {/*)}*/}
            </Box>

          </VStack>

        </Container>

      </Box>
  );
};

export default Steps;
