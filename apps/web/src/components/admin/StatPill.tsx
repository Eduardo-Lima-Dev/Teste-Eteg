interface StatPillProps {
    value: number | string
    label: string
    accent?: boolean
}

export default function StatPill({ value, label, accent }: StatPillProps) {
    return (
        <div className="flex flex-col gap-0.5 px-4 py-[10px] bg-surface border border-border-soft rounded-xl min-w-[120px]">
            <span
                className="text-[21px] font-extrabold leading-none tracking-[-0.02em]"
                style={{ color: accent ? 'var(--color-accent)' : 'var(--color-ink)' }}
            >
                {value}
            </span>
            <span className="text-[12px] text-ink-2 font-medium">{label}</span>
        </div>
    )
}
