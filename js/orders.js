/* ==========================================================================
   Unipack Ops StreamLine — orders page logic (multi-item cart)
   ========================================================================== */

const session = requireAuth(['admin']);
seedIfEmpty();
renderNav('orders');

let cart = []; // { product, qty }

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

function populateProductSelect() {
  initProductPicker('cart-product-picker');
  document.getElementById('cart-product').addEventListener('change', updateInventoryPreview);
}

function updateInventoryPreview() {
  const product = document.getElementById('cart-product').value;
  const box = document.getElementById('inventory-preview');
  if (!product) { box.innerHTML = 'Search and select a product to see current inventory.'; return; }
  const inv = getInventory(product);
  box.innerHTML = `${inv} ${PRODUCT_META[product].short} currently in inventory.`;
}

/* ---------------------------- cart ---------------------------- */

function renderCart() {
  const mount = document.getElementById('cart-list');

  if (cart.length === 0) {
    mount.innerHTML = `<div class="empty-state" style="padding:20px;">Cart is empty — add an item above.</div>`;
    return;
  }

  mount.innerHTML = cart.map((line, i) => {
    const meta = PRODUCT_META[line.product];
    return `
      <div class="recent-log-item">
        <span class="product-chip"><span class="product-dot" style="background:${meta.color}"></span>${meta.short} × ${line.qty}</span>
        <button type="button" class="btn btn-outline btn-sm" style="color:var(--bad-fg);" data-remove="${i}">Remove</button>
      </div>`;
  }).join('');

  mount.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      cart.splice(parseInt(btn.dataset.remove, 10), 1);
      renderCart();
    });
  });
}

document.getElementById('add-to-cart-btn').addEventListener('click', () => {
  const product = document.getElementById('cart-product').value;
  const qty = parseInt(document.getElementById('cart-qty').value, 10);

  if (!product) { showToast('Search and select a product first.'); return; }
  if (!qty || qty <= 0) { showToast('Enter a valid quantity.'); return; }

  const existing = cart.find((l) => l.product === product);
  if (existing) existing.qty += qty;
  else cart.push({ product, qty });

  document.getElementById('cart-qty').value = '';
  renderCart();
});

document.getElementById('place-order-btn').addEventListener('click', () => {
  const customer = document.getElementById('customer').value.trim();

  if (!customer) { showToast('Enter a customer name.'); return; }
  if (cart.length === 0) { showToast('Add at least one item to the cart.'); return; }

  const order = createOrder(customer, cart, session.name);
  const totalQty = order.items.reduce((s, i) => s + i.qty, 0);
  const queuedQty = order.items.reduce((s, i) => s + i.remaining, 0);

  if (queuedQty === 0) {
    showToast(`Order placed — fully covered by inventory (${totalQty} units).`);
  } else {
    showToast(`Order placed — ${totalQty - queuedQty} from inventory, ${queuedQty} queued to the floor TV.`);
  }

  cart = [];
  document.getElementById('customer').value = '';
  renderCart();
  renderOrdersTable();
});

/* ---------------------------- orders table ---------------------------- */

function statusBadge(status) {
  if (status === 'fulfilled') return `<span class="badge badge-green">Fulfilled</span>`;
  if (status === 'partial') return `<span class="badge badge-amber">Partial — Queued</span>`;
  return `<span class="badge badge-gray">Queued</span>`;
}

function renderOrdersTable() {
  const db = loadDB();
  const orders = db.orders.slice().sort((a, b) => b.createdAt - a.createdAt);
  const tbody = document.getElementById('orders-table-body');

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">No orders yet.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map((o) => {
    const totalQty = o.items.reduce((s, i) => s + i.qty, 0);
    const queuedQty = o.items.reduce((s, i) => s + i.remaining, 0);
    const itemsHtml = o.items.map((i) => {
      const meta = PRODUCT_META[i.product];
      return `<span class="product-chip" style="margin-right:10px;"><span class="product-dot" style="background:${meta.color}"></span>${meta.short} × ${i.qty}</span>`;
    }).join('');

    return `
      <tr>
        <td><strong>${o.customer}</strong></td>
        <td>${itemsHtml}</td>
        <td>${totalQty}</td>
        <td>${totalQty - queuedQty}</td>
        <td>${queuedQty > 0 ? queuedQty : '—'}</td>
        <td>${statusBadge(getOrderStatus(o))}</td>
        <td>${timeAgo(o.createdAt)}</td>
      </tr>`;
  }).join('');
}

/* ---------------------------- restock requests ---------------------------- */

function populateRestockProductSelect() {
  initProductPicker('restock-product-picker');
  document.getElementById('restock-product').addEventListener('change', updateRestockInventoryPreview);
}

function updateRestockInventoryPreview() {
  const product = document.getElementById('restock-product').value;
  const box = document.getElementById('restock-inventory-preview');
  if (!product) { box.innerHTML = 'Search and select a product to see current inventory.'; return; }
  const inv = getInventory(product);
  box.innerHTML = `${inv} ${PRODUCT_META[product].short} currently in inventory.`;
}

document.getElementById('send-restock-btn').addEventListener('click', () => {
  const product = document.getElementById('restock-product').value;
  const qty = parseInt(document.getElementById('restock-qty').value, 10);

  if (!product) { showToast('Search and select a product first.'); return; }
  if (!qty || qty <= 0) { showToast('Enter a valid quantity.'); return; }

  createRestockRequest(product, qty, session.name);
  showToast(`Sent to production — ${qty} ${PRODUCT_META[product].short} queued on the floor TV.`);

  document.getElementById('restock-qty').value = '';
  renderAll();
});

function restockStatusBadge(r) {
  return r.remaining === 0
    ? `<span class="badge badge-green">Fulfilled</span>`
    : `<span class="badge badge-amber">Queued</span>`;
}

function renderRestockTable() {
  const db = loadDB();
  const restocks = db.restocks.slice().sort((a, b) => b.createdAt - a.createdAt);
  const tbody = document.getElementById('restock-table-body');

  if (restocks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">No restock requests yet.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = restocks.map((r) => {
    const meta = PRODUCT_META[r.product];
    return `
      <tr>
        <td><span class="product-chip"><span class="product-dot" style="background:${meta.color}"></span>${meta.short}</span></td>
        <td>${r.qty}</td>
        <td>${r.remaining}</td>
        <td>${restockStatusBadge(r)}</td>
        <td>${timeAgo(r.createdAt)}</td>
      </tr>`;
  }).join('');
}

function renderAll() {
  renderOrdersTable();
  updateInventoryPreview();
  renderRestockTable();
  updateRestockInventoryPreview();
}

populateProductSelect();
populateRestockProductSelect();
renderCart();
renderAll();
setInterval(renderAll, 4000);
