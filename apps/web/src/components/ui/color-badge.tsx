interface ColorBadgeProps {
    hex: string
    name: string
}

export default function ColorBadge({ hex, name }: ColorBadgeProps) {
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border-soft bg-surface-2 text-[12.5px] font-medium text-ink-2">
            <span
                className="inline-block h-3 w-3 rounded-full border border-border-soft flex-none"
                style={{ backgroundColor: hex }}
            />
            {name}
        </span>
    )
}
