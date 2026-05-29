import { type ReactNode } from 'react'
import BrandLogo from '@/components/brand/BrandLogo'

interface PanelHeaderProps {
    subtitle: string
    actions: ReactNode
}

export default function PanelHeader({ subtitle, actions }: PanelHeaderProps) {
    return (
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-7 py-4 bg-surface border-b border-border-soft shadow-xs">
            <BrandLogo subtitle={subtitle} />
            <div className="flex items-center gap-2">{actions}</div>
        </header>
    )
}
