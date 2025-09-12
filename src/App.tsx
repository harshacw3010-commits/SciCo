// scico-web/src/App.tsx

import HomeSection from "./components/HomeSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/sections/AboutSection";
import ExplorationsSection from "./components/sections/ExplorationsSection";
import PodcastSection from "./components/sections/PodcastSection";
import { useState } from "react";
import EnergyCoreLoader from "./components/loader/EnergyCoreLoader";

export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && <EnergyCoreLoader onComplete={() => setLoading(false)} />}
      <Navbar />
      <div className="app-shell" aria-hidden={loading}>
        <HomeSection images={["/images/1.png"]} />
        <AboutSection />
        <ExplorationsSection />
        <PodcastSection />
      </div>
    </>
  );
}
