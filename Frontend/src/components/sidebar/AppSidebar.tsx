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
} from "@/components/ui/sidebar"

import { Link } from "react-router-dom"

// This is sample data.
const user = {
    name: "Gateek Chandak",
    email: "g2chand@uwaterloo.ca",
    avatar: "/Objects/globe.svg",
  }
export function AppSidebar({ data, ...props }: {data: any } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Trigger/>
      </SidebarHeader>
      <SidebarContent>
        <Link to="/home" className="pl-4">Home</Link>
        <NavMain data={data} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}