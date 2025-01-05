import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Avatar,
    Box, Button,
    Divider,
    Flex,
    IconButton,
    Image, Menu,
    MenuButton,
    MenuDivider, MenuItem,
    MenuList,
    Text,
    Tooltip, useDisclosure,

} from "@chakra-ui/react";
import {FaChevronLeft, FaChevronRight, FaRegEye} from "react-icons/fa";
import React, {useRef, useState} from "react";
import {Divide} from "lucide-react";
import {SlOptionsVertical} from "react-icons/sl";
import * as message from "zod";
import {HiOutlineDotsVertical} from "react-icons/hi";
import {PiPaperPlaneTiltBold} from "react-icons/pi";
import {TbArrowBackUp, TbHomeEdit, TbTrash} from "react-icons/tb";
import {useNavigate} from "react-router-dom";
import annoncesService from "../../../services/AnnoncesService";

export const MyListingCard = ({listing,index,deleteListing}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const navigate= useNavigate();

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

    const myListingNumber =()=>{
        const i = index + 1;
        if(i === 1){
            return "My 1st Listing"
        }else if(i === 2){
            return "My 2nd Listing"
        }else {
            return `My ${i}th Listing`
        }

    }

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
    const handleDeleteListing = ()=>{

        deleteListing(listing.id);
    }


    return (
        <Box
            bg="white"
            borderWidth="1px"
            _hover={{borderColor:'blackAlpha.300',shadow:'2xl'}}
            borderRadius="xl"
            cursor="pointer"
            position="relative"
            transition="box-shadow 0.3s ease"
        >
            {/* User Info */}
            {/*<IconButton aria-label={"options"} icon={<SlOptionsVertical size={15} />} position='absolute' variant='ghost' top={2} right={2} isRound />*/}
            <Menu isLazy autoSelect={false} lazyBehavior="unmount"  placement={"bottom-start"} >

                <Tooltip
                    label="Options"
                    bg={ 'white'}
                    color="black"
                    hasArrow
                    boxShadow={'xl'}
                    m={3}
                    placement="top"
                    p={2}
                    px={4}
                    borderRadius={9}
                >
                    <MenuButton
                        as={IconButton}
                        aria-label="options"
                        isRound
                        _hover={{
                            bg:  'blackAlpha.100',
                        }}
                        _active={{
                            bg: 'blackAlpha.100',
                        }}
                        icon={<SlOptionsVertical size={15} />}
                        position='absolute' variant='ghost' top={2} right={2}

                    />
                </Tooltip>
                <MenuList minW={"190px"} borderRadius="2xl" shadow={'2xl'}>
                    <Text px={3} fontSize="xs" color="gray" fontWeight="semibold" m={1}>Created the {formatDate(listing.createdAt)}</Text>
                    <MenuDivider />
                    <Box px={2}>

                        <MenuItem as={Button}  _hover={{ bg:'blackAlpha.50', }} _active={{ bg: 'blackAlpha.50', }} fontWeight={'500'} fontSize="sm"   justifyContent={'space-between'} onClick={()=>navigate(`/room-rental/${listing?.id}`)} rightIcon={<Box  sx={{ transform: 'rotate(10deg)' }} pb={1.5}><FaRegEye size={20} /></Box>}>View</MenuItem>
                    </Box>

                    <Box px={2}>
                        <MenuItem as={Button}  _hover={{ bg:'blackAlpha.50', }} _active={{ bg: 'blackAlpha.50', }} fontWeight={'500'} fontSize="sm"   justifyContent={'space-between'} onClick={()=>navigate(`edit/${listing?.id}`)} rightIcon={<TbHomeEdit  size={20} />}>Edit</MenuItem>
                    </Box>

                            <MenuDivider />
                    <Box px={2}>
                            <MenuItem as={Button}  onClick={handleDeleteListing} _hover={{ bg:'blackAlpha.50', }} _active={{ bg: 'blackAlpha.50', }} color={"#ED4932"}  fontWeight={'500'} fontSize="sm"   justifyContent={'space-between'} rightIcon={ <TbTrash size={'20'} strokeWidth={2} /> }>Delete</MenuItem>
                    </Box>
                </MenuList>


            </Menu>
            <Box p={4}>
             <Text fontWeight="semibold">{myListingNumber()}</Text>
            </Box>
            <Divider />
            <Text px={4} py={3} fontWeight="semibold">
                {listing.address.street}, {listing.address.city}, {listing.address.country}
            </Text>

            {/* Listing Image with Navigation */}
            <Box pos="relative" >
                <Image
                    src={listing.photos[currentImageIndex].url}
                    alt={listing.photos}
                    w="full"
                    h="48"
                    objectFit="cover"
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
                            zIndex="1"
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
                            zIndex="1"
                            borderRadius="50%"
                            fontSize="12px"
                        />
                    </>
                )}
            </Box>

            {/* Listing Details */}
            <Box p={4}>
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

                <Text mt={2}  color="gray.700" noOfLines={2}>
                    {getRoommatesText()}
                </Text>
            </Box>

        </Box>
    );
};