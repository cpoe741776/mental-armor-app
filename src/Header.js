
// src/Header.js
import React, { useEffect, useState } from 'react';
import { Link, NavLink }              from 'react-router-dom';
import netlifyIdentity                from 'netlify-identity-widget';
import Logo                           from './Logo';
import { BlacksmithHeader }          from './components/BlacksmithComponents';
import useMfaScores                   from './hooks/useMfaScores';

export default function Header() {
  const [user, setUser] = useState(null);
  const scores          = useMfaScores();

  useEffect(() => {
    const updateUser = () => setUser(netlifyIdentity.currentUser());
    netlifyIdentity.on('init',   updateUser);
    netlifyIdentity.on('login',  updateUser);
    netlifyIdentity.on('logout', updateUser);
    netlifyIdentity.init();
    return () => {
      netlifyIdentity.off('init',   updateUser);
      netlifyIdentity.off('login',  updateUser);
      netlifyIdentity.off('logout', updateUser);
    };
  }, []);

  return (
    <header className="bg-gray-800 text-white py-8">
      <nav
        className="
          container mx-auto
          flex flex-col md:flex-row
          md:items-center md:justify-between
          gap-4 md:gap-0
        "
      >
        {/* Row 1 — Logo + Login/Logout */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Logo + title */}
          <Link to="/" className="flex items-center space-x-3">
            <Logo />
            <span className="text-2xl font-bold tracking-wide">
              Mental&nbsp;Armor
            </span>
          </Link>

          {/* mini-blacksmith status (only on ≥md to avoid crowding small screens) */}
          {scores && (
            <span className="hidden md:inline-block ml-4">
              <BlacksmithHeader domainScores={scores} />
            </span>
          )}

          {/* Login / Logout — shown as a full-width button on mobile */}
          <button
            onClick={() =>
              user ? netlifyIdentity.logout() : netlifyIdentity.open()
            }
            className="
              md:ml-6
              px-4 py-2 rounded
              text-sm
              bg-green-600 hover:bg-green-700
              md:bg-transparent md:hover:bg-transparent
              md:border md:border-green-400
              w-36 md:w-auto
            "
          >
            
              {user
  ? `Log Out${user.user_metadata?.full_name ? ` (${user.user_metadata.full_name})` : ''}`
  : 'Log In'}

          </button>
        </div>

        {/* Row 2 — Navigation links (wrap on phones) */}
        <ul
          className="
            flex flex-wrap
            gap-x-4 gap-y-2
            md:gap-x-6 md:gap-y-0
            text-lg md:text-base
          "
        >
          {[
            ['/', 'Home'],
            ['/library', 'Library'],
            ['/repair-kit', 'Repair Kit'],
            ['/enter-scores', 'Enter Scores'],
            ['/profile', 'Profile'],
            ['/wordforge', 'Word Forge'], // 🧠 New module
          ].map(([to, label]) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? 'underline' : 'hover:underline'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}