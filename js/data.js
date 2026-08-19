/* ==========================================================================
   Unipack Ops StreamLine — shared data layer
   A tiny "database" backed by localStorage. No backend, no build step.
   ========================================================================== */

const PRODUCT_CATEGORIES = {
  garbage:     { label: 'Garbage Bags',              color: '#55677e' },
  laundry:     { label: 'Laundry Bags & Rolls',       color: '#8a6a45' },
  foodservice: { label: 'Foodservice Disposables',    color: '#4f7d68' },
  shopping:    { label: 'Shopping & Printing Bags',   color: '#7d5a75' },
  trash:       { label: 'Trash Bags & Table Sheets',  color: '#6b6f57' },
};

const PRODUCT_CATALOG = [
  { code: '1091001', name: 'GARBAGE BAGS 105X130 CM 20KG', category: 'garbage' },
  { code: '1091002', name: 'GARBAGE BAGS 120X140 CM 14KG', category: 'garbage' },
  { code: '1091004', name: 'GARBAGE BAGS 65 X 80 CM 10 KG', category: 'garbage' },
  { code: '1091007', name: 'GARBAGE BAGS 85X110 CM 9 KG', category: 'garbage' },
  { code: '1091010', name: 'GARBAGE BAGS 90X110 CM 10KG', category: 'garbage' },
  { code: '1091011', name: 'GARBAGE BAGS 90X110 CM 11KG', category: 'garbage' },
  { code: '1091012', name: 'GARBAGE BAGS 90X110 CM 12KG', category: 'garbage' },
  { code: '1091013', name: 'GARBAGE BAGS 90X110 CM 13 KG', category: 'garbage' },
  { code: '1091014', name: 'GARBAGE BAGS 90X110 CM 14KG', category: 'garbage' },
  { code: '1091015', name: 'GARBAGE BAGS 90X110 CM 15KG', category: 'garbage' },
  { code: '1091017', name: 'GARBAGE BAGS 90X110 CM 20KG', category: 'garbage' },
  { code: '1091019', name: 'GARBAGE BAGS 95X115 CM 12KG', category: 'garbage' },
  { code: '1091020', name: 'GARBAGE BAGS 95X115 CM 20KG', category: 'garbage' },
  { code: '1091022', name: 'GARBAGE BAGS 65 X 80 9KG', category: 'garbage' },
  { code: '1091023', name: 'GARBAGE BAGS 120X140 12KG', category: 'garbage' },
  { code: '1091025', name: 'GARBAGE BAGS 65 X 80 CM 8KG', category: 'garbage' },
  { code: '1091026', name: 'GARBAGE BAGS 80X110 CM 16KG', category: 'garbage' },
  { code: '1091027', name: 'GARBAGE BAGS 80X110 CM 20KG', category: 'garbage' },
  { code: '1091034', name: 'GARBAGE BAGS 95X110 CM 10KG', category: 'garbage' },
  { code: '1091036', name: 'GARBAGE BAGS 80X110 CM 14KG', category: 'garbage' },
  { code: '1091038', name: 'GARBAGE BAGS 120X140 CM 16KG', category: 'garbage' },
  { code: '1091039', name: 'GARBAGE BAGS 120X140 10KG', category: 'garbage' },
  { code: '1091041', name: 'GARBAGE BAG 90X110 19KG', category: 'garbage' },
  { code: '1121001', name: 'LAUNDRY BAG  (30X50CM) 20 KG', category: 'laundry' },
  { code: '1121004', name: 'LAUNDRY BAG  (60X160CM) 20 KG', category: 'laundry' },
  { code: '1121005', name: 'LAUNDRY BAG  (60X165CM) 20 KG', category: 'laundry' },
  { code: '1121006', name: 'LAUNDRY BAG  (60X90CM) 20 KG', category: 'laundry' },
  { code: '1121007', name: 'LAUNDRY BAG  (70X90CM)  20 KG', category: 'laundry' },
  { code: '1121008', name: 'LAUNDRY ROLL (60X160) 5 KG', category: 'laundry' },
  { code: '1121009', name: 'LAUNDRY ROLL (60X90) 5 KG', category: 'laundry' },
  { code: '1121011', name: 'LAUNDRY ROLL 40CM 20 KG', category: 'laundry' },
  { code: '1121023', name: '60X65 YELLOW LD BAG LARGE 18 KG', category: 'laundry' },
  { code: '1121022', name: '55X48 YELLOW LD BAG MEDIUM 18 KG', category: 'laundry' },
  { code: '1121021', name: '45X44 YELLOW LD BAG SMALL 18 KG', category: 'laundry' },
  { code: '1121024', name: '45 X 44 YELLOW LD BAG SMALL 20 KG', category: 'laundry' },
  { code: '1121025', name: '55X48 YELLOW LD BAG MEDIUM 20 KG', category: 'laundry' },
  { code: '1121026', name: '60X65 YELLOW LD BAG LARGE 20 KG', category: 'laundry' },
  { code: '1121029', name: 'LD CLEAR BAGS', category: 'laundry' },
  { code: '1121031', name: 'LD SHOPPING BAGS', category: 'laundry' },
  { code: '1121032', name: 'LAUNDRY BAG  (30X40CM) 20 KG', category: 'laundry' },
  { code: '1121033', name: 'LAUNDRY ROLL (60X120) 5 KG', category: 'laundry' },
  { code: '1121035', name: 'LAUNDRY ROLL 47CM 10 KG', category: 'laundry' },
  { code: '1121036', name: 'LAUNDRY BAG  (60X170CM) 20 KG', category: 'laundry' },
  { code: '1121037', name: 'LAUNDRY BAG (70X130) 20KG', category: 'laundry' },
  { code: '1221001', name: 'PP DRINKING CUP 6.5 oz', category: 'foodservice' },
  { code: '1221004', name: 'ROUND PLATE 180mm', category: 'foodservice' },
  { code: '1221005', name: 'ROUND PLATE 220mm', category: 'foodservice' },
  { code: '1221006', name: 'ROUND PLATE 260mm', category: 'foodservice' },
  { code: '1221008', name: 'SINGLE COMPARTMENT FOOD CONTAINER', category: 'foodservice' },
  { code: '1221009', name: 'DOUBLE COMPARTMENT FOOD CONTAINER', category: 'foodservice' },
  { code: '1221010', name: 'THREE COMPARTMENT FOOD CONTAINER', category: 'foodservice' },
  { code: '1081001', name: 'SHOPPING BAGS SMALL', category: 'shopping' },
  { code: '1081002', name: 'SHOPPING BAGS MEDIUM', category: 'shopping' },
  { code: '1081003', name: 'SHOPPING BAGS LARGE', category: 'shopping' },
  { code: '1081004', name: 'PRINTING BAGS', category: 'shopping' },
  { code: '1081006', name: 'HD SHOPPING BAGS', category: 'shopping' },
  { code: '1081007', name: 'VEGETABLE AND FRUIT ROLL 1X4', category: 'shopping' },
  { code: '1111001', name: '50X60CM WHITE TRASH BAG 7KG', category: 'trash' },
  { code: '1111002', name: '50X60CM WHITE TRASH BAGE', category: 'trash' },
  { code: '1111005', name: 'TABLE SHEET 100X110 CM (1X10 ROLL) 7KG', category: 'trash' },
  { code: '', name: 'TABLE SHEET 100X110 CM (1X10 ROLL) 6KG', category: 'trash' },
  { code: '1111004', name: 'TABLE SHEET 100X110 CM (1X12 ROLL) 8KG', category: 'trash' },
  { code: '1111007', name: 'TABLE SHEET 100X110 CM (1X40 ROLL)', category: 'trash' },
  { code: '1111008', name: 'TABLE SHEET 140X140 CM 3KG', category: 'trash' },
  { code: '1111009', name: 'TABLE SHEET 140X140 CM 10KG', category: 'trash' },
  { code: '1111011', name: 'TABLE SHEET 140X140 CM 5KG', category: 'trash' },
];

const PRODUCTS = PRODUCT_CATALOG.map((p) => p.name);

const PRODUCT_META = {};
PRODUCT_CATALOG.forEach((p) => {
  PRODUCT_META[p.name] = {
    short: p.name,
    code: p.code,
    category: p.category,
    color: PRODUCT_CATEGORIES[p.category].color,
  };
});

function getProductsByCategory() {
  const map = {};
  Object.keys(PRODUCT_CATEGORIES).forEach((catId) => (map[catId] = []));
  PRODUCT_CATALOG.forEach((p) => map[p.category].push(p.name));
  return map;
}

/** <optgroup>-grouped <option> markup, for any product <select>. */
function productSelectOptionsHtml() {
  const grouped = getProductsByCategory();
  return Object.keys(PRODUCT_CATEGORIES)
    .map((catId) => {
      const items = grouped[catId];
      if (items.length === 0) return '';
      const options = items.map((name) => `<option value="${name}">${name}</option>`).join('');
      return `<optgroup label="${PRODUCT_CATEGORIES[catId].label}">${options}</optgroup>`;
    })
    .join('');
}

const STORE_KEY = 'unipack_db_v4';

function uid(prefix) {
  return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function emptyDB() {
  return { batches: [], orders: [], allocations: [], restocks: [] };
}

function loadDB() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return emptyDB();
    const db = JSON.parse(raw);
    db.batches = db.batches || [];
    db.orders = db.orders || [];
    db.allocations = db.allocations || [];
    db.restocks = db.restocks || [];
    return db;
  } catch (e) {
    console.error('Failed to load DB, resetting.', e);
    return emptyDB();
  }
}

function saveDB(db) {
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
}

/* ---------------------------- inventory math ---------------------------- */

function getInventory(product, dbArg) {
  const db = dbArg || loadDB();
  const received = db.batches
    .filter((b) => b.product === product && b.status === 'received')
    .reduce((s, b) => s + b.receivedQty, 0);
  const allocated = db.allocations
    .filter((a) => a.product === product)
    .reduce((s, a) => s + a.qty, 0);
  return received - allocated;
}

/* ---------------------------- production ---------------------------- */

function addProductionBatch(product, qty, producedBy, opts) {
  opts = opts || {};
  const directIssue = !!opts.directIssue;
  const db = loadDB();
  const priorInventory = getInventory(product, db);

  const batch = {
    id: uid('batch'),
    product,
    qty,
    producedBy,
    producedAt: Date.now(),
    status: directIssue ? 'bypassed' : 'in_transit',
    receivedQty: null,
    receivedBy: null,
    receivedAt: null,
    discrepancy: null,
    directIssue,
    customer: directIssue ? (opts.customer || 'Unknown customer') : null,
    possiblyRedundant: priorInventory > 0 ? { priorInventory } : null,
  };

  db.batches.push(batch);
  saveDB(db);
  return batch;
}

function getPendingBatches(product) {
  const db = loadDB();
  return db.batches
    .filter((b) => b.status === 'in_transit' && (!product || b.product === product))
    .sort((a, b) => a.producedAt - b.producedAt);
}

function receiveBatch(batchId, receivedQty, receivedBy) {
  const db = loadDB();
  const batch = db.batches.find((b) => b.id === batchId);
  if (!batch || batch.status !== 'in_transit') return null;

  batch.status = 'received';
  batch.receivedQty = receivedQty;
  batch.receivedBy = receivedBy;
  batch.receivedAt = Date.now();
  batch.discrepancy = batch.qty - receivedQty;
  saveDB(db);

  tryFulfillQueue(batch.product);
  tryFulfillRestocks(batch.product, receivedQty);
  return batch;
}

/* ---------------------------- internal restock requests ----------------------------
   Not a sale — doesn't touch inventory or allocations. It's just a production ask
   that shows on the floor TV and clears itself once enough new stock is received.
   ---------------------------------------------------------------------------------- */

function createRestockRequest(product, qty, requestedBy) {
  const db = loadDB();
  const restock = {
    id: uid('restock'),
    product,
    qty,
    remaining: qty,
    requestedBy: requestedBy || 'Admin',
    createdAt: Date.now(),
    status: 'queued',
  };
  db.restocks.push(restock);
  saveDB(db);
  return restock;
}

function tryFulfillRestocks(product, receivedQty) {
  const db = loadDB();
  let remainingToApply = receivedQty;

  const openRestocks = db.restocks
    .filter((r) => r.product === product && r.remaining > 0)
    .sort((a, b) => a.createdAt - b.createdAt);

  for (const r of openRestocks) {
    if (remainingToApply <= 0) break;
    const apply = Math.min(r.remaining, remainingToApply);
    r.remaining -= apply;
    remainingToApply -= apply;
    if (r.remaining === 0) r.status = 'fulfilled';
  }
  saveDB(db);
}

/* ---------------------------- orders (multi-item cart) ---------------------------- */

/**
 * items: [{ product, qty }, ...]
 * Each line item is allocated independently against inventory —
 * a single order can be fulfilled for some products and queued for others.
 */
function createOrder(customer, items, createdBy) {
  const db = loadDB();
  const order = {
    id: uid('order'),
    customer,
    createdAt: Date.now(),
    createdBy: createdBy || 'Admin',
    items: items.map((it) => ({
      id: uid('item'),
      product: it.product,
      qty: it.qty,
      remaining: it.qty,
      status: 'queued',
    })),
    fulfillment: { status: 'pending', completedAt: null, completedBy: null, shippedAt: null, shippedBy: null },
  };
  db.orders.push(order);
  saveDB(db);

  order.items.forEach((item) => allocateItemFromInventory(order.id, item.id));
  return loadDB().orders.find((o) => o.id === order.id);
}

function allocateItemFromInventory(orderId, itemId) {
  const db = loadDB();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return;
  const item = order.items.find((i) => i.id === itemId);
  if (!item || item.remaining <= 0) return;

  const inv = getInventory(item.product, db);
  if (inv <= 0) return;

  const take = Math.min(inv, item.remaining);
  if (take <= 0) return;

  const alloc = { id: uid('alloc'), orderId, itemId, product: item.product, qty: take, at: Date.now() };
  db.allocations.push(alloc);
  item.remaining -= take;
  item.status = item.remaining === 0 ? 'fulfilled' : 'partial';
  saveDB(db);
}

function tryFulfillQueue(product) {
  const db = loadDB();
  const pendingItems = [];
  db.orders.forEach((o) => {
    o.items.forEach((item) => {
      if (item.product === product && item.remaining > 0) {
        pendingItems.push({ orderId: o.id, itemId: item.id, createdAt: o.createdAt });
      }
    });
  });
  pendingItems.sort((a, b) => a.createdAt - b.createdAt);

  for (const p of pendingItems) {
    if (getInventory(product) <= 0) break;
    allocateItemFromInventory(p.orderId, p.itemId);
  }
}

function getOrderStatus(order) {
  const allFulfilled = order.items.every((i) => i.remaining === 0);
  if (allFulfilled) return 'fulfilled';
  const noneAllocated = order.items.every((i) => i.remaining === i.qty);
  if (noneAllocated) return 'queued';
  return 'partial';
}

/* ---------------------------- order fulfillment lifecycle ----------------------------
   Separate from inventory allocation: this is the physical "pick it, box it,
   ship it" workflow the warehouse follows once stock is available.
   ---------------------------------------------------------------------------------- */

/** Can only be completed once every item on the order is fully covered by inventory. */
function markOrderComplete(orderId, by) {
  const db = loadDB();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order || order.fulfillment.status !== 'pending') return null;
  if (getOrderStatus(order) !== 'fulfilled') return null;

  order.fulfillment.status = 'complete';
  order.fulfillment.completedAt = Date.now();
  order.fulfillment.completedBy = by;
  saveDB(db);
  return order;
}

function markOrderShipped(orderId, by) {
  const db = loadDB();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order || order.fulfillment.status !== 'complete') return null;

  order.fulfillment.status = 'shipped';
  order.fulfillment.shippedAt = Date.now();
  order.fulfillment.shippedBy = by;
  saveDB(db);
  return order;
}

function getTVQueue() {
  const db = loadDB();
  const map = {};
  PRODUCTS.forEach((p) => (map[p] = { product: p, deficit: 0, entries: [] }));

  db.orders.forEach((o) => {
    o.items.forEach((item) => {
      if (item.remaining > 0) {
        map[item.product].deficit += item.remaining;
        map[item.product].entries.push({ label: o.customer, remaining: item.remaining, createdAt: o.createdAt, kind: 'order' });
      }
    });
  });

  db.restocks.forEach((r) => {
    if (r.remaining > 0) {
      map[r.product].deficit += r.remaining;
      map[r.product].entries.push({ label: 'Internal Restock', remaining: r.remaining, createdAt: r.createdAt, kind: 'restock' });
    }
  });

  Object.values(map).forEach((m) => m.entries.sort((a, b) => a.createdAt - b.createdAt));
  return Object.values(map).filter((m) => m.deficit > 0);
}

/* ---------------------------- stats / reporting ---------------------------- */

function getProductStats(product) {
  const db = loadDB();
  const batches = db.batches
    .filter((b) => b.product === product)
    .sort((a, b) => b.producedAt - a.producedAt);

  const totalProduced = batches.reduce((s, b) => s + b.qty, 0);
  const inTransit = batches
    .filter((b) => b.status === 'in_transit')
    .reduce((s, b) => s + b.qty, 0);
  const bypassedQty = batches
    .filter((b) => b.directIssue)
    .reduce((s, b) => s + b.qty, 0);
  const received = batches
    .filter((b) => b.status === 'received')
    .reduce((s, b) => s + b.receivedQty, 0);
  const lost = batches
    .filter((b) => b.status === 'received' && b.discrepancy > 0)
    .reduce((s, b) => s + b.discrepancy, 0);
  const available = getInventory(product, db);
  const allocated = db.allocations
    .filter((a) => a.product === product)
    .reduce((s, a) => s + a.qty, 0);
  const redundantCount = batches.filter((b) => b.possiblyRedundant).length;

  return { product, totalProduced, inTransit, bypassedQty, received, lost, available, allocated, redundantCount, batches };
}

function getAllStats() {
  return PRODUCTS.map(getProductStats);
}

function getAnomalies() {
  const db = loadDB();
  const bypasses = db.batches.filter((b) => b.directIssue);
  const redundant = db.batches.filter((b) => b.possiblyRedundant);
  const discrepant = db.batches.filter((b) => b.status === 'received' && b.discrepancy > 0);
  return { bypasses, redundant, discrepant };
}

/** Per-product numeric breakdown for the dashboard compliance table — nonzero rows only. */
function getAnomalyBreakdown() {
  const db = loadDB();
  return PRODUCTS.map((product) => {
    const batches = db.batches.filter((b) => b.product === product);
    const bypassQty = batches.filter((b) => b.directIssue).reduce((s, b) => s + b.qty, 0);
    const redundantBatches = batches.filter((b) => b.possiblyRedundant).length;
    const shrinkageQty = batches
      .filter((b) => b.status === 'received' && b.discrepancy > 0)
      .reduce((s, b) => s + b.discrepancy, 0);
    return { product, bypassQty, redundantBatches, shrinkageQty };
  }).filter((r) => r.bypassQty > 0 || r.redundantBatches > 0 || r.shrinkageQty > 0);
}

function getActivityFeed(limit) {
  const db = loadDB();
  const events = [];

  db.batches.forEach((b) => {
    events.push({
      type: b.directIssue ? 'bypass' : 'produced',
      at: b.producedAt,
      product: b.product,
      qty: b.qty,
      by: b.producedBy,
    });
    if (b.status === 'received') {
      events.push({
        type: b.discrepancy > 0 ? 'received_short' : 'received',
        at: b.receivedAt,
        product: b.product,
        qty: b.receivedQty,
        by: b.receivedBy,
        extra: b.discrepancy > 0 ? b.discrepancy : null,
      });
    }
  });

  db.orders.forEach((o) => {
    o.items.forEach((item) => {
      events.push({
        type: 'order_item',
        at: o.createdAt,
        product: item.product,
        qty: item.qty,
        by: o.customer,
      });
    });
  });

  db.restocks.forEach((r) => {
    events.push({
      type: 'restock_requested',
      at: r.createdAt,
      product: r.product,
      qty: r.qty,
      by: r.requestedBy,
    });
  });

  events.sort((a, b) => b.at - a.at);
  return limit ? events.slice(0, limit) : events;
}

/* ---------------------------- management analytics ---------------------------- */

function getSoldByProduct() {
  const db = loadDB();
  return PRODUCTS.map((product) => ({
    product,
    qty: db.allocations.filter((a) => a.product === product).reduce((s, a) => s + a.qty, 0),
  }));
}

function getInventoryByProduct() {
  return PRODUCTS.map((product) => ({ product, qty: getInventory(product) }));
}

function getOrderStatusBreakdown() {
  const db = loadDB();
  const counts = { fulfilled: 0, partial: 0, queued: 0 };
  db.orders.forEach((o) => { counts[getOrderStatus(o)]++; });
  return counts;
}

/**
 * Units sold, bucketed into 6-hour windows over the last 48 hours.
 */
function getSalesTrend() {
  const db = loadDB();
  const BUCKET_HOURS = 6;
  const BUCKET_COUNT = 8;
  const now = Date.now();

  const buckets = new Array(BUCKET_COUNT).fill(0);
  db.allocations.forEach((a) => {
    const hoursAgo = (now - a.at) / 3600000;
    const idx = BUCKET_COUNT - 1 - Math.floor(hoursAgo / BUCKET_HOURS);
    if (idx >= 0 && idx < BUCKET_COUNT) buckets[idx] += a.qty;
  });

  return buckets.map((qty, i) => {
    const hoursBeforeNow = (BUCKET_COUNT - 1 - i) * BUCKET_HOURS;
    return { label: hoursBeforeNow === 0 ? 'Now' : `-${hoursBeforeNow}h`, qty };
  });
}

/* ---------------------------- seed data ---------------------------- */

function seedIfEmpty() {
  const existing = localStorage.getItem(STORE_KEY);
  if (existing) return;

  const now = Date.now();
  const H = 3600 * 1000;
  const t = (hoursAgo) => now - hoursAgo * H;

  const db = emptyDB();

  const BAGS = 'HD SHOPPING BAGS';
  const CUPS = 'PP DRINKING CUP 6.5 oz';
  const PLATES = 'ROUND PLATE 220mm';
  const GARBAGE = 'GARBAGE BAGS 90X110 CM 14KG';
  const LAUNDRY = 'LAUNDRY BAG  (60X90CM) 20 KG';

  // --- Shopping bags ---
  const b1 = {
    id: uid('batch'), product: BAGS, qty: 200, producedBy: 'Floor Worker A',
    producedAt: t(47), status: 'received', receivedQty: 200, receivedBy: 'Inventory Clerk',
    receivedAt: t(46), discrepancy: 0, directIssue: false, customer: null, possiblyRedundant: null,
  };
  const b6 = {
    id: uid('batch'), product: BAGS, qty: 50, producedBy: 'Floor Worker A',
    producedAt: t(2), status: 'in_transit', receivedQty: null, receivedBy: null,
    receivedAt: null, discrepancy: null, directIssue: false, customer: null, possiblyRedundant: null,
  };

  // --- Cups ---
  const b2 = {
    id: uid('batch'), product: CUPS, qty: 150, producedBy: 'Floor Worker B',
    producedAt: t(40), status: 'received', receivedQty: 145, receivedBy: 'Inventory Clerk',
    receivedAt: t(39), discrepancy: 5, directIssue: false, customer: null, possiblyRedundant: null,
  };
  const b4 = {
    id: uid('batch'), product: CUPS, qty: 80, producedBy: 'Floor Worker B',
    producedAt: t(20), status: 'bypassed', receivedQty: null, receivedBy: null,
    receivedAt: null, discrepancy: null, directIssue: true, customer: 'QuickServe Cafe',
    possiblyRedundant: { priorInventory: 145 },
  };

  // --- Plates ---
  const b3 = {
    id: uid('batch'), product: PLATES, qty: 100, producedBy: 'Floor Worker C',
    producedAt: t(36), status: 'received', receivedQty: 100, receivedBy: 'Inventory Clerk',
    receivedAt: t(35), discrepancy: 0, directIssue: false, customer: null, possiblyRedundant: null,
  };
  const b5 = {
    id: uid('batch'), product: PLATES, qty: 60, producedBy: 'Floor Worker C',
    producedAt: t(18), status: 'received', receivedQty: 60, receivedBy: 'Inventory Clerk',
    receivedAt: t(17), discrepancy: 0, directIssue: false, customer: null,
    possiblyRedundant: { priorInventory: 100 },
  };

  // --- A couple of quiet, uneventful batches so the catalog isn't all zeros ---
  const b7 = {
    id: uid('batch'), product: GARBAGE, qty: 300, producedBy: 'Floor Worker D',
    producedAt: t(10), status: 'received', receivedQty: 300, receivedBy: 'Inventory Clerk',
    receivedAt: t(9), discrepancy: 0, directIssue: false, customer: null, possiblyRedundant: null,
  };
  const b8 = {
    id: uid('batch'), product: LAUNDRY, qty: 150, producedBy: 'Floor Worker D',
    producedAt: t(8), status: 'received', receivedQty: 150, receivedBy: 'Inventory Clerk',
    receivedAt: t(7), discrepancy: 0, directIssue: false, customer: null, possiblyRedundant: null,
  };

  db.batches.push(b1, b6, b2, b4, b3, b5, b7, b8);

  // --- Orders (o4 demonstrates a multi-item cart: bags + plates in one order) ---
  const o1 = {
    id: uid('order'), customer: 'GreenMart', createdAt: t(30), createdBy: 'Admin',
    items: [{ id: uid('item'), product: BAGS, qty: 120, remaining: 0, status: 'fulfilled' }],
    fulfillment: { status: 'shipped', completedAt: t(29), completedBy: 'Admin', shippedAt: t(28), shippedBy: 'Admin' },
  };
  const o2 = {
    id: uid('order'), customer: 'CityDiner', createdAt: t(3), createdBy: 'Admin',
    items: [{ id: uid('item'), product: CUPS, qty: 200, remaining: 55, status: 'partial' }],
    fulfillment: { status: 'pending', completedAt: null, completedBy: null, shippedAt: null, shippedBy: null },
  };
  const o3 = {
    id: uid('order'), customer: 'PackRight Distributors', createdAt: t(1), createdBy: 'Admin',
    items: [{ id: uid('item'), product: PLATES, qty: 30, remaining: 0, status: 'fulfilled' }],
    fulfillment: { status: 'complete', completedAt: t(0.8), completedBy: 'Admin', shippedAt: null, shippedBy: null },
  };
  const o4 = {
    id: uid('order'), customer: 'EcoBags Retail', createdAt: t(0.5), createdBy: 'Admin',
    items: [
      { id: uid('item'), product: BAGS, qty: 100, remaining: 20, status: 'partial' },
      { id: uid('item'), product: PLATES, qty: 40, remaining: 0, status: 'fulfilled' },
    ],
    fulfillment: { status: 'pending', completedAt: null, completedBy: null, shippedAt: null, shippedBy: null },
  };

  const a1 = { id: uid('alloc'), orderId: o1.id, itemId: o1.items[0].id, product: BAGS, qty: 120, at: t(30) };
  const a2 = { id: uid('alloc'), orderId: o2.id, itemId: o2.items[0].id, product: CUPS, qty: 145, at: t(3) };
  const a3 = { id: uid('alloc'), orderId: o3.id, itemId: o3.items[0].id, product: PLATES, qty: 30, at: t(1) };
  const a4 = { id: uid('alloc'), orderId: o4.id, itemId: o4.items[0].id, product: BAGS, qty: 80, at: t(0.5) };
  const a5 = { id: uid('alloc'), orderId: o4.id, itemId: o4.items[1].id, product: PLATES, qty: 40, at: t(0.5) };

  db.orders.push(o1, o2, o3, o4);
  db.allocations.push(a1, a2, a3, a4, a5);

  // --- Restock request: Admin noticed Cups running low and pushed a production ask ---
  const r1 = {
    id: uid('restock'), product: CUPS, qty: 50, remaining: 50,
    requestedBy: 'Admin', createdAt: t(1.5), status: 'queued',
  };
  db.restocks.push(r1);

  saveDB(db);
}

function resetDemoData() {
  localStorage.removeItem(STORE_KEY);
  seedIfEmpty();
}
