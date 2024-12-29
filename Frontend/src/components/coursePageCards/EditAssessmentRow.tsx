import { ChangeEvent, useState } from "react";
import { format } from "date-fns";

import { TableRow, TableCell } from "../ui/table";
import { Input } from "../ui/input";

import { Assessment, Course } from "@/types/mainTypes";

import { useDispatch } from 'react-redux';
import { updateCourse } from "@/redux/slices/dataSlice";

import { DateTimePicker } from "./DateTimePicker";

interface EditAssessmentRowProps {
    assessment: Assessment
    targetGrade: number | null,
    gradeButtonAction: (grade: number) => void,
    term: string;
    courseIndex: number;
    courseData: Course;
}

const EditAssessmentRow: React.FC<EditAssessmentRowProps> = ( { assessment, targetGrade, gradeButtonAction, term, courseIndex, courseData } ) => {
    const dispatch = useDispatch();

    const [localAssessmentName, setLocalAssessmentName] = useState<string>(assessment.assessmentName)
    const [localAssessmentDueDate, setLocalAssessmentDueDate] = useState<Date | null>(assessment.dueDate)
    const [localAssessmentWeight, setLocalAssessmentWeight] = useState<number>(assessment.weight)

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 25);
        setLocalAssessmentName(inputValue)
    }

    const updateAssessmentName = (assessmentName: string) => {
        // Update the gradingSchemes state to reflect the new assessment name
        const updatedSchemes = courseData?.gradingSchemes.map((scheme) => {
            const updatedAssessments = scheme.assessments.map((a) => {
                if (a.assessmentName === assessmentName) {
                    a = { ...a, assessmentName: localAssessmentName}
                    return a; // Update the assessment name
                }
                return a;
            });
    
            return {
                ...scheme,
                assessments: updatedAssessments,
            };
        });

        dispatch(updateCourse({
            term: term,
            courseIndex: courseIndex,
            course: {
                courseTitle: courseData.courseTitle,
                courseSubtitle: courseData.courseSubtitle,
                colour: courseData.colour,
                highestGrade: courseData.highestGrade,
                gradingSchemes: updatedSchemes
            }
        }))
    };
    
    const updateAssessmentDueDate = (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => {
        const inputValue = e.target.value.trim();

        const newDueDate = inputValue ? new Date(inputValue) : null

        setLocalAssessmentDueDate(newDueDate)

        const updatedSchemes = courseData?.gradingSchemes.map((scheme) => {
            const updatedAssessments = scheme.assessments.map((assessment) => {
                if (assessment.assessmentName === assessmentName) {
                    return { ...assessment, dueDate: newDueDate }; // Update due date
                }
                return assessment;
            });
            return {
                ...scheme,
                assessments: updatedAssessments,
            };
        });
    
        dispatch(updateCourse({
            term: term,
            courseIndex: courseIndex,
            course: {
                courseTitle: courseData.courseTitle,
                courseSubtitle: courseData.courseSubtitle,
                colour: courseData.colour,
                highestGrade: courseData.highestGrade,
                gradingSchemes: updatedSchemes
            }
        }));
    };

    const handleWeightChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();
    
        // Default to 0 if input is empty
        if (inputValue === "") {
            setLocalAssessmentWeight(0);
            return;
        }
    
        const parsedValue = parseFloat(inputValue);
    
        // Ignore invalid or out-of-range values
        if (isNaN(parsedValue) || parsedValue > 100) {
            return;
        }
    
        setLocalAssessmentWeight(parsedValue);
    };

    const updateAssessmentWeight = (assessmentName: string) => {

        let updatedSchemes = courseData?.gradingSchemes.map((scheme) => {
            const updatedAssessments = scheme.assessments.map((assessment) => {
                if (assessment.assessmentName === assessmentName) {
                    return { ...assessment, weight: localAssessmentWeight }; // Update weight
                }
                return assessment;
            });
            return {
                ...scheme,
                assessments: updatedAssessments,
            };
        });
        // Recalculate grades based on updated weights
        updatedSchemes = updatedSchemes.map((scheme) => {
            let totalGrade = 0;
            let totalWeight = 0;
    
            const updatedAssessments = scheme.assessments.map((assessment) => {
                // Calculate the total grade and weight for completed assessments
                if (assessment.grade !== null && assessment.grade !== undefined) {
                    totalGrade += (assessment.grade * assessment.weight) / 100;
                    totalWeight += assessment.weight;
                }
                return assessment;
            });
    
            // Calculate final grade, scaled to completed assessments
            const finalGrade = totalWeight > 0 ? (totalGrade / Math.min(100, totalWeight)) * 100 : 0;

            return {
                ...scheme,
                assessments: updatedAssessments,
                grade: parseFloat(finalGrade.toFixed(2)), // Round to 2 decimal places
            };
        });
    
        dispatch(updateCourse({
            term: term,
            courseIndex: courseIndex,
            course: {
                courseTitle: courseData.courseTitle,
                courseSubtitle: courseData.courseSubtitle,
                colour: courseData.colour,
                highestGrade: courseData.highestGrade,
                gradingSchemes: updatedSchemes
            }
        }))

        if (targetGrade) {
            gradeButtonAction(targetGrade);
        }
    };

    const updateGrade = (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => {
            const inputValue = e.target.value.trim();
            const parsedValue = inputValue === "" ? null : parseFloat(parseFloat(inputValue).toFixed(2));
        
            // Exit early for invalid numbers or out-of-range values
            if (parsedValue !== null && (isNaN(parsedValue) || parsedValue > 200 || parsedValue < 0)) {
                return;
            }
        
            // Update gradingSchemes state
            const updatedSchemes = courseData?.gradingSchemes.map((scheme) => {
                let totalGrade = 0;
                let totalWeight = 0;
        
                const updatedAssessments = scheme.assessments.map((assessment) => {
                    // Update the grade for the matching assessment
                    if (assessment.assessmentName === assessmentName) {
                        assessment = { ...assessment, grade: parsedValue }; // Assign rounded value or null
                    }
        
                    // Include only completed assessments in the grade calculation
                    if (assessment.grade !== null && assessment.grade !== undefined) {
                        totalGrade += (assessment.grade * assessment.weight) / 100;
                        totalWeight += assessment.weight;
                    }
        
                    return assessment;
                });
        
                // Ensure totalWeight doesn't exceed 100
                if (totalWeight > 100) {
                    totalWeight = 100;
                }
        
                // Calculate final grade, scaled to completed assessments
                const finalGrade = totalWeight > 0 ? (totalGrade / totalWeight) * 100 : 0;
        
                return {
                    ...scheme,
                    assessments: updatedAssessments,
                    grade: parseFloat(finalGrade.toFixed(2)), // Round to 2 decimal places
                };
            });
            dispatch(updateCourse({
                term: term,
                courseIndex: courseIndex,
                course: {
                    courseTitle: courseData.courseTitle,
                    courseSubtitle: courseData.courseSubtitle,
                    colour: courseData.colour,
                    highestGrade: courseData.highestGrade,
                    gradingSchemes: updatedSchemes
                }
            }))
        
            if (targetGrade) {
                gradeButtonAction(targetGrade);
            }
    };

    return ( 
        <TableRow key={assessment.assessmentName} className="">
            <TableCell className="text-center text-red-500">x</TableCell>
            <TableCell className="text-center">
                <Input type="text" className="" value={localAssessmentName} onChange={handleNameChange} onBlur={() => updateAssessmentName(assessment.assessmentName)}/>
            </TableCell>
            <TableCell className="text-center">
                {/* <Input type="datetime-local" className="w-52" value={localAssessmentDueDate ? format(localAssessmentDueDate, `MMMM ${localAssessmentDueDate.getDate()}, yyyy '@' hh:mma`) : 'TBD'} onChange={(e) => updateAssessmentDueDate(e, assessment.assessmentName)}/> */}
                <DateTimePicker />
            </TableCell>
            <TableCell className="text-center">
                <Input type="text" className="" value={localAssessmentWeight} onChange={handleWeightChange} onBlur={() => updateAssessmentWeight(assessment.assessmentName)}/>
            </TableCell>
            <TableCell className="text-center"> 
                <Input
                    type="number"
                    value={(assessment.grade === 0 || assessment.grade) ? assessment.grade : ""}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) => updateGrade(e, assessment.assessmentName)}
                    placeholder="00"
                    className="w-20 p-2 my-3 inline"
                    />{" "}
                    %
            </TableCell>
        </TableRow>
     );
}
 
export default EditAssessmentRow;