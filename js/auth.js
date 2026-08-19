/* ==========================================================================
   Unipack Ops StreamLine — auth (demo only, not for production use)
   ========================================================================== */

const ACCOUNTS = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
  { username: 'dataentry', password: 'entry123', role: 'dataentry', name: 'Data Entry' },
  { username: 'fulfillment', password: 'fulfill123', role: 'fulfillment', name: 'Fulfillment' },
];

const SESSION_KEY = 'unipack_session';

function login(username, password) {
  const acct = ACCOUNTS.find(
    (a) => a.username.toLowerCase() === String(username).toLowerCase() && a.password === password
  );
  if (!acct) return false;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ username: acct.username, role: acct.role, name: acct.name }));
  return true;
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

function homeFor(role) {
  if (role === 'dataentry') return 'data-entry.html';
  if (role === 'fulfillment') return 'fulfillment.html';
  return 'dashboard.html';
}

/**
 * Call at the top of any protected page.
 * allowedRoles: array of roles permitted on this page.
 */
function requireAuth(allowedRoles) {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    window.location.href = homeFor(session.role);
    return null;
  }
  return session;
}
