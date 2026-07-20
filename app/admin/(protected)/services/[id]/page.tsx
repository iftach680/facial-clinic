import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "../ServiceForm";
import { updateService } from "@/lib/actions/services";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  const action = updateService.bind(null, id);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-stone-800">עריכת טיפול</h1>
      <ServiceForm action={action} service={service} />
    </div>
  );
}
