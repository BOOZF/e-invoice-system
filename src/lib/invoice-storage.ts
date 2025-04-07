export function getAllInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];

  const invoicesJson = localStorage.getItem("invoices");
  if (!invoicesJson) return [];

  try {
    return JSON.parse(invoicesJson);
  } catch (error) {
    console.error("Failed to parse invoices from localStorage", error);
    return [];
  }
}

export function getInvoice(id: string): Invoice | null {
  const invoices = getAllInvoices();
  return invoices.find((invoice) => invoice.id === id) || null;
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getAllInvoices();
  const existingIndex = invoices.findIndex((inv) => inv.id === invoice.id);

  if (existingIndex >= 0) {
    // Update existing invoice
    invoices[existingIndex] = invoice;
  } else {
    // Add new invoice
    invoices.push(invoice);
  }

  localStorage.setItem("invoices", JSON.stringify(invoices));
}

export function deleteInvoice(id: string): void {
  const invoices = getAllInvoices();
  const filteredInvoices = invoices.filter((invoice) => invoice.id !== id);
  localStorage.setItem("invoices", JSON.stringify(filteredInvoices));
}
