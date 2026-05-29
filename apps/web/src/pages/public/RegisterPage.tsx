import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createCustomerSchema, type CreateCustomerInput } from '@teste-eteg/shared'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { User, IdCard, Mail, CheckCircle, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import CenteredScreen from '@/components/layout/CenteredScreen'
import BrandLogo from '@/components/brand/BrandLogo'
import Field from '@/components/ui/field'
import IconInput from '@/components/ui/icon-input'
import ColorSelect from '@/components/ui/color-select'

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
        watch,
        formState: { errors, isSubmitting }
    } = useForm<CreateCustomerInput>({
        resolver: zodResolver(createCustomerSchema),
    })

    const selectedColorId = watch('colorId')

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
            <CenteredScreen maxWidth={480}>
                <div className="flex flex-col items-center mb-6">
                    <BrandLogo subtitle="CADASTRO PÚBLICO" />
                </div>
                <div className="bg-surface rounded-2xl border border-border-soft shadow-card p-10 text-center space-y-3">
                    <div className="flex justify-center">
                        <CheckCircle className="h-12 w-12 text-ok" />
                    </div>
                    <h1 className="text-[22px] font-extrabold text-ink">Cadastro realizado!</h1>
                    <p className="text-[14px] text-ink-3">Seus dados foram enviados com sucesso.</p>
                </div>
            </CenteredScreen>
        )
    }

    return (
        <CenteredScreen maxWidth={480}>
            <div className="flex flex-col items-center mb-6">
                <BrandLogo subtitle="CADASTRO PÚBLICO" />
            </div>

            <div className="bg-surface rounded-2xl border border-border-soft shadow-card overflow-hidden">
                {/* Card header with subtle gradient */}
                <div className="px-8 pt-7 pb-5 border-b border-border-soft"
                    style={{ background: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%)' }}>
                    <h1 className="text-[22px] font-extrabold text-ink">Cadastro de Cliente</h1>
                    <p className="text-[13.5px] text-ink-3 mt-1">
                        Preencha seus dados abaixo. Campos com <span className="text-danger">*</span> são obrigatórios.
                    </p>
                </div>

                {/* Card body */}
                <div className="px-8 py-7">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">
                        <Field label="Nome completo" required htmlFor="name" error={errors.name?.message}>
                            <IconInput
                                id="name"
                                icon={User}
                                placeholder="Seu nome completo"
                                {...register('name')}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-3.5">
                            <Field label="CPF" required htmlFor="cpf" error={errors.cpf?.message}>
                                <IconInput
                                    id="cpf"
                                    icon={IdCard}
                                    mono
                                    placeholder="000.000.000-00"
                                    {...register('cpf')}
                                    onChange={(e) => setValue('cpf', formatCpf(e.target.value))}
                                />
                            </Field>

                            <Field label="Cor preferida" required error={errors.colorId?.message}>
                                <ColorSelect
                                    colors={colors}
                                    value={selectedColorId}
                                    onChange={(id) => setValue('colorId', id, { shouldValidate: true })}
                                />
                            </Field>
                        </div>

                        <Field label="E-mail" required htmlFor="email" error={errors.email?.message}>
                            <IconInput
                                id="email"
                                icon={Mail}
                                type="email"
                                placeholder="voce@email.com"
                                {...register('email')}
                            />
                        </Field>

                        <Field label="Observações" htmlFor="observations">
                            <Textarea
                                id="observations"
                                rows={4}
                                placeholder="Algo que devemos saber? (opcional)"
                                className="border-border-strong text-[14.5px] resize-none"
                                {...register('observations')}
                            />
                        </Field>

                        <Button
                            type="submit"
                            className="w-full h-[46px] bg-brand hover:bg-brand-hover text-white font-semibold text-[14.5px] mt-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar cadastro'}
                        </Button>

                        <div className="flex justify-center pt-1">
                            <Link
                                to="/admin/login"
                                className="flex items-center gap-1.5 text-[12px] text-ink-3 hover:text-ink transition-colors"
                            >
                                <Lock className="h-3 w-3" />
                                Área administrativa
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </CenteredScreen>
    )
}
