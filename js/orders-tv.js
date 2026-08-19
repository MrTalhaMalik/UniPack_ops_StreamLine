/* ==========================================================================
   Unipack Ops StreamLine — Floor TV logic
   Public kiosk display: shows only the quantity of each product still
   needed on top of what's already sitting in inventory.
   ========================================================================== */

seedIfEmpty();

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.round(mins / 60);
  return hrs + 'h ago';
}

function updateClock() {
  const el = document.getElementById('tv-clock');
  el.textContent = new Date().toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

function renderTV() {
  const body = document.getElementById('tv-body');
  const queue = getTVQueue().sort((a, b) => a.entries[0].createdAt - b.entries[0].createdAt);

  if (queue.length === 0) {
    body.className = '';
    body.innerHTML = `
      <div class="tv-empty">
        <h2>All Caught Up</h2>
        <p>Inventory covers every open order. Nothing new to produce right now.</p>
      </div>`;
    return;
  }

  body.className = 'tv-grid';
  body.innerHTML = queue.map((q) => {
    const meta = PRODUCT_META[q.product];
    const oldest = q.entries[0];
    const isUrgent = (Date.now() - oldest.createdAt) > 3 * 3600 * 1000;
    const ordersHtml = q.entries.slice(0, 3).map((entry) => `
      <div class="tv-order-line"><span>${entry.label}</span><strong>${entry.remaining}</strong></div>
    `).join('');
    return `
      <div class="tv-card ${isUrgent ? 'urgent' : ''}" style="--accent:${meta.color}">
        <div class="tv-card-name">${q.product}</div>
        <div class="tv-card-code">${meta.code ? '#' + meta.code : ''}</div>
        <div class="tv-card-qty">${q.deficit}</div>
        <div class="tv-card-unit">units to make</div>
        <div class="tv-card-orders">
          ${ordersHtml}
          <div class="tv-order-line" style="opacity:0.6;">oldest waiting ${timeAgo(oldest.createdAt)}</div>
        </div>
      </div>`;
  }).join('');
}

updateClock();
renderTV();
setInterval(updateClock, 1000 * 30);
setInterval(renderTV, 3000);
window.addEventListener('storage', renderTV);
