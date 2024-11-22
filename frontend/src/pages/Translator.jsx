import React, { useState } from "react";
import "./Translator.css";
import SubNavbar from "../components/SubNavbar";

const Translator = () => {
  const [isConverted, setIsConverted] = useState(false);
  const [convertedText, setConvertedText] = useState("");
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTextareaDisabled, setIsTextareaDisabled] = useState(false);
  const [message, setMessage] = useState(""); // State for the message

  const [activeTab, setActiveTab] = useState("Audio/Text");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log(`Active tab changed to: ${tab}`);
  };

  const handleConvert = () => {
    if (inputText.trim() === "") return; // Prevent conversion of empty text
    setConvertedText(inputText); // Set converted text
    setIsConverted(true); // Trigger converted view
    setMessage(""); // Clear any existing message
  };

  const handleStartRecording = () => {
    if (inputText.trim() !== "") {
      setMessage("Cannot start recording while text exists. Clear the text first.");
      return; // Prevent recording if text exists
    }
    setIsRecording(true);
    setIsTextareaDisabled(true); // Disable textarea during recording
    setMessage(""); // Clear any existing message
    console.log("Recording started...");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsTextareaDisabled(true); // Keep textarea disabled after stopping
    setMessage(""); // Clear any existing message
    console.log("Recording stopped...");
  };

  const handleTextareaClick = () => {
    if (isRecording) {
      setMessage("Cannot type while recording is in progress. Stop recording first.");
    }
  };

  const handlePlay = () => {
    console.log("Playing...");
  };

  const handlePause = () => {
    console.log("Paused...");
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
                onChange={(e) => setInputText(e.target.value)}
                onClick={handleTextareaClick} // Trigger message if clicked during recording
                disabled={isTextareaDisabled} // Use new state to control textarea
              ></textarea>
            )}

            {/* Action Buttons */}
            <div className="translator-action-buttons">
              {isConverted ? (
                <>
                  <button className="translator-convert-button" onClick={handlePlay}>
                    Play
                  </button>
                  <button className="translator-record-button" onClick={handlePause}>
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
                      disabled={inputText.trim() !== ""} // Disable if text exists
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

        {/* Message Display */}
        {message && <div className="translator-message-box">{message}</div>}

        {/* Instruction */}
        {!isConverted && (
          <p className="translator-instruction-text">
            Only Text or Audio can be input at a single instance
          </p>
        )}
      </div>
    </div>
  );
};

export default Translator;
