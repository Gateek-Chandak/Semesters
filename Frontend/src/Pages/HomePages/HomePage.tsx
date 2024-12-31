
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { Outlet, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

import { Trigger } from "@/components/sidebar/trigger";

const HomePage = ( ) => {
  
  const isMobile = useIsMobile()

  const { term: originalTerm, course: originalCourse } = useParams()
  const term = originalTerm?.replace(/-/g, ' ');

  const course = originalCourse?.replace(/-/g, ' ');

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {isMobile && <Trigger />}
        <header className="bg-[#f7f7f7] flex h-fit items-center gap-2 px-4 pt-8">
          <div className="flex items-center gap-2 px-4">
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block text-lg">
                  <BreadcrumbLink href="/home">home</BreadcrumbLink>
                </BreadcrumbItem>
                {term && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem className="text-lg">
                      <BreadcrumbLink href={`/home/${term}`} className="text-muted-foreground">
                        {term}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                {term && course && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem className="text-lg">
                      <BreadcrumbPage>{course}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  );
}
 
export default HomePage;