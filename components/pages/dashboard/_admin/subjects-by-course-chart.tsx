"use client";

import * as React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { useGetSubjects } from "@/hooks/api/subject/use-get-subjects";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@/components/ui";

const COLORS = [
  "oklch(0.68 0.17 200)",
  "oklch(0.67 0.16 160)",
  "oklch(0.75 0.14 95)",
  "oklch(0.63 0.17 30)",
  "oklch(0.64 0.17 300)",
  "oklch(0.7 0.14 260)",
  "oklch(0.62 0.15 20)",
  "oklch(0.72 0.12 135)",
];

export function SubjectsByCourseChart() {
  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjects({
    limit: 200,
  });
  const { data: coursesData, isLoading: coursesLoading } = useGetCourses({
    limit: 200,
  });

  const chartData = React.useMemo(() => {
    const courses = coursesData?.courses ?? [];
    const subjects = subjectsData?.subjects ?? [];

    const courseCodeById = new Map(courses.map((c) => [c.id, c.code]));
    const counts = new Map<string, number>();

    subjects.forEach((subject) => {
      counts.set(subject.courseId, (counts.get(subject.courseId) ?? 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([courseId, value]) => ({
        name: courseCodeById.get(courseId) ?? "Unknown",
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [coursesData?.courses, subjectsData?.subjects]);

  const isLoading = subjectsLoading || coursesLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subjects by Course</CardTitle>
        <CardDescription>
          How subjects are distributed across degree programs.
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
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={52}
                  paddingAngle={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={28} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
