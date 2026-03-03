"use client";

import { useRouter } from "next/navigation";

import { useGetStudents } from "@/hooks/api/student/use-get-students";
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

export function RecentStudentsCard() {
  const router = useRouter();
  const { data, isLoading } = useGetStudents({
    limit: 5,
  });

  const students = data?.students ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Students</CardTitle>
          <CardDescription>
            Latest student records added to the system.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/students")}
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
        ) : students.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No student records available.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-xs">
                    {student.studentNo}
                  </TableCell>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {student.course.code}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {new Date(student.createdAt).toLocaleDateString()}
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
