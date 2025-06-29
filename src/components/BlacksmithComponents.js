// GardenComponents.js – Resilience & Well‑being Garden (emoji fallback v4)

import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import grassImage from "../assets/grass-hills.png"; // corrected import path

const DOMAIN_ORDER = ["emotional", "social", "family", "spiritual"];

const toStatus = (score) => {
  if (score >= 3.5) return "thriving";
  if (score >= 2.3) return "needsImprovement";
  return "challenged";
};

const capLeft = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const mapStatusToEmoji = {
  challenged: "🥀", // restored wilted rose emoji
  needsImprovement: "🌱",
  thriving: "🌹",
};

const labelMap = {
  emotional: "EMOTIONAL",
  social: "SOCIAL/PROFESSIONAL",
  family: "FAMILY/PERSONAL",
  spiritual: "SPIRITUAL",
};

export function Flower({ status, label, size = 48, showLabel = true, skillsFor = [] }) {
  return (
    <figure className="flex flex-col items-center gap-2 text-center" aria-label={`${label} flower – ${status}`}>
      {showLabel && (
        <figcaption className="text-xs font-semibold text-gray-700">
          {labelMap[label.toLowerCase()] || label}
        </figcaption>
      )}
      <span style={{ fontSize: size }}>{mapStatusToEmoji[status]}</span>
      {status !== "thriving" ? (
        skillsFor.length > 0 && (
          <ul className="mt-1 space-y-1 text-sm">
            {skillsFor.map((skill) => (
              <li key={skill.id}>
                <span role="img" aria-label="Watering plant">🚿</span>{" "}
                <Link
                  to={`/skill/${skill.id}`}
                  className="text-[#003049] font-extrabold hover:underline"
                >
                  {skill.title}
                </Link>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="text-xs text-green-700 font-semibold mt-1">Thriving</p>
      )}
    </figure>
  );
}

Flower.propTypes = {
  status: PropTypes.oneOf(["challenged", "needsImprovement", "thriving"]).isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.number,
  showLabel: PropTypes.bool,
  skillsFor: PropTypes.array,
};

export function Garden({ domainScores, suggestedSkills = [] }) {
  return (
    <section
      className="p-4 rounded-2xl min-h-[240px] h-full animate-gardenScroll relative overflow-hidden"
      role="group"
      aria-label="Resilience & Well-being Garden"
    >
      <div
  className="absolute inset-0 opacity-50 z-0 animate-gardenScroll"
  style={{
    backgroundImage: `url(${grassImage})`,
    backgroundRepeat: "repeat-x",
    backgroundPosition: "bottom",
    backgroundSize: "cover",
  }}
></div>
      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-4 text-center">Your Resilience and Wellbeing Garden</h3>
        <div className="grid grid-cols-2 gap-4 justify-items-center content-start">
          {DOMAIN_ORDER.map((domain) => {
            const domainSkills = suggestedSkills.filter(skill =>
              Array.isArray(skill.domains) && skill.domains.includes(domain)
            );
            return (
              <Flower
                key={domain}
                status={toStatus(domainScores[domain] ?? 0)}
                label={capLeft(domain)}
                size={48}
                showLabel={true}
                skillsFor={domainSkills}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

Garden.propTypes = {
  domainScores: PropTypes.shape({
    emotional: PropTypes.number.isRequired,
    social: PropTypes.number.isRequired,
    family: PropTypes.number.isRequired,
    spiritual: PropTypes.number.isRequired,
  }).isRequired,
  suggestedSkills: PropTypes.array,
};

export function GardenHeader({ domainScores }) {
  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Mini Resilience Garden"
    >
      {DOMAIN_ORDER.map((domain) => (
        <Flower
          key={domain}
          status={toStatus(domainScores[domain] ?? 0)}
          label={capLeft(domain)}
          size={28}
          showLabel={false}
        />
      ))}
    </div>
  );
}

GardenHeader.propTypes = Garden.propTypes;
