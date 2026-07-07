import HeatmapBackground from "./components/HeatmapBackground";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/sections/Hero";
import Waitlist from "./components/sections/Waitlist";

function App() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <HeatmapBackground />

      <a
        href="#waitlist"
        className="sr-only rounded-lg bg-surface px-4 py-2 font-semibold text-body ring-2 ring-brand focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to sign-up
      </a>

      <Navbar />

      <main className="flex-1">
        <Hero />
        <Waitlist />
      </main>

      <Footer />
    </div>
  );
}

export default App;
