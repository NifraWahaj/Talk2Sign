import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "regenerator-runtime/runtime";
import "./Translator.css";
import SubNavbar from "../components/SubNavbar";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Translator = () => {
  // Text conversion state
  const [isConverted, setIsConverted] = useState(false);
  const [convertedText, setConvertedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTextareaDisabled, setIsTextareaDisabled] = useState(false);
  const [activeTab, setActiveTab] = useState("Audio/Text");

  // ASL video state 
  const [signUrl, setSignUrl] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");
  const [convertDisabled, setConvertDisabled] = useState(false);

  // Speech‐to‐text hooks
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    toast.error("Speech Recognition not supported.", { position: "top-center" });
    return <p>Your browser does not support speech recognition.</p>;
  }
  // rename your old backend‐facade function
  const generateBackendVideo = async (text) => {
    try {
      await fetch("http://127.0.0.1:5555/api/generate-video", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ text })
      });
      // we intentionally ignore its response/url
    } catch (err) {
      console.warn("Facade video error", err);
    }
  };

  // 1. call: only SignURL
  const generateASL = async (text) => {
    setIsVideoLoading(true);
    setSignUrl("");
    setVideoError("");
    try {
      const res = await fetch(
        `https://z9h9o5zceb.execute-api.us-west-2.amazonaws.com/prod/sign?Text=${encodeURIComponent(text)}`
      );
      
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { SignURL } = await res.json();
      setSignUrl(SignURL);
    } catch (err) {
     // console.error("genASL error:", err);
      setVideoError("No internet connection. Please check your network settings.");
      toast.error("No internet connection. Please check your network settings.", { position: "top-center" });
    } finally {
      setIsVideoLoading(false);
    }
  };

  // 2. Handle “Convert” (audio/text)
  const handleConvert = async () => {
    const raw = (listening ? transcript : convertedText).trim();
    if (!raw) {
      return toast.error("Record or type text first.", { position: "top-center" });
    }
  
    setConvertedText(raw);
    setIsConverted(true);
    setConvertDisabled(true);
  
    try {
      // 1) facade call (ignored response)
      await generateBackendVideo(raw);
  
      // 2) translate correctly
      const resp = await fetch("http://127.0.0.1:5555/api/store-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: raw }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `Status ${resp.status}`);
      }
      const { translated_text } = await resp.json();
      setTranslatedText(translated_text);
  
      // 3) generate ASL video
      await generateASL(translated_text);
    } catch (err) {
      console.error(err);
      toast.error(err.message, { position: "top-center" });
    } finally {
      setConvertDisabled(false);
    }
  };
  

  // 3. Handle file upload & transcription
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Select a file first.", { position: "top-center" });
    setIsUploading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const resp = await fetch("http://127.0.0.1:5555/api/transcribe-audio", {
        method: "POST",
        body: form,
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Transcription failed.Check your internet connection");
      setConvertedText(data.text);
      setTranslatedText(data.translated_text);
      setIsConverted(true);
      toast.success("Audio transcribed & translated.", { position: "top-center" });

      // Then generate ASL
      await generateASL(data.translated_text);
    } catch (err) {
      console.error(err);
      toast.error(err.message, { position: "top-center" });
    } finally {
      setIsUploading(false);
    }
  };

  // Recording controls
  const handleStartRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    setIsTextareaDisabled(true);
    toast.info("Recording started.", { position: "top-center" });
  };
  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    setIsTextareaDisabled(false);
    toast.info("Recording stopped.", { position: "top-center" });
  };

  return (
    <div className="translator-page">
      <SubNavbar
        tabs={["Audio/Text", "Upload", "Youtube"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="translator-container">
        <div className="translator-content-wrapper">
          {/* ASL Video */}
          {isConverted && (
            <div className="video-wrapper">
              {isVideoLoading && <p>Loading video…</p>}
              {videoError && <p className="error">{videoError}</p>}
              {!isVideoLoading && signUrl && (
                <video className="asl-video" controls autoPlay loop>
                  <source src={signUrl} type="video/mp4" />
                  Your browser does not support video.
                </video>
              )}
            </div>
          )}

          {/* Text Input & Controls */}
          <div className="translator-text-container">
            <textarea
              className="translator-text-input"
              placeholder="Start recording or type your message"
              value={listening ? transcript : convertedText}
              readOnly={listening}
              disabled={isTextareaDisabled}
              onChange={e => setConvertedText(e.target.value)}
            />

            <div className="translator-action-buttons">
              {listening ? (
                <button className="translator-record-button"  onClick={handleStopRecording}>Stop Recording</button>
              ) : (
                <button className="translator-record-button" onClick={handleStartRecording}>Start Recording</button>
              )}
            <button
  className="convert-button"
  onClick={handleConvert}
  disabled={convertDisabled || isVideoLoading}
>
  {convertDisabled ? "Processing…" : "Convert"}
</button>



              {activeTab === "Upload" && (
                <>
                  <input type="file" onChange={e => setFile(e.target.files[0])} />
                  <button onClick={handleUpload} disabled={isUploading}>
                    {isUploading ? "Uploading…" : "Upload & Generate"}
                  </button>
                  
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Translator;