import React, { useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  IconButton, Avatar, Badge,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {useNavigate} from "react-router-dom"; // Import des icônes React Icons

const ListingCard = ({ listing,onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.photos.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDurationText = () => {
    if (listing.duration === 'FIXED') {
      return formatDate(listing.availableTo);
    } else if (listing.duration === 'TWELVE_MONTHS') {
      return '12 months';
    } else if (listing.duration === 'FLEXIBLE') {
      return 'Flexible';
    }
    return null;
  };

  const getLayoutText = () => {
    if (listing.layoutType === 'PRIVATE_ROOM') {
      return 'Private Room';
    } else if (listing.layoutType === 'SHARED') {
      return 'Shared Place';
    } else if (listing.layoutType === 'ENTIRE_PLACE') {
      return 'Entire Place';
    }
    return null;
  };

  const getBedroomsText = () => {
    if (listing.bedrooms === 0) {
      return 'Studio';
    } else{
      return `${listing.bedrooms} bedrooms`
    }
  };

  const getRoommatesText = () => {
    if (listing.numberOfRoommates === 0) {
      return 'No Roommate';
    } else if(listing.numberOfRoommates === 1){
      return '1 Roommate'
    } else {
      return `${listing.numberOfRoommates} Roommates`
    }
  };


  return (
    <Box
        bg="blackAlpha.50"
      borderWidth="1px"
      borderRadius="lg"

      overflow="hidden"
      cursor="pointer"
      _hover={{ shadow: '2xl',borderColor:"blackAlpha.300" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      transition="box-shadow 0.3s ease"

    >
      {/* User Info */}
      <Flex  p={4} onClick={()=>navigate(`/users/${listing.user.id}`)}>
        <Avatar
          size="sm"
          name={listing.user.username}
          src={listing.user.profilePicture}
          w="10"
          h="10"
        />
        <Box ml={3}>
          <Flex align="center">
            <Text fontWeight="semibold">{listing.user.username}</Text>
          </Flex>
          <Flex fontSize="sm">
            {listing.numberOfRoommates > 0 && (

              <Badge colorScheme='purple' px='6px' borderRadius='lg'  >{getRoommatesText()}</Badge>

            )}
          </Flex>
        </Box>
      </Flex>

      {/* Listing Image with Navigation */}
      <Box pos="relative" >
        <Image
          src={listing.photos[currentImageIndex].url}
          alt={listing.photos}
          w="full"
          h="48"
          objectFit="cover"
          onClick={onClick}
        />
        {listing.photos.length > 1 && (
          <>
            <IconButton
              icon={<FaChevronLeft />}
              aria-label="Previous Image"
              pos="absolute"
              top="50%"
              left="5px"
              transform="translateY(-50%)"
              onClick={handlePrevImage}
              bg="transparent"
              _hover={{ bg: 'gray.200' }}
              zIndex="5"
              borderRadius="50%"
              fontSize="12px" 
            />
            <IconButton
              icon={<FaChevronRight />}
              aria-label="Next Image"
              pos="absolute"
              top="50%"
              right="5px"
              transform="translateY(-50%)"
              onClick={handleNextImage}
              bg="transparent"
              _hover={{ bg: 'gray.200' }}
              zIndex="5"
              borderRadius="50%" 
              fontSize="12px" 
            />
          </>
        )}
      </Box>

      {/* Listing Details */}
      <Box p={4} onClick={onClick}>
        <Flex align="center">
          <Text fontSize="2xl" fontWeight="bold">${listing.price}</Text>
          <Text color="gray.500"  fontSize="md" fontWeight="semibold"  ml={2}>/ mo</Text>
        </Flex>
        <Text mt={2} fontWeight="semibold">
          {getLayoutText()} • {getBedroomsText()} • {listing.propertyType}
        </Text>
        <Text mt={2} fontWeight="semibold" color="gray.500">
          {formatDate(listing.availableFrom)} - {getDurationText()}
        </Text>

        <Text mt={2} color="gray.700" noOfLines={2}>
          {listing.address.street}, {listing.address.city}, {listing.address.country}
        </Text>
      </Box>
    </Box>
  );
};

export default ListingCard;
