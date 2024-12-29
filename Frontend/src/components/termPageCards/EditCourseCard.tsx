import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2Icon } from "lucide-react";

import { Course } from "@/types/mainTypes";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { deleteCourse, updateCourseName } from "@/redux/slices/dataSlice";

import { useParams } from "react-router-dom";
import { useState } from "react";

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

    const [inputValue, setInputValue] = useState<string>(course.courseTitle);

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleDeleteCourse = (courseName: string) => {
        if (termData) {
            const courseIndex = termData.courses.findIndex(
                (course) => course.courseTitle.toLowerCase() === courseName.toLowerCase()
            );

            if (courseIndex !== -1) {
                dispatch(deleteCourse({ term, courseIndex }));
            } else {
                console.log('Course not found');
            }
        }
    };

    const handleBlur = () => {
        console.log('Saving new course title...');
        const updatedCourse = { ...course, courseTitle: inputValue };
        const courseIndex = termData?.courses.findIndex(c => c.courseTitle.toLowerCase() === course.courseTitle.toLowerCase());
        if (termData && courseIndex !== -1) {
            dispatch(updateCourseName({ term: termData.term, courseIndex: courseIndex, course: updatedCourse }));
        } else {
            console.log('Course not found for update');
        }
    };

    return (
        <Card > {/* Use course's title or id as key */}
            <div className="border-2 border-slate-200 bg-card rounded-2xl">
                <div className="h-40 w-40 flex flex-col justify-center gap-4 items-center p-6">
                    <Input
                        className="text-3xl"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur} // Trigger the blur function directly
                    />
                    <Button variant="outline" onClick={() => handleDeleteCourse(course.courseTitle)}>
                        Delete <Trash2Icon />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default EditCourseCard;
