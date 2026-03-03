"use client";

import { useRouter } from "next/navigation";

import { useGetGrades } from "@/hooks/api/grade/use-get-grades";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

export function RecentGradesCard() {
  const router = useRouter();
  const { data, isLoading } = useGetGrades({
    limit: 5,
  });

  const grades = data?.grades ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Grade Records</CardTitle>
          <CardDescription>Recently updated grade entries.</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/grades")}
        >
          View All
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : grades.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No grade records available.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Final Grade</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.subject.code}</TableCell>
                  <TableCell className="font-medium">
                    {grade.course.code}
                  </TableCell>
                  <TableCell>{grade.finalGrade ?? "—"}</TableCell>
                  <TableCell>
                    {grade.remarks ? (
                      <StatusBadge kind="grade" status={grade.remarks} />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
