/*
Things left to do:
- Add Deliverable Button
- Edit Deliverable Buttons (edit due date and name doesnt work)
- Maybe hover over events in calendar and pop up modal
- upload pdf in top right
- fix wording for desired average if its not possible to attain a grade
*/
import { useState, useEffect } from 'react';
import { addHours } from 'date-fns';
import { v4 as uuid } from 'uuid'
import { ChangeEvent } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { CircularProgress } from '@/components/coursePageCards/CircularProgessBar';
import { useParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDispatch } from 'react-redux';
import { updateCourse } from "@/redux/slices/dataSlice";

import { CalendarEvent, Course, GradingScheme } from '@/types/mainTypes';

import GradingSchemeCarouselItem from '@/components/coursePageCards/GradingSchemeCarouselItem';
import AddDeliverablePopup from '@/components/coursePageCards/AddDeliverablePopup';
import AddSchemePopup from '@/components/coursePageCards/AddSchemePopup';

const CoursePage = () => {

    const dispatch = useDispatch()
    const isMobile = useIsMobile()

    const data = useSelector((state: RootState) => state.data.data);

    let { term , course } = useParams()
    course = course?.replace('-', ' '); 
    term = term?.replace('-', ' ')

    const termData = data.find((t) => t.term.toLowerCase() === term?.toLowerCase());
    // const termIndex = data.findIndex((t) => t.term.toLowerCase() === term?.toLowerCase())
    const courseData = termData?.courses.find((c: Course) => c.courseTitle.toLowerCase() === course?.toLowerCase())
    const courseIndex = termData?.courses.findIndex((c) => c.courseTitle.toLowerCase() === courseData?.courseTitle.toLowerCase())
    let calendarEvents: CalendarEvent[] | undefined = undefined
    if (courseData && courseData.gradingSchemes.length > 0) {
        const uniqueAssessments = new Set();
        calendarEvents = courseData.gradingSchemes.flatMap((scheme) =>
            scheme.assessments
                .filter((assessment) => assessment.dueDate !== null) // Filter out assessments with null dueDate
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
                    //@ts-expect-error calendar expects Date but I can only give Date | null
                    start: new Date(assessment.dueDate),
                    //@ts-expect-error calendar expects Date but I can only give Date | null
                    end: addHours(new Date(assessment.dueDate), 1),
                    title: assessment.assessmentName,
                    course: courseData.courseTitle,
                    color: courseData.colour,
                }))
        );
        
    }

    const [isAddingScheme, setIsAddingScheme] = useState<boolean>(false)
    const [isAddingDeliverable, setIsAddingDeliverable] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [highestCourseGrade, setHighestCourseGrade] = useState<number>(0)
    const [targetGrade, setTargetGrade] = useState<number | null>(null)
    const [gradeNeeded, setGradeNeeded] = useState<number | null>(null)
    const [minGradePossible, setMinGradePossible] = useState<number>(0)
    const [maxGradePossible, setMaxGradePossible] = useState<number>(100)
    const grades = [100, 90, 80, 70, 60, 50]

    useEffect(() => {
        if (isAddingDeliverable || isAddingScheme) {
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
    }, [isAddingDeliverable, isAddingScheme]);

    useEffect(() => {
      
        const calculateMinGrade = () => {
            let minGrade = Infinity; // Start with the highest possible value
        
            courseData?.gradingSchemes.forEach((scheme) => {
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
            if (minGrade != Infinity) {
                setMinGradePossible(parseFloat(minGrade.toFixed(2)))
            } else {
                setMinGradePossible(0)
            }
        };  
        const calculateMaxGrade = () => {
            let maxGrade = 0; // Start with the lowest possible value (0)
        
            courseData?.gradingSchemes.forEach((scheme) => {
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
        if (courseData && courseData.gradingSchemes.length > 0 && courseData.gradingSchemes[0].assessments.length > 0) {
            determineHighestGrade(courseData?.gradingSchemes)
        }
        calculateMinGrade()
        calculateMaxGrade()
    }, [courseData])

    const determineHighestGrade = (updatedSchemes: GradingScheme[]) => {
        if (courseData) {
            const highestGrade = updatedSchemes.reduce((max: number, scheme) => {
                return Math.max(max, scheme.grade);
            }, 0);

            setHighestCourseGrade(highestGrade);
            return highestGrade           
        }
    }

    const updateTargetGrade = (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim();
        const parsedValue = inputValue === "" ? 0 : parseFloat(inputValue);
        
        // Exit early if the input is invalid or out of range
        if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 1000) {
            return;
        }
    
        setTargetGrade(parsedValue);
    
        let minGradeNeeded: number | null = null;
        
        courseData?.gradingSchemes.forEach((scheme) => {
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
                minGradeNeeded = requiredGrade
            } else {
                minGradeNeeded = Math.min(minGradeNeeded, parseFloat(requiredGrade.toFixed(2)));
            }
        });
    
        // Set the lowest grade needed, rounded to 2 decimal places
        if (minGradeNeeded !== null && minGradeNeeded >= 0) {
            setGradeNeeded(parseFloat(minGradeNeeded));
        } else if (minGradeNeeded !== null && minGradeNeeded < 0) {
            setGradeNeeded(0);
        }
    };    

    const gradeButtonAction = (grade: number) => {
        setTargetGrade(grade)

        if (courseData && courseData.gradingSchemes.length <= 0) {
            return;
        }
    
        let minGradeNeeded: number | null = null;
    
        courseData?.gradingSchemes.forEach((scheme) => {
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
                minGradeNeeded = Math.min(minGradeNeeded, parseFloat(requiredGrade.toFixed(2)));
            }
        });
    
        // Set the lowest grade needed, rounded to 2 decimal places
        if (minGradeNeeded !== null) {
            setGradeNeeded(parseFloat(minGradeNeeded));
        }
        if (minGradeNeeded && minGradeNeeded < 0) {
            setGradeNeeded(0)
        }
    }

    const updateGrade = (e: ChangeEvent<HTMLInputElement>, assessmentName: string) => {
        const inputValue = e.target.value.trim();
        const parsedValue = inputValue === "" ? null : parseFloat(parseFloat(inputValue).toFixed(2));

        // Exit early for invalid numbers or out-of-range values
        if (parsedValue !== null && (isNaN(parsedValue) || parsedValue > 999 || parsedValue < 0)) {
            return;
        }

        // Update gradingSchemes state
        if (courseData) {
            const updatedSchemes = courseData.gradingSchemes.map((scheme) => {
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

            if (term && (courseIndex === 0 || courseIndex) && courseData) {
                const newHighestGrade = determineHighestGrade(updatedSchemes)
                if (newHighestGrade) {
                    dispatch(updateCourse({
                        term: term,
                        courseIndex: courseIndex,
                        course: {
                            courseTitle: courseData.courseTitle,
                            courseSubtitle: courseData.courseSubtitle,
                            colour: courseData.colour,
                            highestGrade: newHighestGrade,
                            gradingSchemes: updatedSchemes
                        }
                    }))
                }   
            }
            
        
            if (targetGrade) {
                gradeButtonAction(targetGrade);
            }
        }
    };

    const handleAddSchemeButton = () => {
        setIsAddingScheme(prev => !prev)
    }

    return ( 

        <div className="w-full h-dvh min-h-fit px-10 pt-10 bg-[#f7f7f7] flex flex-col justify-start items-center overflow-hidden">
            <div className='max-w-[1840px] w-full'>
                <div>   
                    <div className="w-[100%] flex flex-row items-center justify-start gap-4 text-2xl">
                        <h1 className={`font-bold text-${courseData?.colour}-600`}>{courseData?.courseTitle}</h1>
                        <h1 className="font-extralight">{courseData?.courseSubtitle}</h1>
                    </div>
                    <div className="lg:h-[20rem] mt-12 lg:mb-16 w-full flex flex-col lg:flex-row mb-20 gap-4 justify-between">
                        <Card className="w-[100%] px-6">
                            <CircularProgress 
                                percentage={highestCourseGrade} 
                                label="Overall Average"
                                description=""//"You still have 5 deliverables left, which account for 80% of your total grade."
                            />
                            <p className='text-xs text-center mb-4 text-muted-foreground'>*note that this is an approximation, users must consult official school sources.</p>
                        </Card>
                        <Card className="w-[100%] px-6 py-4">
                            <div className="flex flex-col gap-3 justify-center">
                                <div className="flex flex-col gap-2 justify-center">
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
                                        className={`!text-xs text-center rounded-md border bg-white text-black hover:bg-black hover:text-white active:bg-gray-700`}
                                        onClick={() => gradeButtonAction(grade)}
                                    >
                                        {grade}%
                                    </Button>
                                    ))}
                                </div>

                                <h3 className="font-semibold text-sm">Desired Average</h3>
                                <p className="text-xs">To get {targetGrade}% in this class, you need to average of <span className='font-bold text-xs'>{gradeNeeded}%</span> on everything that's left.</p>
                                <p className='text-xs text-muted-foreground'>*note that this value is an approximation using worst case scenario</p>
                            </div>
                        </Card>
                        <Card className="w-[100%] py-6 px-6 flex flex-col justify-center items-start gap-10 col-span-1">
                            <div className="w-full flex flex-col gap-2">
                                <div className="flex flex-row justify-between">
                                    <h1 className="mr-auto text-md font-medium">Minimum</h1>
                                    <h1 className="ml-auto text-md font-medium">{minGradePossible}%</h1>
                                </div>
                                <p className="text-sm font-light">Assuming that you uninstall LEARN and doom scroll for the rest of the term.</p>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <div className="flex flex-row justify-between">
                                    <h1 className="mr-auto text-md font-medium">Maximum</h1>
                                    <h1 className="ml-auto text-md font-medium">{maxGradePossible}%</h1>
                                </div>
                                <p className="text-sm font-light">Given that you score 100% on everything remaining.</p>
                            </div>
                            <p className="text-xs text-muted-foreground">*if multiple grading schemes are availble, metrics will be estimated using worst/best case possibilities respectively.</p>
                        </Card>
                    </div>
                </div>
                <div className={`h-fit w-full mt-8 mb-10 flex ${isMobile ? 'flex-col' : 'flex-row'} justify-center gap-14 lg:gap-16`}>
                    <div className={`${isMobile ? 'w-[100%]' : 'w-[55%]'} flex flex-col items-center justify-start gap-8 rounded-2xl`}>
                        <h1 className="mr-auto text-2xl font-light">Deliverables</h1>
                        <Carousel className="w-full shadow-md border border-slate-200 rounded-2xl">
                            <CarouselContent className=''>
                                {courseData && (courseData.gradingSchemes.length > 0) && courseData.gradingSchemes.map((scheme, index) => (
                                    <GradingSchemeCarouselItem  key={index}
                                                                isEditing={isEditing}
                                                                setIsEditing={setIsEditing}
                                                                scheme={scheme}
                                                                targetGrade={targetGrade}
                                                                gradeButtonAction={gradeButtonAction}
                                                                term={term ? term : ""}
                                                                courseIndex={(courseIndex === 0 || courseIndex) ? courseIndex : -1}
                                                                courseData={courseData}
                                                                updateGrade={updateGrade}
                                                                setIsAddingDeliverable={setIsAddingDeliverable}
                                                                setIsAddingScheme={setIsAddingScheme}/>
                                    
                                    
                                ))}
                                {courseData && (courseData.gradingSchemes.length <= 0) && 
                                    <CarouselItem className='min-h-[41rem] bg-card rounded-xl border border-slate-200'>
                                        <div className='ml-auto flex flex-row justify-end pr-6 relative py-6 gap-3'>                               
                                            {!isEditing && <Button variant={'default'} className='' onClick={handleAddSchemeButton}>+ Add New Grading Scheme</Button>}
                                        </div>
                                        <h1 className='text-2xl font-light text-center mt-52'>No Deliverables Found.</h1>
                                    </CarouselItem>}
                            </CarouselContent>
                            {courseData && (courseData.gradingSchemes.length > 1) && <CarouselPrevious />}
                            {courseData && (courseData.gradingSchemes.length > 1) &&<CarouselNext /> }
                        </Carousel>
                    </div>
                    {/* Calendar Component */}
                    <div className={`${isMobile ? 'w-[100%]' : 'w-[45%]'} flex flex-col items-center justify-start overflow-auto gap-8 rounded-xl`}>
                        <h1 className="mr-auto text-2xl font-light">Course Calendar</h1>
                        <Calendar
                            //@ts-expect-error calendar expects Date but I can only give Date | null
                            events={calendarEvents}
                            >
                            <div className="min-h-[35rem] max-h-[35rem] w-full bg-card rounded-xl py-6 flex flex-col border border-slate-200 shadow-md">
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
            {courseData && <AddDeliverablePopup term={term ? term : ""} 
                                 courseIndex={(courseIndex === 0 || courseIndex) ? courseIndex : -1}
                                 courseData={courseData} 
                                 isAddingDeliverable={isAddingDeliverable} 
                                 setIsAddingDeliverable={setIsAddingDeliverable} />}
            {courseData && <AddSchemePopup term={term ? term : ""} 
                                 courseIndex={(courseIndex === 0 || courseIndex) ? courseIndex : -1}
                                 courseData={courseData} 
                                 isAddingScheme={isAddingScheme} 
                                 setIsAddingScheme={setIsAddingScheme} />}
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