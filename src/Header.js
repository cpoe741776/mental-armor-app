// src/Header.js
import React, { useEffect, useState } from 'react';
import { Link, NavLink }              from 'react-router-dom';
import netlifyIdentity                from 'netlify-identity-widget';
import Logo                           from './Logo';

/* ───────────────────────────── NEW IMPORTS ───────────────────────────── */
import { GardenHeader } from './components/GardenComponents';
import useMfaScores     from './hooks/useMfaScores';
/* ─────────────────────────────────────────────────────────────────────── */

const Header = () => {
  const [user, setUser] = useState(null);
  const scores          = useMfaScores();   // ← NEW: returns null until identity + metadata load

  /* identity subscriptions – unchanged */
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
    <header className="bg-gray-800 text-white py-4">
      <nav className="container mx-auto flex items-center justify-between">
        {/* Logo & site title */}
        <Link to="/" className="flex items-center space-x-2">
          <Logo />
          <span className="text-xl font-bold">Mental Armor</span>
        </Link>

        {/* Navigation links */}
        <ul className="flex space-x-6">
          <li><NavLink to="/"           className={({isActive})=>isActive?'underline':'hover:underline'}>Home</NavLink></li>
          <li><NavLink to="/library"    className={({isActive})=>isActive?'underline':'hover:underline'}>Library</NavLink></li>
          <li><NavLink to="/repair-kit" className={({isActive})=>isActive?'underline':'hover:underline'}>Repair Kit</NavLink></li>
          <li><NavLink to="/enter-scores" className={({isActive})=>isActive?'underline':'hover:underline'}>Enter Scores</NavLink></li>
          <li><NavLink to="/profile"    className={({isActive})=>isActive?'underline':'hover:underline'}>Profile</NavLink></li>
        </ul>

        {/* Mini-garden + Login/Logout button */}
        <div className="flex items-center gap-4">
          {/* ─── NEW MINI FLOWER ROW ─── */}
          {scores && <GardenHeader domainScores={scores} />}
          {/* ─── Auth button ─────────── */}
          {user ? (
            <button
              onClick={() => netlifyIdentity.logout()}
              className="px-3 py-1 border rounded bg-red-600 hover:bg-red-700"
            >
              Log Out&nbsp;({user.user_metadata?.full_name || user.email})
            </button>
          ) : (
            <button
              onClick={() => netlifyIdentity.open()}
              className="px-3 py-1 border rounded bg-green-600 hover:bg-green-700"
            >
              Log In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
