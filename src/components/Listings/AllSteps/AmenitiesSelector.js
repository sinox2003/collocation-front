import React, {useEffect, useState} from "react";
import {
    Box,
    Flex,
    Icon,
    Text,
    VStack,
    Wrap,
    WrapItem,
    HStack, Center,
} from "@chakra-ui/react";
import {
    FaPaw,
    FaWifi,
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
    FaShieldAlt,
    FaExclamationCircle,
} from "react-icons/fa";
import { BiHandicap } from "react-icons/bi";
import { MdStairs } from "react-icons/md";

export default function AmenitiesSelector({updateFormData,formData}) {
    const sections = [
        {
            title: "In the home",
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
            title: "On the property",
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


    const [selected, setSelected] = useState(formData.amenities || []);

    const toggleAmenity = (label) => {
        setSelected((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
        //
    };
    useEffect(()=>{
        updateFormData('amenities',selected)

    },[selected])

    return (
        <VStack align="start" px={9} spacing={8}>
            {sections.map((section) => (
                <Box key={section.title} width="100%">
                    {/* Section Title */}
                    <Text fontSize="lg"  fontWeight="bold" mb={5}>
                        {section.title}
                    </Text>

                    {/* Amenities Items */}
                    <Wrap spacing="17px" >
                        {section.items.map((item) => (
                            <WrapItem key={item.label}>
                                <HStack
                                    spacing={ 5}
                                    pl={1}
                                    pr={4}
                                    py={'5px'}
                                    border='1px solid'
                                    borderColor='blackAlpha.300'
                                    borderRadius="full"
                                    bg={
                                        selected.includes(item.value)
                                            ? `${section.colorScheme}`
                                            : "blackAlpha.50"
                                    }
                                    color={
                                        selected.includes(item.value)
                                            ? "white"
                                            : `black`
                                    }
                                    fontWeight='semibold'
                                    cursor="pointer"
                                    onClick={() => toggleAmenity(item.value)}
                                    _hover={{
                                        bg: selected.includes(item.value)
                                            ? `${section.colorScheme}`
                                            : "blackAlpha.100",
                                    }}
                                >
                                    <Center bgColor={section.colorScheme} borderRadius='full' p={'5px'}>
                                        <Icon color='white'  boxSize={5} siz as={item.icon} />
                                    </Center>

                                    <Text fontSize="sm">{item.label}</Text>
                                </HStack>
                            </WrapItem>
                        ))}
                    </Wrap>
                </Box>
            ))}
        </VStack>
    );
}
