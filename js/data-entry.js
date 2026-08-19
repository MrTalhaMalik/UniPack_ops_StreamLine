/* ==========================================================================
   Unipack Ops StreamLine — data entry page logic
   This account can only ever add data. No dashboards, no inventory
   numbers, no orders — just the two count-entry forms below.
   ========================================================================== */

const session = requireAuth(['admin', 'dataentry']);
seedIfEmpty();
renderNav('data-entry');

const sessionLog = [];

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderSessionLog() {
  const mount = document.getElementById('session-log');
  if (sessionLog.length === 0) {
    mount.innerHTML = `<div class="empty-state">Nothing submitted yet.</div>`;
    return;
  }
  mount.innerHTML = sessionLog.slice().reverse().map((entry) => `
    <div class="recent-log-item">
      <span>${entry.text}</span>
      <span class="form-hint">${entry.time}</span>
    </div>`).join('');
}

/* ---------------------------- tabs ---------------------------- */

document.querySelectorAll('.entry-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.entry-tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.entry-panel').forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

/* ---------------------------- production form ---------------------------- */

function populateProductSelect() {
  initProductPicker('prod-product-picker');
}

document.getElementById('prod-bypass').addEventListener('change', function () {
  document.getElementById('prod-customer-group').style.display = this.checked ? 'block' : 'none';
});

document.getElementById('production-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const product = document.getElementById('prod-product').value;
  const qty = parseInt(document.getElementById('prod-qty').value, 10);
  const bypass = document.getElementById('prod-bypass').checked;
  const customer = document.getElementById('prod-customer').value.trim();

  if (!product) { showToast('Search and select a product first.'); return; }
  if (!qty || qty <= 0) { showToast('Enter a valid quantity.'); return; }
  if (bypass && !customer) { showToast('Enter the customer name for the direct hand-off.'); return; }

  addProductionBatch(product, qty, session.name, { directIssue: bypass, customer });

  sessionLog.push({
    text: bypass
      ? `${qty} ${PRODUCT_META[product].short} produced → given directly to ${customer}`
      : `${qty} ${PRODUCT_META[product].short} produced → sent to inventory`,
    time: timeNow(),
  });
  renderSessionLog();

  showToast('Production count logged.');
  this.reset();
  document.getElementById('prod-customer-group').style.display = 'none';
  populateReceivingSelect();
});

/* ---------------------------- receiving form ---------------------------- */

function populateReceivingSelect() {
  const select = document.getElementById('recv-batch');
  const hint = document.getElementById('recv-empty-hint');
  const previouslySelected = select.value;
  const pending = getPendingBatches();

  if (pending.length === 0) {
    select.innerHTML = '';
    select.disabled = true;
    hint.style.display = 'block';
    document.querySelector('#received-form button[type="submit"]').disabled = true;
    return;
  }

  select.disabled = false;
  hint.style.display = 'none';
  document.querySelector('#received-form button[type="submit"]').disabled = false;

  select.innerHTML = pending.map((b) => {
    const mins = Math.round((Date.now() - b.producedAt) / 60000);
    const when = mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`;
    return `<option value="${b.id}">${PRODUCT_META[b.product].short} — ${b.qty} produced by ${b.producedBy} (${when})</option>`;
  }).join('');

  if (pending.some((b) => b.id === previouslySelected)) {
    select.value = previouslySelected;
  }
}

document.getElementById('received-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const batchId = document.getElementById('recv-batch').value;
  const qty = parseInt(document.getElementById('recv-qty').value, 10);

  if (!batchId) { showToast('No batch selected.'); return; }
  if (qty === '' || isNaN(qty) || qty < 0) { showToast('Enter a valid quantity.'); return; }

  const db = loadDB();
  const batch = db.batches.find((b) => b.id === batchId);
  const batchQty = batch ? batch.qty : null;

  const result = receiveBatch(batchId, qty, session.name);
  if (!result) { showToast('That batch is no longer pending.'); populateReceivingSelect(); return; }

  const short = batchQty !== null && qty < batchQty ? ` — short by ${batchQty - qty}` : '';
  sessionLog.push({
    text: `${qty} ${PRODUCT_META[result.product].short} received into inventory${short}`,
    time: timeNow(),
  });
  renderSessionLog();

  showToast('Received count logged.');
  this.reset();
  populateReceivingSelect();
});

populateProductSelect();
populateReceivingSelect();
renderSessionLog();
setInterval(populateReceivingSelect, 5000);
