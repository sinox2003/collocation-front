import React, { useState, useEffect } from "react";

import {
  Box,
  Button,
  Flex,
  Icon,
  Heading,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Stack,
  Text, Avatar, IconButton, PopoverFooter,
} from "@chakra-ui/react";
import { BiSolidMessageRounded } from "react-icons/bi";
import Swal from "sweetalert2";
import {FaUserCircle, FaListAlt, FaBookmark, FaBell, FaRegUserCircle} from "react-icons/fa";
import {IoLogOut, IoSettingsOutline} from "react-icons/io5";

import { CgProfile } from "react-icons/cg";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  loginWithUsernamePassword,
  loginWithGoogle,
} from "../../services/authService";
import { useToast } from "@chakra-ui/react";


import EmailStep from "../../components/features/auth/EmailStep";
import PasswordStep from "../../components/features/auth/PasswordStep";
import SignUpStep from "../../components/features/register/SignUpStep";
import VerificationStep from "../../components/features/register/VerificationStep";
import {FiBell,FiTrash, FiPlusCircle} from "react-icons/fi";
import {TbMessageCircle} from "react-icons/tb";
import {FaRegRectangleList} from "react-icons/fa6";
import {HiLogin} from "react-icons/hi";
import {RiSurveyLine, RiUserSettingsLine} from "react-icons/ri";
import {LuClipboardList, LuListOrdered} from "react-icons/lu";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState("email");
  const [email, setEmail] = useState("");
  const [jwt, setJwt] = useState(""); // JWT token
  const [userName, setUserName] = useState(""); // User name
  const [userId, setUserId] = useState(""); // User ID
  const [userEmail, setUserEmail] = useState(""); // User Email
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const [profilePicture, setProfilePicture] = useState();
  const [notifications, setNotifications] = useState([]); // Liste des notifications
  const [unreadCount, setUnreadCount] = useState(0); // Compteur des notifications non lues

  // Fetch JWT and user details from cookies on load
  useEffect(() => {
    const token = Cookies.get("jwtToken");
    const storedUserId = Cookies.get("userId");
    const storedUserName = Cookies.get("userName");
    const storedUserEmail = Cookies.get("userEmail");
    const storedUserProfilePicture = Cookies.get("profilePicture")

    if (token && storedUserId && storedUserName && storedUserEmail) {
      setJwt(token);
      setUserId(storedUserId);
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
    }
    if (storedUserProfilePicture) {
      setProfilePicture(storedUserProfilePicture);
    }
  }, []);
  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      fetch(`http://localhost:8762/messagerie-service/notifications/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setNotifications(data);
          // Mettre à jour le compteur de non-lus
          const unread = data.filter((notif) => !notif.read).length;
          setUnreadCount(unread);
        })
        .catch((error) => console.error("Error fetching notifications:", error));
    }
  }, []);
  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      const socket = new WebSocket(`ws://localhost:8762/messagerie-service/ws/notifications?userId=${userId}`);

      socket.onmessage = (event) => {
        const newNotification = JSON.parse(event.data);
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1); // Augmenter le compteur des non-lus
      };

      socket.onopen = () => console.log("WebSocket connected");
      socket.onclose = () => console.log("WebSocket disconnected");

      return () => socket.close(); // Nettoyage lors du démontage
    }
  }, []);
  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      const socket = new WebSocket(`ws://localhost:8762/messagerie-service/ws/notifications?userId=${userId}`);
  
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
  
        if (message.type === "NEW_NOTIFICATION") {
          const newNotification = message.notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        } else if (message.type === "DELETE_NOTIFICATION") {
          const deletedNotificationId = message.notificationId;
          setNotifications((prev) => prev.filter((notif) => notif.id !== deletedNotificationId));
  
          // Réduire le compteur des notifications non lues si la notification supprimée n'était pas lue
          const wasUnread = notifications.some(
            (notif) => notif.id === deletedNotificationId && !notif.read
          );
          if (wasUnread) {
            setUnreadCount((prev) => Math.max(prev - 1, 0));
          }
        }
      };
  
      socket.onopen = () => console.log("WebSocket connected");
      socket.onclose = () => console.log("WebSocket disconnected");
  
      return () => socket.close(); // Nettoyage lors du démontage
    }
  }, [notifications]);
  

  const handleNotificationsClick = () => {
    setUnreadCount(0); // Réinitialiser le compteur
  };
  const markAllAsRead = async () => {
    try {
      // Send a request to the backend to mark all notifications as read
      await fetch(`http://localhost:8762/messagerie-service/notifications/mark-all-read/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Update the notifications state to mark all as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, read: true }))
      );
  
      // Clear the unread count
      setUnreadCount(0);
  
      
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
     
    }
  };
  const deleteNotification = async (notificationId) => {
    try {

      setUnreadCount(prev => prev-1);
      await fetch(`http://localhost:8762/messagerie-service/notifications/${notificationId}`, {
        method: "DELETE",
      });
  
      // Supprimer la notification du state local
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
  
      toast({
        title: "Notification Deleted",
        description: "The notification has been successfully removed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete the notification.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  
  
  //resoudre problm de detection de changement detat  avec connx avc fb ou gogl
  const handleLoginSuccess = ({ token, user }) => {
    // Save user details in cookies
    Cookies.set("jwtToken", token, { expires: 7 });
    Cookies.set("userId", user.id, { expires: 7 });
    Cookies.set("userName", user.name, { expires: 7 });
    Cookies.set("userEmail", user.email, { expires: 7 });

    // Update the state with user details
    setJwt(token);
    setUserId(user.id);
    setUserName(user.name);
    setUserEmail(user.email);
  };

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile page
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep("email");
    setEmail("");
    setJwt("");
  };

  const handleClick = () => {
    navigate("/chat");
  };

  const handleEmailContinue = async (submittedEmail) => {
    setIsLoading(true);
    setEmail(submittedEmail);
    console.log(submittedEmail)
    try {
      const response = await fetch("http://a86baa5fc1b924757aa2b1608979c201-868973959.us-east-1.elb.amazonaws.com/api/users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submittedEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentStep(data.exists ? "password" : "signup");
      } else {
        Swal.fire({
          icon: "error",
          title: "Email verification failed",
          text: "An error occurred while verifying your email.",
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handlePasswordSubmit = async (submittedEmail, submittedPassword) => {
    setIsLoading(true);
    try {
      const { token, user, profilePicture } = await loginWithUsernamePassword(
        submittedEmail,
        submittedPassword
      );
      console.log(profilePicture)
      setJwt(token);

      setProfilePicture(profilePicture || null)
      setUserId(user.id);
      setUserName(user.name);
      setUserEmail(user.email);

      // Store specific user details in separate cookies

      Cookies.set("jwtToken", token, { expires: 7 });
      Cookies.set("profilePicture", profilePicture ? profilePicture : null, { expires: 7 });
      Cookies.set("userId", user.id, { expires: 7 });
      Cookies.set("userName", user.name, { expires: 7 });
      Cookies.set("userEmail", user.email, { expires: 7 });

      toast({
        title: "Login Successful 🎉",
        description: "You have been logged in successfully! Welcome back!",
        status: "success",
        duration: 3000, // Keep it short and celebratory
        isClosable: true, // Allow the user to dismiss it
        position: "top-right", // Sleek and professional placement
        variant: "left-accent", // Add a subtle accent for style
      });

      handleCloseModal();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Incorrect email or password. Please try again.",
        status: "error",
        duration: 4000, // Slightly longer to ensure clarity
        isClosable: true, // Allow manual dismissal
        position: "top", // Maintain top position for visibility
        variant: "solid", // Clear and bold to grab attention
      });

    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile =()=>{
    navigate(`/users/${Cookies.get("userId")}`)
  }

  const handleLogout = () => {
    Cookies.remove("jwtToken");
    Cookies.remove("userId");
    Cookies.remove("userName");
    Cookies.remove("userEmail");
    Cookies.remove("profilePicture")
    setJwt("");
    setUserId("");
    setUserName("");
    setUserEmail("");
    toast({
      title: "Goodbye!",
      description: "You have been logged out successfully. See you soon!",
      status: "info", // Use a neutral color for logout
      duration: 5000, // Make it slightly longer for emphasis
      isClosable: true, // Allow user to close manually
      position: "top-right", // Unique placement for logout
      icon: "👋", // Add an emoji for a friendly touch
    });
    navigate("/");
  };


  return (

    <Box mb={2} boxShadow="md" >
      {/* Main Header Section */}
      <Flex py={2} justify="space-between" align="center">
        <Flex align="center" gap={6} ml={4} mr={4}>
          <Heading color="pink.500" size="lg" ml={6} mr={6} cursor={"pointer"} onClick={() => navigate("/")}>
            CasaLink
          </Heading>
        </Flex>

        {/* Centered Renters and Rooms buttons */}
        <Flex flex="1" justify="center">
          <Button
            variant="solid"
            bg="pink.500"
            color="white"
            borderRadius="full"
            px={6}
            mx={2}
            _hover={{ bg: "pink.600" }}
            onClick={() => navigate("/users")}
          >
            Renters
          </Button>
          <Button
            variant="solid"
            bg="pink.500"
            color="white"
            borderRadius="full"
            px={6}
            mx={2}
            _hover={{ bg: "pink.600" }}
            onClick={() => navigate("/")}
          >
            Rooms
          </Button>
        </Flex>

        {/* Right side with notifications and user profile */}
        <Flex align="center" gap={6} pr={5}>
          {userId && userName ? (
            <>
<Popover>
  <PopoverTrigger>
    <Box position="relative" cursor="pointer">
      <Icon
        as={FiBell}
        boxSize={6}
        color="pink.500"
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="center"
      />
      {unreadCount > 0 && (
        <Box
          position="absolute"
          top="0"
          right="0"
          bg="red.500"
          color="white"
          borderRadius="full"
          fontSize="xs"
          w="18px"
          h="18px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          boxShadow="0px 2px 5px rgba(0, 0, 0, 0.2)"
        >
          {unreadCount}
        </Box>
      )}
    </Box>
  </PopoverTrigger>
  <PopoverContent w="350px" borderRadius="lg" boxShadow="lg">
    <PopoverArrow />
    <PopoverBody>
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontWeight="bold" fontSize="md">
            Notifications
          </Text>
          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </Flex>
        <Stack spacing={3}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <Flex
                key={notif.id}
                p={3}
                bg={
                  notif.content === "Please complete your personality quiz."
                    ? "yellow.50"
                    : notif.read
                    ? "gray.100"
                    : "white"
                }
                borderRadius="md"
                boxShadow="sm"
                justifyContent="space-between"
                alignItems="center"
                _hover={{ bg: "gray.50" }}
              >
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color={
                      notif.content === "Please complete your personality quiz."
                        ? "yellow.700"
                        : "gray.700"
                    }
                  >
                    {notif.content}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(notif.timestamp).toLocaleString()}
                  </Text>
                </Box>
                {notif.content !== "Please complete your personality quiz." && (
                  <IconButton
                    icon={<FiTrash />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    aria-label="Delete notification"
                    onClick={() => deleteNotification(notif.id, notif.read)}
                  />
                )}
                {notif.content === "Please complete your personality quiz." && (
                  <Button
                    size="sm"
                    variant="solid"
                    colorScheme="yellow"
                    onClick={() => navigate("/quiz")}
                  >
                    Take Quiz
                  </Button>
                )}
              </Flex>
            ))
          ) : (
            <Text fontSize="sm" color="gray.500" textAlign="center">
              No notifications available
            </Text>
          )}
        </Stack>
      </Box>
    </PopoverBody>
  </PopoverContent>
</Popover>







              <Icon as={TbMessageCircle} boxSize={6} color="pink.500" cursor="pointer" onClick={handleClick} />
              <Popover placement='bottom-end' >
                <PopoverTrigger>
                  <IconButton
                    icon={<Avatar w="34px" h="34px"  name={userName} src={profilePicture ||null}  />}
                    isRound
                    variant={'ghost'}
                   aria-label={'avatar'}/>
                </PopoverTrigger>
                <PopoverContent w="250px" borderRadius="xl"  shadow={"2xl"}>

                  <PopoverBody >
                    <Stack spacing={4}>
                      <Button
                          variant="ghost"
                          iconSpacing={5}
                          justifyContent="flex-start"

                          leftIcon={<FaRegUserCircle size={22} />}
                          onClick={handleViewProfile}
                          sx={{
                            _hover: { bg: 'blackAlpha.100' },
                            bg: 'transparent'
                          }}
                      >
                        View Profile
                      </Button>
                      <Button
                          variant="ghost"
                          iconSpacing={5}
                          justifyContent="flex-start"
                          leftIcon={<RiUserSettingsLine strokeWidth="0.4"  size={22} />}
                          onClick={handleProfileClick}
                          sx={{
                            _hover: { bg: 'blackAlpha.100' },
                            bg: 'transparent'
                          }}
                      >
                        Profile Settings
                      </Button>

                      <Button
                          variant="ghost"
                          iconSpacing={5}

                          justifyContent="flex-start"
                          leftIcon={<FiPlusCircle  size={22}  />}
                          onClick={() => navigate("/Listing/create")}
                          sx={{
                            _hover: { bg: 'blackAlpha.100' },
                            bg: 'transparent'
                          }}
                      >
                        Create Listing
                      </Button>

                      <Button
                          variant="ghost"
                          iconSpacing={5}
                          onClick={() => navigate("/Listing")}
                          justifyContent="flex-start"
                          leftIcon={<FaRegRectangleList  size={22}  />}
                          sx={{
                            _hover: { bg: 'blackAlpha.100' },
                            bg: 'transparent'
                          }}
                      >
                        My Listings
                      </Button>
                      <Button
                          variant="ghost"
                          iconSpacing={5}
                          onClick={() => navigate("/quiz")}
                          justifyContent="flex-start"
                          leftIcon={<LuListOrdered  size={22}  />}
                          sx={{
                            _hover: { bg: 'blackAlpha.100' },
                            bg: 'transparent'
                          }}
                      >
                        Complete Quiz
                      </Button>

                      {/*<Button*/}
                      {/*    variant="ghost"*/}
                      {/*    justifyContent="flex-start"*/}
                      {/*    leftIcon={<FaBookmark />}*/}
                      {/*    sx={{*/}
                      {/*      _hover: { bg: 'blackAlpha.100' },*/}
                      {/*      bg: 'transparent'*/}
                      {/*    }}*/}
                      {/*>*/}
                      {/*  Saved*/}
                      {/*</Button>*/}


                    </Stack>
                  </PopoverBody>
                  <PopoverFooter >
                    <Button
                        variant="ghost"
                        w="full"
                        justifyContent="flex-start"
                        iconSpacing={5}
                        leftIcon={<HiLogin  size={22}  />}
                        onClick={handleLogout}
                        sx={{
                          _hover: { bg: 'blackAlpha.100' },
                          bg: 'transparent'
                        }}
                    >
                      Logout
                    </Button>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Button
                color="pink.500"
                bgColor="white"
                border="1px"
                borderColor="pink.500"
                _hover={{ bg: "pink.50" }}
                onClick={handleOpenModal}
                ml={4}
              >
                Login
              </Button>
              <Button colorScheme="pink" onClick={handleOpenModal} mr={4}>
                Sign Up
              </Button>
            </>
          )}
        </Flex>
      </Flex>

      {showModal && (
        <>
          {currentStep === "email" && (
            <EmailStep onClose={handleCloseModal} onContinue={handleEmailContinue} onLoginSuccess={handleLoginSuccess} />
          )}
          {currentStep === "password" && (
            <PasswordStep
              email={email}
              onClose={handleCloseModal}
              onSubmit={handlePasswordSubmit}
            />
          )}
          {currentStep === "signup" && (
            <SignUpStep
              email={email}
              onClose={handleCloseModal}
              onStepChange={setCurrentStep}
              setJwt={setJwt}
              setUser={(user) => {
                setUserId(user.id);
                setUserName(user.name);
                setUserEmail(user.email);
              }}
            />
          )}
          {currentStep === "verification" && (
            <VerificationStep email={email} onClose={handleCloseModal} onVerify={() => { }} />
          )}
        </>
      )}
    </Box>
  );

};

export default Header;
