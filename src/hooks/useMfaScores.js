import { useEffect, useState } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

export default function useMfaScores() {
  const [scores, setScores] = useState(null);

  useEffect(() => {
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
  }, []);

  return scores;          // null until identity + metadata are ready
}
