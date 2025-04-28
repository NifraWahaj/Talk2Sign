import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "regenerator-runtime/runtime"; // Fix regeneratorRuntime error
import "./Translator.css";
import SubNavbar from "../components/SubNavbar";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Translator = () => {
  const [isConverted, setIsConverted] = useState(false);
  const [convertedText, setConvertedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTextareaDisabled, setIsTextareaDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState("Audio/Text");

// at top of Translator component
const [videoUrl, setVideoUrl] = useState("");
const [isVideoLoading, setIsVideoLoading] = useState(false);
const generateVideo = async (text) => {
  setIsVideoLoading(true);
  try {
    const res = await fetch("http://127.0.0.1:5000/api/generate-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (res.ok) {
      // prepend host for video src
      setVideoUrl(`http://127.0.0.1:5000${data.video_url}`);
    } else {
      toast.error(data.error || "Video generation failed");
    }
  } catch (err) {
    toast.error("Cannot connect to server");
  } finally {
    setIsVideoLoading(false);
  }
};

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // Check browser support
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    toast.error("Speech Recognition Whisper API is not supported in this browser.", {
      position: "top-center",
    });
    console.error("Browser does not support speech recognition.");
    return <p>Your browser does not support speech recognition.</p>;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(`Active tab changed to: ${tab}`);
  };

  const handleStartRecording = () => {
    console.log("Starting recording...");
    resetTranscript(); // Clear previous transcription
    SpeechRecognition.startListening({ continuous: true });
    setIsTextareaDisabled(true);
    toast.info("Recording started...", { position: "top-center" });
  };

  const handleStopRecording = () => {
    console.log("Stopping recording...");
    SpeechRecognition.stopListening();
    setIsTextareaDisabled(false);
    toast.info("Recording stopped.", { position: "top-center" });
    console.log("Final transcript:", transcript);
  };

  const handleConvert = async () => {
    const textToSend = transcript.trim() || convertedText.trim();
    if (!textToSend) {
      toast.error("Please record audio or type some text before converting.");
      return;
    }
  
    setConvertedText(textToSend);
    setIsConverted(true);
  
    try {
      // use “response” here…
      const response = await fetch("http://127.0.0.1:5000/api/store-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });
      const data = await response.json();
  
      if (response.ok) {
        setTranslatedText(data.translated_text);
        toast.success("Text translated successfully.");
        // …then trigger video gen
        await generateVideo(textToSend);
      } else {
        toast.error(data.error || "Failed to translate text.");
      }
    } catch (err) {
      toast.error("Error connecting to server. Ensure backend is running.");
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
        setTranslatedText(data.translated_text); // Store translated text
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
            <textarea
              className="translator-text-input"
              placeholder="Start recording or type your message"
              value={listening ? transcript : convertedText}
              readOnly={listening}
              disabled={isTextareaDisabled}
              onChange={(e) => setConvertedText(e.target.value)}
            ></textarea>

            {/* Display Translated Text */}
            {translatedText && (
              <div className="translator-output">
                <strong>Translated Text:</strong>
                <p>{translatedText}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="translator-action-buttons">
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
                Convert 
              </button>
            </div>
          </div>
           {/* Right Section */}
      
{/* after translator-content-wrapper */}
{isConverted && (
  <div className="video-wrapper">
    {isVideoLoading
      ? <p>Loading video…</p>
      : videoUrl && <video controls autoPlay>
          <source src={videoUrl} type="video/mp4" />
        </video>
    }
  </div>
)}



        </div>

        </div>

        {/* Toast Container */}
        <ToastContainer />
    </div>
  );
};

export default Translator;