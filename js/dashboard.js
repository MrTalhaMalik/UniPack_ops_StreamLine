/* ==========================================================================
   Unipack Ops StreamLine — dashboard page logic
   ========================================================================== */

requireAuth(['admin']);
seedIfEmpty();
renderNav('dashboard');

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.round(hrs / 24) + 'd ago';
}

function renderInventoryStats() {
  const mount = document.getElementById('inventory-stats');
  const stats = getAllStats();
  const totalInventory = stats.reduce((s, p) => s + p.available, 0);
  const totalInTransit = stats.reduce((s, p) => s + p.inTransit, 0);
  const totalLost = stats.reduce((s, p) => s + p.lost, 0);
  const queue = getTVQueue();
  const totalQueueDeficit = queue.reduce((s, q) => s + q.deficit, 0);
  const anomalies = getAnomalies();
  const anomalyCount = anomalies.bypasses.length + anomalies.redundant.length + anomalies.discrepant.length;

  mount.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Units in Inventory</div>
      <div class="stat-value">${totalInventory}</div>
      <div class="stat-sub">${totalInTransit} in transit · ${totalLost} lost in transit · <a href="inventory.html" style="color:var(--ink-2);">full breakdown →</a></div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Awaiting Production</div>
      <div class="stat-value ${totalQueueDeficit > 0 ? 'tone-warn' : ''}">${totalQueueDeficit}</div>
      <div class="stat-sub">units queued on the floor TV right now</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Flagged Anomalies</div>
      <div class="stat-value ${anomalyCount > 0 ? 'tone-bad' : ''}">${anomalyCount}</div>
      <div class="stat-sub">bypass, redundant production &amp; shrinkage events</div>
    </div>
  `;
}

function renderAnomalyPanel() {
  const mount = document.getElementById('anomaly-panel');
  const rows = getAnomalyBreakdown();
  const totalFlags = rows.reduce((s, r) => s + r.bypassQty + r.redundantBatches + r.shrinkageQty, 0);

  if (totalFlags === 0) {
    mount.innerHTML = `<div class="empty-state">No anomalies detected.</div>`;
    return;
  }

  const cell = (v) => `<td class="${v > 0 ? 'nonzero' : 'zero'}">${v}</td>`;

  mount.innerHTML = `
    <div class="table-wrap">
      <table class="compliance-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Bypassed Inventory (units)</th>
            <th>Redundant Production (batches)</th>
            <th>Shrinkage (units)</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r) => `
            <tr>
              <td><span class="product-chip"><span class="product-dot" style="background:${PRODUCT_META[r.product].color}"></span>${PRODUCT_META[r.product].short}</span></td>
              ${cell(r.bypassQty)}
              ${cell(r.redundantBatches)}
              ${cell(r.shrinkageQty)}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderQueuePanel() {
  const mount = document.getElementById('queue-panel');
  const queue = getTVQueue();

  if (queue.length === 0) {
    mount.innerHTML = `<div class="empty-state">Nothing queued — inventory covers every open order.</div>`;
    return;
  }

  let html = '';
  queue.forEach((q) => {
    const meta = PRODUCT_META[q.product];
    html += `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:11px 0; border-bottom:1px solid var(--line);">
        <div class="product-chip"><span class="product-dot" style="background:${meta.color}"></span>${q.product}</div>
        <span class="badge badge-amber">Make ${q.deficit}</span>
      </div>`;
  });
  mount.innerHTML = html;
}

function activityMeta(type) {
  switch (type) {
    case 'produced': return { label: 'Produced', cls: 'badge-gray' };
    case 'bypass': return { label: 'Bypass', cls: 'badge-red' };
    case 'received': return { label: 'Received', cls: 'badge-gray' };
    case 'received_short': return { label: 'Short', cls: 'badge-amber' };
    case 'order_item': return { label: 'Order', cls: 'badge-blue' };
    case 'restock_requested': return { label: 'Restock', cls: 'badge-blue' };
    default: return { label: '—', cls: 'badge-gray' };
  }
}

function activityText(e) {
  const short = PRODUCT_META[e.product] ? PRODUCT_META[e.product].short : e.product;
  switch (e.type) {
    case 'produced': return `<strong>${e.by}</strong> produced <strong>${e.qty} ${short}</strong>`;
    case 'bypass': return `<strong>${e.by}</strong> produced <strong>${e.qty} ${short}</strong> — sent straight to customer`;
    case 'received': return `<strong>${e.by}</strong> received <strong>${e.qty} ${short}</strong>`;
    case 'received_short': return `<strong>${e.by}</strong> received <strong>${e.qty} ${short}</strong> — short by ${e.extra}`;
    case 'order_item': return `Order placed for <strong>${e.qty} ${short}</strong>`;
    case 'restock_requested': return `<strong>${e.by}</strong> requested <strong>${e.qty} ${short}</strong> for production`;
    default: return '';
  }
}

function renderActivityFeed() {
  const mount = document.getElementById('activity-feed');
  const events = getActivityFeed(12);

  if (events.length === 0) {
    mount.innerHTML = `<div class="empty-state">No activity yet.</div>`;
    return;
  }

  mount.innerHTML = events.map((e) => {
    const meta = activityMeta(e.type);
    return `
      <div class="activity-item">
        <span class="badge ${meta.cls} activity-tag">${meta.label}</span>
        <div class="activity-text">${activityText(e)}</div>
        <div class="activity-time">${timeAgo(e.at)}</div>
      </div>`;
  }).join('');
}

function renderAll() {
  renderInventoryStats();
  renderAnomalyPanel();
  renderQueuePanel();
  renderActivityFeed();
}

renderAll();
setInterval(renderAll, 4000);

document.getElementById('reset-data-btn').addEventListener('click', () => {
  if (confirm('Reset all demo data back to the seeded starting point? This clears every entry made so far.')) {
    resetDemoData();
    renderAll();
  }
});
