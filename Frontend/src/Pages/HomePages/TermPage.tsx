import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@/components/termPageCards/CircularProgessBar";
import { v4 as uuid } from 'uuid';
import { addHours } from "date-fns";
import { useState, useEffect } from "react";
import { EyeOffIcon, EyeIcon, PencilIcon, ChevronRight, ChevronLeft, Check } from "lucide-react";
import axios from "axios";
import { AxiosError } from "axios";

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { addCourse } from "@/redux/slices/dataSlice";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import EditCompletedCourseCard from "@/components/termPageCards/EditCompletedCourseCard";
import CreateCoursePopup from "@/components/termPageCards/CreateCoursePopup";
import CreateCompletedCoursePopup from "@/components/termPageCards/CreateCompletedCoursePopup";
import DisplayCourseCard from "@/components/termPageCards/DisplayCourseCard";
import EventsInProximity from "@/components/termPageCards/EventsInProximity";
import ExportGoogleCalPopup from "@/components/coursePageCards/ExportGoogleCalPopup";
import CompletedTermCourseCard from "@/components/termPageCards/CompletedTermCourseCard";

const TermPage = () => {
    const data = useSelector((state: RootState) => state.data.data);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { toast } = useToast();
    const { term: originalTerm } = useParams();

    // State variables
    const [termGrade, setTermGrade] = useState<number>(0);
    const [gradesShown, setGradesShown] = useState<boolean>(false);
    const [isCreatingCourse, setIsCreatingCourse] = useState<boolean>(false);
    const [isCreatingCompletedCourse, setIsCreatingCompletedCourse] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const [courseCode, setCourseCode] = useState<string>("");
    const [courseNumber, setCourseNumber] = useState<string>("");
    const [courseSubtitle, setCourseSubtitle] = useState<string>("");
    const [completedCourseGrade, setCompletedCourseGrade] = useState<number>(0)
    const [error, setError] = useState<string>("");
    const [isManagingCourses, setIsManagingCourses] = useState<boolean>(false)
    const [isShowingAverage, setIsShowingAverage] = useState<boolean>(true)
    const [selectedColour, setSelectedColour] = useState<'green' | 'black' | 'blue' | 'pink' | 'purple' | 'orange' | 'red' >('black'); 

    // Term processing logic
    let term = originalTerm;
    if (term) {
        term = term.replace('-', ' ') 
    }

    const termData = data.find((t) => t.term === term);
    const calendarEvents = termData?.courses.flatMap((course) => {
        // Use a Set to track unique assessment names for the course
        const uniqueAssessments = new Set();
      
        return course.gradingSchemes.flatMap((scheme) =>
          scheme.assessments
            .filter((assessment) => {
              // Check if the assessment name is already added for this course
              if (uniqueAssessments.has(assessment.assessmentName)) {
                return false; // Skip duplicates
              }
              uniqueAssessments.add(assessment.assessmentName); // Mark as added
              return true;
            })
            .map((assessment) => ({
              id: uuid(),
              //@ts-expect-error idk
              start: new Date(assessment.dueDate),
              //@ts-expect-error idk
              end: addHours(new Date(assessment.dueDate), 1),
              title: assessment.assessmentName,
              course: course.courseTitle,
              color: course.colour,
            }))
        );
    });

    const now = new Date();
    const proximityDaysFromNow = new Date();
    proximityDaysFromNow.setDate(now.getDate() + 7);

    const eventsNext7Days = calendarEvents?.filter(event => {
        if (event.start) {
            const eventDate = new Date(event.start);
            return eventDate >= now && eventDate <= proximityDaysFromNow;
        }
       return false
    });
    const numOfEventsInNext7Days = eventsNext7Days? eventsNext7Days.length : 0

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

    useEffect(() => {
        if (isCreatingCompletedCourse || isCreatingCourse) {
          // Disable scrolling
          document.body.style.overflow = "hidden";
        } else {
          // Re-enable scrolling
          document.body.style.overflow = "";
        }
    
        // Cleanup on unmount
        return () => {
          document.body.style.overflow = "";
        };
    }, [isCreatingCourse, isCreatingCompletedCourse]);

    const formatNewGradingScheme = (courseInfo: IncomingCourseInfo) => {
        return courseInfo.gradingSchemes.map((scheme) => ({
            schemeName: scheme.schemeName,
            grade: 0,
            assessments: scheme.assessments.map((assessment) => ({
                assessmentName: assessment.assessmentName,
                dueDate: assessment.dueDate ? new Date(assessment.dueDate).toISOString() : null,
                weight: assessment.weight,
                grade: null,
            })),
        }));
    };

    // Create a new course
    const createNewCourse = async (): Promise<void> => {
        if (!courseCode || courseCode.trim() === "") {
            setError('Course code is required');
            setIsUploading(false);
            setIsCreatingCourse(true)
            return;
        }

        if (!courseNumber || courseNumber.trim() === "") {
            setError('Course number is required');
            setIsUploading(false);
            setIsCreatingCourse(true)
            return;
        }

        if (!courseSubtitle || courseSubtitle.trim() === "") {
            setError('Course name is required');
            setIsUploading(false);
            setIsCreatingCourse(true)
            return;
        }

        const courseParam =  courseCode + '-' + courseNumber

        if (!uploadedFile && term) {
            const newCourse = {
                courseTitle: courseCode + ' ' + courseNumber,
                courseSubtitle: courseSubtitle,
                colour: selectedColour,
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
        if (uploadedFile) {
            formData.append("pdf", uploadedFile);
        }


        try {
            const response = await axios.post(`${import.meta.env.VITE_SITE_URL}/api/pdf/upload-schedule/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        
            const data = await response.data;
            const json = await JSON.parse(data);
        
            const gradingSchemes = formatNewGradingScheme(json);
        
            const newCourse = {
                courseTitle: courseCode + ' ' + courseNumber,
                courseSubtitle: courseSubtitle,
                colour: selectedColour,
                highestGrade: 0,
                gradingSchemes: gradingSchemes
            };
        
            dispatch(addCourse({ term: term ? term : "", course: newCourse }));
            setIsUploading(false);
            navigate(`/home/${originalTerm}/${courseParam}`);
            return;
        
        } catch (error: unknown) {
            setIsUploading(false);
            setIsCreatingCourse(true);
        
            // Type narrowing for the error
            if (error instanceof AxiosError) {
                if (error.response?.data?.error === "no assessment schedule found") {
                    toast({
                        variant: "destructive",
                        title: "File Upload Unsuccessful",
                        description: "Your file is not a syllabus",
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "File Upload Error",
                        description: "There was an error uploading your file. Please try again.",
                    });
                }
            } else {
                // Handle unexpected errors
                toast({
                    variant: "destructive",
                    title: "Unknown Error",
                    description: "An unknown error occurred.",
                });
            }
        
            console.log(error);
        }
    };

    const createNewCompletedCourse = async (): Promise<void> => {
        if (!courseCode || courseCode.trim() === "") {
            setError('Course code is required');
            setIsUploading(false);
            setIsCreatingCompletedCourse(true)
            return;
        }

        if (!courseNumber || courseNumber.trim() === "") {
            setError('Course number is required');
            setIsUploading(false);
            setIsCreatingCompletedCourse(true)
            return;
        }

        if (term) {
            const newCourse = {
                courseTitle: courseCode + ' ' + courseNumber,
                courseSubtitle: courseSubtitle,
                colour: 'black' as 'green' | 'black' | 'blue' | 'pink' | 'purple' | 'orange' | 'red' ,
                highestGrade: completedCourseGrade,
                gradingSchemes: []
            }

            const repeatedCourseTitle = termData?.courses.find((c) => c.courseTitle.toLowerCase() === newCourse.courseTitle.toLowerCase())
            if (repeatedCourseTitle) {
                setError('A course with this name has already been created')
                return;
            }

            dispatch(addCourse({ term: term, course: newCourse }));
            setCourseCode("")
            setCourseNumber("")
            setCompletedCourseGrade(0)
            setError("")
        }

        setIsCreatingCompletedCourse(false);
    };


    return ( 
        <div className="w-full h-dvh min-h-fit px-10 pt-10 bg-[#f7f7f7] flex flex-col gap-11 justify-start items-center overflow-hidden">
            {!termData?.isCompleted && 
                <div className="max-w-[1840px] w-full flex flex-col gap-10">
                    <div className="w-[100%] lg:h-[25rem] flex flex-col gap-10 lg:flex-row">
                        <div className="w-[100%] lg:w-[60%] flex flex-col gap-10">
                            <div className="flex flex-row items-center justify-start gap-4">
                                <h1 className="text-3xl font-bold">{term}</h1>
                            </div>
                            <div className="w-[100%] h-full flex flex-col items-center md:flex-row gap-10">
                                <Card className="w-[100%] md:w-[35%] h-full px-6">
                                    <CircularProgress 
                                        percentage={termGrade} 
                                        label="Term Average"
                                        description=""
                                        isShowingAverage={isShowingAverage}
                                        setIsShowingAverage={setIsShowingAverage}
                                    />
                                </Card>
                                <div className="md:w-[65%] w-[100%] h-full flex flex-col items-center gap-6">
                                    <Card className="w-[100%] h-full py-16 md:py-0 px-10 flex flex-row gap-10 justify-center items-center ">
                                        <h1 className="text-5xl font-semibold">{numOfEventsInNext7Days}</h1>
                                        <p className="font-light text-sm"><span className="font-bold">deliverables due this week.</span> Good luck! You may or may not be cooked...</p>
                                    </Card>
                                    <Card className="w-[100%] h-full py-16 md:py-0 px-10 flex flex-row gap-10 justify-center items-center ">
                                        
                                    </Card>
                                </div>
                                
                            </div>
                        </div>
                        <div className="w-[100%] lg:w-[40%] flex flex-col gap-10">
                            <h1 className="w-[100%] text-2xl font-light">
                                Upcoming Deliverables
                            </h1>
                            <div className="h-[100%] min-h-[15rem] w-[100%]"> 
                                {calendarEvents && <EventsInProximity calendarEvents={calendarEvents} proximityInDays={7} />}
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="w-[100%] flex flex-col gap-10 lg:flex-row h-fit">
                        <div className="h-[100%] w-[100%] lg:w-[55%] flex flex-col gap-10">
                            <div className="flex flex-col gap-7 sm:gap-0 sm:flex-row w-ful pr-12">
                                <h1 className="sm:mr-auto text-2xl font-light">Current Courses</h1>
                                <div className="sm:ml-auto flex flex-row gap-4">
                                    {!isManagingCourses && <Button className='border-2 border-black bg-white text-black hover:bg-gray-100 !text-xs' onClick={() => setIsManagingCourses(!isManagingCourses)}>Manage Courses <PencilIcon/></Button>}
                                    {isManagingCourses && <Button className='border-2 border-black bg-white text-black hover:bg-gray-100 !text-xs' onClick={() => setIsManagingCourses(!isManagingCourses)}>Save Changes <Check/></Button>}
                                    {!isManagingCourses && !gradesShown && <Button className='!text-xs' onClick={() => setGradesShown(!gradesShown)}>Show Grades <EyeIcon /></Button>}
                                    {!isManagingCourses && gradesShown && <Button className='!text-xs' onClick={() => setGradesShown(!gradesShown)}>Hide Grades <EyeOffIcon /></Button>}
                                </div>
                            </div>
                            <div className="flex flex-row flex-wrap gap-10">
                                {!isManagingCourses && termData && termData.courses.map((course) => { return ( <DisplayCourseCard key={course.courseTitle} course={course} gradesShown={gradesShown}/> ); })}
                                {isManagingCourses && termData && termData.courses.map((course) => { return ( <EditCourseCard key={course.courseTitle} course={course} /> ); })}
                                <div onClick={() => setIsCreatingCourse(!isCreatingCourse)} 
                                    className={`${isManagingCourses ? 'h-40 w-40' : 'h-32 w-32'} flex flex-col justify-center items-center border-2 border-slate-200 bg-card rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-md`}
                                    role="button" 
                                    tabIndex={0}>
                                    <h1 className="text-7xl font-extralight">+</h1>
                                </div>
                            </div>
                        </div>
                        {/* Calendar Component */}
                        <div className="w-[100%] lg:w-[45%] flex flex-col gap-10">
                            <h1 className="mr-auto text-2xl font-light">Term Calendar</h1>
                            <Calendar
                                events={calendarEvents}>
                                <div className="max-h-[41rem] min-h-[35rem] w-full bg-card rounded-xl pt-6 flex flex-col border border-slate-200 shadow-md">
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
                                    <div className="w-full py-3 px-6">
                                        <Button variant={'outline'} className="border border-blue-500 text-blue-500 hover:text-blue-600" onClick={() => setIsExporting(!isExporting)}>
                                            Export to Google Calendar
                                        </Button>
                                    </div>  
                                </div>
                            </Calendar>
                        </div>
                    </div>
                </div>}
            {termData?.isCompleted && 
                <div className="max-w-[1840px] w-full flex flex-col gap-10">
                    <div className="w-[100%] lg:h-[25rem] flex flex-col gap-10">
                        <div className="w-full flex flex-row items-center justify-start gap-4">
                            <h1 className="text-3xl font-bold">{term}</h1>
                        </div>
                        <div className="flex flex-col lg:flex-row  justify-start gap-10">
                            <Card className="h-full px-6">
                                <CircularProgress 
                                    percentage={termGrade} 
                                    label="Term Average"
                                    description=""
                                    isShowingAverage={isShowingAverage}
                                    setIsShowingAverage={setIsShowingAverage}
                                />
                            </Card>

                            <div className="flex flex-col lg:flex-row lg:flex-wrap gap-10 justify-start">
                                <div className="w-full items-center lg:w-40 h-40 text-xs text-muted-foreground flex flex-col justify-between">
                                    <p className="text-lg lg:text-xs">This term is complete. You may view your grades.</p>
                                    {!isManagingCourses && <Button className='border-2 border-black bg-white text-black hover:bg-gray-100 !text-xs w-[80%] lg:w-[100%]' onClick={() => setIsManagingCourses(!isManagingCourses)}>Manage Courses <PencilIcon/></Button>}
                                    {isManagingCourses && <Button className='border-2 border-black bg-white text-black hover:bg-gray-100 !text-xs w-[80%] lg:w-[100%]' onClick={() => setIsManagingCourses(!isManagingCourses)}>Save Changes <Check/></Button>}
                                    {!isManagingCourses && !gradesShown && <Button className='!text-xs lg:!w-40 w-[80%]' onClick={() => setGradesShown(!gradesShown)}>Show Grades <EyeIcon /></Button>}
                                    {!isManagingCourses && gradesShown && <Button className='!text-xs lg:!w-40 w-[80%]' onClick={() => setGradesShown(!gradesShown)}>Hide Grades <EyeOffIcon /></Button>}
                                </div>
                                {!isManagingCourses && termData && termData.courses.map((course) => { return ( <CompletedTermCourseCard key={course.courseTitle} course={course} gradesShown={gradesShown}/> ); })}
                                {isManagingCourses && termData && termData.courses.map((course) => { return ( <EditCompletedCourseCard key={course.courseTitle} course={course} /> ); })}
                                <div onClick={() => setIsCreatingCompletedCourse(!isCreatingCompletedCourse)} 
                                    className={`h-40 w-40 flex flex-col justify-center items-center border-2 border-slate-200 bg-card rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-md`}
                                    role="button" 
                                    tabIndex={0}>
                                    <h1 className="text-7xl font-extralight">+</h1>
                                </div>      
                            </div>
                        </div>
                    </div>         
                </div>
            }
            {/* Pop Up When Creating Course */}
            <CreateCoursePopup  isUploading={isUploading} 
                                isCreatingCourse={isCreatingCourse} 
                                setIsCreatingCourse={setIsCreatingCourse} 
                                courseCode={courseCode} 
                                setCourseCode={setCourseCode} 
                                courseNumber={courseNumber}
                                setCourseNumber={setCourseNumber}
                                courseSubtitle={courseSubtitle} 
                                setCourseSubtitle={setCourseSubtitle} 
                                createNewCourse={createNewCourse} 
                                error={error}
                                setError={setError}
                                setUploadedFile={setUploadedFile}
                                selectedColour={selectedColour}
                                setSelectedColour={setSelectedColour}/>
            <CreateCompletedCoursePopup isUploading={isUploading} 
                                        isCreatingCourse={isCreatingCompletedCourse} 
                                        setIsCreatingCourse={setIsCreatingCompletedCourse} 
                                        courseCode={courseCode} 
                                        setCourseCode={setCourseCode} 
                                        courseNumber={courseNumber}
                                        setCourseNumber={setCourseNumber}
                                        createNewCourse={createNewCompletedCourse} 
                                        error={error}
                                        setError={setError}
                                        courseGrade={completedCourseGrade}
                                        setCourseGrade={setCompletedCourseGrade}/>
            {calendarEvents && <ExportGoogleCalPopup isExporting={isExporting}
                                  setIsExporting={setIsExporting}
                                  calendarEvents={calendarEvents}/>}
        </div>
        );
}
 
export default TermPage;