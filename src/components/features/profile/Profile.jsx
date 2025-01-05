import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {FiEdit} from "react-icons/fi";
import {z} from "zod";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  Select,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

// Schéma de validation Zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_-]{3,15}$/,
      "Username must be 3-15 characters and contain only letters, numbers, underscores, or dashes"
    ),

  gender: z.enum(["H", "F"], "Gender is required"),
  age: z.preprocess(
    (value) => (value === "" ? undefined : Number(value)),
    z.number().min(1, "Age must be at least 1").max(150, "Age must be realistic")
  ),
});

const Profile = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    const userId = Cookies.get("userId");

    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You must log in first!",
      });
      navigate("/");
      return;
    }

    fetch(`http://localhost:8762/user-security-service/api/users/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setFormData({ ...data });
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load user details.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  const checkUsername = async (username) => {
    try {
      const response = await fetch("http://localhost:8762/user-security-service/api/users/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();

      if (data.exists) {
        setUsernameError("This username is already taken. Please choose another.");
      } else {
        setUsernameError(""); // Clear username error if valid
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError("An error occurred while checking the username.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    try {
      const fieldSchema = z.object({ [name]: formSchema.shape[name] });
      fieldSchema.parse({ [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    } catch (error) {
      if (error.errors) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error.errors[0].message,
        }));
      }
    }

    if (name === "username") {
      checkUsername(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    const userId = Cookies.get("userId");

    try {
      formSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error.errors) {
        const validationErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const userDetailsResponse = await fetch(`http://localhost:8762/user-security-service/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!userDetailsResponse.ok) {
        throw new Error("Failed to update profile details");
      }

      const updatedUser = await userDetailsResponse.json();

      if (selectedFile) {
        const formDataImage = new FormData();
        formDataImage.append("file", selectedFile);

        const imageResponse = await fetch(
          `http://localhost:8762/user-security-service/api/users/${userId}/uploadProfilePicture`,
          {
            method: "POST",
            body: formDataImage,
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Failed to upload image");
        }

        updatedUser.profilePicture = await imageResponse.text();
      }

      setUser(updatedUser);
      Cookies.set("userName", updatedUser.username, { expires: 7 });
      Cookies.set("userEmail", updatedUser.email, { expires: 7 });
      console.log(updatedUser)
      Cookies.set("profilePicture", updatedUser.profilePicture|| null, { expires: 7 });

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {

      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" h="100vh">
        <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='pink.500'
            size='xl'
        />
      </Box>
    );
  }

  const isSubmitDisabled = !!usernameError || Object.values(errors).some((error) => error);

  return (
      <Box py={16}>
    <Box maxW="4xl" mx="auto"  p={8} bg="white" border="1px solid" borderColor="blackAlpha.200" shadow="xl" borderRadius="xl" >
      <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={6}>
        Your Profile
      </Text>
      {user && (
        <form onSubmit={handleSubmit}>
          <VStack spacing={8}>
            <Box textAlign="center">
              <Box position="relative" display="inline-block">
                <Avatar
                   src={previewImage || (user?.profilePicture && user.profilePicture?.url)}
                   size='xl' name={user?.username}
                />
                <IconButton
                  icon={<FiEdit />}
                  aria-label="Edit profile picture"
                  position="absolute"
                  bottom={0}
                  right={0}
                  bg="gray.800"
                  color="white"
                  size="sm"
                  borderRadius="full"
                  _hover={{ bg: "gray.600" }}
                  as="label"
                  htmlFor="profilePicture"
                />
                <Input type="file" id="profilePicture" accept="image/*" display="none" onChange={handleFileChange} />
              </Box>
            </Box>

            <HStack spacing={6} w="full">
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input name="firstName" focusBorderColor="pink.500" value={formData.firstName || ""} onChange={handleChange} />
                {errors.firstName && <Text color="red.500" fontSize="sm">{errors.firstName}</Text>}
              </FormControl>

              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input name="lastName" focusBorderColor="pink.500" value={formData.lastName || ""} onChange={handleChange} />
                {errors.lastName && <Text color="red.500" fontSize="sm">{errors.lastName}</Text>}
              </FormControl>
            </HStack>

            <HStack spacing={6} w="full">
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Username</FormLabel>
                <Input focusBorderColor="pink.500" name="username" value={formData.username || ""} onChange={handleChange} />
                {errors.username && <Text color="red.500" fontSize="sm">{errors.username}</Text>}
                {usernameError && <Text color="red.500" fontSize="sm">{usernameError}</Text>}
              </FormControl>

              <FormControl isInvalid={!!errors.age}>
                <FormLabel>Age</FormLabel>
                <Input focusBorderColor="pink.500" name="age" type="number" value={formData.age || ""} onChange={handleChange} />
                {errors.age && <Text color="red.500" fontSize="sm">{errors.age}</Text>}
              </FormControl>
            </HStack>

            <HStack spacing={6} w="full">
              <FormControl isInvalid={!!errors.gender}>
                <FormLabel>Gender</FormLabel>
                <Select focusBorderColor="pink.500" name="gender" value={formData.gender || ""} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="H">Male</option>
                  <option value="F">Female</option>
                </Select>
                {errors.gender && <Text color="red.500" fontSize="sm">{errors.gender}</Text>}
              </FormControl>

              <FormControl >
                <FormLabel>New Password</FormLabel>
                <Input focusBorderColor="pink.500"
                  name="password"
                  type="password"
                  placeholder="********"
                  
                  onChange={handleChange}
                />
                {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
              </FormControl>
            </HStack>

            <HStack justifyContent="end" w="full">
              <Button
                type="submit"
                colorScheme="green"

                isDisabled={isSubmitDisabled || isSubmitting}
                isLoading={isSubmitting}
                loadingText="Saving..."
              >
                Save Changes
              </Button>

            </HStack>
          </VStack>
        </form>
      )}
    </Box>
      </Box>
  );
};

export default Profile;
