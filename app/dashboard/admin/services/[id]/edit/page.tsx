import { EditServiceLoader } from "@/components/admin/edit-service-loader"

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EditServiceLoader id={id} />
}
