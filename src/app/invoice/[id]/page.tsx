"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Download, Trash } from "lucide-react";
import { useInvoiceDetail } from "../_components/hooks";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const {
    invoice,
    handleDelete,
    handleDownload,
    subtotal,
    tax,
    total,
    navigateHome,
  } = useInvoiceDetail(params);

  if (!invoice) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={navigateHome}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
        <div className="flex space-x-2">
          {/* <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button> */}
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice #{invoice.id}</CardTitle>
          <div className="text-right">
            <div>Date: {new Date(invoice.date).toLocaleDateString()}</div>
            <div>Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">From</h3>
              <div>Your Company Name</div>
              <div>123 Business Street</div>
              <div>Business City, 12345</div>
              <div>contact@yourcompany.com</div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bill To</h3>
              <div>{invoice.clientName}</div>
              <div>{invoice.clientEmail}</div>
              <div className="whitespace-pre-line">{invoice.clientAddress}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <div className="p-4 bg-gray-50 rounded-md whitespace-pre-line">
                {invoice.notes}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6">
          <div className="w-full text-center text-sm text-gray-500">
            Thank you for your business!
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
