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
} from "@tabler/icons-react";

import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { useBulkDeleteCourses } from "@/hooks/api/course/use-bulk-delete-courses";
import { usePatchCourse } from "@/hooks/api/course/use-patch-course";
import { CourseResponse } from "@/data/interface/course";
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
  Skeleton,
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
  field: "code" | "name" | "description";
  value: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CoursesSection() {
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search);

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const router = useRouter();

  const [deleteTarget, setDeleteTarget] = React.useState<CourseResponse | null>(
    null,
  );
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);

  const [inlineEdit, setInlineEdit] = React.useState<InlineEdit | null>(null);

  // Data — courses API has no pagination, returns all
  const { data, isLoading, isFetching } = useGetCourses({
    search: debouncedSearch || undefined,
  });
  const courses = data?.courses ?? [];

  // Mutations
  const { mutate: bulkDeleteCourses, isPending: isDeleting } =
    useBulkDeleteCourses();
  const { mutate: patchCourse } = usePatchCourse();

  // Reset selection on search change
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [debouncedSearch]);

  // ── Selection helpers ──────────────────────────────────────────────────────
  const allSelected =
    courses.length > 0 && courses.every((c) => selectedIds.has(c.id));
  const someSelected =
    courses.some((c) => selectedIds.has(c.id)) && !allSelected;

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        courses.forEach((c) => next.delete(c.id));
      } else {
        courses.forEach((c) => next.add(c.id));
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

  // ── Inline-edit helpers ────────────────────────────────────────────────────
  const startInlineEdit = (
    id: string,
    field: InlineEdit["field"],
    value: string,
  ) => {
    setInlineEdit({ id, field, value });
  };

  const commitInlineEdit = () => {
    if (!inlineEdit) return;
    patchCourse(
      { id: inlineEdit.id, payload: { [inlineEdit.field]: inlineEdit.value } },
      {
        onSuccess: () => toast.success("Course updated"),
        onError: () => toast.error("Failed to update course"),
      },
    );
    setInlineEdit(null);
  };

  const cancelInlineEdit = () => setInlineEdit(null);

  // ── Delete single ──────────────────────────────────────────────────────────
  const handleDelete = (course: CourseResponse) => {
    bulkDeleteCourses([course.id], {
      onSuccess: () => {
        toast.success(`${course.name} deleted`);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete course"),
    });
  };

  // ── Bulk delete ────────────────────────────────────────────────────────────
  const [bulkDeleting, setBulkDeleting] = React.useState(false);

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    setBulkDeleting(true);
    bulkDeleteCourses(ids, {
      onSuccess: () => {
        toast.success(
          `${ids.length} course${ids.length !== 1 ? "s" : ""} deleted`,
        );
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
        setBulkDeleting(false);
      },
      onError: () => {
        toast.error("Failed to delete courses");
        setBulkDeleting(false);
      },
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground text-sm">
            Manage course records — search, edit inline, and perform CRUD
            operations.
          </p>
        </div>
        <Button onClick={() => router.push("/courses/create")}>
          <IconPlus />
          Add Course
        </Button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search by code or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

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
              <TableHead>Code ✎</TableHead>
              <TableHead>Name ✎</TableHead>
              <TableHead>Description ✎</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-16 text-center text-muted-foreground"
                >
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => {
                const isSelected = selectedIds.has(course.id);
                const editingCode =
                  inlineEdit?.id === course.id && inlineEdit.field === "code";
                const editingName =
                  inlineEdit?.id === course.id && inlineEdit.field === "name";
                const editingDesc =
                  inlineEdit?.id === course.id &&
                  inlineEdit.field === "description";

                return (
                  <TableRow
                    key={course.id}
                    data-state={isSelected ? "selected" : undefined}
                  >
                    {/* Checkbox */}
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(course.id)}
                        aria-label={`Select ${course.name}`}
                      />
                    </TableCell>

                    {/* Code — inline editable */}
                    <TableCell
                      onDoubleClick={() =>
                        !editingCode &&
                        startInlineEdit(course.id, "code", course.code)
                      }
                      className="cursor-text"
                    >
                      {editingCode ? (
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
                          className="h-7 py-0 text-sm font-mono"
                        />
                      ) : (
                        <span className="font-mono text-xs">{course.code}</span>
                      )}
                    </TableCell>

                    {/* Name — inline editable */}
                    <TableCell
                      onDoubleClick={() =>
                        !editingName &&
                        startInlineEdit(course.id, "name", course.name)
                      }
                      className="cursor-text"
                    >
                      {editingName ? (
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
                        <span>{course.name}</span>
                      )}
                    </TableCell>

                    {/* Description — inline editable */}
                    <TableCell
                      onDoubleClick={() =>
                        !editingDesc &&
                        startInlineEdit(
                          course.id,
                          "description",
                          course.description,
                        )
                      }
                      className="cursor-text max-w-xs"
                    >
                      {editingDesc ? (
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
                        <span className="text-muted-foreground text-xs line-clamp-1">
                          {course.description}
                        </span>
                      )}
                    </TableCell>

                    {/* Created At */}
                    <TableCell className="text-xs tabular-nums text-muted-foreground">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() =>
                            router.push(`/courses/${course.id}/edit`)
                          }
                          aria-label="Edit course"
                        >
                          <IconPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(course)}
                          aria-label="Delete course"
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

      {/* ── Count ── */}
      <div className="text-sm text-muted-foreground">
        {courses.length} course{courses.length !== 1 ? "s" : ""}
        {selectedIds.size > 0 && ` · ${selectedIds.size} selected`}
      </div>

      {/* ── Single delete confirm ── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
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
            <AlertDialogTitle>Delete Courses</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {selectedIds.size} course{selectedIds.size !== 1 ? "s" : ""}
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
