import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-ok" />,
        info:    <InfoIcon className="size-4 text-accent" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        error:   <OctagonXIcon className="size-4 text-danger" />,
        loading: <Loader2Icon className="size-4 animate-spin text-ink-3" />,
      }}
      style={{
        "--normal-bg":      "var(--color-surface)",
        "--normal-text":    "var(--color-ink)",
        "--normal-border":  "var(--color-border-soft)",
        "--success-bg":     "var(--color-surface)",
        "--success-text":   "var(--color-ink)",
        "--success-border": "var(--color-border-soft)",
        "--error-bg":       "var(--color-surface)",
        "--error-text":     "var(--color-ink)",
        "--error-border":   "var(--color-border-soft)",
        "--border-radius":  "var(--radius)",
        "--font-family":    "var(--font-sans)",
      } as React.CSSProperties}
      toastOptions={{
        duration: 3000,
        classNames: {
          toast:       "shadow-card border border-border-soft",
          title:       "text-[13.5px] font-medium text-ink",
          description: "text-[12.5px] text-ink-3",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
