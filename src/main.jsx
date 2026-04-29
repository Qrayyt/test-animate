const BASE = '/test-animate';
function routeTo(path){ window.history.pushState({},'', `${BASE}${path}`); window.dispatchEvent(new PopStateEvent('popstate')); }
function currentPath(){ const p = window.location.pathname.replace(BASE,'') || '/'; return p.startsWith('/') ? p : `/${p}`; }
const redirect = new URLSearchParams(window.location.search).get('p'); if (redirect){ window.history.replaceState({},'', `${BASE}${redirect}`); }
import './app.jsx';
