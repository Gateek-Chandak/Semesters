import { Course } from "@/types/mainTypes";

interface CompletedTermCourseCardProps {
  course: Course;
  gradesShown: boolean;
}

const CompletedTermCourseCard: React.FC<CompletedTermCourseCardProps> = ({ course, gradesShown }) =>  {

    return ( 
        <div key={course.courseTitle} className="h-40" >
            <div className={`border-2 border-slate-200 bg-card rounded-2xl`}>
                <div className="h-40 lg:w-40 flex flex-col justify-center gap-1 items-center">
                    {!gradesShown && <h1 className="text-2xl">{course.courseTitle.split(' ')[0]}</h1>}
                    {gradesShown && <h1 className="text-xl">{course.courseTitle}</h1>}
                    {!gradesShown && <h1 className="text-4xl font-medium">{course.courseTitle.split(' ')[1]}</h1>}
                    {gradesShown && <h1 className="text-3xl font-medium">{course.highestGrade}%</h1>}
                </div>
            </div>
        </div>
     );
}
 
export default CompletedTermCourseCard;