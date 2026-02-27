import { Pagination } from "./api";

export interface CourseResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseSubjectResponse {
  id: string;
  code: string;
  title: string;
  units: number;
  slotLimit: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseWithSubjectsResponse extends CourseResponse {
  subjects: CourseSubjectResponse[];
}

export interface GetCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetCoursesData {
  courses: CourseResponse[];
  pagination?: Pagination;
}

export interface CreateCourseRequest {
  code: string;
  name: string;
  description: string;
}

export interface PatchCourseRequest {
  code?: string;
  name?: string;
  description?: string;
}

export interface AddSubjectItem {
  code: string;
  title: string;
  units: number;
  slotLimit?: number;
}

export interface AddSubjectsToCourseRequest {
  subjects: AddSubjectItem[];
}
