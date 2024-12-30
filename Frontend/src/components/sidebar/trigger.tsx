import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarSeparator
} from "@/components/ui/sidebar"

import { useIsMobile } from "@/hooks/use-mobile"

export function Trigger() {
  const isMobile = useIsMobile()
  const { openMobile } = useSidebar()

  return (
    <SidebarMenu className={`${(isMobile && openMobile) ? 'bg-[#f7f7f7] mb-6' : 'bg-[#f7f7f7]'}`}>
      <SidebarMenuItem>
        <div className="w-full flex flex-row items-center pb-2">
          <SidebarTrigger className={`
              ${(isMobile && openMobile) ? 'w-12 h-12' : ''} 
              ${(isMobile && !openMobile) ? 'w-20 h-10 relative top-6' : ''} 
              mr-auto transform hover:scale-110 transition duration-300 ease-in-out`} />
        </div>
        {isMobile && openMobile && <SidebarSeparator />}
        {!isMobile && <SidebarSeparator />}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
