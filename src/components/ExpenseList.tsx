import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Download } from 'lucide-react';
import { Expense } from '@/types/expense';
import { exportToCSV } from '@/utils/csv';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete
}) => {
  const totalExpenses = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  const handleExport = () => {
    if (expenses.length > 0) {
      exportToCSV(expenses);
    }
  };

  return (
    <div className="space-y-4">
      {/* Resumo Financeiro */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resumo Financeiro</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={expenses.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Receitas</p>
              <p className="text-lg font-bold text-success">
                {totalIncome.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Despesas</p>
              <p className="text-lg font-bold text-destructive">
                {totalExpenses.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className={`text-lg font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {balance.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma movimentação registrada ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {expenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((expense) => (
                  <div 
                    key={expense.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={expense.type === 'income' ? 'default' : 'secondary'}>
                          {expense.type === 'income' ? 'Receita' : 'Despesa'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="font-medium">{expense.description}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{expense.category}</span>
                        <span>{expense.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${
                        expense.type === 'income' ? 'text-success' : 'text-destructive'
                      }`}>
                        {expense.type === 'income' ? '+' : '-'}
                        {expense.amount.toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(expense)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(expense.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};