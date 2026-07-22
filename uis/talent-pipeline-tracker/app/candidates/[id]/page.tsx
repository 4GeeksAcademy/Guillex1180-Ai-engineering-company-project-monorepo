import { Suspense } from "react";
import { CandidateDetailPage } from "@/components/candidates/candidate-detail-page";

interface CandidateDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
}

function LoadingPage() {
  return <div className="min-h-screen bg-slate-50" />;
}

export default async function CandidateDetailRoute({ params }: CandidateDetailRouteProps) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<LoadingPage />}>
      <CandidateDetailPage recordId={resolvedParams.id} />
    </Suspense>
  );
}