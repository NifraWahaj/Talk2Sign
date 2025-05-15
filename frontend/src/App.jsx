import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import VerifyCode from "./pages/VerifyCode";
import NewPassword from "./pages/NewPassword";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/Profile";
import DeleteAccount from "./pages/DeleteAccount";
import Translator from "./pages/Translator";
import YouTube from "./pages/YouTube";
import Upload from "./pages/Upload";
import FileProcessing from "./pages/FileProcessing";
import ExtractedTextPage from './pages/ExtractedTextPage';


import "./index.css"; // Ensure global styles are included


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/youtube" element={<YouTube />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/file-processing" element={<FileProcessing />} />
        <Route path="/extracted-text" element={<ExtractedTextPage />} />

        


      </Routes>
    </Router>
  );
};

export default App;
