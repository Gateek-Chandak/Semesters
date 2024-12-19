import {  useState } from 'react';

import GradesPage from './Grades';
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
import {
    Card,
  } from "@/components/ui/card"
  import { Calendar } from "@/components/ui/calendar"
  import { CircularProgress } from "@/components/CircularProgessBar";

  

const CoursePage = () => {

    const CourseInfo = {
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

    const [date, setDate] = useState<Date | undefined>(new Date())

    const title = "CFM 101"
    const subtitle = "Introduction to Financial Data Analytics"
    const percentage = 56
    const rowsPerPage = 5;
    const startIndex: number = 0
    const gradingSchemes = [
        {
          name: "Scheme A",
          assessments: [
            { name: "Midterm Exam", due_date: "2024-09-07", weight: 30, grade: 0 },
            { name: "Final Exam", due_date: "2024-09-14", weight: 40, grade: 0 },
            { name: "Homework", due_date: "2024-09-21", weight: 20, grade: 0 },
            { name: "Participation", due_date: "2024-09-28", weight: 10, grade: 0 }
          ]
        },
        {
          name: "Scheme B",
          assessments: [
            { name: "Midterm Exam", due_date: "2024-09-07", weight: 20, grade: 0 },
            { name: "Final Exam", due_date: "2024-09-14", weight: 50, grade: 0 },
            { name: "Homework", due_date: "2024-09-21", weight: 20, grade: 0 },
            { name: "Participation", due_date: "2024-09-28", weight: 10, grade: 0 }
          ]
        }
    ];

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

    // useEffect(() => {

    // }, [])

    return ( 
        <div className="w-full h-fit px-10 pt-[120px] bg-[#f7f7f7] flex flex-col justify-start overflow-hidden">
            <div className="flex flex-row items-center justify-start gap-3 text-3xl">
                <h1 className="font-bold">{title}</h1>
                <h1 className="">{subtitle}</h1>
            </div>
            <div className="mt-12 mb-16 w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-1 gap-10 justify-between">
                <Card className="w-[100%] col-span-1 md:col-span-2 lg:col-span-1">
                    <CircularProgress 
                        percentage={75} 
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
            <div className="w-full mt-8 mb-10 flex flex-col justify-center lg:flex-row gap-14 lg:gap-16">
                <div className="w-[100%] lg:w-[60%] flex flex-col items-center justify-start gap-8 shadow-sm rounded-2xl">
                    <h1 className="mr-auto font-bold text-3xl">Deliverables</h1>
                    <Carousel className="w-full h-full">
                        <CarouselContent className=''>
                            {CourseInfo.gradingSchemes.map((scheme, index) => (
                                    <CarouselItem className="rounded-2xl border border-slate-200 bg-card text-card-foreground" key={index}>
                                        <h1 className="m-auto text-center py-5 text-lg font-medium">{scheme.schemeName}</h1>
                                        <div className='flex flex-row justify-end -top-14 pr-6 relative'>
                                            <Button className='ml-auto '>+ Add Deliverable</Button>
                                        </div>
                                        <div className="w-full h-[28.6rem] overflow-y-auto" >
                                            <Table className="my-4">
                                                <TableHeader>
                                                    <TableRow>  
                                                        <TableHead className="text-center">Name</TableHead>
                                                        <TableHead className="text-center">Due Date</TableHead>
                                                        <TableHead className="text-center">Weight</TableHead>
                                                        <TableHead className="text-center">Grade</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                {scheme.assessments.map((assessment) => {
                                                    return (
                                                            <TableRow key={assessment.assessmentName} className="">
                                                                <TableCell className="text-center">{assessment.assessmentName}</TableCell>
                                                                <TableCell className="text-center">{assessment.dueDate}</TableCell>
                                                                <TableCell className="text-center">{assessment.weight}</TableCell>
                                                                <TableCell className="text-center"> 
                                                                <Input
                                                                    type="number"
                                                                    value={0}
                                                                    onChange={(e) => console.log(e.target.value)}
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
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                <div className="w-[100%] lg:w-[40%] flex flex-col items-center justify-start gap-8">
                    <h1 className="mr-auto font-bold text-3xl">Course Calendar</h1>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-2xl border w-full"
                    />
                </div>
            </div>
        </div>
     );
}
 
export default CoursePage;
