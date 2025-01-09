import { useState } from "react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarSeparator
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"

import { useIsMobile } from "@/hooks/use-mobile"
import { useDispatch } from "react-redux"
import { addTerms } from "@/redux/slices/dataSlice"
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import AddTermPopup from "../DashboardPageCards/AddTermPopup"

export function Trigger() {
  const data = useSelector((state: RootState) => state.data.data);
  const isMobile = useIsMobile()
  const { openMobile } = useSidebar()
  const dispatch = useDispatch()

  const [isCreatingTerm, setIsCreatingTerm] = useState<boolean>(false)
  const [isTermComplete, setIsTermComplete] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [termName, setTermName] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<number>(2015)

  const createNewTerm = () => {
    if (!termName.trim()) {
        setError('Must choose a term')
        return;
    }

    const newTermName = termName + ' ' + selectedYear.toString()

    const repeatedTerms = data.find((t) => t.term.toLowerCase() === newTermName.toLowerCase())

    if (repeatedTerms) {
      setError('This term already exists')
      return;
    }

    setIsTermComplete(false)
    setTermName('Fall')
    setSelectedYear(2015)
    setIsCreatingTerm(!isCreatingTerm)
    setError("")

    dispatch(addTerms({
      terms: [{term: newTermName, isCompleted: isTermComplete, courses: []}]
    }))
  }

  return (
    <SidebarMenu className={`
              ${(isMobile && !openMobile) ? 'bg-[#f7f7f7] px-6 pt-4' : ''}
              ${(isMobile && openMobile) ? 'bg-[#f7f7f7]' : ''}`}>
      <SidebarMenuItem>
        <div className="flex flex-row justify-between w-full">
          <div className="w-full flex flex-row items-center pb-2">
            <SidebarTrigger className={`
                ${(isMobile && openMobile) ? 'pb-4' : ''} 
                ${(isMobile && !openMobile) ? 'relative' : ''} 
                ${(!isMobile) ? 'pb-4' : ''}
                px-6 pt-4 mr-auto`} />
          </div>
          <div className="w-full flex flex-row items-center mb-2 mx-2">
            <Button variant={'ghost'} className="ml-auto text-xl" onClick={() => setIsCreatingTerm(!isCreatingTerm)}>
              +
            </Button>
          </div>
        </div>
        
        {isMobile && openMobile && <SidebarSeparator />}
        {!isMobile && <SidebarSeparator />}
      </SidebarMenuItem>
      <AddTermPopup isCreatingTerm={isCreatingTerm}
                    setIsCreatingTerm={setIsCreatingTerm}
                    isTermComplete={isTermComplete}
                    setIsTermComplete={setIsTermComplete}
                    termName={termName}
                    setTermName={setTermName}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    createNewTerm={createNewTerm}
                    error={error}
                    setError={setError}/>
    </SidebarMenu>
  )
}
