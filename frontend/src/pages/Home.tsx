import { AppBar3 } from "../components/AppBar3";
import { useRef } from "react";
import HeroSection from "../components/HeroSection";
import { ExpressYourselfCard } from "../components/ExpressYourSelfCard";
import { ShareKnowledgeCard } from "../components/ShareKnowledgeCard";
import { ImproveSkillsCard } from "../components/ImproveSkillsCard";
import { BlogSlider } from "../components/BlogSlider";
import { AboutStyle } from "../components/AboutStyle";


export function Home() {
    const blogSliderRef = useRef<HTMLDivElement | null>(null);
    return (<>
        <div className="bg-[#0f172a] min-h-screen select-none">
            {/* Floating Background Blobs */}

            {/* Foreground Content */}
            <div className="relative ">
                <AppBar3 />

                <HeroSection blogSliderRef={blogSliderRef} />
                <ExpressYourselfCard />
                <ShareKnowledgeCard />
                <ImproveSkillsCard />

                <div ref={blogSliderRef}>
                    <BlogSlider />
                </div>

                <AboutStyle />
            </div>
        </div>

    </>)
}