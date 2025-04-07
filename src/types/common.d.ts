type Invoice = {
  id: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: Array<InvoiceItem>;
  notes: string;
};

type InvoiceItem = {
  description: string;
  quantity: number;
  price: number;
};

type InvoiceItemFormProps = {
  item: InvoiceItem;
  index: number;
  onChange: (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
};

type PageParams = {
  id: string;
};
