"use client";

import * as React from "react";
import { toast } from "sonner";
import { IconLoader2, IconPlus, IconTrash } from "@tabler/icons-react";

import { useGetPrerequisites } from "@/hooks/api/subject/use-get-prerequisites";
import { useAddPrerequisite } from "@/hooks/api/subject/use-add-prerequisite";
import { useRemovePrerequisite } from "@/hooks/api/subject/use-remove-prerequisite";
import { useGetSubjects } from "@/hooks/api/subject/use-get-subjects";
import { useDebounce } from "@/hooks/use-debounce";
import { PrerequisiteResponse } from "@/data/interface/subject";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
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
  subjectCode?: string;
}

type ApiMutationError = Error & {
  apiMessage?: string;
  apiErrors?: string[];
};

export function SubjectPrerequisitesCard({ subjectId, subjectCode }: Props) {
  const {
    data: prerequisites,
    isLoading,
    isFetching,
  } = useGetPrerequisites(subjectId);

  const [addSearch, setAddSearch] = React.useState("");
  const [addSubjectId, setAddSubjectId] = React.useState("");
  const [deleteTarget, setDeleteTarget] =
    React.useState<PrerequisiteResponse | null>(null);

  const debouncedSearch = useDebounce(addSearch, 350);

  const { data: subjectData, isLoading: isLoadingSubjects } = useGetSubjects(
    { search: debouncedSearch || undefined, limit: 50 },
    { enabled: !!subjectId },
  );

  const prerequisiteIds = new Set(
    (prerequisites ?? []).map((p) => p.prerequisiteSubjectId),
  );

  const availableSubjects = (subjectData?.subjects ?? []).filter(
    (s) => s.id !== subjectId && !prerequisiteIds.has(s.id),
  );

  const { mutate: addPrerequisite, isPending: isAdding } = useAddPrerequisite();
  const { mutate: removePrerequisite, isPending: isRemoving } =
    useRemovePrerequisite();

  const handleAdd = () => {
    if (!addSubjectId) return;

    addPrerequisite(
      {
        subjectId,
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

  const handleRemove = (prereq: PrerequisiteResponse) => {
    removePrerequisite(
      {
        subjectId,
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Prerequisites</CardTitle>
          <CardDescription>
            Add or remove prerequisite subjects for{" "}
            {subjectCode ?? "this subject"}.{" "}
            {!isLoading && `(${prerequisites?.length ?? 0})`}
          </CardDescription>
        </div>

        {isFetching && !isLoading && (
          <IconLoader2 className="text-muted-foreground h-4 w-4 animate-spin" />
        )}
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 flex flex-col gap-4">
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
                const subject = (subjectData?.subjects ?? []).find(
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
                  {isLoadingSubjects ? (
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

        <div className="rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Units</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
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
      </CardContent>

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
              Remove <strong>{deleteTarget?.prerequisiteSubject.code}</strong>{" "}
              as a prerequisite of{" "}
              <strong>{subjectCode ?? "this subject"}</strong>?
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
    </Card>
  );
}
