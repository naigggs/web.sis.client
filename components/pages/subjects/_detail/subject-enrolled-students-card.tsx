"use client";

import {
  IconBook2,
  IconUsers,
  IconCircleCheck,
  IconCircleX,
} from "@tabler/icons-react";

import { useGetEnrolledStudents } from "@/hooks/api/subject/use-get-enrolled-students";
import {
  Badge,
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

interface Props {
  subjectId: string;
}

export function SubjectEnrolledStudentsCard({ subjectId }: Props) {
  const { data: students, isLoading } = useGetEnrolledStudents(subjectId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUsers className="h-4 w-4" />
          Enrolled Students
        </CardTitle>
        <CardDescription>
          Students currently enrolled in this subject.{" "}
          {!isLoading && `(${students?.length ?? 0})`}
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !students || students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <IconBook2 className="h-8 w-8 opacity-40" />
            <p className="text-sm">No enrolled students yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Final Grade</TableHead>
                <TableHead className="text-center">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-xs">
                    {student.studentNo}
                  </TableCell>
                  <TableCell>
                    {student.lastName}, {student.firstName}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-center">
                    {student.grade?.finalGrade ? (
                      <Badge variant="outline">
                        {student.grade.finalGrade}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.grade?.remarks === "PASSED" ? (
                      <Badge className="inline-flex items-center gap-1">
                        <IconCircleCheck className="h-3.5 w-3.5" />
                        Passed
                      </Badge>
                    ) : student.grade?.remarks === "FAILED" ? (
                      <Badge
                        variant="destructive"
                        className="inline-flex items-center gap-1"
                      >
                        <IconCircleX className="h-3.5 w-3.5" />
                        Failed
                      </Badge>
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
