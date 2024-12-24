import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar"

import { Link } from "react-router-dom";


export function NavMain({ data }: {data:any}) {

  const { open } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-md mb-3">Courses</SidebarGroupLabel>
      {open && 
      <SidebarMenu className="">
        {data.data.map((term) => (
          <Collapsible
            key={term.term}
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={term.term}>
                  <Link className="truncate text-[1.1rem]" to={`/home/${term.term.replace(/\s+/g, '-').toLowerCase()}`}>
                    {term.term}
                  </Link>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {term.courses?.map((course: any) => (
                    <SidebarMenuSubItem key={course.courseTitle}>
                      <SidebarMenuSubButton asChild>
                        <Link className="text-lg" to={`/home/${term.term.replace(/\s+/g, '-').toLowerCase()}/${course.courseTitle.replace(/\s+/g, '-').toLowerCase()}`}>
                          <span>{course.courseTitle}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>}
    </SidebarGroup>
  );
}
