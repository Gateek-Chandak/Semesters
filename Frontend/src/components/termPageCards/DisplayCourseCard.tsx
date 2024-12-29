import { Link } from "react-router-dom";

import { Course } from "@/types/mainTypes";

import { useParams } from "react-router-dom";

interface CourseCardProps {
  course: Course;
  gradesShown: boolean;
}

const DisplayCourseCard: React.FC<CourseCardProps> = ({ course, gradesShown }) =>  {
    const { term } = useParams()

    return ( 
        <Link key={course.courseTitle} to={`/home/${term?.replace(/\s+/g, '-').toLowerCase()}/${course.courseTitle.replace(/\s+/g, '-').toLowerCase()}`}>
            <div
                style={{
                    '--text-color': course.colour,
                }}
                className="border-2 border-slate-200 bg-card rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-sm hover:border-[var(--border-color)] hover:text-[var(--text-color)]"
            >
                <div className="h-40 w-40 flex flex-col justify-center gap-1 items-center">
                    {!gradesShown && <h1 className="text-3xl">{course.courseTitle.split(' ')[0]}</h1>}
                    {gradesShown && <h1 className="text-2xl">{course.courseTitle}</h1>}
                    {!gradesShown && <h1 className="text-5xl font-medium">{course.courseTitle.split(' ')[1]}</h1>}
                    {gradesShown && <h1 className="text-5xl font-medium">{course.highestGrade}%</h1>}
                </div>
            </div>
        </Link>
     );
}
 
export default DisplayCourseCard;