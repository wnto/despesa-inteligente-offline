export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt?: string;
}

export const CATEGORIES = [
  'Restaurantes',
  'Casa',
  'Mercado',
  'Carro',
  'Viagem',
  'Gatos',
  'Compras',
  'Saúde',
  'Esportes',
  'Entretenimento',
  'Presentes',
  'Transporte',
  'Reembolso',
  'Ateliê e oficina',
] as const;

export const PAYMENT_METHODS = [
  'Pix Itaú',
  'Cartão XP',
  'Débito Itaú',
  'Dinheiro Vivo',
  'Manu emprestou',
  'Fernando emprestou',
] as const;


export type Category = typeof CATEGORIES[number];
export type PaymentMethod = typeof PAYMENT_METHODS[number];