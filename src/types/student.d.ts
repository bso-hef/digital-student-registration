export interface StudentData {
  klassenname: string;
  vorname: string;
  nachname: string;
  geburtsname: string;
  straße: string;
  hausNr: string;
  postleitzahl: string;
  ort: string;
  geburtsort: string;
  geburtsland: string;
  zuzugsjahr: string;
  mobil: string;
  telefon1: string;
  email: string;
  religion: string;
  familiensprache: string;
  geburtsdatum: string;
  geschlecht: string;
  staatsangehoerigkeit1: string;
  staatsangehoerigkeit2: string;
  beruf: string;
  eintrittschule: string;
  abschluesse: string;
  vorhergehendeSchule: string;
  vorhergehendeSchulform: string;
  vorhergehendeStufe: string;
  betriebApAnrede: string;
  betriebApVorname: string;
  betriebApNachname: string;
  betriebApTelefon1: string;
  betriebEintritt: string;
  betriebName: string;
  betriebStraße: string;
  betriebHausNr: string;
  betriebPlz: string;
  betriebOrt: string;
  betriebTelefon1: string;
  betriebEmail: string;
  ansprechpartner1Art: string;
  ansprechpartner1Vorname: string;
  ansprechpartner1Nachname: string;
  ansprechpartner1Straße: string;
  ansprechpartner1HausNr: string;
  ansprechpartner1Plz: string;
  ansprechpartner1Ort: string;
  ansprechpartner1Mobil: string;
  ansprechpartner1Telefon1: string;
  ansprechpartner2Art: string;
  ansprechpartner2Vorname: string;
  ansprechpartner2Nachname: string;
  ansprechpartner2Straße: string;
  ansprechpartner2HausNr: string;
  ansprechpartner2Plz: string;
  ansprechpartner2Ort: string;
  ansprechpartner2Mobil: string;
  ansprechpartner2Telefon1: string;
  ansprechpartner3Art: string;
  ansprechpartner3Vorname: string;
  ansprechpartner3Nachname: string;
  ansprechpartner3Straße: string;
  ansprechpartner3HausNr: string;
  ansprechpartner3Plz: string;
  ansprechpartner3Ort: string;
  ansprechpartner3Mobil: string;
  ansprechpartner3Telefon1: string;
  datenschutz: boolean;
  teilnahmeunterricht: boolean;
  schulordnung: boolean;
  personenabbildung: boolean;
  teamsnutzung: boolean;
}

export type StudentFormRow = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  touched?: boolean;
  isValid?: boolean;
};

export type CreateStudentInput = Pick<
  Student,
  "firstName" | "lastName" | "dateOfBirth"
> & { status?: Student["status"] };

export type GenderType = "male" | "female" | "diverse" | undefined;
