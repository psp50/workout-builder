"use client";

interface HeaderProps {
  title: string;
  onSave?: () => void;
}

export default function Header({ title, onSave }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-card">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Go back"
          className="grid h-8 w-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-slate-800">{title}</h1>
        <button
          type="button"
          aria-label="Rename workout"
          className="grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <button
        type="button"
        onClick={onSave}
        className="rounded-full bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 active:bg-brand-700"
      >
        Save Workout
      </button>
    </header>
  );
}
