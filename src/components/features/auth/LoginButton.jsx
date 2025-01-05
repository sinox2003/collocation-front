import React, { useState } from "react";
import EmailStep from "./EmailStep";
import PasswordStep from "./PasswordStep";
import SignUpStep from "./SignUpStep";
import VerificationStep from "./VerificationStep";

const LoginButton = () => {
  const [step, setStep] = useState("enterEmail"); // Gestion des étapes
  const [email, setEmail] = useState(""); // Email partagé entre étapes
  const [isUserExists, setIsUserExists] = useState(false); // Indicate si l'utilisateur existe

  const handleEmailSubmit = async (email) => {
    setEmail(email);
    try {
      const response = await fetch("http://localhost:8762/user-security-service/api/users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }); 
      const data = await response.json();
      setIsUserExists(data.exists);
      setStep(data.exists ? "enterPassword" : "signUp");
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={() => setStep("enterEmail")}
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
      >
        Log in
      </button>
      {step === "enterEmail" && <EmailStep onSubmit={handleEmailSubmit} />}
      {step === "enterPassword" && <PasswordStep email={email} />}
      {step === "signUp" && <SignUpStep email={email} />}
      {step === "verifyAccount" && <VerificationStep email={email} />}
    </div>
  );
};

export default LoginButton;
