import React from 'react';
import { Box, Flex, Text, Link, Icon, VStack, HStack, Divider } from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.900" color="gray.300" py={10} px={6} mt="auto">
      <Flex direction="column" maxW="container.xl" mx="auto">
        {/* Logo and Tagline */}
        <Flex direction={{ base: "column", md: "row" }} align="center" justify="space-between" mb={8}>
          <HStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" color="pink.400">CasaLink</Text>
            <Text fontSize="sm" color="gray.400">| La colocation de tes rêves est entre tes mains!</Text>
          </HStack>
        </Flex>

        <Divider borderColor="gray.700" mb={8} />

        {/* Footer Columns */}
        <Flex 
          direction={{ base: "column", md: "row" }} 
          justify="space-between" 
          wrap="wrap" 
          spacing={8}
        >
          {/* Social Media and Contact */}
          <VStack align="start" spacing={4} mb={6}>
            <Text fontWeight="bold" fontSize="lg" color="pink.400">Suivez-nous</Text>
            <HStack spacing={4}>
              <Link href="#" _hover={{ color: 'pink.300' }}>
                <Icon as={FaFacebook} boxSize={6} />
              </Link>
              <Link href="#" _hover={{ color: 'pink.300' }}>
                <Icon as={FaTwitter} boxSize={6} />
              </Link>
              <Link href="#" _hover={{ color: 'pink.300' }}>
                <Icon as={FaInstagram} boxSize={6} />
              </Link>
              <Link href="#" _hover={{ color: 'pink.300' }}>
                <Icon as={FaLinkedin} boxSize={6} />
              </Link>
              <Link href="#" _hover={{ color: 'pink.300' }}>
                <Icon as={FaYoutube} boxSize={6} />
              </Link>
            </HStack>
            <Link href="https://www.casalink.com" fontWeight="bold" fontSize="sm" _hover={{ color: 'pink.300' }}>
              www.casalink.com
            </Link>
          </VStack>

          {/* Navigation Links */}
          <VStack align="start" spacing={4} mb={6}>
            <Text fontWeight="bold" fontSize="lg" color="pink.400">Navigation</Text>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>Trouver un colocataire</Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>Créer une annonce</Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>Nos partenaires</Link>
          </VStack>

          {/* Assistance */}
          <VStack align="start" spacing={4} mb={6}>
            <Text fontWeight="bold" fontSize="lg" color="pink.400">Assistance</Text>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>Foire aux questions</Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>Contact</Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>Support technique</Link>
          </VStack>

          {/* Legal Information */}
          <VStack align="start" spacing={4} mb={6}>
            <Text fontWeight="bold" fontSize="lg" color="pink.400">Informations légales</Text>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>Conditions générales d'utilisation</Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>Politique de confidentialité</Link>
            <Link href="#" _hover={{ textDecoration: 'underline' }}>Politique de cookies</Link>
          </VStack>
        </Flex>

        <Divider borderColor="gray.700" mt={8} />

        {/* Copyright */}
        <Text fontSize="sm" textAlign="center" mt={4} color="gray.500">
          © 2024 <Text as="span" color="pink.400">CasaLink</Text>. Tous droits réservés.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
