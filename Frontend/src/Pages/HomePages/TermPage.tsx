import { useParams, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { CircularProgress } from "@/components/termPageCards/CircularProgessBar";
import { v4 as uuid } from 'uuid';
import { addHours } from "date-fns";
import { useState, useEffect } from "react";
import { EyeOffIcon, EyeIcon, PencilIcon, ChevronRight, ChevronLeft, Check } from "lucide-react";
import axios from "axios";

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { addCourse } from "@/redux/slices/dataSlice";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  CalendarCurrentDate,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
} from '../../components/Calendar';

import { IncomingCourseInfo } from "@/types/mainTypes";

import EditCourseCard from "@/components/termPageCards/EditCourseCard";
import CreateCoursePopup from "@/components/termPageCards/CreateCoursePopup";
import DisplayCourseCard from "@/components/termPageCards/DisplayCourseCard";

const TermPage = () => {
    const data = useSelector((state: RootState) => state.data.data);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { toast } = useToast();
    const { term: originalTerm } = useParams();

    // Format the current date
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'EEEE, MMMM dd');

    // State variables
    const [termGrade, setTermGrade] = useState<number>(0);
    const [gradesShown, setGradesShown] = useState<boolean>(false);
    const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [courseTitle, setCourseTitle] = useState<string>("");
    const [courseSubtitle, setCourseSubtitle] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isManagingCourses, setIsManagingCourses] = useState<boolean>(false)
    const [isShowingAverage, setIsShowingAverage] = useState<boolean>(true)

    // Term processing logic
    let term = originalTerm;
    if (term) {
        term = term
            .replace('-', ' ') // Replace '-' with a space
            .toLowerCase()     // Convert the string to lowercase
            .split(' ')        // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letters
            .join(' ');        // Join back together
    }

    const termData = data.find((t) => t.term === term);

    useEffect(() => {
        if (termData && termData.courses?.length > 0) {
            const courseGrades = termData.courses.reduce((total: number, course) => {
                return total + course.highestGrade;
            }, 0);

            const average = courseGrades / termData.courses.length;
            setTermGrade(parseFloat(average.toFixed(2)));
        } else {
            setTermGrade(0); // Default if no courses exist
        }
    }, [termData, data]);


    const formatNewGradingScheme = (courseInfo: IncomingCourseInfo) => {
        return courseInfo.gradingSchemes.map((scheme) => ({
            schemeName: scheme.schemeName,
            grade: 0,
            assessments: scheme.assessments.map((assessment) => ({
                assessmentName: assessment.assessmentName,
                dueDate: assessment.dueDate ? new Date(assessment.dueDate) : null,
                weight: assessment.weight,
                grade: null,
            })),
        }));
    };

    // Create a new course
    const createNewCourse = async (): Promise<void> => {
        if (!courseTitle || courseTitle.trim() === "") {
            setError('title is required');
            setIsUploading(false);
            setIsCreatingCourse(true)
            return;
        }

        if (!courseSubtitle || courseSubtitle.trim() === "") {
            setError('subtitle is required');
            setIsUploading(false);
            setIsCreatingCourse(true)
            return;
        }

        const courseParam = courseTitle
                .replace(' ', '-') 

        if (!uploadedFile) {
            const newCourse = {
                courseTitle: courseTitle,
                courseSubtitle: courseSubtitle,
                colour: 'blue',
                highestGrade: 0,
                gradingSchemes: []
            }

            dispatch(addCourse({ term: term, course: newCourse }));

            navigate(`/home/${originalTerm}/${courseParam}`);
            return;
        }

        setIsUploading(true);
        setIsCreatingCourse(false);

        const formData = new FormData();
        formData.append("pdf", uploadedFile);

        try {
            const response = await axios.post("http://localhost:4000/api/pdf/upload-schedule/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = await response.data;
            const json = await JSON.parse(data);

            const gradingSchemes = formatNewGradingScheme(json)

            const newCourse = {
                courseTitle: courseTitle,
                courseSubtitle: courseSubtitle,
                colour: 'blue',
                highestGrade: 0,
                gradingSchemes: gradingSchemes
            }

            dispatch(addCourse({ term: term ? term : "", course: newCourse }));
            setIsUploading(false);
            navigate(`/home/${originalTerm}/${courseParam}`);
            return;
        } catch (error: any) {

            setIsUploading(false);
            setIsCreatingCourse(true);

            if (error.response.data.error === "no assessment schedule found") {
                setError("File not a syllabus");
                toast({
                    variant: "destructive",
                    title: "File Upload Unsuccessful",
                    description: "Your file is not a syllabus",
                });
            } else {
                setError(error.response.data.error);
                toast({
                    variant: "destructive",
                    title: "File Upload Error",
                    description: "There was an error uploading your file. Please try again.",
                });
            }
            console.log(error);
        }
    };

    return ( 
        <div className="w-full h-dvh min-h-fit px-10 pt-14 bg-[#f7f7f7] flex flex-col gap-11 justify-start items-center overflow-hidden">
            <div className="max-w-[1840px] flex flex-col gap-14">
                <div className="w-[100%] h-fit flex flex-col gap-10 lg:flex-row">
                    <div className="w-[100%] lg:w-[60%] flex flex-col gap-10">
                        <div className="flex flex-row items-center justify-start gap-4 text-3xl">
                            <h1 className="text-3xl font-bold">{term}</h1>
                            <h1 className="text-3xl font-extralight"> {formattedDate}</h1>
                        </div>
                        <div className="w-[100%] mt-2 h-full flex flex-col items-center md:flex-row gap-10">
                            <Card className="w-[100%] md:w-[35%] px-6 py-[18px]">
                                <CircularProgress 
                                    percentage={termGrade} 
                                    label="Term Average"
                                    description=""
                                    isShowingAverage={isShowingAverage}
                                    setIsShowingAverage={setIsShowingAverage}
                                />
                            </Card>
                            <div className="md:w-[65%] w-[100%] h-full flex flex-col items-center gap-6">
                                <Card className="w-[100%] h-[50%] py-16 md:py-0 px-10 flex flex-row gap-10 justify-center items-center ">
                                    <h1 className="text-6xl font-semibold">9</h1>
                                    <p className="font-light text-md"><span className="font-bold">deliverables due this week.</span> Good luck! You may or may not be cooked...</p>
                                </Card>
                                <Card className="w-[100%] h-[50%] py-16 md:py-0 px-10 flex flex-row gap-10 justify-center items-center ">
                                    <h1 className="text-6xl font-semibold">111</h1>
                                    <p className="font-light text-md"><span className="font-bold">deliverables due this week.</span> Good luck! You may or may not be cooked...</p>
                                </Card>
                            </div>
                            
                        </div>
                    </div>
                    <div className="w-[100%] lg:w-[40%] flex flex-col gap-10">
                        <h1 className="w-[100%] text-3xl font-bold">
                            Next 7 Days...
                        </h1>
                        <div className="h-[100%] w-[100%]"> 
                            <Card className="w-[100%] h-[25rem] h-max-[27rem] overflow-y-auto p-4 flex flex-col gap-2">
                                <div className="h-full flex flex-col gap-4 justify-between">
                                    <Card className="p-5 h-full bg-gradient-to-b from-purple-100 via-purple-50 to-white">
                                        <h1 className="font-medium">MATH 135</h1>
                                        <div className="mt-2 flex flex-col justify-center">
                                            <p className="font-extralight">Assignment 1</p>
                                            <p className="font-extralight">Quiz 1</p>
                                        </div>
                                    </Card>
                                    <Card className="p-5 h-full bg-gradient-to-b from-blue-100 via-blue-50 to-white">
                                        <h1 className="font-medium">MATH 137</h1>
                                        <div className="mt-2 flex flex-col justify-center">
                                            <p className="font-extralight">Quiz 1</p>
                                        </div>
                                    </Card>
                                    <Card className="p-5 h-full bg-gradient-to-b from-green-100 via-green-50 to-white">
                                        <h1 className="font-medium">CS 136</h1>
                                        <div className="mt-2 flex flex-col justify-center">
                                            <p className="font-extralight">Lab 1</p>
                                        </div>
                                    </Card>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="w-[100%] flex flex-col gap-10 lg:flex-row h-fit">
                    <div className="h-[100%] w-[100%] lg:w-[55%] flex flex-col gap-10">
                        <div className="flex flex-col gap-7 sm:gap-0 sm:flex-row w-ful pr-12">
                            <h1 className="sm:mr-auto text-3xl font-bold">Current Courses</h1>
                            <div className="sm:ml-auto flex flex-row gap-4">
                                {!isManagingCourses && <Button className='border-2 border-black bg-white text-black hover:bg-gray-100' onClick={() => setIsManagingCourses(!isManagingCourses)}>Manage Courses <PencilIcon/></Button>}
                                {isManagingCourses && <Button className='border-2 border-black bg-white text-black hover:bg-gray-100' onClick={() => setIsManagingCourses(!isManagingCourses)}>Save Changes <Check/></Button>}
                                {!isManagingCourses && !gradesShown && <Button className='' onClick={() => setGradesShown(!gradesShown)}>Show Grades <EyeIcon /></Button>}
                                {!isManagingCourses && gradesShown && <Button className='' onClick={() => setGradesShown(!gradesShown)}>Hide Grades <EyeOffIcon /></Button>}
                            </div>
                        </div>
                        <div className="flex flex-row flex-wrap gap-10">
                            {!isManagingCourses && termData && termData.courses.map((course) => { return ( <DisplayCourseCard key={course.courseTitle} course={course} gradesShown={gradesShown}/> ); })}
                            {isManagingCourses && termData && termData.courses.map((course) => { return ( <EditCourseCard key={course.courseTitle} course={course} /> ); })}
                            <div onClick={() => setIsCreatingCourse(!isCreatingCourse)} 
                                 className="h-40 w-40 flex flex-col justify-center items-center border-2 border-slate-200 bg-card rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                                 role="button" 
                                 tabIndex={0}>
                                <h1 className="text-7xl font-extralight">+</h1>
                            </div>
                        </div>
                    </div>
                    {/* Calendar Component */}
                    <div className="w-[100%] lg:w-[45%] flex flex-col gap-10">
                        <h1 className="mr-auto font-bold text-3xl">Course Calendar</h1>
                        <Calendar
                            events={termData?.courses.flatMap((course) =>
                                course.gradingSchemes[0].assessments.map((assessment) => ({
                                    id: uuid(),
                                    start: new Date(assessment.dueDate),
                                    end: addHours(new Date(assessment.dueDate), 0.5),
                                    title: assessment.assessmentName,
                                    color: course.colour, 
                                }))
                            )}>
                            <div className="max-h-[41rem] min-h-[32rem] w-full bg-card rounded-xl py-6 flex flex-col border border-slate-200 shadow-md">
                                <div className="flex px-6 items-center gap-2 mb-6">
                                    <CalendarViewTrigger
                                        view="week"
                                        className="aria-[current=true]:bg-accent"
                                    >
                                        Week
                                    </CalendarViewTrigger>
                                    <CalendarViewTrigger
                                        view="month"
                                        className="aria-[current=true]:bg-accent"
                                    >
                                        Month
                                    </CalendarViewTrigger>

                                    <span className="flex-1" />

                                    <CalendarCurrentDate />

                                    <CalendarPrevTrigger>
                                        <ChevronLeft size={20} />
                                        <span className="sr-only">Previous</span>
                                    </CalendarPrevTrigger>

                                    <CalendarTodayTrigger>Today</CalendarTodayTrigger>

                                    <CalendarNextTrigger>
                                        <ChevronRight size={20} />
                                        <span className="sr-only">Next</span>
                                    </CalendarNextTrigger>
                                </div>

                                <div className="flex-1 px-6 relative overflow-y-auto">
                                    <CalendarWeekView />
                                    <CalendarMonthView />
                                </div>
                            </div>
                        </Calendar>
                    </div>
                </div>
            </div>
            {/* Pop Up When Creating Course */}
            <CreateCoursePopup  isUploading={isUploading} 
                                isCreatingCourse={isCreatingCourse} 
                                setIsCreatingCourse={setIsCreatingCourse} 
                                courseTitle={courseTitle} 
                                setCourseTitle={setCourseTitle} 
                                courseSubtitle={courseSubtitle} 
                                setCourseSubtitle={setCourseSubtitle} 
                                createNewCourse={createNewCourse} 
                                error={error}
                                setError={setError}
                                setUploadedFile={setUploadedFile}/>
        </div>
        );
}
 
export default TermPage;