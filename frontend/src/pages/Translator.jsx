import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "regenerator-runtime/runtime"; // Fixes regeneratorRuntime error
import "./Translator.css";
import SubNavbar from "../components/SubNavbar";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Translator = () => {
  const [isConverted, setIsConverted] = useState(false);
  const [convertedText, setConvertedText] = useState("");
  const [isTextareaDisabled, setIsTextareaDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState("Audio/Text");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    toast.error("Speech Recognition is not supported in this browser.", { position: "top-center" });
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleStartRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    setIsTextareaDisabled(true);
    toast.info("Recording started...", { position: "top-center" });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    setIsTextareaDisabled(false);
    toast.info("Recording stopped.", { position: "top-center" });
  };

  const handleConvert = async () => {
    const textToSend = transcript.trim() || convertedText.trim();
    
    if (!textToSend) {
      toast.error("Please record audio or type some text before converting.", { position: "top-center" });
      return;
    }

    setConvertedText(textToSend);
    setIsConverted(true);

    // Send text to backend
    try {
      const response = await fetch("http://127.0.0.1:5000/api/store-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Text sent successfully to backend.", { position: "top-center" });
      } else {
        toast.error(data.error || "Failed to send text.", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error connecting to server. Ensure backend is running.", { position: "top-center" });
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.", { position: "top-center" });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setConvertedText(data.text);
        setIsConverted(true);
      } else {
        toast.error(data.error || "Transcription failed.", { position: "top-center" });
      }
    } catch (err) {
      toast.error("Error connecting to the server. Check backend is running!", { position: "top-center" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="translator-page">
      <SubNavbar
        tabs={["Audio/Text", "Upload", "Youtube"]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="translator-container">
        <div className="translator-content-wrapper">
          {/* Left Section */}
          <div className="translator-text-container">
            {isConverted ? (
              <div className="translator-converted-text">{convertedText}</div>
            ) : (
              <textarea
                className="translator-text-input"
                placeholder="Start recording or type your message"
                value={listening ? transcript : convertedText}
                readOnly={listening}
                disabled={isTextareaDisabled}
                onChange={(e) => setConvertedText(e.target.value)}
              ></textarea>
            )}

            {/* Action Buttons */}
            <div className="translator-action-buttons">
              {isConverted ? (
                <button className="translator-convert-button">Converted Output</button>
              ) : (
                <>
                  {listening ? (
                    <button className="translator-record-button" onClick={handleStopRecording}>
                      Stop Recording
                    </button>
                  ) : (
                    <button className="translator-record-button" onClick={handleStartRecording}>
                      Start Recording
                    </button>
                  )}
                  <button className="translator-convert-button" onClick={handleConvert}>
                    Convert & Send to Backend
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Section: File Upload */}
          <div className="translator-upload-section">
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button className="translator-upload-button" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload & Transcribe"}
            </button>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Translator;
