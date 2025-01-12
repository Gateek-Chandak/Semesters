import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";

import { Course } from "@/types/mainTypes";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { deleteCourse, updateCourseName, updateCourseSubtitle } from "@/redux/slices/dataSlice";

import { useParams } from "react-router-dom";
import { useState } from "react";

import ConfirmDeletePopup from "../ConfirmDeletePopup";

interface CourseCardProps {
  course: Course;
}

const EditCourseCard: React.FC<CourseCardProps> = ({ course }) => {
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
    const [subtitle, setSubtitle] = useState<string>(course.courseSubtitle);
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 6);
        setCode(inputValue)
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trimStart().slice(0, 5);
        setNumber(inputValue)
    }

    const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubtitle(e.target.value)
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

    const handleTitleChangeBlur = () => {
        console.log('Saving updated course details...');
        if (!code.trim() || !number.trim()) {
            console.log("Title or number cannot be empty");
            
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

    const handleSubtitleChangeBlur = () => {
        const updatedCourse = {
            ...course,
            courseSubtitle: subtitle.trim(), // Trim to avoid unnecessary whitespace
        };
    
        const courseIndex = termData?.courses.findIndex(
            (c) => c.courseTitle.toLowerCase() === course.courseTitle.toLowerCase()
        );
    
        if (termData && courseIndex !== -1) {
            dispatch(updateCourseSubtitle({
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
        <Card > {/* Use course's title or id as key */}
            <div className="bg-card rounded-2xl">
                <div className="h-40 w-40 flex flex-col justify-center gap-2 items-center p-6">
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
                    <Input
                        className="text-lg"
                        value={subtitle}
                        onChange={handleSubtitleChange}
                        onBlur={handleSubtitleChangeBlur} // Trigger the blur function directly
                    />
                    <Button variant="destructive" className="h-8" onClick={() => setIsDeleting(!isDeleting)}>
                        Delete <Trash2Icon className="text-white" />
                    </Button>
                </div>
            </div>
            <ConfirmDeletePopup name={course.courseTitle}
                                isDeleting={isDeleting}
                                setIsDeleting={setIsDeleting}
                                deleteItem={handleDeleteCourse}/>
        </Card>
    );
};

export default EditCourseCard;
