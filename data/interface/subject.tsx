import { Pagination } from "./api";
import { CourseResponse } from "./course";
import { MissingPrerequisiteResponse } from "./missing-prerequisite";

export interface SubjectResponse {
  id: string;
  code: string;
  title: string;
  units: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course: CourseResponse;
}

export interface SubjectStatusResponse {
  id: string;
  code: string;
  title: string;
  units: number;
  eligible: boolean;
  alreadyReserved: boolean;
  missingPrerequisites: MissingPrerequisiteResponse[];
}

export interface GetSubjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
}

export interface GetSubjectsData {
  subjects: SubjectResponse[];
  pagination: Pagination;
}

export interface CreateSubjectRequest {
  code: string;
  title: string;
  units: number;
  courseId: string;
}

export interface PatchSubjectRequest {
  code?: string;
  title?: string;
  units?: number;
  courseId?: string;
}

export interface AddPrerequisiteRequest {
  prerequisiteSubjectId: string;
}
