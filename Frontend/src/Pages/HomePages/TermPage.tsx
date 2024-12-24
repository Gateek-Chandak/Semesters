import { useParams } from "react-router-dom";
import { format } from 'date-fns';
import { CircularProgress } from "@/components/CircularProgessBar";
import { v4 as uuid } from 'uuid'
import { addHours } from "date-fns";
import clsx from 'clsx';

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
} from '../../components/Calendar'
import { ChevronRight, ChevronLeft } from "lucide-react";

const TermPage = ( data ) => {

    const currentDate = new Date();
    const formattedDate = format(currentDate, 'EEEE, MMMM dd');

    let { term } = useParams()

    if (term) {
        term = term
            .replace('-', ' ') // Replace '-' with a space
            .toLowerCase()     // Convert the string to lowercase
            .split(' ')        // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(' ');        // Join the words back together
    }

    const termData = data.data.find((t) => t.term === term)
    console.log(termData)

    return ( 
        <div className="h-fit px-10 pt-14 flex flex-col gap-10 bg-[#f7f7f7]">
            <div className="w-[100%] h-fit flex flex-col gap-10 lg:flex-row">
                <div className="w-[60%] flex flex-col gap-10">
                    <div className="flex flex-row mr-auto">
                        <h1 className="text-3xl font-semibold">{term} :&nbsp;</h1>
                        <h1 className="text-3xl"> {formattedDate}</h1>
                    </div>
                    <div className="w-[100%] h-full flex flex-col lg:flex-row gap-10">
                        <Card className="px-10 pb-6 h-full w-[35%] flex flex-col">
                            <CircularProgress percentage={75} label="" description=""  />
                            <div className="flex flex-col gap-2 text-center">
                                <h1 className="text-xl font-semibold">Term Average</h1>
                                <p className="font-light text-md">You have 111 days left, Keep it up!</p>
                            </div>
                        </Card>
                        <div className="w-[65%] flex flex-col gap-10">
                            <Card className="w-[100%] h-[50%] px-10 flex flex-col gap-2 justify-center items-start ">
                                <h1 className="text-4xl font-semibold">Might be cooked</h1>
                                <p className="font-light text-md">You have 7 deliverables due in the next 3 days.</p>
                            </Card>
                            <Card className="w-[100%] h-[50%] px-10 flex flex-col gap-2 justify-center items-start ">
                                <h1 className="text-4xl font-semibold">111 days to go</h1>
                                <p className="font-light text-md">You still have a long way to go. Keep your head down and stick with it. Good luck!.</p>
                            </Card>
                        </div>
                        
                    </div>
                </div>
                <div className="w-[40%] flex flex-col gap-10">
                    <h1 className="w-[100%] text-3xl font-semibold">
                        Next 7 Days...
                    </h1>
                    <div className="h-[100%] w-[100%]"> 
                        <Card className="w-[100%] h-full">

                        </Card>
                    </div>
                </div>
            </div>
            
            <div className="w-[100%] flex flex-row gap-10 lg:flex-row h-fit">
                <div className="h-[100%] w-[55%] flex flex-col gap-10">
                    <div className="flex flex-row w-ful pr-12">
                        <h1 className="mr-auto text-3xl font-semibold">Current Courses</h1>
                        <div className="ml-auto flex flex-row gap-4">
                            <Button className='border-2 border-black bg-white text-black hover:bg-gray-100'>Manage Courses</Button>
                            <Button className=''>Show Grades</Button>
                        </div>
                    </div>
                    <div className="flex flex-row flex-wrap gap-10">
                        {termData.courses.map((course) => {
                            return (
                                <div className={`border-2 border-transparent hover:border-2 hover:border-${course.colour}-500 hover:text-${course.colour}-500 rounded-2xl transform transition-all duration-300 hover:scale-105`}>
                                    <Card
                                    key={uuid()}
                                    className={clsx(
                                        'h-40 w-40 flex flex-col justify-center items-center',
                                        `hover:text-${course.colour}-500`, // dynamically added class
                                        `hover:from-${course.colour}-50`, // dynamically added class
                                        'hover:bg-gradient-to-b hover:via-card hover:to-card hover:bg-opacity-5',
                                        'transform transition-all duration-200'
                                    )}
                                    >
                                    <h1 className="text-3xl">{course.courseTitle.split(' ')[0]}</h1>
                                    <h1 className="text-5xl font-semibold">{course.courseTitle.split(' ')[1]}</h1>
                                    </Card>
                                </div>

                            )
                        })}
                    </div>
                    
                </div>
                <div className="w-[45%] flex flex-col gap-10">
                    <h1 className="mr-auto font-semibold text-3xl">Course Calendar</h1>
                    <Calendar
                        events={termData.courses.flatMap((course) =>
                            course.gradingSchemes[0].assessments.map((assessment) => ({
                            id: uuid(),
                            start: new Date(assessment.dueDate),
                            end: addHours(new Date(assessment.dueDate), 0.5), // Adjust duration
                            title: assessment.assessmentName,
                            color: course.colour, // Use course's color
                            course: course.courseTitle,
                            }))
                        )}
                    >

                        <div className="h-[41rem] w-full bg-card rounded-xl py-6 flex flex-col border border-slate-200 shadow-md">
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
        );
}
 
export default TermPage;