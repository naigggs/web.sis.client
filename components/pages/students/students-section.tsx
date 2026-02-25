"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  IconPlus,
  IconSearch,
  IconTrash,
  IconPencil,
  IconLoader2,
  IconFilter,
  IconX,
  IconEye,
} from "@tabler/icons-react";

import { useGetStudents } from "@/hooks/api/student/use-get-students";
import { useBulkDeleteStudents } from "@/hooks/api/student/use-bulk-delete-students";
import { usePatchStudent } from "@/hooks/api/student/use-patch-student";
import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { StudentResponse } from "@/data/interface/student";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Checkbox,
  Badge,
  Skeleton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui";

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ─── Inline-edit state ────────────────────────────────────────────────────────
interface InlineEdit {
  id: string;
  field: "firstName" | "lastName";
  value: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function StudentsSection() {
  // Search & pagination
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const debouncedSearch = useDebounce(search);

  // Selection
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Course faceted filter
  const [selectedCourseIds, setSelectedCourseIds] = React.useState<Set<string>>(
    new Set(),
  );

  const router = useRouter();

  // Dialogs
  const [deleteTarget, setDeleteTarget] =
    React.useState<StudentResponse | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  // Inline editing
  const [inlineEdit, setInlineEdit] = React.useState<InlineEdit | null>(null);

  // Data
  const { data, isLoading, isFetching } = useGetStudents({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    courseIds:
      selectedCourseIds.size > 0 ? Array.from(selectedCourseIds) : undefined,
  });
  const students = data?.students ?? [];
  const pagination = data?.pagination;

  // Courses for filter options
  const { data: coursesData } = useGetCourses();

  // Mutations
  const { mutate: bulkDeleteStudents, isPending: isDeleting } =
    useBulkDeleteStudents();
  const { mutate: patchStudent } = usePatchStudent();

  // Reset to page 1 when search or course filter changes
  React.useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [debouncedSearch, selectedCourseIds]);

  // ── Selection helpers ────────────────────────────────────────────────────────
  const allSelected =
    students.length > 0 && students.every((s) => selectedIds.has(s.id));
  const someSelected =
    students.some((s) => selectedIds.has(s.id)) && !allSelected;

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        students.forEach((s) => next.delete(s.id));
      } else {
        students.forEach((s) => next.add(s.id));
      }
      return next;
    });
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Inline-edit helpers ──────────────────────────────────────────────────────
  const startInlineEdit = (
    id: string,
    field: InlineEdit["field"],
    value: string,
  ) => {
    setInlineEdit({ id, field, value });
  };

  const commitInlineEdit = () => {
    if (!inlineEdit) return;
    patchStudent(
      { id: inlineEdit.id, payload: { [inlineEdit.field]: inlineEdit.value } },
      {
        onSuccess: () => toast.success("Student updated"),
        onError: () => toast.error("Failed to update student"),
      },
    );
    setInlineEdit(null);
  };

  const cancelInlineEdit = () => setInlineEdit(null);

  // ── Delete single ────────────────────────────────────────────────────────────
  const handleDelete = (student: StudentResponse) => {
    bulkDeleteStudents([student.id], {
      onSuccess: () => {
        toast.success(`${student.firstName} ${student.lastName} deleted`);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete student"),
    });
  };

  // ── Bulk delete ──────────────────────────────────────────────────────────────
  const [bulkDeleting, setBulkDeleting] = React.useState(false);

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    setBulkDeleting(true);
    bulkDeleteStudents(ids, {
      onSuccess: () => {
        toast.success(
          `${ids.length} student${ids.length !== 1 ? "s" : ""} deleted`,
        );
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
        setBulkDeleting(false);
      },
      onError: () => {
        toast.error("Failed to delete students");
        setBulkDeleting(false);
      },
    });
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground text-sm">
            Manage student records — search, filter, and perform CRUD
            operations.
          </p>
        </div>
        <Button onClick={() => router.push("/students/create")}>
          <IconPlus />
          Add Student
        </Button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search by name, email, student no…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* ── Course faceted filter ── */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={selectedCourseIds.size > 0 ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
            >
              <IconFilter className="h-4 w-4" />
              Course
              {selectedCourseIds.size > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {selectedCourseIds.size}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-0">
            <Command>
              <CommandInput placeholder="Search courses..." />
              <CommandList>
                <CommandEmpty>No courses found.</CommandEmpty>
                <CommandGroup>
                  {(coursesData?.courses ?? []).map((course) => (
                    <CommandItem
                      key={course.id}
                      value={`${course.code} ${course.name}`}
                      data-checked={selectedCourseIds.has(course.id)}
                      onSelect={() => {
                        setSelectedCourseIds((prev) => {
                          const next = new Set(prev);
                          next.has(course.id)
                            ? next.delete(course.id)
                            : next.add(course.id);
                          return next;
                        });
                      }}
                    >
                      <span className="font-mono text-xs">{course.code}</span>
                      <span className="truncate text-muted-foreground">
                        {course.name}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            {selectedCourseIds.size > 0 && (
              <>
                <DropdownMenuSeparator />
                <button
                  className="flex w-full items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setSelectedCourseIds(new Set())}
                >
                  <IconX className="h-3 w-3" />
                  Clear filter
                </button>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedIds.size > 0 && (
          <Button variant="destructive" onClick={() => setBulkDeleteOpen(true)}>
            <IconTrash />
            Delete ({selectedIds.size})
          </Button>
        )}

        {isFetching && !isLoading && (
          <IconLoader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={someSelected ? "indeterminate" : allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Student No</TableHead>
              <TableHead title="Double-click to edit">First Name ✎</TableHead>
              <TableHead title="Double-click to edit">Last Name ✎</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Birth Date</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // Skeleton rows while loading
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center text-muted-foreground"
                >
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => {
                const isSelected = selectedIds.has(student.id);
                const editingFirstName =
                  inlineEdit?.id === student.id &&
                  inlineEdit.field === "firstName";
                const editingLastName =
                  inlineEdit?.id === student.id &&
                  inlineEdit.field === "lastName";

                return (
                  <TableRow
                    key={student.id}
                    data-state={isSelected ? "selected" : undefined}
                  >
                    {/* Checkbox */}
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(student.id)}
                        aria-label={`Select ${student.firstName} ${student.lastName}`}
                      />
                    </TableCell>

                    {/* Student No */}
                    <TableCell className="font-mono text-xs">
                      <button
                        className="hover:underline underline-offset-2 cursor-pointer text-foreground"
                        onClick={() => router.push(`/students/${student.id}`)}
                      >
                        {student.studentNo}
                      </button>
                    </TableCell>

                    {/* First Name — inline editable */}
                    <TableCell
                      onDoubleClick={() =>
                        !editingFirstName &&
                        startInlineEdit(
                          student.id,
                          "firstName",
                          student.firstName,
                        )
                      }
                      className="cursor-text"
                    >
                      {editingFirstName ? (
                        <Input
                          autoFocus
                          value={inlineEdit!.value}
                          onChange={(e) =>
                            setInlineEdit((prev) =>
                              prev ? { ...prev, value: e.target.value } : null,
                            )
                          }
                          onBlur={commitInlineEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitInlineEdit();
                            if (e.key === "Escape") cancelInlineEdit();
                          }}
                          className="h-7 py-0 text-sm"
                        />
                      ) : (
                        <span>{student.firstName}</span>
                      )}
                    </TableCell>

                    {/* Last Name — inline editable */}
                    <TableCell
                      onDoubleClick={() =>
                        !editingLastName &&
                        startInlineEdit(
                          student.id,
                          "lastName",
                          student.lastName,
                        )
                      }
                      className="cursor-text"
                    >
                      {editingLastName ? (
                        <Input
                          autoFocus
                          value={inlineEdit!.value}
                          onChange={(e) =>
                            setInlineEdit((prev) =>
                              prev ? { ...prev, value: e.target.value } : null,
                            )
                          }
                          onBlur={commitInlineEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitInlineEdit();
                            if (e.key === "Escape") cancelInlineEdit();
                          }}
                          className="h-7 py-0 text-sm"
                        />
                      ) : (
                        <span>{student.lastName}</span>
                      )}
                    </TableCell>

                    {/* Course */}
                    <TableCell>
                      <Badge variant="secondary">{student.course.code}</Badge>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-xs text-muted-foreground">
                      {student.email}
                    </TableCell>

                    {/* Birth Date */}
                    <TableCell className="text-xs tabular-nums">
                      {student.birthDate}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => router.push(`/students/${student.id}`)}
                          aria-label="View student"
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() =>
                            router.push(`/students/${student.id}/edit`)
                          }
                          aria-label="Edit student"
                        >
                          <IconPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(student)}
                          aria-label="Delete student"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {pagination.totalItems} total student
            {pagination.totalItems !== 1 ? "s" : ""}
            {selectedIds.size > 0 && ` · ${selectedIds.size} selected`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="tabular-nums">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* ── Single delete confirm ── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget?.firstName} {deleteTarget?.lastName}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Bulk delete confirm ── */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Students</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {selectedIds.size} student{selectedIds.size !== 1 ? "s" : ""}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
            >
              {bulkDeleting ? "Deleting…" : "Delete All"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
