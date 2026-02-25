import { Pagination } from "./api";
import { CourseResponse } from "./course";
import { GradeResponse } from "./grade";
import { ReservationResponse } from "./reservation";
import { SubjectStatusResponse } from "./subject";

export interface StudentResponse {
  id: string;
  studentNo: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course: CourseResponse;
  grades: GradeResponse[];
  reservations: ReservationResponse[];
  subjectStatus: SubjectStatusResponse[];
}

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  courseIds?: string[];
}

export interface GetStudentsData {
  students: StudentResponse[];
  pagination: Pagination;
}

export interface CreateStudentRequest {
  studentNo: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  courseId: string;
}

export interface PatchStudentRequest {
  studentNo?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  courseId?: string;
}

export interface ReserveSubjectRequest {
  subjectId: string;
}

export interface ImportStudentFailure {
  row: number;
  studentNo: string;
  error: string;
}

export interface ImportStudentsResponse {
  imported: number;
  failed: ImportStudentFailure[];
}
