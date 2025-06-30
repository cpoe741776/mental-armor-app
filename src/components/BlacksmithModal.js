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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-2 sm:px-4">
      <div className="relative bg-white rounded-xl p-4 shadow-lg w-full max-w-[90vw] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col items-center justify-center">

        {/* VIDEO + SPARKS */}
        <div className="relative w-full max-h-[70vh]">
          <video
            ref={videoRef}
            src="https://videos.files.wordpress.com/hSoV5UvM/blacksmith_mod-2.mp4"
            autoPlay
            loop
            muted={false}
            playsInline
            controls={false}
            className="w-full h-full object-contain rounded"
            onError={() => console.error("Failed to load the blacksmith video")}
          >
            Sorry, your browser doesn’t support embedded video.
          </video>

          {/* WHITE SPARKS */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-spark"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* CLOSE BUTTON */}
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