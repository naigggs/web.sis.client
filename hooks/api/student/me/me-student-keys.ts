export const meStudentKeys = {
  all: ["me-student"] as const,
  profile: () => [...meStudentKeys.all, "profile"] as const,
  reservations: () => [...meStudentKeys.all, "reservations"] as const,
  eligibleSubjects: () => [...meStudentKeys.all, "eligible-subjects"] as const,
};
