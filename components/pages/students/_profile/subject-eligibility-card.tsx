import {
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconAlertTriangle,
} from "@tabler/icons-react";

import { SubjectStatusResponse } from "@/data/interface/subject";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Skeleton,
  Separator,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui";

interface Props {
  subjectStatus: SubjectStatusResponse[];
  isLoading: boolean;
}

export function SubjectEligibilityCard({ subjectStatus, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconCircleCheck className="h-4 w-4 text-muted-foreground" />
          <div>
            <CardTitle>Subject Eligibility</CardTitle>
            <CardDescription>
              Subjects available for enrollment and their eligibility status.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <div className="overflow-hidden rounded-b-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-28">Code</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-center w-16">Units</TableHead>
              <TableHead className="text-center w-28">Eligible</TableHead>
              <TableHead className="text-center w-28">Reserved</TableHead>
              <TableHead className="pr-6">Missing Prerequisites</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : subjectStatus.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground text-sm"
                >
                  No subject status data found.
                </TableCell>
              </TableRow>
            ) : (
              subjectStatus.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="pl-6 font-mono text-xs font-medium">
                    {s.code}
                  </TableCell>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {s.units}
                  </TableCell>
                  <TableCell className="text-center">
                    {s.eligible ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                        <IconCircleCheck className="h-3.5 w-3.5" />
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <IconCircleX className="h-3.5 w-3.5" />
                        Not Eligible
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {s.alreadyReserved ? (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                        <IconClock className="h-3.5 w-3.5" />
                        Reserved
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="pr-6">
                    {s.missingPrerequisites.length === 0 ? (
                      <span className="text-xs text-muted-foreground">
                        None
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {s.missingPrerequisites.map((p) => (
                          <span
                            key={p.id}
                            className="inline-flex items-center gap-0.5 rounded-md bg-destructive/10 text-destructive px-1.5 py-0.5 text-xs font-mono"
                          >
                            <IconAlertTriangle className="h-2.5 w-2.5" />
                            {p.code}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
