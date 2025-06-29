// src/components/ArmorModal.js

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Blacksmith from "../Blacksmith";

const ArmorModal = ({ domain, label, status, imgSrc, skillsFor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        {/* Title & Image */}
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-sm font-bold text-gray-800 mb-2">{label}</h2>
          <img
            src={imgSrc}
            alt={`${label} armor - ${status}`}
            className="w-auto h-24"
          />
        </div>

        {/* Status Description */}
        <div className="text-xs font-semibold text-center mb-2">
          {status === "thriving" && (
            <p className="text-green-700">Battle-Ready!!!</p>
          )}
          {status === "needsImprovement" && (
            <p className="text-yellow-700">Armor shows wear and tear...</p>
          )}
          {status === "challenged" && (
            <p className="text-red-700">Repairs urgently needed!</p>
          )}
        </div>

        {/* Blacksmith Animation */}
        <div className="flex justify-center items-start min-h-[100px] mb-3">
          <div className="w-full max-w-[100px]">
            <Blacksmith
              status={
                status === "thriving"
                  ? "high"
                  : status === "needsImprovement"
                  ? "mod"
                  : "low"
              }
            />
          </div>
        </div>

        {/* Suggested Repairs or Shimmer Line */}
        <div className="w-full flex flex-col justify-start items-center min-h-[100px]">
          {status === "thriving" ? (
            <p className="text-xs font-medium italic text-center bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
              Blacksmith says: Your {label} Mental Armor is holding strong—keep it up!
            </p>
          ) : skillsFor.length > 0 ? (
            <>
              <hr className="w-10 border-t border-gray-300 mb-1" />
              <p className="text-xs font-bold text-gray-500 tracking-wide mb-1">
                SUGGESTED REPAIRS
              </p>
              <ul className="space-y-1 text-sm text-center">
                {skillsFor.map((skill) => (
                  <li key={skill.id}>
                    <span role="img" aria-label="Forge tool">⚒️</span>{" "}
                    <Link
                      to={`/skill/${skill.id}`}
                      className="text-[#003049] font-extrabold hover:underline"
                    >
                      {skill.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-xs italic text-gray-400 text-center">
              No suggestions available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

ArmorModal.propTypes = {
  domain: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["thriving", "needsImprovement", "challenged"]).isRequired,
  imgSrc: PropTypes.string.isRequired,
  skillsFor: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ArmorModal;
