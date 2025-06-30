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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 px-2 sm:px-4">
      <div className="relative bg-black rounded-xl p-4 shadow-lg w-full max-w-[90vw] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col items-center justify-center">
        <video
          ref={videoRef}
          src="https://videos.files.wordpress.com/hSoV5UvM/blacksmith_mod-2.mp4"
          autoPlay
          loop
          muted={false}
          playsInline
          controls={false}
          className="w-full max-h-[70vh] object-contain rounded"
          onError={() => console.error("Failed to load the blacksmith video")}
        >
          Sorry, your browser doesn’t support embedded video.
        </video>

        {/* Themed Close Button */}
        <button
          onClick={onClose}
          className="mt-4 px-5 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white text-sm font-semibold rounded-full shadow hover:from-red-600 hover:to-red-800 transition"
        >
          🔙 Return to Battle
        </button>
      </div>
    </div>
  );
}

BlacksmithModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};