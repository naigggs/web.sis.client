import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { CreateStudentForm } from "@/components/pages/students/_form/create-student-form";

export default function CreateStudentPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-xl">
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
            Fill in the details to create a new student record.
          </p>
        </div>
      </div>

      <CreateStudentForm />
    </div>
  );
}
