import ProjectDetailContent from "@/components/project-detail-content";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailContent projectId={id} />;
}
