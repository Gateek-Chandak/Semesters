/*
Things left to do:
- Add Deliverable Button
- Edit Deliverable Buttons
- Maybe hover over events in calendar and pop up modal
- upload pdf in top right
*/

import { useState, useEffect } from 'react';
import { addHours } from 'date-fns';
import { v4 as uuid } from 'uuid'
import { ChangeEvent } from 'react';
import { format } from 'date-fns'

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
import { useParams } from 'react-router-dom';

type IncomingAssessments = {
    assessmentName: string,
    weight: number,
    dueDate: string | null
}

type IncomingScheme = {
    schemeName: string,
    assessments: IncomingAssessments[]
}

type IncomingCourseInfo = {
    courseTitle: string,
    courseSubtitle: string,
    gradingSchemes: IncomingScheme[]
}

type CalendarEvent = {
  id: string;
  start: Date | null | string;
  end: Date | null | string;
  title: string;
  color?: 'green' | 'default' | 'blue' | 'pink' | 'purple' | undefined;
};

type Assessment = {
    assessmentName: string,
    dueDate: string | null | Date,
    weight: number,
    grade: null | number
}

type GradingScheme = {
    schemeName: string,
    course: string,
    grade: number,
    assessments: Assessment[]
}

const CoursePage = ( data: any ) => {

    const CourseInfo: IncomingCourseInfo = {
        "courseTitle": 'CFM 101',
        "courseSubtitle": 'Introduction to Financial Data Analytics',
        "gradingSchemes": [
            {
                "schemeName": "Grading Scheme 1",
                "assessments": [
                    {
                        "assessmentName": "Assignment 1",
                        "weight": 4,
                        "dueDate": "2024-09-17"
                    },
                    {
                        "assessmentName": "Assignment 2",
                        "weight": 4,
                        "dueDate": "2024-09-24"
                    },
                    {
                        "assessmentName": "Assignment 3",
                        "weight": 4,
                        "dueDate": "2024-10-01"
                    },
                    {
                        "assessmentName": "Assignment 4",
                        "weight": 4,
                        "dueDate": "2024-10-11"
                    },
                    {
                        "assessmentName": "Assignment 5",
                        "weight": 4,
                        "dueDate": "2024-10-29"
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
                        "weight": 4,
                        "dueDate": "2024-09-17"
                    },
                    {
                        "assessmentName": "Assignment 2",
                        "weight": 4,
                        "dueDate": "2024-09-24"
                    },
                    {
                        "assessmentName": "Assignment 3",
                        "weight": 4,
                        "dueDate": "2024-10-01"
                    },
                    {
                        "assessmentName": "Assignment 4",
                        "weight": 4,
                        "dueDate": "2024-10-11"
                    },
                    {
                        "assessmentName": "Assignment 5",
                        "weight": 4,
                        "dueDate": "2024-10-29"
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

    let { term , course} = useParams()
    if (course) {
        course = course.replace(/-/g, ' ').toUpperCase();  // Join the words back together
    }
    if (term) {
        term = term
            .replace('-', ' ') // Replace '-' with a space
            .toLowerCase()     // Convert the string to lowercase
            .split(' ')        // Split the string into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
            .join(' ');        // Join the words back together
    }

    
    const [courseSubtitle, setCourseSubtitle] = useState<string | null>(null)
    const [courseColour, setCourseColour] = useState<string>('black')

    const grades = [100, 90, 80, 70, 60, 50]

    const [isEditing, setIsEditing] = useState<boolean>(false)

    const [gradingSchemes, setGradingSchemes] = useState<GradingScheme[]>([])
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])

    const [highestCourseGrade, setHighestCourseGrade] = useState<number>(0)
    const [targetGrade, setTargetGrade] = useState<number | null>(null)
    const [gradeNeeded, setGradeNeeded] = useState<number | null>(null)
    const [minGradePossible, setMinGradePossible] = useState<number>(0)
    const [maxGradePossible, setMaxGradePossible] = useState<number>(100)

    const formatNewGradingScheme = (courseInfo: IncomingCourseInfo) => {
        return courseInfo.gradingSchemes.map((scheme) => ({
            schemeName: scheme.schemeName,
            course: course,
            grade: 0,
            assessments: scheme.assessments.map((assessment) => ({
                assessmentName: assessment.assessmentName,
                dueDate: assessment.dueDate,
                weight: assessment.weight,
                grade: null,
            })),
        }));
    };
    
    const formatNewCalendarEvents = (courseInfo: IncomingCourseInfo) => {
        return courseInfo.gradingSchemes[0].assessments
            .filter((assessment) => assessment.dueDate) // Filter out assessments with no dueDate
            .map((assessment) => ({
                id: uuid(),
                start: new Date(assessment.dueDate),
                end: addHours(new Date(assessment.dueDate), 0.5), // Add 2 hours to create the end time
                title: assessment.assessmentName,
                color: 'green' as CalendarEvent["color"], // Assign a default color or make dynamic
                course: course
            }));
    };
    
    const updateAssessmentName = (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => {
        const inputValue = e.target.value.trim().slice(0, 25);
    
        // Update the gradingSchemes state to reflect the new assessment name
        const updatedSchemes = gradingSchemes.map((scheme) => {
            const updatedAssessments = scheme.assessments.map((assessment) => {
                if (assessment.assessmentName === assessmentName) {
                    return { ...assessment, assessmentName: inputValue }; // Update the assessment name
                }
                return assessment;
            });
    
            return {
                ...scheme,
                assessments: updatedAssessments,
            };
        });
    
        setGradingSchemes(updatedSchemes); // Save the updated schemes in the state
    };
    
    const updateAssessmentDueDate = (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => {
        const inputValue = e.target.value.trim();
        const updatedSchemes = gradingSchemes.map((scheme) => {
            const updatedAssessments = scheme.assessments.map((assessment) => {
            if (assessment.assessmentName === assessmentName) {
                return { ...assessment, dueDate: inputValue }; // Update due date
            }
            return assessment;
            });
            return {
                ...scheme,
                assessments: updatedAssessments,
            };
        });

        setGradingSchemes(updatedSchemes);
    };

    const updateAssessmentWeight = (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => {
        const inputValue = parseFloat(e.target.value.trim());
        let updatedSchemes;

        if (inputValue > 100) {
            return;
        }
    
        // If input is not a valid number, set weight to 0
        if (isNaN(inputValue)) {
            updatedSchemes = gradingSchemes.map((scheme) => {
                const updatedAssessments = scheme.assessments.map((assessment) => {
                    if (assessment.assessmentName === assessmentName) {
                        return { ...assessment, weight: 0 }; // Set weight to 0
                    }
                    return assessment;
                });
                return {
                    ...scheme,
                    assessments: updatedAssessments,
                };
            });
        } else {
            // If input is valid, update the weight
            updatedSchemes = gradingSchemes.map((scheme) => {
                const updatedAssessments = scheme.assessments.map((assessment) => {
                    if (assessment.assessmentName === assessmentName) {
                        return { ...assessment, weight: inputValue }; // Update weight
                    }
                    return assessment;
                });
                return {
                    ...scheme,
                    assessments: updatedAssessments,
                };
            });
        }
        console.log(updatedSchemes)
        // Recalculate grades based on updated weights
        updatedSchemes = updatedSchemes.map((scheme) => {
            let totalGrade = 0;
            let totalWeight = 0;
    
            const updatedAssessments = scheme.assessments.map((assessment) => {
                // Calculate the total grade and weight for completed assessments
                if (assessment.grade !== null && assessment.grade !== undefined) {
                    totalGrade += (assessment.grade * assessment.weight) / 100;
                    totalWeight += assessment.weight;
                }
                return assessment;
            });
    
            // Calculate final grade, scaled to completed assessments
            const finalGrade = totalWeight > 0 ? (totalGrade / Math.min(100, totalWeight)) * 100 : 0;
            console.log(finalGrade)
            return {
                ...scheme,
                assessments: updatedAssessments,
                grade: parseFloat(finalGrade.toFixed(2)), // Round to 2 decimal places
            };
        });
    
        setGradingSchemes(updatedSchemes);

        if (targetGrade) {
            gradeButtonAction(targetGrade, updatedSchemes);
        }
    };
    
    const updateGrade = (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => {
        const inputValue = e.target.value.trim();
        const parsedValue = inputValue === "" ? null : parseFloat(parseFloat(inputValue).toFixed(2));
    
        // Exit early for invalid numbers or out-of-range values
        if (parsedValue !== null && (isNaN(parsedValue) || parsedValue > 200 || parsedValue < 0)) {
            return;
        }
    
        // Update gradingSchemes state
        const updatedSchemes = gradingSchemes.map((scheme) => {
            let totalGrade = 0;
            let totalWeight = 0;
    
            const updatedAssessments = scheme.assessments.map((assessment) => {
                // Update the grade for the matching assessment
                if (assessment.assessmentName === assessmentName) {
                    assessment = { ...assessment, grade: parsedValue }; // Assign rounded value or null
                }
    
                // Include only completed assessments in the grade calculation
                if (assessment.grade !== null && assessment.grade !== undefined) {
                    totalGrade += (assessment.grade * assessment.weight) / 100;
                    totalWeight += assessment.weight;
                }
    
                return assessment;
            });
    
            // Ensure totalWeight doesn't exceed 100
            if (totalWeight > 100) {
                totalWeight = 100;
            }
    
            // Calculate final grade, scaled to completed assessments
            const finalGrade = totalWeight > 0 ? (totalGrade / totalWeight) * 100 : 0;
    
            return {
                ...scheme,
                assessments: updatedAssessments,
                grade: parseFloat(finalGrade.toFixed(2)), // Round to 2 decimal places
            };
        });
    
        setGradingSchemes(updatedSchemes);
    
        if (targetGrade) {
            gradeButtonAction(targetGrade, updatedSchemes);
        }
    };
    
    const updateTargetGrade = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();
        const parsedValue = inputValue === "" ? 0 : parseFloat(inputValue);
        
        // Exit early if the input is invalid or out of range
        if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 1000) {
            return;
        }
    
        setTargetGrade(parsedValue);
    
        let minGradeNeeded: number | null = null;
    
        gradingSchemes.forEach((scheme) => {
            const completedAssessments = scheme.assessments.filter(
                (assessment) => assessment.grade !== null
            );
    
            const remainingAssessments = scheme.assessments.filter(
                (assessment) => assessment.grade === null
            );
    
            const remainingWeight = remainingAssessments.reduce(
                (total, assessment) => total + assessment.weight,
                0
            );
    
            // If no remaining weight, we don't need to calculate the required grade
            if (remainingWeight === 0) {
                setGradeNeeded(0);
                return;
            }
    
            const totalWeightAchieved = completedAssessments.reduce(
                (total, assessment) =>
                    total + ((assessment.grade! * assessment.weight) / 100),
                0
            );
    
            const requiredGrade = remainingWeight > 0
                ? ((parsedValue - totalWeightAchieved) / remainingWeight) * 100
                : 0;
    
            // Track the lowest required grade (minimum required grade across all schemes)
            if (minGradeNeeded === null) {
                minGradeNeeded = parseFloat(requiredGrade.toFixed(4));
                console.log(minGradeNeeded)
            } else {
                minGradeNeeded = Math.min(minGradeNeeded, parseFloat(requiredGrade.toFixed(4)));
            }
        });
    
        // Set the lowest grade needed, rounded to 2 decimal places
        if (minGradeNeeded !== null && parseFloat(minGradeNeeded.toFixed(2)) >= 0) {
            setGradeNeeded(parseFloat(minGradeNeeded.toFixed(2)));
        } else if (minGradeNeeded !== null && minGradeNeeded < 0) {
            setGradeNeeded(0)
        }
    };    

    const gradeButtonAction = (grade: number, gradingSchemes: GradingScheme[]) => {
        setTargetGrade(grade)
    
        let minGradeNeeded: number | null = null;
    
        gradingSchemes.forEach((scheme) => {
            const completedAssessments = scheme.assessments.filter(
                (assessment) => assessment.grade !== null
            );
    
            const remainingAssessments = scheme.assessments.filter(
                (assessment) => assessment.grade === null
            );
    
            const remainingWeight = remainingAssessments.reduce(
                (total, assessment) => total + assessment.weight,
                0
            );
    
            // If no remaining weight, we don't need to calculate the required grade
            if (remainingWeight === 0) {
                setGradeNeeded(null);
                return;
            }
    
            const totalWeightAchieved = completedAssessments.reduce(
                (total, assessment) =>
                    total + ((assessment.grade! * assessment.weight) / 100),
                0
            );
    
            const requiredGrade = remainingWeight > 0
                ? ((grade - totalWeightAchieved) / remainingWeight) * 100
                : 0;
    
            // Track the lowest required grade (minimum required grade across all schemes)
            if (minGradeNeeded === null) {
                minGradeNeeded = parseFloat(requiredGrade.toFixed(4));
            } else {
                minGradeNeeded = Math.min(minGradeNeeded, parseFloat(requiredGrade.toFixed(4)));
            }
        });
    
        // Set the lowest grade needed, rounded to 2 decimal places
        if (minGradeNeeded !== null) {
            setGradeNeeded(parseFloat(minGradeNeeded.toFixed(2)));
        }
        if (minGradeNeeded && minGradeNeeded < 0) {
            setGradeNeeded(0)
        }
    }
   
    
    // In your useEffect to set the initial grading schemes
    useEffect(() => {
        // const formattedGradingSchemes = formatGradingScheme(CourseInfo);
        // const formattedCalendarEvents = formatCalendarEvents(CourseInfo);
    
        // setCalendarEvents(formattedCalendarEvents);

        const termData = data.data.find((t) => t.term === term);
        const courseData = termData.courses.find((c: IncomingCourseInfo) => c.courseTitle === course)
        if (courseData) {
            const foundGradingScheme = courseData.gradingSchemes;
            if (foundGradingScheme) {
                setGradingSchemes(foundGradingScheme);
            } else {
                console.warn(`Course "${course}" not found in term "${term}".`);
            }

            setCourseColour(courseData.colour)
            setCourseSubtitle(courseData.courseSubtitle)

            console.log(courseData)
            const calendarEvents = courseData.gradingSchemes[0].assessments
                .filter((assessment: Assessment) => assessment.dueDate)
                .map((assessment: Assessment) => ({
                    id: uuid(),
                    start: new Date(assessment.dueDate),
                    end: addHours(new Date(assessment.dueDate), 0.5), // Add 2 hours to create the end time
                    title: assessment.assessmentName,
                    color: courseData.colour as CalendarEvent["color"], // Assign a default color or make dynamic
                    course: courseData.courseTitle
                }))

            setCalendarEvents(calendarEvents)
        } else {
            console.warn(`Term "${term}" not found.`);
        }

    }, [course, term, data]);

    useEffect(() => {

       const highestGrade = gradingSchemes.reduce((max: number, scheme) => {
            return Math.max(max, scheme.grade);
        }, 0);
 
        setHighestCourseGrade(highestGrade);

        const calculateMinGrade = () => {
            let minGrade = Infinity; // Start with the highest possible value
        
            gradingSchemes.forEach((scheme) => {
                // Calculate the total grade for the scheme by assigning 0 to all grades
                const totalGrade = scheme.assessments.reduce((total, assessment) => {
                    const grade = assessment.grade !== null && assessment.grade !== undefined ? assessment.grade : 0;
                    return total + (grade * assessment.weight) / 100;
                }, 0);
        
                // Determine the scheme's final grade by scaling to the total weight
                const totalWeight = scheme.assessments.reduce((total, assessment) => total + assessment.weight, 0);
                const schemeGrade = totalWeight > 0 ? (totalGrade / totalWeight) * 100 : 0;
        
                // Update minGrade if this scheme's grade is lower
                if (schemeGrade < minGrade) {
                    minGrade = schemeGrade;
                }
            });
        
            // Update the state with the lowest grade
            setMinGradePossible(parseFloat(minGrade.toFixed(2))); // Round to 2 decimal places
        };
         
        const calculateMaxGrade = () => {
            let maxGrade = 0; // Start with the lowest possible value (0)
        
            gradingSchemes.forEach((scheme) => {
                // Calculate the total grade for the scheme by assigning 100 to all grades
                const totalGrade = scheme.assessments.reduce((total, assessment) => {
                    const grade = assessment.grade !== null && assessment.grade !== undefined ? assessment.grade : 100; // Assign 100 to undefined or null grades
                    return total + (grade * assessment.weight) / 100;
                }, 0);
        
                // Determine the scheme's final grade by scaling to the total weight
                const totalWeight = scheme.assessments.reduce((total, assessment) => total + assessment.weight, 0);
                const schemeGrade = totalWeight > 0 ? (totalGrade / totalWeight) * 100 : 0;
        
                // Update maxGrade if this scheme's grade is higher
                if (schemeGrade > maxGrade) {
                    maxGrade = schemeGrade;
                }
            });
        
            // Update the state with the highest grade
            setMaxGradePossible(parseFloat(maxGrade.toFixed(2))); // Round to 2 decimal places
        };

        calculateMinGrade()
        calculateMaxGrade()
    }, [gradingSchemes, highestCourseGrade])


    return ( 
        <div className="w-full h-dvh min-h-fit px-10 pt-14 bg-[#f7f7f7] flex flex-col justify-start items-center overflow-hidden">
            <div className='max-w-[1840px]'>
                <div className="flex flex-row items-center justify-start gap-4 text-3xl">
                    <h1 className={`font-bold text-${courseColour}-600`}>{course}</h1>
                    <h1 className="font-extralight">{courseSubtitle}</h1>
                </div>
                <div className="mt-12 lg:mb-16 w-full h-fit grid grid-cols-1 grid-rows-2 mb-20 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-1 gap-10 justify-between">
                    <Card className="w-[100%] px-6 col-span-1 md:col-span-2 lg:col-span-1">
                        <CircularProgress 
                            percentage={highestCourseGrade} 
                            label="Overall Average"
                            description="You still have 5 deliverables left, which account for 80% of your total grade."
                        />
                    </Card>
                    <Card className="w-[100%] p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Enter Specific Grade (%)</label>
                                <Input type="text" 
                                       value={targetGrade || ""} 
                                       onChange={(e) => updateTargetGrade(e)}
                                       placeholder="%" 
                                       className="w-full" />
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                                {grades.map((grade) => (
                                <Button
                                    key={grade}
                                    className={`p-2 text-center rounded-md border bg-white text-black hover:bg-black hover:text-white active:bg-gray-700`}
                                    onClick={() => gradeButtonAction(grade, gradingSchemes)}
                                >
                                    {grade}%
                                </Button>
                                ))}
                            </div>

                            <h3 className="font-semibold">Desired Average</h3>
                            <p className="text-sm">To get {targetGrade}% in this class, you need to average of <span className='font-bold text-md'>{gradeNeeded}%</span> on everything that's left.</p>
                            <p className='text-xs text-muted-foreground'>*note that this value is an approximation using worst case scenario</p>
                        </div>
                    </Card>
                    <Card className="w-[100%] pt-6 px-6 flex flex-col justify-center gap-10">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row">
                                <h1 className="mr-auto text-xl font-medium">Minimum</h1>
                                <h1 className="ml-auto text-xl font-medium">{minGradePossible}%</h1>
                            </div>
                            <p className="text-md font-light">Assuming that you uninstall LEARN and doom scroll for the rest of the term.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row">
                                <h1 className="mr-auto text-xl font-medium">Maximum</h1>
                                <h1 className="ml-auto text-xl font-medium">{maxGradePossible}%</h1>
                            </div>
                            <p className="text-md font-light">Given that you score 100% on everything remaining.</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">*if multiple grading schemes are availble, metrics will be estimated using worst/best case possibilities respectively.</p>
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
                                            <div className='ml-auto flex flex-row justify-end -top-14 pr-6 relative gap-3'>
                                                <Button className='px-5 bg-white text-black border-2 border-black hover:bg-gray-100'
                                                        onClick={() => setIsEditing(!isEditing)}
                                                        >
                                                        {isEditing ? "Save Changes" : "Edit"}
                                                </Button>
                                                {/* {isEditing && <Button className=''>Dicard Changes</Button>} */}
                                                {!isEditing && <Button className=''>+ Add New Deliverable</Button>}
                                            </div>
                                            <div className="w-full h-[33.5rem] overflow-y-auto" >
                                                <Table className="my-4">
                                                    <TableHeader className=''>
                                                        <TableRow className=''>  
                                                            <TableHead className="text-center">Name</TableHead>
                                                            <TableHead className="text-center">Due Date</TableHead>
                                                            <TableHead className="text-center">Weight</TableHead>
                                                            <TableHead className="text-center">Grade</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className=''>
                                                        {scheme.assessments.map((assessment) => {
                                                            if (!isEditing) {
                                                                return (
                                                                    <TableRow key={assessment.assessmentName} className="">
                                                                        <TableCell className="text-center">{assessment.assessmentName}</TableCell>
                                                                        <TableCell className="text-center">
                                                                        {assessment.dueDate 
                                                                            ? format(new Date(assessment.dueDate), 'yyyy-MM-dd @ HH:mm') 
                                                                            : 'TBD'}
                                                                        </TableCell>
                                                                        <TableCell className="text-center">{assessment.weight}</TableCell>
                                                                        <TableCell className="text-center"> 
                                                                        <Input
                                                                            type="number"
                                                                            value={(assessment.grade === 0 || assessment.grade) ? assessment.grade : ""}
                                                                            onWheel={(e) => e.currentTarget.blur()}
                                                                            onChange={(e) => updateGrade(e, assessment.assessmentName)}
                                                                            placeholder="00"
                                                                            className="w-20 p-2 my-3 inline"
                                                                            />{" "}
                                                                            %
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            } else {
                                                                return (
                                                                    <TableRow key={assessment.assessmentName} className="">
                                                                        <TableCell className="text-center">
                                                                            <Input type="text" value={assessment.assessmentName} onChange={(e) => updateAssessmentName(e, assessment.assessmentName)}/>
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Input type="text" value={assessment.dueDate ? assessment.dueDate : 'TBD'} onChange={(e) => updateAssessmentDueDate(e, assessment.assessmentName)}/>
                                                                        </TableCell>
                                                                        <TableCell className="text-center">
                                                                            <Input type="text" value={assessment.weight} onChange={(e) => updateAssessmentWeight(e, assessment.assessmentName)}/>
                                                                        </TableCell>
                                                                        <TableCell className="text-center"> 
                                                                            <Input
                                                                                type="number"
                                                                                value={(assessment.grade === 0 || assessment.grade) ? assessment.grade : ""}
                                                                                onWheel={(e) => e.currentTarget.blur()}
                                                                                onChange={(e) => updateGrade(e, assessment.assessmentName)}
                                                                                placeholder="00"
                                                                                className="w-20 p-2 my-3 inline"
                                                                                />{" "}
                                                                                %
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            }
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
            
        </div>
     );
}
 
export default CoursePage;

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