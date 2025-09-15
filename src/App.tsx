// scico-web/src/App.tsx

import HomeSection from "./components/HomeSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/sections/AboutSection";
import ExplorationsSection from "./components/sections/ExplorationsSection";
import PodcastSection from "./components/sections/PodcastSection";
import { useState } from "react";
import EnergyCoreLoader from "./components/loader/EnergyCoreLoader";
import InteractiveBackground from "./components/InteractiveBackground";
import ClientsSection from "./components/ClientsSection";

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && <EnergyCoreLoader onComplete={() => setLoading(false)} />}
      <InteractiveBackground />
      <Navbar />
      <div className="app-shell" aria-hidden={loading}>
        <HomeSection images={["/images/1.png"]} />
        <AboutSection />
        <ClientsSection
          variant="marquee"
          logos={[
            { name: "Duolingo", src: "/logos/duolingo.svg" },
            { name: "Traya", src: "/logos/traya.svg" },
            { name: "Lenskart", src: "/logos/lenskart.svg" },
            { name: "Unacademy", src: "/logos/unacademy.svg" },
            { name: "Deconstruct", src: "/logos/deconstruct.svg" },
            { name: "Policy Bazaar", src: "/logos/policy-bazaar.svg" },
            { name: "Scaler", src: "/logos/scaler.svg" },
            { name: "MuscleBlaze", src: "/logos/muscleblaze.svg" },
            { name: "Pharmeasy", src: "/logos/pharmeasy.svg" },
            { name: "Amazon Mini TV", src: "/logos/amazon-mini-tv.svg" },
          ]}
        />
        <ExplorationsSection />
        <PodcastSection />
      </div>
    </>
  );
}
