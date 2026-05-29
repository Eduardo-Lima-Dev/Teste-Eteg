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

const colorMap = Object.fromEntries(colornames.map((c) => [c.name, c.hex]))
const getColorName = nearestColor.from(colorMap)

export default function ColorsModal({ onClose }: { onClose: () => void }) {
    const [colors, setColors] = useState<ColorResponse[]>([])
    const [name, setName] = useState('')
    const [hexCode, setHexCode] = useState('#000000')
    const [loading, setLoading] = useState(false)

    const fetchColors = useCallback(async () => {
        const { data } = await api.get('/colors')
        setColors(data.data)
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gerenciar Cores</DialogTitle>
                </DialogHeader>

                <HexColorPicker
                    color={hexCode}
                    onChange={handleColorChange}
                    style={{ width: '100%', height: '160px' }}
                />
                <p className="text-xs text-muted-foreground">{hexCode}</p>


                <form onSubmit={handleCreate} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                        <Label htmlFor="color-name">Nome</Label>
                        <Input
                            id="color-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Vermelho"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading}>Adicionar</Button>
                </form>

                <div className="divide-y border rounded-lg max-h-64 overflow-y-auto">
                    {colors.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">Nenhuma cor cadastrada.</p>
                    ) : (
                        colors.map((c) => (
                            <div key={c.id} className="flex items-center justify-between px-3 py-2">
                                <span className="flex items-center gap-2 text-sm">
                                    <span
                                        className="inline-block h-4 w-4 rounded-full border"
                                        style={{ backgroundColor: c.hexCode }}
                                    />
                                    {c.name}
                                </span>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon-sm">✕</Button>
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
            </DialogContent>
        </Dialog>
    )
}
