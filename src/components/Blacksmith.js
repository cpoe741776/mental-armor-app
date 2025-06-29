import React from "react";
import PropTypes from "prop-types";

import highWebm from "../assets/blacksmiths/blacksmith_high.webm";
import modWebm from "../assets/blacksmiths/blacksmith_mod.webm";
import lowWebm from "../assets/blacksmiths/blacksmith_low.webm";

const blacksmithVideos = {
  high: {
    webm: highWebm,
    mp4: "https://mymentalarmor.com/wp-content/uploads/2025/06/blacksmith_high.mp4",
  },
  mod: {
    webm: modWebm,
    mp4: "https://mymentalarmor.com/wp-content/uploads/2025/06/blacksmith_mod.mp4",
  },
  low: {
    webm: lowWebm,
    mp4: "https://mymentalarmor.com/wp-content/uploads/2025/06/blacksmith_low.mp4",
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
      <source src={video.webm} type="video/webm" />
      <source src={video.mp4} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

Blacksmith.propTypes = {
  status: PropTypes.oneOf(["high", "mod", "low"]).isRequired,
};

export default Blacksmith;
