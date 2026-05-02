(function () {
  function sum(items, key) {
    return items.reduce((total, item) => total + Number(item[key] || 0), 0);
  }

  function inCurrentWeek(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    const now = new Date();
    const first = new Date(now);
    first.setDate(now.getDate() - now.getDay());
    first.setHours(0, 0, 0, 0);
    return date >= first && date <= now;
  }

  function inCurrentMonth(dateString) {
    const date = new Date(`${dateString}T00:00:00`);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  function renderDashboard() {
    const data = Store.read();
    const income = sum(data.income, 'price');
    const expenses = sum(data.expenses, 'amount');
    document.getElementById('total-income').textContent = Store.money(income);
    document.getElementById('total-expenses').textContent = Store.money(expenses);
    document.getElementById('net-profit').textContent = Store.money(income - expenses);

    const today = Store.today();
    const dailyIncome = sum(data.income.filter(item => item.date === today), 'price');
    const dailyExpenses = sum(data.expenses.filter(item => item.date === today), 'amount');
    const weeklyIncome = sum(data.income.filter(item => inCurrentWeek(item.date)), 'price');
    const weeklyExpenses = sum(data.expenses.filter(item => inCurrentWeek(item.date)), 'amount');
    const monthlyIncome = sum(data.income.filter(item => inCurrentMonth(item.date)), 'price');
    const monthlyExpenses = sum(data.expenses.filter(item => inCurrentMonth(item.date)), 'amount');
    document.getElementById('today-summary').textContent = Store.money(dailyIncome - dailyExpenses);
    document.getElementById('week-summary').textContent = Store.money(weeklyIncome - weeklyExpenses);
    document.getElementById('month-summary').textContent = Store.money(monthlyIncome - monthlyExpenses);

    const rows = [
      ...data.income.map(item => ({ date: item.date, type: 'Income', description: item.service, amount: item.price })),
      ...data.expenses.map(item => ({ date: item.date, type: 'Expense', description: item.description, amount: -Number(item.amount) }))
    ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

    document.getElementById('recent-activity').innerHTML = rows.length
      ? rows.map(row => `<tr><td>${row.date}</td><td>${row.type}</td><td>${Store.escapeHtml(row.description)}</td><td>${Store.money(row.amount)}</td></tr>`).join('')
      : '<tr><td colspan="4">No activity yet.</td></tr>';
  }

  window.Dashboard = { render: renderDashboard };
})();
