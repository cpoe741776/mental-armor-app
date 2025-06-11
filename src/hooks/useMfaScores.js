// src/hooks/useMfaScores.js
import { useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

export default function useMfaScores() {
  const [scores, setScores] = useState(null);

  /* ------------------------------------------------------------
     Helper: update state from either a scores object passed in
     (via CustomEvent) OR by re-reading Netlify Identity metadata
  ------------------------------------------------------------ */
  const refreshScores = (newScores) => {
    // 1) Update immediately if we’re handed fresh scores
    if (newScores) {
      setScores({ ...newScores });
      return;
    }

    // 2) Otherwise pull from the current user’s metadata
    const u = netlifyIdentity.currentUser();
    if (u?.user_metadata?.mfaScores) {
      const { emotional = 0, social = 0, family = 0, spiritual = 0 } =
        u.user_metadata.mfaScores;
      setScores({
        emotional: +emotional,
        social:    +social,
        family:    +family,
        spiritual: +spiritual,
      });
    }
  };

  useEffect(() => {
    /* ---------- mount ---------- */
    refreshScores();                      // initial load

    // When user logs in, metadata is fresh
    netlifyIdentity.on('login',  refreshScores);

    // On logout, clear scores
    const clearScores = () => setScores(null);
    netlifyIdentity.on('logout', clearScores);

    // Custom event from EnterScores.js
    const handleCustomEvent = (e) => refreshScores(e.detail);
    window.addEventListener('mfaScoresUpdated', handleCustomEvent);

    /* ---------- unmount ---------- */
    return () => {
      netlifyIdentity.off('login',  refreshScores);
      netlifyIdentity.off('logout', clearScores);
      window.removeEventListener('mfaScoresUpdated', handleCustomEvent);
    };
  }, []);

  return scores;  // may be null until identity/metadata are ready
}
