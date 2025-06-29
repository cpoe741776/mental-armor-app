// BlacksmithComponents.js – Mental Armor Blacksmith (v2)

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Blacksmith from './Blacksmith';

// Image imports from armor_images folder inside assets
import HIGH_HELMET from "../assets/armor_images/HIGH_HELMET.png";
import MOD_HELMET from "../assets/armor_images/MOD_HELMET.png";
import LOW_HELMET from "../assets/armor_images/LOW_HELMET.png";

import HIGH_CHESTPLATE from "../assets/armor_images/HIGH_CHESTPLATE.png";
import MOD_CHESTPLATE from "../assets/armor_images/MOD_CHESTPLATE.png";
import LOW_CHESTPLATE from "../assets/armor_images/LOW_CHESTPLATE.png";

import HIGH_LEGS from "../assets/armor_images/HIGH_LEGS.png";
import MOD_LEGS from "../assets/armor_images/MOD_LEGS.png";
import LOW_LEGS from "../assets/armor_images/LOW_LEGS.png";

import HIGH_SHIELD from "../assets/armor_images/HIGH_SHIELD.png";
import MOD_SHIELD from "../assets/armor_images/MOD_SHIELD.png";
import LOW_SHIELD from "../assets/armor_images/LOW_SHIELD.png";

// Determine image to show per domain and score level
const imageMap = {
  emotional: {
    challenged: LOW_HELMET,
    needsImprovement: MOD_HELMET,
    thriving: HIGH_HELMET,
  },
  family: {
    challenged: LOW_CHESTPLATE,
    needsImprovement: MOD_CHESTPLATE,
    thriving: HIGH_CHESTPLATE,
  },
  social: {
    challenged: LOW_LEGS,
    needsImprovement: MOD_LEGS,
    thriving: HIGH_LEGS,
  },
  spiritual: {
    challenged: LOW_SHIELD,
    needsImprovement: MOD_SHIELD,
    thriving: HIGH_SHIELD,
  },
};

const labelMap = {
  emotional: "EMOTIONAL",
  social: "SOCIAL / PROFESSIONAL",
  family: "FAMILY / PERSONAL",
  spiritual: "SPIRITUAL",
};

const DOMAIN_ORDER = ["emotional", "family", "social", "spiritual"];

const toStatus = (score) => {
  if (score >= 3.5) return "thriving";
  if (score >= 2.3) return "needsImprovement";
  return "challenged";
};

// 🛡️ ARMOR PIECE COMPONENT
export function ArmorPiece({ domain, score, skillsFor = [] }) {
  const status = toStatus(score);
  const label = labelMap[domain] || domain.toUpperCase();
  const imgSrc = imageMap[domain][status];

  return (
    <figure
  className="flex flex-col justify-start items-center text-center bg-white rounded-xl p-2 shadow-sm h-full"
  aria-label={`${label} armor – ${status}`}
>
  {/* Title + Armor */}
  <div className="flex flex-col justify-start items-center h-[140px]">
    <figcaption className="text-xs font-bold text-gray-800 leading-tight mb-1">
      {label}
    </figcaption>
    <img
      src={imgSrc}
      alt={`${label} armor – ${status}`}
      className="w-auto max-h-20"
    />
  </div>

  {/* Status Description */}
  <div className="min-h-[2.5rem] flex items-start mt-1">
    {status === "thriving" && (
      <p className="text-xs text-green-700 font-semibold">Battle-Ready!!!</p>
    )}
    {status === "needsImprovement" && (
      <p className="text-xs text-yellow-700 font-semibold text-center">
  Armor shows wear and tear...
</p>
    )}
    {status === "challenged" && (
      <p className="text-xs text-red-700 font-semibold text-center">
        Vulnerable—<br className="hidden md:block" />Repairs urgently needed!      </p>
    )}
  </div>

  {/* Blacksmith */}
  <div className="w-full flex justify-center mt-2 h-[100px]">
  <div className="h-full flex items-start">
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

  {/* Suggested Repairs */}
  <div className="w-full flex flex-col justify-start items-start mt-2 min-h-[100px]">
  {status !== "thriving" && skillsFor.length > 0 ? (
  <>
    <hr className="mb-2 w-10 border-t border-gray-300" />
    <p className="text-xs font-bold text-gray-500 mb-1">SUGGESTED REPAIRS</p>
    <ul className="space-y-1 text-sm">
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
  <p
  className="text-xs font-medium italic mt-2 bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer"
>
  Blacksmith says: Your {label} Mental Armor is holding strong—keep it up!
</p>
)}
</div>
</figure>
  );
}

ArmorPiece.propTypes = {
  domain: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  skillsFor: PropTypes.array,
};

// 🔧 Mini Blacksmith Header (Armor Strip for Header Bar)
export function BlacksmithHeader({ domainScores }) {
  return (
    <div
      className="flex items-center gap-3"
      role="group"
      aria-label="Mini Armor Status"
    >
      {DOMAIN_ORDER.map((domain) => {
        const status = toStatus(domainScores[domain] ?? 0);
        const imgSrc = imageMap[domain][status];
        const label = labelMap[domain];
        return (
          <img
            key={domain}
            src={imgSrc}
            alt={`${label} armor – ${status}`}
            className="w-8 h-auto"
            title={`${label}: ${status}`}
          />
        );
      })}
    </div>
  );
}

BlacksmithHeader.propTypes = {
  domainScores: PropTypes.shape({
    emotional: PropTypes.number.isRequired,
    social: PropTypes.number.isRequired,
    family: PropTypes.number.isRequired,
    spiritual: PropTypes.number.isRequired,
  }).isRequired,
};

// 🔨 BlacksmithShop Full Component
export function BlacksmithShop({ domainScores, suggestedSkills }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-100 rounded-xl items-start">

      {DOMAIN_ORDER.map((domain) => (
        <ArmorPiece
          key={domain}
          domain={domain}
          score={domainScores[domain] ?? 0}
          skillsFor={
            suggestedSkills?.filter((skill) =>
              Array.isArray(skill.domains)
                ? skill.domains.includes(domain)
                : skill.domains === domain
            ) || []
          }
        />
      ))}
    </div>
  );
}