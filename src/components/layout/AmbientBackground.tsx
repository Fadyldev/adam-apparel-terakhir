export default function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-100">
      {/* Real clothing rack / apparel workshop background with very subtle blur so it is clearly visible */}
      <img
        src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=2000&q=85"
        alt="Workshop konveksi baju"
        className="h-full w-full scale-102 object-cover object-center filter blur-[1px] opacity-80 brightness-95"
      />
      {/* Soft gradient overlay keeping clothes clearly discernible while text remains crisp */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-slate-50/40 to-white/55" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/15 blur-2xl" />
      <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-400/15 blur-2xl" />
    </div>
  );
}
