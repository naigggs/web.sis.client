"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateStudent } from "@/hooks/api/student/use-create-student";
import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { useDebounce } from "@/hooks/use-debounce";
import { CreateStudentRequest } from "@/data/interface/student";
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
} from "@/components/ui";

const emptyForm: CreateStudentRequest = {
  studentNo: "",
  firstName: "",
  lastName: "",
  email: "",
  birthDate: "",
  courseId: "",
};

export function CreateStudentForm() {
  const router = useRouter();
  const [form, setForm] = React.useState<CreateStudentRequest>(emptyForm);
  const [courseInput, setCourseInput] = React.useState("");
  const debouncedCourseSearch = useDebounce(courseInput, 350);

  const { mutate, isPending } = useCreateStudent();
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCourses({
    search: debouncedCourseSearch || undefined,
  });
  const courses = coursesData?.courses ?? [];

  const set =
    (field: keyof CreateStudentRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        toast.success("Student created successfully");
        router.push("/students");
      },
      onError: () => toast.error("Failed to create student"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="cs-studentNo">Student No</FieldLabel>
        <Input
          id="cs-studentNo"
          value={form.studentNo}
          onChange={set("studentNo")}
          required
          placeholder="2026-00001"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="cs-firstName">First Name</FieldLabel>
          <Input
            id="cs-firstName"
            value={form.firstName}
            onChange={set("firstName")}
            required
            placeholder="John"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="cs-lastName">Last Name</FieldLabel>
          <Input
            id="cs-lastName"
            value={form.lastName}
            onChange={set("lastName")}
            required
            placeholder="Doe"
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="cs-email">Email</FieldLabel>
        <Input
          id="cs-email"
          type="email"
          value={form.email}
          onChange={set("email")}
          required
          placeholder="john.doe@student.edu"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cs-birthDate">Birth Date</FieldLabel>
        <Input
          id="cs-birthDate"
          type="date"
          value={form.birthDate}
          onChange={set("birthDate")}
          required
        />
      </Field>

      <Field>
        <FieldLabel>Course</FieldLabel>
        <Combobox
          value={form.courseId}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, courseId: String(value ?? "") }))
          }
          onInputValueChange={(value, details) => {
            if (details.reason === "input-change") setCourseInput(value);
          }}
          itemToStringLabel={(id) => {
            const course = courses.find((c) => c.id === id);
            return course ? `${course.code} – ${course.name}` : String(id);
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
          {isPending ? "Creating…" : "Create Student"}
        </Button>
      </div>
    </form>
  );
}
