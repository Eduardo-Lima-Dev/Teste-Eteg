import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { loginSchema, type LoginInput } from '@teste-eteg/shared'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import CenteredScreen from '@/components/layout/CenteredScreen'
import BrandLogo from '@/components/brand/BrandLogo'
import Field from '@/components/ui/field'
import IconInput from '@/components/ui/icon-input'

export default function LoginPage() {
    const navigate = useNavigate()
    const [showPwd, setShowPwd] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    })

    async function onSubmit(data: LoginInput) {
        try {
            await api.post('/auth/login', data)
            navigate('/admin')
        } catch {
            toast.error('Credenciais inválidas')
        }
    }

    return (
        <CenteredScreen maxWidth={396}>
            {/* Top row: voltar + logo */}
            <div className="flex items-center justify-between mb-5">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-2 hover:text-ink transition-colors"
                >
                    <ArrowLeft size={15} />
                    Voltar
                </button>
                <BrandLogo subtitle="ADMIN SUITE" />
            </div>

            <div className="bg-surface rounded-2xl border border-border-soft shadow-card px-[30px] py-[28px]">
                {/* ACESSO RESTRITO badge */}
                <div className="flex items-center gap-2 mb-2.5">
                    <span className="h-[30px] w-[30px] rounded-lg bg-brand grid place-items-center flex-none">
                        <Lock size={15} className="text-white" />
                    </span>
                    <span className="text-[12px] font-bold tracking-[0.08em] text-ink">ACESSO RESTRITO</span>
                </div>

                <h1 className="text-[24px] font-extrabold text-ink mt-2.5 mb-1">Acesso Administrativo</h1>
                <p className="text-[14px] text-ink-2 mb-6">Entre com suas credenciais para continuar.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Field label="E-mail" required htmlFor="email" error={errors.email?.message}>
                        <IconInput
                            id="email"
                            icon={Mail}
                            type="email"
                            placeholder="voce@empresa.com"
                            {...register('email')}
                        />
                    </Field>

                    <Field label="Senha" required htmlFor="password" error={errors.password?.message}>
                        <div className="relative">
                            <IconInput
                                id="password"
                                icon={Lock}
                                type={showPwd ? 'text' : 'password'}
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-2 transition-colors"
                                tabIndex={-1}
                            >
                                {showPwd ? <EyeOff size={19} /> : <Eye size={19} />}
                            </button>
                        </div>
                    </Field>

                    <Button
                        type="submit"
                        className="w-full h-[46px] bg-brand hover:bg-brand-hover text-white font-semibold text-[14.5px] mt-1"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>
            </div>

            <p className="text-center mt-4 text-[12.5px] text-ink-3">
                Protegido por autenticação · Admin Suite © 2026
            </p>
        </CenteredScreen>
    )
}
