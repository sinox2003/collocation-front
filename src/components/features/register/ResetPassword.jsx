import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(""); // Indique la force du mot de passe
  const [showPassword, setShowPassword] = useState(false); // Un seul état pour afficher/masquer
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const evaluatePasswordStrength = (password) => {
    if (!password) return "";

    // Définir les conditions de force
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mediumPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    // Vérifier d'abord les mots de passe forts
    if (strongPasswordRegex.test(password)) {
      return "strong";
    }

    // Vérifier ensuite les mots de passe moyens
    if (mediumPasswordRegex.test(password)) {
      return "medium";
    }

    // Sinon, le mot de passe est faible
    return "weak";
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: null }));

    // Évaluer et mettre à jour la force du mot de passe
    const strength = evaluatePasswordStrength(value);
    setPasswordStrength(strength);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    if (passwordStrength === "weak") {
      setErrors({ password: "Password is too weak. Please choose a stronger password." });
      return;
    }

    try {
      const response = await fetch("http://localhost:8762/user-security-service/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.text();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful",
          text: "You will be redirected to the login page.",
        }).then(() => {
          navigate("/"); // Redirection vers la page d'accueil
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to Reset Password",
          text: result,
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire({
        icon: "error",
        title: "An error occurred",
        text: "Failed to reset password. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-20 mb-20 p-6 bg-white shadow-md rounded-lg ">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="relative">
          <label className="block text-gray-700 font-medium mb-2">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2 text-lg focus:ring-2 focus:outline-none ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-blue-500 focus:ring-blue-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // Toggle pour afficher/masquer
            className="absolute top-10 right-3 focus:outline-none "
          >
            <img
              src={showPassword ? "/view.png" : "/hide.png"}
              alt={showPassword ? "Hide password" : "Show password"}
              className="w-6 h-6 mt-1"
            />
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          {/* Feedback sur la force du mot de passe */}
          {passwordStrength && (
            <p
              className={`text-sm mt-2 ${
                passwordStrength === "strong"
                  ? "text-green-500"
                  : passwordStrength === "medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {passwordStrength === "strong"
                ? "Password strength: Strong"
                : passwordStrength === "medium"
                ? "Password strength: Medium"
                : "Password strength: Weak"}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"} // Même état pour afficher/masquer
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: null }));
            }}
            className={`w-full border rounded-lg px-4 py-2 text-lg focus:ring-2 focus:outline-none ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : "border-blue-500 focus:ring-blue-500"
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
