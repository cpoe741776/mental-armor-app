import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function BlacksmithModal({ isOpen, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) =>
          console.warn("Video play was blocked by browser:", err)
        );
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-4">
      <div className="relative bg-black rounded-xl p-4 shadow-lg max-w-3xl w-full">
        <video
  ref={videoRef}
  src="https://videos.files.wordpress.com/hSoV5UvM/blacksmith_mod-2.mp4"
  autoPlay
  loop
  muted={false}
  playsInline
  controls
  className="w-full h-auto rounded"
  onError={() => console.error("Failed to load the blacksmith video")}
>
  Sorry, your browser doesn’t support embedded video.
</video>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-700 hover:bg-red-800 px-3 py-1 rounded shadow"
        >
          ✖ Close
        </button>
      </div>
    </div>
  );
}

BlacksmithModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};