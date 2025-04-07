"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import { getAllInvoices } from "@/lib/invoice-storage";

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setInvoices(getAllInvoices());
  }, []);

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Invoices</CardTitle>
          <CardDescription>
            You haven&apos;t created any invoices yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/create">
            <Button>Create Your First Invoice</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {invoices.map((invoice) => {
        const subtotal = invoice.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0
        );
        const tax = subtotal * 0.1;
        const total = subtotal + tax;

        return (
          <Card key={invoice.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    Invoice #{invoice.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {invoice.clientName} •{" "}
                    {new Date(invoice.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-semibold">${total.toFixed(2)}</p>
                  </div>
                  <Link href={`/invoice/${invoice.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
