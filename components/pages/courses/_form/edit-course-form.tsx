"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePatchCourse } from "@/hooks/api/course/use-patch-course";
import {
  CourseWithSubjectsResponse,
  PatchCourseRequest,
} from "@/data/interface/course";
import {
  Button,
  Field,
  FieldLabel,
  Input,
  Separator,
  Textarea,
} from "@/components/ui";

import { CourseSubjectsCard } from "../_detail/course-subjects-card";

interface Props {
  course: CourseWithSubjectsResponse;
}

export function EditCourseForm({ course }: Props) {
  const router = useRouter();
  const [form, setForm] = React.useState<PatchCourseRequest>({
    code: course.code,
    name: course.name,
    description: course.description,
  });

  const { mutate, isPending } = usePatchCourse();

  const set =
    (field: keyof PatchCourseRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { id: course.id, payload: form },
      {
        onSuccess: () => {
          toast.success("Course updated successfully");
          router.push(`/courses/${course.id}`);
        },
        onError: () => toast.error("Failed to update course"),
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="ec-code">Course Code</FieldLabel>
          <Input
            id="ec-code"
            value={form.code ?? ""}
            onChange={set("code")}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="ec-name">Course Name</FieldLabel>
          <Input
            id="ec-name"
            value={form.name ?? ""}
            onChange={set("name")}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="ec-description">Description</FieldLabel>
          <Textarea
            id="ec-description"
            value={form.description ?? ""}
            onChange={set("description")}
            rows={4}
          />
        </Field>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/courses/${course.id}`)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>

      <Separator />

      <CourseSubjectsCard
        courseId={course.id}
        subjects={course.subjects}
        isLoading={false}
      />
    </div>
  );
}
