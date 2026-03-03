"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePatchSubject } from "@/hooks/api/subject/use-patch-subject";
import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { useDebounce } from "@/hooks/use-debounce";
import { PatchSubjectRequest, SubjectResponse } from "@/data/interface/subject";
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

interface Props {
  subject: SubjectResponse;
}

export function EditSubjectForm({ subject }: Props) {
  const router = useRouter();
  const [form, setForm] = React.useState<PatchSubjectRequest>({
    code: subject.code,
    title: subject.title,
    units: subject.units,
    courseId: subject.courseId,
  });
  const [courseInput, setCourseInput] = React.useState("");
  const debouncedCourseSearch = useDebounce(courseInput, 350);

  const { mutate, isPending } = usePatchSubject();
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCourses({
    search: debouncedCourseSearch || undefined,
  });
  const courses = coursesData?.courses ?? [];

  const set =
    (field: keyof Omit<PatchSubjectRequest, "units" | "courseId">) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { id: subject.id, payload: form },
      {
        onSuccess: () => {
          toast.success("Subject updated successfully");
          router.push(`/subjects/${subject.id}`);
        },
        onError: () => toast.error("Failed to update subject"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="es-code">Subject Code</FieldLabel>
        <Input
          id="es-code"
          value={form.code ?? ""}
          onChange={set("code")}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="es-title">Title</FieldLabel>
        <Input
          id="es-title"
          value={form.title ?? ""}
          onChange={set("title")}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="es-units">Units</FieldLabel>
        <Input
          id="es-units"
          type="number"
          min={1}
          value={form.units ?? ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, units: Number(e.target.value) }))
          }
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
          onClick={() => router.push(`/subjects/${subject.id}`)}
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
