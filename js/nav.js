/* ==========================================================================
   Unipack Ops StreamLine — shared top navigation
   Renders into <div id="app-nav"></div>. Admin sees full nav;
   data-entry accounts only ever see their own single page.
   ========================================================================== */

function renderNav(activePage) {
  const mount = document.getElementById('app-nav');
  if (!mount) return;
  const session = getSession();
  if (!session) return;

  const links = [
    { page: 'dashboard', href: 'dashboard.html', label: 'Dashboard' },
    { page: 'inventory', href: 'inventory.html', label: 'Inventory' },
    { page: 'tracking', href: 'tracking.html', label: 'Product Tracking' },
    { page: 'orders', href: 'orders.html', label: 'Orders' },
    { page: 'management', href: 'management.html', label: 'Management' },
    { page: 'orders-tv', href: 'orders-tv.html', label: 'Floor TV' },
  ];

  const linksHtml = session.role === 'admin'
    ? links.map((l) => `<a href="${l.href}" class="nav-link${activePage === l.page ? ' active' : ''}">${l.label}</a>`).join('')
    : '';

  mount.innerHTML = `
    <div class="nav-inner">
      <div class="nav-brand">
        <span class="nav-brand-mark">UP</span>
        <span class="nav-brand-text">Unipack <span>Ops StreamLine</span></span>
      </div>
      <nav class="nav-links">${linksHtml}</nav>
      <div class="nav-user">
        <span class="nav-user-name">${session.name}</span>
        <span class="nav-role-badge">${session.role === 'admin' ? 'Admin' : 'Data Entry'}</span>
        <button class="btn btn-ghost btn-sm" id="nav-logout-btn">Log out</button>
      </div>
    </div>
  `;

  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
}
