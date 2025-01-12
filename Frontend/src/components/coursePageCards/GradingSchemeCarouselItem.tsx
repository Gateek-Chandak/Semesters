import { CarouselItem } from "../ui/carousel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Table,
         TableHeader,
         TableRow,
         TableHead,
         TableBody,
         TableCell
} from "../ui/table";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { format } from "date-fns";
import { ChangeEvent, useState } from "react";

import { updateCourse } from "@/redux/slices/dataSlice";
import { useDispatch } from "react-redux";

import { Course, GradingScheme } from "@/types/mainTypes";

import EditAssessmentRow from "./EditAssessmentRow";
import ConfirmDeletePopup from "../ConfirmDeletePopup";

interface GradingSchemeCarouselItemProps {
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    scheme: GradingScheme;
    targetGrade: number | null;
    gradeButtonAction: (grade: number) => void;
    term: string;
    courseIndex: number;
    courseData: Course;
    updateGrade: (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => void
    setIsAddingDeliverable: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAddingScheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const GradingSchemeCarouselItem: React.FC<GradingSchemeCarouselItemProps> = ({
    isEditing,
    setIsEditing,
    scheme,
    targetGrade,
    gradeButtonAction,
    term,
    courseIndex,
    courseData,
    updateGrade,
    setIsAddingDeliverable,
    setIsAddingScheme
}) => {

    const dispatch = useDispatch()
    
    const [schemeName, setSchemeName] = useState<string>(scheme.schemeName)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const handleSchemeNameUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim().slice(0, 25); // Use `e.target.value` to get the input's current value
        setSchemeName(inputValue); // Update the state with the new value
    };
    
    const handleSchemeNameBlur = () => {
        if (!schemeName || schemeName.trim() === "") {
            // If the scheme name is empty or consists of only whitespace, reset it
            setSchemeName(scheme.schemeName);
        } else {
            // Dispatch an action to update the scheme name in the Redux store
            const updatedSchemes = courseData.gradingSchemes.map((s) => 
                s.schemeName === scheme.schemeName
                    ? { ...s, schemeName: schemeName.trim() }
                    : s
            );
    
            const updatedCourse = {
                ...courseData,
                gradingSchemes: updatedSchemes,
            };
    
            dispatch(
                updateCourse({
                    term: term,
                    courseIndex: courseIndex,
                    course: updatedCourse,
                })
            );
        }
    };    

    const deleteScheme = (name: string) => {
        const updatedSchemes = courseData.gradingSchemes.filter((s) => 
            s.schemeName !== name // Ensure this returns a boolean
        );
    
        const updatedCourse = {
            ...courseData,
            gradingSchemes: updatedSchemes.length > 0 ? updatedSchemes : [],
        };

        console.log(updateCourse)
        dispatch(
            updateCourse({
                term: term,
                courseIndex: courseIndex,
                course: updatedCourse,
            })
        );
    };

    return ( 
        <CarouselItem className={`w-full pt-5 rounded-2xl bg-card text-card-foreground flex flex-col gap-8`}>
            <div className='w-full pr-7 flex flex-row justify-between items-center gap-3'>
            {!isEditing && <h1 className="mr-auto text-left relative left-20 top-1 text-lg font-medium">{scheme.schemeName}</h1>}
            {isEditing && <Input className="w-52 text-left relative left-20 h-10 !text-lg font-medium" 
                                 value={schemeName}
                                 onChange={handleSchemeNameUpdate}
                                 onBlur={handleSchemeNameBlur}/>}
            {isEditing && 
                <Button variant="outline" className="ml-auto bg-white text-black border border-red-500 hover:bg-gray-100" onClick={() => setIsDeleting(!isDeleting)}>
                    <Trash2Icon className="text-red-500" />
                </Button>}
                <Button className='bg-white text-black border-2 border-black hover:bg-gray-100'
                        onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Save Changes" : "Edit"} {isEditing ? <CheckIcon/> : <PencilIcon/>}
                </Button>
                {/* {isEditing && <Button className=''>Dicard Changes</Button>} */}
                {!isEditing && 
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default">+ Add</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 flex flex-col gap-1">
                            <DropdownMenuItem>
                                <Button variant={'ghost'} className='w-full' onClick={() => setIsAddingDeliverable(true)}><h1 className='w-full text-left'>+ Add New Deliverable</h1></Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Button variant={'ghost'} className='w-full' onClick={() => setIsAddingScheme(true)}><h1 className='w-full text-left'>+ Add New Grading Scheme</h1></Button>
                            </DropdownMenuItem>                                                  
                        </DropdownMenuContent>
                    </DropdownMenu>}
            </div>
            <div className="h-[33.5rem] overflow-y-auto" >
                <Table className="mb-4">
                    <TableHeader className=''>
                        <TableRow className=''> 
                            {isEditing ? <TableHead className="text-center"></TableHead> : null} 
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Due Date</TableHead>
                            <TableHead className="text-center">Weight</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className=''>
                        {scheme.assessments.map((assessment) => {
                            if (!isEditing) {
                                return (
                                    <TableRow key={assessment.assessmentName} className="">
                                        <TableCell className="text-center w-[25%]">{assessment.assessmentName}</TableCell>
                                        <TableCell className="text-center w-[25%]">
                                            {assessment.dueDate
                                                ? format(assessment.dueDate, `MMMM dd, yyyy '@' hh:mma`)
                                                : 'TBD'}
                                        </TableCell>
                                        <TableCell className="text-center w-[25%]">{assessment.weight}</TableCell>
                                        <TableCell className="text-center w-[25%]"> 
                                            <Input
                                                type="number"
                                                value={(assessment.grade === 0 || assessment.grade) ? assessment.grade : ""}
                                                onWheel={(e) => e.currentTarget.blur()}
                                                onChange={(e) => updateGrade(e, assessment.assessmentName)}
                                                placeholder="00"
                                                className="w-16 p-2 my-3 inline"
                                                />{" "}
                                                %
                                        </TableCell>
                                    </TableRow>
                                )
                            } else {
                                return (
                                    <EditAssessmentRow  key={assessment.assessmentName}
                                                        assessment={assessment}
                                                        targetGrade={targetGrade}
                                                        gradeButtonAction={gradeButtonAction}
                                                        term={term}
                                                        courseIndex={courseIndex}
                                                        courseData={courseData}
                                                        updateGrade={updateGrade}
                                                        scheme={scheme}/>
                                )
                            }
                        })}
                    </TableBody> 
                </Table>
            </div>
            <ConfirmDeletePopup name={scheme.schemeName}
                                deleteItem={deleteScheme}
                                isDeleting={isDeleting}
                                setIsDeleting={setIsDeleting}/>
        </CarouselItem>
     );
}
 
export default GradingSchemeCarouselItem;