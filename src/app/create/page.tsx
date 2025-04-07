"use client";

import { Button } from "@/components/ui/button";
import { useCreateInvoice } from "./_components/hooks";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceItemForm } from "./_components/invoice-item-form";

export default function CreateInvoicePage() {
  const {
    invoiceData,
    handleChange,
    handleItemChange,
    addItem,
    removeItem,
    handleSubmit,
    cancel,
  } = useCreateInvoice();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Invoice</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="id">Invoice Number</Label>
                  <Input
                    id="id"
                    name="id"
                    value={invoiceData.id}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Invoice Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={invoiceData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={invoiceData.clientName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  value={invoiceData.clientEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="clientAddress">Client Address</Label>
                <Textarea
                  id="clientAddress"
                  name="clientAddress"
                  value={invoiceData.clientAddress}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {invoiceData.items.map((item, index) => (
                <InvoiceItemForm
                  key={index}
                  item={item}
                  index={index}
                  onChange={handleItemChange}
                  onRemove={removeItem}
                />
              ))}
              <Button type="button" variant="outline" onClick={addItem}>
                Add Item
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                name="notes"
                value={invoiceData.notes}
                onChange={handleChange}
                placeholder="Payment terms, delivery information, etc."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    $
                    {invoiceData.items
                      .reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>
                    $
                    {(
                      invoiceData.items.reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      ) * 0.1
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>
                    $
                    {(
                      invoiceData.items.reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      ) * 1.1
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={cancel}>
                Cancel
              </Button>
              <Button type="submit">Create Invoice</Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
