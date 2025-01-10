import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";

import { Course } from "@/types/mainTypes";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { deleteCourse, updateCourseName, updateCompletedCourseGrade } from "@/redux/slices/dataSlice";

import { useParams } from "react-router-dom";
import { useState } from "react";

interface CompletedCourseCardProps {
  course: Course;
}

const EditCompletedCourseCard: React.FC<CompletedCourseCardProps> = ({ course }) => {
    const data = useSelector((state: RootState) => state.data.data);
    const dispatch = useDispatch();

    const { term: originalTerm } = useParams();

    let term = originalTerm;
    if (term) {
        term = term
            .replace('-', ' ')  // Replace '-' with a space
            .toLowerCase()      // Convert the string to lowercase
            .split(' ')         // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letters
            .join(' ');         // Join back together
    }

    const termData = data.find((t) => t.term === term);

    const [code, setCode] = useState<string>(course.courseTitle.split(' ')[0]);
    const [number, setNumber] = useState<string>(course.courseTitle.split(' ')[1]);
    const [grade, setGrade] = useState<number | null>(course.highestGrade);

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 6);
        setCode(inputValue)
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 5);
        setNumber(inputValue)
    }

    const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    }

    const handleDeleteCourse = (courseName: string) => {
        if (termData) {
            const courseIndex = termData.courses.findIndex(
                (course) => course.courseTitle.toLowerCase() === courseName.toLowerCase()
            );

            if (courseIndex !== -1) {
                //@ts-expect-error no clue
                dispatch(deleteCourse({ term, courseIndex }));
            } else {
                console.log('Course not found');
            }
        }
    };

    const handleGradeChangeBlur = () => {
        if (grade === null) {
            // console.log("Title or number cannot be empty");
            setGrade(course.highestGrade)
            return;
        }
        const updatedCourse = {
            ...course,
            highestGrade: grade, // Trim to avoid unnecessary whitespace
        };
    
        const courseIndex = termData?.courses.findIndex(
            (c) => c.courseTitle.toLowerCase() === course.courseTitle.toLowerCase()
        );
    
        if (termData && courseIndex !== -1) {
            dispatch(updateCompletedCourseGrade({
                term: termData.term,
                //@ts-expect-error no clue
                courseIndex: courseIndex,
                course: updatedCourse
            }));
        } else {
            console.log('Course not found for update');
        }
    };


    const handleTitleChangeBlur = () => {
        if (!code.trim() || !number.trim()) {
            // console.log("Title or number cannot be empty");
            
            // Reset to the original course title if invalid
            setCode(course.courseTitle.split(" ")[0]);
            setNumber(course.courseTitle.split(" ")[1]);
            return;
        }
        const updatedCourse = {
            ...course,
            courseTitle: (code + ' ' + number).trim(), // Trim to avoid unnecessary whitespace
        };
    
        const courseIndex = termData?.courses.findIndex(
            (c) => c.courseTitle.toLowerCase() === course.courseTitle.toLowerCase()
        );
    
        if (termData && courseIndex !== -1) {
            dispatch(updateCourseName({
                term: termData.term,
                //@ts-expect-error no clue
                courseIndex: courseIndex,
                course: updatedCourse
            }));
        } else {
            console.log('Course not found for update');
        }
    };


    return (
        <Card className="h-40 w-40 bg-card rounded-2xl "> {/* Use course's title or id as key */}
            <div className="h-40 w-40 ">
                <div className="h-40 w-40 flex flex-col justify-between gap-2 items-center p-4">
                    <div className="flex flex-row justify-between gap-2 w-full">
                        <Input
                            className="!text-sm"
                            value={code}
                            onChange={handleCodeChange}
                            onBlur={handleTitleChangeBlur} // Trigger the blur function directly
                        />
                        <Input
                            className="!text-sm"
                            value={number}
                            onChange={handleNumberChange}
                            onBlur={handleTitleChangeBlur} // Trigger the blur function directly
                        />
                    </div>

                    <Input
                        className="text-lg"
                        type="number"
                        value={grade !== null ? grade : ""}
                        onChange={handleGradeChange}
                        onBlur={handleGradeChangeBlur} // Trigger the blur function directly
                    />
                    <Button variant="outline" className="border border-red-500" onClick={() => handleDeleteCourse(course.courseTitle)}>
                        <Trash2Icon className="text-red-500" />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default EditCompletedCourseCard;
