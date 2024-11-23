import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Translator.css";
import SubNavbar from "../components/SubNavbar";

const Translator = () => {
  const [isConverted, setIsConverted] = useState(false);
  const [convertedText, setConvertedText] = useState("");
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTextareaDisabled, setIsTextareaDisabled] = useState(false);
  const [isRecordingStopped, setIsRecordingStopped] = useState(false); // Tracks if recording is complete

  const [activeTab, setActiveTab] = useState("Audio/Text");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(`Active tab changed to: ${tab}`);
  };

  const handleConvert = () => {
    if (inputText.trim() === "" && !isRecordingStopped) {
      toast.error("Please type some text or record audio before converting.", {
        position: "top-center",
      });
      return; // Prevent conversion if neither text nor recording exists
    }

    setConvertedText(
      isRecordingStopped
        ? "Converted content from audio recording will appear here." // Placeholder text for recording
        : inputText
    );
    setIsConverted(true); // Trigger converted view
    setIsTextareaDisabled(true); // Keep textarea disabled after conversion
    setIsRecordingStopped(false); // Reset recording flag
  };

  const handleStartRecording = () => {
    if (inputText.trim() !== "") {
      // Show toast if text exists when clicking "Start Recording"
      toast.warn("Cannot start recording while text exists. Clear the text first.", {
        position: "top-center",
      });
      return; // Prevent recording
    }
    setIsRecording(true);
    setIsTextareaDisabled(true); // Disable textarea during recording
    toast.info("Recording started...", { position: "top-center" });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTextareaDisabled(true); // Keep textarea disabled after stopping
    setIsRecordingStopped(true); // Set recording as completed
  };

  const handleTextareaClick = () => {
    if (isRecording) {
      // Show toast if textarea is clicked while recording
      toast.warn("Cannot type while recording is in progress. Stop recording first.", {
        position: "top-center",
      });
    }
  };

  const handleTextareaChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    if (text.trim() !== "") {
      setIsRecording(false); // Stop recording if text is typed
      setIsRecordingStopped(false); // Reset recording state
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
                id="translator-input-text"
                className="translator-text-input"
                placeholder="Type your message"
                value={inputText}
                onChange={handleTextareaChange} // Handle typing
                onClick={handleTextareaClick} // Trigger message if clicked during recording
                disabled={isTextareaDisabled} // Disable textarea during recording
              ></textarea>
            )}

            {/* Action Buttons */}
            <div className="translator-action-buttons">
              {isConverted ? (
                <>
                  <button className="translator-convert-button" onClick={handleConvert}>
                    Play
                  </button>
                  <button className="translator-record-button" onClick={handleStopRecording}>
                    Pause
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="translator-convert-button"
                    onClick={handleConvert}
                    disabled={isRecording} // Disable Convert during recording
                  >
                    Convert
                  </button>
                  {isRecording ? (
                    <button
                      className="translator-record-button"
                      onClick={handleStopRecording}
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      className="translator-record-button"
                      onClick={handleStartRecording}
                      disabled={inputText.trim() !== ""} // Disable Start Recording if text exists
                    >
                      Start Recording
                    </button>
                  )}
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
