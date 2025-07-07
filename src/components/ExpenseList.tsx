import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Download } from 'lucide-react'
import { Expense } from '@/types/expense'
import { exportToCSV } from '@/utils/csv'

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete
}) => {
  // Somatório de todas as despesas
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const handleExport = () => {
    if (expenses.length > 0) {
      exportToCSV(expenses)
    }
  }

  return (
    <div className="space-y-4">
      {/* Resumo Financeiro */}
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
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
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total de Despesas</p>
            <p className="text-lg font-bold text-destructive">
              {totalExpenses.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Movimentações */}
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
                .slice() // cria cópia para não mutar o array original
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <span className="text-sm text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </span>
                      <p className="font-medium mt-1">{expense.description}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>{expense.category}</span>
                        <span>{expense.paymentMethod}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-destructive">
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
  )
}
