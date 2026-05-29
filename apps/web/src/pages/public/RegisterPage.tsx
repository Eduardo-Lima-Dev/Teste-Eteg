import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createCustomerSchema, type CreateCustomerInput } from '@teste-eteg/shared'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { resolve } from "path"

type Color = { 
    id: number;
    name: string;
    hexCode: string; 
}

function formatCpf(value: string) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        .slice(0, 14)
}

export default function RegisterPage() {
    const [colors, setColors] = useState<Color[]>([])
    const [submitted, setSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CreateCustomerInput>({
        resolver: zodResolver(createCustomerSchema),
    })

    useEffect(() => {
        api
            .get('/colors')
            .then((r) => {
            const data = r.data?.data ?? r.data
            setColors(Array.isArray(data) ? data : [])
            })
            .catch(() => toast.error('Erro ao carregar cores'))
    }, [])


    async function onSubmit(data: CreateCustomerInput) {
        try {
            await api.post('/customers', data)
            setSubmitted(true)
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Erro ao enviar cadastro'
            toast.error(Array.isArray(msg) ? msg.join(', ') : msg)
        }
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-green-600">Cadastro realizado!</h1>
                    <p className="text-muted-foreground">Seus dados foram enviados com sucesso.</p>
                </div>
            </div>
        )
    }

    return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Cadastro de Cliente</h1>
          <p className="text-muted-foreground text-sm">Preencha seus dados abaixo.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome completo *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              {...register('cpf')}
              onChange={(e) => setValue('cpf', formatCpf(e.target.value))}
            />
            {errors.cpf && <p className="text-sm text-red-500">{errors.cpf.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">E-mail *</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Cor preferida *</Label>
            <Select onValueChange={(v) => setValue('colorId', Number(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cor" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full border"
                        style={{ backgroundColor: c.hexCode }}
                      />
                      {c.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.colorId && <p className="text-sm text-red-500">{errors.colorId.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="observations">Observações</Label>
            <Textarea id="observations" rows={3} {...register('observations')} />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar cadastro'}
          </Button>
        </form>
      </div>
    </div>
  )
}