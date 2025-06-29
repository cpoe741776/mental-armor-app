import React from "react";
import PropTypes from "prop-types";

// Import videos (update paths if needed)
import highWebm from "../assets/blacksmiths/blacksmith_high.webm";
import highMp4 from "../assets/blacksmiths/blacksmith_high.mp4";
import modWebm from "../assets/blacksmiths/blacksmith_mod.webm";
import modMp4 from "../assets/blacksmiths/blacksmith_mod.mp4";
import lowWebm from "../assets/blacksmiths/blacksmith_low.webm";
import lowMp4 from "../assets/blacksmiths/blacksmith_low.mp4";

// Status map to corresponding video sources
const blacksmithVideos = {
  high: { webm: highWebm, mp4: highMp4 },
  mod: { webm: modWebm, mp4: modMp4 },
  low: { webm: lowWebm, mp4: lowMp4 },
};

const Blacksmith = ({ status }) => {
  const video = blacksmithVideos[status];

  if (!video) return null;

  return (
   <video
  style={{ backgroundColor: "#ccc" }}
  className="w-[100px] h-[100px] object-contain border border-red-500"
  width="100"
  height="100"
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  poster="/blacksmith.png"
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