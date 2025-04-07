"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function InvoiceItemForm({
  item,
  index,
  onChange,
  onRemove,
}: InvoiceItemFormProps) {
  return (
    <div className="grid grid-cols-12 gap-4 items-end">
      <div className="col-span-12 md:col-span-6">
        <Label htmlFor={`item-description-${index}`}>Description</Label>
        <Input
          id={`item-description-${index}`}
          value={item.description}
          onChange={(e) => onChange(index, "description", e.target.value)}
          required
        />
      </div>
      <div className="col-span-4 md:col-span-2">
        <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
        <Input
          id={`item-quantity-${index}`}
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) =>
            onChange(index, "quantity", Number.parseInt(e.target.value) || 1)
          }
          required
        />
      </div>
      <div className="col-span-6 md:col-span-3">
        <Label htmlFor={`item-price-${index}`}>Price</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            $
          </div>
          <Input
            id={`item-price-${index}`}
            type="number"
            min="0"
            step="0.01"
            className="pl-7"
            value={item.price}
            onChange={(e) =>
              onChange(index, "price", Number.parseFloat(e.target.value) || 0)
            }
            required
          />
        </div>
      </div>
      <div className="col-span-2 md:col-span-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-10 w-10"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
    </div>
  );
}
