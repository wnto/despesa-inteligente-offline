// utils/csv.ts
import { Expense } from '@/types/expense';

export const exportToCSV = (expenses: Expense[]): void => {
  const headers = [
    'Data do pagamento',
    'Comentário/Descrição',
    'Valor',
    'Categoria',
    'Meio de Pagamento'
  ];

  const csvContent = [
    headers.join(';'),
    ...expenses.map(expense => [
      new Date(expense.date).toLocaleDateString('pt-BR'),
      expense.description,
      expense.amount.toLocaleString('pt-BR', { 
        style: 'currency',
        currency: 'BRL'
      }),
      expense.category,
      expense.paymentMethod
    ].join(';'))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `despesas_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
