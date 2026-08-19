/* ==========================================================================
   Unipack Ops StreamLine — fulfillment page logic
   This role does one thing: work the order queue. Pick what's in
   inventory, wait on what's still in production, mark it done.
   ========================================================================== */

const session = requireAuth(['admin', 'fulfillment']);
seedIfEmpty();
renderNav('fulfillment');

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.round(hrs / 24) + 'd ago';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function orderBadge(order) {
  const fStatus = order.fulfillment.status;
  if (fStatus === 'complete') return { label: 'Ready to Ship', cls: 'badge-blue' };
  if (fStatus === 'shipped') return { label: 'Shipped', cls: 'badge-green' };

  const oStatus = getOrderStatus(order);
  if (oStatus === 'fulfilled') return { label: 'Ready to Pick', cls: 'badge-blue' };
  return { label: 'Waiting on Production', cls: 'badge-amber' };
}

function renderOrderCard(order) {
  const badge = orderBadge(order);
  const canComplete = order.fulfillment.status === 'pending' && getOrderStatus(order) === 'fulfilled';
  const isWaiting = order.fulfillment.status === 'pending' && getOrderStatus(order) !== 'fulfilled';
  const canShip = order.fulfillment.status === 'complete';

  const itemsRows = order.items.map((i) => {
    const ready = i.qty - i.remaining;
    return `
      <tr>
        <td><span class="product-chip"><span class="product-dot" style="background:${PRODUCT_META[i.product].color}"></span>${i.product}</span></td>
        <td style="text-align:right;">${i.qty}</td>
        <td style="text-align:right; font-weight:650;">${ready}</td>
        <td style="text-align:right; font-weight:650; ${i.remaining > 0 ? 'color:var(--warn-fg);' : 'color:var(--faint);'}">${i.remaining}</td>
      </tr>`;
  }).join('');

  let actionsHtml = '';
  if (canComplete) {
    actionsHtml = `<button type="button" class="btn btn-primary btn-sm" data-complete="${order.id}">Mark Order Complete</button>`;
  } else if (isWaiting) {
    actionsHtml = `<span class="form-hint">Waiting on production for some items — nothing to pick yet on those.</span>`;
  } else if (canShip) {
    actionsHtml = `<button type="button" class="btn btn-primary btn-sm" data-ship="${order.id}">Mark Shipped</button>`;
  }

  return `
    <div class="card" style="margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
        <div>
          <div style="font-weight:650; font-size:15px; color:var(--ink);">${order.customer}</div>
          <div class="form-hint">placed ${timeAgo(order.createdAt)}</div>
        </div>
        <span class="badge ${badge.cls}">${badge.label}</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align:right;">Ordered</th>
              <th style="text-align:right;">Ready to Pick</th>
              <th style="text-align:right;">Waiting on Production</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
      </div>
      <div style="margin-top:14px;">${actionsHtml}</div>
    </div>`;
}

function renderShippedRow(order) {
  const items = order.items.map((i) => `${PRODUCT_META[i.product].short} × ${i.qty}`).join(', ');
  return `
    <div class="recent-log-item">
      <span><strong>${order.customer}</strong> — ${items}</span>
      <span class="form-hint">shipped ${timeAgo(order.fulfillment.shippedAt)}</span>
    </div>`;
}

function renderAll() {
  const db = loadDB();
  const active = db.orders
    .filter((o) => o.fulfillment.status !== 'shipped')
    .sort((a, b) => a.createdAt - b.createdAt);
  const shipped = db.orders
    .filter((o) => o.fulfillment.status === 'shipped')
    .sort((a, b) => b.fulfillment.shippedAt - a.fulfillment.shippedAt)
    .slice(0, 10);

  const listMount = document.getElementById('fulfillment-list');
  listMount.innerHTML = active.length === 0
    ? `<div class="empty-state">No open orders right now.</div>`
    : active.map(renderOrderCard).join('');

  const shippedMount = document.getElementById('shipped-list');
  shippedMount.innerHTML = shipped.length === 0
    ? `<div class="empty-state">Nothing shipped yet.</div>`
    : shipped.map(renderShippedRow).join('');

  listMount.querySelectorAll('[data-complete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const order = markOrderComplete(btn.dataset.complete, session.name);
      if (order) showToast(`Order for ${order.customer} marked complete.`);
      renderAll();
    });
  });

  listMount.querySelectorAll('[data-ship]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const order = markOrderShipped(btn.dataset.ship, session.name);
      if (order) showToast(`Order for ${order.customer} marked shipped.`);
      renderAll();
    });
  });
}

renderAll();
setInterval(renderAll, 4000);
