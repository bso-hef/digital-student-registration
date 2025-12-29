import { Student } from "./student";

export interface ClassInterface {
  _id: string;
  schoolYearFrom: Date | null;
  schoolYearTo: Date | null;
  name: string;
  grade: number | null;
  isVocational: boolean;
  requiresEmployerInfo: boolean;
  active: boolean;
  incomplete: boolean;
  studentCount?: number;
  students: Student[];
}

export interface ClassCreateInput {
  schoolYearFrom: Date | null;
  schoolYearTo: Date | null;
  name: string;
  grade: number | null;
  isVocational: boolean;
  requiresEmployerInfo: boolean;
  active: boolean;
  incomplete: boolean;
}

export type ClassCreateInputFormRow = {
  id: string;
  schoolYear: Date | null;
  name: string;
  grade: number | null;
  isVocational: boolean;
  requiresEmployerInfo?: boolean;
  active?: boolean;
  incomplete?: boolean;
  touched?: boolean;
  isValid?: boolean;
};

export type ShapedClassInvalid = { ok: false; reason: string };
export type ShapedClassValid = {
  ok: true;
  doc: {
    schoolYear: Date | null;
    name: string;
    grade: number | null;
    isVocational: boolean;
    requiresEmployerInfo?: boolean;
    active?: boolean;
  };
};

export type ShapedClass = ShapedClassInvalid | ShapedClassValid;
