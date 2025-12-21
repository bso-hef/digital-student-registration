# Admin-Bereich Benutzerhandbuch

Dieses Handbuch beschreibt alle Funktionen des Admin-Bereichs der Digital Student Registration Anwendung.

---

## Inhaltsverzeichnis

1. [Einleitung](#einleitung)
2. [Erste Einrichtung (Setup)](#erste-einrichtung-setup)
3. [Anmeldung & Authentifizierung](#anmeldung--authentifizierung)
4. [Dashboard](#dashboard)
5. [Klassenverwaltung](#klassenverwaltung)
6. [Schülerverwaltung](#schülerverwaltung)
7. [Einstellungen](#einstellungen)
8. [Navigation](#navigation)

---

## Einleitung

Der Admin-Bereich ermöglicht die vollständige Verwaltung des digitalen Schüler-Onboarding-Systems. Hier können Sie:

- Klassen und Schüler verwalten
- Onboarding-Formulare konfigurieren
- Vereinbarungen und Einwilligungen definieren
- Systemeinstellungen anpassen
- Aktivitätsprotokolle einsehen

### Voraussetzungen

- Moderner Webbrowser (Chrome, Firefox, Edge, Safari)
- Desktop-Computer (Mobile-Geräte werden im Admin-Bereich nicht unterstützt)
- Administrator-Zugangsdaten

---

## Erste Einrichtung (Setup)

Bei der erstmaligen Nutzung der Anwendung muss ein Administrator-Konto eingerichtet werden.

### Setup-Wizard starten

1. Öffnen Sie die Anwendung im Browser
2. Sie werden automatisch zum Setup-Wizard weitergeleitet (`/setup`)

### Schritt 1: Willkommen

- Lesen Sie die Einführungsinformationen
- Klicken Sie auf **Weiter**, um fortzufahren

### Schritt 2: E-Mail-Adresse

1. Geben Sie Ihre Administrator-E-Mail-Adresse ein
2. Verwenden Sie eine gültige E-Mail-Adresse im Format `name@domain.de`
3. Klicken Sie auf **Weiter**

### Schritt 3: Passwort erstellen

Erstellen Sie ein sicheres Passwort mit folgenden Anforderungen:

- Mindestens 8 Zeichen
- Mindestens ein Großbuchstabe
- Mindestens ein Kleinbuchstabe
- Mindestens eine Zahl
- Mindestens ein Sonderzeichen (empfohlen)
- Keine Leerzeichen

1. Geben Sie das gewünschte Passwort ein
2. Bestätigen Sie das Passwort durch erneute Eingabe
3. Klicken Sie auf **Weiter**

### Schritt 4: Wiederherstellungscode

Ein Wiederherstellungscode wird automatisch generiert. **Dieser Code ist wichtig für die Passwort-Wiederherstellung!**

1. Notieren oder kopieren Sie den Code im Format `XXXX-XXXX-XXXX-XXXX`
2. Bewahren Sie den Code an einem sicheren Ort auf
3. Bestätigen Sie, dass Sie den Code gesichert haben
4. Klicken Sie auf **Weiter**

> **Wichtig:** Der Wiederherstellungscode kann nach diesem Schritt nicht erneut angezeigt werden. Ohne diesen Code ist eine Passwort-Wiederherstellung nicht möglich!

### Schritt 5: Einrichtung abschließen

1. Überprüfen Sie Ihre Eingaben
2. Klicken Sie auf **Einrichtung abschließen**
3. Sie werden zur Anmeldeseite weitergeleitet

---

## Anmeldung & Authentifizierung

### Anmelden

1. Öffnen Sie die Anwendung im Browser
2. Sie werden zur Anmeldeseite (`/login`) weitergeleitet
3. Geben Sie Ihre E-Mail-Adresse ein
4. Geben Sie Ihr Passwort ein
5. Klicken Sie auf **Anmelden**

Nach erfolgreicher Anmeldung werden Sie zum Dashboard weitergeleitet.

### Sitzungsdauer

- Die Sitzung ist 24 Stunden gültig
- Nach Ablauf werden Sie automatisch zur Anmeldeseite weitergeleitet

### Abmelden

1. Klicken Sie auf Ihr Profil-Symbol in der Seitenleiste
2. Wählen Sie **Abmelden**

### Passwort zurücksetzen

Falls Sie Ihr Passwort vergessen haben:

1. Klicken Sie auf der Anmeldeseite auf **Passwort vergessen?**
2. Geben Sie Ihre E-Mail-Adresse ein
3. Geben Sie Ihren Wiederherstellungscode ein (Format: `XXXX-XXXX-XXXX-XXXX`)
4. Erstellen Sie ein neues Passwort (gleiche Anforderungen wie beim Setup)
5. Bestätigen Sie das neue Passwort
6. Klicken Sie auf **Passwort zurücksetzen**

Nach erfolgreicher Zurücksetzung werden Sie zur Anmeldeseite weitergeleitet.

---

## Dashboard

Das Dashboard bietet einen Überblick über alle wichtigen Kennzahlen und Aktivitäten.

### Statistik-Karten

Die Statistik-Karten zeigen aktuelle Zahlen:

- **Gesamtzahl Schüler** - Alle registrierten Schüler
- **Aktive Klassen** - Anzahl der aktiven Klassen
- **Onboarding abgeschlossen** - Schüler mit vollständigem Onboarding
- **Ausstehende Einladungen** - Schüler, die noch nicht begonnen haben

### Diagramme

Verschiedene Diagramme visualisieren Trends und Verteilungen:

- Onboarding-Fortschritt im Zeitverlauf
- Schülerverteilung nach Klassen
- Status-Übersicht

### Layout anpassen

Die Statistik-Karten und Diagramme können per Drag-and-Drop neu angeordnet werden:

1. Klicken und halten Sie eine Karte oder ein Diagramm
2. Ziehen Sie es an die gewünschte Position
3. Lassen Sie los, um zu platzieren

Das Layout wird automatisch gespeichert.

### Layout zurücksetzen

Um das ursprüngliche Layout wiederherzustellen:

1. Klicken Sie auf **Layout zurücksetzen** (oben rechts)
2. Bestätigen Sie die Aktion

### Automatische Aktualisierung

- Die Daten werden alle 5 Minuten automatisch aktualisiert
- Manuelle Aktualisierung durch Neuladen der Seite

---

## Klassenverwaltung

Die Klassenverwaltung ermöglicht das Anlegen, Bearbeiten und Löschen von Klassen.

### Klassenübersicht öffnen

1. Klicken Sie in der Seitenleiste auf **Verwaltung**
2. Wählen Sie **Klassen**

### Klassenübersicht

Die Tabelle zeigt alle Klassen mit folgenden Informationen:

| Spalte            | Beschreibung                             |
| ----------------- | ---------------------------------------- |
| Name              | Klassenbezeichnung                       |
| Schuljahr         | Start- und Endjahr                       |
| Klassenstufe      | Jahrgangsstufe (1-13)                    |
| Schüleranzahl     | Anzahl zugewiesener Schüler              |
| Berufsschulklasse | Kennzeichnung für berufsbildende Klassen |
| Status            | Aktiv oder Inaktiv                       |

### Suche und Filter

- **Suchfeld**: Durchsuchen Sie Klassen nach Name oder anderen Eigenschaften
- Die Suche erfolgt mit kurzer Verzögerung (Debounce)

### Neue Klasse anlegen

1. Klicken Sie auf **Klasse hinzufügen**
2. Füllen Sie das Formular aus:
   - **Name**: Klassenbezeichnung (z.B. "10a", "BG22")
   - **Klassenstufe**: Wählen Sie die Jahrgangsstufe (1-13)
   - **Schuljahr von**: Startjahr des Schuljahres
   - **Schuljahr bis**: Endjahr des Schuljahres
   - **Berufsschulklasse**: Aktivieren Sie dies für berufsbildende Klassen
   - **Arbeitgeberangaben erforderlich**: Bei Berufsschulklassen können Arbeitgeberangaben als Pflichtfeld gesetzt werden
   - **Aktiv**: Klasse ist aktiv und kann verwendet werden
3. Klicken Sie auf **Speichern**

### Klasse bearbeiten

1. Klicken Sie auf den Klassennamen in der Tabelle
2. Sie werden zur Klassendetailseite weitergeleitet

#### Allgemein-Tab

Bearbeiten Sie die Grunddaten der Klasse:

1. Ändern Sie die gewünschten Felder
2. Klicken Sie auf **Speichern**

Folgende Felder können bearbeitet werden:

- Name
- Klassenstufe
- Schuljahr (von/bis)
- Berufsschulklasse-Kennzeichnung
- Arbeitgeberangaben-Pflicht
- Aktiv-Status

#### Schüler-Tab

Verwalten Sie die Schülerzuweisung:

**Schüler zur Klasse hinzufügen:**

1. Wechseln Sie zum Tab **Schüler**
2. Klicken Sie auf **Schüler hinzufügen**
3. Suchen Sie nach Schülern oder wählen Sie aus der Liste
4. Markieren Sie die gewünschten Schüler
5. Klicken Sie auf **Hinzufügen**

**Schüler aus Klasse entfernen:**

1. Markieren Sie die Schüler in der Tabelle
2. Klicken Sie auf **Entfernen**
3. Bestätigen Sie die Aktion

### Klasse löschen

**Einzelne Klasse löschen:**

1. Öffnen Sie die Klassendetailseite
2. Klicken Sie auf das Löschen-Symbol
3. Bestätigen Sie die Löschung

**Mehrere Klassen löschen:**

1. Markieren Sie die gewünschten Klassen in der Tabelle (Checkbox)
2. Klicken Sie auf **Löschen**
3. Bestätigen Sie die Löschung

> **Hinweis:** Das Löschen einer Klasse entfernt nicht die zugewiesenen Schüler, sondern nur die Klassenzuweisung.

### CSV-Import

Importieren Sie mehrere Klassen gleichzeitig:

1. Klicken Sie auf das **Import**-Symbol
2. Wählen Sie eine CSV-Datei aus
3. Überprüfen Sie die Vorschau
4. Klicken Sie auf **Importieren**

**CSV-Format:**

```csv
Name,Klassenstufe,SchuljahrVon,SchuljahrBis,Berufsschulklasse
10a,10,2024,2025,false
BG22,12,2024,2025,true
```

### CSV-Export

Exportieren Sie Klassendaten:

1. Wählen Sie optional Klassen aus (oder keine für alle)
2. Klicken Sie auf das **Export**-Symbol
3. Die CSV-Datei wird heruntergeladen

### QR-Code generieren

Erstellen Sie einen QR-Code für eine Klasse:

1. Klicken Sie auf das **QR-Code**-Symbol in der Zeile
2. Der QR-Code wird in einem Modal angezeigt
3. Optionen:
   - **Drucken**: QR-Code ausdrucken
   - **Herunterladen**: Als Bild speichern
   - **Kopieren**: Link in Zwischenablage kopieren

---

## Schülerverwaltung

Die Schülerverwaltung ermöglicht das Anlegen, Bearbeiten und Verwalten von Schülerdaten.

### Schülerübersicht öffnen

1. Klicken Sie in der Seitenleiste auf **Verwaltung**
2. Wählen Sie **Schüler**

### Schülerübersicht

Die Tabelle zeigt alle Schüler mit folgenden Informationen:

| Spalte             | Beschreibung                                          |
| ------------------ | ----------------------------------------------------- |
| Vorname            | Vorname des Schülers (klickbar)                       |
| Nachname           | Nachname des Schülers (klickbar)                      |
| Klasse             | Zugewiesene Klasse (mit Dropdown zur Schnelländerung) |
| Verifizierungscode | Eindeutiger Code für Schüler-Onboarding               |
| Status             | Importiert, Eingeladen oder Onboarding abgeschlossen  |

### Filter und Suche

**Suchfeld:**

- Durchsuchen Sie Schüler nach Name oder anderen Eigenschaften

**Filter nach Klasse:**

- Wählen Sie eine Klasse aus dem Dropdown, um nur deren Schüler anzuzeigen

**Filter nach Status:**

- **Importiert**: Schüler wurde angelegt, aber noch nicht eingeladen
- **Eingeladen**: Einladung wurde gesendet, Onboarding nicht abgeschlossen
- **Onboarding abgeschlossen**: Schüler hat alle Formulare ausgefüllt

### Neuen Schüler anlegen

1. Klicken Sie auf **Schüler hinzufügen**
2. Füllen Sie die Pflichtfelder aus:
   - **Vorname**
   - **Nachname**
   - **Geburtsdatum**
3. Optional: Weisen Sie direkt eine Klasse zu
4. Klicken Sie auf **Speichern**

Ein Verifizierungscode wird automatisch generiert.

### Schüler bearbeiten

1. Klicken Sie auf den Vor- oder Nachnamen in der Tabelle
2. Sie werden zur Schülerdetailseite weitergeleitet

Die Schülerdetailseite ist in vier Tabs unterteilt:

#### Tab: Allgemein

Grundlegende Schülerdaten:

- **Vorname** / **Nachname** - Namen des Schülers
- **Geburtsname** - Falls abweichend
- **Geburtsdatum** - Im Format TT.MM.JJJJ
- **Geschlecht** - Männlich, Weiblich, Divers
- **Geburtsort** - Stadt/Ort der Geburt
- **Religion** - Konfession
- **Staatsangehörigkeit** - Erste und ggf. zweite Staatsangehörigkeit
- **Familiensprache** - Sprache(n) im Haushalt
- **Zuwanderungsjahr** - Falls zutreffend
- **Aktiv** - Schüler ist aktiv im System

**Nur-Lese-Felder:**

- **Verifizierungscode** - Eindeutiger Code (mit Kopier-Button)
- **Verifizierungsstatus** - Aktueller Onboarding-Status

#### Tab: Kontakt

Kontaktdaten des Schülers:

- **E-Mail-Adresse**
- **Telefonnummer**
- **Adresse**:
  - Straße und Hausnummer
  - Postleitzahl
  - Stadt
  - Land (Dropdown)

#### Tab: Ansprechpartner

Erziehungsberechtigte und Kontaktpersonen:

**Ansprechpartner hinzufügen:**

1. Klicken Sie auf **Ansprechpartner hinzufügen**
2. Füllen Sie die Daten aus:
   - **Art**: Mutter, Vater, Vormund, Großelternteil, Geschwister, Andere
   - **Anrede**: Herr, Frau, Divers
   - **Vorname** / **Nachname**
   - **E-Mail-Adresse**
   - **Telefonnummer**
   - **Adresse** (optional: identisch mit Schüleradresse)

**Ansprechpartner bearbeiten:**

- Klicken Sie auf das Bearbeiten-Symbol neben dem Eintrag

**Ansprechpartner entfernen:**

- Klicken Sie auf das Löschen-Symbol neben dem Eintrag

> **Hinweis:** Die maximale Anzahl der Ansprechpartner ist in den Einstellungen konfigurierbar (Standard: 3).

#### Tab: Bildung

Schulische Vorbildung und Arbeitgeber:

**Aktuelle Klasse:**

- Dropdown zur Klassenauswahl
- Datum des Schulbeitritts

**Vorherige Schule:**

- Schulform (Grundschule, Hauptschule, etc.)
- Klassenstufe
- Abschlüsse

**Berufsausbildung** (bei Berufsschulklassen):

- Ausbildungsberuf
- Ausbildungsbeginn / -ende

**Arbeitgeber** (bei Berufsschulklassen):

- Firmenname
- Ansprechpartner
- Adresse
- Telefon / E-Mail

### Schnelle Klassenzuweisung

Direkt in der Übersichtstabelle:

1. Klicken Sie auf das Klassen-Dropdown in der Schülerzeile
2. Wählen Sie die neue Klasse
3. Die Änderung wird sofort gespeichert

### Schüler löschen

**Einzelnen Schüler löschen:**

1. Öffnen Sie die Schülerdetailseite
2. Klicken Sie auf das Löschen-Symbol
3. Bestätigen Sie die Löschung

**Mehrere Schüler löschen:**

1. Markieren Sie die gewünschten Schüler (Checkbox)
2. Klicken Sie auf **Löschen**
3. Bestätigen Sie die Löschung

> **Warnung:** Das Löschen von Schülern ist endgültig und kann nicht rückgängig gemacht werden!

### CSV-Import

Importieren Sie Schülerdaten aus einer CSV-Datei:

1. Klicken Sie auf das **Import**-Symbol
2. Wählen Sie eine CSV-Datei aus
3. Überprüfen Sie die Vorschau und Zuordnung der Spalten
4. Klicken Sie auf **Importieren**

**CSV-Format (Beispiel):**

```csv
Vorname,Nachname,Geburtsdatum,Geschlecht,Klasse
Max,Mustermann,15.03.2008,Männlich,10a
Anna,Schmidt,22.07.2008,Weiblich,10a
```

### CSV-Export

Exportieren Sie Schülerdaten:

1. Wählen Sie optional Schüler aus (oder keine für alle)
2. Klicken Sie auf das **Export**-Symbol
3. Die CSV-Datei wird heruntergeladen

### Schülerdaten exportieren

Für ausgewählte Schüler können detaillierte Daten exportiert werden:

1. Markieren Sie die gewünschten Schüler
2. Klicken Sie auf **Exportieren**
3. Wählen Sie das gewünschte Format
4. Die Datei wird heruntergeladen

### QR-Code und Verifizierungscode

**Verifizierungscode kopieren:**

1. Klicken Sie auf das Kopier-Symbol neben dem Code in der Tabelle
2. Der Code wird in die Zwischenablage kopiert

**QR-Code generieren:**

1. Klicken Sie auf das **QR-Code**-Symbol in der Schülerzeile
2. Der QR-Code wird angezeigt
3. Optionen:
   - **Drucken**: QR-Code ausdrucken
   - **Herunterladen**: Als Bild speichern
   - **Link kopieren**: Onboarding-Link kopieren

> **Tipp:** Der QR-Code enthält den direkten Link zum Schüler-Onboarding-Formular.

---

## Einstellungen

Der Einstellungsbereich ermöglicht die Konfiguration verschiedener Systembereiche.

### Einstellungen öffnen

Klicken Sie in der Seitenleiste auf **Einstellungen** und wählen Sie den gewünschten Bereich.

---

### Profil

Verwalten Sie Ihre persönlichen Administrator-Einstellungen.

#### Persönliche Daten bearbeiten

1. Navigieren Sie zu **Einstellungen > Profil**
2. Bearbeiten Sie die gewünschten Felder:
   - **Vorname** / **Nachname**
   - **E-Mail-Adresse**
   - **Telefonnummer**
   - **Berufsbezeichnung**
3. Klicken Sie auf **Speichern**

#### Avatar hochladen

1. Klicken Sie auf Ihr aktuelles Profilbild oder den Platzhalter
2. Wählen Sie eine Bilddatei aus

**Unterstützte Formate:**

- JPEG, PNG, GIF, WebP
- Maximale Dateigröße: 5 MB

#### Avatar ändern oder entfernen

- **Ändern**: Klicken Sie auf **Bild ändern** und wählen Sie ein neues Bild
- **Entfernen**: Klicken Sie auf **Bild entfernen**

#### Zeitzone einstellen

1. Öffnen Sie den Abschnitt **Persönliche Daten**
2. Wählen Sie Ihre Zeitzone aus dem Dropdown
3. Klicken Sie auf **Speichern**

Verfügbare Zeitzonen umfassen u.a.:

- Europe/Berlin (Standardeinstellung)
- Europe/Vienna
- Europe/Zurich
- Und weitere internationale Zeitzonen

#### Passwort ändern

1. Öffnen Sie den Abschnitt **Sicherheit**
2. Geben Sie Ihr **aktuelles Passwort** ein
3. Geben Sie Ihr **neues Passwort** ein
4. Bestätigen Sie das neue Passwort
5. Klicken Sie auf **Passwort ändern**

Das neue Passwort muss die gleichen Anforderungen wie bei der Ersteinrichtung erfüllen.

---

### Onboarding-Konfiguration

Passen Sie das Schüler-Onboarding-Formular an.

#### Dropdown-Optionen verwalten

Sie können die Auswahloptionen für verschiedene Formularfelder anpassen:

**Verfügbare Dropdown-Listen:**

| Dropdown            | Beschreibung                                  |
| ------------------- | --------------------------------------------- |
| Geschlecht          | Männlich, Weiblich, Divers                    |
| Anrede              | Herr, Frau, Divers                            |
| Religion            | Katholisch, Evangelisch, Islamisch, etc.      |
| Sprache             | Deutsch, Englisch, Türkisch, etc.             |
| Ansprechpartner-Art | Mutter, Vater, Vormund, etc.                  |
| Klassenstufe        | Klasse 5-14                                   |
| Schulform           | Grundschule, Hauptschule, etc.                |
| Abschlüsse          | Hauptschulabschluss, Realschulabschluss, etc. |
| Beruf               | Verschiedene Ausbildungsberufe                |
| Land                | 90+ Länder                                    |

**Option hinzufügen:**

1. Wählen Sie die gewünschte Dropdown-Liste
2. Klicken Sie auf **Option hinzufügen**
3. Geben Sie **Wert** und **Bezeichnung** ein
4. Klicken Sie auf **Hinzufügen**

**Option bearbeiten:**

1. Klicken Sie auf das Bearbeiten-Symbol neben der Option
2. Ändern Sie die Bezeichnung
3. Speichern Sie die Änderung

**Option aktivieren/deaktivieren:**

- Klicken Sie auf den Schalter neben der Option
- Deaktivierte Optionen werden im Formular nicht angezeigt

**Reihenfolge ändern:**

1. Klicken und halten Sie eine Option
2. Ziehen Sie sie an die gewünschte Position
3. Lassen Sie los

#### Feldkonfiguration

Steuern Sie die Sichtbarkeit und Anforderungen einzelner Formularfelder:

| Einstellung                           | Beschreibung                        |
| ------------------------------------- | ----------------------------------- |
| **Pflichtfeld**                       | Das Feld muss ausgefüllt werden     |
| **Sichtbar**                          | Das Feld wird im Formular angezeigt |
| **Benutzerdefinierte Werte erlauben** | Nutzer können eigene Werte eingeben |

**Konfigurierbare Felder:**

- Geschlecht
- Religion
- Zweite Staatsangehörigkeit
- Herkunftsland
- Familiensprache
- Vorherige Klassenstufe
- Vorherige Schulform
- Abschlüsse
- Beruf
- Ansprechpartner-Art

**Feld konfigurieren:**

1. Suchen Sie das gewünschte Feld in der Tabelle
2. Aktivieren/Deaktivieren Sie die Schalter:
   - **Pflicht**: Macht das Feld erforderlich
   - **Sichtbar**: Zeigt/verbirgt das Feld
   - **Eigene Werte**: Erlaubt freie Texteingabe
3. Klicken Sie auf **Speichern**

> **Hinweis:** Ein Feld kann nur als Pflichtfeld markiert werden, wenn es auch sichtbar ist.

#### Maximale Anzahl Ansprechpartner

Legen Sie fest, wie viele Kontaktpersonen pro Schüler angelegt werden können:

1. Finden Sie die Einstellung **Maximale Anzahl Ansprechpartner**
2. Geben Sie eine Zahl ein (Minimum: 1)
3. Klicken Sie auf **Speichern**

---

### Vereinbarungen

Verwalten Sie die Einwilligungen und Vereinbarungen für das Schüler-Onboarding.

#### Vereinbarungsübersicht

Die Tabelle zeigt alle konfigurierten Vereinbarungen:

| Spalte       | Beschreibung                    |
| ------------ | ------------------------------- |
| Reihenfolge  | Position im Onboarding-Formular |
| Bezeichnung  | Name der Vereinbarung (DE/EN)   |
| Beschreibung | Erläuterungstext                |
| Icon         | Symboldarstellung               |
| Pflicht      | Muss zugestimmt werden          |
| Aktiv        | Wird im Formular angezeigt      |

**Standard-Vereinbarungen:**

1. **Datenschutz** - Einwilligung zur Datenverarbeitung
2. **Unterrichtsteilnahme** - Bestätigung der Teilnahme
3. **Schulordnung** - Anerkennung der Schulregeln
4. **Personenabbildung** - Einwilligung zu Foto-/Videoaufnahmen
5. **Teams-Nutzung** - Einwilligung zur Nutzung von Microsoft Teams

#### Vereinbarung hinzufügen

1. Klicken Sie auf **Vereinbarung hinzufügen**
2. Füllen Sie das Formular aus:
   - **Bezeichnung (Deutsch)**: Name auf Deutsch
   - **Bezeichnung (Englisch)**: Name auf Englisch
   - **Beschreibung (Deutsch)**: Erläuterungstext auf Deutsch (optional)
   - **Beschreibung (Englisch)**: Erläuterungstext auf Englisch (optional)
   - **Icon**: Wählen Sie ein MUI-Icon (z.B. "Security", "School")
   - **Pflichtfeld**: Muss zugestimmt werden
   - **Aktiv**: Wird im Formular angezeigt
3. Klicken Sie auf **Speichern**

#### Vereinbarung bearbeiten

1. Klicken Sie auf das Bearbeiten-Symbol in der Zeile
2. Ändern Sie die gewünschten Felder
3. Klicken Sie auf **Speichern**

#### Vereinbarung aktivieren/deaktivieren

- Klicken Sie auf den **Aktiv**-Schalter in der Zeile
- Deaktivierte Vereinbarungen werden nicht im Onboarding angezeigt

#### Reihenfolge ändern

1. Klicken und halten Sie eine Vereinbarung
2. Ziehen Sie sie an die gewünschte Position
3. Lassen Sie los
4. Klicken Sie auf **Speichern**

#### Vereinbarung löschen

1. Klicken Sie auf das Löschen-Symbol in der Zeile
2. Bestätigen Sie die Löschung

> **Warnung:** Das Löschen einer Vereinbarung kann nicht rückgängig gemacht werden!

---

### System

Systemweite Einstellungen und Überwachung.

#### Mobile-Blocker

Steuern Sie den Zugriff von Mobilgeräten auf den Admin-Bereich:

- **Aktiviert**: Mobilgeräte sehen eine Hinweismeldung und können den Admin-Bereich nicht nutzen
- **Deaktiviert**: Zugriff von allen Geräten möglich (nicht empfohlen)

**Einstellung ändern:**

1. Klicken Sie auf den Schalter **Mobile-Blocker**
2. Die Änderung wird sofort gespeichert

> **Empfehlung:** Lassen Sie den Mobile-Blocker aktiviert, da der Admin-Bereich für Desktop-Nutzung optimiert ist.

#### WLAN-Konfiguration

Konfigurieren Sie WLAN-Zugangsdaten für QR-Codes:

1. Aktivieren Sie **WLAN-Konfiguration**
2. Füllen Sie die Felder aus:
   - **SSID**: Name des WLAN-Netzwerks
   - **Passwort**: WLAN-Passwort (mit Sichtbarkeits-Toggle)
   - **Sicherheitstyp**: WPA, WPA2, WPA3, WEP oder Kein Passwort
   - **Verstecktes Netzwerk**: Aktivieren, falls SSID nicht sichtbar ist
3. Klicken Sie auf **Speichern**

> **Sicherheitshinweis:** Das WLAN-Passwort wird verschlüsselt gespeichert. Verwenden Sie diese Funktion nur für Gast-Netzwerke.

#### Systemstatus

Überwachen Sie den Systemzustand:

**Datenbankstatus:**

- Grüner Indikator: MongoDB verbunden
- Roter Indikator: Verbindungsproblem

**System-Metriken:**

| Metrik          | Beschreibung                      |
| --------------- | --------------------------------- |
| Betriebszeit    | Zeit seit Serverstart             |
| CPU-Kerne       | Anzahl verfügbarer Prozessorkerne |
| Freier Speicher | Verfügbarer Arbeitsspeicher       |
| Gesamtspeicher  | Gesamter Arbeitsspeicher          |
| Node.js-Version | Version der Laufzeitumgebung      |
| Plattform       | Betriebssystem                    |

**Server-Informationen:**

- Dienstname
- Anwendungsversion
- Hostname
- Systemarchitektur

Die Metriken werden alle 30 Sekunden automatisch aktualisiert.

---

### Audit-Protokoll

Überwachen Sie alle Systemaktivitäten.

#### Protokollübersicht

Die Tabelle zeigt alle protokollierten Ereignisse:

| Spalte      | Beschreibung                                                      |
| ----------- | ----------------------------------------------------------------- |
| Zeitstempel | Datum und Uhrzeit (TT.MM.JJJJ HH:mm:ss)                           |
| Kategorie   | Art der Aktion (Schüler, Klasse, Einstellungen, Auth, System)     |
| Aktion      | Durchgeführte Operation (Erstellen, Aktualisieren, Löschen, etc.) |
| Status      | Ergebnis (Erfolg, Fehlgeschlagen, Teilweise)                      |
| Benutzer    | Ausführender Administrator                                        |

#### Filter

**Nach Kategorie filtern:**

1. Öffnen Sie das Dropdown **Kategorie**
2. Wählen Sie eine Kategorie:
   - **Schüler**: Schülerbezogene Aktionen
   - **Klasse**: Klassenbezogene Aktionen
   - **Einstellungen**: Konfigurationsänderungen
   - **Auth**: Anmeldungen und Authentifizierung
   - **System**: Systemereignisse

**Nach Status filtern:**

1. Öffnen Sie das Dropdown **Status**
2. Wählen Sie einen Status:
   - **Erfolg**: Erfolgreich abgeschlossene Aktionen
   - **Fehlgeschlagen**: Fehlgeschlagene Aktionen
   - **Teilweise**: Teilweise erfolgreiche Batch-Operationen

**Textsuche:**

- Geben Sie einen Suchbegriff in das Suchfeld ein
- Die Suche durchsucht alle Protokollfelder

#### Protokolldetails anzeigen

1. Klicken Sie auf das **Details**-Symbol in einer Zeile
2. Ein Modal zeigt die vollständigen Protokolldaten im JSON-Format

#### Protokolle exportieren

**Als CSV exportieren:**

1. Klicken Sie auf **Exportieren**
2. Wählen Sie **CSV**
3. Die Datei wird heruntergeladen

**Als JSON exportieren:**

1. Klicken Sie auf **Exportieren**
2. Wählen Sie **JSON**
3. Die Datei wird heruntergeladen

#### Protokolle löschen

**Ausgewählte Protokolle löschen:**

1. Markieren Sie die gewünschten Einträge (Checkbox)
2. Klicken Sie auf **Ausgewählte löschen**
3. Bestätigen Sie die Löschung

**Alle Protokolle löschen:**

1. Klicken Sie auf **Alle löschen**
2. Bestätigen Sie die Löschung

> **Warnung:** Gelöschte Protokolle können nicht wiederhergestellt werden!

#### Automatische Aktualisierung

Die Protokolle werden alle 30 Sekunden automatisch aktualisiert.

---

## Navigation

### Seitenleiste (LeftNavigation)

Die Seitenleiste bietet Zugriff auf alle Bereiche:

**Hauptmenü:**

- **Dashboard** - Startseite mit Übersicht
- **Verwaltung**
  - Klassen
  - Schüler
- **Einstellungen**
  - Profil
  - Onboarding
  - Vereinbarungen
  - System
  - Audit-Protokoll

**Seitenleiste ein-/ausklappen:**

- Klicken Sie auf das Menü-Symbol (Hamburger-Icon) oben links
- Die Seitenleiste wird minimiert/erweitert

### Tabs in Detail-Ansichten

Bei Klassen- und Schülerdetails werden vertikale Tabs verwendet:

**Klassendetails:**

- Allgemein
- Schüler

**Schülerdetails:**

- Allgemein
- Kontakt
- Ansprechpartner
- Bildung

Klicken Sie auf einen Tab, um den entsprechenden Bereich anzuzeigen.

### Breadcrumb-Navigation

In Detail-Ansichten zeigt der Header den aktuellen Pfad:

```text
Klassen > 10a > Allgemein
```

Klicken Sie auf **Zurück** oder einen Pfadabschnitt, um zur übergeordneten Seite zu navigieren.

### Tastenkürzel und Tipps

| Aktion           | Tipp                                                     |
| ---------------- | -------------------------------------------------------- |
| Suche            | Tippen Sie direkt in das Suchfeld (Fokus automatisch)    |
| Mehrfachauswahl  | Halten Sie Strg/Cmd gedrückt beim Klicken                |
| Alle auswählen   | Checkbox im Tabellenkopf                                 |
| Schnellspeichern | Änderungen werden oft automatisch gespeichert            |
| Abbrechen        | Drücken Sie Escape oder klicken Sie außerhalb von Modals |

---

## Fehlerbehebung

### Häufige Probleme

**Anmeldung fehlgeschlagen:**

- Überprüfen Sie E-Mail-Adresse und Passwort
- Stellen Sie sicher, dass Ihr Konto aktiv ist
- Kontaktieren Sie den Systemadministrator bei wiederholten Fehlern

**Daten werden nicht gespeichert:**

- Prüfen Sie die Internetverbindung
- Achten Sie auf Validierungsfehler (rote Markierungen)
- Versuchen Sie es nach einem Neuladen der Seite erneut

**Seite lädt nicht:**

- Leeren Sie den Browser-Cache
- Versuchen Sie einen anderen Browser
- Prüfen Sie, ob JavaScript aktiviert ist

**Mobile-Blocker-Meldung:**

- Der Admin-Bereich ist nur für Desktop-Computer vorgesehen
- Wechseln Sie zu einem Desktop-Computer

**Datenbankverbindung unterbrochen:**

- Prüfen Sie den Systemstatus unter Einstellungen > System
- Warten Sie einige Minuten und versuchen Sie es erneut
- Kontaktieren Sie den IT-Support bei anhaltenden Problemen

---

## Kontakt und Support

Bei technischen Problemen oder Fragen wenden Sie sich an Ihren IT-Administrator.
