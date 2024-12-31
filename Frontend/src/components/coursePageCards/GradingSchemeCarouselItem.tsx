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
import { CheckIcon, PencilIcon } from "lucide-react";

import { format } from "date-fns";
import { ChangeEvent } from "react";

import { Course, GradingScheme } from "@/types/mainTypes";

import EditAssessmentRow from "./EditAssessmentRow";

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
    setIsAddingDeliverable
}) => {

    return ( 
        <CarouselItem className="pt-3 rounded-2xl bg-card text-card-foreground">
            <h1 className="mr-auto ml-[27px] py-5 text-lg font-medium">{scheme.schemeName}</h1>
            <div className='ml-auto pr-7 flex flex-row justify-end -top-14 relative gap-3'>
                <Button className='bg-white text-black border-2 border-black hover:bg-gray-100'
                        onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Save Changes" : "Edit"} {isEditing ? <CheckIcon/> : <PencilIcon/>}
                </Button>
                {/* {isEditing && <Button className=''>Dicard Changes</Button>} */}
                {!isEditing && <Button className={`bg-${courseData.colour}-500`} onClick={() => setIsAddingDeliverable(true)}>+ Add New Deliverable</Button>}
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
                                        <TableCell className="text-center py-7">{assessment.assessmentName}</TableCell>
                                        <TableCell className="text-center">
                                            {assessment.dueDate
                                                ? format(assessment.dueDate, `MMMM dd, yyyy '@' hh:mma`)
                                                : 'TBD'}
                                        </TableCell>
                                        <TableCell className="text-center w-14">{assessment.weight}</TableCell>
                                        <TableCell className="text-center"> 
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
        </CarouselItem>
     );
}
 
export default GradingSchemeCarouselItem;