# TASKS: Bauschritte

Diese Datei füllt /plan. /task arbeitet sie von oben nach unten ab und hakt jeden Task ab.
Ein Beispiel mit allen 6 Tasks von Bau 1 steht in docs/PROMPTS.md unter «Beispiel: die 6 Tasks von Bau 1».

Format je Task:

```text
[ ] N  Titel
- Ziel: Ein Satz, was danach sichtbar oder möglich ist.
- Dateien: Genau die Dateien, die geändert werden dürfen.
- Test zuerst: Welcher Test zuerst rot sein muss.
- Fertig wenn: Prüfbares Ergebnis plus «npm run check grün».
```

## Tasks

[x] 1  Projekt einrichten
- Ziel: Leerer App-Rahmen im Look Neon (Matrix) läuft unter http://localhost:5173/hwz-todo/.
- Dateien: alle aus docs/STACK.md «Dateien für Task 1», plus src/components/ui/*, plus src/components/MatrixRain.tsx.
- Test zuerst: src/App.test.tsx (kommt mit Task 1, siehe STACK.md).
- Fertig wenn: npm run check grün, Hero-Überschrift sichtbar, Matrix-Hintergrund läuft.

[x] 2  Datenmodell und Store mit Tests
- Ziel: Aufgaben lassen sich anlegen, abhaken, löschen und im localStorage speichern, noch ohne Oberfläche.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts.
- Test zuerst: addTask ignoriert leeren Titel und kürzt auf 200 Zeichen; loadState gibt bei kaputtem JSON eine leere Liste zurück.
- Fertig wenn: alle Model- und Storage-Tests grün; Kriterien «Leere Eingabe», «200 Zeichen», «Neu laden» abgedeckt; npm run check grün.

[x] 3  Liste anzeigen
- Ziel: Gespeicherte Aufgaben erscheinen als TaskCards mit Listen-Animation, erledigte gleiten nach unten.
- Dateien: src/features/tasks/components/TaskList.tsx, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/App.tsx.
- Test zuerst: TaskList zeigt zwei Aufgaben aus dem localStorage nach dem Rendern an; eine erledigte steht nach einer offenen.
- Fertig wenn: Aufgaben sichtbar, erledigte nach unten sortiert (DESIGN.md, Rezepte 3, 4, 7); Kriterium «Erledigte gleiten nach unten» abgedeckt; npm run check grün.

[x] 4  Aufgabe hinzufügen
- Ziel: Neue Aufgabe per Enter oder Plus-Knopf, leere Eingabe schüttelt; Eingabefeld oben, darunter die Liste.
- Dateien: src/features/tasks/components/TaskInput.tsx, src/features/tasks/components/TaskInput.test.tsx, src/lib/useHotkey.ts, src/App.tsx.
- Test zuerst: Tippen + Enter zeigt die Aufgabe; Enter bei leerem Feld fügt nichts hinzu; «N» fokussiert das Feld.
- Fertig wenn: DESIGN.md, Rezepte 2 und 9 erfüllt; Kriterien «Leere Eingabe», «200 Zeichen» abgedeckt; npm run check grün.

[x] 5  Abhaken und löschen
- Ziel: Abhaken mit Federn, Durchstreichen und Konfetti; Löschen mit Toast «Rückgängig».
- Dateien: src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/lib/celebrate.ts, src/lib/theme.ts.
- Test zuerst: Klick auf Checkbox setzt done und ruft celebrate auf; Löschen und «Rückgängig» stellt die Aufgabe wieder her.
- Fertig wenn: DESIGN.md, Rezept 3 erfüllt; Kriterien «Abhaken», «Löschen mit Rückgängig» abgedeckt; Zustand bleibt nach Neuladen; npm run check grün.

[x] 6  Zähler und leerer Zustand
- Ziel: Fortschrittsring zeigt erledigt/gesamt; ohne Aufgaben erscheint die Illustration des Looks; alles passt bei 360 px.
- Dateien: src/components/ProgressRing.tsx, src/components/ProgressRing.test.tsx, src/features/tasks/components/EmptyState.tsx, src/App.tsx.
- Test zuerst: Ring hat aria-label «1 von 2 erledigt»; leere Liste zeigt «Alles erledigt. Zeit für Kaffee.».
- Fertig wenn: DESIGN.md, Rezepte 1 und 5 erfüllt; Kriterien «Fortschrittsring», «Leerer Zustand», «Schmales Fenster» abgedeckt; npm run check grün.

[x] 7  Bullet Time beim Abhaken
- Ziel: Beim Abhaken im Look neon fliegt eine kleine leuchtende Kugel mit Luftringen in Zeitlupe von links nach rechts über den Text und zieht die Durchstreich-Linie als Spur, statt Konfetti.
- Dateien: src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/lib/celebrate.ts, src/index.css, docs/STACK.md (gleiche CSS wie in index.css).
- Test zuerst: Im Look neon ruft Abhaken celebrate nicht auf und rendert ein Element mit der Kugel-Klasse; im Look aurora wird celebrate aufgerufen.
- Fertig wenn: DESIGN.md Rezept 3 erfüllt (Bullet Time im Look neon, Bugfix Durchstreich-Linie ohne initial={false}), npm run check grün.
