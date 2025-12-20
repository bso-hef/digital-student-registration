# ✅ Schülerverwaltung – Gesamt-Checkliste

## 🎨 Icons (UI-Standard)

- [x] Alle Icons müssen **rounded** sein
- [x] Einheitlicher Stil (keine Mischung aus sharp / outlined / rounded)
- [x] Gilt für:
  - [x] Tabellen (Edit-, Action-Icons)
  - [x] Buttons
  - [x] Formulare
  - [x] Dialoge / Modals
- [x] Abweichungen nur bei expliziter Vorgabe erlaubt

---

## 🔍 Filteroptionen (Schülerverwaltung)

- [x] Filter nach **Klasse**
- [x] Filter **Berufsschüler (Ja/Nein)**
- [x] Filter **Status**

---

## 📊 Tabelle / Pagination

- [x] Pagination-Text nicht `1–5 of 16`
- [x] Anzeige stattdessen: **`5 von 16`**
- [x] Übersetzung global gelöst (i18n / MUI override)
- [x] Kein Hardcoding pro Tabelle

---

## 🌍 Origin / Herkunft (UI-Logik)

- [x] Origin-Step nur anzeigen, wenn **Land ≠ Deutschland**
- [x] Bei Deutschland:
  - [x] Feld ausgeblendet
  - [x] Keine Pflichtvalidierung
  - [x] Kein leerer State

---

## 🏷️ Labels / Textanpassungen

- [x] `Vorbildung` → **`(aktueller) Bildungsstand`**
- [x] `Abschluss` → **`höchster bisheriger Abschluss`**
- [x] Konsistent in:
  - [x] Formularen
  - [x] Tabellen
  - [x] Detailansichten
  - [x] Exports / PDFs

---

## 📄 WLAN-QR-Code → PDF

### PDF-Struktur

- [ ] Entweder: **1 PDF pro Klasse**
- [ ] Oder: **1 PDF mit Trennblättern je Klasse**
- [x] Repair student export preview and pdf

### Import / Verknüpfung

- [x] Beim Import prüfen, ob Klasse enthalten ist
- [x] Wenn Klasse vorhanden:
  - [x] Datensatz erstellen
  - [x] Sauber verknüpfen (keine Duplikate)
- [x] Keine impliziten Annahmen

### Andere

- [x] Wenn kein Schüler ausgewählt ist, qr code erstellen für /student und neue Schüler
- [x] QR code für WLAN & für login mit icons
- [x] Classen import via CSV (neu import muss die daten aktualisieren)
- [x] Classen export via CSV
- [x] Localhost inside QR code PDF
- [x] Same Date Field like inside wizzard
- [x] training form issues
- [x] Next.js 15.4.2 has a critical vulnerability (CVE-2025-66478) that could allow attackers to execute arbitrary code on your
      server. Run `yarn upgrade next` to update.
- [ ] Fix all issues from Excel
