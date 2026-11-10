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

      {/* Neon: Blitz im Kreis */}
      <svg
        className="hidden h-30 w-30 [[data-look=neon]_&]:block glow"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="46" fill="none" strokeWidth="2" className="stroke-accent" />
        <polygon points="66 28 42 68 56 68 52 92 78 50 62 50" className="fill-accent" />
      </svg>

      <p className="font-heading text-xl">Alles erledigt. Zeit für Kaffee.</p>
      <p className="text-muted-foreground">Tippe oben eine neue Aufgabe ein oder drücke N.</p>
    </div>
  )
}
