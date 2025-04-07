"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getInvoice, deleteInvoice } from "@/lib/invoice-storage";
import { generatePDF } from "./pdf-generator";
import { useToast } from "@/lib/use-toast";

export function useInvoiceDetail(paramsPromise: Promise<PageParams>) {
  const router = useRouter();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { id } = use(paramsPromise);

  useEffect(() => {
    const invoiceData = getInvoice(id);
    if (!invoiceData) {
      router.push("/");
      return;
    }
    setInvoice(invoiceData);
  }, [id, router]);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(id);
      toast({
        title: "Invoice Deleted",
        description: `Invoice ${id} has been deleted.`,
      });
      router.push("/");
    }
  };

  const handleDownload = () => {
    if (!invoice) return;
    generatePDF(invoice);
    toast({
      title: "PDF Generated",
      description: "Your invoice PDF has been generated and downloaded.",
    });
  };

  const subtotal = invoice
    ? invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const navigateHome = () => {
    router.push("/");
  };

  return {
    invoice,
    handleDelete,
    handleDownload,
    subtotal,
    tax,
    total,
    navigateHome,
  };
}
