import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

import { Checkbox } from "../ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
  

interface AddTermPopupProps {
    isCreatingTerm: boolean;
    setIsCreatingTerm: React.Dispatch<React.SetStateAction<boolean>>;
    isTermComplete: boolean;
    setIsTermComplete: React.Dispatch<React.SetStateAction<boolean>>;
    termName: string;
    setTermName: React.Dispatch<React.SetStateAction<string>>;
    selectedYear: number;
    setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
    createNewTerm: () => void;
    error: string
    setError: React.Dispatch<React.SetStateAction<string>>;
}
  
  const AddTermPopup: React.FC<AddTermPopupProps> = ({
        isCreatingTerm,
        setIsCreatingTerm,
        isTermComplete,
        setIsTermComplete,
        setTermName,
        selectedYear,
        setSelectedYear,
        createNewTerm,
        error,
        setError
    }) => {

    const years = Array.from({ length: 16 }, (_, i) => 2015 + i);

    const handleYearChoose = (year: number) => {
        setSelectedYear(year)
    }
        
    const handleClose = () => {
        setIsTermComplete(false)
        setTermName('Fall')
        setSelectedYear(2015)
        setIsCreatingTerm(!isCreatingTerm)
        setError("")
    }

    return ( 
        <div className="flex flex-row flex-wrap gap-10">
            {isCreatingTerm && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-2 text-xl">Add A New Term</h1>
                            <button onClick={handleClose}><XIcon className="ml-auto w-5 h-auto -top-4 left-2 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <p className="text-sm mb-5 font-extralight"></p>
                        <div className="flex flex-col justify-center items-center w-full gap-6 text-sm">
                            <div className="w-full flex flex-col gap-3 font-medium text-md">
                                <h1>Term</h1>
                                <Select defaultValue="Fall" onValueChange={(value) => setTermName(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Fall" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fall">Fall</SelectItem>
                                        <SelectItem value="Winter">Winter</SelectItem>
                                        <SelectItem value="Spring">Spring</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full flex flex-col gap-3 font-medium text-md">
                                <h1>Year</h1>
                                <ScrollArea className="h-72 w-full rounded-md border">
                                    <div className="p-4">
                                        {years.map((year) => (
                                        <div key={year} >
                                            <div onClick={() => handleYearChoose(year)} className={`cursor-pointer ${selectedYear === year ? 'text-md transition-all transform scale-[105%] pl-4 font-medium text-blue-500' : ''}`}>
                                                {year}
                                            </div>
                                            <Separator className="my-2" />
                                        </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="flex items-center space-x-2 mr-auto mt-5">
                                <Checkbox id="terms" onCheckedChange={() => setIsTermComplete(!isTermComplete)}/>
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Is Term Completed?
                                </label>
                            </div>
                        </div>
                        <p className="text-left mt-6 text-red-600">{error}</p>
                        <div className="flex flex-row justify-end items-center gap-2 mt-10">
                            <Button onClick={() => createNewTerm()}>Add Term</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default AddTermPopup