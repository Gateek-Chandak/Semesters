import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
// This is sample data.
const data = {
  user: {
    name: "Gateek Chandak",
    email: "g2chand@uwaterloo.ca",
    avatar: "/Objects/globe.svg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Fall 2023",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "MATH 135",
          url: "#",
        },
        {
          title: "MATH 137",
          url: "#",
        },
        {
          title: "CS 135",
          url: "#",
        },
        {
          title: "GBDA 101",
          url: "#",
        },
        {
          title: "CFM 101",
          url: "#",
        },
      ],
    },
    {
      title: "Winter 2024",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "MATH 136",
          url: "#",
        },
        {
          title: "MATH 138",
          url: "#",
        },
        {
          title: "CS 136",
          url: "#",
        },
        {
          title: "AFM 191",
          url: "#",
        },
        {
          title: "AFM 132",
          url: "#",
        },
      ],
    },
    {
      title: "Fall 2024",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "MATH 239",
          url: "#",
        },
        {
          title: "STAT 230",
          url: "#",
        },
        {
          title: "AFM 272",
          url: "#",
        },
        {
          title: "CS 235",
          url: "#",
        },
        {
          title: "SYDE 101",
          url: "#",
        },
      ],
    },
    {
      title: "Winter 2025",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "CS 241",
          url: "#",
        },
        {
          title: "CS 240",
          url: "#",
        },
        {
          title: "AFM 274",
          url: "#",
        },
        {
          title: "STAT 231",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}