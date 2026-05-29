import { forwardRef } from 'react'
import { type LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface IconInputProps extends React.ComponentProps<typeof Input> {
    icon: LucideIcon
    mono?: boolean
}

const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
    ({ icon: Icon, mono, className, ...props }, ref) => {
        return (
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-3 pointer-events-none" />
                <Input
                    ref={ref}
                    className={cn('pl-9 h-[46px] border-border-strong text-[14.5px]', mono && 'font-mono', className)}
                    {...props}
                />
            </div>
        )
    }
)
IconInput.displayName = 'IconInput'
export default IconInput
