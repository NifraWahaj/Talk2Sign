import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SubNavbar from "../components/SubNavbar";
import "./YouTube.css";

const YouTube = () => {
    const [activeTab, setActiveTab] = useState("YouTube");
    const [videoURL, setVideoURL] = useState("");
    const [isConverted, setIsConverted] = useState(false);
    const [player, setPlayer] = useState(null);
    const [prevTime, setPrevTime] = useState(0); // Track previous time

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleConvert = () => {
        if (videoURL.trim() === "") {
            toast.error("Please enter a YouTube link.", {
                position: "top-center",
                autoClose: 2000, // Toast disappears after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
           });
            return;
        }

        if (!videoURL.includes("youtube.com") && !videoURL.includes("youtu.be")) {
            toast.error("Please enter a valid YouTube link.", {
                position: "top-center",
                autoClose: 2000, // Toast disappears after 3 seconds
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
           });
            return;
        }

        setIsConverted(true);
        console.log("YouTube video converted and playing...");
    };

    const getVideoId = (url) => {
        const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(videoURL);

    // Load the YouTube IFrame API
    useEffect(() => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            console.log("YouTube IFrame API loaded");
        };
    }, []);

    // Initialize the YouTube player
    useEffect(() => {
        if (isConverted && videoId && !player) {
            window.YT.ready(() => {
                const newPlayer = new window.YT.Player("youtube-player", {
                    videoId: videoId,
                    events: {
                        onStateChange: onPlayerStateChange,
                        onReady: onPlayerReady,
                    },
                });
                setPlayer(newPlayer);
            });
        }
    }, [isConverted, videoId, player]);
    

    const onPlayerReady = () => {
        console.log("Player is ready");
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            // Start tracking time changes
            const interval = setInterval(() => {
                if (player) {
                    const currentTime = player.getCurrentTime();
    
                    // Log the current time every 10 seconds
                    if (Math.floor(currentTime) % 10 === 0) {
                        console.log(`Timestamp: ${Math.floor(currentTime)} seconds`);
                    }
    
                    // Detect skip forward or backward
                    if (prevTime !== null) {
                        if (currentTime - prevTime > 5) {
                            toast.info("User skipped forward", {
                                position: "top-center",
                                autoClose: 2000,
                            });
                            setPrevTime(currentTime); // Update prevTime immediately to avoid multiple toasts
                            return; // Suppress "Video is playing!" toast
                        } else if (currentTime - prevTime < -5) {
                            toast.info("User skipped backward", {
                                position: "top-center",
                                autoClose: 2000,
                            });
                            setPrevTime(currentTime); // Update prevTime immediately to avoid multiple toasts
                            return; // Suppress "Video is playing!" toast
                        }
                    }
    
                    // Regular play update
                    setPrevTime(currentTime);
                }
            }, 1000); // Check every second
    
            // Display "Video is playing!" toast only if not skipping
            toast.info("Video is playing!", {
                position: "top-center",
                autoClose: 2000,
            });
    
            // Clear interval when video stops playing
            return () => clearInterval(interval);
        }
    
        // Handle other player states
        switch (event.data) {
            case window.YT.PlayerState.PAUSED:
                toast.info("Video is paused!", {
                    position: "top-center",
                    autoClose: 2000,
                });
                break;
    
            case window.YT.PlayerState.ENDED:
                toast.info("Video ended.", {
                    position: "top-center",
                    autoClose: 2000,
                });
                break;
    
            case window.YT.PlayerState.BUFFERING:
                console.log("Video is buffering...");
                break;
    
            case window.YT.PlayerState.CUED:
                console.log("Video is cued.");
                break;

            case -1: // Unstarted state
                console.log("Video is unstarted.");
                break;
            
    
            default:
                console.log("Unhandled state:", event.data);
                break;
        }
    };
    
    
    
    

    return (
        <div className="youtube-page">
            <SubNavbar
                tabs={["Audio/Text", "Upload", "YouTube"]}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
            <ToastContainer />

            <div className="youtube-container">
                {isConverted && videoId ? (
                    <div className="youtube-converted-content">
                        {/* YouTube Player */}
                        <div className="youtube-player" id="youtube-player"></div>
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
