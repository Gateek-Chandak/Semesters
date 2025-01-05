import { Card } from "../../components/ui/card";
import { format } from 'date-fns';
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { UploadIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from "react-redux";
import { addTerms } from "@/redux/slices/dataSlice";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuid} from 'uuid'
import { addHours } from "date-fns";

import { Term, Course } from "@/types/mainTypes";

import DisplayTermCard from "@/components/DashboardPageCards/DisplayTermCard";
import UploadTranscriptPopup from "@/components/DashboardPageCards/UploadTranscriptPopup";
import { CircularProgress } from "@/components/DashboardPageCards/CircularProgessBar";

const Dashboard = () => {
    const data = useSelector((state: RootState) => state.data.data);
    const userName = useSelector((state: RootState) => state.auth.user ? state.auth.user.name : '')

    const { toast } = useToast()
    const dispatch = useDispatch()

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'EEEE, MMMM dd');

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const [isShowingAverage, setIsShowingAverage] = useState<boolean>(true)

    const [isShowingGrades, setIsShowingGrades] = useState<boolean>(false)

    const totalGrades = data.reduce((overallTotal: number, term) => {
        if (term.courses.length <= 0) {
            return overallTotal + 0
        }
        const termTotal = term.courses.reduce((termSum: number, course) => {
          return termSum + course.highestGrade;
        }, 0);
        return overallTotal + (termTotal / term.courses.length);
    }, 0);
    const cGPA = totalGrades / data.length

    const termData = data.find((t) => t.term === data[data.length-1].term);
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
              start:  assessment.dueDate ? new Date(assessment.dueDate) : null,
              end: assessment.dueDate ? addHours(new Date(assessment.dueDate), 1) : null,
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
        return false;
    });
    const numOfEventsInNext7Days = eventsNext7Days? eventsNext7Days.length : 0

    const CurrentTermData = data[data.length-1]
    const CurrentTermTotalMarks = CurrentTermData?.courses.reduce((total: number, course: Course) => {
    return total + course.highestGrade;
    }, 0)
    let CurrentTermGPA = null
    if (CurrentTermTotalMarks && CurrentTermData.courses.length >= 1) {
        CurrentTermGPA = CurrentTermTotalMarks / CurrentTermData.courses.length
    } else {
        CurrentTermGPA = 0
    }

    const LastTermData = data[data.length-2]
    const LastTermTotalMarks = LastTermData?.courses.reduce((total: number, course: Course) => {
        return total + course.highestGrade;
    }, 0)
    let LastTermGPA = null
    if (LastTermTotalMarks && LastTermData.courses.length >= 1) {
        LastTermGPA = LastTermTotalMarks / LastTermData.courses.length
    } else {
        LastTermGPA = 0
    }

    useEffect(() => {
        if (isUploading || isActive) {
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
    }, [isUploading, isActive]);

    const addTermsToData = (terms: Term[]) => {
        if (terms) {
            dispatch(addTerms({terms}))
        }
    }

    const uploadTranscript = async () => {
        if (uploadedFile) {

            setIsActive(false)
            setIsUploading(true)

            const formData = new FormData();
            formData.append("pdf", uploadedFile);
    
            try {
                const response = await axios.post(`${import.meta.env.VITE_SITE_URL}/api/transcript/upload-transcript/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                });
    
                const data = await response.data.result
                
                addTermsToData(data)

                setIsUploading(false)
                setIsActive(false)
                setUploadedFile(null)
                return;
            } catch (error: unknown) {
                setIsUploading(false);
                setIsActive(true);
    
                // Type-check if error is an AxiosError
                if (error instanceof AxiosError) {
                    if (error.response?.data?.error === "no transcript found") {
                        toast({
                            variant: "destructive",
                            title: "Transcript Upload Unsuccessful",
                            description: "Your file is not a transcript",
                        });
                    } else {
                        setError(error.response?.data?.error || 'Unknown error');
                    }
                } else {
                    // Handle non-AxiosError
                    setError('An unknown error occurred');
                }
    
                console.log(error);
            }
        } else {
            setError('Please upload a transcript')
        }
    }

    return ( 
        <div className="min-h-dvh w-full bg-[#f7f7f7] flex flex-row justify-center">
            <div className="max-w-[1440px] w-full flex flex-col gap-10 px-10 ">
                <div className="flex pt-10 flex-row gap-10">
                    <h1 className="text-[1.6rem] font-medium">Welcome, {userName.split(' ')[0]} {userName.split(' ')[1].slice(0, 1)}.</h1>
                    <h1 className="text-[1.3rem] ml-auto font-light">Today is {formattedDate}</h1>
                </div>
                <div className="w-[100%] mt-2 flex flex-col lg:flex-row gap-10 h-fit lg:h-[25rem]">
                    <div className="lg:w-[55%] flex flex-col gap-10 h-[100%]">
                        {data.length <= 0 &&
                            <Card className="p-5 px-7 h-full border">
                                <div className="h-full flex flex-col justify-between ">
                                    <h1>Current Term</h1>
                                    <div>
                                        <h1 className="text-4xl font-medium">No term to display</h1>
                                        <p className="pt-3 text-sm">upload a transcript to import terms</p>
                                    </div>
                                    <Separator />
                                    <h1 className="text-sm text-muted-foreground flex flex-row items-center ml-auto">click for a more detailed view&nbsp;&nbsp; <ChevronRight className="!w-4 !h-4 text-muted-foreground" /></h1>
                                </div>
                            </Card>
                        }
                        {data.length > 0 &&
                            <Card className="p-5 px-7 h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm hover:border-slate-400 border">
                                <Link to={`/home/${data[data.length-1].term.replace(' ', '-')}`} className="h-full flex flex-col justify-between ">
                                    <h1>Current Term</h1>
                                    <div className="w-full flex flex-row justify-between">
                                        <h1 className="text-4xl font-medium">{data[data.length-1].term}</h1>
                                        {isShowingGrades && <h1 className="ml-0 text-4xl font-medium">{CurrentTermGPA}%</h1>}
                                    </div>
                                    <Separator />
                                    <h1 className="text-sm text-muted-foreground flex flex-row items-center ml-auto">click for a more detailed view&nbsp;&nbsp; <ChevronRight className="!w-4 !h-4 text-muted-foreground" /></h1>
                                </Link>
                            </Card>}
                        {data.length > 1 &&
                            <Card className="p-5 px-7 h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-sm hover:border-slate-400 border">
                                <Link to={`/home/${data[data.length-2].term.replace(' ', '-')}`} className="h-full flex flex-col justify-between ">
                                    <h1>Last Term</h1>
                                    <div className="w-full flex flex-row justify-between">
                                        <h1 className="text-4xl font-medium">{data[data.length-2].term}</h1>
                                        {isShowingGrades && <h1 className="ml-0 text-4xl font-medium">{LastTermGPA}%</h1>}
                                    </div>
                                    <Separator />
                                    <h1 className="text-sm text-muted-foreground flex flex-row items-center ml-auto">click for a more detailed view&nbsp;&nbsp; <ChevronRight className="!w-4 !h-4 text-muted-foreground" /></h1>
                                </Link>
                            </Card>}
                    </div>
                    <div className="lg:w-[45%] flex flex-col gap-6 h-[100%]">
                        <Card className="px-8 py-8 lg:py-0 h-full flex flex-row justify-center lg:justify-between items-center gap-10">
                            <h1 className="text-6xl font-semibold">{numOfEventsInNext7Days}</h1>
                            <p className="font-light text-md"><span className="font-bold">deliverables due this week.</span> Good luck! You may or may not be cooked...</p>
                        </Card>
                        <Card className="px-4 py-4 lg:pb-4 lg:pt-0 h-full flex flex-col">
                            <div className="flex flex-row justify-center items-center gap-4">
                                <CircularProgress percentage={cGPA} label="" description="" setIsShowingAverage={setIsShowingAverage} isShowingAverage={isShowingAverage} />
                                <div className="flex flex-col justify-center h-full py-4 px-10 text-center gap-10 text-md">
                                    <h1 className="font-medium text-xl text-center">Cumulative GPA</h1>
                                    <p className="text-md ">Upload your transcript to fill out your academic history</p>
                                    <p className="text-xs text-muted-foreground text-center">* this may include incomplete term(s) with no course data</p>
                                </div>
                            </div>

                        </Card>
                    </div>
                </div>
                <Separator />
                <div className="h-96 flex flex-row w-full gap-10">
                    <div className="w-full flex flex-col gap-8"> 
                        <div className="flex flex-col gap-7 sm:gap-0 sm:flex-row w-ful pr-12">
                            <h1 className="sm:mr-auto text-xl font-light">Term Archive</h1>
                            <div className="sm:ml-auto flex flex-row gap-4">
                                {!isShowingGrades && <Button variant={'default'} onClick={() => setIsShowingGrades(!isShowingGrades)}>
                                    <div className="text-white text-sm font-medium flex flex-row justify-between items-center w-full gap-4">
                                        <h1>Show Grades</h1>
                                        <EyeIcon />
                                    </div>
                                </Button>}
                                {isShowingGrades && <Button variant={'default'} onClick={() => setIsShowingGrades(!isShowingGrades)}>
                                    <div className="text-white text-sm font-medium flex flex-row justify-between items-center w-full gap-4">
                                        <h1>Hide Grades</h1>
                                        <EyeOffIcon />
                                    </div>
                                </Button>}
                                <Button variant={'outline'} onClick={() => setIsActive(!isActive)}>
                                    <div className="text-black text-sm font-medium flex flex-row justify-between w-full gap-4">
                                        <h1>Upload Transcript</h1>
                                        <UploadIcon />
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-row justify-start gap-10">
                            {data.slice(0).reverse().slice(2).map((term) => (
                                <DisplayTermCard key={term.term} term={term} isShowingGrades={isShowingGrades} />
                            ))}
                            {data.length <= 2 &&
                                <h1>No past terms to display.</h1>
                            }
                        </div>

                    </div>
                </div>
            </div>   
            <UploadTranscriptPopup isUploading={isUploading}
                                    isActive={isActive}
                                    setIsActive={setIsActive}
                                    uploadTranscript={uploadTranscript}
                                    error={error}
                                    setError={setError}
                                    setUploadedFile={setUploadedFile}/>    
        </div>
     );
}
 
export default Dashboard;