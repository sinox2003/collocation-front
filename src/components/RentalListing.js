import React, { useState, useEffect } from 'react';
import {
    Box, Flex, Text, Icon, Menu, MenuButton, MenuList, Modal, HStack,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter, MenuItem, IconButton, Button,
    RadioGroup,
    Stack,
    Radio,
    Link,
    Wrap, WrapItem,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Textarea, useDisclosure, Heading, Image, Badge, Center, Avatar
} from '@chakra-ui/react';
  import {
    FaPaw,
    FaSnowflake,
    FaHome,
    FaTv,
    FaBed,
    FaCouch,
    FaBath,
    FaUmbrellaBeach,
    FaClipboardList,
    FaTshirt,
    FaDumbbell,
    FaCar,
    FaSwimmer,
    FaFire,
    FaExclamationCircle,
} from "react-icons/fa";
import {
  BiHandicap } from 'react-icons/bi';
  import { MdStairs } from 'react-icons/md';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,CheckCircleIcon} from '@chakra-ui/icons';
import { FaBookmark, FaEye, FaFlag, FaShareAlt,FaWifi, FaFireExtinguisher, FaShieldAlt, FaHotjar } from 'react-icons/fa';
import { MdPhotoLibrary,MdArrowDropUp, MdArrowDownward } from "react-icons/md"; // Import the icon from Chakra's react-icons
import NotificationModal from './modals/NotificationModal';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams, useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Leaflet styles
import L from 'leaflet';
import AnnonceService from '../services/AnnoncesService';
import { format } from 'date-fns';
import Cookies from "js-cookie";



const amenitiesData = {
  

  home: [
    { name: "Wifi included", icon: FaWifi },
    { name: "Heating", icon: FaHotjar },
  ],
  property: [
    { name: "Security system", icon: FaShieldAlt },
  ],
  safety: [
    { name: "Smoke alarm", icon: FaShieldAlt },
    { name: "Fire extinguisher", icon: FaFireExtinguisher },
  ],
};

const allAmenities = [
  ...amenitiesData.home,
  ...amenitiesData.property,
  ...amenitiesData.safety,
];

const sections = [
        {
            title: "home",
            colorScheme:"#5075DC",
            items: [
                { value: "IN_UNIT_LAUNDRY", label: "In-unit laundry", icon: FaTshirt },
                { value: "WIFI_INCLUDED", label: "Wifi included", icon: FaWifi },
                { value: "UTILITIES_INCLUDED", label: "Utilities included", icon: FaClipboardList },
                { value: "UNFURNISHED", label: "Unfurnished", icon: FaHome },
                { value: "FURNISHED", label: "Furnished", icon: FaCouch },
                { value: "FURNISH_OPTIONAL", label: "Furnish Optional", icon: FaBed },
                { value: "AIR_CONDITIONING", label: "Air Conditioning", icon: FaSnowflake },
                { value: "MONTH_TO_MONTH", label: "Month to month", icon: FaUmbrellaBeach },
                { value: "TV", label: "TV", icon: FaTv },
                { value: "PRIVATE_BATH", label: "Private bath", icon: FaBath },
                { value: "PETS_WELCOME", label: "Pets welcome", icon: FaPaw },
                { value: "LARGE_CLOSET", label: "Large closet", icon: FaClipboardList },
                { value: "BALCONY", label: "Balcony", icon: FaUmbrellaBeach },
            ],
        },
        {
            title: "property",
            colorScheme: "pink.600" ,
            items: [
                { value: "EXERCISE_EQUIPMENT", label: "Exercise equipment", icon: FaDumbbell },
                { value: "ELEVATOR", label: "Elevator", icon: FaHome },
                { value: "DOORMAN", label: "Doorman", icon: FaShieldAlt },
                { value: "HEATING", label: "Heating", icon: FaFire },
                { value: "FREE_PARKING", label: "Free parking", icon: FaCar },
                { value: "PAID_PARKING", label: "Paid parking", icon: FaCar },
                { value: "OUTDOOR_SPACE", label: "Outdoor space", icon: FaUmbrellaBeach },
                { value: "SWIMMING_POOL", label: "Swimming Pool", icon: FaSwimmer },
                { value: "FIRE_PIT", label: "Fire pit", icon: FaFire },
                { value: "POOL_TABLE", label: "Pool table", icon: FaClipboardList },
                { value: "BBQ_GRILL", label: "BBQ grill", icon: FaFire },
            ],
        },
        {
            title: "Safety",
            colorScheme: "#F6B001",
            items: [
                { value: "SMOKE_ALARM", label: "Smoke alarm", icon: FaShieldAlt },
                { value: "FIRST_AID_KIT", label: "First aid kit", icon: FaExclamationCircle },
                { value: "CARBON_MONOXIDE", label: "Carbon monoxide", icon: FaShieldAlt },
                { value: "FIRE_EXTINGUISHER", label: "Fire extinguisher", icon: FaFire },
                { value: "HANDICAP_ACCESSIBLE", label: "Handicap accessible", icon: BiHandicap },
                { value: "SECURITY_SYSTEM", label: "Security system", icon: FaShieldAlt },
                { value: "MUST_CLIMB_STAIRS", label: "Must climb stairs", icon: MdStairs },
            ],
        },
    ];

const RentalListing = () => {
  const { id } = useParams(); // Retrieve the 'id' from the URL
  const navigate = useNavigate(); // To navigate to home if needed
  const [annonce, setAnnonce] = useState(null); // State to store annonce data
  const [listingCoordinates, setListingCoordinates] = useState(null);
  const [images, setImages] = useState([]);
  const [categorizedAmenities, setCategorizedAmenities ] = useState([]);
  const [processed, setProcessed] = useState(false);



  // Example of room IDs (could come from an API or database)
  const isValidLong = (id) => {
    const numId = parseInt(id, 10); // Convert string to integer
    return Number.isInteger(numId) && numId > 0; // Check if it's a positive integer (long number check)
  };

  const fetchAnnonce = async (id) => {
    try {
      const data = await AnnonceService.getAnnonceById(id); // Call the service to fetch annonce
      console.log(data.getAnnonceById); // Set the annonce data
      if (!data.getAnnonceById) {
        throw new Error('Annonce not found');
      }
      const fetchedAnnonce = data.getAnnonceById;
      setAnnonce(fetchedAnnonce);

      if (fetchedAnnonce.photos && fetchedAnnonce.photos.length > 0) {
        const photoUrls = fetchedAnnonce.photos.map((photo) => photo.url); // Map to URL array
        setImages(photoUrls); // Set the images in state
      } else {
        // Fallback if no photos are available
        setImages([
          'https://via.placeholder.com/400x300',
          'https://via.placeholder.com/330x150',
          'https://via.placeholder.com/400x250',
        ]);
      }

      const fetchedAmenities = annonce?.amenities || [];
      setCategorizedAmenities(renderAmenities(fetchedAmenities));
      console.log(categorizedAmenities); // Check if this array is being populated correctly

      if (fetchedAnnonce.address) {
        const { latitude, longitude } = fetchedAnnonce.address;
        if (latitude && longitude) {
          setListingCoordinates({ lat: latitude, lng: longitude });
        } else {
          // Handle case where no valid coordinates are available
          setListingCoordinates({ lat: 51.505, lng: -0.09 }); // Default coordinates
        }
      }
      if(fetchedAnnonce.user.id !== Cookies.get("userId")) {
          incrementAnnonceViews(id); // Increment views
      }
    } catch (err) {
      navigate("/"); // Redirect to home page if there's an error
    }
  };

  const renderAmenities = (fetchedAmenities) => {
    return sections.map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        fetchedAmenities.includes(item.value)
      ),
    }));
  };

  const incrementAnnonceViews = async (id) => {

    try {
      const success = await AnnonceService.incrementViews(id); // Call the service to increment views
      if (!success) {
        console.error("Failed to increment views");
      }
    } catch (error) {
      console.error("Error incrementing views:", error.message);
    }
  };

  // Redirect to home if the ID is not valid
  useEffect(() => {
    if (!isValidLong(id)) {
      navigate("/"); // Redirect to home page if the ID is invalid
    } else {
      fetchAnnonce(id); // Fetch the annonce if the ID is valid
      setProcessed(true)
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchedAmenities = annonce?.amenities || [];
    setCategorizedAmenities(renderAmenities(fetchedAmenities))
    console.log(fetchedAmenities)
  }, [annonce]);



  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isMapExpanded, setIsMapExpanded] = useState(false); // Track if the map is expanded


  const [showFullText, setShowFullText] = useState(false);

  const description = `Woodside- Newly Renovated Cozy Apartment Available for 12/1 Move-in!

  Seeking tenants for medium to long-term

  Apartment:
  One fully private room with a closet. A spacious living room, kitchen, and bathroom will be shared with two other young professional roommates. Located on the second floor of a two-story building with a deli and laundry on the first floor. The kitchen is equipped with all brand new basic cooking utensils, allowing for immediate use. Bicycle parking available within the apartment.

  Stations:
  Near both the #7 line Woodside Station and 69th Street Station, each within a 5-minute walk. Woodside Station also has the LIRR, reaching Penn Station in just 10 minutes. The neighborhood boasts convenient access to supermarkets, banks, restaurants, cafes, Citi Bike stations, and more.

  Rent:
  $1,300 (includes WiFi, utilities are separate)
  One-month deposit required

  As the landlord, I live nearby and am available for any assistance at all times. If furniture is needed in the room, arrangements can be made upon requests. No broker fees.

  If you are interested, please get in touch with a brief self-introduction! Thank you in advance.`;

  // Function to show only the first 9 lines
  const getTrimmedText = (html, charLimit = 150) => {
    // Parse the HTML content
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const textContent = doc.body.textContent || doc.body.innerText; // Get plain text from HTML
  
    // Check if the content length exceeds the limit
    if (textContent.length <= charLimit) {
      return html; // Return original HTML if it's within the limit
    }
  
    // Truncate the text content to the charLimit
    let trimmedText = textContent.slice(0, charLimit);
  
    // Ensure the truncated text does not cut off in the middle of words
    const lastSpace = trimmedText.lastIndexOf(' ');
    if (lastSpace !== -1) {
      trimmedText = trimmedText.slice(0, lastSpace); // Remove partial words
    }
  
    // Use the original HTML and trim its content accordingly
    const truncatedHtml = doc.body.innerHTML.slice(0, doc.body.innerHTML.indexOf(trimmedText) + trimmedText.length);
  
    return truncatedHtml + '...'; // Add ellipsis to show content is trimmed
  };



  // const images = [
  //   'https://via.placeholder.com/400x300',
  //   'https://via.placeholder.com/330x150',
  //   'https://via.placeholder.com/400x250', // Add more images if needed
  // ];

  const handleImageClick = (index) => {
    setSelectedImage(index); // Set the initial image to display in the carousel
    setIsModalImageOpen(true); // Open the image modal
  };

  const [notificationContent, setNotificationContent] = useState({
    title: '',
    description: '',
  });

  const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const handleReportSubmit = () => {
    console.log('Report Reason:', reportReason);
    console.log('Additional Details:', additionalDetails);
    alert('Thank you for reporting the listing.');
    onClose(); // Close the modal after submitting
    setReportReason('');
    setAdditionalDetails('');
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };
  

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    setNotificationContent({
      title: isSaved ? 'Removed from Favorites' : 'Saved to Favorites',
      description: isSaved
        ? 'Listing removed from favorites.'
        : 'Listing added to favorites.',
    });
    setIsModalOpen(true);
  };

  const handleShare = () => {
    const pageUrl = window.location.href; // Get the current page URL
    navigator.clipboard.writeText(pageUrl) // Copy the URL to clipboard
      .then(() => {
        setNotificationContent({
          title: 'Link Copied',
          description: 'The link to this page has been copied to your clipboard.',
        });
        setIsModalOpen(true);
      })
      .catch((err) => {
        console.error('Failed to copy the link: ', err);
      });
  };

const closeModal = () => setIsModalOpen(false);

function formatDate(dateString) {
  if (!dateString) return 'Invalid Date';

  const [year, month, day] = dateString.split('-');
  return `${year}/${month}/${day}`;
}


  return (
    <Box  borderRadius="lg" overflow="hidden" p={6} m={10} mt={0} pt={2}>
      {/* Bar at the top */}
      <Flex justifyContent="right" alignItems="center" mb={4} p={2} bg="" borderRadius="md">
        <Text fontSize="sm" fontWeight={'semibold'} color="black" pr={4} borderRight="1px solid gray">
          Posted: {formatDate(annonce?.createdAt) || '11/11/24'} 
        </Text>
        <Text fontSize="sm" fontWeight={'semibold'} color="black" pr={4} pl={4} borderRight="1px solid gray">
          Updated: {formatDate(annonce?.updatedAt) || '11/11/24'} 
        </Text>
        <Flex alignItems="center" pl={4} pr={4} mr={4} borderRight="1px solid gray">
          <Icon as={FaEye} color="black" mr={1} />
          <Text fontSize="sm" fontWeight={'semibold'} color="black">
          {annonce?.views || 0} Views
          </Text>
        </Flex>
        <Menu pl={4} sha>
          <MenuButton
            as={IconButton}
            icon={<ChevronDownIcon />}
            aria-label="Options"
            variant="outline"
            borderRadius="full"
            size="sm"
          />
          <MenuList>
            <MenuItem
              icon={<Icon as={FaBookmark} />}
              onClick={handleSaveToggle}
            >
              {isSaved ? "UN-SAVE" : "SAVE"}
            </MenuItem>

            <MenuItem icon={<Icon as={FaFlag} />} command="Ctrl+F" onClick={onOpen}>
              FLAG
            </MenuItem>
            <MenuItem
              icon={<Icon as={FaShareAlt} />}
              command="Ctrl+H"
              onClick={handleShare}
            >
              SHARE
            </MenuItem>
          </MenuList>
          
        </Menu>
      </Flex>

      <Box
  display="flex"
  gap="16px" // Space between columns
  mb={6}
  style={{ height: "330px" }} // Fixed height for the container (optional)
>
  {/* Left Column */}
<Box
  flex={1} // Take equal space as the right column
  position="relative" // To position the button inside the image
  style={{
    borderRadius: "8px",
    overflow: "hidden",
    aspectRatio: "330 / 200", // Dynamic aspect ratio
  }}
>
  <img
    src={images.at(0)}
    alt="Left column"
    onClick={() => handleImageClick(0)}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      cursor: "pointer",
    }}
  />
<Button
  position="absolute"
  bottom="10px"
  right="10px"
  size="sm"
  backgroundColor="rgba(0, 0, 0, 0.7)"
  color="white"
  leftIcon={<Icon as={MdPhotoLibrary} boxSize={4} />} // Use Chakra's MdPhotoLibrary icon
  _hover={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
  onClick={() => handleImageClick(0)} // Open the modal with the first image
>
  Show All Photos
</Button>

</Box>

  {/* Right Column */}
  <Box
    flex={1} // Take equal space as the left column
    display="flex"
    flexDirection="column"
    gap="16px"
  >
     {/* Map Container */}
     <Box
  position="relative"
  flex={1}
  style={{
    borderRadius: "8px",
    overflow: "hidden",
    aspectRatio: "330 / 150",
  }}
>
<MapContainer
    key={listingCoordinates ? `${listingCoordinates.lat}-${listingCoordinates.lng}` : 'default'}
    center={listingCoordinates || { lat: 31.635834, lng: -8.017145 }}
    zoom={14}
    style={{ width: '100%', height: '100%' }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
    />
    <Marker
      position={listingCoordinates || { lat: 31.635834, lng: -8.017145 }}
      icon={customMarkerIcon}
    >
      <Popup>
        <Text fontWeight="bold">Listing Location</Text>
        <Text>Federation Square</Text>
      </Popup>
    </Marker>
  </MapContainer>


  {/* Button to toggle map expansion */}
  <Button
    position="absolute"
    bottom="16px"
    left="16px"
    zIndex={1000} // Ensures it appears above the map
    size="sm"
    backgroundColor="rgba(0, 0, 0, 0.7)"
    color="white"
    leftIcon={
      <Icon
        as={MdArrowDownward}
        transform={isMapExpanded ? "rotate(-135deg)" : "rotate(45deg)"}
        boxSize={4}
      />
    }
    _hover={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
    onClick={() => setIsMapExpanded(!isMapExpanded)}
  >
    {isMapExpanded ? "Collapse Map" : "Expand Map"}
  </Button>
</Box>



    {/* Bottom Image */}
    {!isMapExpanded && (
  <Box
    flex={1}
    style={{
      borderRadius: "8px",
      overflow: "hidden",
      aspectRatio: "330 / 150",
    }}
  >
    <img
      src={images.at(1)}
      alt="Bottom image"
      onClick={() => handleImageClick(1)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        cursor: "pointer",
      }}
    />
  </Box>
)}

  </Box>
</Box>

<Flex
      direction={{ base: "column", md: "row" }} // Stack vertically on small screens
      gap={4}
      
    >
      {/* Left Column - Listing Details */}
      <Box
        flex={2.5}
        bg="white"   
      >
        <Heading size="lg" mb={4}>
        {annonce?.user.firstName || 'Ayoub'}'s place in{" "}
  <Link
    href="/woodside"
    textDecoration="underline"
    textDecorationColor="gray.200"
    textUnderlineOffset="6px" // Adjusts the underline distance from the text
    textDecorationThickness="1px" // Makes the underline thinner
    _hover={{
      textDecoration: "underline",
      textDecorationColor: "black.800",
      textUnderlineOffset: "6px",
      textDecorationThickness: "1px",
    }}
  >
    {annonce?.address?.street || 'Jnan Awrad'}
  </Link>
  ,{" "}
  <Link
    href="/queens"
    textDecoration="underline"
    textDecorationColor="gray.200"
    textUnderlineOffset="6px" // Adjusts the underline distance from the text
    textDecorationThickness="1px" // Makes the underline thinner
    _hover={{
      textDecoration: "underline",
      textDecorationColor: "black.800",
      textUnderlineOffset: "6px",
      textDecorationThickness: "1px",
    }}
  >
    {annonce?.address?.city || 'Marrakech '}
  </Link>
</Heading>

<Stack spacing={3} borderBottom="1px solid" borderColor= "gray.200" pb={10}>
  <HStack align="start" spacing={4} fontSize={"20px"}>
    <Text fontWeight="bold" style={{color : "rgb(161 161 176)"}} minW="100px" >
      Rent
    </Text>
    <Text><strong>${annonce?.price || 1000} </strong><Text as="span" fontSize={"15px"} style={{color : "rgb(161 161 176)"}}>/ mo</Text></Text>
  </HStack>
  <HStack align="start" spacing={4}>
    <Text fontWeight="bold" style={{color : "rgb(161 161 176)"}} minW="100px">
      Available 
    </Text>
    <Text fontWeight="medium">
   {annonce?.availableFrom
    ? format(new Date(annonce?.availableFrom), 'MMM d, yyyy')
    : 'Dec 1, 2024'} -  
  {annonce?.duration === 'FLEXIBLE'
    ? ' Flexible'
    : annonce?.duration === 'TWELVE_MONTHS'
    ? ' 12 Months'
    : annonce?.duration === 'FIXED' && annonce?.availableTo
    ? ` ${format(new Date(annonce?.availableTo), 'MMM d, yyyy')}`
    : 'N/A'}
</Text>
  </HStack>
  <HStack align="start" spacing={4}>
    <Text fontWeight="bold" minW="100px" style={{color : "rgb(161 161 176)"}}>
      Type
    </Text>
    <Text fontWeight="medium">{annonce?.layoutType === 'PRIVATE_ROOM'
    ? 'Private Room'
    : annonce?.layoutType === 'SHARED'
    ? 'Shared Room'
    : annonce?.layoutType === 'ENTIRE_PLACE'
    ? 'Entire Place'
    : 'N/A'} - {annonce?.propertyType || 'Apartment'}</Text>
  </HStack>
  <HStack align="start" spacing={4}>
    <Text fontWeight="bold" style={{color : "rgb(161 161 176)"}} minW="100px">
      Layout
    </Text>
    <Text fontWeight="medium">{annonce?.bedrooms || 1} Bedrooms · {annonce?.bathrooms || 1} Bath</Text>
  </HStack>
  <HStack align="start" spacing={4}>
    <Text fontWeight="bold" style={{color : "rgb(161 161 176)"}} minW="100px">
      Roommates
    </Text>
    <Text fontWeight="medium">{annonce?.numberOfRoommates || "N/A"}</Text>
  </HStack>
</Stack>

        <Box mt={6} borderBottom="1px solid" borderColor= "gray.200" pb={10}>
          <Heading size="md" mb={3} style={{color : "rgb(161 161 176)"}}>
            Description
          </Heading>
          <Text
            fontWeight="medium"
            width="90%"
            whiteSpace="pre-wrap"
            dangerouslySetInnerHTML={{
              __html: showFullText
                ? annonce?.description
                : getTrimmedText(annonce?.description, 550),
            }}
            sx={{
              'ul': {
                listStyleType: 'disc', // Ensures bullet points are visible
                paddingLeft: '50px',   // Adds padding to the left of the list
              },
              'ol': {
                listStyleType: 'decimal', // Ensures numbers for ordered lists
                paddingLeft: '50px',     // Adds padding to the left of the ordered list
              },
              'li': {
                marginBottom: '5px',     // Adds spacing between list items
              },
              'strong': {
                fontWeight: 'bold',      // Bold text for <strong> tags
              },
              'em': {
                fontStyle: 'italic',     // Italic text for <em> tags
              },
              'u': {
                textDecoration: 'underline', // Underline text for <u> tags
              },
              'h1': {
                fontSize: '2xl',         // Larger size for <h1> headings
                fontWeight: 'bold',      // Bold text for <h1> tags
              },
              'h2': {
                fontSize: 'xl',         // Size for <h2> headings
                fontWeight: 'bold',     // Bold text for <h2> tags
              },
              'h3': {
                fontSize: 'lg',         // Size for <h3> headings
                fontWeight: 'bold',     // Bold text for <h3> tags
              },
              'h4': {
                fontSize: 'md',         // Size for <h4> headings
                fontWeight: 'bold',     // Bold text for <h4> tags
              },
              'h5': {
                fontSize: 'sm',         // Size for <h5> headings
                fontWeight: 'bold',     // Bold text for <h5> tags
              },
              'h6': {
                fontSize: 'xs',         // Size for <h6> headings
                fontWeight: 'bold',     // Bold text for <h6> tags
              },
            }}
          />



<Text
        style={{ color: "rgb(161 161 176)" }}
        mt={2}
        cursor="pointer"
        ml={3}
        fontWeight="normal"
        onClick={() => setShowFullText(!showFullText)}
      >
        {showFullText ? "less" : "Read more..."}
      </Text>
        </Box>

        <Box mt={10}>
      {/* Section Title */}
      {/* Tabs */}
      <Tabs variant="soft-rounded" colorScheme="gray" defaultIndex={0} >
  <TabList mb={4}>
    <Tab style={{ color: "rgb(161 161 176)", fontWeight: "bold", fontSize: "20px" }}>AMENITIES</Tab>
    {sections.map((section, index) => (
      <Tab
        key={index}
        _selected={{ color: "white", bg: section.colorScheme }}
        color={"rgb(161 161 176)"}
        fontSize={"14px"}
        fontWeight="bold"
        ml={4}
      >
        {section.title.toUpperCase()}
      </Tab>
    ))}
  </TabList>

  <TabPanels>
    <TabPanel>
      <Wrap spacing={4}>
        {(categorizedAmenities || []).flatMap((section) =>
          section.items.map((item, index) => (
            <WrapItem key={index}>
                <HStack
                    spacing={ 5}
                    pl={1}
                    pr={4}
                    py={'5px'}
                    border='1px solid'
                    borderColor='blackAlpha.300'
                    borderRadius="full"
                    bg="blackAlpha.50"

                    fontWeight='semibold'

                >
                    <Center bgColor={section.colorScheme} borderRadius='full' p={'5px'}>
                        <Icon color='white'  boxSize={5}  as={item.icon} />
                    </Center>

                    <Text fontSize="sm">{item.label}</Text>
                </HStack>
            </WrapItem>
          ))
        )}
      </Wrap>
    </TabPanel>

    {categorizedAmenities?.map((section, sectionIndex) => (
      <TabPanel key={sectionIndex}>
        <Wrap spacing={4}>
          {section.items.map((item, itemIndex) => (
            <WrapItem key={itemIndex}>
                <HStack
                    spacing={ 5}
                    pl={1}
                    pr={4}
                    py={'5px'}
                    border='1px solid'
                    borderColor='blackAlpha.300'
                    borderRadius="full"
                    bg="blackAlpha.50"

                    fontWeight='semibold'

                >
                    <Center bgColor={section.colorScheme} borderRadius='full' p={'5px'}>
                        <Icon color='white'  boxSize={5}  as={item.icon} />
                    </Center>

                    <Text fontSize="sm">{item.label}</Text>
                </HStack>
            </WrapItem>
          ))}
        </Wrap>
      </TabPanel>
    ))}
  </TabPanels>
</Tabs>


    </Box>
      </Box>

      {/* Right Column - Listing Owner */}

      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        maxHeight="210px"
      >
         <Box

            width="100%"
            border="1px solid" justifyContent="center"
            borderColor="gray.200"
            borderRadius="md"
            bg={'gray.50'}
          >
            <Text
              p={3}
              fontSize="xl"
              fontWeight="bold"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="wide"
              borderBottom="1px solid"
              borderColor="gray.200"
            >
              Posted By
            </Text>
        <Flex direction="row" cursor="pointer" onClick={()=>navigate(`/users/${annonce?.user?.id}`)} alignItems="flex-start"  p={3} _hover={{
          bg: "gray.100", // Background on hover
        }}
        >
          <Avatar
            src={annonce?.user?.profilePicture?.url}
            name={annonce?.user?.firstName + " " + annonce?.user?.lastName}
            borderRadius="full"

            mr={4}
          />
          <div>
          <Heading size="sm">{annonce?.user.firstName || 'Ayoub'} {annonce?.user?.personality && (
    <CheckCircleIcon color="darkcyan" mx={1} boxSize={4} />
  )}· {annonce?.user.age || 'N/A'}
           {/* <Badge
            ml={2}
            bg="green.100"   // Light green background
    color="green.800"
            borderRadius="md"
            px={2}
            py={0.5}
            fontSize="xs"
            fontWeight="semibold"
          >
            TODAY
          </Badge> */}
          </Heading>
          <Text textAlign="left"  color="gray.600" fontSize="smaller">
                  {annonce?.situation === 'NOT_LIVE_NO_PLAN'
            ? 'Not currently living there, no plans to move.'
            : annonce?.situation === 'NOT_LIVE_YET_PLAN'
            ? 'Not currently living there, but plans to move in soon.'
            : annonce?.situation === 'LIVE_MOVE_OUT'
            ? 'Currently living there, planning to move out.'
            : annonce?.situation === 'LIVE_ROOMMATE'
            ? 'Currently living there, looking for a roommate.'
            : 'Situation not specified.'}
          </Text>
          </div>
        </Flex>
        </Box>
          {
              Cookies.get("jwtToken") &&
              <Button colorScheme="blue" width="full" onClick={() => navigate(`/chat?receiverId=${annonce?.user.id}`)}>
                  Start a chat
              </Button>
          }

      </Box>
    </Flex>


      <NotificationModal
        title={notificationContent.title}
        description={notificationContent.description}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Report Modal */}
      {/* Report Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> 
            More deets, please!
          </ModalHeader>
          {/* Add the image here */}
          <Box display="flex" justifyContent="center" mt={-4} mb={4}>
            <img
              src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F23b4d640964e3d924b540388bada03d0.cdn.bubble.io%2Ff1663603576603x641413901490276200%2FFlagging.63aa34a9.png?w=192&h=192&auto=compress&dpr=1&fit=max" // Replace with your image URL
              alt="Illustration"
              style={{ maxWidth: '100px', borderRadius: '8px' }}
            />
          </Box>
          <ModalBody>
            <Text fontSize="md" mb={4}>
              Why are you flagging this listing?
            </Text>
            <RadioGroup onChange={setReportReason} value={reportReason}>
              <Stack spacing={3}>
                <Radio value="duplicate">It's a duplicate listing</Radio>
                <Radio value="inappropriate">It contains inappropriate content</Radio>
                <Radio value="misleading">It's incomplete or misleading</Radio>
                <Radio value="other">Other</Radio>
              </Stack>
            </RadioGroup>
            {reportReason === 'other' && (
              <Textarea
                placeholder="Please provide more details..."
                mt={4}
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button
              colorScheme="blue"
              ml={3}
              onClick={() => {
                handleReportSubmit();
                setNotificationContent({
                  title: 'Report Submitted',
                  description: 'Thank you for reporting this listing. We’ll look into it shortly.',
                });
                setIsModalOpen(true); // Show the notification modal
              }}
              isDisabled={
                !reportReason || (reportReason === 'other' && additionalDetails.trim() === '')
              }
            >
              Report it
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isModalImageOpen} onClose={() => setIsModalImageOpen(false)} isCentered>
  <ModalOverlay />
  <ModalContent
    position="relative"
    width="80%"
    height="90vh"
    maxWidth="none"
    borderRadius="md"
    overflow="hidden"
  >
    {/* Close Icon */}
    <Box
      position="absolute"
      top="10px"
      right="10px"
      zIndex="10"
      cursor="pointer"
      onClick={() => setIsModalImageOpen(false)}
    >
      <Icon viewBox="0 0 24 24" w={6} h={6} color="gray.600">
        <path
          fill="currentColor"
          d="M19.71 4.29a1 1 0 0 0-1.42 0L12 10.59 5.71 4.29a1 1 0 1 0-1.42 1.42L10.59 12l-6.3 6.29a1 1 0 1 0 1.42 1.42L12 13.41l6.29 6.3a1 1 0 1 0 1.42-1.42L13.41 12l6.3-6.29a1 1 0 0 0 0-1.42Z"
        />
      </Icon>
    </Box>

    {/* Slider */}
    <ModalBody
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      height="100%"
      padding={0}
      backgroundColor="blackAlpha.50"
    >
      {/* Left Arrow */}
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon boxSize={8} />}
        position="absolute"
        left="10px"
        top="50%"
        transform="translateY(-50%)"
        zIndex="10"
        borderRadius="full"
        background="rgba(0, 0, 0, 0.5)"
        color="white"
        _hover={{ background: 'rgba(0, 0, 0, 0.7)' }}
        onClick={() => handlePrevImage()}
      />

      {/* Image Container */}
      <Box
        width="70%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        <img
          src={images[selectedImage]}
          alt={`Slide ${selectedImage + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',

          }}
        />

        {/* Image Counter */}
        <Box
          position="absolute"
          bottom="20px" // Position at the bottom
          left="50%"
          transform="translateX(-50%)"
          backgroundColor="rgba(0, 0, 0, 0.7)"
          color="white"
          padding="5px 10px"
          borderRadius="12px"
          fontSize="sm"
          fontWeight="bold"
        >
          {`${selectedImage + 1} of ${images.length}`} {/* Current image / Total */}
        </Box>
      </Box>

      {/* Right Arrow */}
      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon boxSize={8} />}
        position="absolute"
        right="10px"
        top="50%"
        transform="translateY(-50%)"
        zIndex="10"
        borderRadius="full"
        background="rgba(0, 0, 0, 0.5)"
        color="white"
        _hover={{ background: 'rgba(0, 0, 0, 0.7)' }}
        onClick={() => handleNextImage()}
      />
    </ModalBody>
  </ModalContent>
</Modal>

    </Box>
  );
};

export default RentalListing;
