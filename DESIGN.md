# DESIGN.md: Design-System

Jede App soll aussergewöhnlich aussehen: viel Farbe, Bewegung, hochwertige Flächen. Kein graues Standard-Gefühl.

**Regel für den Agent:** Alles hier wird wörtlich übernommen. Keine eigenen Farben, keine eigenen Schatten, keine eigenen Schriften. Ist etwas nicht beschrieben, frag (AGENTS.md, Regel 12).

## So funktioniert der Look

- Der Look steht als Attribut auf dem `<html>`-Element: `<html data-look="aurora">`. Erlaubt sind `aurora`, `candy` und `neon`. Standard ist `aurora`. Der Wert `neon` zeigt den Matrix-Look (Look 3). Der Name bleibt `neon`, weil `scripts/setup.mjs`, die Tests und die `dark:`-Variante ihn so erwarten.
- Die Person wählt den Look in `/spec`. Er steht danach in docs/SPEC.md unter «## Look».
- Den gewählten Look setzt der Agent in `index.html` (Attribut `data-look`). Alle Tokens wechseln dann automatisch.
- Alle drei Looks stehen gleichzeitig in `src/index.css` (Vorlage in docs/STACK.md). Ein Look-Wechsel zur Laufzeit ist nur ein neuer Wert für `document.documentElement.dataset.look`.
- Tokens sind CSS-Variablen (Werte, die man an einer Stelle ändert und die überall wirken). Tailwind macht daraus Klassen wie `bg-primary`.

## Tokens als Klassen

Diese Klassen sind die einzigen erlaubten Werte für Farbe, Form und Tiefe im Komponenten-Code.

| Zweck                | Klassen                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------- |
| Flächen              | `bg-background`, `bg-card`, `bg-popover`, `bg-primary`, `bg-secondary`, `bg-muted`, `bg-accent`, `bg-destructive` |
| Text                 | `text-foreground`, `text-muted-foreground`, `text-card-foreground`, `text-primary-foreground`, `text-secondary-foreground`, `text-accent-foreground`, `text-success` |
| Ränder und Fokus     | `border-border`, `border-input`, `ring-ring`, `outline-ring`                                |
| Radien               | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`       |
| Schatten             | `shadow-card` (ruhig), `shadow-pop` (Hover, angehoben)                                      |
| Schriften            | `font-heading` (Überschriften), `font-sans` (Text), `font-mono` (Zahlen, Zähler)            |
| Eigene Effekte       | `glass` (Milchglas-Fläche), `glow` (Leuchtrand), `text-gradient` (Verlaufstext), `bg-gradient-hero` (Verlaufsfläche), `transition-look` (Übergang im Look-Tempo), `matrix-rain` (nur für das Canvas aus Rezept 10) |
| Bewegung             | `ease-spring`, `ease-out-soft`, `animate-shake`, `animate-pop`, `animate-blink`, `duration-150`, `duration-300`, `duration-500` |
| Abstände             | nur die Tailwind-Skala: `p-2`, `p-4`, `p-6`, `gap-3`, `gap-4`, `mt-8` …                     |

**Farben als Text:** `text-primary` und `text-destructive` sind in den dunklen Looks zu schwach (unter 4.5:1). Für farbigen Text nur `text-gradient`, `text-success` oder `text-foreground` nehmen. `bg-primary` und `bg-destructive` immer mit dem passenden `text-*-foreground` kombinieren.

**Werte für JavaScript** (canvas-confetti, motion): aus den CSS-Variablen lesen, nie Hex-Werte in TypeScript schreiben:

```ts
// src/lib/theme.ts
export function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function readConfettiColors(): string[] {
  return readCssVar('--confetti').split(',').map((c) => c.trim()).filter(Boolean)
}
```

---

## Look 1: Aurora (Standard)

**Charakter:** Tiefes Indigo bis Violett, durchzogen von türkisem Polarlicht. Karten schweben wie Milchglas mit weichen Lichtkanten, alles wirkt ruhig und elegant.

**Schriften:** Überschrift `Outfit Variable` (geometrisch, modern), Text `Inter Variable` (sehr gut lesbar). Paket: `@fontsource-variable/outfit`, `@fontsource-variable/inter`.

**Hintergrund:** Vier weiche Lichtflecken (Türkis, Violett, Rosa, Himmelblau) als `radial-gradient`, weichgezeichnet und langsam bewegt (24 s). Bei reduzierter Bewegung steht er still.

**Typische Klassen:** Karten `glass rounded-xl border shadow-card`, Hover `hover:-translate-y-1 hover:shadow-pop`.

```css
/* ==========================================================================
   LOOK 1: AURORA (Standard)
   ========================================================================== */
:root,
[data-look='aurora'] {
  color-scheme: dark;
  --radius: 1rem;

  --background: #0c0a24;
  --foreground: #f5f3ff;
  --card: rgb(30 26 74 / 0.62);
  --card-foreground: #f5f3ff;
  --popover: #1a1640;
  --popover-foreground: #f5f3ff;
  --primary: #6d4cf0;
  --primary-foreground: #ffffff;
  --secondary: #2b2566;
  --secondary-foreground: #f5f3ff;
  --muted: #1a1640;
  --muted-foreground: #b9b3e6;
  --accent: #2fe0c2;
  --accent-foreground: #062824;
  --destructive: #d9264f;
  --destructive-foreground: #ffffff;
  --success: #2fe0c2;
  --border: rgb(196 181 253 / 0.18);
  --input: rgb(196 181 253 / 0.24);
  --ring: #2fe0c2;
  --chart-1: #6d4cf0;
  --chart-2: #2fe0c2;
  --chart-3: #f0abfc;
  --chart-4: #c4b5fd;
  --chart-5: #38bdf8;

  --gradient-hero: linear-gradient(100deg, #c4b5fd 0%, #2fe0c2 45%, #f0abfc 100%);
  --gradient-card: linear-gradient(145deg, rgb(255 255 255 / 0.10) 0%, rgb(255 255 255 / 0.02) 60%);
  --gradient-mesh:
    radial-gradient(40% 50% at 20% 20%, rgb(47 224 194 / 0.35) 0%, transparent 70%),
    radial-gradient(45% 55% at 80% 10%, rgb(109 76 240 / 0.45) 0%, transparent 70%),
    radial-gradient(50% 60% at 70% 90%, rgb(240 171 252 / 0.25) 0%, transparent 70%),
    radial-gradient(60% 60% at 10% 90%, rgb(56 189 248 / 0.20) 0%, transparent 70%);
  --glow: 0 0 0 1px rgb(47 224 194 / 0.45), 0 0 24px 2px rgb(47 224 194 / 0.35);
  --confetti: #2fe0c2, #c4b5fd, #f0abfc, #6d4cf0;

  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 450ms;
}
```

## Look 2: Candy

**Charakter:** Helle Pastelltöne wie Bubblegum, Zitrone, Mint und Flieder. Dicke runde Formen, farbige «Bonbon»-Schatten und Überschriften mit Charakter machen gute Laune.

**Schriften:** Überschrift `Fredoka Variable` (rund, verspielt), Text `Nunito Variable` (rund, freundlich). Paket: `@fontsource-variable/fredoka`, `@fontsource-variable/nunito`.

**Hintergrund:** Vier Pastell-Flecken (Rosa, Zitrone, Mint, Flieder) als `radial-gradient`, weichgezeichnet und langsam bewegt. Bei reduzierter Bewegung steht er still.

**Typische Klassen:** Karten `glass rounded-2xl border-2 shadow-card`, Hover `hover:-translate-y-1 hover:rotate-[-0.5deg] hover:shadow-pop`. (Die Drehung ist die einzige erlaubte Ausnahme mit `[…]`, nur in Candy.)

```css
/* ==========================================================================
   LOOK 2: CANDY
   ========================================================================== */
[data-look='candy'] {
  color-scheme: light;
  --radius: 1.5rem;

  --background: #fff6fb;
  --foreground: #3a1748;
  --card: rgb(255 255 255 / 0.88);
  --card-foreground: #3a1748;
  --popover: #ffffff;
  --popover-foreground: #3a1748;
  --primary: #d6247e;
  --primary-foreground: #ffffff;
  --secondary: #fff1a8;
  --secondary-foreground: #3a1748;
  --muted: #fbe7f3;
  --muted-foreground: #75507f;
  --accent: #9ef0cf;
  --accent-foreground: #3a1748;
  --destructive: #c8213f;
  --destructive-foreground: #ffffff;
  --success: #0a6249;
  --border: #f3c6e0;
  --input: #ebb4d4;
  --ring: #9333ea;
  --chart-1: #d6247e;
  --chart-2: #9ef0cf;
  --chart-3: #fff1a8;
  --chart-4: #dcc6ff;
  --chart-5: #ff9ecd;

  --gradient-hero: linear-gradient(100deg, #a3105a 0%, #7322b8 50%, #0a6249 100%);
  --gradient-card: linear-gradient(145deg, #ffffff 0%, #fff4fa 100%);
  --gradient-mesh:
    radial-gradient(40% 50% at 15% 15%, rgb(255 158 205 / 0.55) 0%, transparent 70%),
    radial-gradient(45% 55% at 85% 10%, rgb(255 241 168 / 0.70) 0%, transparent 70%),
    radial-gradient(50% 60% at 80% 85%, rgb(158 240 207 / 0.55) 0%, transparent 70%),
    radial-gradient(55% 60% at 10% 90%, rgb(220 198 255 / 0.55) 0%, transparent 70%);
  --glow: 0 0 0 3px #ffffff, 0 0 0 6px rgb(214 36 126 / 0.45);
  --confetti: #ff9ecd, #fff1a8, #9ef0cf, #dcc6ff, #d6247e;

  --font-heading: 'Fredoka Variable', ui-rounded, system-ui, sans-serif;
  --font-sans: 'Nunito Variable', ui-rounded, system-ui, sans-serif;
  --shadow-card: 0 6px 0 0 #f3c6e0, 0 14px 28px -10px rgb(214 36 126 / 0.30);
  --shadow-pop: 0 8px 0 0 #9ef0cf, 0 22px 40px -12px rgb(115 34 184 / 0.35);
  --blur-glass: 8px;
  --ease-spring: cubic-bezier(0.3, 1.8, 0.5, 1);

  --duration-fast: 160ms;
  --duration-base: 280ms;
  --duration-slow: 520ms;
}
```

## Look 3: Neon (Matrix)

**Charakter:** Wie der Film «The Matrix» (1999): schwarzer Bildschirm, phosphorgrüner Code, der in Spalten von oben nach unten regnet. Jede Spalte hat einen hell leuchtenden Kopf und eine grüne Spur, die langsam verglimmt. Alles in Monospace-Schrift wie auf einem alten Terminal, die Hero-Überschrift leuchtet grün und endet mit einem blinkenden Cursor `_`. Löschen ist die «rote Pille».

**Schriften:** Überschrift und Text `JetBrains Mono Variable` (Terminal-Schrift, sehr gut lesbar). Paket: `@fontsource-variable/jetbrains-mono`. Die Zeichen im Regen sind halbbreite Katakana und Ziffern wie im Film, sie kommen aus der Systemschrift.

**Hintergrund:** Ganz unten ein schwacher grüner Schimmer (`--gradient-mesh`, langsam bewegt). Darüber der **Zeichenregen** als Canvas (Rezept 10), darüber feine grüne Scanlines (`body::after`). Der Regen ist bewusst gedämpft (`--rain-opacity: 0.18`), damit Text, der direkt darauf steht, noch 4.5:1 erreicht. Bei reduzierter Bewegung zeigt der Regen ein Standbild und der Schimmer steht still.

**Typische Klassen:** Karten `glass rounded-lg border shadow-card`, Hover `hover:glow`, Zahlen `font-mono`.

```css
/* ==========================================================================
   LOOK 3: NEON (Matrix)
   ========================================================================== */
[data-look='neon'] {
  color-scheme: dark;
  --radius: 0.25rem;

  --background: #020a04;
  --foreground: #d4ffdc;
  --card: rgb(3 20 10 / 0.85);
  --card-foreground: #d4ffdc;
  --popover: #03140a;
  --popover-foreground: #d4ffdc;
  --primary: #00ff41;
  --primary-foreground: #001a07;
  --secondary: #0b2a14;
  --secondary-foreground: #d4ffdc;
  --muted: #03140a;
  --muted-foreground: #8ccf9a;
  --accent: #ccffd5;
  --accent-foreground: #00230a;
  --destructive: #d4113a;
  --destructive-foreground: #ffffff;
  --success: #00ff41;
  --border: rgb(0 255 65 / 0.25);
  --input: rgb(0 255 65 / 0.35);
  --ring: #00ff41;
  --chart-1: #00ff41;
  --chart-2: #008f11;
  --chart-3: #ccffd5;
  --chart-4: #39ff14;
  --chart-5: #d4113a;

  --gradient-hero: linear-gradient(180deg, #ccffd5 0%, #00ff41 100%);
  --gradient-card: linear-gradient(180deg, rgb(0 255 65 / 0.06) 0%, rgb(0 255 65 / 0.01) 100%);
  --gradient-mesh:
    radial-gradient(60% 40% at 50% 0%, rgb(0 255 65 / 0.16) 0%, transparent 70%),
    radial-gradient(40% 50% at 10% 85%, rgb(0 143 17 / 0.18) 0%, transparent 70%),
    radial-gradient(45% 55% at 90% 80%, rgb(0 255 65 / 0.10) 0%, transparent 70%);
  --glow: 0 0 0 1px rgb(0 255 65 / 0.7), 0 0 14px 1px rgb(0 255 65 / 0.5), 0 0 36px 4px rgb(0 255 65 / 0.2);
  --confetti: #00ff41, #39ff14, #ccffd5, #008f11;

  /* Zeichenregen (Rezept 10): Spur, leuchtender Kopf, Deckkraft des Canvas */
  --rain: #00ff41;
  --rain-head: #ccffd5;
  --rain-opacity: 0.18;

  --font-heading: 'JetBrains Mono Variable', ui-monospace, monospace;
  --font-sans: 'JetBrains Mono Variable', ui-monospace, monospace;
  --font-mono: 'JetBrains Mono Variable', ui-monospace, monospace;
  --shadow-card: 0 0 0 1px rgb(0 255 65 / 0.22), 0 10px 30px -12px rgb(0 0 0 / 0.9);
  --shadow-pop: 0 0 0 1px rgb(0 255 65 / 0.6), 0 0 24px 2px rgb(0 255 65 / 0.3);
  --blur-glass: 6px;
  --ease-spring: cubic-bezier(0.5, 1.6, 0.4, 1);

  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 380ms;
}
```

## Gemeinsamer Teil (alle Looks)

Diese Blöcke stehen einmal in `src/index.css` und gelten für alle Looks: Theme-Zuordnung, Schriften, Bewegung, Hintergrund-Animation, Fokus, reduzierte Bewegung und die eigenen Klassen (`glass`, `glow`, `text-gradient`, `bg-gradient-hero`, `transition-look`). Dazu die Matrix-Teile, die nur im Look `neon` greifen: grüne Scanlines, Klasse `matrix-rain` für das Canvas, grünes Leuchten und blinkender Cursor an der `h1`. Der vollständige Inhalt steht in docs/STACK.md unter `src/index.css`.

## Kontrast-Prüfung

Gerechnet nach WCAG 2.2 (relative Leuchtdichte). Halbtransparente Flächen sind auf die hellste Stelle des Hintergrund-Verlaufs gemischt gerechnet (schlechtester Fall). Ziel: mindestens 4.5:1.

| Look   | Paar | Vordergrund | Hintergrund | Verhältnis | AA |
| ------ | ---- | ----------- | ----------- | ---------- | -- |
| Aurora | Text / Hintergrund | `#f5f3ff` | `#0c0a24` | 17.7:1 | ja |
| Aurora | Text / hellste Verlaufsstelle | `#f5f3ff` | `#18555b` | 7.7:1 | ja |
| Aurora | Text / Karte (über Verlauf) | `#f5f3ff` | `#1c3050` | 12.1:1 | ja |
| Aurora | Nebentext / Hintergrund | `#b9b3e6` | `#0c0a24` | 9.8:1 | ja |
| Aurora | Nebentext / Karte | `#b9b3e6` | `#1c3050` | 6.7:1 | ja |
| Aurora | Primärknopf | `#ffffff` | `#6d4cf0` | 5.3:1 | ja |
| Aurora | Verlaufstext #c4b5fd / Verlaufsstelle | `#c4b5fd` | `#18555b` | 4.6:1 | ja |
| Aurora | Verlaufstext #2fe0c2 / Verlaufsstelle | `#2fe0c2` | `#18555b` | 5.0:1 | ja |
| Aurora | Verlaufstext #f0abfc / Verlaufsstelle | `#f0abfc` | `#18555b` | 4.8:1 | ja |
| Candy | Text / Hintergrund | `#3a1748` | `#fff6fb` | 14.2:1 | ja |
| Candy | Text / hellste Verlaufsstelle | `#3a1748` | `#ecdcfd` | 11.6:1 | ja |
| Candy | Text / Karte (über Verlauf) | `#3a1748` | `#fdfbff` | 14.6:1 | ja |
| Candy | Nebentext / Hintergrund | `#75507f` | `#fff6fb` | 6.2:1 | ja |
| Candy | Nebentext / Karte | `#75507f` | `#fdfbff` | 6.4:1 | ja |
| Candy | Primärknopf | `#ffffff` | `#d6247e` | 4.8:1 | ja |
| Candy | Verlaufstext #a3105a / Verlaufsstelle | `#a3105a` | `#ecdcfd` | 5.8:1 | ja |
| Candy | Verlaufstext #7322b8 / Verlaufsstelle | `#7322b8` | `#ecdcfd` | 6.1:1 | ja |
| Candy | Verlaufstext #0a6249 / Verlaufsstelle | `#0a6249` | `#ecdcfd` | 5.7:1 | ja |
| Neon | Text / Hintergrund | `#d4ffdc` | `#020a04` | 18.3:1 | ja |
| Neon | Text / hellste Verlaufsstelle | `#d4ffdc` | `#02310e` | 13.2:1 | ja |
| Neon | Text / Regen-Kopf über Verlauf | `#d4ffdc` | `#265632` | 7.8:1 | ja |
| Neon | Text / Karte (über Regen-Kopf) | `#d4ffdc` | `#081e10` | 15.9:1 | ja |
| Neon | Nebentext / Hintergrund | `#8ccf9a` | `#020a04` | 11.0:1 | ja |
| Neon | Nebentext / Regen-Kopf über Verlauf | `#8ccf9a` | `#265632` | 4.7:1 | ja |
| Neon | Nebentext / Karte | `#8ccf9a` | `#081e10` | 9.6:1 | ja |
| Neon | Primärknopf | `#001a07` | `#00ff41` | 13.4:1 | ja |
| Neon | Checkbox erledigt (Akzent) | `#00230a` | `#ccffd5` | 15.1:1 | ja |
| Neon | Löschen («rote Pille») | `#ffffff` | `#d4113a` | 5.3:1 | ja |
| Neon | Verlaufstext #ccffd5 / Regen-Kopf | `#ccffd5` | `#265632` | 7.7:1 | ja |
| Neon | Verlaufstext #00ff41 / Regen-Kopf | `#00ff41` | `#265632` | 6.3:1 | ja |

Neon: «Regen-Kopf» ist der hellste Pixel des Zeichenregens (`--rain-head` mit `--rain-opacity` 0.18) über der hellsten Verlaufsstelle. Wer `--rain-opacity` erhöht, macht den Regen kräftiger, aber der Nebentext fällt dann unter 4.5:1 (bei 0.20 nur noch 4.4:1).

Nicht als Textfarbe zugelassen (nur als Fläche mit eigenem `*-foreground`): Aurora `#6d4cf0` (3.6:1) und `#d9264f` (4.0:1), Candy `#d6247e` (4.5:1, knapp), Neon `#d4113a` (3.8:1).

---

## Rezepte (gelten in allen Looks)

Jedes Rezept nennt Klassen und Verhalten. Der Agent übernimmt sie so.

### 1. App-Rahmen

- Seite: `<main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-16">`. In Bau 2 (Board): `max-w-6xl`.
- Kopf (`<header className="flex items-center justify-between gap-6">`):
  - Links: `<h1 className="text-gradient font-heading text-5xl font-bold tracking-tight sm:text-6xl">Meine Aufgaben</h1>` und darunter das Datum: `<p className="mt-2 text-muted-foreground">` mit `new Intl.DateTimeFormat('de-CH', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())`, z. B. «Dienstag, 10. November».
  - Rechts: **Fortschrittsring** `ProgressRing` (eigene Komponente in `src/components/ProgressRing.tsx`):
    - SVG 72 × 72, zwei Kreise mit `r=30`, `strokeWidth=8`, `fill="none"`. Hintergrundkreis `className="stroke-muted"`, Vordergrundkreis `className="stroke-accent"` mit `strokeLinecap="round"`, um −90° gedreht.
    - Fortschritt über `strokeDasharray = 2π·30` und `strokeDashoffset = umfang · (1 − erledigt/gesamt)`.
    - Animation mit motion: `<motion.circle animate={{ strokeDashoffset }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />`.
    - In der Mitte `font-mono text-sm font-semibold`: «3/5».
    - `role="img"` und `aria-label="3 von 5 erledigt"`.
    - Bei 0 Aufgaben: Ring leer, Text «0/0».
- `App.tsx` umschliesst alles mit `<MotionConfig reducedMotion="user">`, `<TooltipProvider>` und rendert einmal `<Toaster position="bottom-center" richColors closeButton />`.
- `App.tsx` rendert einmal `<MatrixRain />` (Rezept 10) als erstes Kind in `<MotionConfig>`, vor `<main>`. Es ist in allen Looks im DOM, sichtbar und aktiv aber nur im Look `neon`.

### 2. Eingabe (TaskInput)

- Form: `<form className="glass flex items-center gap-2 rounded-2xl border p-2 shadow-card">`.
- Feld: shadcn `<Input>` mit `className="h-14 flex-1 border-0 bg-transparent px-4 text-lg shadow-none focus-visible:ring-0"`, `placeholder="Was steht an?"`, `aria-label="Neue Aufgabe"`, `maxLength={200}`.
- Knopf: shadcn `<Button type="submit" size="icon" className="size-12 rounded-xl bg-primary text-primary-foreground transition-look hover:scale-105 active:scale-95" aria-label="Aufgabe hinzufügen">` mit `<Plus className="size-6" />` aus lucide-react.
- Enter fügt hinzu (normales `onSubmit` des Formulars, `event.preventDefault()`).
- Text wird mit `trim()` bereinigt. Ist er leer: nichts hinzufügen, das Formular bekommt kurz `animate-shake` (Klasse setzen, nach `onAnimationEnd` wieder entfernen), Fokus bleibt im Feld.
- Nach dem Hinzufügen: Feld leeren, Fokus bleibt im Feld.
- Mehr als 200 Zeichen sind durch `maxLength` und zusätzlich im Model (`title.slice(0, 200)`) verhindert.

### 3. TaskCard

- Grundform: `<motion.li layout className="group glass flex items-start gap-3 rounded-xl border p-4 shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop focus-within:glow">`.
- **Abhaken:** shadcn `<Checkbox>` mit `className="mt-0.5 size-6 rounded-md transition-look data-[state=checked]:animate-pop data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"` und `aria-label={\`«${title}» erledigt\`}`. Der Selektor `data-[state=checked]` ist erlaubt, er ist kein Farbwert.
- **Text:** `<span className="relative flex-1 break-words [overflow-wrap:anywhere] text-base leading-relaxed">`. Erledigt: `text-muted-foreground`. Die Durchstreichung ist eine Linie, die von links wächst:
  ```tsx
  <motion.span
    aria-hidden
    className="absolute left-0 top-1/2 h-0.5 w-full origin-left bg-current"
    initial={false}
    animate={{ scaleX: done ? 1 : 0 }}
    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  />
  ```
- **Konfetti beim Abhaken** (nur von offen nach erledigt): `canvas-confetti` mit `{ particleCount: 40, spread: 60, startVelocity: 25, scalar: 0.8, ticks: 120, colors: readConfettiColors(), origin }`. `origin` ist die Mitte der Checkbox, umgerechnet in Anteile des Fensters. Kein Konfetti, wenn `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. Der Aufruf liegt in `src/lib/celebrate.ts`, damit man ihn im Test ersetzen kann. Nur für die Looks `aurora` und `candy`; im Look `neon` kommt stattdessen die Bullet Time (nächster Punkt).
- **Bullet Time (nur Look neon):** Beim Abhaken (nur von offen nach erledigt) fliegt eine kleine leuchtende Kugel in Zeitlupe von links nach rechts über den Text und zieht die Durchstreich-Linie als Spur hinter sich her. Zwei durchsichtige Luftringe um die Kugel dehnen sich aus und verblassen, wie im Film.
  - Dauer im Look neon 0.9 s (Ease aus `--ease-out-soft`), danach verschwindet die Kugel. Andere Looks: Linie 0.3 s wie bisher.
  - Kein Konfetti im Look neon. Aurora und Candy behalten Konfetti.
  - Bei «Bewegung reduzieren»: Linie sofort da, keine Kugel.
  - Kugel und Ringe nur über Tokens (`--foreground`, `--primary`, `--glow`), Aussehen und Ring-Animation als Klasse in `src/index.css`, nur im Look neon sichtbar.
  - Bugfix: Die Durchstreich-Linie wird immer gerendert und animiert `scaleX` von 0 auf 1 (heute erscheint sie wegen `initial={false}` ohne Animation).
- **Löschen:** Knopf `<Button variant="ghost" size="icon" aria-label={\`«${title}» löschen\`} className="opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100">` mit `<Trash2 className="size-4" />`. Nach dem Löschen: `toast('Aufgabe gelöscht', { action: { label: 'Rückgängig', onClick: restore }, duration: 5000 })` aus sonner. «Rückgängig» stellt die Aufgabe an der alten Stelle wieder her.

### 4. Listen-Animationen (motion)

- Liste: `<ul className="flex flex-col gap-3">` mit `<AnimatePresence initial={false} mode="popLayout">`.
- Jede Karte ist `motion.li` mit:
  ```tsx
  layout
  initial={{ opacity: 0, y: -12, scale: 0.96 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
  ```
- Neue Aufgaben erscheinen oben. Umsortieren (z. B. erledigte nach unten) gleitet dank `layout`.
- Import immer aus `motion/react`: `import { AnimatePresence, motion } from 'motion/react'`.

### 5. Leerer Zustand (EmptyState)

- `<div className="glass flex flex-col items-center gap-4 rounded-2xl border border-dashed p-10 text-center">`.
- Darin eine kleine Inline-SVG (120 × 120, `aria-hidden`), Farben nur über `className="fill-accent"`, `stroke-primary` usw. Je Look ein Motiv, ausgewählt über das Attribut `data-look` mit Tailwind-Varianten oder einfach alle drei SVGs rendern und per CSS zeigen:
  - Aurora: Mond mit drei Sternen (`<circle>`, `<path>`), Sterne blinken sanft (`animate-pulse`).
  - Candy: lächelnde Wolke (`<path>` rund, zwei Punkte als Augen, Bogen als Mund).
  - Neon (Matrix): Terminal-Fenster. Rahmen als `<rect>` mit `className="fill-none stroke-primary"`, Prompt `>` als `<polyline>` mit `className="fill-none stroke-primary"`, Cursor als kleines `<rect>` mit `className="fill-primary animate-blink"`.
  - Sichtbarkeit: `<svg className="hidden [[data-look=aurora]_&]:block">`. Diese drei Selektoren sind als Ausnahme erlaubt.
- Text: `<p className="font-heading text-xl">Alles erledigt. Zeit für Kaffee.</p>` und `<p className="text-muted-foreground">Tippe oben eine neue Aufgabe ein oder drücke N.</p>`.

### 6. Board (Bau 2)

- Raster: `<div className="grid grid-cols-1 gap-4 md:grid-cols-3">`. Auf Handys siehe Rezept 8.
- Spalten in dieser Reihenfolge: «Offen» (`todo`), «In Arbeit» (`doing`), «Erledigt» (`done`).
- Spalte: `<section aria-labelledby={id} className="glass flex min-h-64 flex-col gap-3 rounded-2xl border p-3 transition-look">`. Kopf: `<h2 className="font-heading text-lg">` plus shadcn `<Badge variant="secondary" className="font-mono">{count}</Badge>`.
- **Drag and Drop** mit `@dnd-kit/core` und `@dnd-kit/sortable`:
  - `DndContext` mit `sensors={useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))}` und `collisionDetection={closestCorners}`.
  - Jede Spalte ist `useDroppable({ id: status })` und `SortableContext` mit `verticalListSortingStrategy`.
  - Karte: `useSortable({ id })`, Stil mit `CSS.Transform.toString(transform)` aus `@dnd-kit/utilities`. Während des Ziehens: `opacity-50`.
  - **Spalte beim Darüberziehen:** `isOver` → Klassen `glow scale-[1.01]` (Ausnahme erlaubt). Leere Spalte zeigt einen Drop-Bereich `rounded-xl border-2 border-dashed border-ring/60 p-6 text-center text-muted-foreground` mit «Hierher ziehen».
  - `DragOverlay` zeigt die gezogene Karte mit `shadow-pop rotate-2`.
  - Die Logik (Status ändern, Reihenfolge) liegt in `model.ts` als reine Funktion `moveTask(tasks, id, toStatus, toIndex)` mit Test.
  - Tastatur: Leertaste greift, Pfeiltasten bewegen, Leertaste legt ab, Esc bricht ab. Für Screenreader deutsche Ansagen über `accessibility={{ announcements }}`.
- Konfetti, wenn eine Karte in «Erledigt» landet (gleiche Regeln wie Rezept 3).

### 7. Lange Texte

- Jeder Text in Karten: `break-words [overflow-wrap:anywhere]` (Ausnahme erlaubt, sie ist kein Farbwert). Nichts läuft aus der Karte, auch nicht ein Wort mit 200 Zeichen ohne Leerzeichen.
- Karten haben `min-w-0`, damit Flex-Elemente schrumpfen dürfen.

### 8. Mobil (ab 360 px)

- Liste: eine Spalte, `px-4`, Hero `text-4xl` statt `text-5xl` (`text-4xl sm:text-6xl`).
- Board unter `md`: `<div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible">`, jede Spalte `w-[85vw] shrink-0 snap-center md:w-auto` (Ausnahme erlaubt).
- Antippbare Flächen mindestens 44 × 44 px (`size-11` oder grösser).

### 9. Tastatur

- **N** fokussiert die Eingabe, ausser der Fokus ist schon in einem Eingabefeld. Umsetzung als Hook `src/lib/useHotkey.ts` (`keydown` auf `window`, prüft `event.target` auf `input`, `textarea`, `[contenteditable]`).
- **Esc** leert die Eingabe und nimmt den Fokus weg. Beim Ziehen bricht Esc ab (dnd-kit macht das).
- Fokus-Ring im Look: kommt global aus `:focus-visible` (`outline: 2px solid var(--ring)`). Nie `outline-none` ohne Ersatz.
- Reihenfolge mit Tab: Eingabe → Plus → je Karte Checkbox → Löschen.

### 10. Zeichenregen (nur Look Neon)

- Eigene Komponente `src/components/MatrixRain.tsx`, Test `src/components/MatrixRain.test.tsx`. Keine neuen Pakete, nur Canvas.
- Ein `<canvas aria-hidden className="matrix-rain">`. Position, Ebene, Deckkraft und Sichtbarkeit kommen aus der Klasse `matrix-rain` in `src/index.css` (nur im Look `neon` sichtbar). Keine weiteren Klassen.
- Farben und Schrift liest die Komponente bei jedem Schritt aus den CSS-Variablen (`--rain`, `--rain-head`, `--font-mono`), nie Hex-Werte in TypeScript.
- Ablauf: 20 Schritte pro Sekunde. Pro Schritt verglimmt alles ein wenig (`destination-out`), jede Spalte rückt eine Zeile nach unten, der alte Kopf wird grüne Spur, der neue Kopf leuchtet hell. Unten angekommen, startet die Spalte zufällig wieder oben.
- Ist der Look nicht `neon`, macht die Schleife nichts. Bei «Bewegung reduzieren» läuft keine Schleife, sondern es wird ein Standbild gezeichnet (80 Schritte auf einmal).
- Liefert `getContext('2d')` `null` (so im Test-Setup), macht die Komponente nichts und stürzt nicht ab.
- Code wörtlich übernehmen:

```tsx
// src/components/MatrixRain.tsx
import { useEffect, useRef } from 'react'
import { readCssVar } from '@/lib/theme'

const GLYPHS = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789'
const FONT_SIZE = 16
const STEP_MS = 50
const FADE = 0.08

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

export function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let drops: number[] = []
    let frame = 0
    let last = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const columns = Math.ceil(window.innerWidth / FONT_SIZE)
      drops = Array.from({ length: columns }, () => -Math.floor(Math.random() * 50))
    }

    const step = () => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.globalAlpha = FADE
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.font = `${FONT_SIZE}px ${readCssVar('--font-mono')}`
      ctx.textBaseline = 'top'
      const rain = readCssVar('--rain')
      const head = readCssVar('--rain-head')

      drops.forEach((row, i) => {
        if (row < 0) {
          drops[i] = row + 1
          return
        }
        const x = i * FONT_SIZE
        const y = row * FONT_SIZE
        ctx.clearRect(x, y - FONT_SIZE, FONT_SIZE, FONT_SIZE)
        ctx.fillStyle = rain
        ctx.fillText(randomGlyph(), x, y - FONT_SIZE)
        ctx.fillStyle = head
        ctx.fillText(randomGlyph(), x, y)
        drops[i] = y > window.innerHeight && Math.random() > 0.975 ? 0 : row + 1
      })
    }

    const still = () => {
      for (let i = 0; i < 80; i++) step()
    }

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop)
      if (document.documentElement.dataset.look !== 'neon') return
      if (time - last < STEP_MS) return
      last = time
      step()
    }

    const onResize = () => {
      resize()
      if (reduced) still()
    }

    onResize()
    if (!reduced) frame = requestAnimationFrame(loop)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="matrix-rain" />
}
```

- Test (zuerst schreiben, rot zeigen):

```tsx
// src/components/MatrixRain.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MatrixRain } from './MatrixRain'

describe('MatrixRain', () => {
  it('renders a decorative canvas without crashing', () => {
    document.documentElement.dataset.look = 'neon'
    const { container } = render(<MatrixRain />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(canvas).toHaveClass('matrix-rain')
  })
})
```

---

## Wow-Checkliste

`/review` fragt diese 10 Punkte ab. Jeder Punkt braucht einen Beleg (Test oder Klick-Anleitung).

1. Der animierte Hintergrund-Verlauf bewegt sich sichtbar und steht bei «Bewegung reduzieren» still. Im Look Neon regnet zusätzlich grüner Code über den Bildschirm (Rezept 10), bei «Bewegung reduzieren» als Standbild.
2. Die Hero-Überschrift hat Verlaufstext in der Schrift des Looks.
3. Der Fortschrittsring zeigt erledigt/gesamt und federt bei jeder Änderung.
4. Leere Eingabe schüttelt das Feld und fügt nichts hinzu.
5. Neue Karten gleiten herein, gelöschte gleiten hinaus, nichts springt.
6. Abhaken: Checkbox federt, Text wird animiert durchgestrichen, in Aurora und Candy dezentes Konfetti in Look-Farben, im Look neon Bullet Time statt Konfetti.
7. Löschen zeigt einen Toast mit «Rückgängig», und Rückgängig funktioniert.
8. Der leere Zustand zeigt die Illustration des Looks und einen freundlichen Satz.
9. Karten heben sich beim Hover an, Fokus ist überall sichtbar im Look, «N» fokussiert die Eingabe.
10. Bei 360 px Breite läuft nichts aus dem Bild, auch nicht ein Titel mit 200 Zeichen.
