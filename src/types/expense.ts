export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  type: 'income' | 'expense';
  createdAt: string;
  updatedAt?: string;
}

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Serviços',
  'Outros'
] as const;

export const PAYMENT_METHODS = [
  'Dinheiro',
  'Cartão de Débito',
  'Cartão de Crédito',
  'PIX',
  'Transferência',
  'Boleto'
] as const;

export type Category = typeof CATEGORIES[number];
export type PaymentMethod = typeof PAYMENT_METHODS[number];