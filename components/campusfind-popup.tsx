"use client";

const CAMPUSFIND_URL = "https://campusfind-ruddy.vercel.app/";

export default function CampusFindPopup({
  open,
  onRedirected,
}: {
  open: boolean;
  onRedirected: () => void;
}) {
  if (!open) return null;

  const handleClick = () => {
    window.open(CAMPUSFIND_URL, "_blank", "noopener,noreferrer");
    onRedirected();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClick} />
      <div className="relative z-10 flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-neutral-900/95 p-8 shadow-2xl">
        <div className="flex items-center gap-2 text-red-400">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path
              clipRule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a1 1 0 100-2 1 1 0 000 2z"
              fillRule="evenodd"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white">Open CampusFind?</h3>
        </div>

        <button
          onClick={handleClick}
          className="group flex items-center justify-center gap-2.5 px-2.5 text-white shadow-[2px_2px_rgb(116,116,116)] uppercase font-semibold text-sm bg-[hsl(49deg_98%_60%)] rounded-[50px] relative overflow-hidden transition-all duration-500 active:scale-90 active:transition-all active:duration-100 cursor-pointer"
          style={{ textShadow: "2px 2px rgb(116,116,116)", letterSpacing: "1px" }}
        >
          <span className="now absolute left-0 -translate-x-full transition-all duration-500 ease group-hover:translate-x-2.5 z-[2]">
            okay
          </span>
          <span className="play flex items-center gap-2.5 transition-all duration-500 ease group-hover:translate-x-[200%]">
            are you Ready
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 transition-all duration-500 ease group-hover:scale-[3] group-hover:translate-x-1/2">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>

        <p className="text-xs text-neutral-400">Clicking opens CampusFind in a new tab &amp; resets the terminal.</p>
      </div>
    </div>
  );
}
