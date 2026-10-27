import { Eye, EyeOff } from 'lucide-react'

type Props = { shown: boolean; onToggle: () => void; disabled: boolean; label?: string }

export default function PasswordVisibilityButton({ shown, onToggle, disabled, label = 'password' }: Props) {
  return (
    <button type="button" onClick={onToggle} disabled={disabled} aria-label={`${shown ? 'Hide' : 'Show'} ${label}`} aria-pressed={shown} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-[3px] text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60">
      {shown ? <EyeOff size={19} strokeWidth={1.5} aria-hidden="true" /> : <Eye size={19} strokeWidth={1.5} aria-hidden="true" />}
    </button>
  )
}
