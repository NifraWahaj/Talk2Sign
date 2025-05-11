import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubNavbar from "../components/SubNavbar";
import "./YouTube.css";
import ReactPlayer from 'react-player';

const YouTube = () => {
  const [activeTab, setActiveTab] = useState("YouTube");
  const [urlInput, setUrlInput] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [aslVideoUrl, setAslVideoUrl] = useState(null);
  const videoRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCancel = () => {
    setSubmittedUrl(null);
    setUrlInput("");
    setAslVideoUrl(null);
    setConversionProgress(0);
    setIsProcessing(false);
  };

  // 1) get the transcript from your backend
  const fetchTranscript = async (youTubeUrl) => {
    const resp = await fetch("http://127.0.0.1:5555/api/transcript", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: youTubeUrl }),
    });
    if (!resp.ok) throw new Error("Failed to fetch transcript");
    const data = await resp.json();
    return data.transcript.map((seg) => seg.text).join(" ");
  };

  // 2) send first 50 chars of text to GenASL
  const convertToASL = async (fullText) => {
    const limited = fullText.slice(0, 50);
    console.log("Payload to GenASL (first 50 chars):", limited);
    const resp = await fetch(
      `https://z9h9o5zceb.execute-api.us-west-2.amazonaws.com/prod/sign?Text=${encodeURIComponent(limited)}`,
      { method: "GET" }
    );
    if (!resp.ok) {
      const body = await resp.json().catch(() => ({}));
      console.error("GenASL error body:", body);
      throw new Error(body.error || body.message || `Status ${resp.status}`);
    }
    const { SignURL } = await resp.json();
    return SignURL;
  };

  // Main "Convert" handler
  const handleConvert = async () => {
    if (!urlInput.trim()) {
      toast.error("Please paste a YouTube URL.", { position: "top-center" });
      return;
    }
    setSubmittedUrl(urlInput.trim());
    setIsProcessing(true);
    setConversionProgress(0);
    setAslVideoUrl(null);

    try {
      // step 1: transcript
      const fullText = await fetchTranscript(urlInput.trim());
      console.log("Transcript from backend:", fullText);
      setConversionProgress(50);

      // step 2: GenASL
      const videoUrl = await convertToASL(fullText);
      setAslVideoUrl(videoUrl);
      setConversionProgress(100);
      toast.success("ASL video ready!", { position: "top-center" });
    } catch (err) {
      console.error(err);
      toast.error(err.message, { position: "top-center", autoClose: 5555 });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="yt-page">
      <SubNavbar
        tabs={["Audio/Text", "Upload", "YouTube"]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className="yt-container">
        {/* Instructions and input section */}
        {!submittedUrl ? (
          <>
            <div className="yt-input-container">
              <h1 className="yt-header">YouTube to ASL Translation</h1>
              <p className="yt-description">
                Talk2Sign allows you to translate YouTube videos to ASL. <br />
                It is optimized to work on any device. There is no additional software or app needed.
              </p>
              
              <div className="yt-input-row">
                <input
                  type="text"
                  className="yt-input"
                  placeholder="Paste YouTube URL"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <button
                  className="yt-convert-button"
                  onClick={handleConvert}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Convert to ASL"}
                </button>
              </div>
            </div>

            <div className="yt-instructions">
              <h2>How to Translate YouTube Videos?</h2>
              <ol>
                <li>Open YouTube.com and search for the video you would like to translate.</li>
                <li>Click on the video and wait until it starts playing. Then, just copy the video URL from your browser address bar.</li>
                <li>Open Talk2Sign and paste the video URL in the input box above.</li>
                <li>Then, simply click on the "Convert" button. The translation will be initiated and may take a few minutes.</li>
                <li>Note: It is only possible to translate videos that are up to 30 minutes long.</li>
              </ol>
            </div>
          </>
        ) : (
          // After user has submitted the URL and conversion is happening, display the videos
          <div className="yt-uploaded-container">
            {isProcessing && (
              <div className="yt-progress-container">
                <progress value={conversionProgress} max="100" />
                <span>{conversionProgress}%</span>
              </div>
            )}

            <div className="yt-asl-wrapper">
              {/* ASL video - will appear first on mobile */}
              {aslVideoUrl && (
                <div className="yt-video-column yt-asl-video-column">
                  <video
                    src={aslVideoUrl}
                    controls
                    autoPlay
                    muted
                    loop
                    className="yt-asl-video"
                  >
                    Your browser doesn't support HTML5 video.
                  </video>
                </div>
              )}

              {/* YouTube Player - will appear second on mobile */}
              <div className="yt-video-column yt-youtube-video-column">
                <div className="yt-youtube-video-container">
                  <ReactPlayer 
                    url={submittedUrl} 
                    controls 
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </div>

            <div className="yt-action-buttons">
              <button className="yt-cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button
                className="yt-reconvert-button"
                onClick={handleConvert}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Re-convert"}
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default YouTube;
