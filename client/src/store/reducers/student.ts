import { StudentData } from "@/types/student";

import * as TYPES from "../types";
import { AppAction } from "./index";

interface StudentState {
  currentStep: number;
  data: StudentData;
  loading: boolean;
  error: Error | null;
}

const initialStudentState: StudentState = {
  currentStep: 0,
  data: {
    klassenname: "",
    vorname: "",
    nachname: "",
    geburtsname: "",
    straße: "",
    hausNr: "",
    postleitzahl: "",
    ort: "",
    geburtsort: "",
    geburtsland: "",
    zuzugsjahr: "",
    mobil: "",
    telefon1: "",
    email: "",
    religion: "",
    familiensprache: "",
    geburtsdatum: "",
    geschlecht: "",
    staatsangehoerigkeit1: "",
    staatsangehoerigkeit2: "",
    beruf: "",
    eintrittschule: "",
    abschlüsse: "",
    vorhergehendeSchule: "",
    vorhergehendeSchulform: "",
    vorhergehendeStufe: "",
    betriebApAnrede: "",
    betriebApVorname: "",
    betriebApNachname: "",
    betriebApTelefon1: "",
    betriebEintritt: "",
    betriebName: "",
    betriebStraße: "",
    betriebHausNr: "",
    betriebPlz: "",
    betriebOrt: "",
    betriebTelefon1: "",
    betriebEmail: "",
    ansprechpartner1Art: "",
    ansprechpartner1Vorname: "",
    ansprechpartner1Nachname: "",
    ansprechpartner1Straße: "",
    ansprechpartner1HausNr: "",
    ansprechpartner1Plz: "",
    ansprechpartner1Ort: "",
    ansprechpartner1Mobil: "",
    ansprechpartner1Telefon1: "",
    datenschutz: false,
    teilnahmeunterricht: false,
    schulordnung: false,
    personenabbildung: false,
    teamsnutzung: false,
  },
  loading: false,
  error: null,
};

const studentReducer = (state = initialStudentState, action: AppAction) => {
  switch (action.type) {
    case TYPES.SET_STUDENT_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };
    default:
      return state;
  }
};

export default studentReducer;
