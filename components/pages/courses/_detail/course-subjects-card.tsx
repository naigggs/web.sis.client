"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  IconPlus,
  IconTrash,
  IconBook2,
  IconLoader2,
} from "@tabler/icons-react";

import { CourseSubjectResponse, AddSubjectItem } from "@/data/interface/course";
import { useAddSubjectsToCourse } from "@/hooks/api/course/use-add-subjects-to-course";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
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
  courseId: string;
  subjects: CourseSubjectResponse[];
  isLoading: boolean;
}

const EMPTY_SUBJECT: AddSubjectItem = {
  code: "",
  title: "",
  units: 3,
  slotLimit: 10,
};

export function CourseSubjectsCard({ courseId, subjects, isLoading }: Props) {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState<AddSubjectItem[]>([
    { ...EMPTY_SUBJECT },
  ]);

  const { mutate: addSubjects, isPending } = useAddSubjectsToCourse();

  const handleAddRow = () => {
    setRows((prev) => [...prev, { ...EMPTY_SUBJECT }]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof AddSubjectItem,
    value: string | number,
  ) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const handleSubmit = () => {
    const valid = rows.every(
      (r) => r.code.trim() && r.title.trim() && Number(r.units) > 0,
    );
    if (!valid) {
      toast.error("Please fill in all required fields (code, title, units).");
      return;
    }

    const payload = {
      subjects: rows.map((r) => ({
        ...r,
        units: Number(r.units),
        slotLimit: r.slotLimit ? Number(r.slotLimit) : 10,
      })),
    };

    addSubjects(
      { courseId, payload },
      {
        onSuccess: () => {
          toast.success("Subjects added successfully.");
          setOpen(false);
          setRows([{ ...EMPTY_SUBJECT }]);
        },
        onError: () => {
          toast.error("Failed to add subjects.");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>
            Subjects belonging to this course.{" "}
            {!isLoading && `(${subjects.length})`}
          </CardDescription>
        </div>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) setRows([{ ...EMPTY_SUBJECT }]);
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <IconPlus className="h-4 w-4" />
              Add Subjects
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add Subjects</DialogTitle>
              <DialogDescription>
                Add one or more subjects to this course. Fill in the code,
                title, units, and optional slot limit for each.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 max-h-100 overflow-y-auto pr-1">
              {rows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_2fr_60px_60px_36px] gap-2 items-center"
                >
                  <Input
                    placeholder="Code *"
                    value={row.code}
                    onChange={(e) => handleChange(idx, "code", e.target.value)}
                  />
                  <Input
                    placeholder="Title *"
                    value={row.title}
                    onChange={(e) => handleChange(idx, "title", e.target.value)}
                  />
                  <Input
                    type="number"
                    min={1}
                    placeholder="Units *"
                    value={row.units}
                    onChange={(e) => handleChange(idx, "units", e.target.value)}
                  />
                  <Input
                    type="number"
                    min={1}
                    placeholder="Slots"
                    value={row.slotLimit ?? ""}
                    onChange={(e) =>
                      handleChange(idx, "slotLimit", e.target.value)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={rows.length === 1}
                    onClick={() => handleRemoveRow(idx)}
                    aria-label="Remove row"
                  >
                    <IconTrash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-start">
              <Button variant="outline" size="sm" onClick={handleAddRow}>
                <IconPlus className="h-4 w-4" />
                Add Row
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending && <IconLoader2 className="h-4 w-4 animate-spin" />}
                Save Subjects
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <IconBook2 className="h-8 w-8 opacity-40" />
            <p className="text-sm">No subjects yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-center">Units</TableHead>
                <TableHead className="text-center">Slot Limit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-mono font-medium">
                    {subject.code}
                  </TableCell>
                  <TableCell>{subject.title}</TableCell>
                  <TableCell className="text-center">{subject.units}</TableCell>
                  <TableCell className="text-center">
                    {subject.slotLimit}
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
