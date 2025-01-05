import React, { useState } from "react";
import Modal from "../auth/Modal"; // Utilisation de votre composant Modal

import { useToast } from "@chakra-ui/react";
const PasswordStep = ({ email, onClose, onSubmit }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement
  const toast = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast({
        title: "Missing Password",
        description: "Please enter your password to continue.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  
    setIsLoading(true); // Activer le chargement
    try {
      const success = await onSubmit(email, password); // Appeler la fonction parent
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back! You are now logged in.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred while processing your request. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false); // Désactiver le chargement
    }
  };
  

  const handleForgotPassword = async () => {
    setIsLoading(true); // Activer le chargement
    try {
      const response = await fetch("http://localhost:8762/user-security-service/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setPassword("");
        toast({
          title: "Email Sent",
          description: "A password reset email has been sent to your inbox.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        
      } else {
        toast({
          title: "Email Not Sent",
          description: "We couldn't send the password reset email. Please try again later.",
          status: "error",
          duration: 4000, // Slightly longer for better user notice
          isClosable: true, // Allow manual dismissal
          position: "top",
          variant: "left-accent", // Subtle styling with an accent color
        });
        
      }
    } catch (error) {
      toast({
        title: "Something Went Wrong",
        description: "We encountered an error while sending the reset email. Please try again shortly.",
        status: "error",
        duration: 5000, // Give users more time to read
        isClosable: true, // Allow manual dismissal
        position: "top-right", // Slightly different position for better visibility
        variant: "solid", // A bolder, eye-catching design
      });
      
    } finally {
      setIsLoading(false); // Désactiver le chargement
    }
  };

  return (
    <Modal title="Enter Your Password" onClose={onClose}>
      {/* Affichage du chargement au-dessus du modal */}
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 flex justify-center bg-blue-100 py-2">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-6 w-6"></div>
          <span className="ml-2 text-blue-500">Processing...</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500  focus:outline-none"
          disabled={isLoading} // Désactiver pendant le chargement
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          disabled={isLoading} // Désactiver pendant le chargement
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-blue-500 hover:underline focus:outline-none"
          disabled={isLoading} // Désactiver pendant le chargement
        >
          {isLoading ? "Sending..." : "Forgot Password?"}
        </button>
      </div>
    </Modal>
  );
};

export default PasswordStep;
