import { ClassInterface } from "@/types/class.d";
import { Student } from "@/types/db";
import { StudentData } from "@/types/student";

import * as TYPES from "../types";
import { AppAction } from "../types";

interface StudentState {
  currentStep: number;
  previousStep: number | null;
  data: StudentData;
  students: Student[];
  loading: boolean;
  error: Error | null;
  currentClass: ClassInterface | null;
  studentStatus: string | null;
  currentStudentId: string | null;
  currentStudent: Student | null;
}

const initialStudentState: StudentState = {
  currentStep: 0,
  previousStep: null,
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
    abschluesse: "",
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
    // Contact Person 1
    ansprechpartner1Art: "",
    ansprechpartner1Vorname: "",
    ansprechpartner1Nachname: "",
    ansprechpartner1Straße: "",
    ansprechpartner1HausNr: "",
    ansprechpartner1Plz: "",
    ansprechpartner1Ort: "",
    ansprechpartner1Mobil: "",
    ansprechpartner1Telefon1: "",
    // Contact Person 2
    ansprechpartner2Art: "",
    ansprechpartner2Vorname: "",
    ansprechpartner2Nachname: "",
    ansprechpartner2Straße: "",
    ansprechpartner2HausNr: "",
    ansprechpartner2Plz: "",
    ansprechpartner2Ort: "",
    ansprechpartner2Mobil: "",
    ansprechpartner2Telefon1: "",
    // Contact Person 3
    ansprechpartner3Art: "",
    ansprechpartner3Vorname: "",
    ansprechpartner3Nachname: "",
    ansprechpartner3Straße: "",
    ansprechpartner3HausNr: "",
    ansprechpartner3Plz: "",
    ansprechpartner3Ort: "",
    ansprechpartner3Mobil: "",
    ansprechpartner3Telefon1: "",
    // Agreements
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
  currentStudentId: null,
  currentStudent: null,
};

const studentReducer = (state = initialStudentState, action: AppAction) => {
  switch (action.type) {
    case TYPES.SET_STUDENT_CURRENT_STEP:
      return {
        ...state,
        previousStep: state.currentStep, // Save current step as previous before changing
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
        previousStep: null,
        currentStudentId: null,
        currentStudent: null,
        currentClass: null,
        studentStatus: null,
      };

    case TYPES.CLEAR_STUDENT_ERROR:
      return {
        ...state,
        error: null,
      };

    case TYPES.LOAD_STUDENT_FOR_ONBOARDING_REQUEST:
    case TYPES.SAVE_ONBOARDING_PROGRESS_REQUEST:
    case TYPES.SUBMIT_ONBOARDING_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.LOAD_STUDENT_FOR_ONBOARDING_SUCCESS:
      console.log("[Student Reducer] LOAD_STUDENT_FOR_ONBOARDING_SUCCESS");
      console.log(
        "[Student Reducer] Payload formData:",
        action.payload.formData,
      );
      console.log("[Student Reducer] Previous state.data:", state.data);

      const newState = {
        ...state,
        loading: false,
        data: {
          ...state.data,
          ...action.payload.formData,
        },
        currentStep: action.payload.onboardingStep || 0,
        previousStep: action.payload.previousStep ?? null,
        currentClass: action.payload.currentClass || null,
        studentStatus: action.payload.status || null,
        currentStudentId: action.payload.studentId || null,
        currentStudent: action.payload.student || null,
      };

      console.log("[Student Reducer] New state.data:", newState.data);
      console.log("[Student Reducer] Basic fields:", {
        vorname: newState.data.vorname,
        nachname: newState.data.nachname,
        geburtsdatum: newState.data.geburtsdatum,
      });

      return newState;

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
        previousStep: null,
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
