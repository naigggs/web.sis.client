export interface CourseResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  code: string;
  name: string;
  description: string;
}

export interface PatcbCourseRequest {
  code?: string;
  name?: string;
  description?: string;
}
