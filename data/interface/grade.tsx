import { CourseResponse } from "./course";
import { SubjectResponse } from "./subject";

export interface GradeResponse {
  id: string;
  prelim: string;
  midterm: string;
  finals: string;
  finalGrade: string;
  remarks: string;
  studentId: string;
  courseId: string;
  encodedByUserId: string;
  createdAt: string;
  updatedAt: string;
  subject: SubjectResponse;
  course: CourseResponse;
}

export interface CreateGradeRequest {
  studentId: string;
  subjectId: string;
  courseId: string;
  prelim: string;
  midterm: string;
  finals: string;
}

export interface PatchGradeRequest {
  prelim?: string;
  midterm?: string;
  finals?: string;
}
