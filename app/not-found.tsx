export default function NotFound() {
  return (
    <section className="flex items-center justify-center min-h-[60vh]">
      <div
        className="text-center backdrop-blur-2xl bg-white/30 rounded-3xl p-12 border border-white/20"
        style={{
          boxShadow:
            "0 8px 32px 0 rgba(139, 99, 76, 0.15), inset 0 1px 0 0 rgba(255, 248, 240, 0.6)",
        }}
      >
        <h1 className="mb-6 text-6xl font-bold tracking-tight bg-gradient-to-r from-[#3E3028] to-[#6B5D52] bg-clip-text text-transparent">
          404
        </h1>
        <p className="mb-4 text-lg text-[#6B5D52]">
          The page you are looking for does not exist.
        </p>
      </div>
    </section>
  );
}
