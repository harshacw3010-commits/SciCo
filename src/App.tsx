// scico-web/src/App.tsx

import HomeSection from "./components/HomeSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/sections/AboutSection";
import ExplorationsSection from "./components/sections/ExplorationsSection";
import PodcastSection from "./components/sections/PodcastSection";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="app-shell">
        <HomeSection images={["/images/1.png"]} />
        <AboutSection />
        <ExplorationsSection />
        <PodcastSection />
      </div>
    </>
  );
}
