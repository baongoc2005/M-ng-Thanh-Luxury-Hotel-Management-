/* ============================================================
   Dashboard JS — Mường Thanh Admin
   Fetches ../api/dashboard.php and renders all widgets
   ============================================================ */

'use strict';

// ── Helpers ──────────────────────────────────────────────────
function formatPrice(n) {
  if (!n && n !== 0) return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatPriceShort(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace('.0', '') + ' tỷ';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1).replace('.0', '') + ' tr';
  if (n >= 1_000)         return (n / 1_000).toFixed(0) + 'K';
  return String(n);
}

function el(id) { return document.getElementById(id); }

// Source display names
const SOURCE_LABELS = {
  website:     'Website',
  booking_com: 'Booking.com',
  traveloka:   'Traveloka',
  agoda:       'Agoda',
  hotline:     'Hotline',
  zalo:        'Zalo',
  facebook:    'Facebook',
  other:       'Khác',
};

// Source chart colours
const SOURCE_COLORS = {
  website:     '#c9a96e',   // gold
  booking_com: '#5b9cf6',   // blue
  traveloka:   '#f0924a',   // orange
  agoda:       '#e05555',   // red
  hotline:     '#4caf7d',   // green
  zalo:        '#00b8d4',   // cyan
  facebook:    '#7b9de0',   // soft blue
  other:       'rgba(245,240,234,0.35)',
};

// Status display names + css class — labels resolved via tAdm() at render time
function getStatusMeta() {
  return {
    pending:     { label: tAdm('status.pending'),     cls: 'badge-pending',    accent: 'accent-orange' },
    confirmed:   { label: tAdm('status.confirmed'),   cls: 'badge-confirmed',  accent: 'accent-green'  },
    checked_in:  { label: tAdm('status.checked_in'),  cls: 'badge-checked_in', accent: 'accent-blue'   },
    checked_out: { label: tAdm('status.checked_out'), cls: 'badge-checked_out',accent: ''              },
    cancelled:   { label: tAdm('status.cancelled'),   cls: 'badge-cancelled',  accent: ''              },
    no_show:     { label: tAdm('status.no_show'),     cls: 'badge-no_show',    accent: ''              },
  };
}

// Chart.js global defaults
Chart.defaults.color = 'rgba(245,240,234,0.45)';
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.font.size   = 11;

let chartRevenueInstance = null;
let chartSourceInstance  = null;

// ── Main loader ───────────────────────────────────────────────
async function loadDashboard() {
  try {
    const res  = await fetch('../api/dashboard.php');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    renderStats(data.totals, data.extra);
    renderStatusGrid(data.byStatus);
    renderRevenueChart(data.revenue14);
    renderSourceChart(data.bySource);
    renderTopHotels(data.topHotels);
    renderRecentBookings(data.recentBookings ?? []);
  } catch (err) {
    console.error('Dashboard load error:', err);
    showError(tAdm('dash.error'));
  }
}

// ── Stat cards row 1 & 2 ─────────────────────────────────────
function renderStats(totals, extra) {
  if (!totals) return;

  // Row 1
  setText('s-total-bookings', totals.total_bookings ?? '—');
  setText('s-revenue',        formatPriceShort(totals.total_revenue));
  setText('s-customers',      extra?.customers ?? '—');
  setText('s-pending',        totals.pending ?? 0);

  setText('s-today-bookings', `${totals.today_bookings ?? 0} ${tAdm('dash.today_suffix')}`);
  setText('s-today-revenue',  `${formatPriceShort(totals.today_revenue ?? 0)} ${tAdm('dash.today_suffix')}`);
  setText('s-confirmed',      `${totals.confirmed ?? 0} ${tAdm('dash.confirmed_suffix')}`);

  // Row 2
  setText('s-hotels',          extra?.hotels          ?? '—');
  setText('s-staff',           extra?.staff           ?? '—');
  setText('s-pending-reviews', extra?.pending_reviews ?? '—');
  setText('s-promos',          extra?.active_promos   ?? '—');
}

function setText(id, val) {
  const node = el(id);
  if (node) node.textContent = val;
}

// ── Status breakdown grid ─────────────────────────────────────
function renderStatusGrid(byStatus) {
  const grid = el('statusGrid');
  if (!grid || !byStatus?.length) return;

  grid.innerHTML = byStatus.map(row => {
    const meta = getStatusMeta()[row.status] || { label: row.status, cls: '', accent: '' };
    return `
      <div class="dash-card ${meta.accent}">
        <span class="dash-card-val">${row.cnt}</span>
        <span class="dash-card-lbl">${meta.label}</span>
        <span class="dash-card-sub">
          <span class="badge ${meta.cls}">${row.status}</span>
        </span>
      </div>`;
  }).join('');
}

// ── Revenue line chart ────────────────────────────────────────
function renderRevenueChart(revenue14) {
  const canvas = el('chartRevenue');
  if (!canvas || !revenue14?.length) return;

  const labels   = revenue14.map(r => formatDay(r.day));
  const revenues = revenue14.map(r => r.revenue);
  const bookings = revenue14.map(r => r.bookings);

  if (chartRevenueInstance) chartRevenueInstance.destroy();

  chartRevenueInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: tAdm('dash.legend_revenue'),
          data: revenues,
          yAxisID: 'yRevenue',
          borderColor: '#c9a96e',
          backgroundColor: 'rgba(201,169,110,0.08)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#c9a96e',
          fill: true,
          tension: 0.4,
        },
        {
          label: tAdm('dash.legend_bookings'),
          data: bookings,
          yAxisID: 'yBookings',
          borderColor: 'rgba(91,156,246,0.75)',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [4, 3],
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#5b9cf6',
          fill: false,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 10,
            boxHeight: 2,
            padding: 16,
            usePointStyle: false,
          },
        },
        tooltip: {
          backgroundColor: '#161616',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: 'rgba(245,240,234,0.6)',
          bodyColor: '#f5f0ea',
          padding: 10,
          callbacks: {
            label: ctx => {
              if (ctx.datasetIndex === 0) {
                return ' ' + formatPrice(ctx.parsed.y);
              }
              return ' ' + ctx.parsed.y + ' ' + tAdm('dash.legend_bookings_tooltip');
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { maxRotation: 0, padding: 8 },
          border: { display: false },
        },
        yRevenue: {
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
          ticks: {
            padding: 8,
            callback: v => formatPriceShort(v),
          },
          border: { display: false },
        },
        yBookings: {
          position: 'right',
          grid: { display: false },
          ticks: {
            padding: 8,
            callback: v => Number.isInteger(v) ? v : '',
            stepSize: 1,
          },
          border: { display: false },
        },
      },
    },
  });
}

function formatDay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ── Source doughnut chart ─────────────────────────────────────
function renderSourceChart(bySource) {
  const canvas = el('chartSource');
  const legend = el('donutLegend');
  if (!canvas || !bySource?.length) return;

  const sorted = [...bySource].sort((a, b) => b.cnt - a.cnt);
  const labels = sorted.map(s => SOURCE_LABELS[s.source] || s.source);
  const counts = sorted.map(s => s.cnt);
  const colors = sorted.map(s => SOURCE_COLORS[s.source] || SOURCE_COLORS.other);

  if (chartSourceInstance) chartSourceInstance.destroy();

  chartSourceInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: colors.map(c => c + (c.startsWith('rgba') ? '' : 'cc')),
        borderColor: colors,
        borderWidth: 1,
        hoverOffset: 6,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#161616',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: 'rgba(245,240,234,0.6)',
          bodyColor: '#f5f0ea',
          padding: 10,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed} đặt phòng`,
          },
        },
      },
    },
  });

  // Custom legend
  const total = counts.reduce((a, b) => a + b, 0);
  legend.innerHTML = sorted.map((s, i) => `
    <div class="donut-legend-item">
      <span class="donut-legend-dot" style="background:${colors[i]}"></span>
      <span class="donut-legend-label">${labels[i]}</span>
      <span class="donut-legend-val">${s.cnt} <span style="color:var(--muted);font-size:0.65rem">(${total > 0 ? Math.round(s.cnt / total * 100) : 0}%)</span></span>
    </div>
  `).join('');
}

// ── Top hotels table ──────────────────────────────────────────
function renderTopHotels(topHotels) {
  const tbody = el('topHotelsBody');
  if (!tbody) return;
  if (!topHotels?.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="dash-empty">${tAdm('dash.no_data')}</td></tr>`;
    return;
  }

  tbody.innerHTML = topHotels.slice(0, 5).map((h, i) => `
    <tr>
      <td class="top-table-rank ${i === 0 ? 'first' : ''}">${i + 1}</td>
      <td class="top-table-name">${escHtml(h.hotel_name)}</td>
      <td class="top-table-bookings">${h.bookings}</td>
      <td class="top-table-revenue">${formatPriceShort(h.revenue)}</td>
    </tr>
  `).join('');
}

// ── Recent bookings table ─────────────────────────────────────
function renderRecentBookings(recent) {
  const tbody = el('recentBookingsBody');
  if (!tbody) return;
  if (!recent?.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="dash-empty">${tAdm('dash.no_recent')}</td></tr>`;
    return;
  }

  tbody.innerHTML = recent.slice(0, 8).map(b => {
    const meta = getStatusMeta()[b.status] || { label: b.status, cls: '' };
    const srcClass = 'src-' + (b.source || 'other');
    const srcLabel = SOURCE_LABELS[b.source] || b.source || '—';
    return `
      <tr>
        <td style="font-size:0.78rem">${escHtml(b.customer_name || b.guest_name || '—')}</td>
        <td style="font-size:0.72rem;color:var(--muted)">${escHtml(b.hotel_name || '—')}</td>
        <td><span class="${srcClass}" style="font-size:0.7rem">${srcLabel}</span></td>
        <td><span class="badge ${meta.cls}">${meta.label}</span></td>
      </tr>
    `;
  }).join('');
}

// ── Utilities ─────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showError(msg) {
  const main = document.querySelector('.dash-main');
  if (!main) return;
  const div = document.createElement('div');
  div.style.cssText = `
    background:rgba(224,85,85,0.1);
    border:1px solid rgba(224,85,85,0.3);
    color:#e05555;
    padding:1rem 1.5rem;
    font-size:0.8rem;
    letter-spacing:0.06em;
    margin-bottom:1rem;
  `;
  div.textContent = msg;
  main.prepend(div);
}

// ── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadDashboard);
