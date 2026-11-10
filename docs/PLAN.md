# PLAN: Wie die App gebaut wird

Diese Datei füllt /plan aus docs/SPEC.md.

## Stack

Siehe docs/STACK.md. Keine Abweichungen.

## Ordner und Dateien

- `src/lib/storage.ts`: localStorage lesen, schreiben, migrieren (`hwz-todo`, Version 1).
- `src/lib/celebrate.ts`: Konfetti beim Abhaken, über CSS-Variablen des Looks, ersetzbar im Test.
- `src/lib/theme.ts`: Look-Farben aus den CSS-Variablen lesen (für Konfetti).
- `src/lib/useHotkey.ts`: «N» fokussiert die Eingabe, «Esc» leert sie.
- `src/features/tasks/model.ts`: Typ Task und reine Funktionen addTask, toggleTask, removeTask.
- `src/features/tasks/useTasks.ts`: Hook, verbindet model.ts mit storage.ts.
- `src/features/tasks/components/TaskInput.tsx`: Eingabefeld mit Plus-Knopf.
- `src/features/tasks/components/TaskCard.tsx`: eine Aufgabe mit Checkbox, Text, Löschen.
- `src/features/tasks/components/TaskList.tsx`: Liste mit Animations, erledigte gleiten nach unten.
- `src/features/tasks/components/EmptyState.tsx`: Illustration des Looks ohne Aufgaben.
- `src/components/ProgressRing.tsx`: Fortschrittsring erledigt/gesamt im Kopf.
- `src/components/MatrixRain.tsx`: Zeichenregen-Hintergrund des Neon/Matrix-Looks (aus STACK.md).
- `src/App.tsx`: Rahmen mit Kopf, Eingabe und Liste; erledigte nach unten sortiert.
- Jeweils `*.test.ts(x)` neben jeder neuen Datei ausser App-Rahmen-Rauchtest.

## Datenmodell

```ts
export type Task = {
  id: string // crypto.randomUUID()
  title: string // getrimmt, 1 bis 200 Zeichen
  done: boolean
  createdAt: number // Date.now()
}
```

`localStorage "hwz-todo" = { version: 1, tasks: Task[] }`. Version 1, keine Migration nötig.

## Komponenten

- TaskInput: Eingabefeld mit Plus-Knopf, leere Eingabe schüttelt (DESIGN.md, Rezept 2).
- TaskCard: Checkbox, animierte Durchstreichung, Konfetti, Löschen mit «Rückgängig» (Rezept 3).
- TaskList: Liste mit `AnimatePresence`, neue oben, erledigte gleiten nach unten (Rezept 4).
- EmptyState: Illustration des Looks plus freundlicher Satz (Rezept 5).
- ProgressRing: SVG-Ring mit Federn, aria-label «n von m erledigt» (Rezept 1).
- MatrixRain: Canvas-Zeichenregen, nur im Neon/Matrix-Look, still bei reduzierter Bewegung (STACK.md).

## Risiken

- Alte Daten im localStorage passen nicht zum Typ: `loadState` gibt bei kaputtem JSON leere Liste zurück, Migration mit Test (Regel 9).
- Konfetti ist im Test nicht verfügbar: Aufruf in `celebrate.ts` gekapselt und im Test ersetzt.
- Zeichenregen kostet Leistung und stört bei reduzierter Bewegung: nur im Neon-Look, `prefers-reduced-motion` respektieren.
