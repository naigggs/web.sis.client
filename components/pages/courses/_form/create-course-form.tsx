"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateCourse } from "@/hooks/api/course/use-create-course";
import { CreateCourseRequest } from "@/data/interface/course";
import { Button, Field, FieldLabel, Input, Textarea } from "@/components/ui";

const emptyForm: CreateCourseRequest = {
  code: "",
  name: "",
  description: "",
};

export function CreateCourseForm() {
  const router = useRouter();
  const [form, setForm] = React.useState<CreateCourseRequest>(emptyForm);

  const { mutate, isPending } = useCreateCourse();

  const set =
    (field: keyof CreateCourseRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => {
        toast.success("Course created successfully");
        router.push("/courses");
      },
      onError: () => toast.error("Failed to create course"),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="cc-code">Course Code</FieldLabel>
        <Input
          id="cc-code"
          value={form.code}
          onChange={set("code")}
          required
          placeholder="BSIT"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cc-name">Course Name</FieldLabel>
        <Input
          id="cc-name"
          value={form.name}
          onChange={set("name")}
          required
          placeholder="Bachelor of Science in Information Technology"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="cc-description">Description</FieldLabel>
        <Textarea
          id="cc-description"
          value={form.description}
          onChange={set("description")}
          placeholder="A brief description of the course…"
          rows={4}
        />
      </Field>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/courses")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating…" : "Create Course"}
        </Button>
      </div>
    </form>
  );
}
