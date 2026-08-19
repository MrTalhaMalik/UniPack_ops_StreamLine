/* ==========================================================================
   Unipack Ops StreamLine — inventory page logic
   Shows exactly one thing: how many of each product are on hand right now.
   ========================================================================== */

requireAuth(['admin']);
seedIfEmpty();
renderNav('inventory');

function populateCategoryFilter() {
  const select = document.getElementById('inv-category');
  Object.keys(PRODUCT_CATEGORIES).forEach((catId) => {
    const opt = document.createElement('option');
    opt.value = catId;
    opt.textContent = PRODUCT_CATEGORIES[catId].label;
    select.appendChild(opt);
  });
  select.addEventListener('change', renderTable);
}

function renderTable() {
  const search = document.getElementById('inv-search').value.trim().toLowerCase();
  const category = document.getElementById('inv-category').value;
  const tbody = document.getElementById('inventory-table-body');

  let rows = PRODUCT_CATALOG;
  if (category !== '__all__') rows = rows.filter((p) => p.category === category);
  if (search) {
    rows = rows.filter((p) => p.name.toLowerCase().includes(search) || p.code.toLowerCase().includes(search));
  }

  if (rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">No products match.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map((p) => {
    const qty = getInventory(p.name);
    return `
      <tr>
        <td>${p.code || '—'}</td>
        <td><span class="product-chip"><span class="product-dot" style="background:${PRODUCT_CATEGORIES[p.category].color}"></span>${p.name}</span></td>
        <td>${PRODUCT_CATEGORIES[p.category].label}</td>
        <td style="text-align:right; font-weight:650; ${qty === 0 ? 'color:var(--faint);' : ''}">${qty}</td>
      </tr>`;
  }).join('');
}

document.getElementById('inv-search').addEventListener('input', renderTable);

populateCategoryFilter();
renderTable();
setInterval(renderTable, 4000);
