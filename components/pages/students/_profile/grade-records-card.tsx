import * as React from "react";
import { IconBook } from "@tabler/icons-react";
import { IconHistory } from "@tabler/icons-react";

import { GradeResponse } from "@/data/interface/grade";
import { GradeHistorySheet } from "@/components/pages/grades/grade-history-sheet";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Skeleton,
  Separator,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui";
import { GradeValue, GradeRemarksBadge } from "./profile-helpers";

interface Props {
  grades: GradeResponse[];
  isLoading: boolean;
  studentName?: string;
}

export function GradeRecordsCard({ grades, isLoading, studentName }: Props) {
  const [historyTarget, setHistoryTarget] = React.useState<{
    studentId: string;
    subjectId: string;
    courseId: string;
  } | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconBook className="h-4 w-4 text-muted-foreground" />
            <div>
              <CardTitle>Grade Records</CardTitle>
              <CardDescription>
                All subject grades enrolled by this student.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <div className="overflow-hidden rounded-b-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-28">Code</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center w-16">Units</TableHead>
                <TableHead className="text-center w-20">Prelim</TableHead>
                <TableHead className="text-center w-20">Midterm</TableHead>
                <TableHead className="text-center w-20">Finals</TableHead>
                <TableHead className="text-center w-28">Final Grade</TableHead>
                <TableHead className="text-center w-24">Remarks</TableHead>
                <TableHead className="text-center pr-6 w-14">History</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : grades.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-12 text-center text-muted-foreground text-sm"
                  >
                    No grade records found.
                  </TableCell>
                </TableRow>
              ) : (
                grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="pl-6 font-mono text-xs font-medium">
                      {grade.subject.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {grade.subject.title}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {grade.subject.units}
                    </TableCell>
                    <TableCell className="text-center">
                      <GradeValue value={grade.prelim} />
                    </TableCell>
                    <TableCell className="text-center">
                      <GradeValue value={grade.midterm} />
                    </TableCell>
                    <TableCell className="text-center">
                      <GradeValue value={grade.finals} />
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      <GradeValue value={grade.finalGrade} />
                    </TableCell>
                    <TableCell className="text-center">
                      <GradeRemarksBadge remarks={grade.remarks} />
                    </TableCell>
                    <TableCell className="text-center pr-6">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() =>
                          setHistoryTarget({
                            studentId: grade.studentId,
                            subjectId: grade.subjectId,
                            courseId: grade.courseId,
                          })
                        }
                        aria-label="View grade history"
                      >
                        <IconHistory className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {historyTarget && (
        <GradeHistorySheet
          open={!!historyTarget}
          onOpenChange={(open) => {
            if (!open) setHistoryTarget(null);
          }}
          studentId={historyTarget.studentId}
          subjectId={historyTarget.subjectId}
          courseId={historyTarget.courseId}
          studentName={studentName}
        />
      )}
    </>
  );
}
