import React, { useState } from "react";
import {
  Badge,
  Box, Button,
  Container,
  Divider, Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select, Spacer, Text, VStack
} from "@chakra-ui/react";
import {TextEditor} from "./Text-Editor";
import AmenitiesSelector from "./AmenitiesSelector";
import {BsStars} from "react-icons/bs";
const Step2Layout = ({  formData, updateFormData }) => {


  

  return (
<VStack spacing={5} mb={40} >

      <Container maxW='900px'  w={'70vw'}    py={6} px={0} shadow='md' border='1px solid' borderColor='blackAlpha.200' borderRadius='xl' bgColor='white'>
        <Heading px={9} color='blackAlpha.500' size='md'>
          LAYOUT :
        </Heading>
        <Divider mt={7} mb={5}  />
        <HStack px={9} spacing={9} >
          <FormControl >
            <FormLabel>Bedrooms</FormLabel>
            <Select focusBorderColor='pink.500'
                    type="number"
                    bgColor='#FBFBFB'
                    value={formData.bedrooms}
                    placeholder="select number of bedrooms..."

                    onChange={(e) => updateFormData("bedrooms", e.target.value)}
                    borderRadius='lg'
            >
              <option  value={0}>
                Studio
              </option>
                {
                  Array.from({length: 9}, (_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1 === 1 ? index + 1 + ' Bedroom' : index + 1 + ' Bedrooms'}
                      </option>
                  ))
                }


            </Select>
          </FormControl>

          <FormControl  >
            <FormLabel>Bathrooms</FormLabel>
            <Select focusBorderColor='pink.500'
                    type="number"
                    bgColor='#FBFBFB'
                    value={formData.bathrooms}
                    placeholder="select number of bathrooms..."

                    onChange={(e) => updateFormData("bathrooms", e.target.value)}
                    borderRadius='lg'

            >
              {
                Array.from({length: 9}, (_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1 === 1 ? index + 1 + ' Bath' : index + 1 + ' Baths'}
                    </option>
                ))
              }

            </Select>
          </FormControl>
        </HStack>
        <Divider mt={7} mb={5}  />
        <HStack px={9} spacing={9} >
          <FormControl >
            <FormLabel>Layout type</FormLabel>
            <Select focusBorderColor='pink.500'
                    type="date"
                    bgColor='#FBFBFB'
                    value={formData.layoutType}
                    placeholder="select layout type..."

                    onChange={(e) => updateFormData("layoutType", e.target.value)}
                    borderRadius='lg'
            >
              <option  value='ENTIRE_PLACE'> Entire Place </option>
              <option  value='PRIVATE_ROOM'> Private Room </option>
              <option  value='SHARED'> Shared Place </option>
             

            </Select>
          </FormControl>

          <FormControl  >
            <FormLabel>Property type</FormLabel>
            <Select focusBorderColor='pink.500'
                    type="date"
                    bgColor='#FBFBFB'
                    value={formData.propertyType}
                    placeholder="select property typ..."
                    onChange={(e) => updateFormData("propertyType", e.target.value)}
                    borderRadius='lg'
            >
              <option value='Apartement'> Apartment</option>
              <option value='House'> House</option>
              <option value='Co_living'> Co-living</option>
              <option value='Guesthouse'> Guesthouse</option>
              <option value='Condo'> Condo</option>
              <option value='Townhouse'> Townhouse</option>
              <option value='Basement'> Basement </option>

            </Select>
          </FormControl>
        </HStack>

      </Container>
  <Container maxW='900px'  w={'70vw'}    py={6} px={0} shadow='md' border='1px solid' borderColor='blackAlpha.200' borderRadius='xl' bgColor='white'>
    <Heading px={9} color='blackAlpha.500' size='md'>
      DESCRIPTION :
    </Heading>
    <Divider mt={7} mb={5}  />
    <Box px={9} spacing={9} >

        <HStack spacing={2} mt={4} mb={2} >
          <Badge colorScheme='purple' px='6px' borderRadius='lg'  >PROMPTS</Badge>
          <Text  color='purple.600' fontWeight='seminbold' >
            Give us a description about the house, facilities, roommates and neighborhood?

          </Text>
        </HStack>


      <TextEditor formData={formData.description} updateFormData={updateFormData} field={'description'} />
      <HStack spacing={2} my={4} >
        <Badge colorScheme='purple' px='6px' borderRadius='lg'  >TIP</Badge>
        <Text  color='purple.600' fontWeight='seminbold' >
          The Correct AI button triggers an AI that corrects spelling and grammar mistakes

        </Text>
      </HStack>
    </Box>

  </Container>
  <Container maxW='900px'  w={'70vw'}   py={6} px={0} shadow='md' border='1px solid' borderColor='blackAlpha.200' borderRadius='xl' bgColor='white'>
    <Heading px={9} color='blackAlpha.500' size='md'>
      AMENITIES :
    </Heading>
    <Divider mt={7} mb={5}  />

    <AmenitiesSelector updateFormData={updateFormData} formData={formData} />

  </Container>
</VStack>
  );
};

export default Step2Layout;
