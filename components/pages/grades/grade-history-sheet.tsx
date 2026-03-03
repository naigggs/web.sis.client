import { useGetGradeHistory } from "@/hooks/api/grade/use-get-grade-history";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui";
import { GradeHistoryTimeline } from "./grade-history-timeline";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  subjectId: string;
  courseId: string;
  studentName?: string;
}

export function GradeHistorySheet({
  open,
  onOpenChange,
  studentId,
  subjectId,
  courseId,
  studentName,
}: Props) {
  const { data, isLoading, isError, error } = useGetGradeHistory(
    {
      studentId,
      subjectId,
      courseId,
    },
    { enabled: open },
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl lg:max-w-3xl">
        <SheetHeader className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
          <SheetTitle>Grade Commit History</SheetTitle>
          <SheetDescription>
            {studentName
              ? `Timeline of grade updates for ${studentName}.`
              : "Timeline of grade updates for this record."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <GradeHistoryTimeline
            history={data?.history ?? []}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error instanceof Error ? error.message : undefined}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
