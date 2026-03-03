import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { CreateSubjectForm } from "@/components/pages/subjects/_form/create-subject-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";

export default function CreateSubjectPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
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
                Create a subject and assign it to the appropriate course.
              </p>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Add a concise code, descriptive title, and correct unit value for
            smoother enrollment management.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject Details</CardTitle>
            <CardDescription>
              Configure subject metadata and course assignment.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <CreateSubjectForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
