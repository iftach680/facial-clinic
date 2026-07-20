type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  active: boolean;
};

export default function ProductForm({
  action,
  product,
}: {
  action: (formData: FormData) => void;
  product?: Product;
}) {
  return (
    <form action={action} className="bg-white rounded-xl border border-stone-200 p-6 space-y-4 max-w-xl">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700">שם המוצר</label>
        <input
          name="name"
          defaultValue={product?.name}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700">תיאור</label>
        <textarea
          name="description"
          defaultValue={product?.description}
          rows={3}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">מחיר (ש&quot;ח)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-stone-700">מלאי</label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-stone-700">קישור לתמונה (אופציונלי)</label>
        <input
          name="imageUrl"
          defaultValue={product?.imageUrl ?? ""}
          placeholder="https://..."
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={product?.active ?? true}
          className="rounded border-stone-300"
        />
        מוצג בחנות
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
