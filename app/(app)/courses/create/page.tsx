import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { CreateCourseForm } from "@/components/pages/courses/_form/create-course-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";

export default function CreateCoursePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
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
                Set up a degree program with code, name, and description.
              </p>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            A clear course structure helps organize students, subjects, and
            grading records.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Provide the core metadata for this degree program.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <CreateCourseForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
