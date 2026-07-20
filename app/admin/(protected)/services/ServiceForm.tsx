type Service = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  active: boolean;
};

export default function ServiceForm({
  action,
  service,
}: {
  action: (formData: FormData) => void;
  service?: Service;
}) {
  return (
    <form action={action} className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 max-w-xl">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700">שם הטיפול</label>
        <input
          name="name"
          defaultValue={service?.name}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700">תיאור</label>
        <textarea
          name="description"
          defaultValue={service?.description}
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">משך (דקות)</label>
          <input
            name="durationMin"
            type="number"
            min="5"
            step="5"
            defaultValue={service?.durationMin}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">מחיר (ש&quot;ח)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={service?.price}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={service?.active ?? true}
          className="rounded border-stone-300"
        />
        פתוח לקביעת תורים
      </label>

      <button
        type="submit"
        className="rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-5 py-2.5 transition-colors"
      >
        שמירה
      </button>
    </form>
  );
}
