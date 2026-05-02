(function () {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');

  function setDefaultDates() {
    ['income-date', 'expense-date', 'invoice-date'].forEach(id => {
      document.getElementById(id).value = Store.today();
    });
  }

  function renderLists() {
    const data = Store.read();
    document.getElementById('income-list').innerHTML = data.income.length
      ? data.income.map(item => `<tr><td>${item.date}</td><td>${Store.escapeHtml(item.service)}</td><td>${Store.escapeHtml(item.client || '-')}</td><td>${Store.money(item.price)}</td><td><button class="small-btn danger" data-delete-income="${item.id}">Delete</button></td></tr>`).join('')
      : '<tr><td colspan="5">No income records yet.</td></tr>';
    document.getElementById('expense-list').innerHTML = data.expenses.length
      ? data.expenses.map(item => `<tr><td>${item.date}</td><td>${Store.escapeHtml(item.category)}</td><td>${Store.escapeHtml(item.description)}</td><td>${Store.money(item.amount)}</td><td><button class="small-btn danger" data-delete-expense="${item.id}">Delete</button></td></tr>`).join('')
      : '<tr><td colspan="5">No expense records yet.</td></tr>';
    InvoiceTools.renderInvoices();
    Dashboard.render();
  }

  function saveAndRender(data) {
    Store.write(data);
    renderLists();
  }

  navToggle.addEventListener('click', () => navMenu.classList.toggle('show'));
  links.forEach(link => link.addEventListener('click', function () {
    links.forEach(item => item.classList.remove('active'));
    this.classList.add('active');
    navMenu.classList.remove('show');
  }));

  document.getElementById('income-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = Store.read();
    data.income.push({
      id: Store.id('INC'),
      service: document.getElementById('income-service').value.trim(),
      price: Number(document.getElementById('income-price').value),
      date: document.getElementById('income-date').value,
      client: document.getElementById('income-client').value.trim()
    });
    event.target.reset();
    setDefaultDates();
    saveAndRender(data);
  });

  document.getElementById('expense-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = Store.read();
    data.expenses.push({
      id: Store.id('EXP'),
      category: document.getElementById('expense-category').value,
      description: document.getElementById('expense-description').value.trim(),
      amount: Number(document.getElementById('expense-amount').value),
      date: document.getElementById('expense-date').value
    });
    event.target.reset();
    setDefaultDates();
    saveAndRender(data);
  });

  document.getElementById('invoice-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = Store.read();
    data.invoices.push({
      id: Store.id('INV'),
      businessName: document.getElementById('invoice-business').value.trim(),
      client: document.getElementById('invoice-client').value.trim(),
      service: document.getElementById('invoice-service').value.trim(),
      amount: Number(document.getElementById('invoice-amount').value),
      date: document.getElementById('invoice-date').value
    });
    event.target.reset();
    document.getElementById('invoice-business').value = 'Business Name Placeholder';
    setDefaultDates();
    saveAndRender(data);
  });

  document.body.addEventListener('click', event => {
    const data = Store.read();
    const incomeId = event.target.dataset.deleteIncome;
    const expenseId = event.target.dataset.deleteExpense;
    const invoiceId = event.target.dataset.deleteInvoice;
    const pdfId = event.target.dataset.pdf;
    if (incomeId) data.income = data.income.filter(item => item.id !== incomeId);
    if (expenseId) data.expenses = data.expenses.filter(item => item.id !== expenseId);
    if (invoiceId) data.invoices = data.invoices.filter(item => item.id !== invoiceId);
    if (pdfId) return InvoiceTools.exportInvoicePdf(data.invoices.find(item => item.id === pdfId));
    if (incomeId || expenseId || invoiceId) saveAndRender(data);
  });

  document.getElementById('export-json').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(Store.read(), null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `salon-finance-backup-${Store.today()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  });

  document.getElementById('import-json').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        Store.write({
          income: Array.isArray(imported.income) ? imported.income : [],
          expenses: Array.isArray(imported.expenses) ? imported.expenses : [],
          invoices: Array.isArray(imported.invoices) ? imported.invoices : []
        });
        renderLists();
        alert('Backup imported successfully.');
      } catch (error) {
        alert('Could not import this JSON file.');
      }
    };
    reader.readAsText(file);
  });

  setDefaultDates();
  renderLists();
})();
