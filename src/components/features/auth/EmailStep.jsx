import React, { useState } from "react";
import Modal from "../auth/Modal"; // Utilisation de votre composant Modal
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { LoginSocialFacebook } from "reactjs-social-login";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useToast, Spinner, Button } from "@chakra-ui/react";
import { loginWithGoogle, loginWithFacebook } from "../../../services/authService";

const EmailStep = ({ onClose, onContinue, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // État pour l'animation de chargement
  const navigate = useNavigate();
  const toast = useToast();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email to continue.",
        status: "warning", // Warning type
        duration: 3000, // Auto dismiss after 3 seconds
        isClosable: true, // User can close the toast
        position: "top", // Position of the toast
      });
      return;
    }
    setIsLoading(true); // Démarre le chargement
    setTimeout(() => {
      onContinue(email); // Transmet l'email au parent pour continuer
      setIsLoading(false); // Arrête le chargement
    }, 1500); // Simulated API delay for better user experience
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    try {
      setIsLoading(true); // Démarre le chargement
      const { token, user, isNewUser } = await loginWithGoogle(googleToken);

      // Notify parent of successful login
      onLoginSuccess({ token, user });

      Cookies.set("jwtToken", token, { expires: 7 });
      toast({
        title: "Login Successful",
        description: "You are now logged in with Google.",
        status: "success", // Toast status
        duration: 3000, // Auto-dismiss after 3 seconds
        isClosable: true, // Allow the user to close manually
        position: "top-right", // Professional position
      });

      onClose(); // Fermer le modal après la connexion
      if (isNewUser) {
        navigate("/profile"); // Redirect to the profile page only if this is the first login
      }
    } catch (error) {
      setIsLoading(false); // Arrête le chargement
      console.error("Erreur lors de la connexion avec Google :", error);
      toast({
        title: "Login Failed",
        description: "Failed to connect with Google.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false); // Arrête le chargement
    }
  };

  const handleFacebookResolve = async (response) => {
    const facebookToken = response.data.accessToken;
    try {
      setIsLoading(true);
      const { token, user, isNewUser } = await loginWithFacebook(facebookToken);
      // Notify parent of successful login
      onLoginSuccess({ token, user });
      Cookies.set("jwtToken", token, { expires: 7 });
      toast({
        title: "Login Successful",
        description: "You are now logged in with Facebook.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      onClose(); // Fermer le modal après la connexion
      if (isNewUser) {
        navigate("/profile"); // Redirect to the profile page only if this is the first login
      }
    } catch (error) {
      console.error("Erreur lors de la connexion avec Facebook :", error);
      toast({
        title: "Login Failed",
        description: "Failed to connect with Facebook.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId="153858025031-b5mein75ddils1t9gi2g087kmm8mg4l1.apps.googleusercontent.com">
      <Modal title="Welcome to CasaLink 👋" onClose={onClose}>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-blue-500 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm hover:shadow-md transition duration-200 placeholder-gray-400"
          />

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading} // Automatically handles spinner
            loadingText="" // Custom text while loading
          >
            Continue
          </Button>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <div className="space-y-4">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => console.log("Erreur de connexion avec Google")}
              useOneTap={false}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="w-full flex items-center justify-center bg-gray-100 border border-gray-300 py-3 rounded-lg hover:bg-gray-200 transition duration-200"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    alt="Google logo"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-gray-700">Continue with Google</span>
                </button>
              )}
            />
            <LoginSocialFacebook
              appId="1083016216600360"
              onResolve={(response) => {
                console.log("Connexion Facebook réussie :", response);
                handleFacebookResolve(response);
              }}
              onReject={(error) => {
                console.error("Erreur de connexion avec Facebook :", error);
                alert("Erreur de connexion avec Facebook");
              }}
            >
              <button className="w-full flex items-center bg-white-100 border border-gray-300 py-1 rounded-lg hover:bg-gray-200 transition duration-200">
                <div className="flex items-center w-10 justify-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                    alt="Facebook logo"
                    className="w-5 h-5"
                  />
                </div>
                <span className="flex-grow text-center text-gray-700">
                  Se connecter avec Facebook
                </span>
              </button>
            </LoginSocialFacebook>
          </div>
        </form>
      </Modal>
    </GoogleOAuthProvider>
  );
};

export default EmailStep;
