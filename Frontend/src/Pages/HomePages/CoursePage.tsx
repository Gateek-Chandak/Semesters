import {  useState, useEffect } from 'react';
import { addHours } from 'date-fns';
import { v4 as uuid } from 'uuid'

import {
    Calendar,
    CalendarCurrentDate,
    CalendarMonthView,
    CalendarNextTrigger,
    CalendarPrevTrigger,
    CalendarTodayTrigger,
    CalendarViewTrigger,
    CalendarWeekView,
} from '../../components/CalendarTest'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselItem,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { CircularProgress } from "@/components/CircularProgessBar";

type IncomingAssessments = {
    assessmentName: string,
    weight: number,
    dueDate: string
}

type IncomingScheme = {
    schemeName: string,
    assessments: IncomingAssessments[]
}

type IncomingCourseInfo = {
    gradingSchemes: IncomingScheme[]
}

export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: 'green' | 'default' | 'blue' | 'pink' | 'purple' | undefined;
};

type Assessment = {
    assessmentName: string,
    dueDate: string,
    weight: number,
    grade: null | number
}

type GradingScheme = {
    schemeName: string,
    course: string,
    grade: number,
    assessments: Assessment[]
}

const CoursePage = () => {

    const CourseInfo: IncomingCourseInfo = {
        "gradingSchemes": [
            {
                "schemeName": "Grading Scheme 1",
                "assessments": [
                    {
                        "assessmentName": "Assignment 1",
                        "weight": 2.86,
                        "dueDate": "2024-09-17"
                    },
                    {
                        "assessmentName": "Assignment 2",
                        "weight": 2.86,
                        "dueDate": "2024-09-24"
                    },
                    {
                        "assessmentName": "Assignment 3",
                        "weight": 2.86,
                        "dueDate": "2024-10-01"
                    },
                    {
                        "assessmentName": "Assignment 4",
                        "weight": 2.86,
                        "dueDate": "2024-10-11"
                    },
                    {
                        "assessmentName": "Assignment 5",
                        "weight": 2.86,
                        "dueDate": "2024-10-29"
                    },
                    {
                        "assessmentName": "Assignment 6",
                        "weight": 2.86,
                        "dueDate": "2024-11-12"
                    },
                    {
                        "assessmentName": "Assignment 7",
                        "weight": 2.86,
                        "dueDate": "2024-11-19"
                    },
                    {
                        "assessmentName": "Assignment 8",
                        "weight": 2.86,
                        "dueDate": "2024-11-26"
                    },
                    {
                        "assessmentName": "Assignment 9",
                        "weight": 2.86,
                        "dueDate": "2024-12-03"
                    },
                    {
                        "assessmentName": "Midterm Exam",
                        "weight": 30,
                        "dueDate": "2024-11-05"
                    },
                    {
                        "assessmentName": "Final Exam",
                        "weight": 50,
                        "dueDate": null
                    }
                ]
            },
            {
                "schemeName": "Grading Scheme 2",
                "assessments": [
                    {
                        "assessmentName": "Assignment 1",
                        "weight": 2.86,
                        "dueDate": "2024-09-17"
                    },
                    {
                        "assessmentName": "Assignment 2",
                        "weight": 2.86,
                        "dueDate": "2024-09-24"
                    },
                    {
                        "assessmentName": "Assignment 3",
                        "weight": 2.86,
                        "dueDate": "2024-10-01"
                    },
                    {
                        "assessmentName": "Assignment 4",
                        "weight": 2.86,
                        "dueDate": "2024-10-11"
                    },
                    {
                        "assessmentName": "Assignment 5",
                        "weight": 2.86,
                        "dueDate": "2024-10-29"
                    },
                    {
                        "assessmentName": "Assignment 6",
                        "weight": 2.86,
                        "dueDate": "2024-11-12"
                    },
                    {
                        "assessmentName": "Assignment 7",
                        "weight": 2.86,
                        "dueDate": "2024-11-19"
                    },
                    {
                        "assessmentName": "Assignment 8",
                        "weight": 2.86,
                        "dueDate": "2024-11-26"
                    },
                    {
                        "assessmentName": "Assignment 9",
                        "weight": 2.86,
                        "dueDate": "2024-12-03"
                    },
                    {
                        "assessmentName": "Final Exam",
                        "weight": 80,
                        "dueDate": null
                    }
                ]
            }
        ]
    }

    const title = "CFM 101"
    const subtitle = "Introduction to Financial Data Analytics"
    const percentage = 56

    const [gradingSchemes, setGradingSchemes] = useState<GradingScheme[]>([])
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])

    const [highestCourseGrade, setHighestCourseGrade] = useState<number>(0)

    const formatGradingScheme = (courseInfo: IncomingCourseInfo) => {
        return courseInfo.gradingSchemes.map((scheme) => ({
            schemeName: scheme.schemeName,
            course: title,
            grade: 0,
            assessments: scheme.assessments.map((assessment) => ({
                assessmentName: assessment.assessmentName,
                dueDate: assessment.dueDate,
                weight: assessment.weight,
                grade: null,
            })),
        }));
    };
    
    const formatCalendarEvents = (courseInfo: IncomingCourseInfo) => {
        return courseInfo.gradingSchemes[0].assessments
            .filter((assessment) => assessment.dueDate) // Filter out assessments with no dueDate
            .map((assessment) => ({
                id: uuid(),
                start: new Date(assessment.dueDate),
                end: addHours(new Date(assessment.dueDate), 0.5), // Add 2 hours to create the end time
                title: assessment.assessmentName,
                color: 'green', // Assign a default color or make dynamic
                course: title
            }));
    };

    const updateGrade = (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => {
        const inputValue = e.target.value.trim();
    
        // Parse input as a number or default to 0 if empty
        const parsedValue = inputValue === "" ? 0 : parseFloat(inputValue);
    
        // Exit early if input is invalid or out of range
        if (isNaN(parsedValue) || parsedValue > 100 || parsedValue < 0) {
            return;
        }
    
        // Update gradingSchemes for all schemes
        const updatedSchemes = gradingSchemes.map((scheme) => {
            // Update assessments for the current scheme
            const updatedAssessments = scheme.assessments.map((assessment) =>
                assessment.assessmentName === assessmentName
                    ? { ...assessment, grade: parsedValue } // Update grade for the matching assignment
                    : assessment
            );
    
            // Calculate the total grade based only on completed assessments
            const completedAssessments = updatedAssessments.filter(
                (assessment) => assessment.grade !== undefined && assessment.grade !== null
            );
            // Recalculate the total grade for the scheme excluding uncompleted assessments like the final
            const updatedGrade = completedAssessments.reduce((total, assessment) => {
                if (assessment.grade) {
                    return total + (assessment.grade * assessment.weight) / 100;
                }
                                    
                return total + 0
            }, 0);
    
            // Calculate the total weight of completed assessments
            const totalWeight = completedAssessments.reduce((total, assessment) => {
                return total + assessment.weight;
            }, 0);
    
            // Ensure the total weight is used for scaling the grade (only completed assessments should count)
            const finalGrade = totalWeight > 0 ? (updatedGrade / totalWeight) * 100 : 0;
    
            return {
                ...scheme,
                assessments: updatedAssessments,
                grade: parseFloat(finalGrade.toFixed(2)), // Update the scheme's total grade
            };
        });
    
        // Dynamically update the gradingSchemes state to trigger re-render
        setGradingSchemes([...updatedSchemes]);
    };
    
    // In your useEffect to set the initial grading schemes
    useEffect(() => {
        const formattedGradingSchemes = formatGradingScheme(CourseInfo);
        const formattedCalendarEvents = formatCalendarEvents(CourseInfo);
    
        setGradingSchemes(formattedGradingSchemes); // Initial set of grading schemes
        setCalendarEvents(formattedCalendarEvents);
    }, []);
    
    // For highest course grade
    useEffect(() => {
        const highestGrade = gradingSchemes.reduce((max: number, scheme) => {
            return Math.max(max, scheme.grade);
        }, 0);
        
        setHighestCourseGrade(highestGrade);

    }, [gradingSchemes, highestCourseGrade]);
    


    // const getData = async () => {
    //     try {
    //         const response = await axios.get("http://localhost:4000/api/calendar/create-calendar", {
    //             withCredentials: true,
    //         })
    //         const data = await response.data
    //         console.log(data)
    //     } catch {
    //         navigate("/")
    //     }
    // }

    return ( 
        <div className="w-full h-dvh min-h-fit px-10 pt-[120px] bg-[#f7f7f7] flex flex-col justify-start items-center overflow-hidden">
            <div className='max-w-[2440px]'>
                <div className="flex flex-row items-center justify-start gap-3 text-3xl">
                    <h1 className="font-bold">{title}</h1>
                    <h1 className="">{subtitle}</h1>
                </div>
                <div className="mt-12 lg:mb-16 w-full h-fit grid grid-cols-1 grid-rows-3 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-1 gap-10 justify-between">
                    <Card className="w-[100%] col-span-1 md:col-span-2 lg:col-span-1">
                        <CircularProgress 
                            percentage={highestCourseGrade} 
                            label="Overall Average"
                            description="You still have 5 deliverables left, which account for 80% of your total grade."
                        />
                    </Card>
                    <Card className="w-[100%]">

                    </Card>
                    <Card className="w-[100%] p-6 flex flex-col justify-center gap-10">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row">
                                <h1 className="mr-auto text-xl font-medium">Minimum</h1>
                                <h1 className="ml-auto text-xl font-medium">{percentage}%</h1>
                            </div>
                            <p className="text-md font-light">Assuming that you uninstall LEARN and doom scroll for the rest of the term.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row">
                                <h1 className="mr-auto text-xl font-medium">Maximum</h1>
                                <h1 className="ml-auto text-xl font-medium">{percentage+30}%</h1>
                            </div>
                            <p className="text-md font-light">Given that you score 100% on everything remaining.</p>
                        </div>
                    </Card>
                </div>

                <div className="h-fit w-full mt-8 mb-10 flex flex-col justify-center lg:flex-row gap-14 lg:gap-16">
                    <div className="w-[100%] lg:w-[55%] flex flex-col items-center justify-start gap-8 rounded-2xl">
                        <h1 className="mr-auto font-bold text-3xl">Deliverables</h1>
                        <Carousel className="w-full shadow-md border border-slate-200 rounded-2xl">
                            <CarouselContent className=''>
                                {(gradingSchemes.length > 0) && gradingSchemes.map((scheme, index) => (
                                        <CarouselItem className="pt-3 rounded-2xl bg-card text-card-foreground" key={index}>
                                            <h1 className="mr-auto py-5 px-14 text-lg font-medium">{scheme.schemeName}</h1>
                                            <div className='flex flex-row justify-end -top-14 pr-6 relative'>
                                                <Button className='ml-auto '>+ Add Deliverable</Button>
                                            </div>
                                            <div className="w-full h-[33.5rem] overflow-y-auto" >
                                                <Table className="my-4">
                                                    <TableHeader>
                                                        <TableRow>  
                                                            <TableHead className="text-center">Name</TableHead>
                                                            <TableHead className="text-center">Due Date</TableHead>
                                                            <TableHead className="text-center">Weight</TableHead>
                                                            <TableHead className="text-center">Grade</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className=''>
                                                        {scheme.assessments.map((assessment) => {
                                                            return (
                                                                    <TableRow key={assessment.assessmentName} className="">
                                                                        <TableCell className="text-center">{assessment.assessmentName}</TableCell>
                                                                        <TableCell className="text-center">{assessment.dueDate ? assessment.dueDate : 'TBD'}</TableCell>
                                                                        <TableCell className="text-center">{assessment.weight}</TableCell>
                                                                        <TableCell className="text-center"> 
                                                                        <Input
                                                                            type="number"
                                                                            value={assessment.grade || ""}
                                                                            onChange={(e) => updateGrade(e, assessment.assessmentName)}
                                                                            placeholder="00"
                                                                            className="w-16 p-2 my-3 inline"
                                                                            />{" "}
                                                                            %
                                                                        </TableCell>
                                                                    </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </CarouselItem>
                                ))}
                            </CarouselContent>
                            {(gradingSchemes.length > 1) && <CarouselPrevious />}
                            {(gradingSchemes.length > 1) &&<CarouselNext /> }
                        </Carousel>
                    </div>
                    <div className="w-[100%] lg:w-[45%] flex flex-col items-center justify-start overflow-auto gap-8">
                        <h1 className="mr-auto font-bold text-3xl">Course Calendar</h1>
                        <Calendar
                            events={calendarEvents}
                            >
                            <div className="h-[41rem] w-full bg-card rounded-xl border border-slate-200 shadow-md py-6 flex flex-col">
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
            
        </div>
     );
}
 
export default CoursePage;
