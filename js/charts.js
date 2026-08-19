/* ==========================================================================
   Unipack Ops StreamLine — tiny vanilla chart helpers (no dependencies)
   ========================================================================== */

function renderBarChart(containerId, data, opts) {
  opts = opts || {};
  const container = document.getElementById(containerId);
  const max = opts.max || Math.max(1, ...data.map((d) => d.value));

  if (data.every((d) => d.value === 0)) {
    container.innerHTML = `<div class="empty-state">No data yet.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="chart-bars">
      ${data.map((d) => `
        <div class="chart-bar-col" title="${d.title || d.label}">
          <div class="chart-bar-value">${d.value}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="height:${Math.max(2, Math.round((d.value / max) * 100))}%; background:${d.color}"></div>
          </div>
          <div class="chart-bar-label">${d.label}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderDonutChart(containerId, data, opts) {
  opts = opts || {};
  const container = document.getElementById(containerId);
  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    container.innerHTML = `<div class="empty-state">No data yet.</div>`;
    return;
  }

  const radius = 58;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const segments = data.filter((d) => d.value > 0).map((d) => {
    const frac = d.value / total;
    const len = frac * circumference;
    const seg = { ...d, len, dashOffset: -offset };
    offset += len;
    return seg;
  });

  const circles = segments.map((s) => `
    <circle cx="80" cy="80" r="${radius}" fill="none" stroke="${s.color}" stroke-width="${strokeWidth}"
      stroke-dasharray="${s.len} ${circumference - s.len}" stroke-dashoffset="${s.dashOffset}" stroke-linecap="butt"></circle>
  `).join('');

  container.innerHTML = `
    <div class="chart-donut-wrap">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <g transform="rotate(-90 80 80)">${circles}</g>
        <text x="80" y="76" text-anchor="middle" font-size="24" font-weight="650" fill="var(--ink)">${total}</text>
        <text x="80" y="96" text-anchor="middle" font-size="11" fill="var(--muted)">orders</text>
      </svg>
      <div class="chart-legend">
        ${data.map((d) => `
          <div class="chart-legend-item">
            <span class="chart-legend-dot" style="background:${d.color}"></span>
            <span>${d.label}</span>
            <span class="chart-legend-value">${d.value}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderLineChart(containerId, points, opts) {
  opts = opts || {};
  const container = document.getElementById(containerId);
  const color = opts.color || 'var(--primary)';
  const width = 560;
  const height = 180;
  const padX = 20;
  const padY = 20;

  const max = Math.max(1, ...points.map((p) => p.qty));
  const step = points.length > 1 ? (width - padX * 2) / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = padX + i * step;
    const y = height - padY - (p.qty / max) * (height - padY * 2);
    return { x, y, qty: p.qty };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height - padY} L ${coords[0].x.toFixed(1)} ${height - padY} Z`;

  const dots = coords.map((c) => `
    <circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="4" fill="${color}"></circle>
    <title>${c.qty}</title>
  `).join('');

  container.innerHTML = `
    <div class="chart-line-wrap">
      <svg width="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="overflow:visible;">
        <path d="${areaPath}" fill="${color}" opacity="0.08"></path>
        <path d="${linePath}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"></path>
        ${dots}
      </svg>
      <div class="chart-line-labels">
        ${points.map((p) => `<span>${p.label}</span>`).join('')}
      </div>
    </div>
  `;
}
