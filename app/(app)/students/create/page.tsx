import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { CreateStudentForm } from "@/components/pages/students/_form/create-student-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";

export default function CreateStudentPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/students"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to students"
            >
              <IconArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Add Student</h1>
              <p className="text-muted-foreground text-sm">
                Create a complete student profile with academic details.
              </p>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Required fields: student number, name, email, birth date, and
            assigned course.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
            <CardDescription>
              These details are used across enrollment and grading workflows.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <CreateStudentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
