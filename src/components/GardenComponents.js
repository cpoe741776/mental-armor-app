// GardenComponents.js – Resilience & Well‑being Garden (emoji fallback v4)
// ---------------------------------------------------------------------
// Lightweight version that swaps Lottie animations for simple emoji so
// the component works even when JSON animation assets are missing.
// (You can revert to the Lottie version later by restoring the imports
// and mapStatusToAnim logic.)
// ---------------------------------------------------------------------
import React from "react";
import PropTypes from "prop-types";

// ---------------------------------------------------------------------
// INTERNAL HELPERS
// ---------------------------------------------------------------------
const DOMAIN_ORDER = ["emotional", "social", "family", "spiritual"];

const toStatus = (score) => {
  if (score >= 4) return "thriving";
  if (score >= 2) return "needsImprovement";
  return "challenged";
};

const capLeft = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const mapStatusToEmoji = {
  challenged: "🥀",       // wilted rose
  needsImprovement: "🌱", // budding sprout
  thriving: "🌸",         // blossom
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
      <span style={{ fontSize: size }}>{mapStatusToEmoji[status]}</span>
      {showLabel && (
        <figcaption className="text-xs font-semibold text-gray-700">
          {label}
        </figcaption>
      )}
    </figure>
  );
}

Flower.propTypes = {
  status: PropTypes.oneOf(["challenged", "needsImprovement", "thriving"]).isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.number,  // pixel font size
  showLabel: PropTypes.bool,
};

// ---------------------------------------------------------------------
// <Garden /> – 2×2 grid for profile / main pages
// ---------------------------------------------------------------------
export function Garden({ domainScores }) {
  return (
    <section
      className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-green-50"
      role="group"
      aria-label="Resilience & Well-being Garden"
    >
      {DOMAIN_ORDER.map((domain) => (
        <Flower
          key={domain}
          status={toStatus(domainScores[domain] ?? 0)}
          label={capLeft(domain)}
          size={48}
          showLabel={true}
        />
      ))}
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
          size={28}        /* ~1.75rem */
          showLabel={false}
        />
      ))}
    </div>
  );
}

GardenHeader.propTypes = Garden.propTypes;

// ---------------------------------------------------------------------
// NOTES
// • This emoji fallback avoids missing‑asset issues in production.
// • Later, you can revert to the Lottie version by restoring the imports
//   and the original <Flower /> implementation.
// ---------------------------------------------------------------------
