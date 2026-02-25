import { CourseResponse } from "./course";

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
