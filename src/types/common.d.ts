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
    _index: number,
    _field: keyof InvoiceItem,
    _value: string | number
  ) => void;
  onRemove: (_index: number) => void;
};

type PageParams = {
  id: string;
};
