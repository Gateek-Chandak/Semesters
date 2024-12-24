

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar"

export function Trigger() {

  return (
    <SidebarMenu className="">
      <SidebarMenuItem>
        <SidebarTrigger className="w-12 h-10" />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
