export default function EmptyState() {
  return (
    <div className="glass flex flex-col items-center gap-4 rounded-2xl border border-dashed p-10 text-center">
      {/* Aurora: Mond mit drei Sternen */}
      <svg
        className="hidden h-30 w-30 [[data-look=aurora]_&]:block"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="40" className="fill-accent" />
        <path
          d="M82 38a26 26 0 1 0 0 44 28 28 0 1 1 0-44z"
          className="fill-primary"
        />
        <path
          d="M30 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"
          className="fill-accent animate-pulse"
        />
        <path
          d="M88 90l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z"
          className="fill-accent animate-pulse"
        />
        <path
          d="M20 78l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
          className="fill-accent animate-pulse"
        />
      </svg>

      {/* Candy: lächelnde Wolke */}
      <svg
        className="hidden h-30 w-30 [[data-look=candy]_&]:block"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <path
          d="M36 88a20 20 0 0 1-2-40 26 26 0 0 1 50-6 20 20 0 0 1 8 46z"
          className="fill-accent"
        />
        <circle cx="48" cy="70" r="4" className="fill-accent-foreground" />
        <circle cx="72" cy="70" r="4" className="fill-accent-foreground" />
        <path
          d="M50 84q10 8 20 0"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className="stroke-accent-foreground"
        />
      </svg>

      {/* Neon (Matrix): Terminal-Fenster mit «Follow the white rabbit.» */}
      <svg
        className="hidden h-30 w-full max-w-sm [[data-look=neon]_&]:block"
        viewBox="0 0 240 120"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="232" height="112" rx="4" strokeWidth="2" className="fill-none stroke-primary" />
        <line x1="4" y1="24" x2="236" y2="24" strokeWidth="1" className="stroke-primary" />
        <circle cx="16" cy="14" r="3" className="fill-primary" />
        <circle cx="28" cy="14" r="3" className="fill-primary" />
        <circle cx="40" cy="14" r="3" className="fill-primary" />
        <polyline points="16 60 24 66 16 72" strokeWidth="2" className="fill-none stroke-primary" />
        <text x="32" y="70" className="fill-primary font-mono text-xs">
          Follow the white rabbit.
        </text>
        <rect x="206" y="60" width="8" height="12" className="fill-primary animate-blink" />
      </svg>

      <p className="font-heading text-xl">Alles erledigt. Zeit für Kaffee.</p>
      <p className="text-muted-foreground">Tippe oben eine neue Aufgabe ein oder drücke N.</p>
    </div>
  )
}
