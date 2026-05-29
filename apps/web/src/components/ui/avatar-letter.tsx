const palette = ['#2563eb','#0e7490','#7c3aed','#be123c','#b45309','#0f766e','#4338ca']

function avatarColor(name: string): string {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return palette[Math.abs(hash) % palette.length]
}

interface AvatarLetterProps {
    name: string
    size?: 'sm' | 'md'
}

export default function AvatarLetter({ name, size = 'md' }: AvatarLetterProps) {
    const color = avatarColor(name)
    const dim = size === 'sm' ? 'h-9 w-9 rounded-[9px] text-[15px]' : 'h-[42px] w-[42px] rounded-[11px] text-[17px]'
    return (
        <div
            className={`${dim} flex items-center justify-center text-white font-bold flex-none`}
            style={{ backgroundColor: color }}
        >
            {name.charAt(0).toUpperCase()}
        </div>
    )
}
