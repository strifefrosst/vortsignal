import DashboardPreview from "@/components/DashboardPreview";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20">
        <Hero />
        <DashboardPreview />
      </section>
    </main>
  );
}
