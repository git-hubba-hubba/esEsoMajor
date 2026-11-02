import {useEffect, useState} from 'react';

const storageKey = 'sso-neon-dark';

export default function useNeonTheme() {
  const [enabled, setEnabled] = useState(() => {
    try { return localStorage.getItem(storageKey) === 'true'; }
    catch { return false; }
  });

  useEffect(() => {
    if (enabled) document.documentElement.dataset.theme = 'neon-dark';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem(storageKey, String(enabled)); } catch {}
  }, [enabled]);

  useEffect(() => {
    let clicks = [];
    function onClick(event) {
      // Ignore keyboard-generated clicks; allow the gesture with a mouse or touch.
      if (event.detail === 0) return;
      const now = performance.now();
      clicks = clicks.filter(click => now - click.time <= 700 &&
        Math.hypot(event.clientX - click.x, event.clientY - click.y) <= 48);
      clicks.push({time: now, x: event.clientX, y: event.clientY});
      if (clicks.length === 3) {
        clicks = [];
        setEnabled(value => !value);
      }
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
}
