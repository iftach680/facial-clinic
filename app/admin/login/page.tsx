export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
      <form
        action="/api/admin/login"
        method="POST"
        className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-rose-100 p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <h1 className="text-xl font-semibold text-stone-800">כניסת ניהול</h1>
          <p className="text-sm text-stone-500">התחברות לפאנל הניהול של העסק</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center">
            אימייל או סיסמה שגויים
          </p>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-stone-700">
            אימייל
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-stone-700">
            סיסמה
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 text-sm transition-colors"
        >
          התחברות
        </button>
      </form>
    </div>
  );
}
