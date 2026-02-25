import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { CreateCourseForm } from "@/components/pages/courses/_form/create-course-form";

export default function CreateCoursePage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link
          href="/courses"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to courses"
        >
          <IconArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Course</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details to create a new course record.
          </p>
        </div>
      </div>

      <CreateCourseForm />
    </div>
  );
}
