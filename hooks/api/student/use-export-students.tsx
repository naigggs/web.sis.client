import { exportStudentsApi } from "@/api/student/export-students-api";
import { useMutation } from "@tanstack/react-query";

export function useExportStudents() {
  return useMutation({
    mutationFn: exportStudentsApi,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.csv";
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
