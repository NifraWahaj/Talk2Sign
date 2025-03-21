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
  const [isTextareaDisabled, setIsTextareaDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState("Audio/Text");

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

  const handleConvert = () => {
    if (!transcript.trim() && !convertedText.trim()) {
      toast.error("Please record audio or type some text before converting.", {
        position: "top-center",
      });
      return;
    }

    setConvertedText(transcript || convertedText);
    setIsConverted(true);
    console.log("Converted text:", transcript || convertedText);
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
                id="translator-input-text"
                className="translator-text-input"
                placeholder="Start recording or type your message"
                value={listening ? transcript : convertedText} // Show transcription during recording
                readOnly={listening} // Make read-only only during transcription
                disabled={isTextareaDisabled} // Disable when recording
                onChange={(e) => setConvertedText(e.target.value)} // Allow typing
              ></textarea>
            )}

            {/* Action Buttons */}
            <div className="translator-action-buttons">
              {isConverted ? (
                <>
                  <button className="translator-convert-button">
                    Converted Output
                  </button>
                </>
              ) : (
                <>
                  {listening ? (
                    <button
                      className="translator-record-button"
                      onClick={handleStopRecording}
                    >
                      Stop Recording
                    </button>
                  ) : (
                    <button
                      className="translator-record-button"
                      onClick={handleStartRecording}
                    >
                      Start Recording
                    </button>
                  )}
                  <button
                    className="translator-convert-button"
                    onClick={handleConvert}
                  >
                    Convert
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Section */}
          {isConverted && (
            <div className="translator-avatar-placeholder">
              <p className="translator-placeholder-text">Avatar animation goes here</p>
            </div>
          )}
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Translator;