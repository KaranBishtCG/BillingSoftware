import axiosInstance from '../config/axiosInstance';

export type ProductCategory = 'Taps' | 'Showers' | 'Wash Basin' | 'Drain Covers';

export interface ProductPrice {
  productId: number;
  productName: string;
  imagePath: string;
  rate: number;
  categoryName: ProductCategory;
  categoryId: number;
  defaultPrice: number;
}

export interface CreateBuyerInput {
  partyName: string;
  gstin: string;
  mobile: string;
  email: string;
  billingAddress: string;
  state: string;
  city: string;
}

interface CreateBuyerResponse {
  buyerId: number;
  buyerName: string;
  message: string;
}

export interface BuyerWithProducts {
  id: number;
  partyName: string;
  gstin: string;
  mobile: string;
  email?: string;
  billingAddress: string;
  state: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  productPrices: ProductPrice[];
}

export interface Buyer {
  id: number;
  partyName: string;
  gstin?: string;
  mobile: string;
  email?: string;
  billingAddress: string;
  state?: string;
  city?: string;
}

export interface BillItem {
  product: ProductPrice;
  quantity: number;
  totalPrice: number;
}

export interface Bill {
  id?: string;
  invoiceNumber?: string;
  buyer: Buyer;
  items: BillItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  createdAt?: Date;
  status?: 'draft' | 'generated';
}

export interface BillListItem {
  id: number;
  invoiceDate: string;
  invoiceNumber: string;
  partyName: string;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
}

export const CATEGORY_TO_ID: Record<string, number | undefined> = {
  'Taps': 1,
  'Showers': 2,
  'Wash Basin': 3,
  'Drain Covers': 4,
};

interface InvoiceCreateResponse {
  invoiceId: number;
  invoiceNumber: string;
  message: string;
}

export interface CreateBillInput {
  buyer: Buyer;
  items: BillItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  status?: Bill['status'];
}

export const saveBill = async (bill: CreateBillInput): Promise<Bill> => {
  const now = new Date();
  const body = {
    buyerId: bill.buyer.id,
    invoiceDate: now.toISOString().split('T')[0],
    subTotal: bill.subtotal,
    totalAmount: bill.totalAmount,
    gstAmount: bill.tax,
    status: bill.status ?? 'generated',
    createdAt: now.toISOString(),
    createdBy: 1,
  };
  const response = await axiosInstance.post<InvoiceCreateResponse>('/invoices', body);
  const { invoiceId, invoiceNumber } = response.data;
  return {
    ...bill,
    id: String(invoiceId),
    invoiceNumber: invoiceNumber,
    createdAt: now,
  };
};

export const fetchBills = async () : Promise<BillListItem[]> => {
  try {
    const response = await axiosInstance.get('/invoices');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching bills:', error);
    throw new Error('Failed to fetch bills');
  }
};

export const getAllBuyers = async (): Promise<Buyer[]> => {
  try {
    const response = await axiosInstance.get('/buyers');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching buyers:', error);
    throw new Error('Failed to fetch buyers');
  }
};

export const createBuyer = async (input: CreateBuyerInput): Promise<Buyer> => {
  try {
    const response = await axiosInstance.post<CreateBuyerResponse>('/buyers/add', { ...input, createdBy: 1 });
    const { buyerId } = response.data;
    return {
      id: buyerId,
      partyName: input.partyName,
      gstin: input.gstin,
      mobile: input.mobile,
      email: input.email,
      billingAddress: input.billingAddress,
      state: input.state,
      city: input.city,
    };
  } catch (error: any) {
    console.error('Error creating buyer:', error);
    throw new Error('Failed to create buyer');
  }
};

export const getProductsAsPerSelectedBuyer = async ({
  buyerId,
  categoryId,
}: {
  buyerId: number;
  categoryId?: number;
}): Promise<BuyerWithProducts> => {
  try {
    const response = await axiosInstance.get(`/buyers/${buyerId}`, {
      params: categoryId !== undefined ? { categoryId } : undefined,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};