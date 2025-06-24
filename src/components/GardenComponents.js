// GardenComponents.js – Resilience & Well‑being Garden (emoji fallback v4)

import React from "react";
import PropTypes from "prop-types";

// ---------------------------------------------------------------------
// INTERNAL HELPERS
// ---------------------------------------------------------------------
const DOMAIN_ORDER = ["emotional", "social", "family", "spiritual"];

const toStatus = (score) => {
  if (score >= 3.5) return "thriving";
  if (score >= 2.3) return "needsImprovement";
  return "challenged";
};

const capLeft = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const mapStatusToEmoji = {
  challenged: "🥀",       // wilted rose
  needsImprovement: "🌱", // budding sprout
  thriving: "🌸",         // blossom
};

const labelMap = {
  emotional: 'EMOTIONAL',
  social: 'SOCIAL/PROFESSIONAL',
  family: 'FAMILY/PERSONAL',
  spiritual: 'SPIRITUAL',
};

// ---------------------------------------------------------------------
// <Flower /> – single emoji flower
// ---------------------------------------------------------------------
export function Flower({ status, label, size = 48, showLabel = true }) {
  return (
    <figure
      className="flex flex-col items-center gap-1"
      aria-label={`${label} flower – ${status}`}
    >
      {showLabel && (
        <figcaption className="text-xs font-semibold text-gray-700 text-center">
          {labelMap[label.toLowerCase()] || label}
        </figcaption>
      )}
      <span style={{ fontSize: size }}>{mapStatusToEmoji[status]}</span>
    </figure>
  );
}

Flower.propTypes = {
  status: PropTypes.oneOf(["challenged", "needsImprovement", "thriving"]).isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.number,
  showLabel: PropTypes.bool,
};

// ---------------------------------------------------------------------
// <Garden /> – 2×2 grid with header
// ---------------------------------------------------------------------
export function Garden({ domainScores }) {
  return (
    <section
      className="bg-green-50 p-4 rounded-2xl min-h-[240px] h-full"
      role="group"
      aria-label="Resilience & Well-being Garden"
    >
      <h3 className="text-lg font-semibold mb-4 text-center text-green-900">
        Your Resilience and Well‑being Garden
      </h3>
      <div className="grid grid-cols-2 gap-4 justify-center items-center">
        {DOMAIN_ORDER.map((domain) => (
          <Flower
            key={domain}
            status={toStatus(domainScores[domain] ?? 0)}
            label={capLeft(domain)}
            size={48}
            showLabel={true}
          />
        ))}
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
};

// ---------------------------------------------------------------------
// <GardenHeader /> – compact, label‑less row (ideal for nav/header)
// ---------------------------------------------------------------------
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