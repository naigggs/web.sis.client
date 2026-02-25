import { CourseResponse } from "./course";

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
