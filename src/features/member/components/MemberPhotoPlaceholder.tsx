type MemberPhotoPlaceholderProps = {
  variant?: 'hero' | 'card'
  className?: string
}

function MemberPhotoPlaceholder({
  variant = 'card',
  className = '',
}: MemberPhotoPlaceholderProps) {
  const isHero = variant === 'hero'

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-border ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full text-foreground/10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 0L100 100M100 0L0 100"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>

      <span
        className={`absolute bottom-2 left-2 right-2 font-medium uppercase text-foreground/65 ${
          isHero
            ? 'text-[9px] leading-[1.4] tracking-[0.13em] sm:text-[10px]'
            : 'text-[8px] leading-[1.4] tracking-[0.12em]'
        }`}
      >
        {isHero
          ? 'Photo placeholder · Strength training'
          : 'Photo placeholder'}
      </span>
    </div>
  )
}

export default MemberPhotoPlaceholder