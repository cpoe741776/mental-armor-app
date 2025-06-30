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
    mp4: "https://videos.files.wordpress.com/hSoV5UvM/blacksmith_mod-2.mp4", // update
  },
  low: {
    webm: lowWebm,
    mp4: "https://videos.files.wordpress.com/hSoV5UvM/blacksmith_mod-2.mp4", // update
  },
};

const Blacksmith = ({ status }) => {
  const video = blacksmithVideos[status];
  if (!video) return null;

  return (
    <video
  className="w-[90px] h-[120px] object-contain mx-auto"
  width="90"
  height="120"
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