"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveInvoiceAction } from "@/lib/actions";
import { useToast } from "@/lib/use-toast";

export function useCreateInvoice() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [invoiceData, setInvoiceData] = useState<Invoice>({
    id: `INV-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (
    index: number,
    field: keyof Invoice["items"][0],
    value: string | number
  ) => {
    setInvoiceData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setInvoiceData((prev) => {
      if (prev.items.length === 1) return prev;
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await saveInvoiceAction(invoiceData);
      if (result.success) {
        toast({
          title: "Invoice Created",
          description: `Invoice ${invoiceData.id} has been created successfully.`,
        });
        router.push("/");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast({
        variant: "destructive",
        title: "Error Creating Invoice",
        description:
          "There was a problem creating your invoice. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel = () => {
    router.push("/");
  };

  return {
    invoiceData,
    handleChange,
    handleItemChange,
    addItem,
    removeItem,
    handleSubmit,
    cancel,
    isSubmitting,
  };
}
