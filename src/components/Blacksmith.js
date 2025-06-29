import React from "react";
import PropTypes from "prop-types";

// Local webm for modern browsers
import highWebm from "../assets/blacksmiths/blacksmith_high.webm";
import modWebm from "../assets/blacksmiths/blacksmith_mod.webm";
import lowWebm from "../assets/blacksmiths/blacksmith_low.webm";

// Map all source options
const blacksmithVideos = {
  high: {
    webm: highWebm,
    mp4: "https://videos.files.wordpress.com/d8pr2Q0o/outputios.mp4", // working
  },
  mod: {
    webm: modWebm,
    mp4: "https://videos.files.wordpress.com/g0eh9gOS/blacksmith_mod.mp4", // update
  },
  low: {
    webm: lowWebm,
    mp4: "https://videos.files.wordpress.com/QsvP7Do2/blacksmith_low.mp4", // update
  },
};

const Blacksmith = ({ status }) => {
  const video = blacksmithVideos[status];
  if (!video) return null;

  return (
    <video
      className="w-auto h-[100px] object-contain"
      width="100"
      height="100"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster="/fallbacks/blacksmith.png"
    >
      {/* MP4 comes first for iOS compatibility */}
      <source src={video.mp4} type="video/mp4" />
      {/* WebM fallback for modern desktop browsers */}
      <source src={video.webm} type="video/webm" />
      <img src="/fallbacks/blacksmith.png" alt="Blacksmith fallback" />
    </video>
  );
};

Blacksmith.propTypes = {
  status: PropTypes.oneOf(["high", "mod", "low"]).isRequired,
};

export default Blacksmith;