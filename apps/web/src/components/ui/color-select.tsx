import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Color = { id: number; name: string; hexCode: string }

interface ColorSelectProps {
    colors: Color[]
    value?: number
    onChange: (id: number) => void
    placeholder?: string
}

export default function ColorSelect({ colors, value, onChange, placeholder = 'Selecione uma cor' }: ColorSelectProps) {
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const selected = colors.find((c) => c.id === value)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        if (open) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open])

    return (
        <div ref={wrapperRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={cn(
                    'flex w-full h-[46px] items-center justify-between rounded-lg border border-[#d2d9e3] bg-transparent px-3 text-[14.5px] text-left transition-colors outline-none',
                    'hover:border-ink-3 focus-visible:border-accent'
                )}
            >
                {selected ? (
                    <span className="flex items-center gap-2 min-w-0">
                        <span
                            className="inline-block h-3 w-3 rounded-full border border-border-soft flex-none"
                            style={{ backgroundColor: selected.hexCode }}
                        />
                        <span className="truncate text-ink">{selected.name}</span>
                    </span>
                ) : (
                    <span className="text-ink-3">{placeholder}</span>
                )}
                <ChevronDown size={16} className="text-ink-3 flex-none ml-2" />
            </button>

            {open && (
                <div className="absolute z-50 mt-1.5 w-full max-h-[240px] overflow-y-auto rounded-lg border border-border-soft bg-surface shadow-card py-1">
                    {colors.length === 0 ? (
                        <p className="px-3 py-2 text-[13px] text-ink-3">Nenhuma cor disponível</p>
                    ) : (
                        colors.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                    onChange(c.id)
                                    setOpen(false)
                                }}
                                className={cn(
                                    'flex w-full items-center gap-2 px-3 py-2 text-[14px] text-left hover:bg-surface-2 transition-colors',
                                    value === c.id && 'bg-surface-3'
                                )}
                            >
                                <span
                                    className="inline-block h-3 w-3 rounded-full border border-border-soft flex-none"
                                    style={{ backgroundColor: c.hexCode }}
                                />
                                <span className="truncate text-ink">{c.name}</span>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
