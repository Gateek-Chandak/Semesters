import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { Trigger } from "./trigger"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar"
import { HomeIcon } from "lucide-react"

import { Link } from "react-router-dom"
import { useSidebar } from "@/components/ui/sidebar"

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// This is sample data.
const user = {
    name: "Gateek Chandak",
    email: "g2chand@uwaterloo.ca",
    avatar: "/Objects/globe.svg",
  }
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = useSelector((state: RootState) => state.data.data);

  const { open, openMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Trigger/>
      </SidebarHeader>
      <SidebarContent>
        <div className={(open || openMobile) ? "px-6 py-4 flex flex-row items-center gap-2 rounded-xl hover:bg-gray-100" : "px-6 py-4 flex flex-row items-center gap-2 rounded-xl transform hover:scale-105 transition duration-100 ease-in-out hover:border-gray-500"}>
          <Link to="/home" className={(open) ? "" : "transform hover:scale-110 transition duration-300 ease-in-out"}>
            <HomeIcon className="!h-5 !w-5"/>
          </Link>
          {(open || openMobile) && <Link to="/home" className="truncate relative text-sm">Home</Link>}
        </div>
        {(open || openMobile) && <SidebarSeparator />}
        <NavMain data={data} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}