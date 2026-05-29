import { Calendar } from 'lucide-react'
import { type CustomerResponse } from '@teste-eteg/shared'
import AvatarLetter from '@/components/ui/avatar-letter'

interface CustomerCardProps {
    customer: CustomerResponse
    onClick: () => void
}

export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
    const date = new Date(customer.createdAt).toLocaleDateString('pt-BR')
    return (
        <div className="flex items-center gap-4 px-[18px] py-4 bg-surface border border-border-soft rounded-[14px] shadow-xs">
            <AvatarLetter name={customer.name} />

            {/* Name + email */}
            <div className="min-w-0" style={{ flex: '1 1 260px' }}>
                <p className="text-[15px] font-bold tracking-[-0.01em] text-ink truncate">{customer.name}</p>
                <p className="text-[13px] text-ink-2 truncate">{customer.email}</p>
            </div>

            {/* CPF */}
            <div className="flex flex-col gap-0.5 min-w-[138px]">
                <span className="text-[10.5px] font-bold tracking-[0.06em] text-ink-3 uppercase">CPF</span>
                <span className="font-mono text-[13px] text-ink">{customer.cpf}</span>
            </div>

            {/* Data */}
            <div className="flex flex-col gap-1 min-w-[118px]">
                <span className="text-[10.5px] font-bold tracking-[0.06em] text-ink-3 uppercase">Cadastro</span>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-2">
                    <Calendar size={14} className="text-ink-3 flex-none" />
                    {date}
                </span>
            </div>

            {/* Color badge */}
            <div className="min-w-[124px]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border-soft bg-surface-2 text-[12.5px] font-medium text-ink-2">
                    <span
                        className="inline-block h-[11px] w-[11px] rounded-full flex-none"
                        style={{ backgroundColor: customer.color.hexCode }}
                    />
                    {customer.color.name}
                </span>
            </div>

            {/* Ver detalhes */}
            <button
                onClick={onClick}
                className="px-3 h-8 rounded-lg border border-border-soft bg-surface text-[13px] font-semibold text-ink-2 hover:bg-surface-3 hover:text-ink transition-colors whitespace-nowrap"
            >
                Ver detalhes
            </button>

        </div>
    )
}
