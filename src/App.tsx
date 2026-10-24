import DrivingScene from "./components/DrivingScene"

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            DriveLab
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            3D Driving Simulator · Lesson 01
          </p>
        </div>

        <span className="rounded-full border border-emerald-700 px-3 py-2 text-xs text-emerald-400">
          SCENE READY
        </span>
      </header>

      <section className="relative h-[75vh] min-h-[420px] overflow-hidden rounded-2xl border border-slate-700">
        <DrivingScene />

        <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-slate-950/80 px-3 py-2 text-xs">
          Road & Vehicle Prototype
        </div>
      </section>
    </main>
  );
}