// src/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo'; // make sure this points at your Logo.js

export default function Header({ title }) {
  const navigate = useNavigate();

  return (
    <header className="bg-[#003049] text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center py-3">
          {/* Logo on the far left, linking back to Home */}
          <Link to="/" className="flex items-center mr-4">
            {/* 
              If you want a larger or differently‐sized logo than the one inside Logo.js,
              you can override width/height here, e.g.:
              <img src="/TW_CC_49N_FinalLogo_NAVY.png" className="h-10 w-auto" alt="49 North Logo" />
            */}
            <Logo />
          </Link>

          {/* Optional Back Arrow (uncomment if you need it on subpages) */}
          {title && (
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-xl leading-none hover:opacity-80 transition-opacity"
            >
              ←
            </button>
          )}

          {/* Page Title (if passed) */}
          {title && (
            <h1 className="text-xl font-semibold">{title}</h1>
          )}

          {/* Spacer pushes the nav links to the right */}
          <div className="flex-1" />

          {/* Main Navigation Links */}
          <nav className="flex flex-wrap items-center space-x-4 text-sm">

            <Link
              to="/library"
              className="px-2 py-1 hover:bg-[#005174] rounded transition-colors"
            >
              Library
            </Link>

            <Link
              to="/repair-kit"
              className="px-2 py-1 hover:bg-[#005174] rounded transition-colors"
            >
              Repair Kit
            </Link>

            

            <a
              href="https://mymentalfitnessassessment.com/"
              target="_blank"
              rel="noreferrer"
              className="px-2 py-1 hover:bg-[#005174] rounded transition-colors"
            >
              Take the MFA
            </a>
            <Link
              to="/"
              className="px-2 py-1 hover:bg-[#005174] rounded transition-colors"
            >
              Home
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
