import { Pagination } from "./api";
import { CourseResponse } from "./course";
import { SubjectResponse } from "./subject";

export interface GradeResponse {
  id: string;
  prelim: number | null;
  midterm: number | null;
  finals: number | null;
  finalGrade: number | null;
  remarks: "PASSED" | "FAILED" | null;
  studentId: string;
  subjectId: string;
  courseId: string;
  encodedByUserId: string;
  createdAt: string;
  updatedAt: string;
  subject: SubjectResponse;
  course: CourseResponse;
}

export interface GetGradesParams {
  courseId?: string;
  subjectId?: string;
  studentId?: string;
  page?: number;
  limit?: number;
}

export interface GetGradesData {
  grades: GradeResponse[];
  pagination: Pagination;
}

export interface CreateGradeRequest {
  studentId: string;
  subjectId: string;
  courseId: string;
  prelim?: number;
  midterm?: number;
  finals?: number;
}

export interface PatchGradeRequest {
  prelim?: number;
  midterm?: number;
  finals?: number;
}
