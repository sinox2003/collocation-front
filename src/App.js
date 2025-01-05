import './App.css';
import {Box, ChakraProvider, Spinner} from '@chakra-ui/react';
import Profile from "./components/features/profile/Profile";
import Home from "./pages/Home"
import React, {Suspense, useEffect} from "react";
import { generateToken } from './components/notification/firebase';
import ResetPassword from "./components/features/register/ResetPassword";
import UserDetails  from './pages/UserDetails';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import UsersList from "./pages/UsersList";
import FirstPage from "./pages/FirstPage";
import Steps from './components/Listings/AllSteps/Steps';
import PersonalityQuiz from './pages/PersonalityQuiz';
import RentalListing from './components/RentalListing';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AuthenticatedGuard from './gaurds/AuthenticatedGuard';
import NoAuthenticatedGuard from './gaurds/NoAuthenticatedGuard';
import Listings from "./components/Listings/AllSteps/Listings";
import ListingsPage from "./pages/ListingsPage";
import EditingSteps from "./components/Listings/AllSteps/EditingSteps";
import {ProfilePage} from "./pages/ProfilePage";
import {UserRequest} from "./components/features/profile/UserRequest";


function App() {
  useEffect(() => {
    // Generate the FCM token and store it in a cookie
    generateToken()
      .then((token) => {
        if (token) {
          // Set the token in a cookie
          document.cookie = `fcmToken=${token}; path=/; max-age=31536000;`; // Set cookie for 1 year
          console.log('FCM Token stored in cookie:', token);
        }
      })
      .catch((error) => {
        console.error('Error generating FCM token:', error);
      });

    // Register the service worker to handle background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Error registering Service Worker:', error);
        });
    }
  }, []);
  return (
    <ChakraProvider>
      <Router >

        <Header></Header>
        <Suspense fallback={<Box h="calc(100vh - 56px)" ><Spinner size="xl" color="teal.500" /></Box>} >
          <Routes>
            <Route path="/" element={<AuthenticatedGuard> <Home /></AuthenticatedGuard>} />
            <Route path="/chat" element={<AuthenticatedGuard><ChatPage /></AuthenticatedGuard>} />
            <Route path="/home" element={<NoAuthenticatedGuard><FirstPage /></NoAuthenticatedGuard>} />
            <Route path="/reset-password" element={<AuthenticatedGuard><ResetPassword /></AuthenticatedGuard>} />
            <Route path="/profile" element={<AuthenticatedGuard><ProfilePage /></AuthenticatedGuard>} >
              <Route index element={<UserRequest />} />
              <Route path="edit" element={<Profile/>} />
            </Route>
            <Route path="/users" element={<AuthenticatedGuard><UsersList /></AuthenticatedGuard>} />
            <Route path="/users/:id" element={<AuthenticatedGuard><UserDetails /></AuthenticatedGuard>} />
            <Route path="/Listing" element={<AuthenticatedGuard><ListingsPage /></AuthenticatedGuard>} >
              <Route index element={<Listings />} />
              <Route path="create" element={<Steps/>} />
              <Route path="edit/:annonceId" element={<EditingSteps />} />
            </Route>
            <Route path="/quiz" element={<AuthenticatedGuard><PersonalityQuiz /></AuthenticatedGuard>} />
            <Route path="/room-rental/:id" element={<RentalListing />} /> {/* Route pour RentalListing */}
          </Routes>
        </Suspense>
        <Footer></Footer>
      </Router>
    </ChakraProvider>
  );

}

export default App;



