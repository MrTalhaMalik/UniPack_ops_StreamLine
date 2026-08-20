/* ==========================================================================
   Unipack Ops StreamLine — product tracking page logic
   ========================================================================== */

requireAuth(['admin']);
seedIfEmpty();
renderNav('tracking');

let dateRange = null;

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.round(hrs / 24) + 'd ago';
}

function populateFilter() {
  const select = document.getElementById('product-filter');
  select.insertAdjacentHTML('beforeend', productSelectOptionsHtml());
  select.addEventListener('change', renderAll);
}

function flowStepHtml(cls, value, label) {
  return `<div class="flow-step ${cls}"><div class="flow-value">${value}</div><div class="flow-label">${label}</div></div>`;
}

function renderFlowForProduct(product) {
  const s = getProductStats(product, dateRange);
  const meta = PRODUCT_META[product];

  let html = `
    <div class="card section-gap">
      <div class="card-title"><span class="product-dot" style="background:${meta.color}; margin-right:6px;"></span>${product} — Pipeline</div>
      <div class="flow-row">
        ${flowStepHtml('', s.totalProduced, 'Produced')}
        <div class="flow-arrow">→</div>
        ${flowStepHtml('', s.inTransit, 'In Transit to Inventory')}
        <div class="flow-arrow">→</div>
        ${flowStepHtml('', s.received, 'Received @ Inventory')}
        <div class="flow-arrow">→</div>
        ${flowStepHtml('final', s.available, 'In Inventory')}
      </div>
      <div class="grid grid-3" style="margin-top:14px;">
        <div class="stat-card">
          <div class="stat-label">Lost in Transit</div>
          <div class="stat-value ${s.lost > 0 ? 'tone-bad' : ''}">${s.lost}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Bypassed Inventory</div>
          <div class="stat-value ${s.bypassedQty > 0 ? 'tone-bad' : ''}">${s.bypassedQty}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Redundant Batches</div>
          <div class="stat-value ${s.redundantCount > 0 ? 'tone-warn' : ''}">${s.redundantCount}</div>
        </div>
      </div>
    </div>
  `;
  return html;
}

function statusBadge(batch) {
  if (batch.directIssue) return `<span class="badge badge-red">Bypassed Inventory</span>`;
  if (batch.status === 'in_transit') return `<span class="badge badge-amber">In Transit</span>`;
  if (batch.status === 'received' && batch.discrepancy > 0) return `<span class="badge badge-red">Received — Short</span>`;
  return `<span class="badge badge-green">Received — Matched</span>`;
}

function renderBatchTable(product) {
  const db = loadDB();
  let batches = db.batches.slice().sort((a, b) => b.producedAt - a.producedAt);
  if (product !== '__all__') batches = batches.filter((b) => b.product === product);
  if (dateRange) batches = batches.filter((b) => inRange(b.producedAt, dateRange));

  const tbody = document.getElementById('batch-table-body');

  if (batches.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state">No batches in this range.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = batches.map((b) => {
    const meta = PRODUCT_META[b.product];
    const flags = [];
    if (b.possiblyRedundant) flags.push(`<span class="badge badge-amber">Redundant</span>`);
    return `
      <tr>
        <td><span class="product-chip"><span class="product-dot" style="background:${meta.color}"></span>${meta.short}</span></td>
        <td>${b.qty}</td>
        <td>${b.producedBy}</td>
        <td>${timeAgo(b.producedAt)}</td>
        <td>${statusBadge(b)}</td>
        <td>${b.status === 'received' ? b.receivedQty : '—'}</td>
        <td>${b.status === 'received' && b.discrepancy !== 0 ? (b.discrepancy > 0 ? `-${b.discrepancy}` : `+${Math.abs(b.discrepancy)}`) : '—'}</td>
        <td>${flags.join(' ') || '—'}</td>
      </tr>`;
  }).join('');
}

function renderAll() {
  const product = document.getElementById('product-filter').value;
  const flowMount = document.getElementById('flow-sections');

  if (product === '__all__') {
    const db = loadDB();
    const activeProducts = PRODUCTS.filter((p) => db.batches.some((b) => b.product === p && (!dateRange || inRange(b.producedAt, dateRange))));
    flowMount.innerHTML = activeProducts.length > 0
      ? activeProducts.map(renderFlowForProduct).join('')
      : `<div class="card"><div class="empty-state">No production activity in this range. Try widening the date filter.</div></div>`;
  } else {
    flowMount.innerHTML = renderFlowForProduct(product);
  }

  renderBatchTable(product);
}

populateFilter();
initDateRangeFilter((range) => { dateRange = range; renderAll(); }, 30);
setInterval(renderAll, 4000);
