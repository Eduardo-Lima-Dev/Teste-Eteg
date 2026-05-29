import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type CustomerResponse } from '@teste-eteg/shared'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LogOut, Plus, Search, User, IdCard, Mail, Palette, FileText, Calendar } from 'lucide-react'
import ColorsModal from '../../components/admin/ColorsModal'
import PanelHeader from '@/components/layout/PanelHeader'
import StatPill from '@/components/admin/StatPill'
import CustomerCard from '@/components/admin/CustomerCard'
import AvatarLetter from '@/components/ui/avatar-letter'
import ColorBadge from '@/components/ui/color-badge'
import IconInput from '@/components/ui/icon-input'

function Row({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-border-soft last:border-0">
            <div className="h-7 w-7 rounded-lg bg-surface-3 flex items-center justify-center flex-none mt-0.5">
                <Icon size={14} className="text-ink-3" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10.5px] font-bold tracking-[0.08em] text-ink-3 uppercase mb-0.5">{label}</p>
                <div className="text-[13.5px] text-ink font-medium">{children}</div>
            </div>
        </div>
    )
}

export default function AdminHomePage() {
    const navigate = useNavigate()
    const [customers, setCustomers] = useState<CustomerResponse[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const limit = 10
    const [search, setSearch] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null)
    const [showColors, setShowColors] = useState(false)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const fetchCustomers = useCallback(async (q?: string, p = 1) => {
        try {
            const { data } = await api.get('/customers', { params: { search: q, page: p, limit } })
            setCustomers(data.data)
            setTotal(data.total)
            setPage(data.page)
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
        searchTimeoutRef.current = setTimeout(() => fetchCustomers(value, 1), 300)
    }

    async function handleLogout() {
        await api.post('/auth/logout')
        toast.success('Sessão encerrada')
        navigate('/admin/login')
    }

    const uniqueColors = useMemo(() => new Set(customers.map((c) => c.color.id)), [customers])
    const recentCount = useMemo(
        () => customers.filter((c) => Date.now() - new Date(c.createdAt).getTime() < 7 * 86400000).length,
        [customers]
    )
    const totalPages = Math.ceil(total / limit)

    return (
        <div className="min-h-screen bg-bg flex flex-col">
            <PanelHeader
                subtitle="ADMIN SUITE · GESTÃO DE CLIENTES"
                actions={
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowColors(true)}
                            className="text-[13.5px] font-semibold"
                        >
                            <Plus size={15} className="mr-1" />
                            Adicionar Nova Cor
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleLogout}
                            className="text-[13.5px] font-semibold"
                        >
                            <LogOut size={15} className="mr-1" />
                            Logout
                        </Button>
                    </>
                }
            />

            <div className="flex-1 overflow-y-auto p-[26px_32px_40px]">
                <div className="max-w-[1180px] mx-auto">

                    {/* Stats + Search */}
                    <div className="flex items-center gap-3 mb-5">
                        <StatPill value={total} label="Clientes cadastrados" />
                        <StatPill value={uniqueColors.size} label="Cores disponíveis" />
                        <StatPill value={recentCount} label="Cadastros esta semana" />
                        <div className="flex-1 max-w-[360px] ml-auto">
                            <IconInput
                                icon={Search}
                                placeholder="Buscar por nome, CPF ou e-mail…"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="bg-surface"
                            />
                        </div>
                    </div>

                    <h2 className="text-[14px] font-bold text-ink-2 mb-3">
                        Clientes <span className="text-ink-3 font-medium">· {total} resultados</span>
                    </h2>

                    <div className="flex flex-col gap-2.5">
                        {customers.length === 0 ? (
                            <p className="py-8 text-center text-[13.5px] text-ink-3">Nenhum cadastro encontrado.</p>
                        ) : (
                            customers.map((c) => (
                                <CustomerCard key={c.id} customer={c} onClick={() => setSelectedCustomer(c)} />
                            ))
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-5">
                            <span className="text-[13px] text-ink-3">
                                Página {page} de {totalPages}
                            </span>
                            <div className="flex gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1}
                                    onClick={() => fetchCustomers(search, page - 1)}
                                >
                                    <ChevronLeft size={15} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= totalPages}
                                    onClick={() => fetchCustomers(search, page + 1)}
                                >
                                    <ChevronRight size={15} />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Dialog */}
            <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
                <DialogContent className="max-w-[480px] max-h-[90vh] p-0 rounded-[20px] overflow-y-auto gap-0">
                    <DialogHeader className="flex flex-row items-center gap-3 px-5 py-4 border-b border-border-soft bg-surface">
                        {selectedCustomer && <AvatarLetter name={selectedCustomer.name} size="sm" />}
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-[15px] font-bold text-ink">Detalhes do Cadastro</DialogTitle>
                            {selectedCustomer && (
                                <p className="text-[12px] text-ink-3 truncate">{selectedCustomer.name}</p>
                            )}
                        </div>
                    </DialogHeader>

                    {selectedCustomer && (
                        <>
                            <div className="px-[22px] py-1.5">
                                <Row icon={User} label="Nome completo">{selectedCustomer.name}</Row>
                                <Row icon={IdCard} label="CPF">
                                    <span className="font-mono">{selectedCustomer.cpf}</span>
                                </Row>
                                <Row icon={Mail} label="E-mail">{selectedCustomer.email}</Row>
                                <Row icon={Palette} label="Cor preferida">
                                    <ColorBadge hex={selectedCustomer.color.hexCode} name={selectedCustomer.color.name} />
                                </Row>
                                <Row icon={FileText} label="Observações">
                                    {selectedCustomer.observations || <span className="text-ink-3">—</span>}
                                </Row>
                                <Row icon={Calendar} label="Cadastrado em">
                                    {new Date(selectedCustomer.createdAt).toLocaleDateString('pt-BR')}
                                </Row>
                            </div>
                            <div className="flex justify-end gap-2.5 px-5 py-3.5 border-t border-border-soft bg-surface-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedCustomer(null)}
                                    className="text-[13.5px] font-semibold"
                                >
                                    Fechar
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {showColors && (
                <ColorsModal
                    onClose={() => {
                        setShowColors(false)
                        fetchCustomers(search, page)
                    }}
                />
            )}
        </div>
    )
}
