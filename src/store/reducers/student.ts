import type { StudentListFilters } from "@/lib/services/studentService";
import { ClassInterface } from "@/types/class.d";
import { Student } from "@/types/db";
import { StudentData } from "@/types/student";

import * as TYPES from "../types";
import { AppAction } from "../types";

interface StudentState {
  currentStep: number;
  previousStep: number | null;
  editingFromSummary: boolean;
  data: StudentData;
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: StudentListFilters;
  loading: boolean;
  error: Error | null;
  currentClass: ClassInterface | null;
  studentStatus: string | null;
  currentStudentId: string | null;
  currentStudent: Student | null;
  currentStudentLoading: boolean;
}

const initialStudentState: StudentState = {
  currentStep: 0,
  previousStep: null,
  editingFromSummary: false,
  data: {
    currentClass: "",
    currentClassData: null,
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
    herkunftsland: "",
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
    betriebApName: "",
    betriebApTelefon1: "",
    betriebApEmail: "",
    betriebAp2Anrede: "",
    betriebAp2Name: "",
    betriebAp2Telefon1: "",
    betriebAp2Email: "",
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
    ansprechpartner1Email: "",
    ansprechpartner2Art: "",
    ansprechpartner2Vorname: "",
    ansprechpartner2Nachname: "",
    ansprechpartner2Straße: "",
    ansprechpartner2HausNr: "",
    ansprechpartner2Plz: "",
    ansprechpartner2Ort: "",
    ansprechpartner2Mobil: "",
    ansprechpartner2Telefon1: "",
    ansprechpartner2Email: "",
    ansprechpartner3Art: "",
    ansprechpartner3Vorname: "",
    ansprechpartner3Nachname: "",
    ansprechpartner3Straße: "",
    ansprechpartner3HausNr: "",
    ansprechpartner3Plz: "",
    ansprechpartner3Ort: "",
    ansprechpartner3Mobil: "",
    ansprechpartner3Telefon1: "",
    ansprechpartner3Email: "",
    datenschutz: false,
    teilnahmeunterricht: false,
    schulordnung: false,
    personenabbildung: false,
    teamsnutzung: false,
  },
  students: [],
  pagination: {
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  },
  filters: {},
  loading: false,
  error: null,
  currentClass: null,
  studentStatus: null,
  currentStudentId: null,
  currentStudent: null,
  currentStudentLoading: false,
};

const studentReducer = (state = initialStudentState, action: AppAction) => {
  switch (action.type) {
    case TYPES.SET_STUDENT_CURRENT_STEP:
      return {
        ...state,
        previousStep: state.currentStep,
        currentStep: action.payload,
      };

    case TYPES.SET_EDITING_FROM_SUMMARY:
      return {
        ...state,
        editingFromSummary: action.payload,
      };

    case TYPES.GET_STUDENTS_REQUEST:
    case TYPES.ADD_STUDENTS_REQUEST:
    case TYPES.DELETE_STUDENTS_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.GET_STUDENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        students: action.payload.students,
        pagination: action.payload.pagination,
        filters: action.payload.filters,
      };

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

    case TYPES.UPDATE_STUDENT_ONBOARDING_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
        },
      };

    case TYPES.SET_STUDENT_ONBOARDING_CLASS:
      return {
        ...state,
        currentClass: action.payload || null,
        data: {
          ...state.data,
          currentClass: action.payload?._id || "",
          currentClassData: action.payload || null,
          klassenname: action.payload?.name || "",
        },
      };

    case TYPES.CLEAR_STUDENT_ONBOARDING_DATA:
      return {
        ...state,
        data: initialStudentState.data,
        currentStep: 0,
        previousStep: null,
        editingFromSummary: false,
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

    case TYPES.UPDATE_STUDENT_CLASS_REQUEST:
      return { ...state, loading: true, error: null };

    case TYPES.UPDATE_STUDENT_CLASS_SUCCESS:
      return { ...state, loading: false };

    case TYPES.UPDATE_STUDENT_CLASS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Admin student detail actions
    case TYPES.GET_STUDENT_REQUEST:
      return { ...state, currentStudentLoading: true, error: null };

    case TYPES.GET_STUDENT_SUCCESS:
      return {
        ...state,
        currentStudentLoading: false,
        currentStudent: action.payload,
      };

    case TYPES.GET_STUDENT_FAILURE:
      return { ...state, currentStudentLoading: false, error: action.payload };

    case TYPES.UPDATE_STUDENT_REQUEST:
      return { ...state, currentStudentLoading: true, error: null };

    case TYPES.UPDATE_STUDENT_SUCCESS:
      return {
        ...state,
        currentStudentLoading: false,
        currentStudent: action.payload,
      };

    case TYPES.UPDATE_STUDENT_FAILURE:
      return { ...state, currentStudentLoading: false, error: action.payload };

    case TYPES.CLEAR_CURRENT_STUDENT:
      return {
        ...state,
        currentStudent: null,
        currentStudentLoading: false,
      };

    default:
      return state;
  }
};

export default studentReducer;
