import { useCallback, useEffect, useState } from 'react'
import { type ColorResponse } from '@teste-eteg/shared'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import nearestColor from 'nearest-color'
import { colornames } from 'color-name-list'
import { HexColorPicker } from 'react-colorful'
import { Plus, X } from 'lucide-react'

const colorMap = Object.fromEntries(colornames.map((c) => [c.name, c.hex]))
const getColorName = nearestColor.from(colorMap)

export default function ColorsModal({ onClose }: { onClose: () => void }) {
    const [colors, setColors] = useState<ColorResponse[]>([])
    const [name, setName] = useState('')
    const [hexCode, setHexCode] = useState('#000000')
    const [loading, setLoading] = useState(false)

    const fetchColors = useCallback(async () => {
        try {
            const { data } = await api.get('/colors')
            setColors(data)
        } catch {
            toast.error('Erro ao carregar cores')
        }
    }, [])

    useEffect(() => { fetchColors() }, [fetchColors])

    async function handleCreate(e: { preventDefault(): void }) {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/colors', { name, hexCode })
            toast.success('Cor criada com sucesso')
            setName('')
            setHexCode('#000000')
            fetchColors()
        } catch {
            toast.error('Erro ao criar cor')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: number) {
        try {
            await api.delete(`/colors/${id}`)
            toast.success('Cor removida')
            fetchColors()
        } catch {
            toast.error('Não foi possível remover a cor')
        }
    }

    function handleColorChange(hex: string) {
        setHexCode(hex)
        const match = getColorName(hex)
        if (match) setName(match.name)
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-[420px] p-0 rounded-[20px] gap-0">
                <DialogHeader className="flex flex-row items-center justify-between px-5 py-4 border-b border-border-soft">
                    <DialogTitle className="text-[15px] font-bold text-ink">Gerenciar Cores</DialogTitle>
                </DialogHeader>

                <div className="px-[22px] py-5">
                    {/* Color picker */}
                    <HexColorPicker
                        color={hexCode}
                        onChange={handleColorChange}
                        style={{ width: '100%', height: 154, borderRadius: 12 }}
                    />

                    {/* Hex swatch + name + add button */}
                    <form onSubmit={handleCreate} className="flex items-end gap-2.5 mt-4">
                        <div className="flex-none">
                            <Label className="text-[13px] font-semibold mb-1.5 block text-ink-2">Cor</Label>
                            <div className="flex items-center gap-2.5 h-11 px-3 border border-border-strong rounded-lg bg-surface">
                                <span
                                    className="w-[18px] h-[18px] rounded flex-none"
                                    style={{ backgroundColor: hexCode }}
                                />
                                <span className="font-mono text-[13px] text-ink-2 whitespace-nowrap">
                                    {hexCode.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-1.5">
                            <Label htmlFor="color-name" className="text-[13px] font-semibold text-ink-2">Nome</Label>
                            <Input
                                id="color-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Azul royal"
                                required
                                className="h-11 border-border-strong text-[13.5px]"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-11 bg-brand hover:bg-brand-hover text-white flex-none"
                        >
                            <Plus size={16} className="mr-1" />
                            Adicionar
                        </Button>
                    </form>

                    {/* Color list */}
                    <div className="mt-5">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-[13px] font-semibold text-ink-2">Cores cadastradas</Label>
                            <span className="text-[11.5px] font-semibold text-ink-3">{colors.length}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 h-[200px] overflow-y-auto pr-1">
                            {colors.length === 0 ? (
                                <p className="py-4 text-center text-[13px] text-ink-3">Nenhuma cor cadastrada.</p>
                            ) : (
                                colors.map((c) => (
                                    <div
                                        key={c.id}
                                        className="flex items-center gap-2.5 px-3 py-2 border border-border-soft rounded-[10px] bg-surface"
                                    >
                                        <span
                                            className="w-[18px] h-[18px] rounded flex-none"
                                            style={{ backgroundColor: c.hexCode }}
                                        />
                                        <span className="text-sm font-medium text-ink flex-1 truncate">{c.name}</span>
                                        <span className="font-mono text-[11.5px] text-ink-3 mr-2">
                                            {c.hexCode.toUpperCase()}
                                        </span>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon-sm">
                                                    <X size={15} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Remover cor?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta ação não pode ser desfeita.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(c.id)}>
                                                        Remover
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
