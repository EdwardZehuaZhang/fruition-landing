interface PaperPlaneIconProps {
  size?: number
  className?: string
}

export default function PaperPlaneIcon({ size = 18, className }: PaperPlaneIconProps) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M21.7 2.3a1 1 0 0 0-1.04-.23L2.66 8.47a1 1 0 0 0-.1 1.84l6.82 3.31 3.31 6.82a1 1 0 0 0 1.84-.1l6.4-18a1 1 0 0 0-.23-1.04Zm-8.3 14.85-2.27-4.67 5.93-5.93L13.4 17.15Zm4.42-12L11.88 11.1 7.22 8.82l11.6-3.67Z"
        fill="currentColor"
      />
    </svg>
  )
}
