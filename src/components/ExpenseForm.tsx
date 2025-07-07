import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CATEGORIES, PAYMENT_METHODS, type Expense } from '@/types/expense';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  initialData?: Expense;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const form = useForm({
    defaultValues: {
      description: initialData?.description || '',
      amount: initialData?.amount || 0,
      date: initialData?.date || new Date().toISOString().slice(0, 10),
      category: initialData?.category || '',
      paymentMethod: initialData?.paymentMethod || ''
    }
  });

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      amount: parseFloat(data.amount),
      updatedAt: initialData ? new Date().toISOString() : undefined
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Despesa' : 'Nova Despesa'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a despesa..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0,00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Categoria</FormLabel>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <label key={category} className="cursor-pointer">
            <input
              type="radio"
              name="category"
              value={category}
              checked={field.value === category}
              onChange={() => field.onChange(category)}
              className="sr-only peer"
            />
            <span
              className={`
                inline-block px-4 py-1 
                border rounded-full 
                text-sm font-medium

                peer-checked:bg-gray-900 
                peer-checked:text-white 
                peer-checked:border-gray-900

                hover:bg-gray-100 
                transition
              `}
            >
              {category}
            </span>
          </label>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="paymentMethod"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Meio de Pagamento</FormLabel>
      <div className="flex flex-wrap gap-2">
        {PAYMENT_METHODS.map((method) => (
          <label key={method} className="cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={field.value === method}
              onChange={() => field.onChange(method)}
              className="sr-only peer"
            />
            <span
              className={`
                inline-block px-4 py-1 
                border rounded-full 
                text-sm font-medium

                peer-checked:bg-gray-900 
                peer-checked:text-white 
                peer-checked:border-gray-900

                hover:bg-gray-100 
                transition
              `}
            >
              {method}
            </span>
          </label>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>


            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {initialData ? 'Atualizar' : 'Salvar'}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};