import { useCallback, useEffect, useRef, useState } from 'react'
import { type CustomerResponse } from '@teste-eteg/shared'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LogOut, Plus } from 'lucide-react'
import ColorsModal from '../../components/admin/ColorsModal'

export default function AdminHomePage() {
    const navigate = useNavigate()
    const [customers, setCustomers] = useState<CustomerResponse[]>([])
    const [search, setSearch] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null)
    const [showColors, setShowColors] = useState(false)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const fetchCustomers = useCallback(async (q?: string) => {
        try {
            const { data } = await api.get('/customers', { params: { search: q }})
            setCustomers(data)
        } catch {
            navigate('/admin/login')
        }
    }, [navigate])

    useEffect(() => {
        fetchCustomers()
    }, [fetchCustomers])

    function handleSearch(value: string) {
        setSearch(value)
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = setTimeout(() => fetchCustomers(value), 300)
    }

    async function handleLogout() {
        await api.post('/auth/logout')
        toast.success('Logout realizado com sucesso')
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen p-6 space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowColors(true)}>
                <Plus className="mr-1 h-4 w-4" />
                Adicionar Nova Cor
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" />
                Logout
            </Button>
            </div>
        </div>

        <Input
            placeholder="Buscar por nome, CPF ou e-mail..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
        />

        <div className="divide-y border rounded-lg">
            {customers.length === 0 ? (
            <p className="p-4 text-muted-foreground text-sm">Nenhum cadastro encontrado.</p>
            ) : (
            customers.map((c) => (
                <button
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                <div className="flex items-center justify-between">
                    <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.email}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm">
                    <span
                        className="inline-block h-3 w-3 rounded-full border"
                        style={{ backgroundColor: c.color.hexCode }}
                    />
                    {c.color.name}
                    </span>
                </div>
                </button>
            ))
            )}
        </div>

        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Detalhes do Cadastro</DialogTitle>
            </DialogHeader>
            {selectedCustomer && (
                <div className="space-y-3 text-sm">
                <div><span className="font-medium">Nome:</span> {selectedCustomer.name}</div>
                <div><span className="font-medium">CPF:</span> {selectedCustomer.cpf}</div>
                <div><span className="font-medium">E-mail:</span> {selectedCustomer.email}</div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Cor preferida:</span>
                    <span
                    className="inline-block h-3 w-3 rounded-full border"
                    style={{ backgroundColor: selectedCustomer.color.hexCode }}
                    />
                    {selectedCustomer.color.name}
                </div>
                {selectedCustomer.observations && (
                    <div><span className="font-medium">Observações:</span> {selectedCustomer.observations}</div>
                )}
                <div>
                    <span className="font-medium">Cadastrado em:</span>{' '}
                    {new Date(selectedCustomer.createdAt).toLocaleDateString('pt-BR')}
                </div>
                </div>
            )}
            </DialogContent>
        </Dialog>

        {showColors && (
            <ColorsModal
            onClose={() => {
                setShowColors(false)
                fetchCustomers(search)
            }}
            />
        )}
        </div>
    )
}