  import React, { useEffect, useState, useRef } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
  useToast
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Step4Images = ({ formData, updateFormData }) => {
  const [error, setError] = useState("You must upload at least 3 photos.");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Handle file uploads
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedPhotos = [...images, ...files];
    setImages(updatedPhotos);

    if (updatedPhotos.length >= 3) {
      setError("");
    } else {
      setError("You must upload at least 3 photos.");
    }
  };

  // Handle photo deletion
  const handleDelete = (index) => {
    const updatedPhotos = images.filter((_, i) => i !== index);
    setImages(updatedPhotos);

    if (updatedPhotos.length < 3) {
      setError("You must upload at least 3 photos.");
    } else {
      setError("");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    const { situation } = formData;

    updateFormData("statusAnnonce", "AVAILABLE");

    const data = new FormData();
    data.append("annonce", JSON.stringify(formData));

    // Append each photo file
    images.forEach((image) => {
      data.append("photos", image);
    });

    console.log(data.getAll("annonce"));

    try {
      const response = await axios.post(
          "http://localhost:8762/annonces-service/api/annonces",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
      );

      toast({
        title: "Success",
        description: "Announce created successfully!",
        status: "success",
        duration: 2500,
        isClosable: true,
      });

      console.log("Image uploaded successfully:", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error creating announce:", error.response || error.message);
      toast({
        title: "Error",
        description: "Failed to create announce. Please try again.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Disable button if error exists
  const handleDisabledButton = () => {
    return error !== "";
  };

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
            LISTING IMAGES :
          </Heading>

          <Divider mt={7} mb={5} />
          <Box px={9} pb={5}>
            <div className="border-2 border-dashed border-blue-500 p-6 rounded-md text-center bg-blue-50">
              <p className="text-blue-500">
                Drag and drop your images here, or click to upload.
              </p>
              <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
              />
              <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
              >
                Upload Photos
              </label>
              <p className="text-gray-500 mt-2">{images.length} photo(s) uploaded.</p>
            </div>

            {/* Display Preview Images */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {images.map((src, index) => (
                      <Box key={index} w="200px" h="200px" position="relative">
                        <Image
                            src={URL.createObjectURL(src)}
                            objectFit="cover"
                            alt={`Preview ${index + 1}`}
                            boxSize="200px"
                        />
                        <button
                            type="button"
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                            onClick={() => handleDelete(index)}
                        >
                          ✕
                        </button>
                      </Box>
                  ))}
                </div>
            )}

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          </Box>
        </Container>

        <Flex w="full" justifyContent="right">
          <Button
              onClick={handleSubmit}
              isLoading={loading}
              isDisabled={handleDisabledButton()}
              shadow="lg"
              border={"1px solid"}
              borderColor={"blackAlpha.200"}
              _hover={{ backgroundColor: "whiteAlpha.500" }}
              backgroundColor="white"
              borderRadius="3xl"
          >
            Save and close
          </Button>
        </Flex>
      </VStack>
  );
};

export default Step4Images;
