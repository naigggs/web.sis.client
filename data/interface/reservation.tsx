import { SubjectResponse } from "./subject";

export type ReservationStatus =
  | "RESERVED"
  | "APPROVED"
  | "DENIED"
  | "CANCELLED";

export interface ReservationResponse {
  id: string;
  status: ReservationStatus;
  reservedAt: string;
  studentId: string;
  subjectId: string;
  subject: SubjectResponse;
}

export interface GetReservationsData {
  reservations: ReservationResponse[];
}

export interface PatchReservationRequest {
  status: "APPROVED" | "DENIED";
}
