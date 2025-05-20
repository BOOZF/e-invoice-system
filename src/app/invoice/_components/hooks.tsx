"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getInvoiceAction, deleteInvoiceAction } from "@/lib/actions";
import { generatePDF } from "./pdf-generator";
import { useToast } from "@/lib/use-toast";

export function useInvoiceDetail(paramsPromise: Promise<PageParams>) {
  const router = useRouter();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = use(paramsPromise);

  useEffect(() => {
    async function loadInvoice() {
      try {
        setLoading(true);
        const invoiceData = await getInvoiceAction(id);
        if (!invoiceData) {
          toast({
            variant: "destructive",
            title: "Invoice Not Found",
            description: `Could not find invoice with ID ${id}.`,
          });
          router.push("/");
          return;
        }
        setInvoice(invoiceData);
      } catch (error) {
        console.error(`Failed to load invoice ${id}:`, error);
        toast({
          variant: "destructive",
          title: "Error Loading Invoice",
          description: "There was a problem loading the invoice data.",
        });
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [id, router, toast]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        const result = await deleteInvoiceAction(id);
        if (result.success) {
          toast({
            title: "Invoice Deleted",
            description: `Invoice ${id} has been deleted.`,
          });
          router.push("/");
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error(`Failed to delete invoice ${id}:`, error);
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: "Failed to delete the invoice. Please try again.",
        });
      }
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
    loading,
  };
}
