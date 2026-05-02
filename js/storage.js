(function () {
  const KEY = 'salonFinanceTrackerData';
  const emptyData = { income: [], expenses: [], invoices: [] };

  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      return { ...emptyData, ...(saved || {}) };
    } catch (error) {
      return { ...emptyData };
    }
  }

  function write(data) {
    localStorage.setItem(KEY, JSON.stringify({ ...emptyData, ...data }));
  }

  function id(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  }

  function money(value) {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(Number(value || 0));
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[char]);
  }

  window.Store = { read, write, id, money, today, escapeHtml };
})();
