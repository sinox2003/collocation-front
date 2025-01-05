import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const NotificationModal = ({ title, description, isOpen, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen && !isHovered) {
      timer = setTimeout(() => {
        onClose();
      }, 5000);
    }
    return () => clearTimeout(timer); // Clear the timer if the component unmounts or `isOpen` changes
  }, [isOpen, isHovered, onClose]);

  const handleMouseEnter = () => {
    setIsHovered(true); // Prevent the notification from disappearing
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // Restart the timer when the mouse leaves
  };

  return (
    isOpen && (
      <Box
        position="fixed"
        top="4"
        right="4"
        zIndex="1000"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Alert status="success" variant="left-accent">
          <AlertIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription mr={6}>{description}</AlertDescription>
          <CloseButton position="absolute" right="8px" top="8px" onClick={onClose} />
        </Alert>
      </Box>
    )
  );
};

export default NotificationModal;
