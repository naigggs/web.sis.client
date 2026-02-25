"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePatchStudent } from "@/hooks/api/student/use-patch-student";
import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { useDebounce } from "@/hooks/use-debounce";
import { PatchStudentRequest, StudentResponse } from "@/data/interface/student";
import {
  Button,
  Field,
  FieldLabel,
  Input,
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  Skeleton,
} from "@/components/ui";

interface Props {
  student: StudentResponse;
}

export function EditStudentForm({ student }: Props) {
  const router = useRouter();
  const [form, setForm] = React.useState<PatchStudentRequest>({
    studentNo: student.studentNo,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    birthDate: student.birthDate,
    courseId: student.courseId,
  });
  const [courseInput, setCourseInput] = React.useState("");
  const debouncedCourseSearch = useDebounce(courseInput, 350);

  const { mutate, isPending } = usePatchStudent();
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCourses({
    search: debouncedCourseSearch || undefined,
  });
  const courses = coursesData?.courses ?? [];

  const set =
    (field: keyof PatchStudentRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { id: student.id, payload: form },
      {
        onSuccess: () => {
          toast.success("Student updated successfully");
          router.push("/students");
        },
        onError: () => toast.error("Failed to update student"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="es-studentNo">Student No</FieldLabel>
        <Input
          id="es-studentNo"
          value={form.studentNo ?? ""}
          onChange={set("studentNo")}
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="es-firstName">First Name</FieldLabel>
          <Input
            id="es-firstName"
            value={form.firstName ?? ""}
            onChange={set("firstName")}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="es-lastName">Last Name</FieldLabel>
          <Input
            id="es-lastName"
            value={form.lastName ?? ""}
            onChange={set("lastName")}
            required
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="es-email">Email</FieldLabel>
        <Input
          id="es-email"
          type="email"
          value={form.email ?? ""}
          onChange={set("email")}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="es-birthDate">Birth Date</FieldLabel>
        <Input
          id="es-birthDate"
          type="date"
          value={form.birthDate ?? ""}
          onChange={set("birthDate")}
          required
        />
      </Field>

      <Field>
        <FieldLabel>Course</FieldLabel>
        <Combobox
          value={form.courseId ?? ""}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, courseId: String(value ?? "") }))
          }
          onInputValueChange={(value, details) => {
            if (details.reason === "input-change") setCourseInput(value);
          }}
          itemToStringLabel={(id) => {
            const course = courses.find((c) => c.id === id);
            if (course) return `${course.code} – ${course.name}`;
            if (id === student.courseId && student.course)
              return `${student.course.code} – ${student.course.name}`;
            return String(id);
          }}
          filter={null}
        >
          <ComboboxInput showClear placeholder="Search courses..." />
          <ComboboxContent>
            <ComboboxList>
              {isLoadingCourses ? (
                <ComboboxEmpty>Loading...</ComboboxEmpty>
              ) : courses.length === 0 ? (
                <ComboboxEmpty>No courses found.</ComboboxEmpty>
              ) : (
                courses.map((course) => (
                  <ComboboxItem key={course.id} value={course.id}>
                    {course.code} – {course.name}
                  </ComboboxItem>
                ))
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/students")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
