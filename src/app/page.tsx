import TrialsPageClient from "@/components/trials/TrialsPageClient";

export default function TrialsPage() {
  return (
    <TrialsPageClient
      initialData={{ trials: [], totalCount: 0, nextPageToken: null }}
    />
  );
}
