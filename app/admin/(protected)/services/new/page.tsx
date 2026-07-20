import ServiceForm from "../ServiceForm";
import { createService } from "@/lib/actions/services";

export default function NewServicePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-stone-800">טיפול חדש</h1>
      <ServiceForm action={createService} />
    </div>
  );
}
