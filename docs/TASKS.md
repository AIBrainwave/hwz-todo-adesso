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

[x] 8  Migration mit Test
- Ziel: Aufgaben haben `status` ('todo' | 'doing' | 'done') statt `done`; gespeicherte Daten aus Version 1 werden beim Laden zu Version 2 migriert.
- Dateien: src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts, src/features/tasks/components/TaskCard.tsx, src/features/tasks/components/TaskCard.test.tsx, src/features/tasks/components/TaskList.tsx, src/features/tasks/components/TaskList.test.tsx, src/App.tsx.
- Test zuerst: loadState mit echten Daten im Format Version 1 liefert Version 2 mit `status: 'done'` bzw. `'todo'`; toggleTask wechselt zwischen 'todo' und 'done'.
- Fertig wenn: Kriterium «Migration» (F1, alte Aufgaben im richtigen Zustand) abgedeckt; Liste funktioniert wie bisher; npm run check grün.

[x] 9  moveTask mit Test
- Ziel: Eine reine Funktion verschiebt eine Aufgabe in eine Spalte an eine Stelle; der Hook bietet `move` an und speichert.
- Dateien: src/features/tasks/model.ts, src/features/tasks/model.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts.
- Test zuerst: moveTask(tasks, id, 'doing', 0) setzt den Status und stellt die Karte an Stelle 0 der Spalte; Verschieben innerhalb einer Spalte ändert die Reihenfolge; nach `move` steht der neue Zustand im localStorage.
- Fertig wenn: Kriterien «Spalte wechseln» und «Reihenfolge in der Spalte» (F1, Logik und Neuladen) abgedeckt; npm run check grün.

[x] 10  Board mit Drag and Drop
- Ziel: Statt der Liste zeigt die App drei Spalten Offen, In Arbeit, Erledigt; Karten lassen sich per Maus und Tastatur ziehen, die Zielspalte leuchtet, in Erledigt kommt der Abhak-Effekt des Looks.
- Dateien: src/features/tasks/components/Board.tsx, src/features/tasks/components/Board.test.tsx, src/features/tasks/components/TaskCard.tsx, src/App.tsx.
- Test zuerst: Board zeigt drei Spalten mit Überschrift und Zähler, jede Karte in der Spalte ihres Status, und jede Karte hat einen Griff «… verschieben».
- Fertig wenn: DESIGN.md Rezepte 6 und 8 erfüllt; Kriterien «Spalte wechseln», «Reihenfolge in der Spalte», «Abhak-Effekt in Erledigt» (F1) abgedeckt; npm run check grün.

[x] 11  Migration und Sprint-Logik mit Test
- Ziel: Der Speicher hat Version 3 mit `sprint`; alte Daten (Version 1 und 2) werden migriert; eine reine Funktion liefert «noch N Tage», «noch 1 Tag», «endet heute» oder «Sprint vorbei».
- Dateien: src/lib/storage.ts, src/lib/storage.test.ts, src/features/tasks/useTasks.ts, src/features/tasks/useTasks.test.ts, src/features/sprint/model.ts, src/features/sprint/model.test.ts.
- Test zuerst: loadState mit Version-2-Daten liefert Version 3 mit `sprint: null` und allen Aufgaben; daysLeftLabel('2026-11-13', heute 2026-11-10) ist «noch 3 Tage»; Speichern einer Aufgabe behält das Sprint-Ziel.
- Fertig wenn: Kriterien «Migration» und «endet heute / vorbei» (F2) abgedeckt; npm run check grün.

[x] 12  Sprint-Ziel anzeigen und bearbeiten
- Ziel: Über dem Board steht das Sprint-Ziel mit «noch N Tage»; Klick macht es bearbeitbar, Enter speichert, Esc bricht ab.
- Dateien: src/features/sprint/useSprint.ts, src/features/sprint/components/SprintGoal.tsx, src/features/sprint/components/SprintGoal.test.tsx, src/App.tsx.
- Test zuerst: Klick auf «Sprint-Ziel setzen», Satz und Datum eingeben, Enter zeigt den Satz und «noch … Tage» und speichert im localStorage; Esc verwirft eine Änderung.
- Fertig wenn: Kriterien «Setzen und Neuladen» und «Esc bricht ab» (F2) abgedeckt; per Tastatur bedienbar; npm run check grün.
