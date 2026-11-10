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
- Bau 2 (F2 Sprint-Ziel): `src/lib/storage.ts` (Version 3, `sprint`), `src/features/tasks/useTasks.ts` (Sprint beim Speichern behalten), `src/features/sprint/model.ts` (`daysLeftLabel`), `src/features/sprint/useSprint.ts` (lesen und speichern), `src/features/sprint/components/SprintGoal.tsx` (Anzeige und Bearbeiten), `src/App.tsx` (Sprint-Ziel über dem Board).
- Bau 2 (F1 Board): `src/lib/storage.ts` (Version 2, `migrateV1toV2`), `src/features/tasks/model.ts` (`status` statt `done`, `moveTask`), `src/features/tasks/useTasks.ts` (`move`), `src/features/tasks/components/Board.tsx` (drei Spalten mit Drag and Drop), `src/features/tasks/components/TaskCard.tsx` (Griff zum Ziehen), `src/App.tsx` (Board statt Liste, `max-w-6xl`).

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

Bau 2 (F1 Board):

```ts
export type TaskStatus = 'todo' | 'doing' | 'done'
export type Task = {
  id: string
  title: string
  status: TaskStatus // ersetzt done
  createdAt: number
}
```

`localStorage "hwz-todo" = { version: 2, tasks: Task[] }`. Migration `migrateV1toV2` (docs/STACK.md, «Datenhaltung»): `done: true` → `status: 'done'`, `done: false` → `status: 'todo'`. Die Reihenfolge im Array ist die Reihenfolge in den Spalten.

Bau 2 (F2 Sprint-Ziel): `{ version: 3, tasks: Task[], sprint: Sprint | null }` mit `type Sprint = { goal: string; endDate: string }` (Datum `YYYY-MM-DD`). Migration `migrateV2toV3`: `sprint: null` ergänzen, Aufgaben unverändert. Version 1 läuft über `migrateV1toV2` und dann `migrateV2toV3`.

## Komponenten

- TaskInput: Eingabefeld mit Plus-Knopf, leere Eingabe schüttelt (DESIGN.md, Rezept 2).
- TaskCard: Checkbox, animierte Durchstreichung, Konfetti, Löschen mit «Rückgängig» (Rezept 3).
- TaskList: Liste mit `AnimatePresence`, neue oben, erledigte gleiten nach unten (Rezept 4).
- EmptyState: Illustration des Looks plus freundlicher Satz (Rezept 5).
- ProgressRing: SVG-Ring mit Federn, aria-label «n von m erledigt» (Rezept 1).
- MatrixRain: Canvas-Zeichenregen, nur im Neon/Matrix-Look, still bei reduzierter Bewegung (STACK.md).
- Board: drei Spalten Offen, In Arbeit, Erledigt mit Zähler-Badge, Drag and Drop per Maus und Tastatur, Zielspalte leuchtet (Rezepte 6, 8). Landet eine Karte in Erledigt: Bullet Time (neon) bzw. Konfetti.
- SprintGoal: Satz mit «noch N Tage» oben am Board; Klick öffnet Feld für Satz und Datum, Enter speichert, Esc bricht ab (Rezepte 2 und 9, Klassen wie TaskInput).
- TaskCard: zusätzlich ein Griff (Tastatur: Leertaste greift) für das Ziehen im Board (Rezept 3, 6).

## Risiken

- Alte Daten im localStorage passen nicht zum Typ: `loadState` gibt bei kaputtem JSON leere Liste zurück, Migration mit Test (Regel 9).
- Konfetti ist im Test nicht verfügbar: Aufruf in `celebrate.ts` gekapselt und im Test ersetzt.
- Zeichenregen kostet Leistung und stört bei reduzierter Bewegung: nur im Neon-Look, `prefers-reduced-motion` respektieren.
- Bau 2: Drag and Drop lässt sich in jsdom kaum testen: Logik als reine Funktion `moveTask` mit Test, Ziehen per Klick-Anleitung prüfen.
- Bau 2: Leertaste auf der Checkbox startet versehentlich das Ziehen: Ziehen nur über einen eigenen Griff-Knopf.
