import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { XIcon } from "lucide-react";

import { useDispatch } from "react-redux";
import { updateCourse } from "@/redux/slices/dataSlice";

import { useState } from "react";

import { Course, GradingScheme } from "@/types/mainTypes";

import { DateTimePicker } from "./DateTimePicker";
import { ChangeEvent } from "react";

interface AddDeliverablePopupProps {
    isAddingDeliverable: boolean;
    setIsAddingDeliverable: React.Dispatch<React.SetStateAction<boolean>>;
    term: string;
    courseIndex: number;
    courseData: Course;
    determineGrade: (updatedSchemes: GradingScheme[]) => number | undefined;
}

const AddDeliverablePopup: React.FC<AddDeliverablePopupProps> = ( {isAddingDeliverable, setIsAddingDeliverable, term, courseIndex, courseData, determineGrade} ) => {

    const dispatch  = useDispatch()

    const [error, setError] = useState<string>('')
    const [selectedScheme, setSelectedScheme] = useState<string | null>(null)
    const [name, setName] = useState<string>('')
    const [weight, setWeight] = useState<number>(0)
    const [grade, setGrade] = useState<number | null>(null)
    const [date, setDate] = useState<string | null>(null)

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 25);
        setName(inputValue)
    }

    const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value.trim();

            // Default to 0 if input is empty
            if (inputValue === "") {
                setWeight(0);
                return;
            }
        
            const parsedValue = parseFloat(inputValue);
        
            // Ignore invalid or out-of-range values
            if (isNaN(parsedValue) || parsedValue > 100) {
                return;
            }
        
            setWeight(parsedValue);
    };

    const handleGradeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        if (inputValue === "") {
            setGrade(null);
            return;
        }
    
        const parsedValue = parseFloat(inputValue);
    
        if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 200) {
            const formattedValue = parsedValue.toFixed(2); 
            setGrade(Number(formattedValue)); 
        }
    };

    const handleClose = () => {
        setIsAddingDeliverable(false)
        setName('')
        setWeight(0)
        setGrade(null)
        setDate(null)
        setSelectedScheme(null)
    }

    const handleDeliverableAdd = () => {
        const newAssessment = {
            assessmentName: name,
            weight: weight,
            grade: grade,
            dueDate: date,
        };

        if (!name || name.trim() === "") {
            setError('Name is required');
            setName("")
            return;
        }

        const repeatedName = courseData?.gradingSchemes.find((scheme) =>
            scheme.assessments.some((assessment) => (assessment.assessmentName === name && scheme.schemeName === selectedScheme))
        );
        
        if (repeatedName) {
            setError('A deliverable with this name already exists.')
            return;
        }
        if (!selectedScheme) {
            setError('Please select a grading scheme')
            return
        }
    
        const updatedSchemes = courseData?.gradingSchemes.map((scheme) => {
            if (scheme.schemeName === selectedScheme) {
                return {
                    ...scheme, // Clone the scheme
                    assessments: [...scheme.assessments, newAssessment], // Create a new array
                };
            }
            return scheme; // Return unchanged schemes
        });

        const newGrade = determineGrade(updatedSchemes)

        dispatch(
            updateCourse({
                term: term,
                courseIndex: courseIndex,
                course: {
                    ...courseData,
                    highestGrade: newGrade ||  0,
                    gradingSchemes: updatedSchemes,
                },
            })
        );
        determineGrade(updatedSchemes)
        setIsAddingDeliverable(false);
        setName('')
        setWeight(0)
        setGrade(null)
        setDate(null)
        setSelectedScheme(null)
    };
    

    return ( 
        <div className="flex flex-row flex-wrap gap-10">
            {isAddingDeliverable && 
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
                        <div className="flex flex-row items-center">
                            <h1 className="mr-auto text-left font-semibold mb-10 text-xl">Add Deliverable</h1>
                            <button onClick={handleClose}><XIcon className="ml-auto w-5 h-auto -top-8 left-2 relative hover:text-red-600 transform transition-all duration-200 hover:scale-106"/></button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Name *</h1>
                                <Input placeholder="ex. Quiz 1" value={name} onChange={handleNameChange}></Input>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Weight</h1>
                                <Input placeholder="ex. 10" value={weight} onChange={handleWeightChange}></Input>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Grade</h1>
                                <Input type="number" placeholder="ex. 85" value={grade || ''} onChange={handleGradeChange}></Input>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Due Date</h1>
                                <DateTimePicker dueDate={date} setLocalDueDate={setDate}/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">Grading Scheme *</h1>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">{selectedScheme ? selectedScheme : 'Choose Grading Scheme'}</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuRadioGroup value={selectedScheme || undefined} onValueChange={setSelectedScheme}>
                                            {courseData && courseData.gradingSchemes.map((scheme) => {
                                                return (
                                                    <DropdownMenuRadioItem key={scheme.schemeName} value={scheme.schemeName}>{scheme.schemeName}</DropdownMenuRadioItem>
                                                )
                                            })}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <p className="text-left my-3 text-red-600">{error}</p>
                        <div className="flex flex-row justify-end items-center gap-2 mt-10">
                            <Button onClick={handleDeliverableAdd}>+ Add Deliverable</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
     );
}
 
export default AddDeliverablePopup;