import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { loginSchema, type LoginInput } from '@teste-eteg/shared'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const navigate = useNavigate()

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

    const handleBack = () => {
        navigate('/')
    }

    return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <Button variant="ghost" onClick={handleBack} className="mb-2 -ml-2 self-start">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Acesso Administrativo</h1>
          <p className="text-muted-foreground text-sm">Entre com suas credenciais.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}