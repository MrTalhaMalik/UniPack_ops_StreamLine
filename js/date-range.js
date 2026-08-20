/* ==========================================================================
   Unipack Ops StreamLine — shared date-range filter
   Expects, somewhere on the page:
     input#date-from, input#date-to   (type="date")
     button[data-range] × N            (data-range="7" | "30" | "90" | "all")
   ========================================================================== */

function initDateRangeFilter(onChange, defaultDays) {
  const fromInput = document.getElementById('date-from');
  const toInput = document.getElementById('date-to');
  const presetBtns = Array.from(document.querySelectorAll('[data-range]'));

  function toDateInputValue(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function markActive(btn) {
    presetBtns.forEach((b) => { b.classList.remove('btn-primary'); b.classList.add('btn-outline'); });
    if (btn) { btn.classList.remove('btn-outline'); btn.classList.add('btn-primary'); }
  }

  function setRange(days) {
    const to = new Date();
    toInput.value = toDateInputValue(to);
    if (days === 'all') {
      fromInput.value = '';
    } else {
      const from = new Date(to.getTime() - (days - 1) * DAY_MS);
      fromInput.value = toDateInputValue(from);
    }
    fire();
  }

  function getRange() {
    const from = fromInput.value ? new Date(fromInput.value + 'T00:00:00').getTime() : null;
    const to = toInput.value ? new Date(toInput.value + 'T23:59:59.999').getTime() : null;
    return { from, to };
  }

  function fire() {
    onChange(getRange());
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      markActive(btn);
      setRange(btn.dataset.range === 'all' ? 'all' : parseInt(btn.dataset.range, 10));
    });
  });

  fromInput.addEventListener('change', () => { markActive(null); fire(); });
  toInput.addEventListener('change', () => { markActive(null); fire(); });

  const initialBtn = presetBtns.find((b) => parseInt(b.dataset.range, 10) === defaultDays);
  markActive(initialBtn);
  setRange(defaultDays || 30);

  return { getRange };
}
