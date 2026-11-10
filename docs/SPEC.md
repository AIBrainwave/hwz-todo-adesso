# SPEC: Was die App können muss

Diese Datei füllt /spec. Ein ausgefülltes Beispiel steht in docs/PROMPTS.md unter «Beispiel einer SPEC».

## Ziel

Eine ToDo-App für mich: Aufgaben anlegen, abhaken und löschen.

## Muss

- Eingabefeld oben, darunter die Liste der Aufgaben; neue Aufgaben erscheinen oben.
- Aufgabe mit Titel anlegen (Enter oder Plus-Knopf).
- Aufgabe abhaken und wieder öffnen, mit Konfetti und animierter Durchstreichung; erledigte gleiten nach unten.
- Aufgabe löschen, mit «Rückgängig».
- Zähler «erledigt/gesamt» als Fortschrittsring.
- Ohne Aufgaben: eine freundliche Illustration des Looks.

## Look

Neon

## Nicht

- Kein Login, kein Server. Die Daten bleiben im Browser.
- Keine Termine oder Erinnerungen, nur die Liste.
- Kein Board mit Spalten, das kommt erst in Bau 2.

## Fertig, wenn

1. Leere Eingabe
   - Gegeben: Das Eingabefeld ist leer oder enthält nur Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Es kommt keine Aufgabe dazu und das Feld schüttelt sich kurz.
2. 200 Zeichen
   - Gegeben: Ich tippe einen Titel mit mehr als 200 Zeichen ohne Leerzeichen.
   - Wenn: Ich Enter drücke.
   - Dann: Die Aufgabe hat höchstens 200 Zeichen und der Text bricht in der Karte um.
3. Neu laden
   - Gegeben: Ich habe Aufgaben angelegt und einzelne abgehakt.
   - Wenn: Ich die Seite neu lade.
   - Dann: Alle Aufgaben und ihr Zustand sind noch da.
4. Abhaken
   - Gegeben: Eine offene Aufgabe ist sichtbar.
   - Wenn: Ich sie abhake.
   - Dann: Der Text wird animiert durchgestrichen, es fällt Konfetti in Look-Farben und der Zähler erhöht sich; nochmal klicken macht es rückgängig.
5. Schmales Fenster
   - Gegeben: Das Fenster ist 360 px breit.
   - Wenn: Ich die App benutze, auch mit einem Titel mit 200 Zeichen.
   - Dann: Alles ist lesbar und bedienbar, ohne seitliches Scrollen.
6. Löschen mit Rückgängig
   - Gegeben: Eine Aufgabe ist sichtbar.
   - Wenn: Ich sie lösche.
   - Dann: Sie verschwindet, ein Toast bietet «Rückgängig» an und stellt sie danach an ihrer alten Stelle wieder her.
7. Erledigte gleiten nach unten
   - Gegeben: Es gibt mehrere Aufgaben, davon einige erledigt.
   - Wenn: Ich eine Aufgabe abhake.
   - Dann: Sie bleibt mit durchgestrichenem Text sichtbar und gleitet ans untere Ende der Liste; wieder öffnen bringt sie zurück.
8. Fortschrittsring
   - Gegeben: Es gibt mehrere Aufgaben, davon einige erledigt.
   - Wenn: Ich eine abhake oder wieder öffne.
   - Dann: Der Ring zeigt erledigt/gesamt und federt bei jeder Änderung.
9. Leerer Zustand
   - Gegeben: Es gibt keine Aufgaben.
   - Wenn: Ich die App öffne.
   - Dann: Erscheint eine Illustration im Look mit einem freundlichen Satz und ein Hinweis auf die Eingabe.

## Features

### F1: Board mit Drag and Drop

Das Board bringt drei Spalten (Offen, In Arbeit, Erledigt) und lässt mich Karten per Maus oder per Tastatur zwischen und innerhalb der Spalten verschieben; die Zielspalte leuchtet beim Darüberziehen.

- Gegeben: Das Board hat die drei Spalten Offen, In Arbeit und Erledigt.
  - Wenn: Ich eine Karte mit der Maus oder per Tastatur in eine andere Spalte ziehe.
  - Dann: Die Karte landet dort, die Zielspalte leuchtet beim Darüberziehen kurz auf und der Zustand bleibt nach dem Neuladen erhalten.
- Gegeben: Aufgaben aus der alten Version sind gespeichert (Feld `done`).
  - Wenn: Ich die neue Version öffne.
  - Dann: Alle Aufgaben sind noch da, im richtigen Zustand (erledigt → Erledigt, offen → Offen).
- Gegeben: Mehrere Karten liegen in einer Spalte.
  - Wenn: Ich eine per Drag and Drop innerhalb derselben Spalte verschiebe.
  - Dann: Sie steht an der neuen Stelle und die Reihenfolge bleibt nach dem Neuladen erhalten.
- Gegeben: Eine Karte landet in der Spalte Erledigt.
  - Wenn: Sie abgelegt wird.
  - Dann: Der Abhak-Effekt des Looks erscheint (im Look neon Bullet Time, sonst Konfetti), wie beim Abhaken.
