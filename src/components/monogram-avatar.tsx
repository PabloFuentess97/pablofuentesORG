import { cn } from "@/lib/utils";

type Props = {
  initials?: string;
  className?: string;
  size?: number;
};

// A generated blue monogram — used instead of personal photos.
export function MonogramAvatar({ initials = "PF", className, size = 96 }: Props) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-primary/90 via-primary to-primary/70",
        "text-primary-foreground font-heading font-bold",
        "ring-1 ring-primary/20 shadow-lg shadow-primary/20",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>
      <span className="relative tracking-tight">{initials}</span>
    </div>
  );
}
