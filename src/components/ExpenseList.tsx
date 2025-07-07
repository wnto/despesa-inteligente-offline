import React from 'react'
import { useForm } from 'react-hook-form'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import ptBR from 'date-fns/locale/pt-BR'
import 'react-datepicker/dist/react-datepicker.css'
import { format, parseISO } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { CATEGORIES, PAYMENT_METHODS, type Expense } from '@/types/expense'

registerLocale('pt-BR', ptBR)

type FormValues = {
  description: string
  amount: string        // e.g. "123,45"
  date: string          // ISO string
  category: string
  paymentMethod: string
}

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id' | 'createdAt'> & { updatedAt?: string }) => void
  onCancel?: () => void
  initialData?: Expense
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      description: initialData?.description ?? '',
      amount: initialData
        ? initialData.amount.toFixed(2).replace('.', ',')
        : '0,00',
      date: initialData?.date ?? new Date().toISOString(),
      category: initialData?.category ?? '',
      paymentMethod: initialData?.paymentMethod ?? ''
    }
  })

  const handleSubmit = (data: FormValues) => {
    // Convert amount "123,45" -> 123.45
    const amountNumber = parseFloat(data.amount.replace(',', '.'))

    // data.date is already ISO string from date picker

    onSubmit({
      ...data,
      date: data.date,
      amount: amountNumber,
      updatedAt: initialData ? new Date().toISOString() : undefined
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        {/* Description */}
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

        {/* Amount (Brazilian format) */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input
                  placeholder="0,00"
                  value={field.value}
                  onChange={(e) => {
                    let v = e.target.value.replace(/[^0-9,]/g, '')
                    const parts = v.split(',')
                    if (parts.length > 2) v = parts[0] + ',' + parts.slice(1).join('')
                    field.onChange(v)
                  }}
                  onBlur={() => {
                    let v = field.value
                    const [int, dec = ''] = v.split(',')
                    if (!v.includes(',')) {
                      v = `${int},00`
                    } else if (dec.length === 0) {
                      v = `${int},00`
                    } else if (dec.length === 1) {
                      v = `${int},${dec}0`
                    } else if (dec.length > 2) {
                      v = `${int},${dec.slice(0, 2)}`
                    }
                    field.onChange(v)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date (react-datepicker) */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => {
            const selectedDate = field.value
              ? parseISO(field.value)
              : null

            return (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <ReactDatePicker
                    locale="pt-BR"
                    dateFormat="dd/MM/yyyy"
                    selected={selectedDate}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date.toISOString())
                      } else {
                        field.onChange('')
                      }
                    }}
                    customInput={
                      <Input
                        placeholder="dd/MM/yyyy"
                        value={
                          selectedDate
                            ? format(selectedDate, 'dd/MM/yyyy')
                            : ''
                        }
                      />
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        {/* Category (radio-pills responsive grid) */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      className={
                        `inline-block px-4 py-1 border rounded-full text-sm font-medium ` +
                        `peer-checked:bg-gray-900 peer-checked:text-white peer-checked:border-gray-900 ` +
                        `hover:bg-gray-100 transition`
                      }
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

        {/* Payment Method (radio-pills responsive grid) */}
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meio de Pagamento</FormLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      className={
                        `inline-block px-4 py-1 border rounded-full text-sm font-medium ` +
                        `peer-checked:bg-gray-900 peer-checked:text-white peer-checked:border-gray-900 ` +
                        `hover:bg-gray-100 transition`
                      }
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

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {initialData ? 'Atualizar' : 'Salvar'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
