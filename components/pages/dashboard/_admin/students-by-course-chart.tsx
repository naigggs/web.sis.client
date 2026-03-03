"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { useGetStudents } from "@/hooks/api/student/use-get-students";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components/ui";

export function StudentsByCourseChart() {
  const { data: studentsData, isLoading: studentsLoading } = useGetStudents({
    limit: 200,
  });
  const { data: coursesData, isLoading: coursesLoading } = useGetCourses({
    limit: 200,
  });

  const chartData = React.useMemo(() => {
    const courses = coursesData?.courses ?? [];
    const students = studentsData?.students ?? [];

    const courseCodeById = new Map(courses.map((c) => [c.id, c.code]));
    const counts = new Map<string, number>();

    students.forEach((student) => {
      counts.set(student.courseId, (counts.get(student.courseId) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([courseId, count]) => ({
        course: courseCodeById.get(courseId) ?? "Unknown",
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [coursesData?.courses, studentsData?.students]);

  const isLoading = studentsLoading || coursesLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Students per Course</CardTitle>
        <CardDescription>
          Distribution of student records by degree program.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-70 w-full" />
        ) : chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No data available for this chart.
          </p>
        ) : (
          <div className="h-70 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="course" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="oklch(0.63 0.14 240)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
