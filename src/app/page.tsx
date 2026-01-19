import { Hero } from "@/components/hero";
import { RealityCheck } from "@/components/reality-check";
import { TerminalDemo } from "@/components/terminal-demo";
import { Residency } from "@/components/residency";
import { Testimonials } from "@/components/testimonials";
import { ApplicationForm } from "@/components/application-form";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <RealityCheck />
      <TerminalDemo />
      <Residency />
      <Testimonials />
      <ApplicationForm />
      <Footer />
    </div>
  );
}
