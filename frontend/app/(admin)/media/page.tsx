import { EmptyState } from "@/components/empty-state";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Card } from "@/components/ui/card";
import { getMedia } from "@/lib/api";
import { formatBytes } from "@/lib/utils";
import Image from "next/image";

export default async function MediaPage() {
  const mediaResponse = await getMedia();
  const media = mediaResponse.data;

  if (!media.length) {
    return <EmptyState title="No media uploaded" description="Snapshots, video clips, and audio files will populate this gallery." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Media"
        title="Central gallery"
        description="All photos, videos, and audio files route through presigned URLs so raw R2 credentials never touch the frontend."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {media.map((item) => (
          <Card key={item.id} className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-ink">{item.filename}</p>
                <p className="mt-1 text-sm text-slate">{formatBytes(item.size_bytes)}</p>
              </div>
              <StatusBadge value={item.media_type} />
            </div>
            {item.media_type === "image" && item.url ? (
              <Image src={item.url} alt={item.filename} className="h-52 w-full rounded-[1.4rem] object-cover" width={208} height={208} />
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-[var(--border)] bg-white/65 p-6 text-sm text-slate">
                Preview available through presigned URL after upload completion.
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
