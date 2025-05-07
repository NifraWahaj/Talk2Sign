// src/pages/ExtractedTextPage.jsx

import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ExtractedTextPage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubNavbar from "../components/SubNavbar";

const ExtractedTextPage = () => {
  const location = useLocation();
  const initialText = location.state?.extractedText || "";
// Missing this in your ExtractedTextPage
const [activeTab, setActiveTab] = useState("Audio/Text");

  // OCR → translation → ASL state
  const [extractedText, setExtractedText] = useState(initialText);
  const [translatedText, setTranslatedText] = useState("");
  const [signUrl, setSignUrl] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [playDisabled, setPlayDisabled] = useState(false);

  const videoRef = useRef(null);

  // 1. On extractedText change: translate, then generate ASL
  useEffect(() => {
    if (!extractedText.trim()) return;
  
    const runWorkflow = async () => {
      console.log("OCR text changed:", extractedText);
  
      // 1) Facade backend call (ignored response)
      await generateBackendVideo(extractedText);
  
      // 2) Translate text
      console.log("Translating:", extractedText);
      const resp = await fetch("http://127.0.0.1:5000/api/store-text",  {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });
      const { translated_text } = await resp.json();
      console.log("Translated:", translated_text);
  
      // 3) Generate ASL
      await generateASL(translated_text);
    };
  
    runWorkflow();
  }, [extractedText]);
  

  // Facade backend (ignored response)
  const generateBackendVideo = async (text) => {
    try {
      console.log("Facade: POST /api/generate-video", text);

      await fetch("http://127.0.0.1:5000/api/generate-video", {
        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
          console.log("Facade: request sent");

    } catch (err) {
      console.warn("Facade video error", err);
    }
  };

  // genASL AWS call: only SignURL
  const generateASL = async (text) => {
    console.log("genASL: requesting SignURL for:", text);
    setIsVideoLoading(true);
    setSignUrl("");
    setVideoError("");
  
    try {
      const res = await fetch(
        `https://z9h9o5zceb.execute-api.us-west-2.amazonaws.com/prod/sign?Text=${encodeURIComponent(
          text
        )}`
      );
      console.log("genASL response status:", res.status);
  
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { SignURL } = await res.json();
      console.log("genASL received SignURL:", SignURL);
  
      setSignUrl(SignURL);
    } catch (err) {
      console.error("genASL error:", err);
      setVideoError("Failed to load ASL video.");
      toast.error("ASL video generation failed.", { position: "top-center" });
    } finally {
      setIsVideoLoading(false);
      setPlayDisabled(false);
    }
  };
  

  // Play / Pause controls
  const handlePlay = () => {
    setPlayDisabled(true);
    videoRef.current?.play().catch(console.error);
  };
  const handlePause = () => {
    videoRef.current?.pause();
    setPlayDisabled(false);
  };

  return (
    <div className="extracted-text-page">
       <SubNavbar
        tabs={["Audio/Text", "Upload", "Youtube"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="extracted-text-container">

        {/* ASL Video */}
        <div className="asl-video-placeholder">
          {isVideoLoading && <p>Loading video…</p>}
          {videoError && <p className="error">{videoError}</p>}
          {!isVideoLoading && signUrl && (
            <video
              ref={videoRef}
              className="asl-video"
              controls
              autoPlay
              muted
              loop
            >
              <source src={signUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Text & Controls */}
        <div className="extracted-right-content">
          <div className="extracted-text-content">
            <strong>Extracted Text:</strong>
            <p>
              {extractedText || "No text extracted."}
            </p>
          </div>
    
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ExtractedTextPage;
