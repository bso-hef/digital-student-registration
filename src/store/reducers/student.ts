import { ClassInterface } from "@/types/class.d";
import { Student } from "@/types/db";
import { StudentData } from "@/types/student";

import * as TYPES from "../types";
import { AppAction } from "./index";

interface StudentState {
  currentStep: number;
  data: StudentData;
  students: Student[];
  loading: boolean;
  error: Error | null;
  currentClass: ClassInterface | null;
  studentStatus: string | null;
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
  students: [],
  loading: false,
  error: null,
  currentClass: null,
  studentStatus: null,
};

const studentReducer = (state = initialStudentState, action: AppAction) => {
  switch (action.type) {
    case TYPES.SET_STUDENT_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };

    case TYPES.GET_STUDENTS_REQUEST:
    case TYPES.ADD_STUDENTS_REQUEST:
    case TYPES.DELETE_STUDENTS_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.GET_STUDENTS_SUCCESS:
      return { ...state, loading: false, students: action.payload };

    case TYPES.ADD_STUDENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        students: [...state.students, ...action.payload],
      };

    case TYPES.DELETE_STUDENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        students: state.students.filter(
          (student) => !action.payload.includes(student._id),
        ),
      };

    case TYPES.ADD_STUDENTS_FAILURE:
    case TYPES.GET_STUDENTS_FAILURE:
    case TYPES.DELETE_STUDENTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Onboarding actions
    case TYPES.UPDATE_STUDENT_ONBOARDING_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      };

    case TYPES.CLEAR_STUDENT_ONBOARDING_DATA:
      return {
        ...state,
        data: initialStudentState.data,
        currentStep: 0,
      };

    case TYPES.LOAD_STUDENT_FOR_ONBOARDING_REQUEST:
    case TYPES.SAVE_ONBOARDING_PROGRESS_REQUEST:
    case TYPES.SUBMIT_ONBOARDING_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.LOAD_STUDENT_FOR_ONBOARDING_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          ...action.payload.formData,
        },
        currentClass: action.payload.currentClass || null,
        studentStatus: action.payload.status || null,
      };

    case TYPES.SAVE_ONBOARDING_PROGRESS_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case TYPES.SUBMIT_ONBOARDING_SUCCESS:
      return {
        ...state,
        loading: false,
        currentStep: 0,
        data: initialStudentState.data,
      };

    case TYPES.LOAD_STUDENT_FOR_ONBOARDING_FAILURE:
    case TYPES.SAVE_ONBOARDING_PROGRESS_FAILURE:
    case TYPES.SUBMIT_ONBOARDING_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default studentReducer;
