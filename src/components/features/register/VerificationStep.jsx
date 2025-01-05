import React, { useState } from "react";

import Modal from "../auth/Modal";
import { useToast } from "@chakra-ui/react";
const VerificationStep = ({ email, onClose }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      toast({
        title: "Verification Code Missing",
        description: "Please enter your verification code to proceed.",
        status: "warning",
        duration: 4000, // Slightly longer to ensure clarity
        isClosable: true, // Allow manual dismissal
        position: "top",
        variant: "subtle", // A softer, professional look
      });
      
      return;
    }

    setIsLoading(true); // Show loading state
    try {
      const response = await fetch("http://localhost:8762/user-security-service/api/users/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode }),
      });

      if (response.ok) {
        toast({
          title: "Account Verified",
          description: "Your account has been successfully verified! Welcome aboard!",
          status: "success",
          duration: 4000, // Slightly longer for a celebratory tone
          isClosable: true, // Allow manual dismissal
          position: "top",
          variant: "left-accent", // A sleek design with an accent
        });
        
        onClose(); // Close the modal
      } else {
        const errorText = await response.text();
        toast({
          title: "Verification Failed",
          description: errorText || "Invalid verification code. Please try again.",
          status: "error",
          duration: 4000, // Longer duration to allow users to read the message
          isClosable: true, // Allow manual dismissal
          position: "top-right", // Slightly different for better visibility
          variant: "solid", // Bold and attention-grabbing
        });
        
      }
    } catch (error) {
      console.error("Verification Error:", error);
      toast({
        title: "Verification Error",
        description: "An error occurred while verifying your account. Please try again later.",
        status: "error",
        duration: 4000, // Allowing more time for the user to read
        isClosable: true, // Allow manual dismissal
        position: "top", // Maintained position for clear visibility
        variant: "left-accent", // Subtle design with an accent for a professional look
      });
      
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  return (
    <Modal title="Verify Your Account" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full border rounded-md px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div
              className="loader w-5 h-5 border-2 border-solid rounded-full mr-2"
              style={{ borderWidth: "2px" }}
            ></div>
          ) : (
            "Verify"
          )}
        </button>
      </form>
    </Modal>
  );
};

export default VerificationStep;
