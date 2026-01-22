# Digital Student Registration - Präsentation

## Übersicht

| #   | Thema              | Präsentiert von | Schwerpunkte                                          |
| --- | ------------------ | --------------- | ----------------------------------------------------- |
| 0   | Titelfolie         | -               | Projekttitel, Team, Datum                             |
| 1   | Einleitung         | Philipp         | Ist/Soll, Projektziel, digitale Schülerregistrierung  |
| 2   | Projektmanagement  | Philipp         | Agiles Vorgehen, Meilensteine (v2.0.0), Branching     |
| 3   | Design/UX          | Constantin      | MUI v7, Atomic Design, Light/Dark Mode, Responsive    |
| 4   | Anmeldung          | Valentin        | 9-Schritt Wizard, Verifizierung, Nutzerfluss          |
| 5   | Frontend           | Valentin        | Next.js 15, Redux, Formik, CSV/QR-Features            |
| 6   | Deployment         | Alex            | Multi-Stage Dockerfile, Build-Scripts, Linux/Windows  |
| 7   | Infrastruktur      | Alex            | Docker-Compose, MongoDB, Redis, Healthchecks, Volumes |
| 8   | Admin              | David           | Dashboard, Klassen-/Studentenverwaltung, DataTable    |
| 9   | Rechte             | David           | NextAuth JWT, Rollen, AuditLog, Datensicherheit       |
| 10  | Wirtschaftlichkeit | Philipp         | Effizienzgewinne, Open-Source Stack, Abschluss        |

---

## Folie 0: Titelfolie

**Digital Student Registration**

- Full-Stack Webanwendung zur digitalen Schülerregistrierung
- Team: Philipp, Constantin, Valentin, Alex, David
- Version: 2.0.0
- Tech Stack: Next.js 15 | React 19 | MongoDB | Docker

---

## Folie 1: Einleitung (Philipp)

**Ist/Soll + Projektziel**

### Ist-Zustand (v1)

- Veraltete digitale Schüleranmeldung (v1)
- Technisch überholt und schwer wartbar
- Schlechte User Experience
- Fehlende moderne Features

### Soll-Zustand

- Digitalisierter Self-Service Registrierungsprozess
- Zentrale Admin-Verwaltung
- Automatische Validierung und Status-Tracking

### Projektziel

- Multi-Step-Onboarding für Schüler (9 Schritte maximal)
- Admin-Dashboard für Verwaltungspersonal
- CSV-Import/Export für Massenoperationen
- Status-Tracking: `imported` → `invited` → `onboarded`

```text
Schüler-Flow:
┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│  imported    │ →  │   invited    │ →  │  onboarded  │
│ (CSV/manuell)│    │ (verifiziert)│    │ (komplett)  │
└──────────────┘    └──────────────┘    └─────────────┘
```

---

## Folie 2: Projektmanagement (Philipp)

**Vorgehen/Plan + Meilensteine**

### Agile Entwicklung

- Feature-Branches für isolierte Entwicklung
- Code Reviews vor Merge
- Kontinuierliche Integration

### Team (5 Personen)

| Person     | Verantwortlichkeit                 |
| ---------- | ---------------------------------- |
| Philipp    | Projektleitung, Wirtschaftlichkeit |
| Constantin | Design, UX                         |
| Valentin   | Anmeldung, Frontend                |
| Alex       | Deployment, Infrastruktur          |
| David      | Admin, Sicherheit                  |

### Meilensteine

- **v2.1.0**: Neue Features, Bugfixes, Security Updates
- **Testing**: 964 Unit-Tests implementiert
- **Branching**: `main` → `develop` → `feature/*`

```bash
# Git-Workflow
git checkout -b feature/neue-funktion
# ... entwickeln ...
git push origin feature/neue-funktion
# → Pull Request → Review → Merge
```

---

## Folie 3: Design/UX (Constantin)

**Designkonzept + Produktüberblick**

### Design Tech Stack

- **Material-UI v7** mit Custom Theme
- **Atomic Design Pattern**: Atoms → Molecules → Organisms
- **Light/Dark Mode** Unterstützung
- **Barrierefreiheitsoptionen**: Legastenie Schrift unterstützung & High contrast
- **Responsive Design** (Mobile-friendly)

### Komponenten-Struktur

```text
src/components/
├── atoms/          # Buttons, Inputs, Status-Chips
│   ├── buttons/
│   ├── inputs/
│   └── statusChip/
├── molecules/      # Headers, Menus
│   └── headers/
└── organisms/      # DataTable, Forms, Navigation
    ├── forms/
    ├── tables/
    └── navigation/
```

### Theme-System

```typescript
// src/theme/index.ts
export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#1976d2" },
      // ...
    },
  });
```

### Barrierefreiheit (Accessibility)

| Feature             | Beschreibung                             |
| ------------------- | ---------------------------------------- |
| Legasthenie-Schrift | OpenDyslexic Font für bessere Lesbarkeit |
| High Contrast       | Erhöhter Kontrast für Sehbeeinträchtigte |
| Light/Dark Mode     | Augenfreundliche Farbschemata            |
| Responsive Design   | Nutzbar auf allen Geräten                |

```typescript
// Accessibility-Menu Komponente
// src/components/molecules/accessibilityMenu/
<AccessibilityMenu
  dyslexiaFont={true}
  highContrast={true}
/>
```

### Key Features

- Internationalisierung (DE/EN) via i18next
- Konsistente UI-Komponenten
- DataTable, LeftNavigation, Form-Wizard

---

## Folie 4: Anmeldung (Valentin)

**Geführte Anmeldung + Nutzerfluss**

### Verifizierung

Schüler authentifizieren sich mit:

- Vorname + Nachname + 6-stelliger Verifizierungscode

### Wizard-Schritte (bis zu 11, davon 3 optional)

| #   | Schritt         | Inhalt                             | Optional? | Bedingung                   |
| --- | --------------- | ---------------------------------- | --------- | --------------------------- |
| 0   | Welcome         | Willkommensscreen                  | Nein      | -                           |
| 1   | General         | Name, Geburtsdatum, Geschlecht     | Nein      | -                           |
| 2   | Origin          | Herkunft, Zuzugsjahr, Sprache      | **Ja**    | Geburtsland ≠ Deutschland   |
| 3   | Address         | Adresse mit automatischer Zeitzone | Nein      | -                           |
| 4   | Parents         | Bis zu 3 Kontaktpersonen           | Nein      | -                           |
| 5   | Pre-Education   | Vorbildung, Schulhistorie          | Nein      | -                           |
| 6   | Training        | Beruf, Betrieb, Eintritt           | **Ja**    | Klasse ist Berufsausbildung |
| 7   | Company Contact | Betriebliche Ansprechpartner       | **Ja**    | Klasse ist Berufsausbildung |
| 8   | Agreements      | Zustimmungen & Einwilligungen      | Nein      | -                           |
| 9   | Summary         | Zusammenfassung + Bestätigung      | Nein      | -                           |
| 10  | Completion      | Erfolgsmeldung                     | Nein      | -                           |

### Konditionale Logik

```text
Deutscher Schüler in normaler Klasse:     8 Schritte (ohne Origin, Training, Company)
Ausländischer Schüler in normaler Klasse: 9 Schritte (ohne Training, Company)
Deutscher Schüler in Berufsausbildung:    10 Schritte (ohne Origin)
Ausländischer Schüler in Berufsausbildung: 11 Schritte (alle)
```

### Features

- Fortschritt wird automatisch gespeichert
- Zurück-Navigation jederzeit möglich
- Yup-Validierung pro Schritt
- Schritte werden dynamisch ein-/ausgeblendet

---

## Folie 5: Frontend (Valentin)

**Technische Realisierung + Dokumente/Uploads**

### Tech Stack

| Technologie   | Version | Zweck                   |
| ------------- | ------- | ----------------------- |
| Next.js       | 15.4.2  | App Router, SSR         |
| React         | 19.1.0  | UI Framework            |
| TypeScript    | 5       | Type Safety             |
| Redux Toolkit | -       | State Management        |
| Formik + Yup  | -       | Formulare + Validierung |

### State Management

```typescript
// src/store/store.ts
const store = configureStore({
  reducer: {
    ui: uiReducer, // Theme, Locale, Loading
    student: studentReducer, // Onboarding-Daten
    class: classReducer, // Klassenverwaltung
  },
});

// Persistierung in localStorage
persistReducer(persistConfig, rootReducer);
```

### Dokumente/Uploads

- **CSV-Import**: Batch-Upload für Schüler & Klassen
- **CSV-Export**: Konfigurierbare Felder
- **QR-Codes**: Generierung für Schüler/Klassen

```typescript
// CSV-Import Beispiel
const handleImport = async (file: File) => {
  const data = await parseCSV(file);
  await dispatch(batchCreateStudents(data));
};
```

---

## Folie 6: Deployment (Alex)

**Docker & Containerisierung**

### Was ist Docker?

- Container = "Verpackte Anwendung mit allem was sie braucht"
- Läuft überall gleich (Windows, Linux, Cloud)
- Isoliert von anderen Anwendungen

### Multi-Stage Build (4 Phasen)

```text
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Stage 1   │ → │   Stage 2   │ → │   Stage 3   │ → │   Stage 4   │
│    BASE     │   │    DEPS     │   │   BUILDER   │   │   RUNNER    │
│  Node.js    │   │  npm install│   │  yarn build │   │  Production │
│   Alpine    │   │  Packages   │   │  Compile    │   │  Minimal    │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
     22MB              800MB            1.2GB             ~150MB
```

### Image-Größen Vergleich

| Variante         | Größe   | Ersparnis |
| ---------------- | ------- | --------- |
| Ohne Optimierung | ~1.5 GB | -         |
| Mit Multi-Stage  | ~150 MB | **90%**   |

### Vorteile von Docker

- Konsistente Umgebung (Dev = Prod)
- Schnelles Deployment (< 5 Min)
- Einfaches Rollback bei Problemen
- Skalierbar (mehrere Instanzen)
- Plattformunabhängig (Linux/Windows)

### Security Features

| Feature           | Beschreibung                         |
| ----------------- | ------------------------------------ |
| Non-root User     | App läuft als `nextjs` (UID 1001)    |
| dumb-init         | Korrektes Prozess-Management (PID 1) |
| no-new-privileges | Keine Rechte-Eskalation möglich      |

### Deployment-Befehle

```bash
# Linux Production
docker compose --profile linux up -d

# Windows Production
docker compose --profile windows up -d
```

---

## Folie 7: Infrastruktur (Alex)

**Services & Konfiguration**

### Architektur-Diagramm

```text
                    ┌─────────────────────────────────┐
                    │         DOCKER NETWORK          │
                    │          (dsr-network)          │
                    │                                 │
    User ──────────►│  ┌─────────┐                    │
    :3000           │  │   APP   │◄──────────────┐    │
                    │  │ Next.js │               │    │
                    │  └────┬────┘               │    │
                    │       │                    │    │
                    │       ▼                    ▼    │
                    │  ┌─────────┐         ┌───────┐  │
                    │  │ MongoDB │         │ Redis │  │
                    │  │   7.0   │         │   7   │  │
                    │  └────┬────┘         └───┬───┘  │
                    │       ▼                  ▼      │
                    │  [mongo-data]      [redis-data] │
                    │    Volume            Volume     │
                    └─────────────────────────────────┘
```

### 3 Services

| Service | Aufgabe                | Port  | Image          |
| ------- | ---------------------- | ----- | -------------- |
| App     | Webanwendung (Next.js) | 3000  | dsr-app:latest |
| MongoDB | Datenbank              | 27017 | mongo:7.0      |
| Redis   | Cache & Sessions       | 6379  | redis:7-alpine |

### Warum diese Technologien?

| Technologie | Vorteile                                             |
| ----------- | ---------------------------------------------------- |
| **MongoDB** | Flexibles Schema, JSON-nativ, horizontal skalierbar  |
| **Redis**   | Extrem schnell (In-Memory), Session-Storage, Caching |

### Healthchecks (Automatische Überwachung)

| Service | Check                  | Interval | Aktion bei Fehler |
| ------- | ---------------------- | -------- | ----------------- |
| App     | `GET /api/health/live` | 30s      | Neustart          |
| MongoDB | `mongosh ping`         | 30s      | Neustart          |
| Redis   | `redis-cli ping`       | 30s      | Neustart          |

### Datenpersistenz (Volumes)

- **mongo-data**: Datenbank überlebt Container-Neustart
- **redis-data**: Cache-Daten bleiben erhalten
- Backup-fähig und getrennt von Anwendungslogik

### Deployment-Ablauf

```text
1. Code ändern
      ↓
2. docker-build.sh ausführen
      ↓
3. Image wird erstellt (~2 Min)
      ↓
4. docker compose up -d
      ↓
5. Healthcheck bestätigt Start
      ↓
6. Anwendung läuft!
```

### Sicherheit: Umgebungsvariablen

- Keine Secrets im Code (`.env` Datei)
- Verschiedene Umgebungen: Dev / Staging / Prod
- Sensible Daten: Passwörter, API-Keys, DB-Credentials

---

## Folie 8: Admin (David)

**Admin-Dashboard + Detailansicht/Prüfung**

### Dashboard

```text
src/app/(home)/admin/dashboard/page.tsx

┌─────────────────────────────────────────┐
│  KPI-Widgets (Drag & Drop)              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│  │Stats│ │Chart│ │List │ │Feed │        │
│  └─────┘ └─────┘ └─────┘ └─────┘        │
│  Auto-Refresh: 5 Minuten                │
└─────────────────────────────────────────┘
```

### Klassenverwaltung

```
src/app/(home)/admin/management/classes/page.tsx

Features:
- DataTable mit Sortierung/Filterung/Pagination
- CSV-Import/Export
- Inline-Bearbeitung
- QR-Code Generierung
```

### Studentenverwaltung

```
src/app/(home)/admin/management/students/page.tsx

Features:
- Filter nach Klasse/Status
- Inline-Klassenassignment (Autocomplete)
- Verifikationscode anzeigen/kopieren
- Detailansicht für alle Schülerdaten
```

### DataTable Komponente

```typescript
// src/components/organisms/tables/DataTable.tsx
<DataTable
  data={students}
  columns={columns}
  sortable
  filterable
  pagination
  onRowSelect={handleSelect}
/>
```

---

## Folie 9: Rechte (David)

**Sicherheit/Administration + Rollen/Berechtigungen**

### Authentifizierung

```typescript
// NextAuth.js Konfiguration
// src/app/api/auth/[...nextauth]/route.ts

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: { email, password },
      authorize: async (credentials) => {
        // bcrypt Passwort-Vergleich (Salt: 12)
        const valid = await bcrypt.compare(password, user.password);
        return valid ? user : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
};
```

### Rollen-System

| Rolle   | Zugriff                                |
| ------- | -------------------------------------- |
| Admin   | Vollzugriff auf Admin-Bereich          |
| Schüler | Unauthentifiziert (Code-Verifizierung) |

### Audit-Logging

```typescript
// src/models/AuditLog.ts
const AuditLogSchema = new Schema({
  action: String, // z.B. "student.create"
  userId: ObjectId,
  status: String, // success/failure/partial
  metadata: Object,
  createdAt: { type: Date, expires: 7776000 }, // 90 Tage TTL
});
```

### Audit-Kategorien

- `student.*` - Schüler-Operationen
- `class.*` - Klassen-Operationen
- `auth.*` - Login/Logout
- `settings.*` - Einstellungen

### Datensicherheit

- Normalisierte Namen für sichere Suche
- Recovery-Codes für Passwort-Reset
- Compound-Index auf sensiblen Daten

---

## Folie 10: Wirtschaftlichkeit (Philipp)

**Wirtschaftlichkeit + Abschluss**

### Effizienzgewinne

| Bereich          | v1 (Alt)        | v2 (Neu)                 |
| ---------------- | --------------- | ------------------------ |
| Dateneingabe     | Umständlich     | Self-Service + CSV       |
| Fehlerquote      | Hoch            | Automatische Validierung |
| Admin-Aufwand    | Hoch            | Reduziert                |
| Statusverfolgung | Unübersichtlich | Echtzeit-Dashboard       |
| Technologie      | Veraltet        | Modern (Next.js 15)      |
| Wartbarkeit      | Schwierig       | 964 Unit-Tests           |

### Open-Source Tech Stack

- **Kosteneffizient**: Keine Lizenzkosten
- **Skalierbar**: Docker-basiert
- **Wartbar**: 964 Unit-Tests

### Qualitätssicherung

```bash
# Test-Ausführung
yarn test              # Alle Tests
yarn test:coverage     # Mit Coverage-Report

# Ergebnis: 964 Tests
```

### Zusammenfassung

- Digitale Schülerregistrierung mit Self-Service
- Admin-Dashboard für effiziente Verwaltung
- Docker-Deployment für einfaches Hosting
- Sicherheit durch Auth + Audit-Logging

### Fragen?

---

## Anhang: Relevante Dateipfade

| Bereich             | Pfad                                                  |
| ------------------- | ----------------------------------------------------- |
| Schüler-Onboarding  | `src/app/(home)/student/[studentId]/page.tsx`         |
| Admin Dashboard     | `src/app/(home)/admin/dashboard/page.tsx`             |
| Klassenverwaltung   | `src/app/(home)/admin/management/classes/page.tsx`    |
| Studentenverwaltung | `src/app/(home)/admin/management/students/page.tsx`   |
| Form-Komponenten    | `src/components/organisms/forms/`                     |
| Docker-Compose      | `docker-compose.yml`                                  |
| Dockerfile          | `Dockerfile`, `Dockerfile.windows`                    |
| Build-Scripts       | `scripts/docker-build.sh`, `scripts/docker-build.ps1` |
| Auth Config         | `src/app/api/auth/[...nextauth]/route.ts`             |
| Audit-Log Model     | `src/models/AuditLog.ts`                              |
