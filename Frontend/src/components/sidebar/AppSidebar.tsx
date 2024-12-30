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

  const { open } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Trigger/>
      </SidebarHeader>
      <SidebarContent>
        <div className={open ? "flex flex-row items-center gap-2 mb-5 ml-3 mr-6 py-2 px-2 rounded-xl hover:bg-gray-100" : "flex flex-row items-center gap-2 mb-5 ml-3 mr-6 py-2 px-2 rounded-xl transform hover:scale-105 transition duration-100 ease-in-out hover:border-gray-500"}>
          <Link to="/home" className={(open) ? "" : "transform hover:scale-110 transition duration-300 ease-in-out"}>
            <HomeIcon className="h-[20px] w-autot"/>
          </Link>
          {open && <Link to="/home" className="truncate top-[1px] relative">Home</Link>}
        </div>
        <SidebarSeparator />
        <NavMain data={data} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}