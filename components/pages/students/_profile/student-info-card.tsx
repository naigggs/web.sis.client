import { IconMail, IconCalendar, IconId } from "@tabler/icons-react";

import { StudentResponse } from "@/data/interface/student";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Skeleton,
  Separator,
} from "@/components/ui";
import { InfoField } from "./profile-helpers";

interface Props {
  student: StudentResponse | undefined;
  isLoading: boolean;
}

export function StudentInfoCard({ student, isLoading }: Props) {
  const initials = student
    ? `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()
    : "";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-lg font-bold select-none">
            {isLoading ? (
              <Skeleton className="h-14 w-14 rounded-2xl" />
            ) : (
              initials
            )}
          </div>
          <div>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details for this student.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        ) : student ? (
          <div className="grid grid-cols-2 gap-x-10 gap-y-5">
            <InfoField icon={<IconId className="h-3 w-3" />} label="Student No">
              <span className="font-mono font-semibold">
                {student.studentNo}
              </span>
            </InfoField>

            <InfoField label="Course">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{student.course.code}</Badge>
                <span className="text-muted-foreground">
                  {student.course.name}
                </span>
              </div>
            </InfoField>

            <InfoField icon={<IconMail className="h-3 w-3" />} label="Email">
              {student.email}
            </InfoField>

            <InfoField
              icon={<IconCalendar className="h-3 w-3" />}
              label="Birth Date"
            >
              <span className="tabular-nums">{student.birthDate}</span>
            </InfoField>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
