import { prisma } from "./prisma";

export async function getAllInvoices(): Promise<Invoice[]> {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
      orderBy: { date: "desc" },
    });

    // Transform the database model to match our application model
    return invoices.map(transformDatabaseInvoice);
  } catch (error) {
    console.error("Failed to fetch invoices from database", error);
    return [];
  }
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoice) return null;

    return transformDatabaseInvoice(invoice);
  } catch (error) {
    console.error(`Failed to fetch invoice ${id} from database`, error);
    return null;
  }
}

export async function saveInvoice(invoice: Invoice): Promise<void> {
  try {
    await prisma.invoice.upsert({
      where: { id: invoice.id },
      update: {
        date: new Date(invoice.date),
        dueDate: new Date(invoice.dueDate),
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress,
        notes: invoice.notes || "",
        items: {
          deleteMany: {},
          createMany: {
            data: invoice.items.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      },
      create: {
        id: invoice.id,
        date: new Date(invoice.date),
        dueDate: new Date(invoice.dueDate),
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress,
        notes: invoice.notes || "",
        items: {
          createMany: {
            data: invoice.items.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      },
    });
  } catch (error) {
    console.error(`Failed to save invoice ${invoice.id} to database`, error);
    throw error;
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to delete invoice ${id} from database`, error);
    throw error;
  }
}

// Helper function to transform database model to application model
function transformDatabaseInvoice(dbInvoice: {
  id: string;
  date: Date;
  dueDate: Date;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  notes: string | null;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
}): Invoice {
  return {
    id: dbInvoice.id,
    date: dbInvoice.date.toISOString().split("T")[0],
    dueDate: dbInvoice.dueDate.toISOString().split("T")[0],
    clientName: dbInvoice.clientName,
    clientEmail: dbInvoice.clientEmail,
    clientAddress: dbInvoice.clientAddress,
    notes: dbInvoice.notes || "",
    items: dbInvoice.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      price: item.price,
    })),
  };
}
