/* ==========================================================================
   Unipack Ops StreamLine — searchable product picker
   Type-ahead over the full catalog by name or item code. Keeps a hidden
   <input> in sync so existing code can read `.value` and listen for
   `change` exactly like it would on a plain <select>.

   Expects, inside #rootId:
     input.pp-search   — visible text field
     input.pp-hidden    — the "real" value, whatever id calling code expects
     div.pp-panel       — results dropdown
   ========================================================================== */

function initProductPicker(rootId) {
  const root = document.getElementById(rootId);
  const search = root.querySelector('.pp-search');
  const hidden = root.querySelector('.pp-hidden');
  const panel = root.querySelector('.pp-panel');

  function rowHtml(p) {
    return `<div class="pp-row" data-name="${p.name}">
      <span class="pp-row-name"><span class="product-dot" style="background:${PRODUCT_CATEGORIES[p.category].color}; margin-right:7px;"></span>${p.name}</span>
      <span class="pp-row-code">${p.code || '—'}</span>
    </div>`;
  }

  function browseHtml() {
    const grouped = getProductsByCategory();
    return Object.keys(PRODUCT_CATEGORIES).map((catId) => {
      const names = grouped[catId];
      if (names.length === 0) return '';
      const rows = names.map((name) => rowHtml(PRODUCT_CATALOG.find((p) => p.name === name))).join('');
      return `<div class="pp-group-label">${PRODUCT_CATEGORIES[catId].label}</div>${rows}`;
    }).join('');
  }

  function resultsHtml(query) {
    const q = query.trim().toLowerCase();
    const matches = PRODUCT_CATALOG.filter((p) =>
      p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    ).slice(0, 40);
    if (matches.length === 0) return `<div class="pp-empty">No products match "${query.trim()}".</div>`;
    return matches.map(rowHtml).join('');
  }

  function showPanel(html) {
    panel.innerHTML = html;
    panel.classList.add('open');
  }

  function close() {
    panel.classList.remove('open');
  }

  function select(name) {
    hidden.value = name;
    search.value = name;
    close();
    hidden.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function highlight(delta) {
    const rows = Array.from(panel.querySelectorAll('.pp-row'));
    if (rows.length === 0) return;
    let idx = rows.findIndex((r) => r.classList.contains('active'));
    rows.forEach((r) => r.classList.remove('active'));
    idx = idx < 0 ? (delta > 0 ? 0 : rows.length - 1) : Math.max(0, Math.min(rows.length - 1, idx + delta));
    rows[idx].classList.add('active');
    rows[idx].scrollIntoView({ block: 'nearest' });
  }

  search.addEventListener('focus', () => {
    showPanel(browseHtml());
    search.select();
  });

  search.addEventListener('input', () => {
    const q = search.value;
    showPanel(q.trim() ? resultsHtml(q) : browseHtml());
  });

  search.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); highlight(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(-1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const active = panel.querySelector('.pp-row.active') || panel.querySelector('.pp-row');
      if (active) select(active.dataset.name);
    } else if (e.key === 'Escape') {
      close();
    }
  });

  panel.addEventListener('click', (e) => {
    const row = e.target.closest('.pp-row');
    if (row) select(row.dataset.name);
  });

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) close();
  });
}
