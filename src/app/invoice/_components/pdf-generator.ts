import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePDF(invoice: Invoice) {
  // Create a new PDF document
  const doc = new jsPDF();

  // Add company info
  doc.setFontSize(20);
  doc.text("INVOICE", 14, 22);

  doc.setFontSize(10);
  doc.text("Your Company Name", 14, 30);
  doc.text("123 Business Street", 14, 35);
  doc.text("Business City, 12345", 14, 40);
  doc.text("contact@yourcompany.com", 14, 45);

  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice #: ${invoice.id}`, 140, 30);
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`, 140, 35);
  doc.text(
    `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
    140,
    40
  );

  // Add client info
  doc.setFontSize(12);
  doc.text("Bill To:", 14, 60);
  doc.setFontSize(10);
  doc.text(invoice.clientName, 14, 65);
  doc.text(invoice.clientEmail, 14, 70);

  // Handle multi-line address
  const addressLines = invoice.clientAddress.split("\n");
  let yPos = 75;
  addressLines.forEach((line: string) => {
    doc.text(line, 14, yPos);
    yPos += 5;
  });

  // Add items table
  const tableColumn = ["Description", "Quantity", "Price", "Amount"];
  const tableRows: string[][] = [];

  invoice.items.forEach((item) => {
    const amount = item.quantity * item.price;
    tableRows.push([
      item.description,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${amount.toFixed(2)}`,
    ]);
  });

  // @ts-expect-error - jspdf-autotable adds this method
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: yPos + 10,
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 66, 66] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 30, halign: "right" },
    },
  });

  // @ts-expect-error - get the y position after the table
  const finalY = doc.lastAutoTable.finalY + 10;

  // Add totals
  const subtotal = invoice.items.reduce(
    (sum: number, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  doc.text("Subtotal:", 140, finalY);
  doc.text(`$${subtotal.toFixed(2)}`, 170, finalY, { align: "right" });

  doc.text("Tax (10%):", 140, finalY + 5);
  doc.text(`$${tax.toFixed(2)}`, 170, finalY + 5, { align: "right" });

  doc.setFontSize(12);
  doc.text("Total:", 140, finalY + 12);
  doc.text(`$${total.toFixed(2)}`, 170, finalY + 12, { align: "right" });

  // Add notes if any
  if (invoice.notes) {
    doc.setFontSize(10);
    doc.text("Notes:", 14, finalY + 25);

    const notesLines = doc.splitTextToSize(invoice.notes, 180);
    doc.text(notesLines, 14, finalY + 30);
  }

  // Add footer
  // @ts-expect-error - internal property exists but TypeScript doesn't know about it
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text("Thank you for your business!", 105, 285, { align: "center" });
  }

  // Save the PDF
  doc.save(`Invoice-${invoice.id}.pdf`);

  // Save the PDF
  doc.save(`Invoice-${invoice.id}.pdf`);
}
