"use client";

import * as React from "react";
import { toast } from "sonner";
import { IconLoader2, IconFilter } from "@tabler/icons-react";

import { useGetEnrolledStudents } from "@/hooks/api/subject/use-get-enrolled-students";
import { useCreateGrade } from "@/hooks/api/grade/use-create-grade";
import { usePatchGrade } from "@/hooks/api/grade/use-patch-grade";
import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { useGetSubjects } from "@/hooks/api/subject/use-get-subjects";
import { EnrolledStudentResponse } from "@/data/interface/subject";
import {
  Input,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Skeleton,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import {
  GradeValue,
  GradeRemarksBadge,
} from "@/components/pages/students/_profile/profile-helpers";

// ─── Inline-edit state ────────────────────────────────────────────────────────
interface InlineEdit {
  studentId: string;
  field: "prelim" | "midterm" | "finals";
  value: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function GradingSection() {
  const [selectedCourseId, setSelectedCourseId] = React.useState("");
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("");

  const [inlineEdit, setInlineEdit] = React.useState<InlineEdit | null>(null);

  // ── Data ───────────────────────────────────────────────────────────────────
  const { data: coursesData, isLoading: isLoadingCourses } = useGetCourses();
  const courses = coursesData?.courses ?? [];

  const { data: subjectsData, isLoading: isLoadingSubjects } = useGetSubjects(
    { courseId: selectedCourseId || undefined, limit: 200 },
    { enabled: !!selectedCourseId },
  );
  const subjects = subjectsData?.subjects ?? [];

  // Enrolled students for selected subject — each row already contains grade | null
  const {
    data: enrolledData,
    isLoading: isLoadingEnrolled,
    isFetching: isFetchingEnrolled,
  } = useGetEnrolledStudents(selectedSubjectId || undefined);
  const enrolledStudents: EnrolledStudentResponse[] = enrolledData ?? [];

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutate: createGrade } = useCreateGrade();
  const { mutate: patchGrade } = usePatchGrade();

  // ── Reset subject when course changes ──────────────────────────────────────
  React.useEffect(() => {
    setSelectedSubjectId("");
  }, [selectedCourseId]);

  // ── Inline-edit helpers ────────────────────────────────────────────────────
  const startEdit = (
    studentId: string,
    field: InlineEdit["field"],
    currentValue: string | null,
  ) => {
    setInlineEdit({ studentId, field, value: currentValue ?? "" });
  };

  const commitEdit = () => {
    if (!inlineEdit || !selectedSubjectId || !selectedCourseId) return;

    const { studentId, field, value } = inlineEdit;
    const numericValue = value === "" ? undefined : Number(value);
    const payload = { [field]: numericValue };
    const existingGrade =
      enrolledStudents.find((s) => s.id === studentId)?.grade ?? null;

    if (existingGrade) {
      // Update existing grade record
      patchGrade(
        { id: existingGrade.id, payload },
        {
          onSuccess: () => toast.success("Grade updated"),
          onError: () => toast.error("Failed to update grade"),
        },
      );
    } else {
      // Create new grade record (upsert)
      createGrade(
        {
          studentId,
          subjectId: selectedSubjectId,
          courseId: selectedCourseId,
          ...payload,
        },
        {
          onSuccess: () => toast.success("Grade saved"),
          onError: () => toast.error("Failed to save grade"),
        },
      );
    }

    setInlineEdit(null);
  };

  const cancelEdit = () => setInlineEdit(null);

  // ── Derived state ──────────────────────────────────────────────────────────
  const isReady = !!selectedCourseId && !!selectedSubjectId;
  const isTableLoading = isReady && isLoadingEnrolled;

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Grading Sheet</h1>
          <p className="text-muted-foreground text-sm">
            Select a course and subject to view and encode student grades.
          </p>
        </div>
        {isFetchingEnrolled && !isLoadingEnrolled && (
          <IconLoader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        )}
      </div>

      {/* Filters */}
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium flex items-center gap-1">
            <IconFilter className="h-3.5 w-3.5 text-muted-foreground" />
            Course
          </label>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-72">
              <SelectValue
                placeholder={isLoadingCourses ? "Loading…" : "Select a course"}
              />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  <span className="font-mono text-xs mr-2">{course.code}</span>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium flex items-center gap-1">
            <IconFilter className="h-3.5 w-3.5 text-muted-foreground" />
            Subject
          </label>
          <Select
            value={selectedSubjectId}
            onValueChange={setSelectedSubjectId}
            disabled={!selectedCourseId}
          >
            <SelectTrigger className="w-80">
              <SelectValue
                placeholder={
                  !selectedCourseId
                    ? "Select a course first"
                    : isLoadingSubjects
                      ? "Loading…"
                      : "Select a subject"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  <span className="font-mono text-xs mr-2">{subject.code}</span>
                  {subject.title}
                  <span className="text-muted-foreground ml-1.5">
                    ({subject.units}u)
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sheet header */}
      {isReady && (
        <div className="flex items-center gap-3 text-sm">
          {selectedCourse && (
            <Badge variant="secondary" className="font-mono">
              {selectedCourse.code}
            </Badge>
          )}
          {selectedSubject && (
            <>
              <span className="text-muted-foreground">/</span>
              <Badge variant="outline" className="font-mono">
                {selectedSubject.code}
              </Badge>
              <span className="text-muted-foreground">
                {selectedSubject.title}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {selectedSubject.units} unit
                {selectedSubject.units !== 1 ? "s" : ""}
              </span>
            </>
          )}
          {isReady && !isTableLoading && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {enrolledStudents.length} student
                {enrolledStudents.length !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>
      )}

      {/* Grading table */}
      {isReady && (
        <div className="rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 w-32">Student No</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead
                  className="text-center w-24"
                  title="Double-click to edit"
                >
                  Prelim ✎
                </TableHead>
                <TableHead
                  className="text-center w-24"
                  title="Double-click to edit"
                >
                  Midterm ✎
                </TableHead>
                <TableHead
                  className="text-center w-24"
                  title="Double-click to edit"
                >
                  Finals ✎
                </TableHead>
                <TableHead className="text-center w-28">Final Grade</TableHead>
                <TableHead className="text-center pr-4 w-24">Remarks</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isTableLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : enrolledStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-16 text-center text-muted-foreground"
                  >
                    No students enrolled in this subject.
                  </TableCell>
                </TableRow>
              ) : (
                enrolledStudents.map((row) => {
                  const grade = row.grade;

                  const editingPrelim =
                    inlineEdit?.studentId === row.id &&
                    inlineEdit.field === "prelim";
                  const editingMidterm =
                    inlineEdit?.studentId === row.id &&
                    inlineEdit.field === "midterm";
                  const editingFinals =
                    inlineEdit?.studentId === row.id &&
                    inlineEdit.field === "finals";

                  const renderGradeCell = (
                    field: "prelim" | "midterm" | "finals",
                    value: string | null,
                    isEditing: boolean,
                  ) => (
                    <TableCell
                      className="text-center cursor-text"
                      onDoubleClick={() =>
                        !isEditing && startEdit(row.id, field, value)
                      }
                    >
                      {isEditing ? (
                        <Input
                          autoFocus
                          type="number"
                          min={0}
                          max={100}
                          step={0.01}
                          value={inlineEdit!.value}
                          onChange={(e) =>
                            setInlineEdit((p) =>
                              p ? { ...p, value: e.target.value } : null,
                            )
                          }
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit();
                            if (e.key === "Escape") cancelEdit();
                            if (e.key === "Tab") {
                              e.preventDefault();
                              commitEdit();
                              // Move to next field
                              const fields: InlineEdit["field"][] = [
                                "prelim",
                                "midterm",
                                "finals",
                              ];
                              const idx = fields.indexOf(field);
                              const nextField = fields[idx + 1];
                              if (nextField) {
                                const nextVal =
                                  nextField === "midterm"
                                    ? (grade?.midterm ?? null)
                                    : (grade?.finals ?? null);
                                setTimeout(
                                  () => startEdit(row.id, nextField, nextVal),
                                  0,
                                );
                              }
                            }
                          }}
                          className="h-7 py-0 text-sm w-20 mx-auto text-center"
                        />
                      ) : (
                        <span className="tabular-nums">
                          <GradeValue value={value} />
                        </span>
                      )}
                    </TableCell>
                  );

                  return (
                    <TableRow key={row.id}>
                      <TableCell className="pl-4 font-mono text-xs">
                        {row.studentNo}
                      </TableCell>
                      <TableCell className="font-medium">
                        {row.lastName}
                      </TableCell>
                      <TableCell>{row.firstName}</TableCell>
                      {renderGradeCell(
                        "prelim",
                        grade?.prelim ?? null,
                        editingPrelim,
                      )}
                      {renderGradeCell(
                        "midterm",
                        grade?.midterm ?? null,
                        editingMidterm,
                      )}
                      {renderGradeCell(
                        "finals",
                        grade?.finals ?? null,
                        editingFinals,
                      )}
                      <TableCell className="text-center font-semibold">
                        <GradeValue value={grade?.finalGrade ?? null} />
                      </TableCell>
                      <TableCell className="text-center pr-4">
                        <GradeRemarksBadge remarks={grade?.remarks ?? null} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {!isReady && (
        <div className="rounded-2xl border border-dashed flex items-center justify-center py-24 text-muted-foreground text-sm">
          Select a course and subject to load the grading sheet.
        </div>
      )}
    </div>
  );
}
