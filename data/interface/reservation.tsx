import { SubjectResponse } from "./subject";

export interface ReservationResponse {
  id: string;
  status: string;
  reservedAt: string;
  studentId: string;
  subjectId: string;
  subject: SubjectResponse;
}
