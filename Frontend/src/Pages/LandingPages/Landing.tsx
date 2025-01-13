import axios from "axios";

import { Button } from "@/components/ui/button";
import FacultyCard from "@/components/landingPageCards/FacultyCard";

import { ArrowUpRight, ArrowDown } from "lucide-react";

const LandingPage = () => {

  const handleLogin = async () => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_SITE_URL}/api/auth/log-in`, {
            method: 'GET',
            withCredentials: true,
          });
          const googleAuthUrl = response.data.url;

          window.location.href = googleAuthUrl;

      } catch {
          console.error("Error during login");
      }
  }

  return ( 
      <div className="lg:bg-[#f1f0f0] flex items-center justify-center w-full h-dvh">
        {/* Main Section with text and buttons */}
        <div className="w-[80%] lg:w-[68%] flex flex-col gap-10 z-50">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-start gap-6 items-center">
              <img src="/Objects/SemesterLogo.svg" alt="Semesters Logo" className="w-12 lg:w-14 h-auto"/>
              <h1 className="text-3xl lg:text-[2.8rem] font-medium">Helping Students Keep It Together.</h1>
            </div>
            <h1 className="text-md lg:text-xl">Stay on top of assignments, track your grades, and be ahead of every deadline.</h1>
          </div>
          <div className="flex flex-row gap-8 w-full justify-between">
            <Button className="w-full flex flex-row justify-between" onClick={handleLogin}>
              Get Started <ArrowUpRight />
            </Button>
            <Button className="w-full flex flex-row justify-between" variant={"outline"}>
              Learn More <ArrowDown />
            </Button>
          </div>
        </div>

        {/* Background Cards */}
        <FacultyCard colour="#270D63" title="Assignment Due @ 11:59" position="top-10 left-[30%]"/>
        <FacultyCard colour="#334FC0" title="22% Needed to Pass" position="top-48 right-[25%]"/>
        <FacultyCard colour="#59BFC7" title="92% Predicted cGPA" position="bottom-40 left-[38%]"/>
        <FacultyCard colour="#629315" title="Upcoming Quiz on Tuesday" position="bottom-20 left-[7%]"/>
        <FacultyCard colour="#883116" title="5 Deliverables Due This Week" position="top-20 right-[7%]"/>
        <FacultyCard colour="purple" title="Export to Google Calendar" position="top-40 left-[4%]"/>
        <FacultyCard colour="#8A0D0F" title="85% Max. Grade Possible " position=" bottom-28 right-[8%]"/>
      </div>
    );
}
 
export default LandingPage;