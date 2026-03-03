import { Suspense } from "react";
import { SubjectsSection } from "@/components/pages/subjects/subjects-section";

export default function SubjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">
          Loading subjects…
        </div>
      }
    >
      <SubjectsSection />
    </Suspense>
  );
}
