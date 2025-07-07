import React from 'react'
import { useForm } from 'react-hook-form'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { CATEGORIES, PAYMENT_METHODS, type Expense } from '@/types/expense'

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
  onCancel?: () => void
  initialData?: Expense
}

type FormValues = {
  description: string
  amount: string      // <-- string so we can hold "123,45"
  date: string        // <-- string so we can hold "31/12/2025"
  category: string
  paymentMethod: string
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      description: initialData?.description ?? '',
      // pre-format amount and date:
      amount: initialData
        ? initialData.amount.toFixed(2).replace('.', ',')
        : '0,00',
      date: initialData
        ? format(parseISO(initialData.date), 'dd/MM/yyyy')
        : format(new Date(), 'dd/MM/yyyy'),
      category: initialData?.category ?? '',
      paymentMethod: initialData?.paymentMethod ?? ''
    }
  })

  const handleSubmit = (data: FormValues) => {
    // 1. parse dd/mm/yyyy → ISO
    const [d, m, y] = data.date.split('/')
    const isoDate = new Date(
      Number(y),
      Number(m) - 1,
      Number(d)
    ).toISOString()

    // 2. parse "123,45" → 123.45
    const amountNumber = parseFloat(data.amount.replace(',', '.'))

    onSubmit({
      ...data,
      date: isoDate,
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
        {/* … your description textarea … */}

        {/* ==== AMOUNT FIELD ==== */}
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
                    // allow only digits & comma
                    let v = e.target.value.replace(/[^0-9,]/g, '')
                    // only one comma
                    const parts = v.split(',')
                    if (parts.length > 2)
                      v = parts[0] + ',' + parts.slice(1).join('')
                    field.onChange(v)
                  }}
                  onBlur={() => {
                    // ensure exactly two decimals
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

        {/* ==== DATE FIELD ==== */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input
                  placeholder="dd/mm/yyyy"
                  value={field.value}
                  onChange={(e) => {
                    // allow only digits & slashes
                    let v = e.target.value.replace(/[^0-9/]/g, '')
                    const parts = v.split('/')
                    // cap each segment
                    if (parts[0].length > 2) parts[0] = parts[0].slice(0, 2)
                    if (parts[1] && parts[1].length > 2)
                      parts[1] = parts[1].slice(0, 2)
                    if (parts[2] && parts[2].length > 4)
                      parts[2] = parts[2].slice(0, 4)
                    field.onChange(parts.filter(Boolean).join('/'))
                  }}
                  onBlur={() => {
                    // pad single digits to two digits
                    const [d, m, y] = field.value.split('/')
                    const dd = d?.padStart(2, '0') ?? ''
                    const mm = m?.padStart(2, '0') ?? ''
                    field.onChange(`${dd}/${mm}/${y}`)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ==== CATEGORY & PAYMENT METHOD (your radio-pills) ==== */}
        {/* … copy in your responsive two-column radio-pill grids here … */}

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
