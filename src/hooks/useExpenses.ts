import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import { dbService } from '@/services/indexedDB';
import { useToast } from '@/hooks/use-toast';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadExpenses = async () => {
    try {
      const data = await dbService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as despesas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const expense: Expense = {
        ...expenseData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };

      await dbService.addExpense(expense);
      await loadExpenses();
      
      toast({
        title: "Sucesso",
        description: "Despesa salva com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a despesa.",
        variant: "destructive"
      });
    }
  };

  const updateExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'> & { id: string }) => {
    try {
      const existingExpense = expenses.find(e => e.id === expenseData.id);
      if (!existingExpense) return;

      const updatedExpense: Expense = {
        ...existingExpense,
        ...expenseData,
        updatedAt: new Date().toISOString()
      };

      await dbService.updateExpense(updatedExpense);
      await loadExpenses();
      
      toast({
        title: "Sucesso",
        description: "Despesa atualizada com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a despesa.",
        variant: "destructive"
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await dbService.deleteExpense(id);
      await loadExpenses();
      
      toast({
        title: "Sucesso",
        description: "Despesa removida com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar despesa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a despesa.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses: loadExpenses
  };
};