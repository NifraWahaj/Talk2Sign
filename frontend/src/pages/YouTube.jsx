import React, { useState } from "react";
import SubNavbar from "../components/SubNavbar";
import "./YouTube.css";

const YouTube = () => {
    const [activeTab, setActiveTab] = useState("YouTube");
    const [videoURL, setVideoURL] = useState("");
    const [isConverted, setIsConverted] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        console.log(`Active tab changed to: ${tab}`);
    };

    const handleConvert = () => {
        if (videoURL.trim() === "") {
            alert("Please enter a YouTube link.");
            return;
        }
        setIsConverted(true);
        console.log("YouTube video converted and playing...");
    };

    return (
        <div className="youtube-page">
            <SubNavbar
                tabs={["Audio/Text", "Upload", "YouTube"]}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <div className="youtube-container">
                {isConverted ? (
                    <div className="youtube-converted-content">
                        {/* Embedded YouTube Player */}
                        <div className="youtube-player">
                            <p className="youtube-placeholder-text">YouTube Player</p>
                        </div>
                        {/* Translation Avatar */}
                        <div className="youtube-avatar-placeholder">
                            <p className="youtube-placeholder-text">Avatar animation goes here</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="youtube-header">YouTube to ASL Translation</h1>
                        <p className="youtube-description">
                            Talk2Sign allows you to translate YouTube videos to ASL. <br />
                            It is optimized to work on any device. There is no additional software or app needed.
                        </p>
                        <div className="youtube-input-section">
                            <input
                                type="text"
                                className="youtube-input"
                                placeholder="Enter YouTube link"
                                value={videoURL}
                                onChange={(e) => setVideoURL(e.target.value)}
                            />
                            <button className="youtube-convert-button" onClick={handleConvert}>
                                Convert
                            </button>
                        </div>
                        <div className="youtube-instructions">
                            <h2>How to Translate YouTube Videos?</h2>
                            <ol>
                                <li>Open YouTube.com and search for the video you would like to translate.</li>
                                <li>
                                    Click on the video and wait until it starts playing. Then, just copy the video URL from your browser address bar.
                                </li>
                                <li>Open Talk2Sign and paste the video URL in the input box above.</li>
                                <li>
                                    Then, simply click on the "Convert" button. The translation will be initiated and may take a few minutes.
                                </li>
                                <li>Note: It is only possible to translate videos that are up to 30 minutes long.</li>
                            </ol>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default YouTube;
