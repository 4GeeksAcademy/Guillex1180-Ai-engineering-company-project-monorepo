import { Suspense } from "react";
import { CandidateListPage } from "@/components/candidates/candidate-list-page";

function LoadingPage() {
  return <div className="min-h-screen bg-white" />;
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <CandidateListPage />
    </Suspense>
  );
}
