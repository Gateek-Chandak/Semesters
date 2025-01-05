import { ChangeEvent, useEffect, useState } from "react";

import { TableRow, TableCell } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

import { Assessment, Course, GradingScheme } from "@/types/mainTypes";

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
    updateGrade: (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => void;
    scheme: GradingScheme;
}

const EditAssessmentRow: React.FC<EditAssessmentRowProps> = ( { assessment, targetGrade, gradeButtonAction, term, courseIndex, courseData, updateGrade, scheme } ) => {
    const dispatch = useDispatch();

    const [localAssessmentName, setLocalAssessmentName] = useState<string>(assessment.assessmentName)
    const [localAssessmentDueDate, setLocalAssessmentDueDate] = useState<null | string>(assessment.dueDate)
    const [localAssessmentWeight, setLocalAssessmentWeight] = useState<number>(assessment.weight)

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 25);
        setLocalAssessmentName(inputValue)
    }

    const updateAssessmentName = (assessmentName: string) => {
        // Update the gradingSchemes state to reflect the new assessment name
        if (localAssessmentName.trim() == "") {
            return;
        }

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

    const deleteAssessment = (assessmentName: string) => {
        const updatedSchemes = courseData?.gradingSchemes.map((s) => {

            if (s.schemeName === scheme.schemeName) {
                const updatedAssessments = s.assessments.filter((a) => a.assessmentName !== assessmentName);
                
                return {
                    ...s,
                    assessments: updatedAssessments,
                };
            }
            return s;
        });
    
        if (updatedSchemes) {
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
        }
    };

    useEffect(() => {
        const updateAssessmentDueDate = (assessmentName: string) => {
            const updatedSchemes = courseData?.gradingSchemes.map((scheme) => {
                const updatedAssessments = scheme.assessments.map((assessment) => {
                    if (assessment.assessmentName === assessmentName) {
                        return { ...assessment, dueDate: localAssessmentDueDate }; // Update due date
                    }
                    return assessment;
                });
                return {
                    ...scheme,
                    assessments: updatedAssessments,
                };
            });
    
            // Dispatch the updated course data with new grading schemes
            dispatch(updateCourse({
                term: term,
                courseIndex: courseIndex,
                course: {
                    ...courseData,
                    gradingSchemes: updatedSchemes,
                },
            }));
        };

        updateAssessmentDueDate(assessment.assessmentName)
    }, [localAssessmentDueDate, assessment.assessmentName])

    return ( 
        <TableRow key={assessment.assessmentName} className="">
            <TableCell className="text-center">
                <Button className="w-5 h-8 hover:text-red-500" variant={'ghost'} onClick={() => deleteAssessment(assessment.assessmentName)}>
                    <XIcon className="!w-3 !h-3"/>
                </Button>
            </TableCell>
            <TableCell className="text-center">
                <Input type="text" className="" value={localAssessmentName} onChange={handleNameChange} onBlur={() => updateAssessmentName(assessment.assessmentName)}/>
            </TableCell>
            <TableCell className="text-center">
                {/* <Input type="datetime-local" className="w-52" value={localAssessmentDueDate ? format(localAssessmentDueDate, `MMMM ${localAssessmentDueDate.getDate()}, yyyy '@' hh:mma`) : 'TBD'} onChange={(e) => updateAssessmentDueDate(e, assessment.assessmentName)}/> */}
                <DateTimePicker dueDate={localAssessmentDueDate} setLocalDueDate={setLocalAssessmentDueDate}/>
            </TableCell>
            <TableCell className="text-center">
                <Input type="text" className="w-14" value={localAssessmentWeight} onChange={handleWeightChange} onBlur={() => updateAssessmentWeight(assessment.assessmentName)}/>
            </TableCell>
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
     );
}
 
export default EditAssessmentRow;