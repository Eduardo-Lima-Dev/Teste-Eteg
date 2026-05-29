import { type ReactNode } from 'react'
import BrandLogo from '@/components/brand/BrandLogo'

interface PanelHeaderProps {
    subtitle: string
    actions: ReactNode
}

export default function PanelHeader({ subtitle, actions }: PanelHeaderProps) {
    return (
        <header className="flex items-center justify-between px-7 py-4 bg-surface border-b border-border-soft shadow-xs">
            <BrandLogo subtitle={subtitle} />
            <div className="flex items-center gap-2">{actions}</div>
        </header>
    )
}
