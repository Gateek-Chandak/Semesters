import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarSeparator
} from "@/components/ui/sidebar"

export function Trigger() {

  const { open } = useSidebar()

  return (
    <SidebarMenu className="mb-6 ">
      <SidebarMenuItem>
        <div className="w-full flex flex-row items-center pb-2">
          <SidebarTrigger className="w-12 h-12 mr-auto transform hover:scale-110 transition duration-300 ease-in-out" />
        </div>
        <SidebarSeparator />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
