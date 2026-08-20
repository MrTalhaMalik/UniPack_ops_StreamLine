/* ==========================================================================
   Unipack Ops StreamLine — management insights page logic
   ========================================================================== */

requireAuth(['admin']);
seedIfEmpty();
renderNav('management');

let dateRange = null;

function renderSummaryStats() {
  const mount = document.getElementById('summary-stats');
  const sold = getSoldByProduct(dateRange);
  const totalSold = sold.reduce((s, d) => s + d.qty, 0);
  const statuses = getOrderStatusBreakdown(dateRange);
  const totalOrders = statuses.fulfilled + statuses.partial + statuses.queued;
  const totalInventory = getInventoryByProduct().reduce((s, d) => s + d.qty, 0);

  mount.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Units Sold (in range)</div>
      <div class="stat-value">${totalSold}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Orders Placed (in range)</div>
      <div class="stat-value">${totalOrders}</div>
      <div class="stat-sub">${statuses.fulfilled} fulfilled · ${statuses.partial} partial · ${statuses.queued} queued</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Units Currently in Inventory</div>
      <div class="stat-value">${totalInventory}</div>
      <div class="stat-sub">live count, not scoped to the date range</div>
    </div>
  `;
}

function topMovers(rows) {
  return rows
    .filter((d) => d.qty > 0)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 8)
    .map((d) => ({
      label: PRODUCT_META[d.product].code || d.product.slice(0, 6),
      title: d.product,
      value: d.qty,
      color: PRODUCT_META[d.product].color,
    }));
}

function renderCharts() {
  renderBarChart('chart-sold', topMovers(getSoldByProduct(dateRange)));
  renderBarChart('chart-inventory', topMovers(getInventoryByProduct()));

  const statuses = getOrderStatusBreakdown(dateRange);
  renderDonutChart('chart-orders', [
    { label: 'Fulfilled', value: statuses.fulfilled, color: '#2f6b46' },
    { label: 'Partial', value: statuses.partial, color: '#8a5a10' },
    { label: 'Queued', value: statuses.queued, color: '#9aa0a8' },
  ]);

  const trend = getSalesTrend(dateRange).map((b) => ({ label: b.label, qty: b.qty }));
  renderLineChart('chart-trend', trend, { color: '#1f2430' });
}

function renderAll() {
  renderSummaryStats();
  renderCharts();
}

initDateRangeFilter((range) => {
  dateRange = range;
  const trendTitle = document.getElementById('trend-title');
  const days = range.from ? Math.round((range.to - range.from) / DAY_MS) + 1 : null;
  trendTitle.textContent = days ? `Sales Trend (${days} days)` : 'Sales Trend (all time)';
  renderAll();
}, 30);

setInterval(renderAll, 5000);
