export interface CourseResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCoursesParams {
  search?: string;
}

export interface GetCoursesData {
  courses: CourseResponse[];
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
