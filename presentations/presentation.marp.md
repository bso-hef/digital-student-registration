---
marp: true
theme: default
paginate: false
size: 16:9
style: |
  /* Page Background */
  section {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    background: #F3F5F7;
    color: #515053;
    font-size: 14px;
    padding: 24px;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 20px;
    align-items: stretch;
  }

  /* Title Slide - No Grid */
  section.title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #4DBFC3, #5AA5A7);
    color: #fff;
    text-align: center;
  }
  section.title h1 { color: #fff; font-size: 2.4em; margin-bottom: 0.2em; }
  section.title p { color: #D1F3F4; font-size: 1.1em; margin: 0.2em 0; }

  /* Navigation Panel */
  .nav {
    background: #FFFFFF;
    border: 1px solid #D8DFE0;
    border-radius: 16px;
    padding: 16px 14px;
    box-shadow: rgba(0,0,0,0.08) 0px 4px 12px;
    font-size: 11px;
    display: flex;
    flex-direction: column;
    min-height: 420px;
  }

  /* Avatar Section */
  .nav-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 6px;
  }
  .avatar-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4DBFC3, #5AA5A7);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    font-size: 18px;
  }
  .welcome-text {
    color: #7B7A7E;
    font-size: 12px;
    line-height: 16px;
    margin: 0;
  }
  .name-text {
    color: #515053;
    font-size: 14px;
    line-height: 16px;
    font-weight: 600;
    margin: 2px 0 0 0;
  }
  .job-text {
    color: #7B7A7E;
    font-size: 10px;
    line-height: 14px;
    margin: 0;
  }

  /* Search Input */
  .nav-search {
    background: #FFFFFF;
    border: 1px solid #D8DFE0;
    border-radius: 4px;
    padding: 8px 10px;
    margin: 8px 0 12px 0;
    color: #7B7A7E;
    font-size: 10px;
  }

  /* Divider */
  .nav-divider {
    height: 1px;
    background: #D8DFE0;
    margin: 8px 0;
  }

  /* Navigation Items */
  .nav-items {
    flex: 1;
    overflow: hidden;
  }
  .nav-item {
    padding: 6px 10px;
    border-radius: 8px;
    margin: 2px 0;
    color: #515053;
  }
  .nav-item.active {
    background: #F3F5F7;
    color: #4DBFC3;
    font-weight: 600;
  }

  /* Footer with Logo */
  .nav-footer {
    margin-top: auto;
    padding-top: 12px;
    text-align: center;
  }
  .nav-footer img {
    max-width: 140px;
    height: auto;
    margin-bottom: 4px;
  }
  .nav-version {
    color: #7B7A7E;
    font-size: 9px;
  }

  /* Content Panel */
  .content {
    background: #FFFFFF;
    border: 1px solid #D8DFE0;
    border-radius: 16px;
    box-shadow: rgba(0,0,0,0.08) 0px 4px 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 420px;
  }

  /* Content Header (AdminSettingsHeader) */
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #D8DFE0;
    max-height: 70px;
  }
  .content-title {
    font-size: 18px;
    line-height: 22px;
    font-weight: 700;
    color: #515053;
    margin: 0;
  }
  .content-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .action-search {
    background: #F3F5F7;
    border: 1px solid #D8DFE0;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 10px;
    color: #7B7A7E;
    min-width: 120px;
  }
  .action-btn {
    background: #4DBFC3;
    color: #fff;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 10px;
    font-weight: 500;
  }

  /* Content Body */
  .content-body {
    padding: 16px 20px;
    flex: 1;
    overflow: hidden;
    font-size: 12px;
  }

  /* Typography in content */
  .content-body h1 { color: #4DBFC3; font-size: 1.2em; margin: 0 0 10px 0; }
  .content-body h2 { color: #5AA5A7; font-size: 1em; margin: 8px 0 4px 0; }

  /* Tables */
  table { font-size: 0.85em; width: 100%; border-collapse: collapse; margin: 6px 0; }
  th { background: #4DBFC3; color: #fff; padding: 5px 8px; text-align: left; font-size: 10px; }
  td { background: #FAFAFA; padding: 4px 8px; border-bottom: 1px solid #D8DFE0; font-size: 10px; }

  /* Large Table for Einleitung */
  .large-table th { font-size: 22px; padding: 14px 20px; font-weight: 800; }
  .large-table td { font-size: 20px; padding: 12px 20px; }

  /* Code */
  code { background: #D1F3F4; color: #282829; padding: 1px 4px; border-radius: 3px; font-size: 0.8em; }
  pre { background: #282829; color: #82D7DA; padding: 8px; border-radius: 6px; font-size: 0.65em; margin: 4px 0; }

  /* Content Images */
  .content-body img { max-width: 100%; height: auto; margin: 6px 0; }

  /* Lists */
  ul, ol { margin: 4px 0; padding-left: 1.1em; }
  li { margin: 2px 0; font-size: 11px; }

  strong { color: #4DBFC3; }
---

<!-- _class: title -->

# Digital Student Registration

v2.1.0 - Next.js 15 - React 19 - MongoDB - Docker

Philipp - Constantin - Valentin - Alex - David

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item active">1. Einleitung</div>
    <div class="nav-item">2. Projektmanagement</div>
    <div class="nav-item">3. Design/UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Frontend</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Admin</div>
    <div class="nav-item">9. Rechte</div>
    <div class="nav-item">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title" style="font-size: 22px; font-weight: 800;">Einleitung</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

<table class="large-table">
<tr><th>Aspekt</th><th>v1 (Alt)</th><th>v2 (Neu)</th></tr>
<tr><td><strong>Technologie</strong></td><td>Veraltet</td><td>Next.js 15, React 19</td></tr>
<tr><td><strong>UX</strong></td><td>Schlecht</td><td>Modern, Self-Service</td></tr>
<tr><td><strong>Wartbarkeit</strong></td><td>Schwierig</td><td>964 Unit-Tests</td></tr>
<tr><td><strong>Status</strong></td><td>Unübersichtlich</td><td>Echtzeit-Dashboard</td></tr>
</table>

<img src="./img/process-flow.svg" alt="Prozess-Flow" style="max-width: 35%; height: auto;" />
  </div>
</div>

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item">1. Einleitung</div>
    <div class="nav-item active">2. Projektmanagement</div>
    <div class="nav-item">3. Design/UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Frontend</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Admin</div>
    <div class="nav-item">9. Rechte</div>
    <div class="nav-item">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Projektmanagement</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

| Person     | Verantwortlichkeit                 |
| ---------- | ---------------------------------- |
| Philipp    | Projektleitung, Wirtschaftlichkeit |
| Constantin | Design, UX                         |
| Valentin   | Anmeldung, Frontend                |
| Alex       | Deployment, Infrastruktur          |
| David      | Admin, Sicherheit                  |

**Git-Flow:**

![Git-Flow](./img/git-flow.svg)

**Tools:** GitHub Issues - Pull Requests - Actions - Code Reviews

  </div>
</div>

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item">1. Einleitung</div>
    <div class="nav-item">2. Projektmanagement</div>
    <div class="nav-item active">3. Design/UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Frontend</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Admin</div>
    <div class="nav-item">9. Rechte</div>
    <div class="nav-item">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Design/UX</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

| Feature             | Beschreibung                        |
| ------------------- | ----------------------------------- |
| Legasthenie-Schrift | OpenDyslexic Font                   |
| High Contrast       | Erhöhter Kontrast für Sehbehinderte |
| i18n                | Deutsch / Englisch                  |
| Theme Toggle        | Light und Dark Mode                 |

**Atomic Design Pattern:**

![Atomic Design](./img/atomic-design.svg)

**Farben:** Primary `#4DBFC3` - Text `#515053` - Background `#F3F5F7`

  </div>
</div>

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item">1. Einleitung</div>
    <div class="nav-item">2. Projektmanagement</div>
    <div class="nav-item">3. Design/UX</div>
    <div class="nav-item active">4. Anmeldung</div>
    <div class="nav-item">5. Frontend</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Admin</div>
    <div class="nav-item">9. Rechte</div>
    <div class="nav-item">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Anmeldung</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

**Wizard: 11 Schritte, 3 optional**

| Schritte                         | Optional? | Bedingung         |
| -------------------------------- | --------- | ----------------- |
| 0-1: Welcome, General            | Nein      | -                 |
| **2: Origin**                    | **Ja**    | Geburtsland != DE |
| 3-5: Address, Parents, Education | Nein      | -                 |
| **6-7: Training, Company**       | **Ja**    | Berufsausbildung  |
| 8-10: Agreements, Summary, Done  | Nein      | -                 |

**Wizard-Flow:**

![Wizard-Flow](./img/wizard-flow.svg)

  </div>
</div>

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item">1. Einleitung</div>
    <div class="nav-item">2. Projektmanagement</div>
    <div class="nav-item">3. Design/UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item active">5. Frontend</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Admin</div>
    <div class="nav-item">9. Rechte</div>
    <div class="nav-item">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Frontend</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

| Technologie   | Zweck                   |
| ------------- | ----------------------- |
| Next.js 15    | App Router, SSR         |
| React 19      | UI Framework            |
| TypeScript 5  | Type Safety             |
| Redux Toolkit | State Management        |
| Formik + Yup  | Formulare + Validierung |

**Projektstruktur:**

![Projektstruktur](./img/project-structure.svg)

  </div>
</div>

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item">1. Einleitung</div>
    <div class="nav-item">2. Projektmanagement</div>
    <div class="nav-item">3. Design/UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Frontend</div>
    <div class="nav-item active">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Admin</div>
    <div class="nav-item">9. Rechte</div>
    <div class="nav-item">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Deployment</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

| Feature    | Beschreibung                |
| ---------- | --------------------------- |
| Konsistent | Dev = Prod Environment      |
| Schnell    | unter 5 Min Deployment      |
| Sicher     | Non-root, no-new-privileges |
| Plattform  | Linux + Windows Support     |

**Docker Multi-Stage Build:**

![Docker Stages](./img/docker-stages.svg)

**Befehle:** `./scripts/docker-build.sh` + `docker compose up`

  </div>
</div>

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item">1. Einleitung</div>
    <div class="nav-item">2. Projektmanagement</div>
    <div class="nav-item">3. Design/UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Frontend</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item active">7. Infrastruktur</div>
    <div class="nav-item">8. Admin</div>
    <div class="nav-item">9. Rechte</div>
    <div class="nav-item">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Infrastruktur</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

| Service | Port  | Healthcheck        |
| ------- | ----- | ------------------ |
| App     | 3000  | `/api/health/live` |
| MongoDB | 27017 | `mongosh ping`     |
| Redis   | 6379  | `redis-cli ping`   |

**Netzwerk-Architektur:**

![Netzwerk-Architektur](./img/network-arch.svg)

**Volumes:** `mongo-data` + `redis-data` (persistente Daten)

  </div>
</div>

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item">1. Einleitung</div>
    <div class="nav-item">2. Projektmanagement</div>
    <div class="nav-item">3. Design/UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Frontend</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item active">8. Admin</div>
    <div class="nav-item">9. Rechte</div>
    <div class="nav-item">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Admin</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

| Bereich   | Features                                 |
| --------- | ---------------------------------------- |
| Klassen   | DataTable, CSV-Import/Export, QR-Codes   |
| Schüler   | Filter, Inline-Assignment, Detailansicht |
| Dashboard | Status-Übersicht, Statistiken            |

**Dashboard Layout:**

![Dashboard Layout](./img/dashboard-layout.svg)

  </div>
</div>

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item">1. Einleitung</div>
    <div class="nav-item">2. Projektmanagement</div>
    <div class="nav-item">3. Design/UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Frontend</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Admin</div>
    <div class="nav-item active">9. Rechte</div>
    <div class="nav-item">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Rechte</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

| Rolle   | Zugriff                              |
| ------- | ------------------------------------ |
| Admin   | Vollzugriff (JWT via NextAuth.js)    |
| Schüler | Unauthentifiziert (6-stelliger Code) |

**Authentifizierungs-Flow:**

![Auth-Flow](./img/auth-flow.svg)

**Sicherheit:** Audit-Logging (90d) + Recovery-Codes + Redis Sessions

  </div>
</div>

---

<div class="nav">
  <div class="nav-avatar">
    <div class="avatar-circle">AU</div>
    <p class="welcome-text">Willkommen</p>
    <p class="name-text">Admin User</p>
    <p class="job-text">Schulverwaltung</p>
  </div>
  <div class="nav-divider"></div>
  <div class="nav-search">Einstellungen durchsuchen</div>
  <div class="nav-items">
    <div class="nav-item">1. Einleitung</div>
    <div class="nav-item">2. Projektmanagement</div>
    <div class="nav-item">3. Design/UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Frontend</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Admin</div>
    <div class="nav-item">9. Rechte</div>
    <div class="nav-item active">10. Wirtschaftlichkeit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digital Student Registration v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Wirtschaftlichkeit</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

| Bereich      | v1 (Alt)    | v2 (Neu)           |
| ------------ | ----------- | ------------------ |
| Dateneingabe | Umständlich | Self-Service + CSV |
| Fehlerquote  | Hoch        | Auto-Validierung   |
| Wartbarkeit  | Schwierig   | **964 Tests**      |
| Lizenzkosten | Unbekannt   | **0 EUR** (OSS)    |

**Vorteile v2:**

![Vorteile v2](./img/vorteile-v2.svg)

  </div>
</div>

---

<!-- _class: title -->

# Fragen?

Digital Student Registration v2.1.0

Next.js 15 - React 19 - MongoDB - Docker
