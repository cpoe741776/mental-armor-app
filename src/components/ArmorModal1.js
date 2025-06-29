import React from "react";
import PropTypes from "prop-types";
import Blacksmith from "./Blacksmith";
import { Link } from "react-router-dom";

const ArmorModal = ({ domain, label, status, imgSrc, skillsFor, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold text-center mb-4">{label} Armor</h2>
        <img src={imgSrc} alt={label} className="w-32 h-auto mx-auto mb-2" />

        {status === "thriving" && (
          <p className="text-sm text-green-700 font-semibold text-center">Battle-Ready!!!</p>
        )}
        {status === "needsImprovement" && (
          <p className="text-sm text-yellow-700 font-semibold text-center">Armor shows wear and tear...</p>
        )}
        {status === "challenged" && (
          <p className="text-sm text-red-700 font-semibold text-center">Repairs urgently needed!</p>
        )}

        <div className="my-4 flex justify-center">
          <Blacksmith status={status === "thriving" ? "high" : status === "needsImprovement" ? "mod" : "low"} />
        </div>

        {status === "thriving" ? (
          <p className="text-sm italic text-center bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
            Blacksmith says: Your {label} Mental Armor is holding strong—keep it up!
          </p>
        ) : skillsFor.length > 0 ? (
          <>
            <hr className="my-2 w-10 border-t border-gray-300 mx-auto" />
            <p className="text-xs font-bold text-gray-500 tracking-wide text-center">SUGGESTED REPAIRS</p>
            <ul className="space-y-1 text-sm mt-2">
              {skillsFor.map((skill) => (
                <li key={skill.id} className="text-center">
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
          <p className="text-sm italic text-center text-gray-400 mt-4">No suggestions available.</p>
        )}
      </div>
    </div>
  );
};

ArmorModal.propTypes = {
  domain: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  skillsFor: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ArmorModal;