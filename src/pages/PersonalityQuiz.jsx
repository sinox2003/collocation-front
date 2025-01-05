import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Select,
  Button,
  Heading,
  useToast,
  Flex,
  Progress,
  Divider,
  Circle,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const questions = [
  "How do you prefer to spend your free time?",
  "What is your ideal noise level in a shared space?",
  "How do you usually handle cleaning and chores in a shared space?",
  "How do you feel about having guests over?",
  "What's your typical sleep schedule?",
  "How do you approach conflict resolution in shared living or working spaces?",
  "What's your preferred level of interaction with roommates or coworkers?",
  "How do you feel about shared resources (e.g., food, office supplies)?",
];

const options = [
  ["Socializing with friends or roommates", "Relaxing alone", "Pursuing hobbies or outdoor activities", "Working on personal projects or studying"],
  ["I prefer quiet most of the time", "Moderate noise is fine", "I'm comfortable with a lively and noisy environment"],
  ["I prefer a fixed schedule", "I clean as needed, no strict rules", "I'm okay with a bit of clutter"],
  ["I enjoy hosting frequently", "Occasionally, but not too often", "I prefer to keep the space private"],
  ["Early to bed, early to rise", "Night owl, late riser", "Flexible, depends on the day"],
  ["Open and direct communication", "Prefer to avoid confrontation, but will address issues if necessary", "Tend to let things go unless they're a major problem"],
  ["I enjoy spending a lot of time together", "A balance of social time and personal space", "Minimal interaction, I value my alone time"],
  ["I'm open to sharing most things", "I prefer to have clear boundaries on shared items", "I keep everything separate"],
];

const scores = [
  { "Socializing with friends or roommates": 1, "Relaxing alone": 2, "Pursuing hobbies or outdoor activities": 3, "Working on personal projects or studying": 4 },
  { "I prefer quiet most of the time": 1, "Moderate noise is fine": 2, "I'm comfortable with a lively and noisy environment": 3 },
  { "I prefer a fixed schedule": 1, "I clean as needed, no strict rules": 2, "I'm okay with a bit of clutter": 3 },
  { "I enjoy hosting frequently": 1, "Occasionally, but not too often": 2, "I prefer to keep the space private": 3 },
  { "Early to bed, early to rise": 1, "Night owl, late riser": 2, "Flexible, depends on the day": 3 },
  { "Open and direct communication": 1, "Prefer to avoid confrontation, but will address issues if necessary": 2, "Tend to let things go unless they're a major problem": 3 },
  { "I enjoy spending a lot of time together": 1, "A balance of social time and personal space": 2, "Minimal interaction, I value my alone time": 3 },
  { "I'm open to sharing most things": 1, "I prefer to have clear boundaries on shared items": 2, "I keep everything separate": 3 },
];

const PersonalityQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const toast = useToast();
  const navigate = useNavigate();

  const handleOptionChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };
  const refreshNotifications = async () => {
    const userId = Cookies.get("userId");
    try {
      const response = await axios.get(`http://localhost:8762/messagerie-service/notifications/${userId}`);
      setNotifications(response.data); // Supposons que vous avez un état `setNotifications` dans votre composant parent
      console.log("Notifications refreshed:", response.data);
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    }
  };
  const [notifications, setNotifications] = useState([]);
  const handleNext = () => {
    if (!answers[currentQuestion]) {
      toast({
        title: "Incomplete",
        description: "Please select an option before proceeding.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };
  const handleSubmit = async () => {
    const result = answers.map((answer, i) => scores[i][answer]);
    console.log("User's Personality Scores:", result);

    const userId = Cookies.get("userId");

    try {
      await axios.post("http://localhost:8762/user-security-service/api/users/save-quiz", {
        userId: Number(userId),
        scores: result,
      });
        // Rafraîchir les notifications après que la personnalité de l'utilisateur est mise à jour
      await refreshNotifications();
    } catch (error) {
      console.error("Error saving quiz data:", error);
      toast({
        title: "Error",
        description: "Failed to save quiz data.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    navigate("/");
  };

  return (
    <Flex justify="center" align="center" height="100vh" bg="gray.50">
      <Box p={8} maxW="700px" width="100%" bg="white" borderRadius="lg" boxShadow="2xl">
        <Heading mb={6} textAlign="center" fontSize="3xl" color="pink.600">
          Complete the Questionnaire
        </Heading>

        <Progress
          value={(currentQuestion + 1) / questions.length * 100}
          size="lg"
          colorScheme="pink"
          borderRadius="md"
          mb={6}
          isAnimated
          hasStripe
        />

        <VStack spacing={8} align="stretch">
          <Text fontWeight="bold" fontSize="xl" color="gray.700" textAlign="center">
            {currentQuestion + 1}. {questions[currentQuestion]}
          </Text>

          <Select
            placeholder="Select your answer"
            onChange={(e) => handleOptionChange(e.target.value)}
            value={answers[currentQuestion] || ""}
            size="lg"
            borderColor="pink.400"
            focusBorderColor="pink.600"
            bg="gray.50"
            boxShadow="sm"
          >
            {options[currentQuestion].map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <Button
            colorScheme="pink"
            onClick={handleNext}
            size="lg"
            width="full"
            rightIcon={currentQuestion < questions.length - 1 ? null : <Icon as={FiCheckCircle} />}
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
          >
            {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
          </Button>

          <Divider />

          <HStack justify="center" spacing={2}>
            {questions.map((_, index) => (
              <Circle
                key={index}
                size={currentQuestion === index ? "40px" : "30px"}
                bg={currentQuestion === index ? "pink.600" : index < currentQuestion ? "pink.300" : "gray.300"}
                color="white"
                fontWeight="bold"
                transition="all 0.3s"
              >
                {index + 1}
              </Circle>
            ))}
          </HStack>

          <Text fontSize="sm" color="gray.500" textAlign="center">
            Step {currentQuestion + 1} of {questions.length}
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default PersonalityQuiz;
