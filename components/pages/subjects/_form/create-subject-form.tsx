"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateSubject } from "@/hooks/api/subject/use-create-subject";
import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { useDebounce } from "@/hooks/use-debounce";
import { CreateSubjectRequest } from "@/data/interface/subject";
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

const emptyForm: CreateSubjectRequest = {
  code: "",
  title: "",
  units: 3,
  courseId: "",
};

export function CreateSubjectForm() {
  const router = useRouter();
  const [form, setForm] = React.useState<CreateSubjectRequest>(emptyForm);
  const [courseInput, setCourseInput] = React.useState("");
  const debouncedCourseSearch = useDebounce(courseInput, 350);

  const { mutate, isPending } = useCreateSubject();
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCourses({
    search: debouncedCourseSearch || undefined,
  });
  const courses = coursesData?.courses ?? [];

  const set =
    (field: keyof Omit<CreateSubjectRequest, "units" | "courseId">) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        toast.success("Subject created successfully");
        router.push("/subjects");
      },
      onError: () => toast.error("Failed to create subject"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="cs-code">Subject Code</FieldLabel>
        <Input
          id="cs-code"
          value={form.code}
          onChange={set("code")}
          required
          placeholder="CS101"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cs-title">Title</FieldLabel>
        <Input
          id="cs-title"
          value={form.title}
          onChange={set("title")}
          required
          placeholder="Introduction to Computer Science"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cs-units">Units</FieldLabel>
        <Input
          id="cs-units"
          type="number"
          min={1}
          value={form.units}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, units: Number(e.target.value) }))
          }
          required
          placeholder="3"
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
          onClick={() => router.push("/subjects")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating…" : "Create Subject"}
        </Button>
      </div>
    </form>
  );
}
