import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { CreateSubjectForm } from "@/components/pages/subjects/_form/create-subject-form";

export default function CreateSubjectPage() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link
          href="/subjects"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to subjects"
        >
          <IconArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Subject</h1>
          <p className="text-muted-foreground text-sm">
            Fill in the details to create a new subject record.
          </p>
        </div>
      </div>

      <CreateSubjectForm />
    </div>
  );
}
