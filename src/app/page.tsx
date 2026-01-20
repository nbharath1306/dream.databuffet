import { Hero } from "@/components/hero";
import { RealityCheck } from "@/components/reality-check";
import { TerminalDemo } from "@/components/terminal-demo";
import { Cohort } from "@/components/cohort";
import { Testimonials } from "@/components/testimonials";
import { ApplicationProtocol } from "@/components/application-protocol";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <RealityCheck />
      <TerminalDemo />
      <Cohort />
      <Testimonials />
      <ApplicationProtocol />
      <Footer />
    </div>
  );
}
