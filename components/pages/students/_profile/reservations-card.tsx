import { IconClipboardList } from "@tabler/icons-react";

import { ReservationResponse } from "@/data/interface/reservation";
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
import { ReservationStatusBadge } from "./profile-helpers";

interface Props {
  reservations: ReservationResponse[];
  isLoading: boolean;
}

export function ReservationsCard({ reservations, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <IconClipboardList className="h-4 w-4 text-muted-foreground" />
          <div>
            <CardTitle>Subject Reservations</CardTitle>
            <CardDescription>
              Subjects reserved by this student and their approval status.
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
              <TableHead className="text-center w-32">Reserved At</TableHead>
              <TableHead className="text-center pr-6 w-28">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : reservations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground text-sm"
                >
                  No reservations found.
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="pl-6 font-mono text-xs font-medium">
                    {r.subject.code}
                  </TableCell>
                  <TableCell className="font-medium">
                    {r.subject.title}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {r.subject.units}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground text-xs tabular-nums">
                    {new Date(r.reservedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center pr-6">
                    <ReservationStatusBadge status={r.status} />
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
