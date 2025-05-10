// src/pages/YouTube.jsx

import React, { useState } from 'react';
import axios from 'axios';
import YouTubePlayer from 'react-youtube';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubNavbar from '../components/SubNavbar';
import './YouTube.css';

export default function YouTube() {
  const [activeTab, setActiveTab]   = useState("YouTube");
  const [url, setUrl]               = useState("");
  const [videoId, setVideoId]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [aslUrl, setAslUrl]         = useState("");

  // extract 11-char video ID
  const extractVideoId = u => {
    const m = u.match(/(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  };

  const handleFetch = async e => {
    e.preventDefault();
    setLoading(true);
    toast.info("Fetching transcript…");

    const vid = extractVideoId(url.trim());
    if (!vid) {
      toast.error("Invalid YouTube URL");
      setLoading(false);
      return;
    }
    try {
      // 1) get transcript [{start,duration,text},…]
      const { data } = await axios.post('http://localhost:5000/api/transcript', { url });
      setVideoId(data.videoId);

      // 2) join all text segments
      const fullText = data.transcript.map(s => s.text).join(" ");

      // 3) translate full text
      const transRes = await axios.post(
        'http://localhost:5000/api/store-text',
        { text: fullText }
      );
      const translated = transRes.data.translated_text;

      // 4) GenASL single video
      const aslRes = await axios.get(
        `https://z9h9o5zceb.execute-api.us-west-2.amazonaws.com/prod/sign?Text=${encodeURIComponent(translated)}`
      );
      setAslUrl(aslRes.data.SignURL);
      toast.success("ASL video ready!");

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to generate ASL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="youtube-page">
      <SubNavbar
        tabs={["Audio/Text","Upload","YouTube"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <ToastContainer />

      <form onSubmit={handleFetch} className="youtube-form">
        <input
          type="text"
          placeholder="Paste YouTube URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading…" : "Translate to ASL"}
        </button>
      </form>

      {videoId && (
        <div className="youtube-embed">
          <YouTubePlayer
            videoId={videoId}
            opts={{ playerVars: { origin: window.location.origin } }}
          />
        </div>
      )}

      {aslUrl && (
        <div className="asl-video-wrapper">
          <h2>ASL Translation</h2>
          <video
            src={aslUrl}
            controls
            autoPlay
            muted
            style={{ width: '100%', marginTop: '1rem' }}
          />
        </div>
      )}
    </div>
  );
}
