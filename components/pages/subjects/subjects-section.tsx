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
} from "@tabler/icons-react";

import { useGetSubjects } from "@/hooks/api/subject/use-get-subjects";
import { useBulkDeleteSubjects } from "@/hooks/api/subject/use-bulk-delete-subjects";
import { usePatchSubject } from "@/hooks/api/subject/use-patch-subject";
import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { SubjectResponse } from "@/data/interface/subject";
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

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

interface InlineEdit {
  id: string;
  field: "code" | "title" | "units";
  value: string;
}

export function SubjectsSection() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const debouncedSearch = useDebounce(search);

  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [selectedCourseIds, setSelectedCourseIds] = React.useState<Set<string>>(
    new Set(),
  );

  const router = useRouter();

  const [deleteTarget, setDeleteTarget] =
    React.useState<SubjectResponse | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false);
  const [inlineEdit, setInlineEdit] = React.useState<InlineEdit | null>(null);

  const { data, isLoading, isFetching } = useGetSubjects({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    course:
      selectedCourseIds.size === 1
        ? Array.from(selectedCourseIds)[0]
        : undefined,
  });
  const subjects = data?.subjects ?? [];
  const pagination = data?.pagination;

  const { data: coursesData } = useGetCourses();

  const { mutate: bulkDeleteSubjects, isPending: isDeleting } =
    useBulkDeleteSubjects();
  const { mutate: patchSubject } = usePatchSubject();

  React.useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [debouncedSearch, selectedCourseIds]);

  // ── Selection ──────────────────────────────────────────────────────────────
  const allSelected =
    subjects.length > 0 && subjects.every((s) => selectedIds.has(s.id));
  const someSelected =
    subjects.some((s) => selectedIds.has(s.id)) && !allSelected;

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) subjects.forEach((s) => next.delete(s.id));
      else subjects.forEach((s) => next.add(s.id));
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

  // ── Inline edit ────────────────────────────────────────────────────────────
  const startEdit = (id: string, field: InlineEdit["field"], value: string) =>
    setInlineEdit({ id, field, value });

  const commitEdit = () => {
    if (!inlineEdit) return;
    const payload =
      inlineEdit.field === "units"
        ? { units: Number(inlineEdit.value) }
        : { [inlineEdit.field]: inlineEdit.value };
    patchSubject(
      { id: inlineEdit.id, payload },
      {
        onSuccess: () => toast.success("Subject updated"),
        onError: () => toast.error("Failed to update subject"),
      },
    );
    setInlineEdit(null);
  };

  const cancelEdit = () => setInlineEdit(null);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = (subject: SubjectResponse) => {
    bulkDeleteSubjects([subject.id], {
      onSuccess: () => {
        toast.success(`${subject.code} deleted`);
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete subject"),
    });
  };

  const [bulkDeleting, setBulkDeleting] = React.useState(false);

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    setBulkDeleting(true);
    bulkDeleteSubjects(ids, {
      onSuccess: () => {
        toast.success(
          `${ids.length} subject${ids.length !== 1 ? "s" : ""} deleted`,
        );
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
        setBulkDeleting(false);
      },
      onError: () => {
        toast.error("Failed to delete subjects");
        setBulkDeleting(false);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground text-sm">
            Manage subject records — search, filter by course, and perform CRUD
            operations.
          </p>
        </div>
        <Button onClick={() => router.push("/subjects/create")}>
          <IconPlus />
          Add Subject
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Search by code or title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Course faceted filter */}
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

      {/* Table */}
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
              <TableHead title="Double-click to edit">Code ✎</TableHead>
              <TableHead title="Double-click to edit">Title ✎</TableHead>
              <TableHead title="Double-click to edit">Units ✎</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : subjects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-16 text-center text-muted-foreground"
                >
                  No subjects found.
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((subject) => {
                const isSelected = selectedIds.has(subject.id);
                const editingCode =
                  inlineEdit?.id === subject.id && inlineEdit.field === "code";
                const editingTitle =
                  inlineEdit?.id === subject.id && inlineEdit.field === "title";
                const editingUnits =
                  inlineEdit?.id === subject.id && inlineEdit.field === "units";

                return (
                  <TableRow
                    key={subject.id}
                    data-state={isSelected ? "selected" : undefined}
                  >
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(subject.id)}
                        aria-label={`Select ${subject.code}`}
                      />
                    </TableCell>

                    {/* Code */}
                    <TableCell
                      onDoubleClick={() =>
                        !editingCode &&
                        startEdit(subject.id, "code", subject.code)
                      }
                      className="cursor-text"
                    >
                      {editingCode ? (
                        <Input
                          autoFocus
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
                          }}
                          className="h-7 py-0 text-sm font-mono"
                        />
                      ) : (
                        <span className="font-mono text-xs">
                          {subject.code}
                        </span>
                      )}
                    </TableCell>

                    {/* Title */}
                    <TableCell
                      onDoubleClick={() =>
                        !editingTitle &&
                        startEdit(subject.id, "title", subject.title)
                      }
                      className="cursor-text"
                    >
                      {editingTitle ? (
                        <Input
                          autoFocus
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
                          }}
                          className="h-7 py-0 text-sm"
                        />
                      ) : (
                        <span>{subject.title}</span>
                      )}
                    </TableCell>

                    {/* Units */}
                    <TableCell
                      onDoubleClick={() =>
                        !editingUnits &&
                        startEdit(subject.id, "units", String(subject.units))
                      }
                      className="cursor-text"
                    >
                      {editingUnits ? (
                        <Input
                          autoFocus
                          type="number"
                          min={1}
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
                          }}
                          className="h-7 py-0 text-sm w-20"
                        />
                      ) : (
                        <Badge variant="outline">{subject.units}</Badge>
                      )}
                    </TableCell>

                    {/* Course */}
                    <TableCell>
                      <Badge variant="secondary">{subject.course.code}</Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() =>
                            router.push(`/subjects/${subject.id}/edit`)
                          }
                          aria-label="Edit subject"
                        >
                          <IconPencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(subject)}
                          aria-label="Delete subject"
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

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {pagination.totalItems} total subject
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

      {/* Single delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget?.code} – {deleteTarget?.title}
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

      {/* Bulk delete confirm */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subjects</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {selectedIds.size} subject{selectedIds.size !== 1 ? "s" : ""}
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
