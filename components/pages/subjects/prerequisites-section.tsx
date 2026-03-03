"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  IconSearch,
  IconTrash,
  IconPlus,
  IconLoader2,
} from "@tabler/icons-react";

import { useGetSubjects } from "@/hooks/api/subject/use-get-subjects";
import { useGetPrerequisites } from "@/hooks/api/subject/use-get-prerequisites";
import { useAddPrerequisite } from "@/hooks/api/subject/use-add-prerequisite";
import { useRemovePrerequisite } from "@/hooks/api/subject/use-remove-prerequisite";
import { PrerequisiteResponse } from "@/data/interface/subject";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Skeleton,
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
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

export function PrerequisitesSection() {
  type ApiMutationError = Error & {
    apiMessage?: string;
    apiErrors?: string[];
  };

  // ── Subject selector ───────────────────────────────────────────────────────
  const [subjectSearch, setSubjectSearch] = React.useState("");
  const debouncedSubjectSearch = useDebounce(subjectSearch, 350);
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("");

  const { data: subjectsData, isLoading: isLoadingSubjects } = useGetSubjects({
    search: debouncedSubjectSearch || undefined,
    limit: 50,
  });
  const allSubjects = subjectsData?.subjects ?? [];

  // ── Prerequisites list ─────────────────────────────────────────────────────
  const {
    data: prerequisites,
    isLoading: isLoadingPrereqs,
    isFetching: isFetchingPrereqs,
  } = useGetPrerequisites(selectedSubjectId);

  // ── Add prerequisite ───────────────────────────────────────────────────────
  const [addSearch, setAddSearch] = React.useState("");
  const debouncedAddSearch = useDebounce(addSearch, 350);
  const [addSubjectId, setAddSubjectId] = React.useState("");

  const { data: addSubjectsData, isLoading: isLoadingAddSubjects } =
    useGetSubjects(
      { search: debouncedAddSearch || undefined, limit: 50 },
      { enabled: !!selectedSubjectId },
    );

  // Filter out the selected subject itself and already added prerequisites
  const prerequisiteIds = new Set(
    (prerequisites ?? []).map((p) => p.prerequisiteSubjectId),
  );
  const availableSubjects = (addSubjectsData?.subjects ?? []).filter(
    (s) => s.id !== selectedSubjectId && !prerequisiteIds.has(s.id),
  );

  const { mutate: addPrerequisite, isPending: isAdding } = useAddPrerequisite();

  const handleAdd = () => {
    if (!selectedSubjectId || !addSubjectId) return;
    addPrerequisite(
      {
        subjectId: selectedSubjectId,
        payload: { prerequisiteSubjectId: addSubjectId },
      },
      {
        onSuccess: () => {
          toast.success("Prerequisite added");
          setAddSubjectId("");
          setAddSearch("");
        },
        onError: (error) => {
          const apiError = error as ApiMutationError;
          const message =
            apiError.apiMessage ||
            apiError.message ||
            "Failed to add prerequisite.";
          const details = (apiError.apiErrors ?? []).join("\n");

          if (details) {
            toast.error(message, { description: details });
            return;
          }

          toast.error(message);
        },
      },
    );
  };

  // ── Remove prerequisite ────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] =
    React.useState<PrerequisiteResponse | null>(null);

  const { mutate: removePrerequisite, isPending: isRemoving } =
    useRemovePrerequisite();

  const handleRemove = (prereq: PrerequisiteResponse) => {
    removePrerequisite(
      {
        subjectId: selectedSubjectId,
        prerequisiteSubjectId: prereq.prerequisiteSubjectId,
      },
      {
        onSuccess: () => {
          toast.success(
            `${prereq.prerequisiteSubject.code} removed as prerequisite`,
          );
          setDeleteTarget(null);
        },
        onError: () => toast.error("Failed to remove prerequisite"),
      },
    );
  };

  const selectedSubject = allSubjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prerequisites</h1>
        <p className="text-muted-foreground text-sm">
          Select a subject to view and manage its prerequisite subjects.
        </p>
      </div>

      {/* Subject selector */}
      <div className="max-w-sm flex flex-col gap-1.5">
        <label className="text-sm font-medium">Select Subject</label>
        <Combobox
          value={selectedSubjectId}
          onValueChange={(value) => {
            setSelectedSubjectId(String(value ?? ""));
            setAddSubjectId("");
            setAddSearch("");
          }}
          onInputValueChange={(value, details) => {
            if (details.reason === "input-change") setSubjectSearch(value);
          }}
          itemToStringLabel={(id) => {
            const subject = allSubjects.find((s) => s.id === id);
            return subject ? `${subject.code} – ${subject.title}` : String(id);
          }}
          filter={null}
        >
          <ComboboxInput showClear placeholder="Search subjects..." />
          <ComboboxContent>
            <ComboboxList>
              {isLoadingSubjects ? (
                <ComboboxEmpty>Loading...</ComboboxEmpty>
              ) : allSubjects.length === 0 ? (
                <ComboboxEmpty>No subjects found.</ComboboxEmpty>
              ) : (
                allSubjects.map((subject) => (
                  <ComboboxItem key={subject.id} value={subject.id}>
                    <span className="font-mono text-xs">{subject.code}</span>
                    <span className="truncate text-muted-foreground ml-1">
                      – {subject.title}
                    </span>
                  </ComboboxItem>
                ))
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Prerequisites panel — only shown when a subject is selected */}
      {selectedSubjectId && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                Prerequisites for{" "}
                <span className="font-mono">{selectedSubject?.code}</span>
              </h2>
              {isFetchingPrereqs && !isLoadingPrereqs && (
                <IconLoader2 className="text-muted-foreground h-4 w-4 animate-spin" />
              )}
            </div>
          </div>

          {/* Add prerequisite row */}
          <div className="flex items-end gap-2 max-w-lg">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-sm font-medium">Add Prerequisite</label>
              <Combobox
                value={addSubjectId}
                onValueChange={(value) => setAddSubjectId(String(value ?? ""))}
                onInputValueChange={(value, details) => {
                  if (details.reason === "input-change") setAddSearch(value);
                }}
                itemToStringLabel={(id) => {
                  const subject = (addSubjectsData?.subjects ?? []).find(
                    (s) => s.id === id,
                  );
                  return subject
                    ? `${subject.code} – ${subject.title}`
                    : String(id);
                }}
                filter={null}
              >
                <ComboboxInput
                  showClear
                  placeholder="Search subjects to add..."
                />
                <ComboboxContent>
                  <ComboboxList>
                    {isLoadingAddSubjects ? (
                      <ComboboxEmpty>Loading...</ComboboxEmpty>
                    ) : availableSubjects.length === 0 ? (
                      <ComboboxEmpty>No subjects available.</ComboboxEmpty>
                    ) : (
                      availableSubjects.map((subject) => (
                        <ComboboxItem key={subject.id} value={subject.id}>
                          <span className="font-mono text-xs">
                            {subject.code}
                          </span>
                          <span className="truncate text-muted-foreground ml-1">
                            – {subject.title}
                          </span>
                        </ComboboxItem>
                      ))
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <Button onClick={handleAdd} disabled={!addSubjectId || isAdding}>
              <IconPlus className="h-4 w-4" />
              {isAdding ? "Adding…" : "Add"}
            </Button>
          </div>

          {/* Prerequisites table */}
          <div className="rounded-2xl border overflow-hidden max-w-2xl">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPrereqs ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !prerequisites || prerequisites.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No prerequisites set for this subject.
                    </TableCell>
                  </TableRow>
                ) : (
                  prerequisites.map((prereq) => (
                    <TableRow key={prereq.id}>
                      <TableCell className="font-mono text-xs">
                        {prereq.prerequisiteSubject.code}
                      </TableCell>
                      <TableCell>{prereq.prerequisiteSubject.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {prereq.prerequisiteSubject.units} u
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {prereq.prerequisiteSubject.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(prereq)}
                          aria-label="Remove prerequisite"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Remove confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Prerequisite</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{deleteTarget?.prerequisiteSubject.code}</strong> as a
              prerequisite of <strong>{selectedSubject?.code}</strong>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleRemove(deleteTarget)}
              disabled={isRemoving}
            >
              {isRemoving ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
