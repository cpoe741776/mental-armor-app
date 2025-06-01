// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

export default function Home() {
  return (
    <div className="bg-white min-h-screen overflow-y-auto pb-24">
      {/* Shared header */}
      <Header title="Mental Armor Home" />

      <div className="mt-6 flex flex-col items-center">
        {/* Video hosted on your own domain */}
        <video
          src="https://videos.files.wordpress.com/ThUDAyql/sequence-01_1.mp4"
          poster="https://mymentalarmor.com/wp-content/uploads/2024/06/30CM_FOUND_FLOOR_CIRCLE_MED-copy.jpg"
          controls
          className="w-full max-w-3xl rounded-lg shadow-lg"
        />
      </div>

      {/* Navigation buttons */}
+      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mx-auto">
        <Link
          to="/library"
          className="flex-1 bg-[#003049] text-white rounded-xl py-4 text-center shadow hover:shadow-lg transform hover:scale-105 transition"
        >
          Skill Library
        </Link>
        <Link
          to="/repair-kit"
          className="flex-1 bg-[#003049] text-white rounded-xl py-4 text-center shadow hover:shadow-lg transform hover:scale-105 transition"
        >
          Repair Kit
        </Link>
        <a
          href="https://mymentalfitnessassessment.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#003049] text-white rounded-xl py-4 text-center shadow hover:shadow-lg transform hover:scale-105 transition"
        >
          Take the MFA
        </a>
      </div>
    </div>
  );
}
