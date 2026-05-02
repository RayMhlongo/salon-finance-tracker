(function () {
  function exportInvoicePdf(invoice) {
    const jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) {
      alert('PDF library is still loading. Please try again in a moment.');
      return;
    }

    const doc = new jsPDF();
    doc.setDrawColor(64, 112, 244);
    doc.rect(15, 15, 32, 24);
    doc.setFontSize(9);
    doc.text('LOGO', 25, 29);
    doc.setFontSize(18);
    doc.text(invoice.businessName || 'Business Name Placeholder', 55, 24);
    doc.setFontSize(14);
    doc.text('INVOICE', 55, 34);
    doc.setFontSize(10);
    doc.text(`Invoice ID: ${invoice.id}`, 15, 52);
    doc.text(`Date: ${invoice.date}`, 15, 59);
    doc.text(`Client: ${invoice.client}`, 15, 66);

    doc.setFillColor(64, 112, 244);
    doc.setTextColor(255, 255, 255);
    doc.rect(15, 80, 180, 10, 'F');
    doc.text('Service', 18, 87);
    doc.text('Amount', 160, 87);
    doc.setTextColor(14, 36, 49);
    doc.rect(15, 90, 180, 12);
    doc.text(invoice.service, 18, 98);
    doc.text(Store.money(invoice.amount), 160, 98);
    doc.setFontSize(12);
    doc.text(`Total: ${Store.money(invoice.amount)}`, 145, 120);
    doc.setFontSize(9);
    doc.text('Footer note: Thank you for your business. Payment terms can be added here.', 15, 280);
    doc.save(`${invoice.id}.pdf`);
  }

  function renderInvoices() {
    const data = Store.read();
    document.getElementById('invoice-list').innerHTML = data.invoices.length
      ? data.invoices.map(invoice => `
        <tr>
          <td>${invoice.id}</td>
          <td>${invoice.date}</td>
          <td>${Store.escapeHtml(invoice.client)}</td>
          <td>${Store.money(invoice.amount)}</td>
          <td class="row-actions">
            <button class="small-btn primary" data-pdf="${invoice.id}">Export Invoice PDF</button>
            <button class="small-btn danger" data-delete-invoice="${invoice.id}">Delete</button>
          </td>
        </tr>`).join('')
      : '<tr><td colspan="5">No invoices yet.</td></tr>';
  }

  window.InvoiceTools = { exportInvoicePdf, renderInvoices };
})();
