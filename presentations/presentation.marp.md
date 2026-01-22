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
  section.title h1 { color: #fff; font-size: 3.2em; font-weight: 800; margin-bottom: 0.3em; }
  section.title p { color: #D1F3F4; font-size: 1.4em; font-weight: 600; margin: 0.3em 0; }

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
    height: 676px;
    box-sizing: border-box;
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
    font-size: 14px;
    line-height: 18px;
    font-weight: 500;
  }
  .nav-item.active {
    background: #F3F5F7;
    color: #4DBFC3;
    font-size: 14px;
    line-height: 18px;
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
    height: 100%;
    box-sizing: border-box;
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

  /* Small Table */
  .small-table th { font-size: 14px; padding: 8px 12px; font-weight: 700; }
  .small-table td { font-size: 13px; padding: 6px 12px; }

  /* Medium Table - Zwischen Mid und Large */
  .medium-table th { font-size: 18px; padding: 10px 16px; font-weight: 700; }
  .medium-table td { font-size: 16px; padding: 8px 16px; }

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

  /* Dashboard Cards */
  .dash-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
  .dash-card {
    border-radius: 10px;
    padding: 20px 12px;
    color: #fff;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .dash-card.blue { background: linear-gradient(135deg, #667eea 0%, #4fc3f7 100%); }
  .dash-card.purple { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  .dash-card.pink { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
  .dash-card.green { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
  .dash-card h3 { font-size: 32px; margin: 0 0 6px 0; font-weight: 800; }
  .dash-card p { font-size: 11px; margin: 0; opacity: 0.95; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600; }

  /* Chart Grid */
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .chart-box {
    background: #fff;
    border: 1px solid #D8DFE0;
    border-radius: 8px;
    padding: 8px;
  }
  .chart-box h4 { font-size: 11px; margin: 0 0 6px 0; color: #515053; font-weight: 600; }
---

<!-- _class: title -->

# Digitale Schulanmeldung

v2.1.0 - Next.js 15 - React 19 - MongoDB - Docker

Philipp - Constantin - Valentin - Alex - David - Manuel

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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
    <div class="nav-item">11. Quellen</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
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
<tr><td><strong>Wartbarkeit</strong></td><td>Schwierig</td><td>Modular + Testbar</td></tr>
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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
    <div class="nav-item">11. Quellen</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
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

  <table class="medium-table">
  <tr><th>Person</th><th>Verantwortlichkeit</th></tr>
  <tr><td><strong>Philipp</strong></td><td>Projektleitung, Fazit</td></tr>
  <tr><td><strong>Constantin</strong></td><td>Design, UX</td></tr>
  <tr><td><strong>Valentin</strong></td><td>Anmeldung, Architektur</td></tr>
  <tr><td><strong>Alex</strong></td><td>Deployment, Infrastruktur</td></tr>
  <tr><td><strong>David</strong></td><td>Admin, Sicherheit</td></tr>
  <tr><td><strong>Manuel</strong></td><td>Unterstützung</td></tr>
  </table>

<img src="./img/git-flow.svg" alt="Git-Flow" style="width: 100%; max-width: 520px;" />

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
    <div class="nav-item active">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
    <div class="nav-item">11. Quellen</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Design - UI / UX</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

<table class="large-table">
<tr><th>Feature</th><th>Beschreibung</th></tr>
<tr><td><strong>Legasthenie-Schrift</strong></td><td>OpenDyslexic Font</td></tr>
<tr><td><strong>High Contrast</strong></td><td>Erhöhter Kontrast für Sehbehinderte</td></tr>
<tr><td><strong>i18n</strong></td><td>Deutsch / Englisch</td></tr>
<tr><td><strong>Theme Toggle</strong></td><td>Light und Dark Mode</td></tr>
</table>

<div style="max-width: 50%; width: 50%;"> <img src="./img/atomic-design.svg" alt="atomic-design" style="height: 200px; width: 200px;" /> </div>

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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item active">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
    <div class="nav-item">11. Quellen</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
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

<table class="medium-table">
  <tr><th>Schritt</th><th>Optional</th><th>Bedingung</th></tr>
  <tr><td>0: Willkommen</td><td>Nein</td><td>-</td></tr>
  <tr><td>1: Allgemein</td><td>Nein</td><td>-</td></tr>
  <tr><td><strong>2: Herkunft</strong></td><td><strong>Ja</strong></td><td>Geburtsland ≠ DE</td></tr>
  <tr><td>3-5: Adresse, Eltern, Bildung</td><td>Nein</td><td>-</td></tr>
  <tr><td><strong>6-7: Ausbildung, Betrieb</strong></td><td><strong>Ja</strong></td><td>Berufsausbildung</td></tr>
  <tr><td>8-10: Vereinbarungen, Übersicht, Fertig</td><td>Nein</td><td>-</td></tr>
</table>

<img src="./img/wizard-flow.svg" alt="wizard-flow" style="width: 100%; max-width: 520px; margin-top: 15px;" />
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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item active">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
    <div class="nav-item">11. Quellen</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Architektur</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

<table class="small-table">
  <tr><th>Technologie</th><th>Zweck</th><th>Beschreibung</th></tr>
  <tr><td>Next.js 15</td><td>App Router, SSR</td><td>React-Framework für Server-Side Rendering</td></tr>
  <tr><td>React 19</td><td>JS Framework</td><td>Komponentenbasierte UI-Bibliothek</td></tr>
  <tr><td>TypeScript 5</td><td>Typsicherheit</td><td>Statische Typprüfung für JavaScript</td></tr>
  <tr><td>Redux Toolkit</td><td>State Management</td><td>Zentraler Anwendungszustand</td></tr>
  <tr><td>Formik + Yup</td><td>Formulare</td><td>Formularhandling mit Validierung</td></tr>
  <tr><td>i18n</td><td>Internationalisierung</td><td>Mehrsprachigkeit (DE/EN)</td></tr>
  <tr><td>Sonner</td><td>Benachrichtigungen</td><td>Toast-Meldungen für Benutzer</td></tr>
</table>

<img src="./img/project-structure.svg" alt="Projektstruktur" style="width: 100%; max-width: 560px;" />

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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item active">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
    <div class="nav-item">11. Quellen</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
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

<table class="large-table">
  <tr><th>Merkmal</th><th>Beschreibung</th></tr>
  <tr><td>Konsistent</td><td>Entwicklungs- und Produktionsumgebung identisch</td></tr>
  <tr><td>Schnell</td><td>Vollständiges Deployment in unter 5 Minuten</td></tr>
  <tr><td>Sicher</td><td>Rootless Container, keine Privilegien-Eskalation</td></tr>
  <tr><td>Plattform</td><td>Unterstützung für Linux und Windows</td></tr>
  <tr><td>Versioniert</td><td>Images werden mit Tags versioniert</td></tr>
</table>

<img src="./img/docker-stages.svg" alt="Deployment Workflow" style="width: 100%; max-width: 560px;" />

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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item active">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
    <div class="nav-item">11. Quellen</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
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

<table class="large-table">
  <tr><th>Service</th><th>Port</th><th>Beschreibung</th><th>Healthcheck</th></tr>
  <tr><td>App</td><td>3000</td><td>Next.js Anwendung</td><td><code>/api/health/live</code></td></tr>
  <tr><td>MongoDB</td><td>27017</td><td>Datenbank</td><td><code>mongosh ping</code></td></tr>
  <tr><td>Redis</td><td>6379</td><td>Session-Speicher</td><td><code>redis-cli ping</code></td></tr>
</table>

<img src="./img/network-arch.svg" alt="Netzwerk-Architektur" style="width: 100%; max-width: 560px;" />

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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item active">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
    <div class="nav-item">11. Quellen</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Dashboard</h2>
  </div>
  <div class="content-body">

<div class="dash-grid">
  <div class="dash-card purple">
    <h3>1.234</h3>
    <p>Schüler gesamt</p>
  </div>
  <div class="dash-card blue">
    <h3>42</h3>
    <p>Klassen gesamt</p>
  </div>
  <div class="dash-card pink">
    <h3>3</h3>
    <p>Nicht zugeordnete Schüler</p>
  </div>
  <div class="dash-card green">
    <h3>87%</h3>
    <p>Onboarding-Fortschritt</p>
  </div>
</div>

<div class="chart-grid">
  <div class="chart-box">
    <h4>Schülerstatus</h4>
    <img src="./img/chart-status.svg" alt="Status" style="width: 100%;" />
  </div>
  <div class="chart-box">
    <h4>Klassenverteilung</h4>
    <img src="./img/chart-classes.svg" alt="Klassen" style="width: 100%;" />
  </div>
</div>

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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item active">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Sicherheit</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

<table class="small-table">
  <tr><th>Merkmal</th><th>Admin</th><th>Schüler</th></tr>
  <tr><td><strong>Authentifizierung</strong></td><td>JWT via NextAuth.js</td><td>6-stelliger Code (QR)</td></tr>
  <tr><td><strong>Passwort</strong></td><td>bcrypt (Salt: 12)</td><td>Nicht erforderlich</td></tr>
  <tr><td><strong>Sessions</strong></td><td>Redis (TTL: 24h)</td><td>Temporär (nur Wizard)</td></tr>
  <tr><td><strong>Audit-Logging</strong></td><td>90 Tage Aufbewahrung</td><td>-</td></tr>
  <tr><td><strong>Recovery</strong></td><td>Recovery-Codes</td><td>Neuer QR-Code</td></tr>
</table>

<img src="./img/auth-flow.svg" alt="Auth-Flow" style="width: 100%; max-width: 560px;" />

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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item active">10. Fazit</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Fazit</h2>
    <div class="content-actions">
      <div class="action-search">Suchen...</div>
      <div class="action-btn">Speichern</div>
    </div>
  </div>
  <div class="content-body">

<table class="large-table">
  <tr><th>Bereich</th><th>v1 (Alt)</th><th>v2 (Neu)</th></tr>
  <tr><td>Dateneingabe</td><td>Umständlich</td><td>Self-Service + CSV</td></tr>
  <tr><td>Fehlerquote</td><td>Hoch</td><td>Auto-Validierung</td></tr>
  <tr><td>Wartbarkeit</td><td>Schwierig</td><td>Modular + Testbar</td></tr>
  <tr><td>Design</td><td>Veraltet</td><td><strong>Responsive</strong> + Modern</td></tr>
</table>

<img src="./img/advantages.svg" alt="Vorteile v2" style="width: 100%; max-width: 520px;" />

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
    <div class="nav-item">3. Design - UI / UX</div>
    <div class="nav-item">4. Anmeldung</div>
    <div class="nav-item">5. Architektur</div>
    <div class="nav-item">6. Deployment</div>
    <div class="nav-item">7. Infrastruktur</div>
    <div class="nav-item">8. Dashboard</div>
    <div class="nav-item">9. Sicherheit</div>
    <div class="nav-item">10. Fazit</div>
    <div class="nav-item active">11. Quellen</div>
  </div>
  <div class="nav-footer">
    <img src="./img/logo.svg" alt="BSO Logo" />
    <div class="nav-version">Digitale Schulanmeldung v2.1.0</div>
  </div>
</div>

<div class="content">
  <div class="content-header">
    <h2 class="content-title">Quellen</h2>
  </div>
  <div class="content-body">

<table class="large-table">
  <tr><th>Interne Dokumente</th><th>Externe Quellen</th><th>Präsentation</th></tr>
  <tr><td>Lastenheft</td><td><a href="https://nextjs.org/docs">Next.js Docs</a></td><td><a href="https://claude.ai">Claude AI</a></td></tr>
  <tr><td>Pflichtenheft</td><td><a href="https://react.dev">React Docs</a></td><td><a href="https://marp.app">Marp</a></td></tr>
  <tr><td>Projektdokumentation</td><td><a href="https://mui.com">Material-UI Docs</a></td><td>SVG-Grafiken</td></tr>
  <tr><td>Projektplanung</td><td><a href="https://mongodb.com/docs">MongoDB Docs</a></td><td>-</td></tr>
  <tr><td>-</td><td><a href="https://docker.com/docs">Docker Docs</a></td><td>-</td></tr>
  <tr><td>-</td><td><a href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYxkrIt20aCdN8RD6-7ILWHaQNx-ZK4MgcLg&s">Logo BSO</a></td><td>-</td></tr>
</table>

  </div>
</div>

---

<!-- _class: title -->

# Fragen?

Digitale Schulanmeldung v2.1.0

Next.js 15 - React 19 - MongoDB - Docker
