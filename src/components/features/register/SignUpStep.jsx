import React, { useState } from "react";
import { z } from "zod";
import Modal from "../auth/Modal";
import Cookies from "js-cookie"; // Import pour gérer les cookies
import { useToast } from "@chakra-ui/react";
import { loginWithUsernamePassword } from "../../../services/authService"; // Import du service d'authentification

// Zod Schema for Validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_-]{3,15}$/,
      "Username must be 3-15 characters and contain only letters, numbers, underscores, or dashes"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character (e.g., @$!%*?&)"),
  gender: z.enum(["H", "F"], "Gender is required"),
  age: z.number().min(1, "Age must be at least 1").max(150, "Age must be realistic"),
});

const SignUpStep = ({ email, onStepChange, onClose ,  setJwt, setUser }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    gender: "",
    age: "",
    role: "USER", // Default role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // Store validation errors
  const [usernameError, setUsernameError] = useState(""); // Server-side username errors
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Check Username Uniqueness
  const checkUsername = async (username) => {
    try {
      const response = await fetch("http://localhost:8762/user-security-service/api/users/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();

      if (data.exists) {
        setUsernameError("This username is already taken. Please choose another.");
      } else {
        setUsernameError(""); // Clear username error if valid
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError("An error occurred while checking the username.");
    }
  };

  const handleUsernameChange = (e) => {
    const username = e.target.value;
    setFormData({ ...formData, username });
    if (username) {
      checkUsername(username);
    } else {
      setUsernameError(""); // Clear error if field is empty
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle age as a number
    const parsedValue = name === "age" ? parseInt(value, 10) || "" : value;

    setFormData({ ...formData, [name]: parsedValue });

    try {
      const fieldSchema = z.object({ [name]: formSchema.shape[name] });
      fieldSchema.parse({ [name]: parsedValue });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null })); // Clear error for this field
    } catch (validationError) {
      if (validationError.errors) {
        const fieldError = validationError.errors.find((err) => err.path[0] === name);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldError.message }));
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        formSchema.parse(formData); // Validate formData using Zod

        // Récupérer le `fcmToken` depuis les cookies
        const deviceToken = Cookies.get("fcmToken");

        // Step 1: Register the user
        const registerResponse = await fetch("http://localhost:8762/user-security-service/api/users/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, email, deviceToken }), // Inclure le fcmToken
        });

        if (registerResponse.ok) {
            // Step 2: Authenticate the user and fetch JWT and user details
            const { token, user } = await loginWithUsernamePassword(email, formData.password);

            // Update the parent state
            setJwt(token);
            setUser(user);

            // Stocke les détails dans des cookies séparés
            Cookies.set("jwtToken", token, { expires: 7 });
            Cookies.set("userId", user.id, { expires: 7 });
            Cookies.set("userName", user.name, { expires: 7 });
            Cookies.set("userEmail", user.email, { expires: 7 });

            // Show success message
            toast({
              title: "Registration Complete 🎉",
              description: "You have been registered and logged in successfully! Welcome aboard!",
              status: "success",
              duration: 4000, // Longer duration for a celebratory tone
              isClosable: true, // Allow manual dismissal
              position: "top-right", // Professional placement
              variant: "solid", // Bold and celebratory
            });
            

            onStepChange("verification"); // Move to verification step
        } else {
            const errorData = await registerResponse.json();
            toast({
              title: "Registration Failed",
              description: errorData.message || "An error occurred during registration. Please try again.",
              status: "error",
              duration: 4000, // Slightly longer duration to allow the user to read
              isClosable: true, // Allow manual dismissal
              position: "top", // Maintained position for immediate visibility
              variant: "left-accent", // Professional styling with a subtle accent
            });
            
        }
    } catch (error) {
        console.error("Error during registration or authentication:", error);
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred. Please try again later.",
          status: "error",
          duration: 4000, // A bit longer to ensure clarity
          isClosable: true, // Allow the user to dismiss the toast manually
          position: "top", // Retain top position for visibility
          variant: "solid", // Bold and clear design
        });
        
    } finally {
        setIsLoading(false); // Disable loading state
    }
};




  return (
    <Modal title="Finish signing up" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 ">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full border ${errors.firstName ? "border-red-500" : ""
                } rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full border ${errors.lastName ? "border-red-500" : ""
                } rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleUsernameChange}
              className={`w-full border  ${usernameError || errors.username ? "border-red-500" : ""
                } rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500  focus:outline-none`}
            />
            {(usernameError || errors.username) && (
              <p className="text-red-500 text-sm">{usernameError || errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border ${errors.password ? "border-red-500" : ""
                } rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-11 right-3"
            >
              <img
                src={showPassword ? "/view.png" : "/hide.png"}
                alt={showPassword ? "Hide password" : "Show password"}
                className="w-6 h-6"
              />
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full border ${errors.age ? "border-red-500" : ""
                } rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full border ${errors.gender ? "border-red-500" : ""
                } rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            >
              <option value="">Select Gender</option>
              <option value="H">Male</option>
              <option value="F">Female</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>
        </div>

        <p className="text-sm text-gray-600 text-center">
          By selecting{" "}
          <span className="font-semibold">Agree and Continue</span>, I agree to Roomi's{" "}
          <a href="#" className="text-blue-500 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500 underline">
            Privacy Policy
          </a>
          .
        </p>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-3 rounded-lg ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            } transition duration-200 text-lg shadow-lg`}
          disabled={isLoading} // Désactivez pendant le chargement
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={() => onStepChange("email")}
          className="mt-4 w-full text-gray-500 hover:text-gray-800 text-center text-lg"
        >
          Re-enter my email
        </button>
      </form>
    </Modal>
  );
};

export default SignUpStep;
