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

import { Navigate } from 'react-router-dom';

import "./index.css"; // Ensure global styles are included

const PrivateRoute = ({ element: Element }) => {
  return localStorage.getItem('token')
    ? <Element />
    : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
         {/* public */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUs />} />  
        {/* protected */}
        <Route path="/profile" element={<PrivateRoute element={Profile} />} />
        <Route path="/translator" element={<PrivateRoute element={Translator} />} />
        <Route path="/youtube" element={<PrivateRoute element={YouTube} />} />
        <Route path="/upload" element={<PrivateRoute element={Upload} />} />
        <Route path="/file-processing" element={<PrivateRoute element={FileProcessing} />} />
        <Route path="/extracted-text" element={<PrivateRoute element={ExtractedTextPage} />} />
        <Route path="/forgot-password" element={<PrivateRoute element={ResetPassword} />} />
        <Route path="/delete-account" element={<PrivateRoute element={DeleteAccount} />} />
        <Route path="/translator" element={<PrivateRoute element={VerifyCode} />} />
        <Route path="/new-password" element={<PrivateRoute element={NewPassword} />} />

      </Routes>
    </Router>
  );
};

export default App;
