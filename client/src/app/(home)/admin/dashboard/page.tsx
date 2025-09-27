"use client";

import React from "react";

import AdminSettingsHeader from "@/components/molecules/AdminSettingsHeader";
import { Box, Typography, styled } from "@mui/material";

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  textAlign: "center",
  width: "100%",
  height: "100%",
  color: theme.palette.text.default,
}));

const DashboardPage = () => {
  return (
    <Wrapper>
      <AdminSettingsHeader title="Dashboard" />
      <Typography>
        1. Übersicht (Dashboard) Statistiken auf einen Blick Anzahl
        registrierter Studenten / Klassen Aktive Nutzer (Lehrer, Admins, Eltern)
        Letzte Logins / Aktivität Offene To-Dos (z. B. unbestätigte
        Registrierungen) Kacheln / Widgets “Neue Anmeldungen diese Woche”
        “Zuletzt exportierte Daten” “Offene Vereinbarungen” Charts Zeitverlauf
        der Registrierungen Verteilung nach Klassen / Jahrgang
      </Typography>
    </Wrapper>
  );
};

export default DashboardPage;
